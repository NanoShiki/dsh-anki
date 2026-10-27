# Verification record — 2.0.0 / 2026-10-27

## 2.0.0 package identity rename

The technical package identity moves from `@local/dsh-anki` to `@nanoshiki/dsh-anki` so the plugin manager card no longer reads as a local package. `cordis.patch.yml` keeps its entry id `local-anki`, and the service namespace `ankiWorkspace`, AI tool `anki`, panel `anki-workspace`, locale namespace and default profile-relative `data/anki-workspace` directory are unchanged, so the collection is reused rather than migrated. Tests, the release verifier and the manifest guard assert the new identity; the historical 1.2.x–1.4.x sections below intentionally keep the old name.

Because a package rename is a new identity, existing `@local/dsh-anki` installs cannot be upgraded in place: the migration steps in the README require disabling the old package, keeping the data directory, and installing the new one with the same `dataDir`.

## 1.4.2 DSH 0.2.1-rc.3 compatibility

After DSH moved from 0.2.1-rc.2 to 0.2.1-rc.3, the market plugin (`dshmarket`) reported a compatibility-risk banner for this plugin. Reproduced with the market's own analyzer (`dshmarket/lib/compatibility.js::assessCompatibility`) against the installed profile: both host peers were declared as exact versions `0.2.1-rc.2` while the runtime provides `0.2.1-rc.3`, producing two `aboveMax` risks (`@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-typert-protocol`).

Fix: declare those peers as `^0.2.1-rc.2`, which admits the rc.3 host and later 0.2.1 patches. Re-running the same analyzer over a profile with the new manifest reports **zero risks and zero warnings**. `tests/check_manifest.py` now fails the build if `engines.dsh` or any `@deepseek-ai/dsh*` peer is an exact pin, so a routine DSH patch release cannot silently reintroduce the banner. The 48-check real Host/Gateway smoke test passes on the rc.3 runtime, and the bundled core/runtime files are byte-identical (352 + 34 pinned hashes unchanged).

## 1.4.1 plugin display name

Both locale files now carry a `meta.title`/`meta.description` block, which is the metadata DSH's plugin manager reads to label an installed plugin (`meta.title`, falling back to the technical package name). The list card therefore shows **Anki** in both languages while the technical identity stays `@local/dsh-anki`. No runtime, collection, worker, sync or UI behavior changed; the client still reads the same locale dictionaries.

## 1.4.0 bundled headless core

- Official PyPI Windows-compatible wheels for Anki 26.5 and eleven runtime dependencies assembled without pip/install hooks. All 352 extracted files and 34 CPython runtime files are hash-pinned. No desktop Anki/Qt/aqt, private collection, credentials or bytecode caches are packaged.
- Default loader selects module-relative bundled runtime/core; explicit absolute overrides are preserved with no external fallback. Python bytecode writes are disabled for the worker.
- **39/39 Python integration tests passed** against bundled core, including native notes/review/APKG/media, deletion safety, DPAPI and localhost native sync. **82/82 JavaScript tests passed** including loader defaults, missing-artifact behavior and path validation.
- **48 real Host/Gateway smoke checks passed** with empty plugin config and bundled core, validating owner-only operations and shared UI/tool collection. No actual user profile was opened.
- The candidate tgz was verified, extracted into a separate unrelated directory, then tested with poisoned `PYTHONHOME`, `PYTHONPATH` and `ANKI_PACKAGES`. All 13 probed third-party modules resolved inside that extracted package; Python's entire search path was its bundled core/stdlib/runtime. Default worker created an isolated collection, added/searched a note, revealed/rated a review and exported APKG successfully.
- A static normal/delay PE import inspection of bundled EXE/DLL/PYD files found only bundled runtime DLLs and Windows system dependencies, not an external Anki/Qt/VC installer dependency.
- This is relocation/import-isolation evidence on this Windows host, **not** a new Windows VM installation or a byte-for-byte rebuild of upstream binaries. An attempted system-Temp smoke fixture hit a Windows write denial; permission inspection made no changes. Successful tests used fresh project-local isolated fixtures.
- Upstream source and dependency notices accompany the release. Real AnkiWeb credentials/cloud sync and authenticated plugin-manager installation remain owner-driven acceptance checks; automated tests never touch the production collection.

## 1.3.1 documentation-only release

The README was rewritten to lead with Chinese and keep a condensed English summary at the end. Only `README.md`, `VERIFICATION.md` and the release version changed; `client.js`, both locale files, the backend, the worker, sync, the owner/AI routes, `cordis.patch.yml` and all 34 runtime files are byte-identical to 1.3.0, so the 1.3.0 client/browser evidence below still applies unchanged.

## 1.3.0 visual redesign

The native page now uses the layout direction confirmed by the owner's reference image: pale neutral canvas, teal primary/active accents, a headline with sync and start-review shortcuts, a bordered six-stat strip, underline tab bar spanning the full workspace, and three rounded panels for decks, search results and the note editor. DSH's own left navigation is host-owned and is neither duplicated nor modified by the plugin.

Every value shown is real collection data. The redesign adds no invented timestamps, no placeholder health/“connected” claims, no fake rich-text controls and no dead icon buttons. The editor still edits Anki HTML fields in textareas, tags remain a space-separated input, and the note context strip shows the actual deck, model and note ID. Deck creation, rename and deletion moved into toggle-revealed controls in the deck panel (`aria-expanded` plus real forms), so the deck list keeps its height; deletion keeps the owner-only preview token, exact-name confirmation, Default-deck protection and sync lockout. The engine/collection footer moved into the deck panel.

Bounded height and internal scrolling are preserved and extended: the root remains `overflow:hidden` with a shrinkable flex/grid chain, results and editor scroll independently, pagination is outside the results scroller, and the deck panel, editor fields and other tabs scroll internally. Tabs now sit above the deck/results/editor region so they never consume list height. Below 1050 CSS px the results and editor stack; below 620 px the deck panel collapses to a horizontal rail whose controls replace the deck strip while expanded.

**Full-workspace real-Chromium regression passed:** [viewport test](<tests/viewport-browser.mjs>) renders the actual registered Workspace and child components with deterministic React state stubs and the exact source CSS, without plugin-selector overrides. Eight states per viewport (browse, both expanded deck-control states, add, review, transfer, signed-out sync, full-sync confirmation) were measured at 1440×960, 470×960, 1100×600, and 1050×900 / 570×960 at 150%. CDP enforces the exact CSS viewport and DPR (browser-zoom emulation, not toolbar interaction). Checks prove the 50th row and the pager are visible after list-only scrolling, every editor field label and the save/suspend controls are internally reachable, the last deck and all expansion controls are reachable, and no document/host/whole-workspace overflow occurs. The immutable 1.2.1 commit `1e4c2698daea0d155ae96512db57a301c8b765da` still reproduces the original off-viewport failure. Generated reports, screenshots and profiles remain ignored and are not packaged. This is a synthetic bounded host shell, not the installed/authenticated DSH UI.

Only `client.js`, `locale/en.json`, `locale/zh.json`, the release version and these documents changed. Collection, native worker, sync/DPAPI, owner/AI RPCs, transport, package/service/data identities and all 34 runtime files are unchanged. The [read-only redesign-release comparison](<tests/review_redesign_release.py>) enforces that changed-file list, proves the archive matches this source tree, and checks locale key parity/superset. The earlier [layout-only comparison](<tests/review_viewport_release.py>) remains the record for the 1.2.1→1.2.2 archive pair.

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
pnpm pack --out D:/Anki/dsh-anki-1.3.1.tgz
runtime/python.exe tests/verify_release.py D:/Anki/dsh-anki-1.3.1.tgz
runtime/python.exe tests/review_redesign_release.py D:/Anki/dsh-anki-1.2.2.tgz D:/Anki/dsh-anki-1.3.0.tgz
```

## Acceptance boundaries

- **Live installation, default-type/deletion UI behavior, actual AnkiWeb login and real-cloud sync require owner acceptance on the target installation.** Isolated test results do not establish those outcomes. See the [acceptance checklist](<ACCEPTANCE.md>).
- Client unit tests use structural React stubs; real-Chromium checks cover an isolated list fixture and the complete actual Workspace DOM/CSS using synthetic state and a bounded synthetic host. They are **not authenticated production UI, media/accessibility end-to-end testing or sanitization/security penetration testing**. Real-cloud network behavior remains an acceptance item despite native localhost coverage.
- Use the existing authenticated DSH plugin manager and GUI; no alternate server or unverified HMR behavior is required. Follow the manager's actual refresh/restart instructions, open Anki → Sync, and verify account/decks/media deliberately. A new conversation may be needed to refresh cached AI tool metadata.
- A preliminary v1 TEMP fixture hit Windows directory permissions; it was abandoned without ACL changes. Successful tests use workspace-owned isolated fixtures. No ACL repair was attempted.

Failed/cancelled sync may partially change local/cloud state; full-sync backups protect local state only. See [README](<README.md>) for data safety and supported scope.
