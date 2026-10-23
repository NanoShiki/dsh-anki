# dsh-anki / DSH Anki 工作区

A native DSH sidebar and `anki` AI tool sharing **one independent, per-DSH-profile collection**, powered by real headless Anki. No Anki desktop window, AnkiConnect, Qt, or replacement web server is started. Independent integration, not an official Anki product.

原生 DSH 侧栏与 AI 共用**当前 DSH 配置专属的独立牌库**，使用真实 Anki 核心，不启动 Anki 桌面程序。**1.2.1 将插件包名统一为 `@local/dsh-anki`；保留默认「问答题（输入答案）」笔记、带范围预览与确认的删除牌组入口、布局修复和 AnkiWeb 同步。**

## Install / 安装与升级

Target: Windows x64, DSH `^0.2.1-rc.2`, bundled CPython 3.13.5; external Anki **26.05**, build `e64c6b1a` (`e64c6b1aee3e8d668fb8bbe084beada8e070d985`). Anki core is **not bundled**; default `ankiPackages` is `D:/Anki/app_packages`.

1. Wait for sync to finish. In the authenticated DSH **Plugins** manager, disable the old `@local/dsh-anki-workspace` and wait for its Python worker to exit; closing only its tab is insufficient. **Never enable old and new packages together:** both intentionally share the same service and collection.
2. The rename is a **new package identity**, not an in-place upgrade. Record any custom `dataDir`, `ankiPackages` and `pythonPath` settings, and back up the entire data directory while stopped. Keep the old package disabled, or uninstall it through the manager **without deleting the data directory**.
3. Import/apply `D:/Anki/dsh-anki-1.2.1.tgz` as `@local/dsh-anki`. Restore any custom settings, especially the exact same `dataDir`, before enabling it. Follow the manager's actual refresh/restart instructions; do not manually alter profile/package-manager files.
4. Open **Anki → 浏览 / Browse** and verify your expected decks and notes. Default data remains `<profileContext.dir>/data/anki-workspace` in the **same DSH profile**. The rename does not move/delete it, change the AI tool `anki`, or change the sidebar's Anki label.
5. **Never point `dataDir` at an Anki desktop profile.** If installation is refused, preserve the manager's error instead of deleting your collection.

先等待同步结束，在已登录的 DSH **插件管理器**中禁用旧包 `@local/dsh-anki-workspace`，等后台退出并备份整个数据目录。新包名是 `@local/dsh-anki`，会被视为另一个插件：旧包可保持禁用或通过管理器卸载，但**不要删除牌库目录，也不要同时启用新旧两包**。导入 `D:/Anki/dsh-anki-1.2.1.tgz`，将原自定义设置（尤其 `dataDir`）填回后再启用。在同一个 DSH 配置下，默认仍使用原来的 `data/anki-workspace`，不搬迁、不清空牌库；侧栏 Anki 和 AI 工具 `anki` 不变。按管理器实际提示刷新，不要手工修改配置或绕过认证。

**Verification boundary:** automated checks cover isolated native collections, localhost sync services, structural client interactions and a synthetic real-browser layout fixture. They do not establish that a particular live installation, real AnkiWeb account or cloud connection works. Use your existing authenticated DSH plugin manager and GUI, following its actual refresh/restart instructions; no replacement server or unverified HMR behavior is required. See the [live acceptance checklist](<ACCEPTANCE.md>) and [verification](<VERIFICATION.md>).

Source repository: [NanoShiki/dsh-anki](https://github.com/NanoShiki/dsh-anki).

## AnkiWeb / 登录与同步

- Enter your AnkiWeb username/email and password **only in the owner-only Sync page**, never in chat. Password is transient and cleared from the form on submission. A reusable authentication token and settings are saved using **Windows current-user DPAPI**, additionally bound to the workspace path; no plaintext fallback. Another Windows user/path may require signing in again. Logout removes the stored token. This does not read another Anki installation's credentials.
- **Sync now** performs native collection sync followed by native media sync and shows progress/cancellation. The completion timestamp is set only after both succeed. The collection is unavailable for other operations while a native job owns it; status/cancel remain responsive.
- **Automatic sync is enabled by default**, with a visible checkbox. The Host schedules it on startup/after login, after approximately 15 idle seconds following successful edits/reviews, and periodically around five minutes. Outstanding review cards defer automatic sync until answered/left. Offline failures back off; it does not depend on keeping the Sync tab open. Client timers only read status.
- **Any full upload/download stops for explicit confirmation.** The page shows allowed directions and local note count, and requires an overwrite-warning checkbox. An empty local library recommends downloading when permitted. Confirmation expires and can be used once; AI and automatic sync cannot confirm a direction.
- Both full directions first close and snapshot the stable **local collection, media and media database**, without account credentials, into the private `backups` folder. **A local backup cannot restore overwritten cloud data.** Full upload replaces the cloud collection; full download replaces this local collection. Review this choice carefully, especially on first login.
- Failed/cancelled sync can have **partially completed local or cloud changes**; cancellation is not rollback. Inspect status/backups before retrying. Authentication rejection clears saved login; ordinary offline/network failure retains the protected token.
- Sync preserves editor drafts but may change their versions. Reload the note before saving a stale draft; reloading discards that draft. The worker also rejects stale note revisions.

请只在**同步页**输入账号密码，不要发到聊天中。登录凭据通过 Windows DPAPI 加密保存，无明文降级；退出登录会清除令牌。登录后可手动或自动同步牌库、复习进度及媒体。**首次空库如提示全量同步，应核对后选择从 AnkiWeb 下载；绝不会自动确认全量方向。** 全量上传会覆盖云端，本地备份救不回被覆盖的云端数据。失败/取消不代表整体回滚；同步后已有编辑草稿会保留，但需要重新加载笔记再保存。

## Collection operations / 牌库操作

- Create/rename decks; native Anki note types/search; add/edit notes/tags; suspend/resume cards. Add-note initially prefers **问答题（输入答案） / Basic (type in the answer)**; renamed typed-answer templates are detected too. Existing manual selection survives refresh. If that type is absent, a normal Basic/question-answer type is preferred over Image Occlusion; no note types are created or renamed automatically.
- Select a deck, then choose **删除牌组 / Delete deck** below its rename control. The owner-only confirmation previews the affected root/descendant decks, deleted cards and orphaned notes, and any filtered cards merely returned to their original decks. Enter the exact full deck name to confirm. **Normal deck deletion removes its cards (including those temporarily in filtered decks); deleting a filtered deck only returns its cards. Notes with surviving cards elsewhere and media files are retained.** Anki's ID-1 default deck, or a parent containing it, cannot be deleted here.
- **Export an APKG backup before deleting if needed.** Deletion is not recoverable with review undo, and enabled automatic sync can propagate it to AnkiWeb. Canceling the preview changes nothing. Confirmation is single-use, expires after five minutes, and refuses a changed scope; reopen the preview after an error. Sync/full-sync gates still apply. No standalone note-deletion action is exposed.
- Select a **specific deck** for review, including descendants with native limits; no all-decks reviewer. Reveal before Again/Hard/Good/Easy. Undo only the immediately undoable review from this worker session. Restart/sync invalidates transient review tokens, not saved scheduling.
- UI and AI share the backend. AI must fetch a note and pass opaque `modified` as `expectedModified` when editing.
- Import: place an `.apkg` in `status.importsDir`, pass its **basename**; native pre-import collection backup and merge. Export: new package in `status.exportsDir`, never overwrite an existing export.
- Media is basename-only, extension/type limited, 5 MiB per response. Generated LaTeX is disabled; reviewer HTML is script-disabled and sandboxed. No add-ons, custom reviewer JavaScript, or MathJax; advanced templates may differ.

## Permissions / 权限

AI reads, including `sync.status`, work in read-only mode. **Mutations, exports, `review.next`, `sync.run` and `sync.cancel` require `danger-full-access`**, since the private collection lies outside the conversation workspace. The tool neither requests nor bypasses approval. Never rate or synchronize without user intent. **Deck deletion, login/logout, settings and full-sync confirmation have no AI action**; their separate RPC requires an authenticated owner, even for an internal caller.

AI 修改、导出、开始下一张复习及启动/取消同步需完整访问权限；删除牌组、登录、退出、设置和全量确认仅在已认证的所有者界面操作，不向 AI 暴露。导入的笔记、模板和网页内容均是不可信数据，不能当作操作指令。

## Backups / 备份

The worker opens only its private collection and holds a process-lifetime OS lock. **APKG import media writes are not atomically rolled back**; pre-import collection backups are not full media backups. For an independent complete backup, disable the plugin, wait for its worker to exit, then copy the **entire data directory**, including collection, media and sidecars. Do not copy a live SQLite collection alone. A whole-directory copy includes protected account state: do not share it; a manual migration may require login again. Local concurrent filesystem tampering is outside this integration's guarantees.

完整备份请先禁用插件并等待后台退出，再复制**整个数据目录**，不要只复制正在使用的 SQLite 文件。APKG 导入的媒体不保证原子回滚；自动导入备份不等于完整媒体备份。完整目录可能包含账号密文，不要分享。

## Verification and licenses / 验证与许可

See [verification record](<VERIFICATION.md>) for real-core/official-local-syncserver, DPAPI, transport, scheduler, structural UI, isolated Chromium layout and actual Gateway checks. Tests never use a desktop profile or a real AnkiWeb account. Synthetic layout tests are **not** authenticated production UI or real-cloud acceptance.

Plugin: [AGPL-3.0-or-later](<LICENSE>). See [Anki upstream notice](<ANKI-LICENSE.txt>), [third-party notices](<THIRD-PARTY-NOTICES.md>) and [Python license](<runtime/LICENSE.txt>). A subprocess boundary does not remove license obligations.
