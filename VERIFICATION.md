# Verification record — 1.2.2 / 2026-10-23

## 1.2.2 viewport-bound scrolling

The workspace now follows the DSH main slot's available height instead of allowing the entire Anki page to scroll around fixed 300/600px search lists. The root, layout, tab, browse and results tracks form a shrinkable flex/grid chain. Search results and the note editor scroll independently, pagination remains outside the results scroller, and other tabs have their own content scroller. The deck sidebar, overflowed overview/notices and deletion confirmation retain bounded internal scrolling so controls are not merely clipped. Responsive layouts allocate bounded rows to the deck/results/editor regions. On narrow layouts, decorative header text is omitted, statistics can scroll horizontally, and the results receive a larger share of the vertical split so the list does not collapse to zero height at enlarged scale.

**Full-workspace real-Chromium regression passed:** [viewport test](<tests/viewport-browser.mjs>) renders the actual registered Workspace and child components (all headers, 60 decks, 50 long note rows, six-field editor, tabs and footer) with deterministic React state stubs and the exact source CSS, without plugin-selector overrides. All **30 cases** passed: browse/add/review/transfer/signed-out sync/full-sync confirmation at 1440×960, 470×960, 1100×600, and 1050×900 / 570×960 at 150%. CDP enforces exact CSS viewport and DPR (browser-zoom emulation, not toolbar interaction). The immutable 1.2.1 commit `1e4c2698daea0d155ae96512db57a301c8b765da` reproduces outer overflow in all five sizes. Checks prove the entire 50th row is visible after list-only scrolling, pagination stays visible, the editor save/suspend controls and last deck/management controls are internally reachable, and no document/host/whole-workspace overflow or scrolling occurs. Same-state wide and narrow/150% screenshots were inspected. Generated reports/screenshots/profiles remain ignored and are not packaged. This is a synthetic bounded host shell, not the installed/authenticated DSH UI.

Only client CSS and five layout wrappers/classes changed at runtime. Collection, native worker, sync/DPAPI, owner/AI RPCs, transport, package/service/data identities and all 34 runtime files are unchanged. The [read-only layout-release comparison](<tests/review_viewport_release.py>) enforces the exact archive changed-file list and those five client substitutions outside CSS.

## 1.2.1 package rename

Package and native client bundle identities are now `@local/dsh-anki`; the installation patch references that name with ID `local-anki`. Repository metadata points to `NanoShiki/dsh-anki`. The AI tool `anki`, RPC/locale namespace `ankiWorkspace`, sidebar identifiers and default profile-relative `data/anki-workspace` are unchanged. This is a new package identity: keep the previous package disabled, preserve the data directory and transfer any custom settings before enabling the replacement. See [installation precautions](<README.md>).

Public documentation generalizes installation acceptance and does not disclose a user's collection statistics or live-profile activity. The runtime, native worker, sync implementation and licenses are retained unchanged. The [rename comparison](<tests/review_rename_release.py>) checks the previous and new archives without extraction, with a strict changed-file allow-list and an exact one-line client identity change.

## Default type and safe deck management

New-note selection prefers the Chinese/English typed-answer Basic name, then an explicit native-template `isTypeInAnswer` flag, with ordinary Basic before Image Occlusion as fallback. Refresh preserves an existing manual selection. No production model was changed.

Deck deletion is available only through the authenticated owner `deckAction` RPC, not the AI/public execute action list. The worker issues a five-minute single-use preview token, requires the exact deck name, and rechecks the deck/card/orphan-note impact snapshot before native removal. Default ID-1 decks (including descendants of the target) are protected. Normal removal includes cards temporarily held by filtered decks; deleting filtered decks returns cards. Shared notes with surviving cards and media are retained. Review/undo tokens are invalidated; successful deletion participates in the existing 15-second idle sync debounce, with queue-head epoch protection and native busy/full-confirm gates. Preview/failed confirmation do not delete anything. No automatic backup or review undo is promised for deletion: the confirmation recommends export first and warns about cloud propagation.

## 1.1.1 layout hotfix (retained)

Long preview/metadata text could overlap in populated search results. A height-limited flex-column list was shrinking note buttons to the shared 34px minimum while their multiline contents remained taller. Note/deck rows now opt out of shrinking; notes retain automatic height, and long metadata can wrap. That historical hotfix changed no worker, sync, credential, collection, runtime or permission implementation.

The [isolated browser regression](<tests/layout-browser.mjs>) runs installed Edge Chromium 155 against synthetic local HTML with the exact final CSS extracted from the client, not appended candidate styles. Both 470px/normal-scale and 260px/150%-CSS-zoom cases passed: old row rules reproduce 49 adjacent overlaps across 50 results; final rules give zero overlaps, zero vertical/horizontal text overflow, retained scrolling and a reachable 50th result. Mixed Chinese/English previews and long unbroken model/deck names are included. The normal-scale comparison screenshot was visually inspected. Unique test-only browser profiles are used; no live GUI session, account or collection is accessed.

Target: Windows x64; DSH 0.2.1-rc.2; external Anki 26.05 build e64c6b1a; bundled CPython 3.13.5. No real AnkiWeb account or desktop Anki profile was used.

## Passed

- **39 actual-core Python tests:** 13 [collection regressions](<tests/test_backend.py>), 13 [deck deletion/type regressions](<tests/test_deck_delete_backend.py>) and 13 [sync regressions](<tests/test_sync_backend.py>). Deletion tests cover child scopes, odid/filtered restoration, mixed subtree removal, unique orphan/shared-note counts, media retention, protected default/ancestor, exact/one-time/expired/replaced tokens, scope/content changes even at equal counts, native-only removal/failure, review invalidation and sync gates. Native decks/notes/search/conflicts, scheduling/reveal/ratings/undo/persistence, selected deck scope, OS lock, APKG/media roundtrip and bounds/path rejection remain covered.
- Sync coverage uses the **official native sync server on localhost**, with constructor-only test endpoint injection: real login/auth rejection, offline token retention, real Windows DPAPI ciphertext, native full upload → download with notes/media → incremental two-way sync, server media USN passthrough without duplicate media start, complete stable local backup including SQLite contents and media but no credentials, one-time/expired/direction-limited confirmation, empty-library download recommendation, mutation gating, JSONL credential non-echo, responsive real login/media cancellation against isolated local endpoints, and cancel/join ownership through native media drain (including abort/status errors). A deterministic pending-confirmation race case is included.
- **13 [worker transport tests](<tests/worker-client.test.mjs>):** serialization, bounded protocol, structured failures, cancellation, dispatch-time timeouts, generation quarantine, no mutation retry, native diagnostic redaction, invalid serialization before spawn, nonthrowing logging, and queue-head automatic eligibility guard.
- **16 [Host auto-sync tests](<tests/auto-sync.test.mjs>):** startup/periodic, 15-second activity debounce, outstanding review hold/release, disabled/signed-out/busy/full-decision suppression, account epochs, disposal, nonoverlap and failure backoff. Real transport-queue regressions prove that a queued review/mutation prevents automatic sync at actual dispatch, and inactive cancellation does not release an outstanding review hold.
- **43 client tests:** 10 [baseline/layout/package identity](<tests/client.test.mjs>), 18 [deck/type interactions](<tests/client-decks.test.mjs>) and 15 [sync](<tests/client-sync.test.mjs>): typed-answer default/fallback/manual-choice preservation, exact-name/deletion impact and cloud/backup warnings, filtered-return distinction, pending/ready cancellation, stale preview/handler protection on deck selection/refresh/sync, failure token consumption and default-ancestor messages; long-result and many-deck no-shrink style/structure regressions, metadata wrapping, native slot registration, baseline React, full inline/file bilingual parity, five tabs, explicit review deck, exact RPC envelopes, distinct owner-only account route, no raw credential errors, login without initial collection, early password clearing, status-only 1s/10s polling/cleanup, settings/manual trigger, allowed full direction + separate overwrite consent + one-time token, changing consent reset, native formatted media counters rendered as bounded React text with numeric-only transfer progress, empty upload-only libraries without an unavailable-download hint, progress/cancellation, retained drafts with stale-save blocking after success/partial error/cancel/full decision, hidden-poll job detection without repeated invalidation, transient-only review release.
- **48 grouped [actual Host/Gateway checks](<tests/host-smoke.mjs>):** installed Cordis/Typert/Gateway and actual Anki core, source-mode Remote discovery, shared UI/AI collection, CRUD/search/conflicts, cancellation, typed errors, strict owner-only account and deck RPCs including missing/guest principal, deletion preview/confirmation/error/success with scheduler release, oversized/invalid owner input rejection, deck deletion/credentials/full-confirm excluded from AI/public execute, status read-only and run/cancel full-access policy, encrypted preferences and no-network validation. Profile identity, tool registrar and policy decisions are test doubles; this is not a browser/authenticated production session.
- Source syntax and release runtime hashes checked. [Read-only release verifier](<tests/verify_release.py>) checks archive paths/types/duplicates/bounds, required sync/Host/client/docs, exact package version, no lifecycle scripts, all 34 bundled runtime hashes, no test fixtures/collections/native-core artifacts outside the runtime. [Feature-release comparison](<tests/review_deck_release.py>) compares 1.1.1 → 1.2.0 in memory without extraction: same packaged file set; only client, owner RPC, scheduler, worker, locales, version/docs changed. Runtime hashes, sync/DPAPI service, transport, patch and licenses are byte-identical.

## Source-checkout commands

Test files are intentionally omitted from the release tarball. From the source project:

```text
runtime/python.exe -m unittest discover -s tests -p 'test*backend.py' -v
node --test tests/worker-client.test.mjs tests/auto-sync.test.mjs tests/client.test.mjs tests/client-sync.test.mjs tests/client-decks.test.mjs
node tests/layout-browser.mjs
node tests/viewport-browser.mjs
```

Optional narrow/enlarged layout case (Bash):

```bash
LAYOUT_WIDTH=260 LAYOUT_ZOOM=1.5 node tests/layout-browser.mjs
```

Host smoke uses installed Electron Node with ASAR module-resolution fallback only for the test:

```bash
ELECTRON_RUN_AS_NODE=1 "D:/deepseekharness/DeepSeek Harness.exe" tests/host-smoke.mjs
```

Packaging/verification:

```text
pnpm pack --out D:/Anki/dsh-anki-1.2.2.tgz
runtime/python.exe tests/verify_release.py D:/Anki/dsh-anki-1.2.2.tgz
runtime/python.exe tests/review_viewport_release.py D:/Anki/dsh-anki-1.2.1.tgz D:/Anki/dsh-anki-1.2.2.tgz
```

## Acceptance boundaries

- **Live installation, default-type/deletion UI behavior, actual AnkiWeb login and real-cloud sync require owner acceptance on the target installation.** Isolated test results do not establish those outcomes. See the [acceptance checklist](<ACCEPTANCE.md>).
- Client unit tests use structural React stubs; real-Chromium checks cover an isolated list fixture and the complete actual Workspace DOM/CSS using synthetic state and a bounded synthetic host. They are **not authenticated production UI, media/accessibility end-to-end testing or sanitization/security penetration testing**. Real-cloud network behavior remains an acceptance item despite native localhost coverage.
- Use the existing authenticated DSH plugin manager and GUI; no alternate server or unverified HMR behavior is required. Follow the manager's actual refresh/restart instructions, open Anki → Sync, and verify account/decks/media deliberately. A new conversation may be needed to refresh cached AI tool metadata.
- A preliminary v1 TEMP fixture hit Windows directory permissions; it was abandoned without ACL changes. Successful tests use workspace-owned isolated fixtures. No ACL repair was attempted.

Failed/cancelled sync may partially change local/cloud state; full-sync backups protect local state only. See [README](<README.md>) for data safety and supported scope.
