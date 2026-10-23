"""Real Anki26.05/DPAPI/local official-syncserver tests. Never contact AnkiWeb."""
import json
import os
from pathlib import Path
import socket
import sqlite3
from types import SimpleNamespace
from unittest.mock import patch
import subprocess
import sys
import tempfile
import threading
import time
import unittest

from test_backend import Client, PACKAGES, PROJECT, PYTHON
sys.path.insert(0, str(PROJECT / "backend"))
from worker import Worker, RequestError
from sync_service import ProtectedState, SyncManager


@unittest.skipUnless(os.name == "nt", "Current-user Windows DPAPI is required")
class SyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix=".test-sync-", dir=PROJECT / "backend")
        self.root = Path(self.temp.name)
        self.workers = []
        self.server = None
        self.server_log = None

    def tearDown(self):
        for worker in self.workers:
            worker.close()
        self.stop_server()
        self.temp.cleanup()

    def worker(self, name="a", endpoint=None):
        worker = Worker(self.root / name, str(PACKAGES))
        if endpoint:
            worker.sync.test_endpoint = endpoint
        self.workers.append(worker)
        return worker

    def wait(self, worker, phase=None):
        thread = worker.sync.thread
        if thread:
            thread.join(timeout=25)
            self.assertFalse(thread.is_alive(), "Sync job did not finish")
        status = worker.dispatch("sync.status", {})
        self.assertFalse(status["active"])
        if phase:
            self.assertEqual(status["phase"], phase, status)
        return status

    def raises_code(self, code, worker, action, params):
        with self.assertRaises(RequestError) as context:
            worker.dispatch(action, params)
        self.assertEqual(context.exception.code, code)

    def start_server(self):
        with socket.socket() as available:
            available.bind(("127.0.0.1", 0))
            port = available.getsockname()[1]
        environment = {k: v for k, v in os.environ.items() if not k.startswith("SYNC_")}
        environment.update(SYNC_HOST="127.0.0.1", SYNC_PORT=str(port),
            SYNC_BASE=str(self.root / "server"), SYNC_USER1="test@example.invalid:secret-test-password",
            RUST_LOG="off", TEMP=str(self.root), TMP=str(self.root), TMPDIR=str(self.root))
        self.server_log = tempfile.TemporaryFile(dir=self.root)
        code = "import sys;sys.path.insert(0,sys.argv[1]);from anki.syncserver import run_sync_server;run_sync_server()"
        self.server = subprocess.Popen([str(PYTHON), "-u", "-c", code, str(PACKAGES)],
            env=environment, stdin=subprocess.DEVNULL, stdout=self.server_log, stderr=self.server_log)
        deadline = time.monotonic() + 15
        while time.monotonic() < deadline:
            if self.server.poll() is not None:
                self.server_log.seek(0)
                self.fail("Official syncserver failed: " + self.server_log.read().decode("utf-8", "replace"))
            try:
                with socket.create_connection(("127.0.0.1", port), timeout=0.1):
                    return "http://127.0.0.1:" + str(port) + "/"
            except OSError:
                threading.Event().wait(0.05)
        self.fail("Official syncserver did not start")

    def stop_server(self):
        if self.server:
            self.server.terminate()
            self.server.wait(timeout=10)
            self.server = None
        if self.server_log:
            self.server_log.close()
            self.server_log = None

    def login(self, worker, password="secret-test-password"):
        result = worker.dispatch("account.login", {"username": "test@example.invalid", "password": password})
        self.assertIn(result["phase"], ("logging-in", "idle", "error"))
        return self.wait(worker)

    def add_note(self, worker, front):
        models = worker.dispatch("models.list", {})
        model = next(m for m in models if m["type"] == 0 and len(m["fields"]) == 2)
        return worker.dispatch("notes.add", {"deckId": 1, "modelId": model["id"],
            "fields": {model["fields"][0]: front, model["fields"][1]: "back"}})

    def test_status_lazy_strict_and_review_discard(self):
        w = self.worker()
        state = w.dispatch("sync.status", {})
        self.assertFalse(state["loggedIn"])
        self.assertEqual(state["settings"], {"autoSync": True})
        self.assertIsNone(w.col)
        self.assertFalse(w.root.exists())
        for action in SyncManager.ACTIONS:
            self.raises_code("VALIDATION_ERROR", w, action, {"endpoint": "https://attacker.invalid"})
        self.raises_code("NOT_LOGGED_IN", w, "sync.run", {})
        self.assertEqual(w.dispatch("review.discard", {}), {"discarded": True})

    def test_dpapi_no_plaintext_persistence_logout(self):
        w = self.worker()
        w.ensure_storage()
        w.sync.auth, w.sync.account = "private-token-sentinel", "name@example.invalid"
        w.sync.persist()
        raw = (w.root / "sync-state.dpapi").read_bytes()
        self.assertTrue(raw.startswith(ProtectedState.MAGIC))
        self.assertNotIn(b"private-token-sentinel", raw)
        self.assertNotIn(b"name@example.invalid", raw)
        self.assertEqual(w.sync.store.load()["hkey"], "private-token-sentinel")
        another = SyncManager(w, RequestError)
        self.assertTrue(another.status()["loggedIn"])
        self.assertNotIn("private-token-sentinel", json.dumps(another.status()))
        w.dispatch("sync.configure", {"autoSync": False})
        self.assertFalse(w.sync.store.load()["autoSync"])
        result = w.dispatch("account.logout", {})
        self.assertFalse(result["loggedIn"])
        self.assertIsNone(w.sync.store.load()["hkey"])

    def test_status_cancel_busy_and_close_join(self):
        w = self.worker()
        w.open()
        entered = threading.Event()
        def operation():
            entered.set()
            w.sync.cancelled.wait(10)
            w.sync.check_cancel()
        w.sync.start("syncing", operation)
        self.assertTrue(entered.wait(2))
        started = time.monotonic()
        self.assertTrue(w.dispatch("sync.status", {})["active"])
        self.assertLess(time.monotonic() - started, 0.5)
        for action in ("decks.list", "notes.search", "review.discard"):
            self.raises_code("SYNC_BUSY", w, action, {})
        w.dispatch("sync.cancel", {})
        self.wait(w, "cancelled")
        w.sync.start("syncing", operation)
        w.close()
        self.assertFalse(w.sync.thread.is_alive())
        self.assertIsNone(w.col)

    def test_confirm_expiry_direction_and_pending_mutation_gate(self):
        w = self.worker()
        w.open()
        public = {"token": "one-time", "allowedDirections": ["download"],
                  "recommendedDirection": "download", "localNoteCount": 0}
        w.sync.pending = {"public": public, "expires": time.monotonic() + 60, "serverUsn": 0}
        w.sync.update(phase="awaiting-full", pendingFull=public)
        self.raises_code("SYNC_CONFIRMATION_REQUIRED", w, "decks.create", {"name": "blocked"})
        self.raises_code("SYNC_CONFIRMATION_REQUIRED", w, "review.next", {})
        self.assertEqual(w.dispatch("notes.search", {})["total"], 0)
        w.dispatch("review.discard", {})
        self.raises_code("INVALID_PARAMS", w, "sync.confirm", {"token": "one-time", "direction": "upload"})
        self.assertIsNotNone(w.sync.pending)
        self.raises_code("STALE_CONFIRMATION", w, "sync.confirm", {"token": "bad", "direction": "download"})
        w.sync.pending["expires"] = time.monotonic() - 1
        self.raises_code("STALE_CONFIRMATION", w, "sync.confirm", {"token": "one-time", "direction": "download"})
        self.assertIsNone(w.dispatch("sync.dismiss", {})["pendingFull"])
        class ConcurrentClear(dict):
            def __bool__(self):
                w.sync.pending = None  # cancellation between truth test and expiry read
                return True
        w.sync.pending = ConcurrentClear(expires=time.monotonic() - 1)
        self.assertIsNone(w.dispatch("sync.status", {})["pendingFull"])
        self.assertIsNone(w.sync.pending)

    def test_empty_local_full_decision_recommends_download_when_both_allowed(self):
        w = self.worker()
        w.open()
        w.sync.auth = "local-test-only"
        from anki.sync_pb2 import SyncCollectionResponse
        result = SyncCollectionResponse(required=SyncCollectionResponse.FULL_SYNC, server_media_usn=7)
        with patch.object(w.col, "sync_collection", return_value=result):
            w.dispatch("sync.run", {})
            state = self.wait(w, "awaiting-full")
        self.assertEqual(state["pendingFull"]["allowedDirections"], ["upload", "download"])
        self.assertEqual(state["pendingFull"]["recommendedDirection"], "download")
        self.assertEqual(state["pendingFull"]["localNoteCount"], 0)
        self.assertEqual(w.sync.pending["serverUsn"], 7)

    def test_post_operation_cancel_clears_full_decision(self):
        w = self.worker()
        def operation():
            public = {"token": "do-not-retain", "allowedDirections": ["upload"],
                      "recommendedDirection": "upload", "localNoteCount": 1}
            w.sync.pending = {"public": public, "expires": time.monotonic() + 60, "serverUsn": 0}
            w.sync.update(phase="awaiting-full", pendingFull=public)
            # Cancellation arriving after the operation's last internal check.
            w.sync.cancelled.set()
        w.sync.start("syncing", operation)
        state = self.wait(w, "cancelled")
        self.assertIsNone(state["pendingFull"])
        self.assertIsNone(w.sync.pending)
        self.raises_code("STALE_CONFIRMATION", w, "sync.confirm", {"token": "do-not-retain", "direction": "upload"})

    def test_media_drain_survives_abort_and_completed_status_errors(self):
        w = self.worker()
        w.open()
        def operation():
            w.sync.media_running = True
            raise RuntimeError("SECRET-EXCEPTION-DETAIL")
        with patch.object(w.col, "abort_media_sync", side_effect=RuntimeError("abort failed")) as abort:
            with patch.object(w.col, "media_sync_status", side_effect=[RuntimeError("completed error"),
                    SimpleNamespace(active=True), SimpleNamespace(active=False)]) as monitor:
                w.sync.start("media", operation)
                state = self.wait(w, "error")
                self.assertEqual(abort.call_count, 1)
                self.assertEqual(monitor.call_count, 3)
        self.assertFalse(w.sync.media_running)
        self.assertNotIn("SECRET-EXCEPTION-DETAIL", json.dumps(state))
        self.assertIn("partially completed", state["error"]["message"])

    def test_backup_exact_media_and_no_credentials(self):
        w = self.worker()
        self.add_note(w, "Original")
        w.col.media.write_data("media-test.txt", b"media bytes")
        w.sync.auth = "DO-NOT-COPY-TOKEN"
        w.sync.persist()
        backup = w.sync.stable_backup()
        self.assertTrue((backup / "collection.anki2").is_file())
        connection = sqlite3.connect(backup / "collection.anki2")
        try:
            self.assertEqual(connection.execute("select count(*) from notes").fetchone()[0], 1)
        finally:
            connection.close()
        self.assertEqual((backup / "collection.media/media-test.txt").read_bytes(), b"media bytes")
        self.assertFalse((backup / "sync-state.dpapi").exists())
        self.assertTrue(json.loads((backup / "backup.json").read_text())["complete"])
        self.assertEqual(w.col.note_count(), 1)
        from anki.config import Config
        self.assertFalse(w.col.get_config_bool(Config.Bool.RENDER_LATEX))

    def test_local_native_sync_roundtrip_notes_media_full_and_normal(self):
        endpoint = self.start_server()
        a, b = self.worker("a", endpoint), self.worker("b", endpoint)
        self.add_note(a, "Roundtrip-one")
        a.col.media.write_data("sync-test.txt", b"official media roundtrip")
        self.assertTrue(self.login(a)["loggedIn"])
        a.dispatch("sync.run", {})
        state = self.wait(a, "awaiting-full")
        self.assertIn("upload", state["pendingFull"]["allowedDirections"])
        token = state["pendingFull"]["token"]
        server_usn = a.sync.pending["serverUsn"]
        with patch.object(a.col, "full_upload_or_download", wraps=a.col.full_upload_or_download) as full:
            with patch.object(a.col, "sync_media", wraps=a.col.sync_media) as media:
                a.dispatch("sync.confirm", {"token": token, "direction": "upload"})
                complete = self.wait(a, "success")
                self.assertEqual(full.call_args.kwargs["server_usn"], server_usn)
                self.assertEqual(media.call_count, 0, "Full sync must monitor native-started media, not start twice")
        self.assertIsNotNone(complete["lastSyncAt"])
        self.assertTrue(Path(complete["lastBackupPath"]).is_dir())
        self.raises_code("STALE_CONFIRMATION", a, "sync.confirm", {"token": token, "direction": "upload"})
        self.assertTrue(self.login(b)["loggedIn"])
        b.dispatch("sync.run", {})
        state = self.wait(b, "awaiting-full")
        self.assertIn("download", state["pendingFull"]["allowedDirections"])
        b.dispatch("sync.confirm", {"token": state["pendingFull"]["token"], "direction": "download"})
        self.wait(b, "success")
        self.assertEqual(b.col.note_count(), 1)
        self.assertEqual(Path(b.col.media.dir(), "sync-test.txt").read_bytes(), b"official media roundtrip")
        self.add_note(b, "Roundtrip-two")
        b.dispatch("sync.run", {})
        self.wait(b, "success")
        a.dispatch("sync.run", {})
        self.wait(a, "success")
        self.assertEqual(a.col.note_count(), 2)
        protected = (a.root / "sync-state.dpapi").read_bytes()
        for forbidden in (b"secret-test-password", a.sync.auth.encode()):
            self.assertNotIn(forbidden, protected)
        self.assertNotIn(a.sync.auth, json.dumps(a.dispatch("sync.status", {})))

    def test_native_bad_login_and_auth_rejection_clear_saved_auth(self):
        endpoint = self.start_server()
        w = self.worker(endpoint=endpoint)
        failed = self.login(w, "incorrect-password")
        self.assertEqual(failed["phase"], "error", failed)
        self.assertFalse(failed["loggedIn"])
        self.assertNotIn("incorrect-password", json.dumps(failed))
        self.assertTrue(self.login(w)["loggedIn"])
        w.sync.auth = "invalid-token-sentinel"
        w.sync.persist()
        w.dispatch("sync.run", {})
        failed = self.wait(w, "error")
        self.assertEqual(failed["error"]["code"], "SYNC_AUTH", failed)
        self.assertFalse(failed["loggedIn"])
        self.assertIsNone(w.sync.store.load()["hkey"])

    def test_native_login_and_media_cancel_responsive_without_cloud(self):
        for operation in ("login", "media"):
            with self.subTest(operation=operation):
                listener = socket.socket()
                listener.bind(("127.0.0.1", 0))
                listener.listen(1)
                listener.settimeout(5)
                endpoint = "http://127.0.0.1:" + str(listener.getsockname()[1]) + "/"
                accepted, release = threading.Event(), threading.Event()
                def blackhole():
                    try:
                        connection, _ = listener.accept()
                        with connection:
                            connection.recv(65536)
                            accepted.set()
                            release.wait(8)
                    except OSError:
                        pass
                server_thread = threading.Thread(target=blackhole, daemon=True)
                server_thread.start()
                w = self.worker(operation, endpoint)
                try:
                    if operation == "login":
                        w.dispatch("account.login", {"username": "local@example.invalid", "password": "DO-NOT-LOG-THIS"})
                    else:
                        w.sync.auth = "local-only-token"
                        w.sync.start("media", w.sync.media_sync)
                    self.assertTrue(accepted.wait(4), "Native local request did not arrive")
                    started = time.monotonic()
                    self.assertTrue(w.dispatch("sync.status", {})["active"])
                    w.dispatch("sync.cancel", {})
                    self.assertLess(time.monotonic() - started, 1.0)
                    state = self.wait(w, "cancelled")
                    self.assertFalse(w.sync.media_running)
                    self.assertNotIn("DO-NOT-LOG-THIS", json.dumps(state))
                    self.assertNotIn("local-only-token", json.dumps(state))
                finally:
                    release.set()
                    listener.close()
                    server_thread.join(5)

    def test_jsonl_sync_status_config_and_no_credential_echo(self):
        client = Client(self.root / "jsonl")
        try:
            self.assertFalse(client.request("sync.status")["loggedIn"])
            self.assertFalse(client.request("sync.configure", {"autoSync": False})["settings"]["autoSync"])
            client.request("account.login", {"username": "", "password": "DO-NOT-LOG-JSONL"}, error="INVALID_PARAMS")
            client.request("sync.run", {"endpoint": "http://127.0.0.1/"}, error="VALIDATION_ERROR")
            self.assertEqual(client.request("review.discard"), {"discarded": True})
            self.assertNotIn("DO-NOT-LOG-JSONL", client.diagnostics())
            self.assertFalse(client.request("account.logout")["loggedIn"])
        finally:
            client.close()

    def test_native_offline_failure_retains_protected_token(self):
        endpoint = self.start_server()
        w = self.worker(endpoint=endpoint)
        self.assertTrue(self.login(w)["loggedIn"])
        token = w.sync.auth
        self.stop_server()
        w.dispatch("sync.run", {})
        failed = self.wait(w, "error")
        self.assertTrue(failed["loggedIn"])
        self.assertEqual(w.sync.store.load()["hkey"], token)
        self.assertNotIn(token, json.dumps(failed))


if __name__ == "__main__":
    unittest.main()
