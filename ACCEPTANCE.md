# Installation and live acceptance checklist

Automated checks use isolated temporary collections and localhost test services. They do not establish that a particular live installation, AnkiWeb account or cloud connection works. See [verification](<VERIFICATION.md>) for the tested scope. Do not publish collection contents, credentials or account-bearing screenshots when reporting a problem.

## Installation and upgrade

1. Wait for any sync to finish. In your authenticated DSH plugin manager, disable Anki and wait for its Python worker to exit; closing only its tab is insufficient on Windows.
2. Install the release archive through the manager, re-enable Anki, and follow its actual refresh/restart instructions. Do not manually replace profile/package-manager files or delete a collection to fix an installation error.
3. Open Anki and check that it uses its own independent workspace collection, not an Anki desktop profile. The sidebar should offer browsing, adding notes, review and synchronization.
4. Browse a long result list with multiline Chinese/English text and long names. Check that rows do not overlap and that the last result remains reachable, including in a narrow sidebar or enlarged view. The Anki page must stay within the DSH main panel: scroll the results to the last row without scrolling the whole page; pagination should stay visible. Independently scroll the editor to Save, expand the deck panel's create/manage controls, and scroll Add/Review/Import-export/Sync content to their bottom controls. Resize the DSH window and repeat. Check that the redesign shows only real values: counts from your collection, the actual deck in the editor context strip, and no placeholder timestamps or invented connectivity claims. DSH's own left navigation belongs to the host and is not part of this plugin.

## AnkiWeb authentication and synchronization

1. Open Anki → 同步 and verify the login form and auto-sync checkbox.
2. Enter credentials privately on that page, never in chat. Check for login/progress or a safe failure message.
3. If full synchronization is requested, verify the account and choose the intended permitted direction. For an empty local collection that should receive an existing cloud collection, choose **download from AnkiWeb**. Upload replaces the cloud collection; do not choose it unless that replacement is intended. The overwrite-warning checkbox is mandatory.
4. Wait for both collection and media completion. Check decks and a representative media card. Perform only an intentional edit/review and verify automatic sync if enabled.
5. Logout and confirm that the page returns to signed-out state. Do not include credentials or authentication state in screenshots.

## Version 1.2.0: default type and deck deletion

1. Open Anki → 添加笔记 and check that the initial type is **问答题（输入答案）**, its English equivalent, or a renamed typed-answer model. A manual selection should survive Refresh. If that type is absent, the plugin uses an existing fallback; it does not silently create a model.
2. Select a deck. **删除牌组…** is below Rename. Inspect its preview: selected/descendant decks, cards and orphaned notes to delete, and filtered cards merely returned to their original decks. **Cancel** must change nothing. Default ID-1, including a parent containing it, is protected.
3. Delete only when intended: export a backup first if needed, then type the exact full original deck name and confirm. This cannot be undone using review Undo and may synchronize to AnkiWeb. For an optional demonstration, use a new empty throwaway deck rather than an existing study deck.

Follow [README](<README.md>) for backup/upgrade precautions and supported limitations. Failed or cancelled synchronization may partially change local or cloud state; a local backup cannot restore overwritten cloud data.
