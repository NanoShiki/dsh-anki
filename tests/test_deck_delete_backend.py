"""Real temporary-core deletion previews/confirmation; never opens user profiles."""
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest.mock import patch

from test_backend import Client, PACKAGES, PROJECT
sys.path.insert(0, str(PROJECT / "backend"))
from worker import Worker, RequestError


class DeckDeleteTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix=".test-deck-delete-", dir=PROJECT / "backend")
        self.root = Path(self.temp.name)
        self.worker = Worker(self.root / "data", str(PACKAGES))
        self.worker.open()
        self.col = self.worker.col

    def tearDown(self):
        self.worker.close()
        self.temp.cleanup()

    def request(self, action, params=None, error=None):
        if error:
            with self.assertRaises(RequestError) as raised:
                self.worker.dispatch(action, params or {})
            self.assertEqual(raised.exception.code, error)
            return raised.exception
        return self.worker.dispatch(action, params or {})

    def deck(self, name):
        return self.request("decks.create", {"name": name})["id"]

    def note(self, deck, front="question", templates=1):
        model = next(m for m in self.col.models.all()
                     if m["type"] == 0 and len(m["flds"]) == 2 and len(m["tmpls"]) == templates
                     and not any("{{type:" in t["qfmt"] for t in m["tmpls"]))
        return self.request("notes.add", {"deckId": deck, "modelId": model["id"],
            "fields": {model["flds"][0]["name"]: front, model["flds"][1]["name"]: "answer"}})

    def filtered(self, name, search=""):
        deck = self.col.decks.new_deck_legacy(True)
        deck["name"] = name
        deck["terms"][0][0] = search
        deck["terms"][0][1] = 100
        did = self.col.decks.add_deck_legacy(deck).id
        self.col.sched.rebuild_filtered_deck(did)
        return did

    def preview(self, deck):
        return self.request("decks.delete.preview", {"deckId": deck})

    def delete(self, preview, **changes):
        params = {"token": preview["token"], "confirmName": preview["name"]}
        params.update(changes)
        return self.request("decks.delete", params)

    def test_nested_native_delete_preserves_media_and_invalidates_review_and_undo(self):
        keep = self.deck("Keep")
        self.note(keep, "Keep for review")
        first = self.request("review.next", {"deckId": keep})
        self.request("review.reveal", {"token": first["token"]})
        self.request("review.answer", {"token": first["token"], "rating": 3})
        self.assertTrue(self.worker.review_steps)
        parent = self.deck("删除 Root")
        child = self.deck("删除 Root::Child")
        grandchild = self.deck("删除 Root::Child::Grandchild")
        for did in (parent, child, grandchild):
            self.note(did, "To delete " + str(did))
        self.col.media.write_data("retained-image.png", b"media is never deleted here")
        current = self.request("review.next", {"deckId": parent})
        pending = self.preview(parent)
        self.assertEqual((pending["deckCount"], pending["cardCount"], pending["noteCount"], pending["returnedCardCount"]), (3, 3, 3, 0))
        self.assertFalse(pending["filtered"])
        self.assertEqual(self.worker.current["token"], current["token"])
        self.assertGreater(pending["expiresAt"], int(time.time() * 1000) + 299000)
        with patch.object(self.col.decks, "remove", wraps=self.col.decks.remove) as native:
            result = self.delete(pending)
            native.assert_called_once_with([parent])
        self.assertTrue(result["deleted"])
        self.assertNotIn("token", result)
        self.assertEqual(self.col.card_count(), 1)
        self.assertEqual(self.col.note_count(), 1)
        self.assertIsNone(self.worker.current)
        self.assertEqual(self.worker.review_steps, [])
        self.assertEqual(Path(self.col.media.dir(), "retained-image.png").read_bytes(), b"media is never deleted here")
        self.request("review.reveal", {"token": current["token"]}, error="STALE_TOKEN")
        self.request("review.undo", error="UNDO_UNAVAILABLE")
        for did in (parent, child, grandchild):
            self.assertIsNone(self.col.decks.get(did, default=False))
        self.assertIsNotNone(self.col.decks.get(keep, default=False))

    def test_shared_note_sibling_card_and_media_survive(self):
        target, keep = self.deck("Target"), self.deck("Keep")
        note = self.note(target, templates=2)
        self.assertEqual(len(note["cards"]), 2)
        sibling = note["cards"][1]["id"]
        self.col.set_deck([sibling], keep)
        self.col.media.write_data("shared.mp3", b"sound bytes")
        pending = self.preview(target)
        self.assertEqual((pending["cardCount"], pending["noteCount"]), (1, 0))
        self.delete(pending)
        survivor = self.col.get_note(note["id"])
        self.assertEqual([c.id for c in survivor.cards()], [sibling])
        self.assertEqual(survivor.cards()[0].did, keep)
        self.assertEqual(Path(self.col.media.dir(), "shared.mp3").read_bytes(), b"sound bytes")

    def test_orphan_note_count_is_unique_across_deleted_sibling_decks(self):
        parent, child = self.deck("Both"), self.deck("Both::Child")
        note = self.note(parent, templates=2)
        self.col.set_deck([note["cards"][1]["id"]], child)
        pending = self.preview(parent)
        self.assertEqual((pending["deckCount"], pending["cardCount"], pending["noteCount"]), (2, 2, 1))
        self.delete(pending)
        self.assertEqual((self.col.card_count(), self.col.note_count()), (0, 0))

    def test_normal_deletes_its_odid_cards_inside_external_filtered_deck(self):
        target, keep = self.deck("Target"), self.deck("Keep")
        doomed = self.note(target, "Doomed")
        surviving = self.note(keep, "Survives")
        filtered = self.filtered("Filtered")
        borrowed = self.col.get_card(doomed["cards"][0]["id"])
        self.assertEqual((borrowed.did, borrowed.odid), (filtered, target))
        pending = self.preview(target)
        self.assertEqual((pending["cardCount"], pending["noteCount"], pending["returnedCardCount"]), (1, 1, 0))
        self.delete(pending)
        self.assertEqual(self.col.note_count(), 1)
        self.assertEqual(self.col.get_note(surviving["id"]).cards()[0].did, filtered)
        self.assertEqual(self.col.get_note(surviving["id"]).cards()[0].odid, keep)
        self.assertIsNotNone(self.col.decks.get(filtered, default=False))
        remaining = self.preview(filtered)
        self.assertEqual((remaining["cardCount"], remaining["noteCount"], remaining["returnedCardCount"]), (0, 0, 1))

    def test_filtered_delete_restores_original_decks_scheduling_and_notes(self):
        one, two = self.deck("One"), self.deck("Two")
        notes = [self.note(one, "One"), self.note(two, "Two")]
        originals = {c["id"]: self.col.get_card(c["id"]) for n in notes for c in n["cards"]}
        filtered = self.filtered("Only filtered")
        pending = self.preview(filtered)
        self.assertTrue(pending["filtered"])
        self.assertEqual((pending["deckCount"], pending["cardCount"], pending["noteCount"], pending["returnedCardCount"]), (1, 0, 0, 2))
        self.delete(pending)
        self.assertEqual((self.col.note_count(), self.col.card_count()), (2, 2))
        for cid, original in originals.items():
            card = self.col.get_card(cid)
            self.assertEqual((card.did, card.odid, card.due, card.queue), (original.did, 0, original.due, original.queue))

    def test_mixed_subtree_deletes_normal_and_returns_only_external_cards(self):
        parent, child, keep = self.deck("Tree"), self.deck("Tree::Child"), self.deck("Keep")
        self.note(parent, "Root note")
        self.note(child, "Child note")
        survivor = self.note(keep, "Outside note")
        self.filtered("Tree::Filtered")
        pending = self.preview(parent)
        self.assertEqual((pending["deckCount"], pending["cardCount"], pending["noteCount"], pending["returnedCardCount"]), (3, 2, 2, 1))
        self.delete(pending)
        self.assertEqual((self.col.note_count(), self.col.card_count()), (1, 1))
        card = self.col.get_note(survivor["id"]).cards()[0]
        self.assertEqual((card.did, card.odid), (keep, 0))

    def test_default_id_protected_even_if_renamed_into_parent(self):
        self.note(1, "Default must survive")
        self.request("decks.delete.preview", {"deckId": 1}, error="DEFAULT_DECK_PROTECTED")
        self.col.decks.rename(1, "Renamed default")
        self.request("decks.delete.preview", {"deckId": 1}, error="DEFAULT_DECK_PROTECTED")
        self.col.decks.rename(1, "Parent::Protected default")
        parent = self.col.decks.id_for_name("Parent")
        self.request("decks.delete.preview", {"deckId": parent}, error="DEFAULT_DECK_PROTECTED")
        self.assertEqual((self.col.note_count(), self.col.card_count()), (1, 1))

    def test_one_use_wrong_token_name_expiry_and_replacement(self):
        did = self.deck("精确 :: Unicode")
        self.note(did)
        for changes, expected in (({"token": "invalid-token"}, "STALE_CONFIRMATION"),
                                  ({"token": "错误"}, "STALE_CONFIRMATION"),
                                  ({"confirmName": "Unicode"}, "CONFIRMATION_MISMATCH"),
                                  ({"confirmName": " "}, "VALIDATION_ERROR")):
            with self.subTest(changes=changes):
                preview = self.preview(did)
                self.request("decks.delete", {"token": preview["token"], "confirmName": preview["name"]} | changes, error=expected)
                self.request("decks.delete", {"token": preview["token"], "confirmName": preview["name"]}, error="STALE_CONFIRMATION")
                self.assertEqual(self.col.note_count(), 1)
        preview = self.preview(did)
        self.worker.deck_delete_confirmation["expires"] = time.monotonic() - 1
        self.request("decks.delete", {"token": preview["token"], "confirmName": preview["name"]}, error="STALE_CONFIRMATION")
        old = self.preview(did)
        newer = self.preview(did)
        self.assertNotEqual(old["token"], newer["token"])
        self.request("decks.delete", {"token": old["token"], "confirmName": old["name"]}, error="STALE_CONFIRMATION")
        self.request("decks.delete", {"token": newer["token"], "confirmName": newer["name"]}, error="STALE_CONFIRMATION")
        final = self.preview(did)
        self.delete(final)
        self.request("decks.delete", {"token": final["token"], "confirmName": final["name"]}, error="STALE_CONFIRMATION")

    def test_scope_changes_same_counts_subtree_and_note_edits_are_rejected(self):
        for change in ("child", "rename", "same-count-card-swap", "note-edit", "removed"):
            with self.subTest(change=change):
                target, outside = self.deck("Target " + change), self.deck("Outside " + change)
                note = self.note(target, change)
                keep = self.note(outside, "Outside " + change)
                preview = self.preview(target)
                if change == "child":
                    self.deck("Target " + change + "::New child")
                elif change == "rename":
                    self.col.decks.rename(target, "New name " + change)
                elif change == "same-count-card-swap":
                    self.col.set_deck([note["cards"][0]["id"]], outside)
                    self.col.set_deck([keep["cards"][0]["id"]], target)
                elif change == "note-edit":
                    native_note = self.col.get_note(note["id"])
                    native_note.fields[0] += " changed after consent"
                    self.col.update_note(native_note)
                else:
                    self.col.decks.remove([target])
                self.request("decks.delete", {"token": preview["token"], "confirmName": preview["name"]}, error="DELETE_SCOPE_CHANGED")
                self.assertIsNone(self.worker.deck_delete_confirmation)

    def test_orphan_count_change_invalidates_preview(self):
        target, outside = self.deck("Target"), self.deck("Outside")
        note = self.note(target, templates=2)
        sibling = note["cards"][1]["id"]
        self.col.set_deck([sibling], outside)
        preview = self.preview(target)
        self.assertEqual(preview["noteCount"], 0)
        self.col.remove_cards_and_orphaned_notes([sibling])
        self.request("decks.delete", {"token": preview["token"], "confirmName": preview["name"]}, error="DELETE_SCOPE_CHANGED")
        self.assertEqual(self.preview(target)["noteCount"], 1)

    def test_sync_busy_pending_gate_and_native_failure_consume(self):
        target = self.deck("Target")
        self.note(target)
        preview = self.preview(target)
        self.worker.sync.update(active=True)
        try:
            self.request("decks.delete.preview", {"deckId": target}, error="SYNC_BUSY")
            self.request("decks.delete", {"token": preview["token"], "confirmName": preview["name"]}, error="SYNC_BUSY")
        finally:
            self.worker.sync.update(active=False)
        public = {"token": "full-sync", "allowedDirections": ["download"], "recommendedDirection": "download", "localNoteCount": 1}
        self.worker.sync.pending = {"public": public, "expires": time.monotonic() + 60, "serverUsn": 0}
        self.worker.sync.update(phase="awaiting-full", pendingFull=public)
        self.request("decks.delete.preview", {"deckId": target}, error="SYNC_CONFIRMATION_REQUIRED")
        self.request("decks.delete", {"token": preview["token"], "confirmName": preview["name"]}, error="SYNC_CONFIRMATION_REQUIRED")
        self.request("sync.dismiss")
        with patch.object(self.col.decks, "remove", side_effect=RuntimeError("simulated native failure")) as native:
            with self.assertRaises(RuntimeError):
                self.delete(preview)
            native.assert_called_once_with([target])
        self.assertIsNone(self.worker.deck_delete_confirmation)
        self.assertEqual(self.col.note_count(), 1)
        self.delete(self.preview(target))

    def test_stock_typed_models_flag_and_custom_whitespace_case_insensitive(self):
        models = self.request("models.list")
        typed = next(m for m in models if "type in" in m["name"].lower())
        self.assertIs(typed["isTypeInAnswer"], True)
        self.assertTrue(all(isinstance(m["isTypeInAnswer"], bool) for m in models))
        for model in models:
            if model["type"] == 1 or "image occlusion" in model["name"].lower():
                self.assertFalse(model["isTypeInAnswer"])
        native = self.col.models.get(typed["id"])
        native["tmpls"][0]["qfmt"] = native["tmpls"][0]["qfmt"].replace("{{type:", "{{ TyPe :")
        # Temporary test note type only; stock production/user models are untouched.
        native["id"] = 0
        native["name"] = "Custom whitespace typed"
        self.col.models.add_dict(native)
        custom = next(m for m in self.request("models.list") if m["name"] == native["name"])
        self.assertTrue(custom["isTypeInAnswer"])

    def test_jsonl_owner_protocol_strict_params_and_real_delete(self):
        client = Client(self.root / "protocol")
        try:
            target = client.request("decks.create", {"name": "Protocol target"})["id"]
            client.request("decks.delete.preview", {"deckId": True}, error="VALIDATION_ERROR")
            client.request("decks.delete.preview", {"deckId": target, "path": "outside"}, error="VALIDATION_ERROR")
            client.request("decks.delete.preview", {"deckId": 999999}, error="NOT_FOUND")
            preview = client.request("decks.delete.preview", {"deckId": target})
            result = client.request("decks.delete", {"token": preview["token"], "confirmName": preview["name"]})
            self.assertEqual(result["deckCount"], 1)
            self.assertTrue(result["deleted"])
            self.assertFalse(any(d["id"] == target for d in client.request("decks.list")))
            self.assertTrue(any(m["isTypeInAnswer"] for m in client.request("models.list")))
        finally:
            client.close()


if __name__ == "__main__":
    unittest.main()
