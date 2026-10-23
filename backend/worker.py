"""Isolated Anki core JSONL service with exclusive background sync jobs.

Only --data-dir/collection.anki2 is opened. stdout is exclusively protocol data;
both Python and native core diagnostics are redirected to stderr.
review.next without deckId keeps the native selected deck (including its
subdecks), NOT all decks. status.selectedDeckId exposes that selection.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import html
import json
import os
from pathlib import Path
import re
import secrets
import sys
import tempfile
import time
import traceback
import zipfile


class RequestError(Exception):
    def __init__(self, code, message):
        self.code, self.message = code, message
        super().__init__(message)


def invalid(message):
    raise RequestError("VALIDATION_ERROR", message)


def reparse_path(path):
    try:
        return (path.is_symlink() or bool(getattr(path.lstat(), "st_file_attributes", 0) & 0x400))
    except FileNotFoundError:
        return False


def integer(value, name, minimum=1, maximum=2**53 - 1):
    if type(value) is not int or not minimum <= value <= maximum:
        invalid(f"{name} must be an integer between {minimum} and {maximum}")
    return value


def text(value, name, maximum=10000, empty=False):
    if not isinstance(value, str) or len(value) > maximum or "\x00" in value:
        invalid(f"{name} must be a string of at most {maximum} characters without NUL")
    if not empty and not value.strip():
        invalid(f"{name} must not be empty")
    return value


class LifetimeLock:
    """Advisory OS lock, released by OS on process exit (including crashes)."""
    def __init__(self, path):
        self.file = None
        if path.is_symlink() or (path.exists() and not path.is_file()):
            raise RequestError("UNSAFE_PATH", "Unsafe worker lock path")
        stream = open(path, "a+b")
        try:
            stream.seek(0, os.SEEK_END)
            if stream.tell() == 0:
                stream.write(b" ")
                stream.flush()
            stream.seek(0)
            if os.name == "nt":
                import msvcrt
                msvcrt.locking(stream.fileno(), msvcrt.LK_NBLCK, 1)
            else:
                import fcntl
                fcntl.flock(stream.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError:
            # Windows denies reads overlapping another process' locked byte.
            stream.seek(1)
            try:
                diagnostic = stream.read(256).decode("utf-8", "replace").strip()
            except OSError:
                diagnostic = "owner unknown"
            stream.close()
            raise RequestError("COLLECTION_LOCKED", f"Data directory is in use ({diagnostic or 'owner unknown'})")
        self.file = stream
        stream.seek(1)
        stream.write(f"pid={os.getpid()} started={int(time.time())}\n".encode())
        stream.truncate()
        stream.flush()

    def close(self):
        if self.file:
            self.file.close()
            self.file = None


# Exact accepted parameter sets. Unknown keys are rejected, including path overrides.
PARAMS = {
    "status": set(), "decks.list": set(), "decks.create": {"name"},
    "decks.rename": {"deckId", "name"}, "models.list": set(),
    "decks.delete.preview": {"deckId"}, "decks.delete": {"token", "confirmName"},
    "notes.search": {"query", "offset", "limit"}, "notes.get": {"noteId"},
    "notes.add": {"deckId", "modelId", "fields", "tags"},
    "notes.update": {"noteId", "fields", "tags", "expectedModified"},
    "cards.suspend": {"cardIds", "suspend"}, "review.next": {"deckId"},
    "review.reveal": {"token"}, "review.answer": {"token", "rating"},
    "review.undo": set(), "import.apkg": {"filename"},
    "export.apkg": {"deckId", "filename"}, "media.get": {"filename"},
    "review.discard": set(),
    "sync.status": set(), "sync.run": set(), "sync.cancel": set(),
    "account.login": {"username", "password"}, "account.logout": set(),
    "sync.configure": {"autoSync"}, "sync.confirm": {"token", "direction"},
    "sync.dismiss": set(),
}


def validate_apkg(path):
    """Read-only archive preflight. Bounds ZIP *and inner Zstandard* expansion.

    Zstd block decoded size cannot exceed min(window size, 128 KiB), so
    counting blocks bounds unknown-content-size streaming frames without an
    extra decompression dependency. Native Anki still validates actual content.
    """
    max_archive = 256 * 1024 * 1024
    max_entry = 256 * 1024 * 1024
    max_total = 1024 * 1024 * 1024
    if path.stat().st_size > max_archive:
        raise RequestError("ARCHIVE_TOO_LARGE", "Archive exceeds 256 MB")

    def reject(message):
        raise RequestError("INVALID_ARCHIVE", message)

    def zstd_bound(stream, magic):
        total = 0
        while magic:
            if magic != b"\x28\xb5\x2f\xfd":
                reject("Unsupported or concatenated non-Zstandard data")
            def exact(size):
                value = stream.read(size)
                if len(value) != size:
                    reject("Truncated Zstandard frame")
                return value
            descriptor = exact(1)[0]
            if descriptor & 0x18:
                reject("Reserved Zstandard header bits")
            single = bool(descriptor & 0x20)
            if not single:
                wd = exact(1)[0]
                base = 1 << (10 + (wd >> 3))
                window = base + (base >> 3) * (wd & 7)
            dictionary_size = (0, 1, 2, 4)[descriptor & 3]
            exact(dictionary_size)
            size_flag = descriptor >> 6
            content_size_bytes = (1 if single else 0, 2, 4, 8)[size_flag]
            content_size = int.from_bytes(exact(content_size_bytes), "little") if content_size_bytes else None
            if content_size_bytes == 2:
                content_size += 256
            if single:
                window = content_size
            if window > 128 * 1024 * 1024:
                raise RequestError("ARCHIVE_TOO_LARGE", "Zstandard window exceeds 128 MB")
            if content_size is not None and content_size > max_entry:
                raise RequestError("ARCHIVE_TOO_LARGE", "Archive entry exceeds 256 MB decoded")
            while True:
                header = int.from_bytes(exact(3), "little")
                last, kind, size = header & 1, (header >> 1) & 3, header >> 3
                if kind == 3 or size > 128 * 1024:
                    reject("Invalid Zstandard block")
                exact(1 if kind == 1 else size)
                total += min(window, 128 * 1024) if kind == 2 else size
                if total > max_entry:
                    raise RequestError("ARCHIVE_TOO_LARGE", "Zstandard decoded upper bound exceeds 256 MB")
                if last:
                    break
            if descriptor & 4:
                exact(4)
            magic = stream.read(4)
        return total

    try:
        with zipfile.ZipFile(path) as archive:
            entries = archive.infolist()
            if not 1 <= len(entries) <= 10000:
                reject("Archive must contain between 1 and 10000 entries")
            names, zip_total, decoded_total = set(), 0, 0
            modern = any(e.filename == "collection.anki21b" for e in entries)
            for entry in entries:
                name = entry.filename
                if (name in names or not name or re.search(r'[\\/:\x00-\x1f]', name)
                        or name in (".", "..") or entry.is_dir()):
                    reject("Archive entries must have unique safe basenames")
                names.add(name)
                # Only regular file modes (or unspecified DOS modes).
                mode = (entry.external_attr >> 16) & 0o170000
                if mode not in (0, 0o100000) or entry.flag_bits & 1:
                    reject("Archive symlinks, special files and encryption are not allowed")
                if entry.compress_type not in (zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED):
                    reject("Unsupported ZIP compression")
                zip_total += entry.file_size
                if entry.file_size > max_entry or zip_total > max_total:
                    raise RequestError("ARCHIVE_TOO_LARGE", "ZIP expanded size exceeds configured bounds")
                with archive.open(entry) as stream:
                    magic = stream.read(4)
                    if modern and (name in ("collection.anki21b", "media") or name.isdecimal()) and magic != b"\x28\xb5\x2f\xfd":
                        reject("Modern package entries require standard Zstandard framing")
                    if magic == b"\x28\xb5\x2f\xfd":
                        decoded_total += zstd_bound(stream, magic)
                    else:
                        decoded_total += entry.file_size
                        while stream.read(1024 * 1024):
                            pass  # verify decompression and CRC without extracting
                if decoded_total > max_total:
                    raise RequestError("ARCHIVE_TOO_LARGE", "Archive decoded upper bound exceeds 1 GB")
            if not names.intersection({"collection.anki2", "collection.anki21", "collection.anki21b"}):
                reject("Archive has no Anki collection")
    except (zipfile.BadZipFile, RuntimeError, EOFError, NotImplementedError) as error:
        reject("Unreadable ZIP archive: " + str(error))


class Worker:
    def __init__(self, data_dir, packages, language="en"):
        self.root = Path(data_dir).resolve()
        self.packages = packages
        self.language = language
        self.col = None
        self.lock = None
        self.current = None
        self.review_steps = []
        self.deck_delete_confirmation = None
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        from sync_service import SyncManager
        self.sync = SyncManager(self, RequestError)

    def ensure_storage(self):
        self.root.mkdir(parents=True, exist_ok=True)
        if not self.lock:
            self.lock = LifetimeLock(self.owned("worker.lock"))

    def owned(self, name, directory=False):
        """Reject symlink/reparse escapes, including collection and media sidecars."""
        path = self.root / name
        if reparse_path(path) or path.resolve().parent != self.root:
            raise RequestError("UNSAFE_PATH", f"Unsafe owned path: {name}")
        if path.exists() and (path.is_dir() != directory):
            raise RequestError("UNSAFE_PATH", f"Unexpected file type: {name}")
        if path.exists() and not directory and path.stat().st_nlink > 1:
            raise RequestError("UNSAFE_PATH", f"Hard-linked owned file: {name}")
        return path

    def open(self):
        if self.col:
            return
        self.ensure_storage()
        # Native HTTP debug/backtrace logging must never disclose sign-in secrets.
        os.environ["RUST_LOG"] = "off"
        os.environ["RUST_BACKTRACE"] = "0"
        for name in ("collection.anki2", "collection.anki2-wal", "collection.anki2-shm",
                     "collection.media.db2", "collection.media.db2-wal", "collection.media.db2-shm"):
            self.owned(name)
        self.owned("collection.media", directory=True)
        temporary = self.owned("tmp", directory=True)
        temporary.mkdir(exist_ok=True)
        for name in ("imports", "exports", "backups"):
            self.owned(name, directory=True).mkdir(exist_ok=True)
        for key in ("TEMP", "TMP", "TMPDIR"):
            os.environ[key] = str(temporary)
        tempfile.tempdir = str(temporary)
        sys.path.insert(0, self.packages)
        from anki._backend import RustBackend
        from anki.collection import Collection
        self.col = Collection(str(self.root / "collection.anki2"),
                              backend=RustBackend(langs=[self.language, "en"]))
        # Rendering imported [latex] must never execute external programs.
        from anki.config import Config
        self.col.set_config_bool(Config.Bool.RENDER_LATEX, False)
        if not self.col.v3_scheduler():
            self.col.upgrade_to_v2_scheduler()
            self.col.set_v3_scheduler(True)

    def close(self):
        self.sync.close()
        try:
            if self.col:
                self.col.close()
                self.col = None
        finally:
            if self.lock:
                self.lock.close()
                self.lock = None

    def dispatch(self, action, params):
        if not isinstance(action, str) or action not in PARAMS:
            raise RequestError("UNKNOWN_ACTION", "Unknown action")
        if not isinstance(params, dict):
            invalid("params must be an object")
        unknown = set(params) - PARAMS[action]
        if unknown:
            invalid("Unknown parameters: " + ", ".join(sorted(unknown)))
        with self.sync.gate:
            if action in self.sync.ACTIONS:
                return self.sync.handle(action, params)
            if self.sync.active:
                raise RequestError("SYNC_BUSY", "AnkiWeb operation is active; wait or cancel it first")
            self.sync.status()  # expire stale one-time full-sync confirmations
            if self.sync.pending and action not in self.sync.READ_ACTIONS and action != "review.discard":
                raise RequestError("SYNC_CONFIRMATION_REQUIRED", "Confirm or dismiss the pending full sync before editing or reviewing")
            self.open()
            return getattr(self, action.replace(".", "_"))(params)

    def review_discard(self, p):
        self.current = None
        return {"discarded": True}

    def deck(self, value):
        did = integer(value, "deckId")
        deck = self.col.decks.get(did, default=False)
        if not deck:
            raise RequestError("NOT_FOUND", "Deck does not exist")
        return deck

    def model(self, value):
        mid = integer(value, "modelId")
        model = self.col.models.get(mid)
        if not model:
            raise RequestError("NOT_FOUND", "Note type does not exist")
        return model

    def note(self, value):
        return self.col.get_note(integer(value, "noteId"))

    @staticmethod
    def version(note):
        # Native mtime has second resolution. A stable content revision detects
        # rapid same-second edits, without modifying Anki's timestamp or schema.
        raw = json.dumps([note.mod, note.mid, note.fields, note.tags], ensure_ascii=False,
                         separators=(",", ":")).encode("utf-8")
        return int.from_bytes(hashlib.sha256(raw).digest()[:6], "big")

    def serialize_note(self, note):
        cards = note.cards()
        model = note.note_type()
        deck = self.col.decks.name(cards[0].did) if cards else ""
        preview = html.unescape(re.sub("<[^>]*>", "", " · ".join(note.fields)))[:240]
        return {"id": note.id, "model": model["name"], "modelId": note.mid,
                "deck": deck, "fields": dict(note.items()), "tags": note.tags,
                "cards": [{"id": c.id, "deckId": c.did, "suspended": c.queue == -1,
                           "queue": c.queue, "type": c.type, "due": c.due,
                           "interval": c.ivl, "reps": c.reps, "lapses": c.lapses,
                           "ordinal": c.ord} for c in cards],
                "preview": preview, "modified": self.version(note), "modifiedAt": note.mod}

    def decks_list(self, p):
        counts = {}
        def visit(node):
            counts[node.deck_id] = node
            for child in node.children:
                visit(child)
        visit(self.col.sched.deck_due_tree())
        result = []
        for deck in self.col.decks.all_names_and_ids():
            node = counts.get(deck.id)
            result.append({"id": deck.id, "name": deck.name,
                           "newCount": node.new_count if node else 0,
                           "learnCount": node.learn_count if node else 0,
                           "reviewCount": node.review_count if node else 0,
                           "total": node.total_including_children if node else 0})
        return result

    def undo_info(self):
        status = self.col.undo_status()
        can_review = bool(self.review_steps and status.last_step == self.review_steps[-1])
        return {"available": can_review, "name": status.undo, "redo": status.redo,
                "lastStep": status.last_step}

    def status(self, p):
        import anki.buildinfo
        return {"version": anki.buildinfo.version, "collectionPath": self.col.path,
                "noteCount": self.col.note_count(), "cardCount": self.col.card_count(),
                "decks": self.decks_list({}), "undo": self.undo_info(),
                "pid": os.getpid(), "schedulerVersion": 3, "language": self.language,
                "selectedDeckId": self.col.decks.selected(),
                "reviewScope": "selected-deck-and-descendants",
                "mediaPath": str(self.root / "collection.media"),
                "mediaDir": str(self.root / "collection.media"),
                "importsDir": str(self.root / "imports"), "exportsDir": str(self.root / "exports")}

    def invalidate(self):
        self.current = None

    def decks_create(self, p):
        name = text(p.get("name"), "name", 1000).strip()
        did = self.col.decks.add_normal_deck_with_name(name).id
        self.invalidate()
        return next(d for d in self.decks_list({}) if d["id"] == did)

    def decks_rename(self, p):
        deck = self.deck(p.get("deckId"))
        name = text(p.get("name"), "name", 1000).strip()
        self.col.decks.rename(deck["id"], name)
        self.invalidate()
        return next(d for d in self.decks_list({}) if d["id"] == deck["id"])

    def deck_delete_scope(self, deck_id):
        """Read-only preview of native remove_decks_and_child_decks semantics.

        Normal decks delete cards whose did OR odid belongs to the subtree.
        Filtered decks only return their remaining cards to their original decks.
        A note is removed only when every one of its cards is actually deleted.
        """
        root = self.deck(deck_id)
        deck_ids = self.col.decks.deck_and_child_ids(root["id"])
        if 1 in deck_ids:
            raise RequestError("DEFAULT_DECK_PROTECTED", "The default deck cannot be deleted, including through a parent deck")
        decks = [self.deck(did) for did in sorted(deck_ids)]
        normal = {d["id"] for d in decks if not d["dyn"]}
        filtered = {d["id"] for d in decks if d["dyn"]}
        ids = ",".join(str(int(did)) for did in deck_ids)
        normal_ids = ",".join(str(int(did)) for did in sorted(normal)) or "0"
        # Only integer IDs obtained from native decks are interpolated. These
        # are SELECTs only: deletion/restoration is exclusively native below.
        cards = self.col.db.all(
            "select id,nid,did,odid,mod,type,queue,due,ivl,factor,reps,lapses,left,odue,flags,data "
            f"from cards where did in ({ids}) or odid in ({normal_ids}) order by id")
        deleted, returned = [], []
        deleted_per_note = {}
        for card in cards:
            if card[2] in normal or card[3] in normal:
                deleted.append(card)
                deleted_per_note[card[1]] = deleted_per_note.get(card[1], 0) + 1
            elif card[2] in filtered:
                returned.append(card)
        orphaned, notes = [], []
        if deleted_per_note:
            nids = ",".join(str(int(nid)) for nid in sorted(deleted_per_note))
            orphaned = sorted(nid for nid, count in self.col.db.all(
                f"select nid,count(*) from cards where nid in ({nids}) group by nid")
                if count == deleted_per_note[nid])
            notes = self.col.db.all(f"select id,mid,mod,tags,flds from notes where id in ({nids}) order by id")
        summary = {"deckId": root["id"], "name": root["name"], "deckCount": len(decks),
                   "cardCount": len(deleted), "noteCount": len(orphaned),
                   "returnedCardCount": len(returned), "filtered": bool(root["dyn"])}
        # IDs, not just counts: replacing a card/note or moving a same-sized
        # subtree must invalidate consent. Include changed card/note content too.
        snapshot = [[(d["id"], d["name"], bool(d["dyn"])) for d in decks],
                    deleted, returned, orphaned, notes]
        digest = hashlib.sha256(json.dumps(snapshot, ensure_ascii=False, separators=(",", ":")).encode("utf-8")).hexdigest()
        return summary, digest

    def decks_delete_preview(self, p):
        self.deck_delete_confirmation = None
        summary, digest = self.deck_delete_scope(p.get("deckId"))
        token = secrets.token_urlsafe(32)
        self.deck_delete_confirmation = {"token": token, "summary": summary, "digest": digest,
                                         "expires": time.monotonic() + 300}
        return dict(summary, token=token, expiresAt=int(time.time() * 1000) + 300000)

    def decks_delete(self, p):
        # Consume even a failed confirmation; the owner must preview again.
        pending = self.deck_delete_confirmation
        self.deck_delete_confirmation = None
        token = text(p.get("token"), "token", 128)
        if (not pending or pending["expires"] <= time.monotonic()
                or not secrets.compare_digest(token.encode("utf-8"), pending["token"].encode("utf-8"))):
            raise RequestError("STALE_CONFIRMATION", "Deck deletion confirmation is invalid or expired; preview again")
        confirm_name = text(p.get("confirmName"), "confirmName", 10000)
        if confirm_name != pending["summary"]["name"]:
            raise RequestError("CONFIRMATION_MISMATCH", "The confirmation name must match the complete deck name exactly; preview again")
        try:
            summary, digest = self.deck_delete_scope(pending["summary"]["deckId"])
        except RequestError as error:
            if error.code != "NOT_FOUND":
                raise
            raise RequestError("DELETE_SCOPE_CHANGED", "The deck deletion scope has changed; preview again") from None
        if not secrets.compare_digest(digest, pending["digest"]):
            raise RequestError("DELETE_SCOPE_CHANGED", "The deck deletion scope has changed; preview again")
        self.col.decks.remove([summary["deckId"]])
        self.invalidate()
        self.review_steps.clear()
        return dict(summary, deleted=True)

    def models_list(self, p):
        return [{"id": m["id"], "name": m["name"],
                 "fields": [f["name"] for f in m["flds"]], "type": m["type"],
                 "isTypeInAnswer": m["type"] == 0 and any(
                     re.search(r"\{\{\s*type\s*:[^{}]+\}\}", template.get(side, ""), re.IGNORECASE)
                     for template in m["tmpls"] for side in ("qfmt", "afmt"))}
                for m in self.col.models.all()]

    def notes_search(self, p):
        query = text(p.get("query", ""), "query", 10000, empty=True)
        offset = integer(p.get("offset", 0), "offset", 0)
        limit = integer(p.get("limit", 50), "limit", 1, 200)
        ids = sorted(self.col.find_notes(query), reverse=True)
        return {"items": [self.serialize_note(self.col.get_note(nid))
                          for nid in ids[offset:offset + limit]],
                "total": len(ids), "offset": offset, "limit": limit}

    def notes_get(self, p):
        return self.serialize_note(self.note(p.get("noteId")))

    def apply_fields(self, note, fields, allow_empty=False):
        if not isinstance(fields, dict) or (not fields and not allow_empty):
            invalid("fields must be an object of field names and strings (non-empty unless updating tags)")
        for key, value in fields.items():
            if key not in note:
                invalid(f"Unknown field: {key}")
            text(value, f"fields.{key}", 1000000, empty=True)
        for key, value in fields.items():
            note[key] = value

    def tags(self, value):
        if not isinstance(value, list) or len(value) > 1000:
            invalid("tags must be an array of up to 1000 strings")
        for tag in value:
            text(tag, "tag", 1000)
            if any(c.isspace() for c in tag):
                invalid("Each tag must not contain whitespace")
        return value

    def notes_add(self, p):
        deck = self.deck(p.get("deckId"))
        if deck.get("dyn"):
            invalid("Cannot add notes to a filtered deck")
        note = self.col.new_note(self.model(p.get("modelId")))
        self.apply_fields(note, p.get("fields"))
        note.tags = self.tags(p.get("tags", []))
        if not note.fields[0].strip():
            invalid("First field must not be empty")
        if note.note_type()["type"] == 1 and not note.cloze_numbers_in_fields():
            invalid("Cloze note must contain at least one {{c1::...}} deletion")
        self.col.add_note(note, deck["id"])
        self.invalidate()
        return self.serialize_note(self.col.get_note(note.id))

    def notes_update(self, p):
        note = self.note(p.get("noteId"))
        if "expectedModified" in p:
            expected = integer(p["expectedModified"], "expectedModified", 0)
            if expected != self.version(note):
                raise RequestError("CONFLICT", "Note changed; reload before saving")
        self.apply_fields(note, p.get("fields"), allow_empty="tags" in p)
        if "tags" in p:
            note.tags = self.tags(p["tags"])
        if not note.fields[0].strip():
            invalid("First field must not be empty")
        if note.note_type()["type"] == 1 and not note.cloze_numbers_in_fields():
            invalid("Cloze note must contain at least one deletion")
        self.col.update_note(note)
        self.invalidate()
        return self.serialize_note(self.col.get_note(note.id))

    def cards_suspend(self, p):
        ids = p.get("cardIds")
        if not isinstance(ids, list) or not 1 <= len(ids) <= 10000:
            invalid("cardIds must be a non-empty array of at most 10000 IDs")
        ids = list(dict.fromkeys(integer(cid, "cardId") for cid in ids))
        suspend = p.get("suspend", True)
        if type(suspend) is not bool:
            invalid("suspend must be a boolean")
        for cid in ids:
            self.col.get_card(cid)  # validate all before mutation
        if suspend:
            self.col.sched.suspend_cards(ids)
        else:
            self.col.sched.unsuspend_cards(ids)
        self.invalidate()
        return {"cardIds": ids, "suspended": suspend, "count": len(ids)}

    @staticmethod
    def remaining(queue):
        return {"new": queue.new_count, "learn": queue.learning_count,
                "review": queue.review_count,
                "total": queue.new_count + queue.learning_count + queue.review_count}

    def review_next(self, p):
        if "deckId" in p:
            did = self.deck(p["deckId"])["id"]
            if self.col.decks.selected() != did:
                self.col.decks.select(did)
                self.invalidate()
        if self.current:
            return self.current["question"]
        queue = self.col.sched.get_queued_cards(fetch_limit=1)
        if not queue.cards:
            return None
        from anki.cards import Card
        queued = queue.cards[0]
        card = Card(self.col)
        card._load_from_backend_card(queued.card)
        card.start_timer()
        token = secrets.token_urlsafe(24)
        output = card.render_output()
        question = {"token": token, "cardId": card.id, "question": output.question_text,
                    "css": output.css, "deckName": self.col.decks.name(card.did),
                    "remaining": self.remaining(queue)}
        self.current = {"token": token, "card": card, "states": queued.states,
                        "revealed": False, "question": question}
        return question

    def session(self, p):
        token = text(p.get("token"), "token", 256)
        if not self.current or not secrets.compare_digest(self.current["token"], token):
            raise RequestError("STALE_TOKEN", "Review token is not current; request the next card")
        return self.current

    def review_reveal(self, p):
        session = self.session(p)
        intervals = self.col.sched.describe_next_states(session["states"])
        output = session["card"].render_output()
        session["revealed"] = True
        labels = ["Again", "Hard", "Good", "Easy"] if self.language == "en" else ["重来", "困难", "良好", "简单"]
        return {"token": session["token"], "answer": output.answer_text, "css": output.css,
                "buttons": [{"rating": i + 1, "label": labels[i], "interval": intervals[i]}
                            for i in range(4)]}

    def review_answer(self, p):
        session = self.session(p)
        rating = integer(p.get("rating"), "rating", 1, 4)
        if not session["revealed"]:
            raise RequestError("ANSWER_NOT_REVEALED", "Reveal the answer before rating")
        answer = self.col.sched.build_answer(card=session["card"], states=session["states"],
                                             rating=rating - 1)
        self.col.sched.answer_card(answer)
        self.review_steps.append(self.col.undo_status().last_step)
        self.invalidate()
        return {"remaining": self.remaining(self.col.sched.get_queued_cards()),
                "undo": self.undo_info()}

    def review_undo(self, p):
        if not self.undo_info()["available"]:
            raise RequestError("UNDO_UNAVAILABLE", "No immediately undoable review in this worker session")
        self.col.undo()
        self.review_steps.pop()
        self.invalidate()
        return {"remaining": self.remaining(self.col.sched.get_queued_cards()),
                "undo": self.undo_info()}

    def file_in(self, folder, filename, suffix=None, existing=True):
        text(filename, "filename", 255)
        if filename in (".", "..") or re.search(r'[\\/:<>"|?*\x00-\x1f]', filename) or filename.endswith((".", " ")):
            invalid("filename must be a safe basename, not a path")
        if suffix and not filename.lower().endswith(suffix):
            invalid(f"filename must end with {suffix}")
        directory = self.owned(folder, directory=True)
        directory.mkdir(exist_ok=True)
        path = directory / filename
        if path.is_symlink() or path.resolve().parent != directory.resolve():
            raise RequestError("UNSAFE_PATH", "File escapes the owned directory")
        if existing and not path.is_file():
            raise RequestError("NOT_FOUND", "File does not exist")
        if path.exists() and (not path.is_file() or path.stat().st_nlink > 1):
            raise RequestError("UNSAFE_PATH", "Expected a regular non-hard-linked file")
        return path

    def validate_media_directory(self):
        directory = self.owned("collection.media", directory=True)
        if directory.exists():
            for path in directory.iterdir():
                if (reparse_path(path) or path.resolve().parent != directory.resolve()
                        or not path.is_file() or path.stat().st_nlink > 1):
                    raise RequestError("UNSAFE_PATH", "Unsafe existing media entry")

    def import_apkg(self, p):
        path = self.file_in("imports", p.get("filename"), ".apkg")
        validate_apkg(path)
        self.validate_media_directory()
        # Core import is transactional for collection data. A pre-import colpkg
        # backup preserves the original DB; imported media may remain on failure.
        backup = self.owned("backups", directory=True)
        backup.mkdir(exist_ok=True)
        self.col.create_backup(backup_folder=str(backup), force=True, wait_for_completion=True)
        from anki.import_export_pb2 import ImportAnkiPackageRequest, ImportAnkiPackageOptions
        request = ImportAnkiPackageRequest(package_path=str(path), options=ImportAnkiPackageOptions(
            with_scheduling=True, with_deck_configs=True, merge_notetypes=False))
        result = self.col.import_anki_package(request)
        self.invalidate()
        self.review_steps.clear()
        return {"added": len(getattr(result.log, "new")), "updated": len(result.log.updated),
                "duplicate": len(result.log.duplicate), "foundNotes": result.log.found_notes,
                "backupDirectory": str(backup), "noteCount": self.col.note_count(),
                "cardCount": self.col.card_count()}

    def export_apkg(self, p):
        from anki.collection import DeckIdLimit
        from anki.import_export_pb2 import ExportAnkiPackageOptions
        limit = DeckIdLimit(self.deck(p["deckId"])["id"]) if "deckId" in p else None
        self.validate_media_directory()
        filename = p.get("filename", f"anki-{time.strftime('%Y%m%d-%H%M%S')}-{secrets.token_hex(4)}.apkg")
        path = self.file_in("exports", filename, ".apkg", existing=False)
        if path.exists():
            raise RequestError("ALREADY_EXISTS", "Export filename already exists; choose a new name")
        # Core writes a temporary archive then persists; never overwrite an export.
        count = self.col.export_anki_package(out_path=str(path), limit=limit,
                    options=ExportAnkiPackageOptions(with_scheduling=True, with_deck_configs=True,
                                                     with_media=True, legacy=False))
        return {"path": str(path), "filename": path.name, "count": count}

    def media_get(self, p):
        path = self.file_in("collection.media", p.get("filename"))
        types = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                 ".gif": "image/gif", ".webp": "image/webp", ".avif": "image/avif",
                 ".bmp": "image/bmp", ".mp3": "audio/mpeg", ".ogg": "audio/ogg",
                 ".wav": "audio/wav", ".m4a": "audio/mp4", ".aac": "audio/aac",
                 ".flac": "audio/flac", ".opus": "audio/ogg", ".woff": "font/woff",
                 ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf"}
        mime = types.get(path.suffix.lower())
        if not mime:
            raise RequestError("MEDIA_TYPE_NOT_ALLOWED", "Only raster image, audio and font files are allowed")
        if path.stat().st_size > 5 * 1024 * 1024:
            raise RequestError("MEDIA_TOO_LARGE", "Media exceeds 5 MB")
        with path.open("rb") as stream:
            data = stream.read(5 * 1024 * 1024 + 1)
        if len(data) > 5 * 1024 * 1024:
            raise RequestError("MEDIA_TOO_LARGE", "Media exceeds 5 MB")
        return {"mime": mime, "data": base64.b64encode(data).decode("ascii")}


def error_response(request_id, error):
    if isinstance(error, RequestError):
        code, message = error.code, error.message
    else:
        name = type(error).__name__
        code = {"NotFoundError": "NOT_FOUND", "SearchError": "INVALID_QUERY",
                "InvalidInput": "VALIDATION_ERROR", "ExistsError": "ALREADY_EXISTS",
                "TemplateError": "TEMPLATE_ERROR", "UndoEmpty": "UNDO_UNAVAILABLE",
                "DBError": "DATABASE_ERROR", "BackendIOError": "IO_ERROR"}.get(name, "CORE_ERROR")
        message = str(error) or name
        traceback.print_exc(file=sys.stderr)
    return {"id": request_id, "ok": False, "error": {"code": code, "message": message}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", required=True)
    parser.add_argument("--anki-packages", required=True)
    parser.add_argument("--lang", choices=["en", "zh-CN"], default="en")
    args = parser.parse_args()
    if not Path(args.data_dir).is_absolute() or not Path(args.anki_packages).is_absolute():
        parser.error("--data-dir and --anki-packages must be absolute")
    # Keep a private duplicate of the protocol pipe; redirect FD 1 as well as
    # sys.stdout so native/Rust diagnostics cannot corrupt JSONL framing.
    wire = os.fdopen(os.dup(sys.stdout.fileno()), "w", encoding="utf-8", buffering=1, newline="\n")
    sys.stdout.flush()
    os.dup2(sys.stderr.fileno(), sys.stdout.fileno())
    sys.stdout = sys.stderr
    sys.stdin.reconfigure(encoding="utf-8")
    worker = Worker(args.data_dir, str(Path(args.anki_packages).resolve()), args.lang)
    try:
        while True:
            line = sys.stdin.readline(8 * 1024 * 1024 + 1)
            if not line:
                break
            request_id = None
            try:
                if len(line) > 8 * 1024 * 1024:
                    while line and not line.endswith("\n"):
                        line = sys.stdin.readline(65536)
                    invalid("Request exceeds 8 MB")
                try:
                    request = json.loads(line)
                except (json.JSONDecodeError, ValueError):
                    raise RequestError("INVALID_JSON", "Request must be valid JSON")
                if not isinstance(request, dict):
                    invalid("Request must be an object")
                request_id = request.get("id")
                if type(request_id) not in (str, int) or isinstance(request_id, bool):
                    invalid("id must be a string or integer")
                if set(request) - {"id", "action", "params"}:
                    invalid("Unknown request properties")
                result = worker.dispatch(request.get("action"), request.get("params", {}))
                response = {"id": request_id, "ok": True, "result": result}
            except Exception as error:
                response = error_response(request_id, error)
            wire.write(json.dumps(response, ensure_ascii=False, allow_nan=False, separators=(",", ":")) + "\n")
    except (BrokenPipeError, KeyboardInterrupt):
        pass
    finally:
        worker.close()
        wire.close()


if __name__ == "__main__":
    main()
