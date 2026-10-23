"""Native AnkiWeb jobs; JSONL controls never carry credentials back to callers."""
from __future__ import annotations

import ctypes
import hashlib
import json
import os
from pathlib import Path
import secrets
import shutil
import threading
import time
from urllib.parse import urlparse


class ProtectedState:
    """Windows current-user DPAPI, bound to this independent workspace path."""
    MAGIC = b"DSH-ANKI-DPAPI-1\x00"

    def __init__(self, worker):
        self.worker = worker
        self.entropy = hashlib.sha256(("dsh-anki-sync:" + str(worker.root).casefold()).encode()).digest()

    def crypt(self, value, decrypt=False):
        if os.name != "nt":
            raise RuntimeError("DPAPI unavailable")
        from ctypes import wintypes
        class Blob(ctypes.Structure):
            _fields_ = [("size", wintypes.DWORD), ("data", ctypes.POINTER(ctypes.c_ubyte))]
        def blob(raw):
            array = (ctypes.c_ubyte * len(raw)).from_buffer_copy(raw)
            return Blob(len(raw), array), array
        source, source_array = blob(value)
        entropy, entropy_array = blob(self.entropy)
        out = Blob()
        crypt = ctypes.WinDLL("crypt32", use_last_error=True)
        kernel = ctypes.WinDLL("kernel32", use_last_error=True)
        kernel.LocalFree.argtypes = [ctypes.c_void_p]
        kernel.LocalFree.restype = ctypes.c_void_p
        if decrypt:
            function = crypt.CryptUnprotectData
            function.argtypes = [ctypes.POINTER(Blob), ctypes.c_void_p, ctypes.POINTER(Blob),
                                 ctypes.c_void_p, ctypes.c_void_p, wintypes.DWORD, ctypes.POINTER(Blob)]
            args = (ctypes.byref(source), None, ctypes.byref(entropy), None, None, 1, ctypes.byref(out))
        else:
            function = crypt.CryptProtectData
            function.argtypes = [ctypes.POINTER(Blob), wintypes.LPCWSTR, ctypes.POINTER(Blob),
                                 ctypes.c_void_p, ctypes.c_void_p, wintypes.DWORD, ctypes.POINTER(Blob)]
            args = (ctypes.byref(source), "DSH private Anki sync", ctypes.byref(entropy), None, None, 1, ctypes.byref(out))
        function.restype = wintypes.BOOL
        if not function(*args):
            raise RuntimeError("DPAPI operation failed")
        try:
            return ctypes.string_at(out.data, out.size)
        finally:
            ctypes.memset(out.data, 0, out.size)
            kernel.LocalFree(out.data)
            ctypes.memset(source_array, 0, len(value))
            ctypes.memset(entropy_array, 0, len(self.entropy))

    def load(self):
        path = self.worker.owned("sync-state.dpapi")
        if not path.exists():
            return None
        if path.stat().st_size > 65536:
            raise RuntimeError("Invalid protected state")
        raw = path.read_bytes()
        if not raw.startswith(self.MAGIC):
            raise RuntimeError("Invalid protected state")
        return json.loads(self.crypt(raw[len(self.MAGIC):], decrypt=True))

    def save(self, data):
        path = self.worker.owned("sync-state.dpapi")
        payload = self.MAGIC + self.crypt(json.dumps(data, separators=(",", ":")).encode())
        temporary = self.worker.owned("sync-state-" + secrets.token_hex(12) + ".tmp")
        try:
            with temporary.open("xb") as stream:
                stream.write(payload)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, path)
        finally:
            if temporary.exists():
                temporary.unlink()


class SyncManager:
    READ_ACTIONS = {"status", "decks.list", "models.list", "notes.search", "notes.get", "media.get", "review.reveal"}
    ACTIONS = {"sync.status", "sync.run", "sync.cancel", "account.login", "account.logout",
               "sync.configure", "sync.confirm", "sync.dismiss"}

    def __init__(self, worker, error_type, *, test_endpoint=None):
        self.worker = worker
        self.Error = error_type
        self.gate = threading.RLock()
        self.state_lock = threading.RLock()
        self.thread = None
        self.cancelled = threading.Event()
        self.closing = False
        self.media_running = False
        # Internal constructor injection for isolated official-syncserver tests.
        # No command-line, environment, JSONL or persisted custom endpoint input.
        self.test_endpoint = test_endpoint
        self.store = ProtectedState(worker)
        self.auth = None
        self.account = None
        self.settings = {"autoSync": True}
        self.host_number = 0
        self.saved_endpoint = None
        self.pending = None
        self.snapshot = {"loggedIn": False, "account": None, "settings": dict(self.settings),
            "phase": "idle", "active": False, "jobId": None, "lastSyncAt": None,
            "error": None, "progress": None, "pendingFull": None, "lastBackupPath": None}
        try:
            data = self.store.load()
            if data:
                if not isinstance(data, dict) or type(data.get("autoSync")) is not bool:
                    raise ValueError("Invalid protected state")
                self.settings["autoSync"] = data["autoSync"]
                self.host_number = int(data.get("hostNumber", 0))
                endpoint = data.get("endpoint")
                if endpoint and not self.allowed_endpoint(endpoint):
                    raise ValueError("Invalid endpoint")
                self.saved_endpoint = endpoint
                if data.get("hkey"):
                    self.auth = data["hkey"]
                    self.account = data.get("username")
        except Exception:
            self.snapshot["error"] = {"code": "CREDENTIAL_STORAGE_ERROR", "message": "Saved sign-in could not be unlocked. Sign in again on this Windows account."}
            self.snapshot["phase"] = "error"

    def allowed_endpoint(self, value):
        if self.test_endpoint and value == self.test_endpoint:
            return True
        parsed = urlparse(value)
        host = parsed.hostname or ""
        return (parsed.scheme == "https" and (host == "ankiweb.net" or host.endswith(".ankiweb.net"))
                and not parsed.username and not parsed.password and parsed.port in (None, 443)
                and not parsed.query and not parsed.fragment)

    def persist(self):
        self.store.save({"autoSync": self.settings["autoSync"], "hkey": self.auth,
                         "username": self.account, "hostNumber": self.host_number,
                         "endpoint": self.saved_endpoint})

    def update(self, **values):
        with self.state_lock:
            self.snapshot.update(values)

    @property
    def active(self):
        with self.state_lock:
            return self.snapshot["active"]

    def status(self):
        with self.state_lock:
            pending = self.pending
            if pending and pending["expires"] < time.monotonic() and self.pending is pending:
                self.pending = None
                self.snapshot.update(phase="idle", pendingFull=None)
            out = dict(self.snapshot)
            out.update(loggedIn=bool(self.auth), account=self.account,
                       settings=dict(self.settings))
        # The backend progress RPC does not acquire the collection lock.
        if out["active"] and self.worker.col:
            try:
                progress = self.worker.col.latest_progress()
                kind = progress.WhichOneof("value")
                if kind == "normal_sync":
                    p = progress.normal_sync
                    out["progress"] = {"stage": str(p.stage)[:256], "added": str(p.added)[:128], "removed": str(p.removed)[:128]}
                elif kind == "full_sync":
                    p = progress.full_sync
                    out["progress"] = {"stage": out["phase"], "transferred": p.transferred, "total": p.total}
            except Exception:
                pass
        return json.loads(json.dumps(out))

    def require_idle(self):
        if self.active:
            raise self.Error("SYNC_BUSY", "AnkiWeb operation is active; wait or cancel it first")
        if self.closing:
            raise self.Error("SYNC_BUSY", "Worker is closing")

    def start(self, phase, operation):
        self.require_idle()
        self.worker.open()
        self.worker.invalidate()
        self.cancelled.clear()
        self.update(phase=phase, active=True, jobId=secrets.token_urlsafe(18),
                    error=None, progress={"stage": phase}, pendingFull=None)
        self.pending = None
        self.thread = threading.Thread(target=self.run_job, args=(operation,), daemon=False, name="anki-sync")
        self.thread.start()
        return self.status()

    def run_job(self, operation):
        try:
            operation()
            self.check_cancel()
        except Exception as error:
            self.fail(error)
        finally:
            # Native media is itself asynchronous. Never release the collection
            # to other JSONL actions until its background task has stopped.
            if self.media_running:
                try:
                    self.worker.col.abort_media_sync()
                except Exception:
                    # Do not strand the ownership flag if abort itself errors.
                    # Continue monitoring: status consumes completed task errors.
                    pass
                while True:
                    try:
                        if not self.worker.col.media_sync_status().active:
                            break
                    except Exception:
                        # Native status consumes the completed task's error.
                        pass
                    time.sleep(0.1)
                self.media_running = False
            with self.state_lock:
                if self.cancelled.is_set():
                    self.pending = None
                    self.snapshot.update(phase="cancelled", error=None, progress=None, pendingFull=None)
                self.snapshot["active"] = False

    def fail(self, error):
        from anki.errors import Interrupted, NetworkError, SyncError, SyncErrorKind
        if isinstance(error, Interrupted) or self.cancelled.is_set():
            self.pending = None
            self.update(phase="cancelled", error=None, progress=None, pendingFull=None)
        elif isinstance(error, SyncError) and error.kind == SyncErrorKind.AUTH:
            self.auth = self.account = self.saved_endpoint = None
            try:
                path = self.worker.owned("sync-state.dpapi")
                if path.exists():
                    path.unlink()
                self.persist()
            except Exception:
                pass
            self.update(phase="error", error={"code": "SYNC_AUTH", "message": "AnkiWeb sign-in was rejected. Sign in again."}, progress=None)
        elif isinstance(error, NetworkError):
            self.update(phase="error", error={"code": "SYNC_NETWORK", "message": "Could not reach AnkiWeb. Check your connection and try again."}, progress=None)
        else:
            # Never return/log native exception text: HTTP bodies may carry secrets.
            self.update(phase="error", error={"code": "SYNC_FAILED", "message": "AnkiWeb operation failed. Changes may have partially completed; inspect the local backup before retrying."}, progress=None)

    def native_auth(self):
        from anki.sync_pb2 import SyncAuth
        return SyncAuth(hkey=self.auth, endpoint=self.test_endpoint or self.saved_endpoint,
                        io_timeout_secs=15)

    def check_cancel(self):
        if self.cancelled.is_set():
            from anki.errors import Interrupted
            raise Interrupted("Cancelled", None, None, None)

    def disable_latex(self):
        from anki.config import Config
        self.worker.col.set_config_bool(Config.Bool.RENDER_LATEX, False)

    def update_endpoint(self, result):
        endpoint = result.new_endpoint
        if endpoint:
            if not self.allowed_endpoint(endpoint):
                raise ValueError("Untrusted server endpoint")
            self.saved_endpoint = endpoint
        if hasattr(result, "host_number"):
            self.host_number = result.host_number
        self.persist()

    def collection_sync(self):
        col = self.worker.col
        self.check_cancel()
        self.worker.validate_media_directory()
        try:
            result = col.sync_collection(self.native_auth(), sync_media=False)
        finally:
            col._load_scheduler()
            self.disable_latex()
        self.update_endpoint(result)
        self.check_cancel()
        if result.required in (result.FULL_SYNC, result.FULL_UPLOAD, result.FULL_DOWNLOAD):
            directions = (["upload"] if result.required == result.FULL_UPLOAD else
                          ["download"] if result.required == result.FULL_DOWNLOAD else ["upload", "download"])
            token = secrets.token_urlsafe(32)
            note_count = col.note_count()
            recommended = ("download" if note_count == 0 and "download" in directions else
                           directions[0] if len(directions) == 1 else None)
            public = {"token": token, "allowedDirections": directions,
                      "recommendedDirection": recommended, "localNoteCount": note_count}
            self.pending = {"public": public, "expires": time.monotonic() + 600,
                            "serverUsn": result.server_media_usn}
            self.update(phase="awaiting-full", pendingFull=public, progress=None)
        else:
            self.media_sync()
            self.check_cancel()
            self.update(phase="success", lastSyncAt=int(time.time() * 1000), progress=None)

    def media_sync(self, start=True):
        self.check_cancel()
        col = self.worker.col
        self.worker.validate_media_directory()
        self.update(phase="media", progress={"stage": "media"})
        if start:
            col.sync_media(self.native_auth())
        self.media_running = True
        while True:
            if self.cancelled.is_set():
                col.abort_media_sync()
            status = col.media_sync_status()
            p = status.progress
            self.update(progress={"stage": "media", "added": str(p.added)[:128],
                                  "removed": str(p.removed)[:128], "checked": str(p.checked)[:128]})
            if not status.active:
                self.media_running = False
                break
            self.cancelled.wait(0.1)
        self.check_cancel()

    def stable_backup(self):
        w = self.worker
        w.validate_media_directory()
        backups = w.owned("backups", directory=True)
        backups.mkdir(exist_ok=True)
        destination = backups / ("full-sync-" + time.strftime("%Y%m%d-%H%M%S") + "-" + secrets.token_hex(6))
        destination.mkdir()
        col = w.col
        col.close()
        try:
            for name in ("collection.anki2", "collection.anki2-wal", "collection.anki2-shm",
                         "collection.media.db2", "collection.media.db2-wal", "collection.media.db2-shm"):
                self.check_cancel()
                path = w.owned(name)
                if path.exists():
                    shutil.copy2(path, destination / name)
            source = w.owned("collection.media", directory=True)
            (destination / "collection.media").mkdir()
            if source.exists():
                for path in source.iterdir():
                    self.check_cancel()
                    if (path.is_symlink() or bool(getattr(path.lstat(), "st_file_attributes", 0) & 0x400)
                            or not path.is_file() or path.stat().st_nlink != 1
                            or path.resolve().parent != source.resolve()):
                        raise ValueError("Unsafe media")
                    shutil.copy2(path, destination / "collection.media" / path.name)
            (destination / "backup.json").write_text(json.dumps({"complete": True,
                "createdAt": int(time.time() * 1000), "includesMedia": True}), encoding="utf-8")
        finally:
            col.reopen()
            self.disable_latex()
        self.update(lastBackupPath=str(destination))
        return destination

    def full_sync(self, direction, pending):
        self.check_cancel()
        self.stable_backup()
        self.check_cancel()
        col = self.worker.col
        col.close_for_full_sync()
        # Full sync starts native media on success when server_usn is supplied.
        # Mark ownership before the call so any subsequent exception drains it.
        self.media_running = True
        try:
            col.full_upload_or_download(auth=self.native_auth(), upload=direction == "upload",
                                        server_usn=pending["serverUsn"])
        finally:
            col.reopen(after_full_sync=True)
            self.disable_latex()
            self.worker.invalidate()
        self.check_cancel()
        self.media_sync(start=False)
        self.update(phase="success", lastSyncAt=int(time.time() * 1000), progress=None)

    def handle(self, action, params):
        if action == "sync.status":
            return self.status()
        if action == "sync.cancel":
            if self.active:
                self.cancelled.set()
                col = self.worker.col
                if col:
                    for control in (col.set_wants_abort, col.abort_sync, col.abort_media_sync):
                        try:
                            control()
                        except Exception:
                            # The persistent cancellation event also reaches the
                            # job monitor; never leak raw native control errors.
                            pass
            elif self.pending:
                self.pending = None
                self.update(pendingFull=None, phase="cancelled")
            return self.status()
        self.require_idle()
        if action == "sync.dismiss":
            self.pending = None
            self.update(pendingFull=None, phase="idle", error=None, progress=None)
        elif action == "sync.configure":
            if type(params.get("autoSync")) is not bool:
                raise self.Error("INVALID_PARAMS", "autoSync must be boolean")
            self.worker.ensure_storage()
            old = self.settings["autoSync"]
            self.settings["autoSync"] = params["autoSync"]
            try:
                self.persist()
            except Exception:
                self.settings["autoSync"] = old
                raise self.Error("CREDENTIAL_STORAGE_ERROR", "Could not protect sync settings with Windows DPAPI")
        elif action == "account.logout":
            self.worker.ensure_storage()
            self.auth = self.account = self.saved_endpoint = None
            self.host_number = 0
            self.pending = None
            # Remove the old token before writing token-free settings.
            path = self.worker.owned("sync-state.dpapi")
            if path.exists():
                path.unlink()
            self.persist()
            self.update(phase="idle", error=None, pendingFull=None, progress=None)
        elif action == "account.login":
            username, password = params.get("username"), params.pop("password", None)
            if not isinstance(username, str) or not username.strip() or len(username) > 254:
                raise self.Error("INVALID_PARAMS", "username must be a nonempty string of at most 254 characters")
            if not isinstance(password, str) or not 1 <= len(password) <= 4096:
                raise self.Error("INVALID_PARAMS", "password must be a nonempty string of at most 4096 characters")
            self.worker.ensure_storage()
            # Fail closed before sending a password if DPAPI is unavailable.
            self.store.crypt(b"availability-check")
            self.auth = self.account = self.saved_endpoint = None
            self.persist()
            def login():
                self.check_cancel()
                result = self.worker.col.sync_login(username.strip(), password, self.test_endpoint)
                self.check_cancel()
                self.auth, self.account = result.hkey, username.strip()
                self.saved_endpoint = None
                try:
                    self.persist()
                except Exception:
                    self.auth = self.account = None
                    raise
                self.update(phase="idle", progress=None)
            return self.start("logging-in", login)
        elif action == "sync.run":
            if self.pending:
                return self.status()
            if not self.auth:
                raise self.Error("NOT_LOGGED_IN", "Sign in to AnkiWeb first")
            return self.start("syncing", self.collection_sync)
        elif action == "sync.confirm":
            self.status()  # expire stale confirmation before validating it
            pending = self.pending
            token, direction = params.get("token"), params.get("direction")
            if (not pending or not isinstance(token, str)
                    or not secrets.compare_digest(token.encode("utf-8"), pending["public"]["token"].encode("utf-8"))):
                raise self.Error("STALE_CONFIRMATION", "Full sync confirmation has expired or was already used")
            if direction not in pending["public"]["allowedDirections"]:
                raise self.Error("INVALID_PARAMS", "This full sync direction is not allowed")
            self.pending = None  # consume before starting, never reuse on failure
            self.update(pendingFull=None)
            return self.start("full-" + direction, lambda: self.full_sync(direction, pending))
        return self.status()

    def close(self):
        self.closing = True
        if self.active:
            self.handle("sync.cancel", {})
        thread = self.thread
        if thread and thread.is_alive():
            thread.join()
