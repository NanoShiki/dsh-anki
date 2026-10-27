/* Native DSH page. Only React is imported from the browser module table.
 * Locale dictionaries are inlined because this artifact has no bundler/runtime JSON loader.
 * Keep these dictionaries in sync with locale/en.json and locale/zh.json. */
window.__ModuleLoader__.load({
  id: '@nanoshiki/dsh-anki',
  factory(require) {
    'use strict';
    const React = require('react');
    const h = React.createElement;
    const NS = 'ankiWorkspace';
    const PANEL_ID = 'anki-workspace';
    const en = {
      panel: 'Anki', title: 'Anki workspace', subtitle: 'Your local collection. A little progress, every day.',
      refresh: 'Refresh', loading: 'Loading collection…', working: 'Working…', retry: 'Retry', dismiss: 'Dismiss',
      notes: 'Notes', cards: 'Cards', decks: 'Decks', allDecks: 'All decks', new: 'New', learn: 'Learning', due: 'Due', total: 'Total',
      noDecks: 'No decks yet. Create your first deck below.', deckName: 'Deck name', deckPlaceholder: 'e.g. Languages::Japanese',
      createDeck: 'Create deck', renameDeck: 'Rename deck', deckCreated: 'Deck created.', deckRenamed: 'Deck renamed.',
      deleteDeck: 'Delete deck…', deleteTitle: 'Delete deck and subdecks?', deleteLoading: 'Preparing a deletion preview…',
      deleteAffectedDecks: 'Affected decks (selected deck and subdecks)', deleteCards: 'Cards to delete', deleteNotes: 'Orphaned notes to delete', deleteReturned: 'Filtered-deck cards returned to their original decks',
      deleteFilteredHint: 'Cards in filtered decks are returned to their original decks, not deleted. The deletion counts shown apply only to cards and orphaned notes actually removed.',
      deleteWarning: 'Export an APKG backup before proceeding. Review Undo cannot undo this deletion. If synchronization is enabled, deletion may propagate to AnkiWeb and other devices.',
      deleteConfirmName: 'Type the exact full deck name to confirm', deleteConfirm: 'Permanently delete', deleteCancel: 'Cancel',
      deleteDefault: 'The Default deck (ID 1), and any deck containing it, cannot be deleted.', deleteChanged: 'The deck contents or confirmation changed. Refresh and preview again.',
      deleteFailed: 'Deletion preview or deletion failed. Refresh and preview again before retrying.', deckDeleted: 'Deck deleted. Collection refreshed.',
      browse: 'Browse', add: 'Add note', review: 'Review', transfer: 'Transfer', query: 'Search notes',
      queryPlaceholder: 'Words, tag:… or is:suspended', search: 'Search',
      searchHint: 'Uses Anki search syntax. The selected deck is included in your search.', results: 'Results',
      noNotes: 'No notes found. Try another search or add a note.', selectNote: 'Select a note to edit its fields, tags, or suspension state.',
      previous: 'Previous', next: 'Next', editNote: 'Edit note', noteId: 'Note ID', model: 'Note type', deck: 'Deck', fields: 'Fields',
      tags: 'Tags', tagsPlaceholder: 'Separate tags with spaces', fieldHint: 'Fields accept Anki HTML. Imported card scripts are never executed.',
      clozeHint: 'Cloze example: The capital of France is {{c1::Paris}}.', save: 'Save changes', reloadNote: 'Reload note',
      saved: 'Note saved.', added: 'Note added. Ready for the next one.', addHint: 'Choose a deck and note type, then fill in the fields.',
      chooseDeck: 'Choose a deck', noModels: 'No note types are available. Refresh the collection or import a deck.',
      suspended: 'Suspended cards', suspend: 'Suspend cards', unsuspend: 'Resume cards', suspensionSaved: 'Card suspension updated.',
      noCards: 'This note has no cards.', reviewTitle: 'Make it stick',
      reviewHint: 'Recall the answer first, then reveal it and choose an honest rating.', startReview: 'Start reviewing',
      nextCard: 'Next card', reveal: 'Show answer', question: 'Question', answer: 'Answer', remaining: 'Remaining',
      reviewEmpty: "You're all caught up", reviewEmptyHint: 'No cards are available for this selection right now.',
      reviewIdle: 'Ready when you are', reviewIdleHint: 'Choose a deck to study it and its subdecks. All decks is only for browsing and export.',
      again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy', undo: 'Undo last review', undoDone: 'Last review undone.',
      cardFrame: 'Isolated Anki card', cardLoading: 'Preparing card and local media…', cardError: 'Could not prepare this card.',
      mediaNotice: 'Some media could not be loaded. Only bounded local media is supported; external URLs and scripts are blocked.',
      safeCard: 'Isolated card · no scripts or external resources', transferTitle: 'Bring your collection with you',
      transferNotice: 'This is an independent local collection, not your desktop Anki collection. Optional AnkiWeb synchronization is available in Sync. Custom JavaScript, MathJax and add-ons are not supported.',
      collectionPath: 'Collection', importsDir: 'Imports directory', importTitle: 'Import an APKG',
      importHint: 'Place your own .apkg file in the imports directory shown above, then enter its filename only. This panel does not upload files or accept arbitrary file paths. Import merges into and changes the current collection. A pre-import collection backup is kept in the private data/backups directory. Imported media cannot be atomically undone with the collection.',
      importFilename: 'Import filename', importAction: 'Import package', importDone: 'Package imported. Collection refreshed.',
      exportTitle: 'Export an APKG', exportHint: 'Export the selected deck, or All decks. The Host saves the package locally and returns its path.',
      exportFilename: 'Export filename (optional)', exportAction: 'Export package', exportDone: 'Export saved',
      filenameError: 'Use a filename ending in .apkg, without a directory path.', nameRequired: 'Enter a deck name.',
      fieldsRequired: 'Fill in at least one field.', modifiedError: 'The note has no numeric revision. Reload the note before saving.',
      transportError: 'The Anki Host service returned an invalid response.', unknownError: 'The operation failed. Please try again.',
      notReady: 'Collection unavailable', notReadyHint: 'Check that the local Anki service is running, then retry.', version: 'Anki engine',
      selectDeckHint: 'Select a deck to rename it or narrow your workspace.', localOnly: 'Local collection', noteCount: 'notes', cardCount: 'cards', page: 'Page', of: 'of',
      sync: 'Sync', syncTitle: 'AnkiWeb synchronization', syncIntro: 'Connect this independent collection to your AnkiWeb account. Account actions are sent directly to the authenticated Host, never through an AI tool.',
      syncAccount: 'Account', syncSignedOut: 'Not signed in', syncUsername: 'AnkiWeb email / username', syncPassword: 'Password', syncLogin: 'Sign in', syncLogout: 'Sign out',
      syncCredentialsHint: 'Enter credentials only here, not in chat. The password is cleared on submission and is not saved in browser storage.',
      syncLoginFailed: 'Could not sign in. Check your credentials, connection, and secure credential storage, then try again.',
      syncFailed: 'Synchronization could not finish. Check your connection and account, then refresh the sync status or retry.',
      syncAuthError: 'Sign in again to continue synchronization.', syncBusyError: 'A synchronization job is using the collection. Wait for it to finish or cancel it.',
      syncConfirmError: 'This full-sync confirmation has expired or changed. Refresh the status and choose again.',
      syncAuto: 'Automatic sync', syncAutoHint: 'The Host manages automatic synchronization, even when this panel is closed. This page only checks progress; it does not schedule sync jobs.',
      syncNow: 'Sync now', syncCancel: 'Cancel sync', syncLast: 'Last successful sync', syncNever: 'Not yet', syncProgress: 'Progress', syncMedia: 'Media',
      syncTransferred: 'Transferred', syncChecked: 'Checked', syncAdded: 'Added', syncRemoved: 'Removed',
      syncIdle: 'Ready', syncLoggingIn: 'Signing in…', syncSyncing: 'Synchronizing collection…', syncMediaPhase: 'Synchronizing media…',
      syncUploading: 'Uploading full collection…', syncDownloading: 'Downloading full collection…', syncAwaiting: 'A full-sync decision is required', syncSuccess: 'Sync complete', syncError: 'Sync needs attention', syncCancelled: 'Sync cancelled',
      syncFullTitle: 'Choose a full-sync direction', syncFullHint: 'Normal sync cannot merge these collections. No direction will be chosen automatically. Review both sides before continuing.',
      syncEmptyHint: 'Your local collection is empty. Download is recommended to keep the existing AnkiWeb collection.', syncRecommended: 'Recommended',
      syncUpload: 'Upload local → AnkiWeb', syncDownload: 'Download AnkiWeb → local',
      syncUploadWarning: 'Full upload replaces the collection on AnkiWeb with this local collection. Other devices will need to download it. The backup protects only the local collection, NOT the cloud collection. An empty local upload can erase your cloud notes.',
      syncDownloadWarning: 'Full download replaces this local collection with the AnkiWeb collection. A pre-sync local collection backup is kept, but media changes are not atomically undoable. Unsaved editor drafts must be reloaded after sync.',
      syncConsent: 'I understand the replacement and backup limitations, and explicitly authorize this direction.',
      syncConfirmUpload: 'Confirm full upload', syncConfirmDownload: 'Confirm full download', syncDismissFull: 'Not now', syncBackup: 'Last local backup',
      syncDecisionBanner: 'Synchronization requires an explicit full upload or download decision. Collection changes and review are paused.', syncOpen: 'Open Sync',
      syncChanged: 'Synchronization may have changed the collection. Your editor draft is preserved, but its version is stale. Reload the note before saving; reloading discards the current draft.',
      manageDecks: 'Manage decks', savedState: 'Saved', unsaved: 'Unsaved draft', reloadRequired: 'Reload required', collectionReady: 'Open'
    };
    const zh = {
      panel: 'Anki', title: 'Anki 工作区', subtitle: '本地收藏，每天积累一点进步。',
      refresh: '刷新', loading: '正在加载收藏…', working: '正在处理…', retry: '重试', dismiss: '关闭',
      notes: '笔记', cards: '卡片', decks: '牌组', allDecks: '所有牌组', new: '新卡片', learn: '学习中', due: '待复习', total: '总计',
      noDecks: '暂无牌组，在下方创建第一个牌组。', deckName: '牌组名称', deckPlaceholder: '例如：语言::日语',
      createDeck: '创建牌组', renameDeck: '重命名牌组', deckCreated: '牌组已创建。', deckRenamed: '牌组已重命名。',
      deleteDeck: '删除牌组…', deleteTitle: '删除牌组及其子牌组？', deleteLoading: '正在预览删除范围…',
      deleteAffectedDecks: '受影响的牌组（当前牌组及其子牌组）', deleteCards: '实际删除的卡片', deleteNotes: '实际删除的孤立笔记', deleteReturned: '筛选牌组中退回原牌组的卡片',
      deleteFilteredHint: '筛选牌组中的卡片只会退回原牌组，不会删除。显示的删除数量仅包含实际移除的卡片和孤立笔记。',
      deleteWarning: '建议先导出 APKG 备份。复习撤销无法撤销此次删除。如果启用同步，删除可能传播到 AnkiWeb 和其他设备。',
      deleteConfirmName: '输入牌组完整原名以确认', deleteConfirm: '永久删除', deleteCancel: '取消',
      deleteDefault: '不能删除默认牌组（ID 1），或包含它的任何父牌组。', deleteChanged: '牌组内容或确认信息已更改，请刷新后重新预览。',
      deleteFailed: '预览或删除失败，请刷新并重新预览后再试。', deckDeleted: '牌组已删除，收藏已刷新。',
      browse: '浏览', add: '添加笔记', review: '复习', transfer: '导入导出', query: '搜索笔记',
      queryPlaceholder: '关键词、tag:… 或 is:suspended', search: '搜索', searchHint: '支持 Anki 搜索语法，搜索范围包含当前选中的牌组。',
      results: '搜索结果', noNotes: '没有找到笔记，请尝试其他搜索或添加笔记。', selectNote: '选择一条笔记，编辑字段、标签或暂停状态。',
      previous: '上一页', next: '下一页', editNote: '编辑笔记', noteId: '笔记 ID', model: '笔记类型', deck: '牌组', fields: '字段',
      tags: '标签', tagsPlaceholder: '使用空格分隔标签', fieldHint: '字段支持 Anki HTML，导入的卡片脚本不会执行。',
      clozeHint: '挖空示例：法国的首都是 {{c1::巴黎}}。', save: '保存更改', reloadNote: '重新加载笔记', saved: '笔记已保存。',
      added: '笔记已添加，可以继续添加下一条。', addHint: '选择牌组和笔记类型，然后填写字段。', chooseDeck: '请选择牌组',
      noModels: '暂无笔记类型，请刷新收藏或导入牌组。', suspended: '已暂停卡片', suspend: '暂停卡片', unsuspend: '恢复卡片',
      suspensionSaved: '卡片暂停状态已更新。', noCards: '此笔记没有卡片。', reviewTitle: '让记忆更牢固',
      reviewHint: '先尝试回忆，再显示答案并如实评分。', startReview: '开始复习', nextCard: '下一张卡片', reveal: '显示答案',
      question: '问题', answer: '答案', remaining: '剩余', reviewEmpty: '当前复习已完成', reviewEmptyHint: '当前范围内暂时没有可复习的卡片。',
      reviewIdle: '准备好就开始吧', reviewIdleHint: '请选择一个牌组，复习该牌组及其子牌组。「所有牌组」仅用于浏览和导出。',
      again: '重来', hard: '困难', good: '良好', easy: '简单', undo: '撤销上次复习', undoDone: '已撤销上次复习。',
      cardFrame: '隔离的 Anki 卡片', cardLoading: '正在准备卡片和本地媒体…', cardError: '无法准备此卡片。',
      mediaNotice: '部分媒体无法加载。仅支持有限大小的本地媒体，外部链接和脚本已阻止。', safeCard: '卡片已隔离 · 无脚本或外部资源',
      transferTitle: '随身携带你的收藏', transferNotice: '这是独立的本地收藏，并非桌面 Anki 的收藏。可在「同步」中连接 AnkiWeb。不支持自定义 JavaScript、MathJax 或插件。',
      collectionPath: '收藏位置', importsDir: '导入目录', importTitle: '导入 APKG',
      importHint: '请将你自己的 .apkg 文件放入上方的导入目录，再仅输入文件名。此面板不会上传文件，也不接受任意文件路径。导入会合并并修改当前收藏，导入前的收藏备份保存在私有数据的 data/backups 目录中。导入的媒体无法与收藏一并原子撤销。',
      importFilename: '导入文件名', importAction: '导入牌组包', importDone: '导入完成，收藏已刷新。', exportTitle: '导出 APKG',
      exportHint: '导出选中的牌组，或导出所有牌组。Host 将在本地保存牌组包并返回路径。', exportFilename: '导出文件名（可选）',
      exportAction: '导出牌组包', exportDone: '导出已保存', filenameError: '请输入以 .apkg 结尾的文件名，不要包含目录路径。',
      nameRequired: '请输入牌组名称。', fieldsRequired: '请至少填写一个字段。', modifiedError: '笔记缺少数值版本，请重新加载后再保存。',
      transportError: 'Anki Host 服务返回了无效响应。', unknownError: '操作失败，请重试。', notReady: '收藏暂时不可用',
      notReadyHint: '请检查本地 Anki 服务是否运行，然后重试。', version: 'Anki 引擎', selectDeckHint: '选择牌组，即可重命名或缩小工作区范围。',
      localOnly: '本地收藏', noteCount: '条笔记', cardCount: '张卡片', page: '第', of: '/',
      sync: '同步', syncTitle: 'AnkiWeb 同步', syncIntro: '将此独立收藏连接到你的 AnkiWeb 账户。账户操作直接发送给已认证的 Host，不经过 AI 工具。',
      syncAccount: '账户', syncSignedOut: '尚未登录', syncUsername: 'AnkiWeb 邮箱 / 用户名', syncPassword: '密码', syncLogin: '登录', syncLogout: '退出登录',
      syncCredentialsHint: '请仅在此输入凭据，不要发送到聊天。提交后密码会被清空，且不会保存在浏览器存储中。',
      syncLoginFailed: '无法登录，请检查凭据、网络连接及安全凭据存储后重试。', syncFailed: '同步未能完成，请检查网络和账户，然后刷新同步状态或重试。',
      syncAuthError: '请重新登录后继续同步。', syncBusyError: '同步任务正在使用收藏，请等待完成或取消同步。', syncConfirmError: '此次全量同步确认已过期或发生变化，请刷新状态并重新选择。',
      syncAuto: '自动同步', syncAutoHint: 'Host 负责自动同步，即使关闭此面板也会继续运行。此页面仅查询进度，不安排同步任务。',
      syncNow: '立即同步', syncCancel: '取消同步', syncLast: '上次成功同步', syncNever: '尚无', syncProgress: '进度', syncMedia: '媒体',
      syncTransferred: '已传输', syncChecked: '已检查', syncAdded: '已添加', syncRemoved: '已移除',
      syncIdle: '就绪', syncLoggingIn: '正在登录…', syncSyncing: '正在同步收藏…', syncMediaPhase: '正在同步媒体…',
      syncUploading: '正在全量上传收藏…', syncDownloading: '正在全量下载收藏…', syncAwaiting: '需要选择全量同步方向', syncSuccess: '同步完成', syncError: '同步需要处理', syncCancelled: '同步已取消',
      syncFullTitle: '选择全量同步方向', syncFullHint: '普通同步无法合并这两个收藏，系统不会自动选择方向。继续前请核对两端内容。',
      syncEmptyHint: '本地收藏为空，建议下载，以保留现有的 AnkiWeb 收藏。', syncRecommended: '建议',
      syncUpload: '上传本地 → AnkiWeb', syncDownload: '下载 AnkiWeb → 本地',
      syncUploadWarning: '全量上传会用本地收藏替换 AnkiWeb 上的收藏，其他设备随后需要下载。备份仅保护本地收藏，不保护云端收藏。上传空的本地收藏可能清空云端笔记。',
      syncDownloadWarning: '全量下载会用 AnkiWeb 收藏替换本地收藏。系统会保留同步前的本地收藏备份，但媒体变更无法原子撤销。同步后必须重新加载尚未保存的编辑草稿。',
      syncConsent: '我理解替换操作及备份的限制，并明确授权此同步方向。',
      syncConfirmUpload: '确认全量上传', syncConfirmDownload: '确认全量下载', syncDismissFull: '暂不处理', syncBackup: '上次本地备份',
      syncDecisionBanner: '同步需要你明确选择全量上传或下载，收藏更改及复习已暂停。', syncOpen: '打开同步',
      syncChanged: '同步可能已更改收藏。编辑草稿仍保留，但其版本已过期。请重新加载笔记后再保存；重新加载会丢弃当前草稿。',
      manageDecks: '管理牌组', savedState: '已保存', unsaved: '未保存草稿', reloadRequired: '需要重新加载', collectionReady: '已打开'
    };

    const CSS = `
/* The main-slot height is the boundary. Only the named inner regions scroll. */
.dsh-anki{--anki-ink:#161c26;--anki-muted:#66717e;--anki-faint:#858e99;--anki-border:#e5e9ee;--anki-teal:#087e88;--anki-selected:#e8f5f5;--dsw-alias-label-primary:var(--anki-ink);--dsw-alias-label-secondary:var(--anki-muted);--dsw-alias-label-tertiary:var(--anki-faint);--dsw-alias-state-error-primary:#b54141;box-sizing:border-box;display:flex;flex-direction:column;flex:1 1 0;min-width:0;min-height:0;height:100%;overflow:hidden;color:var(--anki-ink);background:#f8fafc;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;font-size:13px;line-height:1.55;padding:22px 22px 18px;container-type:inline-size;color-scheme:light}
.dsh-anki *{box-sizing:border-box}.dsh-anki [hidden]{display:none!important}.dsh-anki button,.dsh-anki input,.dsh-anki select,.dsh-anki textarea{font:inherit;color:inherit}
.dsh-anki button{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:36px;padding:7px 12px;transition:background .12s,border-color .12s}.dsh-anki button:disabled{cursor:default;opacity:.46}.dsh-anki :is(button,input,textarea,select):focus-visible{outline:2px solid var(--anki-teal);outline-offset:2px}
.dsh-anki button,.dsh-anki input,.dsh-anki select,.dsh-anki textarea{border:1px solid var(--anki-border);border-radius:9px;background:#fff}.dsh-anki button:not(:disabled):hover{background:#f0f8f8;border-color:#c7dfe1}
.dsh-anki input,.dsh-anki select,.dsh-anki textarea{padding:9px 11px;min-width:0;width:100%}.dsh-anki select option{color:var(--anki-ink);background:#fff}.dsh-anki textarea{min-height:140px;resize:vertical;line-height:1.7}.dsh-anki input::placeholder,.dsh-anki textarea::placeholder{color:var(--anki-faint)}
.dsh-anki .dsh-anki-primary{background:var(--anki-teal);border-color:var(--anki-teal);color:#fff;font-weight:600}.dsh-anki .dsh-anki-primary:not(:disabled):hover{background:#066b74;border-color:#066b74}.dsh-anki .dsh-anki-icon-button{width:34px;min-height:34px;padding:6px;flex:none}
.dsh-anki-wrap{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0;width:100%;margin:0 auto}.dsh-anki-overview{flex:0 1 auto;min-height:0;max-height:30%;overflow:auto;overscroll-behavior:contain}
.dsh-anki-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:16px}.dsh-anki-head-actions{display:flex;align-items:center;gap:12px;padding-top:2px;flex:none}.dsh-anki-head-actions button{min-height:42px;padding:9px 16px}
.dsh-anki h1{font-size:28px;line-height:36px;font-weight:700;letter-spacing:-.025em;margin:0}.dsh-anki h2{font-size:18px;line-height:26px;font-weight:650;margin:0}.dsh-anki h3{font-size:14px;font-weight:650;margin:0}.dsh-anki p{margin:5px 0}.dsh-anki-muted{color:var(--anki-muted)}.dsh-anki-caption{font-size:12px;color:var(--anki-faint)}.dsh-anki-kicker{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--anki-faint);margin:0 0 5px}
.dsh-anki-stats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));min-height:74px;background:#fff;border:1px solid var(--anki-border);border-radius:10px;margin-bottom:8px;padding:12px 0}.dsh-anki-stats[data-count="3"]{grid-template-columns:repeat(3,minmax(0,1fr))}.dsh-anki-count{font-variant-numeric:tabular-nums;opacity:.9}
.dsh-anki-stat{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;overflow:hidden;position:relative;gap:0}.dsh-anki-stat+ .dsh-anki-stat:before{content:"";position:absolute;left:0;top:7px;bottom:7px;width:1px;background:var(--anki-border)}.dsh-anki-stat strong{font-size:23px;font-weight:650;line-height:29px;font-variant-numeric:tabular-nums;display:flex;align-items:center;gap:9px}.dsh-anki-stat span{font-size:12px;color:var(--anki-muted);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsh-anki-dot{width:9px;height:9px;border-radius:50%;background:#438cf4;flex:none}.dsh-anki-stat[data-kind=learn] .dsh-anki-dot{background:#e8b629}.dsh-anki-stat[data-kind=due] .dsh-anki-dot{background:#18aaa2}
.dsh-anki-tabs{display:flex;flex:none;gap:18px;border-bottom:1px solid var(--anki-border);margin-bottom:12px;overflow:auto;scrollbar-width:thin}.dsh-anki-tab{flex:none}.dsh-anki .dsh-anki-tab{border:0;border-bottom:3px solid transparent;border-radius:0;background:transparent;white-space:nowrap;color:var(--anki-muted);padding:11px 12px 9px;min-height:44px}.dsh-anki .dsh-anki-tab[aria-selected=true]{border-bottom-color:var(--anki-teal);color:var(--anki-teal);font-weight:650}.dsh-anki .dsh-anki-tab:not(:disabled):hover{background:#edf7f7}
.dsh-anki-layout{display:grid;flex:1;min-height:0;min-width:0;grid-template-columns:240px minmax(0,1fr);grid-template-rows:minmax(0,1fr);gap:10px}.dsh-anki-main{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden}.dsh-anki-panel{flex:1;min-height:0;min-width:0;overflow:auto;overscroll-behavior:contain;border:1px solid var(--anki-border);border-radius:11px;background:#fff;padding:20px}.dsh-anki-panel-browse{display:flex;flex-direction:column;overflow:hidden;border:0;background:transparent;padding:0}.dsh-anki-panel-browse>:not([hidden]){display:flex;flex-direction:column;flex:1;min-height:0}
.dsh-anki-aside{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden;overscroll-behavior:contain;background:#fff;border:1px solid var(--anki-border);border-radius:11px;padding:14px 10px}.dsh-anki-section-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;flex:none}.dsh-anki-aside>.dsh-anki-section-head{padding:0 5px}.dsh-anki-rail-actions{display:flex;gap:4px}.dsh-anki-rail-actions button:last-child{border-color:transparent}.dsh-anki-aside-scroll{display:flex;flex-direction:column;flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}
.dsh-anki-decks{display:flex;flex-direction:column;flex:1;min-height:86px;gap:4px;overflow:auto;overscroll-behavior:contain}.dsh-anki .dsh-anki-deck{width:100%;display:flex;flex:0 0 auto;justify-content:space-between;text-align:left;gap:10px;border:0;border-radius:7px;padding:11px 12px;align-items:center;position:relative;min-height:43px}.dsh-anki .dsh-anki-deck[aria-pressed=true]{background:var(--anki-selected);font-weight:600}.dsh-anki .dsh-anki-deck[aria-pressed=true]:before{content:"";position:absolute;left:0;top:7px;bottom:7px;width:3px;border-radius:3px;background:var(--anki-teal)}.dsh-anki-deck-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.dsh-anki-deck>.dsh-anki-badge{background:transparent;color:var(--anki-muted);padding:0;font-size:12px;flex:none;white-space:nowrap}.dsh-anki-badge{font-size:11px;padding:2px 7px;border-radius:5px;background:#f1f3f5;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.dsh-anki-deck-controls{flex:none;border-top:1px solid var(--anki-border);margin-top:10px;padding:10px 4px}.dsh-anki-aside form{display:flex;flex-direction:column;gap:8px}.dsh-anki-aside label{font-size:12px;color:var(--anki-muted)}.dsh-anki-foot{flex:none;display:flex;align-items:center;justify-content:space-between;gap:6px;padding:12px 4px 0;margin-top:12px;border-top:1px solid var(--anki-border);font-size:11px;color:var(--anki-muted)}.dsh-anki-engine{display:flex;flex-direction:column;gap:5px;min-width:0}.dsh-anki-engine span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dsh-anki-foot button{font-size:11px;min-height:30px;padding:4px 7px}
.dsh-anki-browse{display:flex;flex-direction:column;flex:1;min-height:0;min-width:0}.dsh-anki-browser{display:grid;flex:1;min-height:0;min-width:0;grid-template-columns:minmax(0,.94fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr);gap:10px}.dsh-anki-results{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden;background:#fff;border:1px solid var(--anki-border);border-radius:11px}.dsh-anki-results-head{display:flex;align-items:center;gap:8px;padding:10px;flex:none}.dsh-anki-results-head>.dsh-anki-caption{flex:none;font-variant-numeric:tabular-nums}.dsh-anki-search{display:flex;flex:1;min-width:0;gap:6px;align-items:center}.dsh-anki-search-box{position:relative;flex:1;min-width:0}.dsh-anki-search-box>svg{position:absolute;left:10px;top:11px;color:var(--anki-muted);pointer-events:none}.dsh-anki-search input{padding:9px 9px 9px 34px;background:#f8fafb}.dsh-anki-search button{padding:7px 9px}.dsh-anki-search-hint{margin:0!important;padding:0 12px 8px;font-size:11px;flex:none}
.dsh-anki-list{display:flex;flex-direction:column;flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:0 5px}.dsh-anki .dsh-anki-note{display:block;flex:0 0 auto;height:auto;min-width:0;white-space:normal;text-align:left;border:0;border-bottom:1px solid #eef1f4;border-radius:0;width:100%;padding:9px 12px;position:relative;min-height:84px}.dsh-anki .dsh-anki-note[aria-pressed=true]{background:var(--anki-selected)}.dsh-anki .dsh-anki-note[aria-pressed=true]:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--anki-teal);border-radius:2px}.dsh-anki-note-title{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;font-weight:650;font-size:13px;line-height:21px}.dsh-anki-preview{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere;min-height:20px;color:var(--anki-muted);font-size:12px;line-height:19px}.dsh-anki-note-meta{display:flex;flex-wrap:wrap;gap:5px;font-size:11px;color:var(--anki-muted);margin-top:4px;overflow-wrap:anywhere}.dsh-anki-note-meta>span{padding:1px 6px;border-radius:5px;background:#f0f2f4;max-width:100%}.dsh-anki-note-meta .dsh-anki-suspended{color:#986c18;background:#fff5de}
.dsh-anki-pagination{display:flex;flex:none;justify-content:center;align-items:center;gap:16px;padding:9px 10px;border-top:1px solid var(--anki-border);background:#fff}.dsh-anki-pagination button{min-height:32px;padding:5px 8px;font-size:12px}.dsh-anki-pagination span{font-variant-numeric:tabular-nums}
.dsh-anki-editor{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain;border:1px solid var(--anki-border);border-radius:11px;background:#fff;padding:16px}.dsh-anki-toolbar,.dsh-anki-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.dsh-anki-toolbar{justify-content:space-between;margin-bottom:14px;flex:none}.dsh-anki-editor-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex:none;margin-bottom:15px}.dsh-anki-editor-status{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--anki-muted);white-space:nowrap}.dsh-anki-editor-status[data-state=saved]{color:#328664}.dsh-anki-editor-status[data-state=draft]{color:#986c18}.dsh-anki-editor-status[data-state=stale]{color:#b54141}.dsh-anki-editor-reload{font-size:11px!important;min-height:28px!important;padding:3px 7px!important}
.dsh-anki-note-context{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 14px;padding:10px;border:1px solid #edf0f3;border-radius:8px;background:#fafbfc;flex:none}.dsh-anki-note-context div{min-width:0}.dsh-anki-note-context dt{color:var(--anki-faint);font-size:11px}.dsh-anki-note-context dd{margin:2px 0 0;font-size:12px;overflow-wrap:anywhere}.dsh-anki-note-context small{color:var(--anki-faint)}
.dsh-anki-form{display:flex;flex-direction:column;gap:16px;min-width:0}.dsh-anki-edit-form{display:flex;flex-direction:column;flex:1;min-height:0;gap:0}.dsh-anki-editor-fields{display:flex;flex-direction:column;flex:1;min-height:0;gap:18px;overflow:auto;overscroll-behavior:contain;padding:0 2px 12px}.dsh-anki-editor-fields>.dsh-anki-caption{margin:0;font-size:11px}.dsh-anki-field{display:flex;flex-direction:column;gap:7px;min-width:0;flex:none}.dsh-anki-field>span{font-size:12px;font-weight:600}.dsh-anki-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.dsh-anki-editor-tags{display:flex;flex-wrap:wrap;gap:5px}.dsh-anki-editor-tags span{font-size:11px;padding:3px 8px;background:#f1f3f5;border-radius:6px;overflow-wrap:anywhere;max-width:100%}.dsh-anki-editor-footer{display:flex;flex:none;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--anki-border)}.dsh-anki-suspension-info{flex-basis:100%;font-size:11px;margin:0!important}.dsh-anki-editor-footer .dsh-anki-primary{margin-left:auto}
.dsh-anki-empty{text-align:center;padding:32px 16px;border:1px dashed var(--anki-border);border-radius:10px;color:var(--anki-muted);min-width:0}.dsh-anki-empty h2{color:var(--anki-ink);margin-top:12px}.dsh-anki-empty p{max-width:390px;margin:7px auto 18px}.dsh-anki-empty svg{opacity:.6}.dsh-anki-editor>.dsh-anki-empty{margin:auto 0}
.dsh-anki-notice{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid #d9eaea;border-radius:9px;margin:0 0 10px;background:#edf7f7;overflow-wrap:anywhere}.dsh-anki-notice[data-error=true]{color:#b54141;border-color:#ecd6d6;background:#fff7f7}.dsh-anki-notice button{font-size:11px;min-height:26px;padding:2px 7px;flex:none}.dsh-anki-main>.dsh-anki-delete{flex:0 1 auto;min-height:0;max-height:55%;overflow:auto;margin-bottom:10px!important;background:#fff}
.dsh-anki-review-head{margin-bottom:18px}.dsh-anki-review-meta{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px}.dsh-anki-frame-wrap{border:1px solid var(--anki-border);border-radius:10px;overflow:hidden}.dsh-anki-frame{display:block;border:0;width:100%;min-height:280px;height:clamp(280px,46vh,650px);background:#fff}.dsh-anki-review-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:18px}.dsh-anki-rating{min-width:80px;display:flex;flex-direction:column;align-items:center;gap:2px}.dsh-anki-rating strong{font-size:13px;font-weight:600}.dsh-anki-rating span{font-size:11px;color:var(--anki-muted)}.dsh-anki-review-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:18px}
.dsh-anki-transfer{display:flex;flex-direction:column;gap:20px}.dsh-anki-transfer-notice{padding:14px 16px;border-radius:10px;background:#f0f7f8;color:var(--anki-muted)}.dsh-anki-paths{margin:0;display:grid;gap:5px}.dsh-anki-paths dt{font-size:11px;color:var(--anki-faint)}.dsh-anki-paths dd{font-family:ui-monospace,monospace;font-size:12px;margin:0 0 8px;overflow-wrap:anywhere;user-select:text}.dsh-anki-transfer-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.dsh-anki-transfer-card{padding:18px;border:1px solid var(--anki-border);border-radius:10px;display:flex;flex-direction:column;gap:12px;min-width:0}.dsh-anki-transfer-card p{margin:0}.dsh-anki-code{font-family:ui-monospace,monospace;font-size:12px;overflow-wrap:anywhere;white-space:pre-wrap;user-select:text}
.dsh-anki-delete{min-width:0;overflow-wrap:anywhere}.dsh-anki-sync{display:flex;flex-direction:column;gap:18px}.dsh-anki-sync>.dsh-anki-caption{margin:0}.dsh-anki .dsh-anki-check{display:flex;align-items:flex-start;gap:9px;cursor:pointer;font-size:12px}.dsh-anki .dsh-anki-check input{width:16px;min-width:16px;height:16px;min-height:16px;margin:2px 0;padding:0;accent-color:var(--anki-teal)}.dsh-anki-sync-progress{display:flex;flex-wrap:wrap;gap:8px 16px;font-size:12px}.dsh-anki-sync-progress progress{width:100%;height:12px;accent-color:var(--anki-teal)}.dsh-anki-full-sync{padding:18px;border:1px solid #e4cccc;border-radius:10px;display:flex;flex-direction:column;gap:14px}.dsh-anki-full-sync p{margin:0}.dsh-anki-full-sync>div:last-of-type{display:flex;flex-direction:column;align-items:flex-start;gap:14px}.dsh-anki .dsh-anki-full-sync button[aria-pressed=true]{border-color:var(--anki-teal);background:var(--anki-selected)}
@container (max-width:1050px){.dsh-anki-layout{grid-template-columns:190px minmax(0,1fr)}.dsh-anki-head{margin-bottom:10px}.dsh-anki-head .dsh-anki-muted{display:none}.dsh-anki-stats{min-height:60px;padding:7px 0}.dsh-anki-browser{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,3fr) minmax(0,1.3fr);gap:8px}.dsh-anki-editor{display:block;padding:10px 12px}.dsh-anki-editor-head{margin-bottom:10px}.dsh-anki-edit-form{display:block}.dsh-anki-editor-fields{display:flex;overflow:visible;gap:14px;min-height:auto;padding-bottom:14px}.dsh-anki-note-context{margin-bottom:12px}.dsh-anki-editor-footer{padding-top:10px}.dsh-anki-transfer-grid{grid-template-columns:1fr}.dsh-anki-search-hint{display:none}.dsh-anki-tabs{gap:8px;margin-bottom:8px}}
@container (max-width:620px){.dsh-anki-overview{max-height:24%}.dsh-anki h1{font-size:21px;line-height:30px}.dsh-anki-head{align-items:center;gap:7px;margin-bottom:7px}.dsh-anki-head-actions{gap:5px;padding:0}.dsh-anki-head-actions button{min-height:32px;padding:5px 8px;font-size:11px}.dsh-anki-head-actions svg{width:14px;height:14px}.dsh-anki-stats{min-height:53px;padding:5px 0;margin-bottom:4px}.dsh-anki-stat strong{font-size:18px;line-height:23px;gap:4px}.dsh-anki-stat span{font-size:10px}.dsh-anki-dot{width:6px;height:6px}.dsh-anki-tabs{gap:0;margin-bottom:8px}.dsh-anki .dsh-anki-tab{min-height:37px;padding:8px 10px 6px;font-size:12px}.dsh-anki-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);gap:8px}.dsh-anki-layout:has(.dsh-anki-aside-scroll[data-controls=true]){grid-template-rows:minmax(0,120px) minmax(0,1fr)}.dsh-anki-aside{padding:6px 8px}.dsh-anki-aside>.dsh-anki-section-head{margin:0;padding:0;min-height:28px}.dsh-anki-aside h2{font-size:13px;line-height:24px}.dsh-anki-rail-actions button{width:27px;min-height:26px;padding:4px}.dsh-anki-decks{flex:none;flex-direction:row;min-height:0;gap:4px;overflow-y:hidden;align-items:center}.dsh-anki .dsh-anki-deck{width:auto;max-width:230px;min-height:34px;padding:6px 10px;white-space:nowrap}.dsh-anki-deck-name{max-width:160px}.dsh-anki-aside-scroll[data-controls=true] .dsh-anki-decks{display:none}.dsh-anki-deck-controls{margin:0;border:0;padding:5px 2px}.dsh-anki-foot{margin-top:3px;padding:3px 0 0;min-height:22px}.dsh-anki-engine{flex-direction:row;gap:8px;font-size:10px}.dsh-anki-engine span:first-child{max-width:150px}.dsh-anki-foot button{min-height:22px;padding:1px 5px;font-size:10px}.dsh-anki-browser{grid-template-rows:minmax(0,3fr) minmax(48px,.95fr);gap:8px}.dsh-anki-results-head{padding:7px;gap:5px}.dsh-anki-results-head>.dsh-anki-caption{font-size:10px}.dsh-anki-search input{font-size:12px;padding-top:7px;padding-bottom:7px}.dsh-anki-search-box>svg{top:9px}.dsh-anki-search button{min-height:34px;padding:5px 7px;font-size:11px}.dsh-anki-pagination{padding:6px;gap:12px}.dsh-anki-pagination button{min-height:28px;padding:3px 7px;font-size:11px}.dsh-anki-note-context{grid-template-columns:1fr 1fr}.dsh-anki-editor h2{font-size:15px;line-height:24px}.dsh-anki-editor-head{gap:6px}.dsh-anki-editor-status{font-size:10px}.dsh-anki-form-grid{grid-template-columns:1fr}.dsh-anki-panel:not(.dsh-anki-panel-browse){padding:14px}.dsh-anki-rating{min-width:60px}.dsh-anki-review-actions{gap:6px}}
@media(max-width:700px){.dsh-anki{padding:10px}}
@media(max-height:650px){.dsh-anki{padding-top:10px;padding-bottom:10px}.dsh-anki-head{margin-bottom:8px}.dsh-anki-head .dsh-anki-muted{display:none}.dsh-anki h1{font-size:22px;line-height:30px}.dsh-anki-head-actions button{min-height:34px;padding:5px 10px}.dsh-anki-stats{min-height:54px;padding:5px 0}.dsh-anki-stat strong{font-size:19px;line-height:25px}.dsh-anki .dsh-anki-tab{min-height:38px;padding-top:7px;padding-bottom:6px}}
@media(prefers-reduced-motion:reduce){.dsh-anki button{transition:none}}
`;

    function Glyph({ name, size = 17 }) {
      const paths = {
        sync: 'M20 7v5h-5M4 17v-5h5M5.7 7a7 7 0 0 1 11.6-2L20 8M4 16l2.7 3A7 7 0 0 0 18.3 17',
        play: 'M8 5l11 7-11 7z', search: 'M21 21l-5-5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
        plus: 'M12 5v14M5 12h14', menu: 'M12 5v.01M12 12v.01M12 19v.01',
        save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2zM7 3v6h10V3M7 21v-8h10v8',
        pause: 'M8 5v14M16 5v14', check: 'M5 12l4 4L19 6',
        previous: 'M15 5l-7 7 7 7', next: 'M9 5l7 7-7 7'
      };
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: name === 'play' ? 'currentColor' : 'none', stroke: 'currentColor', strokeWidth: name === 'menu' ? 3.5 : 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }, h('path', { d: paths[name] || paths.plus }));
    }
    function Icon({ size = 22, check = false }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.65, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        check ? h('path', { d: 'm6 12 4 4 8-9' }) : h(React.Fragment, null,
          h('rect', { x: 4, y: 5, width: 14, height: 16, rx: 2 }),
          h('path', { d: 'M8 2h10a3 3 0 0 1 3 3v12M8 10h6M8 14h4' })));
    }
    const sameId = (a, b) => String(a) === String(b);
    const count = (value) => (Number.isFinite(Number(value)) ? Number(value).toLocaleString() : '0');
    const fieldNames = (model) => (model?.fields || []).map((field) => typeof field === 'string' ? field : field.name);
    const tagsFrom = (text) => [...new Set(text.trim().split(/\s+/).filter(Boolean))];
    const tagsText = (tags) => Array.isArray(tags) ? tags.join(' ') : String(tags || '');
    const basenameValid = (name) => /^[^/\\:\x00-\x1f]+\.apkg$/i.test(name) && name !== '..' && !/[. ]$/.test(name);
    function inertContent(html) {
      // Template contents remain inert even for images/iframes while parsing. This
      // prevents speculative external resource loads before the allowlist pass.
      const doc = new DOMParser().parseFromString('<!doctype html><html><body></body></html>', 'text/html');
      const template = doc.createElement('template');
      template.innerHTML = html;
      return { doc, root: template.content };
    }
    function textOnly(value) {
      return inertContent(String(value || '').slice(0, 100000)).root.textContent.replace(/\s+/g, ' ').trim();
    }

    /* The only untrusted HTML surface is this dedicated, opaque-origin card iframe.
     * Parse inertly, strip active elements/attributes, and map bounded local media.
     * Never insert collection HTML into the host document. */
    async function cardDocument(html, css, api) {
      if (String(html || '').length > 2000000 || String(css || '').length > 200000) throw new Error('Card content exceeds the rendering limit.');
      const { doc, root } = inertContent(String(html || ''));
      const allowed = new Set('div p span br b i strong em u s strike del ins sub sup small big center blockquote pre code hr h1 h2 h3 h4 h5 h6 ul ol li dl dt dd table caption thead tbody tfoot tr td th colgroup col ruby rt rp img audio video source a details summary'.split(' '));
      const nodes = [...root.querySelectorAll('*')];
      if (nodes.length > 5000) throw new Error('Card content exceeds the rendering limit.');
      for (const node of nodes) {
        if (!allowed.has(node.localName)) { node.remove(); continue; }
        for (const attr of [...node.attributes]) {
          if (!/^(class|id|title|alt|width|height|colspan|rowspan|align|dir|lang|style|src|poster|controls|loop|type)$/.test(attr.name)) node.removeAttribute(attr.name);
        }
        // All source candidates are replaced below. srcset/href/event handlers are gone.
        if (node.localName === 'audio' || node.localName === 'video') node.setAttribute('controls', '');
      }
      // Native Anki [sound:filename] markers become user-controlled audio players.
      const walker = doc.createTreeWalker(root, 4);
      const texts = [];
      while (walker.nextNode()) texts.push(walker.currentNode);
      let soundCount = 0;
      for (const node of texts) {
        const value = node.nodeValue;
        if (!value.includes('[sound:')) continue;
        const fragment = doc.createDocumentFragment();
        let start = 0;
        for (const match of value.matchAll(/\[sound:([^\]\r\n]{1,255})\]/g)) {
          if (soundCount++ >= 64) break;
          fragment.appendChild(doc.createTextNode(value.slice(start, match.index)));
          const audio = doc.createElement('audio');
          audio.setAttribute('controls', '');
          audio.setAttribute('src', match[1]);
          fragment.appendChild(audio);
          start = match.index + match[0].length;
        }
        fragment.appendChild(doc.createTextNode(value.slice(start)));
        node.replaceWith(fragment);
      }
      let missing = false, budget = 16000000;
      const media = new Map();
      const mediaURI = (raw) => {
        let filename;
        try { filename = decodeURIComponent(String(raw || '')); } catch { return Promise.resolve(null); }
        // No URL schemes, nested paths, traversal, queries, or arbitrary bytes.
        if (!filename || filename.length > 255 || /[/\\:\x00-\x1f?#]/.test(filename) || filename === '.' || filename === '..') return Promise.resolve(null);
        if (media.has(filename)) return media.get(filename);
        if (media.size >= 32) return Promise.resolve(null);
        const pending = api('media.get', { filename }).then((file) => {
          if (!file || !/^(image\/(png|jpeg|gif|webp|avif|bmp)|audio\/(mpeg|mp3|ogg|wav|x-wav|mp4|webm|flac)|video\/(mp4|webm|ogg))$/i.test(file.mime) || typeof file.data !== 'string' || file.data.length > 8000000 || !/^[a-z\d+/]*={0,2}$/i.test(file.data) || file.data.length > budget) return null;
          budget -= file.data.length;
          return `data:${file.mime};base64,${file.data}`;
        }).catch(() => null);
        media.set(filename, pending);
        return pending;
      };
      await Promise.all([...root.querySelectorAll('img,audio,video,source')].map(async (node) => {
        for (const attribute of ['src', 'poster']) {
          if (!node.hasAttribute(attribute)) continue;
          const raw = node.getAttribute(attribute);
          node.removeAttribute(attribute);
          const uri = await mediaURI(raw);
          if (uri) node.setAttribute(attribute, uri); else missing = true;
        }
      }));
      const serialized = doc.createElement('div');
      serialized.appendChild(root); // Detached document, already sanitized to local data URIs.
      const safeCSS = String(css || '').replace(/</g, '\\3c ');
      const csp = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src data:; font-src data:; connect-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'";
      return {
        missing,
        html: '<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="' + csp + '"><style>html{color-scheme:light dark}body{margin:0;padding:24px;font-family:system-ui,sans-serif;overflow-wrap:anywhere}.card{font-size:22px;text-align:center}img,video{max-width:100%;height:auto}audio{max-width:100%}pre{white-space:pre-wrap}' + safeCSS + '</style></head><body class="card">' + serialized.innerHTML + '</body></html>'
      };
    }

    function CardFrame({ html, css, api, t }) {
      const [document, setDocument] = React.useState(null);
      const [failure, setFailure] = React.useState(false);
      React.useEffect(() => {
        let cancelled = false;
        setDocument(null); setFailure(false);
        cardDocument(html, css, api).then((value) => { if (!cancelled) setDocument(value); }, () => { if (!cancelled) setFailure(true); });
        return () => { cancelled = true; };
      }, [html, css, api]);
      if (failure) return h('p', { role: 'alert', className: 'dsh-anki-muted' }, t('cardError'));
      if (!document) return h('div', { className: 'dsh-anki-empty', role: 'status' }, t('cardLoading'));
      return h(React.Fragment, null,
        h('div', { className: 'dsh-anki-frame-wrap' }, h('iframe', { className: 'dsh-anki-frame', title: t('cardFrame'), sandbox: '', referrerPolicy: 'no-referrer', srcDoc: document.html })),
        document.missing && h('p', { className: 'dsh-anki-caption', role: 'status' }, t('mediaNotice')));
    }
    function Field({ label, children, hint }) {
      return h('label', { className: 'dsh-anki-field' }, h('span', null, label), children, hint && h('small', { className: 'dsh-anki-caption' }, hint));
    }
    function Empty({ title, description, children, check }) {
      return h('div', { className: 'dsh-anki-empty' }, h(Icon, { size: 34, check }), h('h2', null, title), h('p', null, description), children);
    }
    function Fields({ names, values, setValues, disabled }) {
      return names.map((name) => h(Field, { key: name, label: name }, h('textarea', {
        value: values[name] || '', disabled, spellCheck: false,
        onChange: (event) => setValues((before) => ({ ...before, [name]: event.target.value }))
      })));
    }
    function syncErrorText(t, code, login = false) {
      const known = {
        AUTH_FAILED: 'syncAuthError', AUTHENTICATION_FAILED: 'syncAuthError', NOT_LOGGED_IN: 'syncAuthError',
        SYNC_BUSY: 'syncBusyError', STALE_CONFIRMATION: 'syncConfirmError', INVALID_CONFIRMATION: 'syncConfirmError',
        FULL_SYNC_CONFIRMATION_REQUIRED: 'syncConfirmError'
      };
      return t(known[String(code || '').replace(/^anki\//, '')] || (login ? 'syncLoginFailed' : 'syncFailed'));
    }

    function SyncPanel({ t, api, account, visible, onStatus, onSettled }) {
      const [snapshot, setSnapshot] = React.useState(null);
      const [username, setUsername] = React.useState('');
      const [password, setPassword] = React.useState('');
      const [pending, setPending] = React.useState(false);
      const [error, setError] = React.useState('');
      const [selection, setSelection] = React.useState({ token: null, direction: '', consent: false });
      const [pollError, setPollError] = React.useState('');
      const alive = React.useRef(false);
      const actionLock = React.useRef(false);
      const generation = React.useRef(0);
      const latest = React.useRef(null);
      const callbacks = React.useRef({ onStatus, onSettled });
      callbacks.current = { onStatus, onSettled };
      function publish(next) {
        if (!alive.current) return;
        if (!next || typeof next.loggedIn !== 'boolean' || typeof next.active !== 'boolean' || typeof next.phase !== 'string') throw new Error();
        const previous = latest.current;
        latest.current = next;
        setSnapshot(next);
        if (previous?.pendingFull?.token !== next.pendingFull?.token) setSelection({ token: null, direction: '', consent: false });
        callbacks.current.onStatus(next);
        // Any terminal collection job may have written before failing/cancelling. Hidden polls can miss its active phase.
        // The initial snapshot is historical; unchanged terminal snapshots must not repeatedly invalidate drafts.
        const terminal = !next.active && ['success', 'error', 'cancelled', 'awaiting-full'].includes(next.phase);
        const changed = previous && (previous.active || previous.jobId !== next.jobId || previous.phase !== next.phase || previous.lastSyncAt !== next.lastSyncAt);
        if (terminal && changed) callbacks.current.onSettled();
      }
      React.useEffect(() => {
        alive.current = true;
        let stopped = false, timer;
        async function poll() {
          const version = generation.current;
          try {
            if (!actionLock.current) {
              const next = await api('sync.status', {});
              if (!stopped && version === generation.current) { publish(next); setPollError(''); }
            }
          } catch (_) { if (!stopped && version === generation.current) setPollError(t('syncFailed')); }
          finally {
            // Status polling only. Automatic sync jobs are scheduled exclusively by the Host.
            if (!stopped) timer = setTimeout(poll, visible || latest.current?.active ? 1000 : 10000);
          }
        }
        poll();
        return () => { stopped = true; alive.current = false; clearTimeout(timer); };
      }, [api, visible, t]);
      async function act(operation, login = false) {
        if (actionLock.current) return;
        actionLock.current = true; generation.current++;
        setPending(true); setError('');
        try { publish(await operation()); }
        catch (failure) { if (alive.current) setError(syncErrorText(t, failure?.code, login)); }
        finally { actionLock.current = false; if (alive.current) setPending(false); }
      }
      const active = !!snapshot?.active;
      const full = snapshot?.pendingFull;
      const allowed = Array.isArray(full?.allowedDirections) ? full.allowedDirections.filter((value) => value === 'upload' || value === 'download') : [];
      const direction = selection.token === full?.token && allowed.includes(selection.direction) ? selection.direction : '';
      const consent = !!direction && selection.consent;
      const locked = pending || active;
      const phases = { idle: 'syncIdle', 'logging-in': 'syncLoggingIn', syncing: 'syncSyncing', media: 'syncMediaPhase', 'full-upload': 'syncUploading', 'full-download': 'syncDownloading', 'awaiting-full': 'syncAwaiting', success: 'syncSuccess', error: 'syncError', cancelled: 'syncCancelled' };
      const action = (label, onClick, disabled = locked, extra = {}) => h('button', { type: 'button', disabled, onClick, ...extra }, label);
      const number = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;
      // Native Anki media counts are localized strings, not numeric protobuf counters. Render only bounded React text.
      const countText = (value) => number(value) ? String(value) : typeof value === 'string' ? value.slice(0, 160).replace(/[\u0000-\u001f\u007f]/g, ' ').trim() : '';
      const progress = snapshot?.progress;
      return h('section', { className: 'dsh-anki-sync' },
        h('h2', null, t('syncTitle')), h('p', { className: 'dsh-anki-caption' }, t('syncIntro')),
        (error || pollError) && h('div', { role: 'alert', className: 'dsh-anki-notice', 'data-error': true }, error || pollError),
        snapshot?.error && h('div', { role: 'alert', className: 'dsh-anki-notice', 'data-error': true }, syncErrorText(t, snapshot.error.code, !snapshot.loggedIn)),
        h('div', { className: 'dsh-anki-transfer-grid' },
          h('section', { className: 'dsh-anki-transfer-card' }, h('h3', null, t('syncAccount')),
            snapshot?.loggedIn
              ? h('div', null, h('p', null, String(snapshot.account || '').slice(0, 200)), action(t('syncLogout'), () => act(() => account('logout', {})), locked || !!full))
              : h('form', { className: 'dsh-anki-form', autoComplete: 'off', onSubmit: (event) => {
                event.preventDefault();
                const credentials = { username: username.trim(), password };
                setPassword(''); // Clear the controlled field before awaiting owner-only RPC.
                if (!credentials.username || !credentials.password || locked || !snapshot) return;
                act(() => account('login', credentials), true);
              } }, h('p', { className: 'dsh-anki-caption' }, t('syncSignedOut')),
                h(Field, { label: t('syncUsername') }, h('input', { value: username, autoComplete: 'off', autoCapitalize: 'none', spellCheck: false, maxLength: 320, disabled: locked || !snapshot, onChange: (event) => setUsername(event.target.value) })),
                h(Field, { label: t('syncPassword') }, h('input', { type: 'password', value: password, autoComplete: 'off', maxLength: 4096, disabled: locked || !snapshot, onChange: (event) => setPassword(event.target.value) })),
                h('p', { className: 'dsh-anki-caption' }, t('syncCredentialsHint')),
                h('button', { type: 'submit', className: 'dsh-anki-primary', disabled: locked || !snapshot || !username.trim() || !password }, t('syncLogin'))),
            h('label', { className: 'dsh-anki-check' }, h('input', { type: 'checkbox', checked: snapshot?.settings?.autoSync !== false, disabled: locked || !snapshot || !!full, onChange: (event) => { const autoSync = event.target.checked; act(() => account('settings', { autoSync })); } }), t('syncAuto')),
            h('p', { className: 'dsh-anki-caption' }, t('syncAutoHint'))),
          h('section', { className: 'dsh-anki-transfer-card' }, h('h3', null, t('syncProgress')),
            h('p', { role: 'status', 'aria-live': 'polite' }, t(phases[snapshot?.phase] || 'syncIdle')),
            progress && h('div', { className: 'dsh-anki-sync-progress' },
              number(progress.total) && progress.total > 0 && number(progress.transferred) && h('progress', { max: progress.total, value: Math.min(progress.total, progress.transferred), 'aria-label': t('syncProgress') }),
              ...['transferred', 'checked', 'added', 'removed'].filter((name) => name === 'transferred' ? number(progress[name]) : !!countText(progress[name])).map((name) => h('span', { key: name }, t({ transferred: 'syncTransferred', checked: 'syncChecked', added: 'syncAdded', removed: 'syncRemoved' }[name]) + ': ' + countText(progress[name])))),
            h('p', { className: 'dsh-anki-caption' }, t('syncLast') + ': ' + (number(snapshot?.lastSyncAt) && snapshot.lastSyncAt ? new Date(snapshot.lastSyncAt).toLocaleString() : t('syncNever'))),
            h('div', { className: 'dsh-anki-actions' },
              action(t('syncNow'), () => act(() => api('sync.run', {})), locked || !snapshot?.loggedIn || !!full, { className: 'dsh-anki-primary' }),
              action(t('syncCancel'), () => act(() => api('sync.cancel', {})), pending || !active),
              action(t('refresh'), () => act(() => api('sync.status', {})), pending)),
            snapshot?.lastBackupPath && h('p', { className: 'dsh-anki-caption' }, t('syncBackup'), h('span', { className: 'dsh-anki-code' }, snapshot.lastBackupPath)))),
        full && h('section', { className: 'dsh-anki-full-sync', 'aria-label': t('syncFullTitle') },
          h('h3', null, t('syncFullTitle')), h('p', null, t('syncFullHint')),
          full.localNoteCount === 0 && allowed.includes('download') && h('p', { className: 'dsh-anki-notice' }, t('syncEmptyHint')),
          h('div', { className: 'dsh-anki-actions' }, ...allowed.map((value) => action(t(value === 'upload' ? 'syncUpload' : 'syncDownload') + (full.recommendedDirection === value ? ' · ' + t('syncRecommended') : ''), () => setSelection({ token: full.token, direction: value, consent: false }), locked, { key: value, 'aria-pressed': direction === value }))),
          direction && h('div', null,
            h('p', { role: 'alert', className: 'dsh-anki-notice', 'data-error': true }, t(direction === 'upload' ? 'syncUploadWarning' : 'syncDownloadWarning')),
            h('label', { className: 'dsh-anki-check' }, h('input', { type: 'checkbox', checked: consent, disabled: locked, onChange: (event) => setSelection({ token: full.token, direction, consent: event.target.checked }) }), t('syncConsent')),
            action(t(direction === 'upload' ? 'syncConfirmUpload' : 'syncConfirmDownload'), () => {
              if (!consent || locked || !full.token || !allowed.includes(direction) || selection.token !== full.token) return;
              const confirmation = { token: full.token, direction };
              setSelection({ token: null, direction: '', consent: false });
              act(() => account('confirmFull', confirmation));
            }, locked || !consent || !full.token, { className: 'dsh-anki-primary' })),
          action(t('syncDismissFull'), () => { setSelection({ token: null, direction: '', consent: false }); act(() => account('dismissFull', {})); }, locked)));
    }

    function preferredModel(models) {
      const name = (model) => String(model.name || '').trim();
      return models.find((model) => /^问答题[（(]输入答案[）)]$/.test(name(model)))
        || models.find((model) => /^basic\s*\(type in the answer\)$/i.test(name(model)))
        || models.find((model) => model.isTypeInAnswer === true)
        || models.find((model) => /^(问答题|basic)$/i.test(name(model)))
        || models.find((model) => !/(image\s*occlusion|图片遮罩|图像遮罩)/i.test(name(model)))
        || models[0];
    }

    function Workspace({ ctx, t, api, account, deckAction }) {
      React.useSyncExternalStore((listener) => ctx.locale.subscribe(listener), () => ctx.locale.getSnapshot().revision);
      const prefix = React.useId();
      const [status, setStatus] = React.useState(null);
      const [decks, setDecks] = React.useState([]);
      const [models, setModels] = React.useState([]);
      const [deckId, setDeckId] = React.useState('');
      const [tab, setTab] = React.useState('browse');
      const [working, setBusy] = React.useState(false);
      const [initializing, setInitializing] = React.useState(true);
      const [error, setError] = React.useState('');
      const [notice, setNotice] = React.useState('');
      const [deckName, setDeckName] = React.useState('');
      const [rename, setRename] = React.useState('');
      const [searchInput, setSearchInput] = React.useState('');
      const [query, setQuery] = React.useState('');
      const [offset, setOffset] = React.useState(0);
      const [notes, setNotes] = React.useState({ items: [], total: 0 });
      const [notesLoading, setNotesLoading] = React.useState(false);
      const [epoch, setEpoch] = React.useState(0);
      const [note, setNote] = React.useState(null);
      const [editFields, setEditFields] = React.useState({});
      const [editTags, setEditTags] = React.useState('');
      const [modelId, setModelId] = React.useState('');
      const [addDeckId, setAddDeckId] = React.useState('');
      const [addFields, setAddFields] = React.useState({});
      const [addTags, setAddTags] = React.useState('');
      const [card, setCard] = React.useState(undefined);
      const [revealed, setRevealed] = React.useState(null);
      const [importName, setImportName] = React.useState('');
      const [exportName, setExportName] = React.useState('');
      const [exportPath, setExportPath] = React.useState('');
      const [syncState, setSyncState] = React.useState(null);
      const [noteStale, setNoteStale] = React.useState(false);
      const [deckControls, setDeckControls] = React.useState('');
      const [deletePreview, setDeletePreview] = React.useState(null);
      const [deleteName, setDeleteName] = React.useState('');
      const busy = working || !!syncState?.active || !!syncState?.pendingFull;
      const lock = React.useRef(false);
      const alive = React.useRef(true);
      const searchGeneration = React.useRef(0);
      const deleteGeneration = React.useRef(0);
      const deleteSafety = React.useRef({ deckId, blocked: busy });
      deleteSafety.current = { deckId, blocked: busy, syncBlocked: !!syncState?.active || !!syncState?.pendingFull };
      const selectedDeck = decks.find((deck) => sameId(deck.id, deckId));
      const selectedModel = models.find((model) => sameId(model.id, modelId));
      const hasCollection = status !== null;
      const names = fieldNames(selectedModel);
      const limit = 50;

      async function perform(operation) {
        if (lock.current || syncState?.active || syncState?.pendingFull) return;
        lock.current = true;
        setBusy(true); setError(''); setNotice('');
        try { return await operation(); }
        catch (failure) { if (alive.current) setError(failure?.message || t('unknownError')); }
        finally { lock.current = false; if (alive.current) setBusy(false); }
      }
      function clearDelete() { deleteGeneration.current++; setDeletePreview(null); setDeleteName(''); }
      async function reload() {
        clearDelete(); setCard(undefined); setRevealed(null);
        const [nextStatus, nextDecks, nextModels] = await Promise.all([api('status', {}), api('decks.list', {}), api('models.list', {})]);
        if (!alive.current) return;
        setStatus(nextStatus); setDecks(nextDecks); setModels(nextModels);
        setDeckId((before) => before && !nextDecks.some((deck) => sameId(deck.id, before)) ? '' : before);
        setAddDeckId((before) => nextDecks.some((deck) => sameId(deck.id, before)) ? before : String(nextDecks[0]?.id || ''));
        setModelId((before) => nextModels.some((model) => sameId(model.id, before)) ? before : String(preferredModel(nextModels)?.id || ''));
        setEpoch((before) => before + 1);
      }
      React.useEffect(() => {
        alive.current = true;
        perform(async () => { try { await reload(); } finally { if (alive.current) setInitializing(false); } });
        return () => { alive.current = false; searchGeneration.current++; };
      }, []);
      React.useEffect(() => { setRename(selectedDeck?.name || ''); }, [selectedDeck?.id, selectedDeck?.name]);
      const effectiveQuery = selectedDeck ? `deck:"${selectedDeck.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}" ${query}`.trim() : query;
      React.useEffect(() => {
        if (!hasCollection || syncState?.active || syncState?.pendingFull) return;
        const generation = ++searchGeneration.current;
        setNotesLoading(true);
        api('notes.search', { query: effectiveQuery, offset, limit }).then((result) => {
          if (alive.current && generation === searchGeneration.current) {
            // Deletions/imports can shrink the last page; clamp rather than show a phantom page.
            if (offset > 0 && result.total <= offset) setOffset(Math.max(0, Math.floor((result.total - 1) / limit) * limit));
            else setNotes(result);
          }
        }, (failure) => { if (alive.current && generation === searchGeneration.current) setError(failure?.message || t('unknownError')); })
          .finally(() => { if (alive.current && generation === searchGeneration.current) setNotesLoading(false); });
        return () => { if (generation === searchGeneration.current) searchGeneration.current++; };
      }, [hasCollection, effectiveQuery, offset, epoch, api, !!syncState?.active, !!syncState?.pendingFull]);
      React.useEffect(() => () => { if (tab === 'review') account('releaseReview', {}).catch(() => {}); }, [account, tab === 'review', deckId]);
      function changeTab(value) {
        if (tab === 'review' && value !== 'review') { setCard(undefined); setRevealed(null); }
        setTab(value);
      }

      function chooseDeck(value) {
        clearDelete(); deleteSafety.current.deckId = value;
        setDeckId(value); setOffset(0); setNote(null); setCard(undefined); setRevealed(null);
        if (value) setAddDeckId(value);
      }
      const deleteFailure = (failure) => {
        const code = String(failure?.code || '').replace(/^anki\//, '');
        return new Error(t(code === 'DEFAULT_DECK_PROTECTED' ? 'deleteDefault' : ['STALE_CONFIRMATION', 'CONFIRMATION_MISMATCH', 'DELETE_SCOPE_CHANGED'].includes(code) ? 'deleteChanged' : 'deleteFailed'));
      };
      function previewDelete() {
        if (!selectedDeck || sameId(selectedDeck.id, 1) || lock.current || deleteSafety.current.blocked) return;
        const target = { id: selectedDeck.id, name: selectedDeck.name };
        const generation = ++deleteGeneration.current;
        setDeleteName(''); setDeletePreview({ deckId: target.id, name: target.name, generation, pending: true });
        perform(async () => {
          try {
            const result = await deckAction('previewDelete', { deckId: target.id });
            if (!alive.current || generation !== deleteGeneration.current || !sameId(deleteSafety.current.deckId, target.id) || deleteSafety.current.syncBlocked) return;
            if (!result || typeof result.token !== 'string' || !result.token || !sameId(result.deckId, target.id) || result.name !== target.name) throw new Error('Invalid deletion preview');
            setDeletePreview({ ...result, generation, pending: false });
          } catch (failure) {
            if (!alive.current || generation !== deleteGeneration.current) return;
            clearDelete(); throw deleteFailure(failure);
          }
        });
      }
      function confirmDelete(event) {
        event.preventDefault();
        if (lock.current || deleteSafety.current.blocked || !deletePreview?.token || deletePreview.pending || deletePreview.generation !== deleteGeneration.current || !sameId(deletePreview.deckId, deleteSafety.current.deckId) || deleteName !== deletePreview.name) return;
        const confirmation = { token: deletePreview.token, confirmName: deleteName };
        clearDelete(); // Consume local authorization before awaiting the destructive owner RPC.
        perform(async () => {
          try { const result = await deckAction('delete', confirmation); if (result?.deleted !== true) throw new Error(t('deleteFailed')); }
          catch (failure) { throw deleteFailure(failure); }
          setNote(null); setEditFields({}); setEditTags(''); setNoteStale(false);
          setCard(undefined); setRevealed(null); setOffset(0); setDeckId(''); setAddDeckId('');
          setAddFields({}); setAddTags(''); setNotes({ items: [], total: 0 }); searchGeneration.current++;
          await reload(); notify('deckDeleted');
        });
      }
      function acceptNote(value) { setNote(value); setEditFields({ ...value.fields }); setEditTags(tagsText(value.tags)); }
      async function fetchNote(id) { acceptNote(await api('notes.get', { noteId: id })); setNoteStale(false); }
      async function nextReview() {
        if (!selectedDeck) throw new Error(t('chooseDeck'));
        const next = await api('review.next', { deckId: selectedDeck.id });
        setCard(next); setRevealed(null);
      }
      async function syncCounts() {
        clearDelete(); setCard(undefined); setRevealed(null); // Mutations invalidate backend review tokens.
        const [nextStatus, nextDecks] = await Promise.all([api('status', {}), api('decks.list', {})]);
        setStatus(nextStatus); setDecks(nextDecks); setEpoch((before) => before + 1);
      }
      const button = (label, action, options = {}) => h('button', { type: 'button', disabled: busy, onClick: action, ...options }, label);
      const submit = (label, disabled = false) => h('button', { type: 'submit', className: 'dsh-anki-primary', disabled: busy || disabled }, label);
      const stat = (label, value, kind) => h('div', { className: 'dsh-anki-stat', key: label, 'data-kind': kind || null }, h('strong', null, kind ? h('span', { className: 'dsh-anki-dot', 'aria-hidden': true }) : null, count(value)), h('span', null, label));
      const iconButton = (glyph, label, action, expanded) => button(h(Glyph, { name: glyph, size: 16 }), action, { className: 'dsh-anki-icon-button', 'aria-label': label, title: label, 'aria-expanded': expanded ? 'true' : 'false' });
      const dirty = !!note && (JSON.stringify(editFields) !== JSON.stringify(note.fields || {}) || editTags !== tagsText(note.tags));
      const deckStats = selectedDeck ? [stat(t('new'), selectedDeck.newCount, 'new'), stat(t('learn'), selectedDeck.learnCount, 'learn'), stat(t('due'), selectedDeck.reviewCount, 'due')] : [];
      const statCount = 3 + deckStats.length;
      const notify = (key) => setNotice(t(key));
      const deckOptions = decks.map((deck) => h('option', { key: String(deck.id), value: String(deck.id) }, deck.name));
      const importsDir = status?.importsDir || (status?.collectionPath ? String(status.collectionPath).replace(/[\\/][^\\/]+$/, '') + '/imports' : '—');

      const aside = h('aside', { className: 'dsh-anki-aside', 'aria-label': t('decks') },
        h('div', { className: 'dsh-anki-section-head' }, h('h2', null, t('decks')),
          h('div', { className: 'dsh-anki-rail-actions' },
            iconButton('plus', t('createDeck'), () => setDeckControls((before) => before === 'create' ? '' : 'create'), deckControls === 'create'),
            iconButton('menu', t('manageDecks'), () => setDeckControls((before) => before === 'manage' ? '' : 'manage'), deckControls === 'manage'))),
        h('div', { className: 'dsh-anki-aside-scroll', 'data-controls': deckControls ? 'true' : 'false' },
          h('div', { className: 'dsh-anki-decks' },
            button(t('allDecks'), () => chooseDeck(''), { className: 'dsh-anki-deck', 'aria-pressed': !deckId }),
            ...decks.map((deck) => button(h(React.Fragment, null, h('span', { className: 'dsh-anki-deck-name' }, deck.name), h('span', { className: 'dsh-anki-badge', title: t('total') }, count(deck.total))),
              () => chooseDeck(String(deck.id)), { key: String(deck.id), className: 'dsh-anki-deck', 'aria-pressed': sameId(deckId, deck.id), title: `${deck.name} · ${t('new')}: ${count(deck.newCount)} · ${t('learn')}: ${count(deck.learnCount)} · ${t('due')}: ${count(deck.reviewCount)}` })),
            !decks.length && h('p', { className: 'dsh-anki-caption' }, t('noDecks'))),
          deckControls === 'create' && h('div', { className: 'dsh-anki-deck-controls' },
            h('form', { onSubmit: (event) => { event.preventDefault(); perform(async () => {
              if (!deckName.trim()) throw new Error(t('nameRequired'));
              await api('decks.create', { name: deckName.trim() }); setDeckName(''); await reload(); notify('deckCreated');
            }); } }, h('label', { htmlFor: prefix + '-create' }, t('deckName')), h('input', { id: prefix + '-create', value: deckName, maxLength: 200, placeholder: t('deckPlaceholder'), disabled: busy, onChange: (event) => setDeckName(event.target.value) }), submit(t('createDeck'), !deckName.trim()))),
          deckControls === 'manage' && h('div', { className: 'dsh-anki-deck-controls' },
            selectedDeck ? h('form', { onSubmit: (event) => { event.preventDefault(); perform(async () => {
              if (!rename.trim()) throw new Error(t('nameRequired'));
              await api('decks.rename', { deckId: selectedDeck.id, name: rename.trim() }); await reload(); notify('deckRenamed');
            }); } }, h('label', { htmlFor: prefix + '-rename' }, t('renameDeck')), h('input', { id: prefix + '-rename', value: rename, maxLength: 200, disabled: busy, onChange: (event) => setRename(event.target.value) }), submit(t('renameDeck'), !rename.trim() || rename.trim() === selectedDeck.name))
              : h('p', { className: 'dsh-anki-caption' }, t('selectDeckHint')),
            selectedDeck && h('div', { className: 'dsh-anki-actions', style: { marginTop: 10 } },
              button(t('deleteDeck'), previewDelete, { disabled: busy || sameId(selectedDeck.id, 1), title: sameId(selectedDeck.id, 1) ? t('deleteDefault') : t('deleteWarning') })),
            selectedDeck && sameId(selectedDeck.id, 1) && h('p', { className: 'dsh-anki-caption' }, t('deleteDefault')))),
        h('footer', { className: 'dsh-anki-foot' },
          h('div', { className: 'dsh-anki-engine' }, h('span', { title: t('version') }, t('version') + ' · ' + String(status?.version || '—')),
            h('span', { title: status?.collectionPath || '' }, status?.collectionPath ? t('localOnly') + ' · ' + String(status.collectionPath).replace(/^.*[\\/]/, '') : t('localOnly'))),
          button(t('refresh'), () => perform(reload), { disabled: busy })));

      const deletePanel = deletePreview && h('section', { className: 'dsh-anki-full-sync dsh-anki-delete', style: { marginBottom: 20 }, 'aria-labelledby': prefix + '-delete-title' },
        h('h2', { id: prefix + '-delete-title' }, t('deleteTitle')), h('strong', null, deletePreview.name),
        deletePreview.pending ? h('p', { role: 'status' }, t('deleteLoading')) : h(React.Fragment, null,
          h('dl', { className: 'dsh-anki-paths' }, ...[['deleteAffectedDecks', 'deckCount'], ['deleteCards', 'cardCount'], ['deleteNotes', 'noteCount'], ['deleteReturned', 'returnedCardCount']].map(([label, key]) => h(React.Fragment, { key }, h('dt', null, t(label)), h('dd', null, count(deletePreview[key]))))),
          deletePreview.filtered && h('p', { className: 'dsh-anki-notice' }, t('deleteFilteredHint')),
          h('p', { className: 'dsh-anki-notice', role: 'alert' }, t('deleteWarning')),
          h('form', { className: 'dsh-anki-form', onSubmit: confirmDelete },
            h(Field, { label: t('deleteConfirmName') }, h('input', { value: deleteName, autoComplete: 'off', spellCheck: false, disabled: busy, maxLength: 1000, onChange: (event) => setDeleteName(event.target.value) })),
            submit(t('deleteConfirm'), deleteName !== deletePreview.name))),
        button(t('deleteCancel'), clearDelete, { disabled: false }));

      const editModel = note && models.find((model) => typeof note.model === 'object' ? sameId(model.id, note.model.id) : sameId(model.id, note.model) || model.name === note.model);
      const editNames = editModel ? fieldNames(editModel) : Object.keys(note?.fields || {});
      const suspended = (note?.cards || []).filter((item) => item.suspended).length;
      const allSuspended = !!note?.cards?.length && suspended === note.cards.length;
      const editorState = noteStale ? ['stale', 'reloadRequired', 'pencil'] : dirty ? ['draft', 'unsaved', 'pencil'] : ['saved', 'savedState', 'check'];
      const editor = note ? h('div', { className: 'dsh-anki-editor' },
        h('div', { className: 'dsh-anki-editor-head' }, h('h2', null, t('editNote')),
          h('div', { className: 'dsh-anki-editor-status', 'data-state': editorState[0], role: 'status' },
            h(Glyph, { name: editorState[2], size: 14 }), h('span', null, t(editorState[1])),
            noteStale && button(t('reloadNote'), () => perform(() => fetchNote(note.id)), { className: 'dsh-anki-editor-reload', title: t('reloadNote') }))),
        h('dl', { className: 'dsh-anki-note-context' },
          h('div', null, h('dt', null, t('deck')), h('dd', null, selectedDeck?.name || t('allDecks'))),
          h('div', null, h('dt', null, t('model')), h('dd', null, editModel?.name || (typeof note.model === 'object' ? note.model?.name : note.model) || '—', h('small', null, ' · ' + t('noteId') + ' ' + note.id)))),
        h('form', { className: 'dsh-anki-form dsh-anki-edit-form', onSubmit: (event) => { event.preventDefault(); perform(async () => {
          const modified = note.modified; // Opaque numeric revision, never a timestamp or Date.
          if (typeof modified !== 'number' || !Number.isFinite(modified)) throw new Error(t('modifiedError'));
          if (noteStale) throw new Error(t('syncChanged'));
          await api('notes.update', { noteId: note.id, fields: editFields, tags: tagsFrom(editTags), expectedModified: modified });
          await fetchNote(note.id); await syncCounts(); notify('saved');
        }); } },
        h('div', { className: 'dsh-anki-editor-fields' },
          h('p', { className: 'dsh-anki-caption' }, t('fieldHint')),
          h(Fields, { names: editNames, values: editFields, setValues: setEditFields, disabled: busy }),
          h(Field, { label: t('tags') }, h('input', { value: editTags, placeholder: t('tagsPlaceholder'), disabled: busy, onChange: (event) => setEditTags(event.target.value) }))),
        h('div', { className: 'dsh-anki-editor-footer' },
          note.cards?.length ? button(allSuspended ? t('unsuspend') : t('suspend'), () => perform(async () => {
            if (noteStale) throw new Error(t('syncChanged'));
            await api('cards.suspend', { cardIds: note.cards.map((item) => item.id), suspend: !allSuspended });
            // Reload card metadata without discarding unsaved field/tag edits.
            const updated = await api('notes.get', { noteId: note.id });
            setNote((before) => ({ ...before, cards: updated.cards })); // Preserve the draft's original optimistic revision.
            setCard(undefined); setRevealed(null); await syncCounts(); notify('suspensionSaved');
          }), { disabled: busy || noteStale }) : h('span', { className: 'dsh-anki-caption' }, t('noCards')),
          h('span', { className: 'dsh-anki-caption dsh-anki-suspension-info' }, note.cards?.length ? `${t('suspended')}: ${suspended}/${note.cards.length}` : ''),
          submit(t('save'), noteStale))))
        : h('div', { className: 'dsh-anki-editor' }, h(Empty, { title: t('editNote'), description: t('selectNote') }));

      const browse = h('section', { className: 'dsh-anki-browse' },
        h('div', { className: 'dsh-anki-browser' }, h('div', { className: 'dsh-anki-results', 'aria-busy': notesLoading },
          h('div', { className: 'dsh-anki-results-head' },
            h('form', { className: 'dsh-anki-search', onSubmit: (event) => { event.preventDefault(); setOffset(0); setQuery(searchInput.trim()); setEpoch((before) => before + 1); } },
              h('div', { className: 'dsh-anki-search-box' }, h(Glyph, { name: 'search', size: 16 }),
                h('input', { type: 'search', 'aria-label': t('query'), value: searchInput, placeholder: t('queryPlaceholder'), disabled: busy, onChange: (event) => setSearchInput(event.target.value) })),
              submit(t('search'))),
            h('span', { className: 'dsh-anki-caption', role: 'status', title: t('results') }, notesLoading ? t('loading') : count(notes.total))),
          h('p', { className: 'dsh-anki-caption dsh-anki-search-hint' }, t('searchHint')),
          h('div', { className: 'dsh-anki-list' }, ...(notes.items || []).map((item) => {
            const modelName = typeof item.model === 'object' ? item.model.name : item.model;
            const deckName = typeof item.deck === 'object' ? item.deck.name : item.deck;
            const raw = textOnly(item.preview || Object.values(item.fields || {})[0]) || String(item.id);
            const title = raw.split(/\r?\n/)[0].slice(0, 90);
            const rest = raw.slice(title.length).trim();
            return button(h(React.Fragment, null, h('span', { className: 'dsh-anki-note-title' }, title),
              rest && h('span', { className: 'dsh-anki-preview' }, rest),
              h('span', { className: 'dsh-anki-note-meta' }, modelName && h('span', null, String(modelName)), deckName && h('span', null, String(deckName)), item.cards?.some((entry) => entry.suspended) && h('span', { className: 'dsh-anki-suspended' }, t('suspended')))),
              () => perform(() => fetchNote(item.id)), { key: String(item.id), className: 'dsh-anki-note', 'aria-pressed': !!note && sameId(note.id, item.id) });
          }), !notesLoading && !notes.items?.length && h('p', { className: 'dsh-anki-muted' }, t('noNotes'))),
          h('div', { className: 'dsh-anki-pagination' }, button(t('previous'), () => setOffset(Math.max(0, offset - limit)), { disabled: busy || notesLoading || !offset }),
            h('span', { className: 'dsh-anki-caption' }, `${t('page')} ${Math.floor(offset / limit) + 1} ${t('of')} ${Math.max(1, Math.ceil(notes.total / limit))}`),
            button(t('next'), () => setOffset(offset + limit), { disabled: busy || notesLoading || offset + limit >= notes.total }))), editor));

      const add = h('form', { className: 'dsh-anki-form', onSubmit: (event) => { event.preventDefault(); perform(async () => {
        const deck = decks.find((item) => sameId(item.id, addDeckId));
        if (!deck || !selectedModel) throw new Error(t('chooseDeck'));
        const fields = Object.fromEntries(names.map((name) => [name, addFields[name] || '']));
        if (!Object.values(fields).some((value) => value.trim())) throw new Error(t('fieldsRequired'));
        await api('notes.add', { deckId: deck.id, modelId: selectedModel.id, fields, tags: tagsFrom(addTags) });
        setAddFields({}); await syncCounts(); notify('added');
      }); } },
        h('p', { className: 'dsh-anki-muted' }, t('addHint')),
        h('div', { className: 'dsh-anki-form-grid' }, h(Field, { label: t('deck') }, h('select', { value: addDeckId, disabled: busy || !decks.length, onChange: (event) => setAddDeckId(event.target.value) }, !decks.length && h('option', { value: '' }, t('chooseDeck')), ...deckOptions)),
          h(Field, { label: t('model') }, h('select', { value: modelId, disabled: busy || !models.length, onChange: (event) => setModelId(event.target.value) }, ...models.map((model) => h('option', { key: String(model.id), value: String(model.id) }, model.name))))),
        !models.length && h('p', { className: 'dsh-anki-muted' }, t('noModels')),
        h(Fields, { names, values: addFields, setValues: setAddFields, disabled: busy }),
        h('p', { className: 'dsh-anki-caption' }, t('fieldHint')),
        selectedModel && (selectedModel.type === 1 || /cloze/i.test(selectedModel.name)) && h('p', { className: 'dsh-anki-caption' }, t('clozeHint')),
        h(Field, { label: t('tags') }, h('input', { value: addTags, placeholder: t('tagsPlaceholder'), disabled: busy, onChange: (event) => setAddTags(event.target.value) })),
        h('div', { className: 'dsh-anki-actions' }, submit(t('add'), !selectedModel || !addDeckId)));

      const review = h('section', null,
        h('div', { className: 'dsh-anki-review-head' }, h('h2', null, t('reviewTitle')), h('p', { className: 'dsh-anki-muted' }, t('reviewHint'))),
        card ? h(React.Fragment, null,
          h('div', { className: 'dsh-anki-review-meta' }, h('span', { className: 'dsh-anki-caption' }, card.deckName || selectedDeck?.name || t('allDecks')), h('span', { className: 'dsh-anki-badge' }, t('remaining') + ': ' + count(typeof card.remaining === 'object' ? card.remaining?.total ?? ['new', 'learn', 'review'].reduce((sum, key) => sum + (Number(card.remaining?.[key]) || 0), 0) : card.remaining))),
          h('div', { className: 'dsh-anki-kicker' }, t(revealed ? 'answer' : 'question')),
          h(CardFrame, { key: String(card.token) + (revealed ? '-answer' : '-question'), html: revealed ? revealed.answer : card.question, css: revealed?.css ?? card.css, api, t }),
          h('div', { className: 'dsh-anki-review-actions' }, !revealed ? button(t('reveal'), () => perform(async () => { setRevealed(await api('review.reveal', { token: card.token })); }), { className: 'dsh-anki-primary' })
            : (revealed.buttons || []).filter((entry) => [1, 2, 3, 4].includes(entry.rating)).map((entry) => button(h(React.Fragment, null, h('strong', null, `${entry.rating} · ${t(['', 'again', 'hard', 'good', 'easy'][entry.rating])}`), h('span', null, entry.interval || entry.label || '')),
              () => perform(async () => {
                await api('review.answer', { token: revealed.token || card.token, rating: entry.rating });
                // Immediately retire consumed tokens, even if a subsequent refresh fails.
                setCard(undefined); setRevealed(null); await syncCounts(); await nextReview();
              }), { key: entry.rating, className: 'dsh-anki-rating' }))))
          : h(Empty, { check: card === null, title: t(card === null ? 'reviewEmpty' : 'reviewIdle'), description: t(card === null ? 'reviewEmptyHint' : 'reviewIdleHint') },
            button(t(card === null ? 'nextCard' : 'startReview'), () => perform(nextReview), { className: 'dsh-anki-primary', disabled: busy || !selectedDeck })),
        h('div', { className: 'dsh-anki-review-footer' }, h('span', { className: 'dsh-anki-caption' }, t('safeCard')),
          h('div', { className: 'dsh-anki-actions' },
            card && button(t('refresh'), () => perform(nextReview), { disabled: busy || !selectedDeck }),
            button(t('undo'), () => perform(async () => { await api('review.undo', {}); setCard(undefined); setRevealed(null); await syncCounts(); await nextReview(); notify('undoDone'); }), { disabled: busy || !selectedDeck || status?.undo?.available === false }))));

      const transfer = h('section', { className: 'dsh-anki-transfer' },
        h('h2', null, t('transferTitle')),
        h('div', { className: 'dsh-anki-transfer-notice' }, t('transferNotice')),
        h('dl', { className: 'dsh-anki-paths' }, h('dt', null, t('collectionPath')), h('dd', null, status?.collectionPath || '—'), h('dt', null, t('importsDir')), h('dd', null, importsDir)),
        h('div', { className: 'dsh-anki-transfer-grid' },
          h('form', { className: 'dsh-anki-transfer-card', onSubmit: (event) => { event.preventDefault(); perform(async () => {
            const filename = importName.trim(); if (!basenameValid(filename)) throw new Error(t('filenameError'));
            await api('import.apkg', { filename }); setCard(undefined); setRevealed(null); setNote(null); await reload(); notify('importDone');
          }); } }, h('h3', null, t('importTitle')), h('p', { className: 'dsh-anki-caption' }, t('importHint')),
            h(Field, { label: t('importFilename') }, h('input', { value: importName, placeholder: 'my-deck.apkg', maxLength: 255, disabled: busy, onChange: (event) => setImportName(event.target.value) })), submit(t('importAction'), !importName.trim())),
          h('form', { className: 'dsh-anki-transfer-card', onSubmit: (event) => { event.preventDefault(); perform(async () => {
            const filename = exportName.trim(); if (filename && !basenameValid(filename)) throw new Error(t('filenameError'));
            const result = await api('export.apkg', { ...(selectedDeck ? { deckId: selectedDeck.id } : {}), ...(filename ? { filename } : {}) });
            setExportPath(typeof result === 'string' ? result : result.path || ''); notify('exportDone');
          }); } }, h('h3', null, t('exportTitle')), h('p', { className: 'dsh-anki-caption' }, t('exportHint')), h('span', { className: 'dsh-anki-badge' }, selectedDeck?.name || t('allDecks')),
            h(Field, { label: t('exportFilename') }, h('input', { value: exportName, placeholder: 'export.apkg', maxLength: 255, disabled: busy, onChange: (event) => setExportName(event.target.value) })), submit(t('exportAction')))),
        exportPath && h('div', { role: 'status' }, h('h3', null, t('exportDone')), h('p', { className: 'dsh-anki-code' }, exportPath)));

      const tabs = ['browse', 'add', 'review', 'transfer', 'sync'];
      const headActions = h('div', { className: 'dsh-anki-head-actions' },
        button(h(React.Fragment, null, h(Glyph, { name: 'sync', size: 16 }), busy ? t('working') : t('refresh')), () => perform(reload), { title: t('refresh') }),
        selectedDeck && button(h(React.Fragment, null, h(Glyph, { name: 'play', size: 15 }), t('startReview'), h('span', { className: 'dsh-anki-count' }, count(selectedDeck.reviewCount))),
          () => changeTab('review'), { className: 'dsh-anki-primary', disabled: working }));
      const idleAside = h('aside', { className: 'dsh-anki-aside' }, h('div', { className: 'dsh-anki-section-head' }, h('h2', null, t('decks'))),
        h('footer', { className: 'dsh-anki-foot' }, h('div', { className: 'dsh-anki-engine' }, h('span', null, t('localOnly')))));
      return h('div', { className: 'dsh-anki' }, h('style', null, CSS), h('div', { className: 'dsh-anki-wrap' },
        h('div', { className: 'dsh-anki-overview' },
          h('header', { className: 'dsh-anki-head' }, h('div', null, h('div', { className: 'dsh-anki-kicker' }, t('localOnly')), h('h1', null, t('title')), h('p', { className: 'dsh-anki-muted' }, t('subtitle'))),
            headActions),
          error && h('div', { className: 'dsh-anki-notice', role: 'alert', 'data-error': true }, h('span', null, error), button(t('dismiss'), () => setError(''), { disabled: false })),
          notice && h('div', { className: 'dsh-anki-notice', role: 'status' }, h('span', null, notice), button(t('dismiss'), () => setNotice(''), { disabled: false })),
          syncState?.pendingFull && h('div', { className: 'dsh-anki-notice', role: 'alert' }, h('span', null, t('syncDecisionBanner')), button(t('syncOpen'), () => changeTab('sync'), { disabled: false })),
          note && noteStale && h('div', { className: 'dsh-anki-notice', role: 'alert' }, t('syncChanged')),
          status && h('div', { className: 'dsh-anki-stats', 'data-count': statCount }, stat(t('notes'), status.noteCount), stat(t('cards'), status.cardCount), stat(t('decks'), decks.length), ...deckStats)),
        h('div', { className: 'dsh-anki-tabs', role: 'tablist', 'aria-label': t('title') }, ...tabs.map((id, index) => button(t(id), () => changeTab(id), {
          key: id, disabled: working, id: prefix + '-tab-' + id, role: 'tab', 'aria-selected': tab === id, 'aria-controls': prefix + '-panel', tabIndex: tab === id ? 0 : -1, className: 'dsh-anki-tab',
          onKeyDown: (event) => {
            const target = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
            if (target < 0) return; event.preventDefault(); changeTab(tabs[target]);
            event.currentTarget.parentElement.children[target].focus();
          }
        }))),
        h('div', { className: 'dsh-anki-layout' }, status ? aside : idleAside,
          h('main', { className: 'dsh-anki-main' }, deletePanel,
            h('div', { className: 'dsh-anki-panel' + (tab === 'browse' && status && !initializing ? ' dsh-anki-panel-browse' : ''), id: prefix + '-panel', role: 'tabpanel', 'aria-labelledby': prefix + '-tab-' + tab },
              h('div', { hidden: tab === 'sync' }, initializing ? h('p', { role: 'status', className: 'dsh-anki-muted' }, t('loading')) : !status ? h(Empty, { title: t('notReady'), description: t('notReadyHint') }, button(t('retry'), () => perform(reload), { className: 'dsh-anki-primary' })) : tab === 'browse' ? browse : tab === 'add' ? add : tab === 'review' ? review : transfer),
              h('div', { hidden: tab !== 'sync' }, h(SyncPanel, { t, api, account, visible: tab === 'sync',
                onStatus: (next) => { setSyncState(next); if (next.active || next.pendingFull) { deleteSafety.current.blocked = true; deleteSafety.current.syncBlocked = true; clearDelete(); setCard(undefined); setRevealed(null); } },
                onSettled: () => { setNoteStale(true); setCard(undefined); setRevealed(null); reload().catch(() => { if (alive.current) setError(t('syncFailed')); }); }
              })))))));
    }
    return {
      inject: ['slots', 'layout', 'locale', 'connection'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'anki-workspace: dictionaries');
        const t = ctx.locale.bind(NS);
        const api = async (action, params = {}) => {
          const result = await ctx.connection.rpc.call('/api', 'ankiWorkspace/execute', { args: { action, params } });
          if (!result || typeof result.ok !== 'boolean') throw new Error(t('transportError'));
          if (!result.ok) {
            const failure = new Error(typeof result.error === 'string' ? result.error : result.error?.message || t('unknownError'));
            failure.code = result.error?.code;
            throw failure;
          }
          return result.value;
        };
        // Credentials and destructive full-sync confirmations never use the AI execute route.
        const account = async (action, params = {}) => {
          let result;
          try { result = await ctx.connection.rpc.call('/api', 'ankiWorkspace/account', { args: { action, params } }); }
          catch (_) { throw new Error(t(action === 'login' ? 'syncLoginFailed' : 'syncFailed')); }
          if (!result || typeof result.ok !== 'boolean' || !result.ok) {
            const failure = new Error(t(action === 'login' ? 'syncLoginFailed' : 'syncFailed'));
            failure.code = result?.error?.code;
            throw failure;
          }
          return result.value;
        };
        const deckAction = async (action, params = {}) => {
          const result = await ctx.connection.rpc.call('/api', 'ankiWorkspace/deckAction', { args: { action, params } });
          if (!result || typeof result.ok !== 'boolean') throw new Error(t('transportError'));
          if (!result.ok) {
            const failure = new Error(t('deleteFailed'));
            failure.code = result.error?.code;
            throw failure;
          }
          return result.value;
        };
        ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID, locale: NS, inject: () => ({ ctx, t, api, account, deckAction }) }, Workspace));
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 15, label: () => t('panel'), locale: NS }, Icon));
      }
    };
  }
});
