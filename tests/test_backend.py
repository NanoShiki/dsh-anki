"""Actual Anki-core integration tests; all collections live in temporary dirs.

Run: python -m unittest discover -s tests -p test_backend.py -v
ANKI_PYTHON / ANKI_PACKAGES can override runtime discovery. No GUI or user
profile is opened. Tests do not import anki into the unittest parent process.
"""
import base64
import json
import os
from pathlib import Path
import queue
import shutil
import subprocess
import tempfile
import threading
import unittest
import zipfile

PROJECT = Path(__file__).resolve().parents[1]
WORKER = PROJECT / "backend" / "worker.py"


def discover(env, candidates):
    if os.environ.get(env):
        result = Path(os.environ[env]).resolve()
        if not result.exists():
            raise RuntimeError(f"{env} does not exist: {result}")
        return result
    for candidate in candidates:
        if candidate.exists():
            return candidate.resolve()
    raise RuntimeError(f"Set {env}; no runtime/core found in project or research paths")


PYTHON = discover("ANKI_PYTHON", [PROJECT / "runtime/python.exe"])
PACKAGES = discover("ANKI_PACKAGES", [PROJECT / "core"])


class Client:
    def __init__(self, directory, language="en"):
        self.directory = Path(directory)
        self.directory.parent.mkdir(parents=True, exist_ok=True)
        self.errors = tempfile.TemporaryFile(mode="w+b", dir=self.directory.parent)
        self.process = subprocess.Popen([str(PYTHON), "-B", "-u", str(WORKER), "--data-dir", str(self.directory),
                    "--anki-packages", str(PACKAGES), "--lang", language], stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE, stderr=self.errors, encoding="utf-8", bufsize=1)
        self.responses = queue.Queue()
        self.reader = threading.Thread(target=self._read, daemon=True)
        self.reader.start()
        self.sequence = 0

    def _read(self):
        for line in self.process.stdout:
            self.responses.put(line)
        self.responses.put(None)

    def raw(self, data):
        self.process.stdin.write(data + "\n")
        self.process.stdin.flush()
        try:
            line = self.responses.get(timeout=45)
        except queue.Empty:
            raise AssertionError("Worker response timeout: " + self.diagnostics())
        if line is None:
            raise AssertionError("Worker terminated: " + self.diagnostics())
        try:
            return json.loads(line)
        except ValueError:
            raise AssertionError("Non-JSON protocol stdout: " + line)

    def diagnostics(self):
        self.errors.seek(0)
        return self.errors.read().decode("utf-8", "replace")

    def request(self, action, params=None, error=None):
        self.sequence += 1
        response = self.raw(json.dumps({"id": self.sequence, "action": action,
                                        "params": {} if params is None else params}, ensure_ascii=False))
        if response.get("id") != self.sequence:
            raise AssertionError(response)
        if error:
            if response.get("ok") is not False or response.get("error", {}).get("code") != error:
                raise AssertionError(f"Expected {error}, received {response}; {self.diagnostics()}")
            return response["error"]
        if response.get("ok") is not True:
            raise AssertionError(f"{action}: {response}; {self.diagnostics()}")
        return response["result"]

    def close(self):
        if self.process.poll() is None:
            self.process.stdin.close()  # EOF must cleanly close the collection
            try:
                self.process.wait(timeout=20)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(timeout=10)
                raise AssertionError("Worker did not exit on EOF")
        self.reader.join(timeout=2)
        code = self.process.returncode
        diagnostics = self.diagnostics()
        self.process.stdout.close()
        self.errors.close()
        if code != 0:
            raise AssertionError(f"Worker exit {code}: {diagnostics}")


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix=".test-backend-", dir=PROJECT / "backend")
        self.root = Path(self.temp.name)
        self.client = Client(self.root / "data")

    def tearDown(self):
        try:
            self.client.close()
        finally:
            self.temp.cleanup()

    def basic(self, front="Unique question", back="Secret answer", deck=None):
        if deck is None:
            deck = self.client.request("decks.create", {"name": "Test deck"})["id"]
        model = next(m for m in self.client.request("models.list")
                     if m["type"] == 0 and len(m["fields"]) == 2)
        fields = {model["fields"][0]: front, model["fields"][1]: back}
        note = self.client.request("notes.add", {"deckId": deck, "modelId": model["id"],
                                                "fields": fields, "tags": ["integration"]})
        return note, model, deck

    def test_status_and_notes_crud_search_conflict(self):
        status = self.client.request("status")
        self.assertTrue(status["version"].startswith("26.05"), status)
        self.assertEqual(status["noteCount"], 0)
        self.assertEqual(status["cardCount"], 0)
        self.assertEqual(Path(status["collectionPath"]), self.root / "data/collection.anki2")
        note, model, deck = self.basic("中文 question", "English answer")
        self.assertEqual(len(note["cards"]), 1)
        self.assertEqual(note["cards"][0]["deckId"], deck)
        renamed = self.client.request("decks.rename", {"deckId": deck, "name": "Renamed::子牌组"})
        self.assertEqual(renamed["name"], "Renamed::子牌组")
        result = self.client.request("notes.search", {"query": "tag:integration", "offset": 0, "limit": 1})
        self.assertEqual(result["total"], 1)
        self.assertEqual(result["items"][0]["id"], note["id"])
        self.assertEqual(self.client.request("notes.search", {"offset": 1})["items"], [])
        changed = self.client.request("notes.update", {"noteId": note["id"], "expectedModified": note["modified"],
                      "fields": {model["fields"][0]: "Edited immediately"}, "tags": ["changed", "中文"]})
        self.assertNotEqual(changed["modified"], note["modified"])
        self.assertEqual(set(changed["tags"]), {"changed", "中文"})
        self.client.request("notes.update", {"noteId": note["id"], "expectedModified": note["modified"],
                     "fields": {model["fields"][0]: "Lost stale edit"}}, error="CONFLICT")
        loaded = self.client.request("notes.get", {"noteId": note["id"]})
        self.assertEqual(loaded, changed)
        self.client.close()
        self.client = Client(self.root / "data")
        self.assertEqual(self.client.request("notes.get", {"noteId": note["id"]}), changed)
        self.assertEqual(self.client.request("status")["noteCount"], 1)
        tagged = self.client.request("notes.update", {"noteId": note["id"], "fields": {}, "tags": ["only-tags"]})
        self.assertEqual(tagged["fields"], changed["fields"])
        self.assertEqual(tagged["tags"], ["only-tags"])

    def test_cloze_generation_and_suspension(self):
        model = next(m for m in self.client.request("models.list") if m["type"] == 1)
        fields = {model["fields"][0]: "{{c1::one}} and {{c2::two}}"}
        note = self.client.request("notes.add", {"deckId": 1, "modelId": model["id"], "fields": fields})
        self.assertEqual(len(note["cards"]), 2)
        ids = [c["id"] for c in note["cards"]]
        result = self.client.request("cards.suspend", {"cardIds": ids, "suspend": True})
        self.assertEqual(result["count"], 2)
        self.assertTrue(all(c["suspended"] for c in self.client.request("notes.get", {"noteId": note["id"]})["cards"]))
        self.assertIsNone(self.client.request("review.next", {"deckId": 1}))
        self.client.request("cards.suspend", {"cardIds": ids, "suspend": False})
        self.assertFalse(any(c["suspended"] for c in self.client.request("notes.get", {"noteId": note["id"]})["cards"]))
        self.assertIsNotNone(self.client.request("review.next", {"deckId": 1}))

    def test_review_protocol_undo_and_restart(self):
        note, _, deck = self.basic()
        question = self.client.request("review.next", {"deckId": deck})
        self.assertEqual(question["cardId"], note["cards"][0]["id"])
        self.assertIn("Unique question", question["question"])
        self.assertNotIn("answer", question)
        self.assertNotIn("Secret answer", json.dumps(question))
        self.assertEqual(self.client.request("review.next", {"deckId": deck}), question)
        token = question["token"]
        self.client.request("review.answer", {"token": token, "rating": 3}, error="ANSWER_NOT_REVEALED")
        self.client.request("review.reveal", {"token": "fake"}, error="STALE_TOKEN")
        revealed = self.client.request("review.reveal", {"token": token})
        self.assertIn("Secret answer", revealed["answer"])
        self.assertEqual([b["rating"] for b in revealed["buttons"]], [1, 2, 3, 4])
        self.assertTrue(all(b["interval"] for b in revealed["buttons"]))
        for bad in (0, 5, True, "3", 1.5):
            self.client.request("review.answer", {"token": token, "rating": bad}, error="VALIDATION_ERROR")
        answered = self.client.request("review.answer", {"token": token, "rating": 3})
        self.assertTrue(answered["undo"]["available"])
        self.client.request("review.answer", {"token": token, "rating": 3}, error="STALE_TOKEN")
        after = self.client.request("notes.get", {"noteId": note["id"]})
        self.assertEqual(after["cards"][0]["reps"], 1)
        self.client.request("review.undo")
        undone = self.client.request("notes.get", {"noteId": note["id"]})
        self.assertEqual(undone["cards"][0]["reps"], 0)
        question2 = self.client.request("review.next", {"deckId": deck})
        self.assertNotEqual(question2["token"], token)
        self.client.request("review.reveal", {"token": question2["token"]})
        self.client.request("review.answer", {"token": question2["token"], "rating": 4})
        self.client.close()
        self.client = Client(self.root / "data")
        persisted = self.client.request("notes.get", {"noteId": note["id"]})
        self.assertEqual(persisted["cards"][0]["reps"], 1)
        self.assertEqual(persisted["cards"][0]["type"], 2)
        self.assertGreaterEqual(persisted["cards"][0]["interval"], 1)
        self.client.request("review.reveal", {"token": question2["token"]}, error="STALE_TOKEN")
        self.client.request("review.undo", error="UNDO_UNAVAILABLE")

    def test_mutation_invalidates_review_and_undo_only_review(self):
        note, model, deck = self.basic()
        question = self.client.request("review.next", {"deckId": deck})
        self.client.request("notes.update", {"noteId": note["id"], "fields": {model["fields"][0]: "Changed"}})
        self.client.request("review.reveal", {"token": question["token"]}, error="STALE_TOKEN")
        self.client.request("review.undo", error="UNDO_UNAVAILABLE")

    def test_malformed_requests_keep_worker_alive(self):
        self.assertEqual(self.client.raw("not json")["error"]["code"], "INVALID_JSON")
        for payload in ("null", "[]", "1", '{}', '{"id":true,"action":"status"}'):
            self.assertEqual(self.client.raw(payload)["error"]["code"], "VALIDATION_ERROR")
        self.client.request("unknown", error="UNKNOWN_ACTION")
        for params in ([], "string", 1):
            self.sequence = self.client.sequence + 1
            response = self.client.raw(json.dumps({"id": self.sequence, "action": "status", "params": params}))
            self.assertEqual(response["error"]["code"], "VALIDATION_ERROR")
        for action, params in [
            ("status", {"collectionPath": "C:/not-allowed.anki2"}),
            ("notes.search", {"limit": 0}), ("notes.search", {"offset": -1}),
            ("notes.search", {"limit": True}), ("decks.create", {"name": " "}),
            ("decks.rename", {"deckId": "1", "name": "x"}),
            ("notes.get", {}), ("cards.suspend", {"cardIds": []}),
            ("export.apkg", {"filename": "../escape.apkg"}),
            ("import.apkg", {"filename": "C:\\escape.apkg"}),
            ("import.apkg", {"filename": "bad.zip"}),
            ("media.get", {"filename": "../collection.anki2"}),
        ]:
            self.client.request(action, params, error="VALIDATION_ERROR")
        self.client.request("notes.get", {"noteId": 999}, error="NOT_FOUND")
        self.client.request("decks.rename", {"deckId": 999, "name": "x"}, error="NOT_FOUND")
        self.client.request("import.apkg", {"filename": "absent.apkg"}, error="NOT_FOUND")
        self.assertEqual(self.client.request("status")["noteCount"], 0)

    def test_cross_process_lock(self):
        self.client.request("status")
        other = Client(self.root / "data")
        try:
            error = other.request("status", error="COLLECTION_LOCKED")
            self.assertIn("pid=", error["message"])
            self.client.close()
            self.client = Client(self.root / "different")
            self.assertEqual(other.request("status")["noteCount"], 0)
        finally:
            other.close()

    def test_apkg_roundtrip_and_media(self):
        note, model, deck = self.basic()
        media = self.root / "data/collection.media"
        media.mkdir(exist_ok=True)
        data = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=")
        (media / "pixel.png").write_bytes(data)
        result = self.client.request("media.get", {"filename": "pixel.png"})
        self.assertEqual(result["mime"], "image/png")
        self.assertEqual(base64.b64decode(result["data"]), data)
        (media / "unsafe.svg").write_text("<svg/>", encoding="utf-8")
        self.client.request("media.get", {"filename": "unsafe.svg"}, error="MEDIA_TYPE_NOT_ALLOWED")
        (media / "big.png").write_bytes(b"x" * (5 * 1024 * 1024 + 1))
        self.client.request("media.get", {"filename": "big.png"}, error="MEDIA_TOO_LARGE")
        note = self.client.request("notes.update", {"noteId": note["id"],
            "fields": {model["fields"][0]: 'Unique question <img src="pixel.png">'}})
        exported = self.client.request("export.apkg", {"deckId": deck, "filename": "roundtrip.apkg"})
        self.assertTrue(Path(exported["path"]).is_file())
        self.assertEqual(exported["count"], 1)
        self.client.request("export.apkg", {"filename": "roundtrip.apkg"}, error="ALREADY_EXISTS")
        target = Client(self.root / "imported")
        try:
            target.request("status")
            imports = self.root / "imported/imports"
            imports.mkdir(exist_ok=True)
            shutil.copyfile(exported["path"], imports / "roundtrip.apkg")
            result = target.request("import.apkg", {"filename": "roundtrip.apkg"})
            self.assertEqual(result["added"], 1)
            self.assertEqual(result["noteCount"], 1)
            self.assertEqual(target.request("notes.get", {"noteId": note["id"]})["fields"], note["fields"])
            self.assertEqual(base64.b64decode(target.request("media.get", {"filename": "pixel.png"})["data"]), data)
            # A malformed archive must not change collection contents.
            (imports / "broken.apkg").write_bytes(b"invalid archive")
            target.request("import.apkg", {"filename": "broken.apkg"}, error="INVALID_ARCHIVE")
            self.assertEqual(target.request("status")["noteCount"], 1)
            self.assertTrue(list((self.root / "imported/backups").glob("*.colpkg")))
        finally:
            target.close()

    def test_omitted_review_deck_means_selected_not_all(self):
        first, model, first_deck = self.basic("First deck", "Answer")
        second_deck = self.client.request("decks.create", {"name": "Other deck"})["id"]
        second = self.client.request("notes.add", {"deckId": second_deck, "modelId": model["id"],
            "fields": {model["fields"][0]: "Second deck", model["fields"][1]: "Answer"}})
        card = self.client.request("review.next", {"deckId": first_deck})
        self.assertEqual(card["cardId"], first["cards"][0]["id"])
        self.assertEqual(self.client.request("review.next")["token"], card["token"])
        status = self.client.request("status")
        self.assertEqual(status["selectedDeckId"], first_deck)
        self.assertEqual(status["reviewScope"], "selected-deck-and-descendants")
        self.client.request("review.reveal", {"token": card["token"]})
        self.client.request("review.answer", {"token": card["token"], "rating": 4})
        self.assertIsNone(self.client.request("review.next"))
        other = self.client.request("review.next", {"deckId": second_deck})
        self.assertEqual(other["cardId"], second["cards"][0]["id"])
        self.assertEqual(self.client.request("status")["selectedDeckId"], second_deck)

    def test_native_deck_zero_is_default_not_all_decks(self):
        directory = self.root / "zero-probe"
        directory.mkdir()
        script = """
import json, os, sys, tempfile
from pathlib import Path
root = Path(sys.argv[1])
for key in ('TEMP', 'TMP', 'TMPDIR'):
    os.environ[key] = str(root)
tempfile.tempdir = str(root)
sys.path.insert(0, sys.argv[2])
from anki.collection import Collection
col = Collection(str(root / 'collection.anki2'))
try:
    ids = [1, col.decks.add_normal_deck_with_name('Alpha').id,
           col.decks.add_normal_deck_with_name('Beta').id]
    model = col.models.by_name('Basic')
    for did in ids:
        note = col.new_note(model)
        note.fields = [str(did), 'answer']
        col.add_note(note, did)
    col.decks.select(ids[1])
    col.sched.get_queued_cards(fetch_limit=10)
    col.decks.select(0)
    queue = col.sched.get_queued_cards(fetch_limit=10)
    print(json.dumps({'selected': col.decks.selected(), 'allCards': col.card_count(),
                      'new': queue.new_count, 'decks': [c.card.deck_id for c in queue.cards]}))
finally:
    col.close()
"""
        result = subprocess.run([str(PYTHON), "-c", script, str(directory), str(PACKAGES)],
                                capture_output=True, text=True, timeout=45)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        output = json.loads(result.stdout.strip().splitlines()[-1])
        self.assertEqual(output, {"selected": 1, "allCards": 3, "new": 1, "decks": [1]})

    def test_archive_preflight_rejects_unsafe_and_bounded_zstd(self):
        self.client.request("status")
        imports = self.root / "data/imports"
        for name in ("../escape", "dir/file", "C:escape"):
            with zipfile.ZipFile(imports / "unsafe.apkg", "w") as archive:
                archive.writestr(name, b"x")
                archive.writestr("collection.anki2", b"x")
            self.client.request("import.apkg", {"filename": "unsafe.apkg"}, error="INVALID_ARCHIVE")
        info = zipfile.ZipInfo("link")
        info.create_system = 3
        info.external_attr = (0o120777 << 16)
        with zipfile.ZipFile(imports / "link.apkg", "w") as archive:
            archive.writestr(info, "outside")
            archive.writestr("collection.anki2", b"x")
        self.client.request("import.apkg", {"filename": "link.apkg"}, error="INVALID_ARCHIVE")
        # Unknown-size streaming Zstd frame: 2049 tiny RLE blocks imply >256 MB
        # decoded. No actual large file is allocated or passed to native Anki.
        block = ((131072 << 3) | (1 << 1)).to_bytes(3, "little") + b"x"
        bomb = b"\x28\xb5\x2f\xfd\x00\x38" + block * 2049
        with zipfile.ZipFile(imports / "bomb.apkg", "w") as archive:
            archive.writestr("collection.anki21b", bomb)
        self.client.request("import.apkg", {"filename": "bomb.apkg"}, error="ARCHIVE_TOO_LARGE")
        self.assertEqual(self.client.request("status")["noteCount"], 0)
        self.assertFalse(list((self.root / "data/backups").iterdir()))

    def test_media_hardlink_rejected(self):
        self.client.request("status")
        media = self.root / "data/collection.media"
        media.mkdir(exist_ok=True)
        original = self.root / "outside.png"
        original.write_bytes(b"outside data")
        os.link(original, media / "linked.png")
        self.client.request("media.get", {"filename": "linked.png"}, error="UNSAFE_PATH")
        self.client.request("export.apkg", error="UNSAFE_PATH")
        self.assertEqual(original.read_bytes(), b"outside data")

    def test_latex_rendering_never_runs_generation(self):
        note, _, deck = self.basic("[latex]x^2[/latex]", "[latex]y^2[/latex]")
        question = self.client.request("review.next", {"deckId": deck})
        self.assertIn("disabled", question["question"].lower())
        revealed = self.client.request("review.reveal", {"token": question["token"]})
        self.assertIn("disabled", revealed["answer"].lower())
        self.assertFalse(list((self.root / "data/collection.media").glob("latex-*")))
        self.assertFalse(list((self.root / "data/tmp").rglob("*.tex")))

    def test_chinese_localization(self):
        self.client.close()
        self.client = Client(self.root / "chinese", "zh-CN")
        self.assertEqual(self.client.request("status")["language"], "zh-CN")
        note, _, deck = self.basic()
        question = self.client.request("review.next", {"deckId": deck})
        answer = self.client.request("review.reveal", {"token": question["token"]})
        self.assertEqual(answer["buttons"][0]["label"], "重来")


if __name__ == "__main__":
    unittest.main(verbosity=2)
