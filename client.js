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
      modified: "Recently modified", created: "Recently created", sort: "Sort notes",
      overview: "Overview",
      todayOverview: "Today",
      todayReview: "Today’s reviews",
      daysUnit: "days",
      streak: "Study streak",
      thisWeek: "Reviews this week",
      activeDays: "Active days",
      heatmap: "Study activity",
      heatHint: "Darker squares indicate more reviews",
      dailyReviews: "Daily reviews · 14 days",
      legendReviews: "Light · learning   Dark · review & relearning",
      forecast: "Due over the next 7 days",
      theme: "Theme color",
      appearance: "Day / night mode",
      language: "Language",
      quickAdd: "New note",
      deckSearch: "Search decks",
      progress: "Today’s progress",
      actions: "Actions",
      collapse: "Collapse",
      expand: "Expand",
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
      deleteDefault: 'The Default deck (ID 1), and any deck containing it, cannot be deleted.', deleteChanged: 'The deck contents or confirmation changed. Preview the deletion again.',
      deleteFailed: 'Deletion preview or deletion failed. Preview it again before retrying.', deckDeleted: 'Deck deleted. Collection refreshed.',
      browse: 'Browse', add: 'Add note', review: 'Review', transfer: 'Transfer', query: 'Search notes',
      queryPlaceholder: 'Words, tag:… or is:suspended', search: 'Search',
      searchHint: 'Uses Anki search syntax. The selected deck is included in your search.', results: 'Results',
      noNotes: 'No notes found. Try another search or add a note.', selectNote: 'Select a note to edit its fields, tags, or suspension state.',
      previous: 'Previous', next: 'Next', editNote: 'Edit note', noteId: 'Note ID', model: 'Note type', deck: 'Deck', fields: 'Fields',
      tags: 'Tags', tagsPlaceholder: 'Separate tags with spaces', fieldHint: 'Select text to format it, paste a screenshot, or use </> to edit HTML.',
      bold: 'Bold (Ctrl+B)',
      italic: 'Italic (Ctrl+I)',
      underline: 'Underline (Ctrl+U)',
      superscript: 'Superscript',
      subscript: 'Subscript',
      insertUnorderedList: 'Bulleted list',
      insertOrderedList: 'Numbered list',
      removeFormat: 'Clear formatting',
      htmlMode: 'HTML source',
      sourceRequired: 'This field contains custom HTML. Edit it in source mode to preserve its markup.',
      imageInserted: 'Image saved to the collection and inserted.', imageFailed: 'Could not save the pasted image.', imageTooLarge: 'Image exceeds 5 MB.',
      clozeHint: 'Cloze example: The capital of France is {{c1::Paris}}.', save: 'Save changes', reloadNote: 'Reload note',
      saved: 'Note saved.', added: 'Note added. Ready for the next one.', addHint: 'Choose a deck and note type, then fill in the fields.',
      chooseDeck: 'Choose a deck', noModels: 'This collection has no note types.',
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
      syncFailed: 'Synchronization could not finish. Check your connection and account, then retry.',
      syncAuthError: 'Sign in again to continue synchronization.', syncBusyError: 'A synchronization job is using the collection. Wait for it to finish or cancel it.',
      syncConfirmError: 'The full-sync confirmation expired or changed. Select the direction again.',
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
      modified: "最近修改", created: "最近创建", sort: "笔记排序",
      overview: "概览",
      todayOverview: "今日概览",
      todayReview: "今日复习",
      daysUnit: "天",
      streak: "连续打卡",
      thisWeek: "本周复习次数",
      activeDays: "打卡天数",
      heatmap: "学习足迹",
      heatHint: "颜色越深，当天复习次数越多",
      dailyReviews: "每日复习量 · 最近 14 天",
      legendReviews: "浅色 · 学习　深色 · 复习及重学",
      forecast: "未来七天到期",
      theme: "主题色",
      appearance: "日间／夜间模式",
      language: "语言",
      quickAdd: "制卡",
      deckSearch: "搜索牌组",
      progress: "今日进度",
      actions: "操作",
      collapse: "折叠",
      expand: "展开",
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
      deleteDefault: '不能删除默认牌组（ID 1），或包含它的任何父牌组。', deleteChanged: '牌组内容或确认信息已更改，请重新预览。',
      deleteFailed: '预览或删除失败，请重新预览后再试。', deckDeleted: '牌组已删除，收藏已刷新。',
      browse: '浏览', add: '添加笔记', review: '复习', transfer: '导入导出', query: '搜索笔记',
      queryPlaceholder: '关键词、tag:… 或 is:suspended', search: '搜索', searchHint: '支持 Anki 搜索语法，搜索范围包含当前选中的牌组。',
      results: '搜索结果', noNotes: '没有找到笔记，请尝试其他搜索或添加笔记。', selectNote: '选择一条笔记，编辑字段、标签或暂停状态。',
      previous: '上一页', next: '下一页', editNote: '编辑笔记', noteId: '笔记 ID', model: '笔记类型', deck: '牌组', fields: '字段',
      tags: '标签', tagsPlaceholder: '使用空格分隔标签', fieldHint: '选中文字可设置格式，粘贴截图可插入图片，点 </> 可编辑 HTML 源码。',
      bold: '加粗 (Ctrl+B)',
      italic: '斜体 (Ctrl+I)',
      underline: '下划线 (Ctrl+U)',
      superscript: '上标',
      subscript: '下标',
      insertUnorderedList: '无序列表',
      insertOrderedList: '有序列表',
      removeFormat: '清除格式',
      htmlMode: 'HTML 源码',
      sourceRequired: '字段含有自定义 HTML，请在源码模式中编辑以保留原有标记。',
      imageInserted: '图片已存入牌库并插入。', imageFailed: '粘贴的图片保存失败。', imageTooLarge: '图片超过 5 MB。',
      clozeHint: '挖空示例：法国的首都是 {{c1::巴黎}}。', save: '保存更改', reloadNote: '重新加载笔记', saved: '笔记已保存。',
      added: '笔记已添加，可以继续添加下一条。', addHint: '选择牌组和笔记类型，然后填写字段。', chooseDeck: '请选择牌组',
      noModels: '收藏中暂无笔记类型。', suspended: '已暂停卡片', suspend: '暂停卡片', unsuspend: '恢复卡片',
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
      syncLoginFailed: '无法登录，请检查凭据、网络连接及安全凭据存储后重试。', syncFailed: '同步未能完成，请检查网络和账户后重试。',
      syncAuthError: '请重新登录后继续同步。', syncBusyError: '同步任务正在使用收藏，请等待完成或取消同步。', syncConfirmError: '全量同步确认已过期或发生变化，请重新选择。',
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

    const themes = [
      ['#174dcc','蓝色主题','Blue'], ['#126b54','松绿主题','Green'],
      ['#6942ad','紫色主题','Violet'], ['#a73d5c','玫红主题','Rose'],
      ['#925019','琥珀主题','Amber']
    ];
    const translate = { zh: key => zh[key], en: key => en[key] };
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
.dsh-anki-form{display:flex;flex-direction:column;gap:16px;min-width:0}.dsh-anki-edit-form{display:flex;flex-direction:column;flex:1;min-height:0;gap:0}.dsh-anki-editor-fields{display:flex;flex-direction:column;flex:1;min-height:0;gap:18px;overflow:auto;overscroll-behavior:contain;padding:0 2px 12px}.dsh-anki-editor-fields>.dsh-anki-caption{margin:0;font-size:11px}.dsh-anki-field{display:flex;flex-direction:column;gap:7px;min-width:0;flex:none}.dsh-anki-field>span{font-size:12px;font-weight:600}.dsh-anki-media-preview{display:flex;flex-wrap:wrap;gap:8px}.dsh-anki-media-thumb{max-height:120px;max-width:100%;border:1px solid var(--anki-border);border-radius:8px;object-fit:contain;background:#fff}.dsh-anki-media-chip{font-size:11px;color:var(--anki-faint);border:1px dashed var(--anki-border);border-radius:6px;padding:2px 7px}.dsh-anki-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.dsh-anki-editor-tags{display:flex;flex-wrap:wrap;gap:5px}.dsh-anki-editor-tags span{font-size:11px;padding:3px 8px;background:#f1f3f5;border-radius:6px;overflow-wrap:anywhere;max-width:100%}.dsh-anki-editor-footer{display:flex;flex:none;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--anki-border)}.dsh-anki-suspension-info{flex-basis:100%;font-size:11px;margin:0!important}.dsh-anki-editor-footer .dsh-anki-primary{margin-left:auto}
.dsh-anki-empty{text-align:center;padding:32px 16px;border:1px dashed var(--anki-border);border-radius:10px;color:var(--anki-muted);min-width:0}.dsh-anki-empty h2{color:var(--anki-ink);margin-top:12px}.dsh-anki-empty p{max-width:390px;margin:7px auto 18px}.dsh-anki-empty svg{opacity:.6}.dsh-anki-editor>.dsh-anki-empty{margin:auto 0}
.dsh-anki-notice{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid #d9eaea;border-radius:9px;margin:0 0 10px;background:#edf7f7;overflow-wrap:anywhere}.dsh-anki-notice[data-error=true]{color:#b54141;border-color:#ecd6d6;background:#fff7f7}.dsh-anki-notice button{font-size:11px;min-height:26px;padding:2px 7px;flex:none}.dsh-anki-main>.dsh-anki-delete{flex:0 1 auto;min-height:0;max-height:55%;overflow:auto;margin-bottom:10px!important;background:#fff}
.dsh-anki-review-head{margin-bottom:18px}.dsh-anki-review-meta{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px}.dsh-anki-frame-wrap{border:1px solid var(--anki-border);border-radius:10px;overflow:hidden}.dsh-anki-frame{display:block;border:0;width:100%;min-height:280px;height:clamp(280px,46vh,650px);background:#fff}.dsh-anki-review-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:18px}.dsh-anki-rating{min-width:80px;display:flex;flex-direction:column;align-items:center;gap:2px}.dsh-anki-rating strong{font-size:13px;font-weight:600}.dsh-anki-rating span{font-size:11px;color:var(--anki-muted)}.dsh-anki-review-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:18px}
.dsh-anki-transfer{display:flex;flex-direction:column;gap:20px}.dsh-anki-transfer-notice{padding:14px 16px;border-radius:10px;background:#f0f7f8;color:var(--anki-muted)}.dsh-anki-paths{margin:0;display:grid;gap:5px}.dsh-anki-paths dt{font-size:11px;color:var(--anki-faint)}.dsh-anki-paths dd{font-family:ui-monospace,monospace;font-size:12px;margin:0 0 8px;overflow-wrap:anywhere;user-select:text}.dsh-anki-transfer-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.dsh-anki-transfer-card{padding:18px;border:1px solid var(--anki-border);border-radius:10px;display:flex;flex-direction:column;gap:12px;min-width:0}.dsh-anki-transfer-card p{margin:0}.dsh-anki-code{font-family:ui-monospace,monospace;font-size:12px;overflow-wrap:anywhere;white-space:pre-wrap;user-select:text}
.dsh-anki-delete{min-width:0;overflow-wrap:anywhere}.dsh-anki-sync{display:flex;flex-direction:column;gap:18px}.dsh-anki-sync>.dsh-anki-caption{margin:0}.dsh-anki .dsh-anki-check{display:flex;align-items:flex-start;gap:9px;cursor:pointer;font-size:12px}.dsh-anki .dsh-anki-check input{width:16px;min-width:16px;height:16px;min-height:16px;margin:2px 0;padding:0;accent-color:var(--anki-teal)}.dsh-anki-sync-progress{display:flex;flex-wrap:wrap;gap:8px 16px;font-size:12px}.dsh-anki-sync-progress progress{width:100%;height:12px;accent-color:var(--anki-teal)}.dsh-anki-full-sync{padding:18px;border:1px solid #e4cccc;border-radius:10px;display:flex;flex-direction:column;gap:14px}.dsh-anki-full-sync p{margin:0}.dsh-anki-full-sync>div:last-of-type{display:flex;flex-direction:column;align-items:flex-start;gap:14px}.dsh-anki .dsh-anki-full-sync button[aria-pressed=true]{border-color:var(--anki-teal);background:var(--anki-selected)}
@container (max-width:1050px){.dsh-anki-layout{grid-template-columns:190px minmax(0,1fr)}.dsh-anki-head{margin-bottom:10px}.dsh-anki-head .dsh-anki-muted{display:none}.dsh-anki-stats{min-height:60px;padding:7px 0}.dsh-anki-browser{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,3fr) minmax(0,1.3fr);gap:8px}.dsh-anki-editor{display:block;padding:10px 12px}.dsh-anki-editor-head{margin-bottom:10px}.dsh-anki-edit-form{display:block}.dsh-anki-editor-fields{display:flex;overflow:visible;gap:14px;min-height:auto;padding-bottom:14px}.dsh-anki-note-context{margin-bottom:12px}.dsh-anki-editor-footer{padding-top:10px}.dsh-anki-transfer-grid{grid-template-columns:1fr}.dsh-anki-search-hint{display:none}.dsh-anki-tabs{gap:8px;margin-bottom:8px}}
@container (max-width:620px){.dsh-anki-overview{max-height:24%}.dsh-anki h1{font-size:21px;line-height:30px}.dsh-anki-head{align-items:center;gap:7px;margin-bottom:7px}.dsh-anki-head-actions{gap:5px;padding:0}.dsh-anki-head-actions button{min-height:32px;padding:5px 8px;font-size:11px}.dsh-anki-head-actions svg{width:14px;height:14px}.dsh-anki-stats{min-height:53px;padding:5px 0;margin-bottom:4px}.dsh-anki-stat strong{font-size:18px;line-height:23px;gap:4px}.dsh-anki-stat span{font-size:10px}.dsh-anki-dot{width:6px;height:6px}.dsh-anki-tabs{gap:0;margin-bottom:8px}.dsh-anki .dsh-anki-tab{min-height:37px;padding:8px 10px 6px;font-size:12px}.dsh-anki-layout{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);gap:8px}.dsh-anki-layout:has(.dsh-anki-aside-scroll[data-controls=true]){grid-template-rows:minmax(0,120px) minmax(0,1fr)}.dsh-anki-aside{padding:6px 8px}.dsh-anki-aside>.dsh-anki-section-head{margin:0;padding:0;min-height:28px}.dsh-anki-aside h2{font-size:13px;line-height:24px}.dsh-anki-rail-actions button{width:27px;min-height:26px;padding:4px}.dsh-anki-decks{flex:none;flex-direction:row;min-height:0;gap:4px;overflow-y:hidden;align-items:center}.dsh-anki .dsh-anki-deck{width:auto;max-width:230px;min-height:34px;padding:6px 10px;white-space:nowrap}.dsh-anki-deck-name{max-width:160px}.dsh-anki-aside-scroll[data-controls=true] .dsh-anki-decks{display:none}.dsh-anki-deck-controls{margin:0;border:0;padding:5px 2px}.dsh-anki-foot{margin-top:3px;padding:3px 0 0;min-height:22px}.dsh-anki-engine{flex-direction:row;gap:8px;font-size:10px}.dsh-anki-engine span:first-child{max-width:150px}.dsh-anki-foot button{min-height:22px;padding:1px 5px;font-size:10px}.dsh-anki-browser{grid-template-rows:minmax(0,3fr) minmax(48px,.95fr);gap:8px}.dsh-anki-results-head{padding:7px;gap:5px}.dsh-anki-results-head>.dsh-anki-caption{font-size:10px}.dsh-anki-search input{font-size:12px;padding-top:7px;padding-bottom:7px}.dsh-anki-search-box>svg{top:9px}.dsh-anki-search button{min-height:34px;padding:5px 7px;font-size:11px}.dsh-anki-pagination{padding:6px;gap:12px}.dsh-anki-pagination button{min-height:28px;padding:3px 7px;font-size:11px}.dsh-anki-note-context{grid-template-columns:1fr 1fr}.dsh-anki-editor h2{font-size:15px;line-height:24px}.dsh-anki-editor-head{gap:6px}.dsh-anki-editor-status{font-size:10px}.dsh-anki-form-grid{grid-template-columns:1fr}.dsh-anki-panel:not(.dsh-anki-panel-browse){padding:14px}.dsh-anki-rating{min-width:60px}.dsh-anki-review-actions{gap:6px}}
.dsh-anki-format{display:flex;gap:3px;flex-wrap:wrap}.dsh-anki-format button{min-height:28px;min-width:28px;padding:2px 6px;font-size:13px}.dsh-anki-format button[aria-pressed=true]{background:#d9eeee}.dsh-anki-rich{border:1px solid var(--anki-border);border-radius:9px;padding:9px 11px;min-height:140px;max-height:50vh;overflow:auto;overflow-wrap:anywhere;background:#fff;line-height:1.7}.dsh-anki-rich:focus{outline:2px solid var(--anki-teal)}.dsh-anki-rich img{max-width:100%;height:auto}
@media(max-width:700px){.dsh-anki{padding:10px}}
@media(max-height:650px){.dsh-anki{padding-top:10px;padding-bottom:10px}.dsh-anki-head{margin-bottom:8px}.dsh-anki-head .dsh-anki-muted{display:none}.dsh-anki h1{font-size:22px;line-height:30px}.dsh-anki-head-actions button{min-height:34px;padding:5px 10px}.dsh-anki-stats{min-height:54px;padding:5px 0}.dsh-anki-stat strong{font-size:19px;line-height:25px}.dsh-anki .dsh-anki-tab{min-height:38px;padding-top:7px;padding-bottom:6px}}
@media(prefers-reduced-motion:reduce){.dsh-anki button{transition:none}}
.dsh-anki{--accent:#164dcc;--paper:#fffefa;--surface:#fff;--anki-teal:var(--accent);--anki-ink:#172437;--anki-border:#c3cad5;--tint:color-mix(in srgb,var(--accent) 36%,var(--surface));--anki-selected:color-mix(in srgb,var(--accent) 10%,var(--surface));background:var(--paper);color:var(--anki-ink);padding:0;font:14px/1.48 system-ui,sans-serif}
.dsh-anki[data-mode=dark]{color-scheme:dark;--paper:#141a24;--surface:#202835;--anki-ink:#edf2fa;--anki-muted:#c1ccdc;--anki-faint:#aab7cb;--anki-border:#475263}
.dsh-anki-wrap{display:block;overflow:auto;padding:0 clamp(12px,2vw,32px) 28px}
.anki-top,.anki-tools,.anki-pages,.anki-row{display:flex;align-items:center;flex-wrap:wrap;gap:9px}.anki-top{position:sticky;top:0;z-index:4;background:var(--paper);border-bottom:2px solid var(--anki-ink);padding:10px 0;gap:16px}.anki-brand,.dsh-anki h1,.dsh-anki h2,.anki-metrics strong{font-family:Georgia,"Songti SC",serif}.anki-brand{font-size:24px;font-weight:700;white-space:nowrap}.anki-tools{margin-left:auto}.anki-tools button,.anki-pages button{min-height:32px}.anki-pages button{border:0;border-radius:0;background:transparent;font-weight:650}.anki-pages button[aria-current=page]{color:var(--accent);box-shadow:inset 0 -3px var(--accent)}
.anki-tools input[type=color]{width:32px;padding:3px;height:31px;cursor:pointer}.anki-pagehead{display:flex;align-items:center;justify-content:space-between;margin:16px 0}.anki-pagehead button{font-size:12px}.anki-dashboard{display:grid;gap:14px}.anki-metrics,.anki-box,.dsh-anki .dsh-anki-transfer-card{border:1px solid var(--anki-border);border-radius:7px;background:var(--surface);padding:16px;min-width:0}.anki-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.anki-metrics section{position:relative;padding:0 14px;border-right:1px solid var(--anki-border)}.anki-metrics section:last-child{border:0}.anki-metrics strong{font-size:clamp(23px,2.5vw,38px);display:block;color:var(--accent)}.anki-metrics button{margin:6px 0 0}.anki-meter{height:9px;border-radius:4px;background:var(--anki-selected);overflow:hidden}.anki-meter i,.anki-bars i{display:block;background:var(--accent);height:100%;transform-origin:left;animation:anki-fill .75s cubic-bezier(.2,.7,.2,1) both}.anki-week,.anki-months{display:flex;justify-content:space-between;gap:2px;color:var(--anki-muted);font-size:11px}.anki-week span[data-on=true]{background:var(--accent);color:white;border-radius:20px;padding:1px 4px}.anki-trend{width:100%;height:33px}.anki-trend polyline{fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:1;animation:anki-draw 1s ease both}.anki-charts,.anki-bottom{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:14px}.anki-bottom{grid-template-columns:minmax(0,1.8fr) minmax(0,1fr)}.anki-box h2{margin-bottom:12px}.anki-months{margin:12px 0 6px}.anki-heat{display:grid;grid-template-rows:repeat(7,1fr);grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:2px;margin-bottom:6px}.anki-heat i,.anki-heat-key i{aspect-ratio:1;min-width:0;min-height:6px;border-radius:2px;background:color-mix(in srgb,var(--accent) var(--level),var(--anki-selected))}.anki-bars{display:flex;gap:4px;align-items:end;height:139px;border-bottom:1px solid var(--anki-border)}.anki-bars>div{display:flex;flex:1;min-width:0;align-items:center;flex-direction:column;font-size:10px}.anki-bars i{width:80%;transform-origin:bottom;animation-name:anki-rise}.anki-bars small{font-size:9px}.anki-forecast{display:grid;grid-template-columns:48px 1fr 32px;align-items:center;gap:8px;margin:9px 0}.anki-forecast b{text-align:right}.anki-scroll{overflow:auto}.anki-grid{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}.anki-grid th,.anki-grid td{padding:8px;text-align:start;border-bottom:1px solid var(--anki-border);white-space:nowrap}.anki-grid th{font-size:12px;background:var(--anki-selected)}.anki-grid td .anki-meter{min-width:50px}.anki-grid button{min-height:29px;padding:3px 8px}.anki-row{margin:8px 0}.anki-row input,.anki-row select{width:auto;max-width:100%}.dsh-anki .dsh-anki-browser{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);grid-template-rows:auto;min-height:420px}.dsh-anki .dsh-anki-list{max-height:62vh}.anki-fieldpair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.anki-fieldpair .dsh-anki-rich{min-height:180px}.dsh-anki .dsh-anki-primary,.dsh-anki .dsh-anki-primary:not(:disabled):hover{background:var(--accent);color:var(--on-accent,#fff)}.dsh-anki :is(input,select,textarea,button,.dsh-anki-editor,.dsh-anki-results,.dsh-anki-pagination,.dsh-anki-format,.dsh-anki-rich,.dsh-anki-editor-footer,.dsh-anki-note-context,.dsh-anki-search-box,select option){background-color:var(--surface);color:var(--anki-ink);border-color:var(--anki-border);border-radius:6px}.dsh-anki button:not(:disabled):hover{background:var(--anki-selected);border-color:var(--accent)}.dsh-anki[data-mode=dark] :is(.dsh-anki-notice,.dsh-anki-full-sync,.dsh-anki-badge,.dsh-anki-editor-status,.dsh-anki-note-meta span){background:var(--surface);color:var(--anki-ink)}.anki-dashboard small{color:var(--anki-muted)}
.anki-sync-summary{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:var(--anki-selected);padding:18px;border-radius:6px}.anki-row .dsh-anki-search{flex:1 1 250px}.anki-row .dsh-anki-search input{width:100%}.anki-pagehead time{font-size:13px;color:var(--anki-muted);border-inline-start:1px solid var(--anki-border);padding-inline-start:12px}.anki-grid .anki-name{background:transparent;border-color:transparent}.anki-grid td:last-child button+button{margin-inline-start:4px}.anki-fieldpair .dsh-anki-format{background:var(--anki-selected)}.anki-fieldpair .dsh-anki-field{border:1px solid var(--anki-border);padding:10px;border-radius:6px;background:var(--surface)}.anki-box small{font-variant-numeric:tabular-nums}.dsh-anki .dsh-anki-form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))}.dsh-anki .dsh-anki-actions:has(button[type=submit]){justify-content:flex-end}
.dsh-anki button.dsh-anki-primary{background-color:var(--accent);color:var(--on-accent);border-color:var(--accent)}.dsh-anki .anki-pages button{background:transparent;border-radius:0}.dsh-anki-results-head>select{width:auto}.dsh-anki .dsh-anki-results-head{justify-content:space-between}.anki-metrics .anki-meter{margin:4px 0}.anki-bars{background:repeating-linear-gradient(to top,transparent 0 27px,var(--anki-selected) 28px 29px)}.anki-heat i{border-radius:2px}.anki-months{display:grid;grid-template-columns:repeat(53,minmax(0,1fr));gap:2px}.anki-months span{white-space:nowrap}.anki-heat-key{display:flex;align-items:center;gap:3px}.anki-heat-key small{margin-right:auto}.anki-heat-key i{width:10px;height:10px}.anki-scroll{max-height:60vh}.anki-grid th{position:sticky;top:0;z-index:1;background:var(--surface)}.anki-scroll .anki-grid th{box-shadow:inset 0 -1px var(--anki-border)}
@keyframes anki-fill{from{transform:scaleX(0)}}@keyframes anki-rise{from{transform:scaleY(0)}}@keyframes anki-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@media(prefers-reduced-motion:reduce){.dsh-anki *{animation:none!important;transition:none!important}}
@container(max-width:780px){.anki-charts,.anki-bottom,.anki-fieldpair,.dsh-anki .dsh-anki-browser{grid-template-columns:minmax(0,1fr)}.anki-metrics{grid-template-columns:1fr 1fr;gap:12px}.anki-top{position:static;gap:6px}.anki-tools{margin-left:0}.anki-brand{font-size:20px}}
.dsh-anki .dsh-anki-wrap{display:flex;flex-direction:column;min-height:0;height:100%;overflow:hidden;padding-bottom:8px}
.anki-top,.anki-pagehead{flex:none}
.anki-top{position:static;padding-block:6px}
.anki-pagehead{margin:8px 0;gap:8px;flex-wrap:wrap}
.anki-heading-tools,.anki-box-head{display:flex;align-items:center;gap:8px}
.anki-heading-tools input[type=search],.anki-box-head input[type=search]{width:clamp(90px,15vw,200px);min-height:28px;padding:4px 9px}
.anki-heading-tools button{white-space:nowrap}
.dsh-anki-wrap>main{flex:1 1 0;min-height:0;min-width:0;overflow:auto;container:anki-content / size}
.anki-tools{gap:9px}
.dsh-anki .anki-tools button,.dsh-anki .anki-tools select{height:28px;min-height:28px;font-size:12px;line-height:1;padding:0 10px;border-radius:5px;font-weight:600}
.dsh-anki .anki-tools>.dsh-anki-primary{padding-inline:14px}
.anki-theme{display:inline-flex;align-items:center;position:relative}
.anki-theme i{position:absolute;left:8px;width:10px;height:10px;border-radius:2px;background:var(--accent);pointer-events:none}
.dsh-anki .anki-theme select{padding-inline:23px 6px;width:auto;cursor:pointer}
.anki-segment{display:inline-flex;align-items:center;border:1px solid var(--anki-border);border-radius:5px;overflow:hidden}
.dsh-anki .anki-segment button{min-width:28px;height:26px;min-height:26px;border:0;border-radius:0;padding:0 7px}
.dsh-anki .anki-segment button+button{border-left:1px solid var(--anki-border)}
.dsh-anki .anki-segment button[aria-pressed=true]{background:var(--anki-selected);color:var(--accent)}
.dsh-anki .anki-segment:last-child button[aria-pressed=true]{background:var(--accent);color:white}
.anki-tools .anki-segment:focus-within{outline:2px solid var(--accent)}
.anki-box-head{justify-content:space-between;min-height:28px;margin-bottom:7px;flex:none}
.anki-box-head h2{margin:0}
.anki-chart-key{display:flex;align-items:center;gap:5px;font-size:12px}
.anki-chart-key i{width:9px;height:9px;border-radius:2px;background:var(--tint)}
.anki-chart-key i:last-of-type{background:var(--accent)}
.dsh-anki .anki-grid .anki-pencil{border:0;min-height:24px;padding:3px;color:var(--anki-muted);background:transparent}
.dsh-anki .anki-grid .anki-pencil:hover{color:var(--accent)}
.anki-inline-edit{display:inline-flex;align-items:center;gap:3px}
.anki-inline-edit input{width:clamp(100px,14vw,220px);padding:4px 6px}
.anki-box{min-height:0}
.anki-grid td{padding-block:5px}
.anki-grid td:has(>.anki-meter){position:relative;padding-right:42px}
.anki-grid td:has(>.anki-meter) .anki-meter{display:inline-block;vertical-align:middle;width:50%;min-width:38px;margin-left:5px}
@container anki-content (min-width:781px) and (min-height:360px){
  .anki-dashboard{height:100%;grid-template-rows:auto minmax(0,1fr) minmax(0,1fr);gap:clamp(5px,1.4cqh,14px)}
  .anki-metrics,.anki-box{padding:clamp(6px,1.6cqh,16px)}
  .anki-box{display:flex;flex-direction:column}
  .anki-metrics section:first-child button{position:absolute;top:0;right:10px;min-height:26px;padding:3px 8px;font-size:12px}
  .anki-heat{flex:1;min-height:0;margin:2px 0;grid-template-rows:repeat(7,minmax(0,1fr))}
  .anki-heat i{height:100%;width:100%;max-height:18px;aspect-ratio:auto;min-height:0}
  .anki-months{margin:2px 0}
  .anki-bars{flex:1;min-height:0;height:auto}
  .anki-bars>div{height:100%;justify-content:flex-end}
  .anki-bars i{max-height:calc(100% - 28px);height:calc((100% - 28px)*var(--ratio))!important}
  .anki-forecast{flex:1;min-height:0;margin:0}
  .anki-scroll{min-height:0;max-height:none}
}
@container anki-content (max-width:780px){
 .anki-box-head{flex-wrap:wrap}.anki-heading-tools{flex-wrap:wrap}
}
.anki-detail{display:none}
main[data-page=decks],main[data-page=browse]{display:flex;flex-direction:column}
main[data-page=decks]>.anki-scroll{flex:1;min-height:0;max-height:none}
@container anki-content (min-width:781px){
  main[data-page=browse] .dsh-anki-browser{min-height:0;grid-template-rows:minmax(0,1fr)}
  main[data-page=browse] .dsh-anki-editor{display:flex}
  main[data-page=browse] .dsh-anki-edit-form{display:flex}
  main[data-page=browse] .dsh-anki-list{max-height:none}
}
@container anki-content (max-width:780px) or (max-height:359px){
  .anki-dashboard{height:100%;grid-template-rows:auto auto minmax(0,1fr);gap:6px}
  .anki-detail{display:block}
  .anki-dashboard .anki-charts,.anki-dashboard .anki-bottom{display:contents}
  .anki-dashboard .anki-box{display:none;min-height:0;overflow:auto}
  .anki-dashboard[data-detail=heatmap] [data-box=heatmap],.anki-dashboard[data-detail=dailyReviews] [data-box=dailyReviews],.anki-dashboard[data-detail=decks] [data-box=decks],.anki-dashboard[data-detail=forecast] [data-box=forecast]{display:block}
  .anki-metrics{padding:6px;gap:4px}.anki-metrics section{padding:2px 6px}.anki-metrics strong{font-size:20px}.anki-metrics section:first-child button{min-height:22px;font-size:11px;padding:1px 5px}.anki-metrics .anki-trend{height:18px}.anki-dashboard .anki-box{padding:8px}
}
@container anki-content (min-width:781px) and (min-height:360px){.anki-dashboard{height:calc(100% - 2px)}}

.anki-choice{position:relative;min-width:0}
.dsh-anki .anki-choice-trigger{width:100%;min-width:90px;justify-content:space-between;gap:12px;text-align:start}
.anki-choice-trigger[aria-expanded=true]{box-shadow:0 0 0 2px var(--anki-selected);border-color:var(--accent)}
.anki-choice-list{position:fixed;inset:auto;margin:0;padding:4px;max-width:calc(100vw - 16px);overflow:auto;overscroll-behavior:contain;border:1px solid var(--anki-border);border-radius:8px;background:var(--surface);color:var(--anki-ink);box-shadow:0 6px 22px #10253a25;z-index:10}
.dsh-anki .anki-choice-list button{display:flex;width:100%;justify-content:space-between;text-align:start;border:0;padding:7px 10px;border-radius:4px;white-space:normal;overflow-wrap:anywhere;min-height:30px;background:transparent}
.dsh-anki .anki-choice-list button[aria-selected=true]{font-weight:650;background:var(--anki-selected)}
.anki-choice-list button[aria-selected=true]::after{content:'✓';color:var(--accent)}
.dsh-anki .anki-choice-list button:focus{background:var(--anki-selected);outline:1px solid var(--accent);outline-offset:-1px}
.anki-theme>i{z-index:1}.dsh-anki .anki-theme .anki-choice-trigger{padding-inline:24px 8px}
.anki-scope-label{display:flex;align-items:center;gap:8px}.anki-heading-tools .anki-row{margin:0}
.anki-review-session{display:flex;flex-direction:column;height:100%;min-height:0;gap:10px;padding:1px}
.anki-review-summary{flex:none;padding:4px 0 6px}.anki-review-summary>div:first-child{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;font-variant-numeric:tabular-nums}
.anki-review-session .dsh-anki-frame-wrap{flex:1;min-height:100px;background:var(--surface)}
.anki-review-session .dsh-anki-frame{height:100%;min-height:0}
.anki-review-session .dsh-anki-review-actions{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:clamp(6px,1.1vw,18px);margin:0}
.dsh-anki .anki-review-session .dsh-anki-rating{min-width:0;min-height:clamp(54px,8vh,82px);padding:8px 4px;border:1px solid color-mix(in srgb,var(--rating) 55%,var(--surface));background:color-mix(in srgb,var(--rating) 12%,var(--surface));color:var(--rating);gap:3px}
.dsh-anki .anki-review-session .dsh-anki-rating:hover{background:color-mix(in srgb,var(--rating) 23%,var(--surface))}
.dsh-anki-rating[data-rating="1"]{--rating:#ac303b}.dsh-anki-rating[data-rating="2"]{--rating:#915310}.dsh-anki-rating[data-rating="3"]{--rating:#166748}.dsh-anki-rating[data-rating="4"]{--rating:#285bb0}
.dsh-anki[data-mode=dark] [data-rating="1"]{--rating:#ff9fa3}.dsh-anki[data-mode=dark] [data-rating="2"]{--rating:#f2c174}.dsh-anki[data-mode=dark] [data-rating="3"]{--rating:#82d6ae}.dsh-anki[data-mode=dark] [data-rating="4"]{--rating:#9cc4ff}
.dsh-anki .dsh-anki-rating span{color:inherit}.dsh-anki-rating strong{font-size:clamp(14px,1.3vw,20px)}
.dsh-anki .anki-modal{margin:auto;width:min(440px,calc(100vw - 32px));max-height:85vh;overflow:auto;padding:22px;border:1px solid var(--anki-border);border-radius:10px;background:var(--surface);color:var(--anki-ink);box-shadow:0 16px 60px #101d3440}
.anki-modal::backdrop{background:#101a304d}
.anki-modal h2{margin:0 0 14px}.anki-modal .dsh-anki-paths{margin-block:12px}
.anki-modal-actions{display:flex;justify-content:flex-end;gap:8px}.anki-modal>.dsh-anki-form+button{margin-top:8px}
.anki-toast{position:fixed;z-index:30;bottom:20px;left:50%;transform:translateX(-50%);max-width:min(88vw,560px);padding:9px 16px;border-radius:8px;background:var(--anki-ink);color:var(--surface);box-shadow:0 4px 18px #0002;pointer-events:none;animation:anki-toast-out .25s ease 2s both}
.anki-toast[data-error=true]{background:#992f39;color:white}@keyframes anki-toast-out{from{opacity:1}to{opacity:0}}
.dsh-anki .dsh-anki-format,.anki-fieldpair .dsh-anki-format{background:transparent}
.dsh-anki :is(input,textarea,[contenteditable=true],.anki-choice-trigger):focus,.dsh-anki .anki-choice-list button:focus{outline:none;box-shadow:none;border-color:var(--anki-border)}
.dsh-anki .anki-choice-trigger[aria-expanded=true]{box-shadow:none;border-color:var(--anki-border)}
.dsh-anki .anki-choice-list button:focus{background:var(--anki-selected)}
.anki-box .anki-heat{flex:none;grid-template-rows:repeat(7,auto);align-content:start}
.anki-box .anki-heat i{width:100%;height:auto;aspect-ratio:1;min-height:0;max-height:none}
@container anki-content (min-width:781px) and (min-height:360px){
  [data-box=heatmap]{container-type:size}
  [data-box=heatmap] :is(.anki-months,.anki-heat){width:min(100%,max(15%,calc((100cqh - 56px)*7.57)))}
}
.anki-sync-strip{margin-top:auto;padding-top:8px;border-top:1px solid var(--anki-border);display:flex;align-items:center;justify-content:space-between;gap:6px;flex-wrap:wrap}
.anki-sync-strip strong,.anki-sync-strip span{display:block}.anki-sync-strip span{font-size:12px}
.anki-sync-strip button{font-size:12px;min-height:28px;padding:4px 9px}
.dsh-anki .anki-modal:has(.dsh-anki-sync){width:min(650px,calc(100vw - 32px))}
@container anki-content (min-width:781px) and (min-height:360px){
  [data-box=heatmap]{overflow:auto}
  [data-box=heatmap] :is(.anki-months,.anki-heat){width:min(100%,max(30%,calc((100cqh - 106px)*7.57)))}
}
@container anki-content (max-width:780px){.anki-sync-strip{margin-top:12px}.anki-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;

    function Glyph({ name, size = 17 }) {
      const paths = {
        sync: 'M20 7v5h-5M4 17v-5h5M5.7 7a7 7 0 0 1 11.6-2L20 8M4 16l2.7 3A7 7 0 0 0 18.3 17',
        play: 'M8 5l11 7-11 7z', search: 'M21 21l-5-5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
        sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5', moon: 'M20.8 14.2A8.8 8.8 0 0 1 9.8 3.3 9 9 0 1 0 20.8 14.2z', trash: 'M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7', pencil: 'M4 16l-1 5 5-1L20 8l-4-4zM14 6l4 4', plus: 'M12 5v14M5 12h14', menu: 'M12 5v.01M12 12v.01M12 19v.01',
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

    /* Parse card templates inertly and render them in an opaque-origin iframe.
     * The field editor below has its own, narrower formatting allowlist. */
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
    function Modal({ children, label, close, className = '' }) {
      const ref = React.useRef(null);
      React.useLayoutEffect(() => {
        const dialog = ref.current;
        dialog.showModal();
        return () => dialog.close();
      }, []);
      return h('dialog', {ref, className:'anki-modal '+className, 'aria-label':label,
        onCancel:e=>{e.preventDefault();close();}}, children);
    }
    function Toast({ message, error, dismiss }) {
      const callback = React.useRef(dismiss);
      callback.current = dismiss;
      React.useEffect(() => {
        const timer = setTimeout(()=>callback.current(),2250);
        return ()=>clearTimeout(timer);
      }, [message]);
      return h('div',{className:'anki-toast',role:error?'alert':'status','data-error':!!error},message);
    }
    function Choice({ value, onChange, disabled, children, className = '', 'aria-label': label }) {
      const options = React.Children.toArray(children);
      const selected = options.find(item => String(item.props.value) === String(value));
      const trigger = React.useRef(null);
      const menu = React.useRef(null);
      const id = React.useId();
      const [open,setOpen] = React.useState(false);
      React.useLayoutEffect(() => {
        if (!open || disabled) return;
        const list = menu.current;
        const doc = list.ownerDocument;
        const win = doc.defaultView;
        list.showPopover?.();
        const position = () => {
          const rect = trigger.current.getBoundingClientRect();
          const below = win.innerHeight - rect.bottom - 8;
          const above = rect.top - 8;
          const flip = below < list.scrollHeight && above > below;
          Object.assign(list.style, {
            minWidth: Math.min(rect.width,win.innerWidth-16)+'px',
            maxHeight: Math.min(300,Math.max(45,flip?above:below))+'px'
          });
          list.style.left = Math.max(8,Math.min(rect.left,win.innerWidth-list.offsetWidth-8))+'px';
          list.style.top = (flip ? rect.top-list.offsetHeight-4 : rect.bottom+4)+'px';
        };
        const outside = e => {
          if (!list.contains(e.target) && !trigger.current.contains(e.target)) setOpen(false);
        };
        position();
        (list.querySelector('[aria-selected=true]') || list.firstElementChild)?.focus({preventScroll:true});
        doc.addEventListener('pointerdown',outside,true);
        doc.addEventListener('focusin',outside,true);
        win.addEventListener('resize',position);
        doc.addEventListener('scroll',position,true);
        return () => {
          doc.removeEventListener('pointerdown',outside,true);
          doc.removeEventListener('focusin',outside,true);
          win.removeEventListener('resize',position);
          doc.removeEventListener('scroll',position,true);
        };
      },[open,disabled]);
      function close() { setOpen(false); trigger.current.focus(); }
      function navigate(e) {
        const items = Array.from(menu.current.children);
        const i = items.indexOf(e.target);
        if(e.key==='Escape') { e.preventDefault(); close(); return; }
        if(e.key==='Tab') { close(); return; }
        const target = {Home:0, End:items.length-1, ArrowUp:(i+items.length-1)%items.length, ArrowDown:(i+1)%items.length}[e.key];
        if(target!==undefined){e.preventDefault();items[target]?.focus();}
      }
      return h('span',{className:'anki-choice '+className},
        h('button',{ref:trigger,type:'button',disabled,className:'anki-choice-trigger','aria-label':label,'aria-haspopup':'listbox','aria-expanded':open&&!disabled,'aria-controls':open?id:undefined,
          onClick:()=>setOpen(!open),onKeyDown:e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);}}},
          selected?.props.children || '—',h('span',{'aria-hidden':true},'▾')),
        open && !disabled && h('span',{ref:menu,id,role:'listbox',popover:'manual',className:'anki-choice-list','aria-label':label,onKeyDown:navigate},
          options.map(item=>h('button',{key:item.props.value,type:'button',role:'option',tabIndex:-1,
            'aria-selected':item===selected,onClick:()=>{onChange({target:{value:String(item.props.value)}});close();}},item.props.children))));
    }

    function Field({ label, children, hint }) {
      return h(children?.type === Choice ? 'div' : 'label', { className: 'dsh-anki-field' }, h('span', null, label), children, hint && h('small', { className: 'dsh-anki-caption' }, hint));
    }
    function Empty({ title, description, children, check }) {
      return h('div', { className: 'dsh-anki-empty' }, h(Icon, { size: 34, check }), h('h2', null, title), description && h('p', null, description), children);
    }
    function toBase64(bytes) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let out = '';
      for (let index = 0; index < bytes.length; index += 3) {
        const a = bytes[index], b = index + 1 < bytes.length ? bytes[index + 1] : 0, c = index + 2 < bytes.length ? bytes[index + 2] : 0;
        out += alphabet[a >> 2] + alphabet[((a & 3) << 4) | (b >> 4)]
          + (index + 1 < bytes.length ? alphabet[((b & 15) << 2) | (c >> 6)] : '=')
          + (index + 2 < bytes.length ? alphabet[c & 63] : '=');
      }
      return out;
    }
    function mediaFilenames(html) {
      const names = [];
      const pattern = /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
      let match;
      while ((match = pattern.exec(html || '')) !== null && names.length < 12) {
        const src = (match[1] || match[2] || '').trim();
        if (!src || src.length > 200 || /^[a-z][a-z0-9+.-]*:/i.test(src) || /[\\/]/.test(src)) continue;
        if (!names.includes(src)) names.push(src);
      }
      return names;
    }
    function MediaPreview({ html, api }) {
      const names = mediaFilenames(html);
      const cache = React.useRef({});
      const [, bump] = React.useState(0);
      React.useEffect(() => {
        let cancelled = false;
        for (const name of names) {
          if (Object.hasOwn(cache.current, name)) continue;
          cache.current[name] = null;
          api('media.get', { filename: name }).then((file) => {
            if (cancelled) return;
            cache.current[name] = file && file.mime && file.data ? 'data:' + file.mime + ';base64,' + file.data : '';
            bump((value) => value + 1);
          }, () => { if (!cancelled) { cache.current[name] = ''; bump((value) => value + 1); } });
        }
        return () => { cancelled = true; };
      }, [names.join('\n')]);
      if (!names.length) return null;
      return h('div', { className: 'dsh-anki-media-preview', 'aria-label': 'media preview' }, names.map((name) => {
        const source = cache.current[name];
        if (source === undefined || source === null) return h('span', { key: name, className: 'dsh-anki-media-chip', 'data-media': name }, name);
        if (source === '') return null;
        return h('img', { key: name, className: 'dsh-anki-media-thumb', src: source, alt: name, 'data-media': name, loading: 'lazy' });
      }));
    }
    const richTags = new Set('div p span br b i strong em u s strike del ins sub sup small big blockquote pre code hr h1 h2 h3 h4 h5 h6 ul ol li table caption thead tbody tfoot tr td th ruby rt rp img'.split(' '));
    const richStyles = new Set('font-weight font-style text-decoration text-decoration-line color background-color vertical-align text-align'.split(' '));
    function richMarkup(html) {
      const { doc, root } = inertContent(html);
      const box = doc.createElement('div');
      if (root.querySelectorAll('*').length > 5000) return { html: '', complete: false };
      let complete = true;
      function copy(parent, input) {
        if (input.nodeType === 3) { parent.append(input.textContent); return; }
        const tag = input.localName;
        if (!richTags.has(tag) || input.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
          complete = false;
          if (tag && !['script', 'style', 'template', 'iframe', 'object', 'svg', 'math'].includes(tag)) {
            for (const child of input.childNodes) copy(parent, child);
          }
          return;
        }
        const el = doc.createElement(tag);
        for (const { name, value } of input.attributes) {
          if (name === 'style') {
            for (const prop of input.style) {
              const setting = input.style.getPropertyValue(prop);
              if (richStyles.has(prop) && !/[()\\]/.test(setting.replace(/rgba?\([\d.,%\s]+\)/gi, ''))) el.style.setProperty(prop, setting, input.style.getPropertyPriority(prop));
              else complete = false;
            }
          } else if (tag === 'img' && name === 'src' && value && value.length <= 255 && !/[/\\:?#\x00-\x1f]/.test(value)) {
            el.dataset.ankiImage = value;
          } else if (['alt', 'title', 'dir', 'lang', 'colspan', 'rowspan', 'start', 'width', 'height'].includes(name)) {
            el.setAttribute(name, value);
          } else complete = false;
        }
        parent.append(el);
        for (const child of input.childNodes) copy(el, child);
      }
      for (const child of root.childNodes) copy(box, child);
      return { html: box.innerHTML, complete };
    }
    function formatLabel(t, action) {
      const label = t(action);
      return /Mac/.test(globalThis.navigator?.platform || '') ? label.replace('Ctrl+', '⌘') : label;
    }
    function RichField({ name, value, setValues, disabled, api, notify, perform, t }) {
      const [source, setSource] = React.useState(false);
      const editor = React.useRef(null);
      const lastValue = React.useRef(null);
      function update(html) {
        lastValue.current = html;
        setValues((fields) => ({ ...fields, [name]: html }));
      }
      function loadImages(target) {
        for (const image of Array.from(target.querySelectorAll('img[data-anki-image]')).slice(0, 12)) {
          if (image.hasAttribute('src') || image.dataset.loading) continue;
          image.dataset.loading = '1';
          api('media.get', { filename: image.dataset.ankiImage }).then((file) => {
            if (image.isConnected && /^image\/(png|jpeg|gif|webp|avif|bmp)$/i.test(file?.mime))
              image.src = 'data:' + file.mime + ';base64,' + file.data;
          }).catch(() => {});
        }
      }
      React.useEffect(() => {
        const target = editor.current;
        if (!target || value === lastValue.current) return;
        const clean = richMarkup(value);
        if (!clean.complete) { setSource(true); return; }
        target.innerHTML = clean.html;
        lastValue.current = value;
        loadImages(target);
      }, [source, value]);
      function fieldHTML(contents) {
        // Rewrite preview URLs in an inert document so filenames never trigger host requests.
        const { doc } = inertContent('');
        const copy = doc.importNode(contents, true);
        for (const image of copy.querySelectorAll('img[data-anki-image]')) {
          image.setAttribute('src', image.dataset.ankiImage);
          image.removeAttribute('data-anki-image');
          image.removeAttribute('data-loading');
        }
        if (copy.nodeType === 1) return copy.innerHTML;
        const wrapper = doc.createElement('div');
        wrapper.append(copy);
        return wrapper.innerHTML;
      }
      function commit(target) {
        update(fieldHTML(target));
      }
      function copySelection(event) {
        const target = event.currentTarget;
        const selection = target.ownerDocument.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        if (!target.contains(range.commonAncestorContainer)) return;
        const fragment = range.cloneContents();
        if (!fragment.querySelector('img[data-anki-image]')) return;
        event.preventDefault();
        event.clipboardData.setData('text/html', fieldHTML(fragment));
        event.clipboardData.setData('text/plain', selection.toString());
        if (event.type === 'cut') command('delete');
      }
      function command(action, argument) {
        const target = editor.current;
        if (!target || disabled) return;
        target.focus();
        target.ownerDocument.execCommand(action, false, argument);
        commit(target);
        loadImages(target);
      }
      function paste(event) {
        const target = event.currentTarget;
        const clipboard = event.clipboardData;
        const image = Array.from(clipboard.items || []).find((item) => item.kind === 'file' && item.type.startsWith('image/'))?.getAsFile();
        if (image) {
          event.preventDefault();
          if (image.size > 5 * 1024 * 1024) { notify('imageTooLarge'); return; }
          const selection = target.ownerDocument.getSelection();
          const range = !source && selection.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
          const start = target.selectionStart, end = target.selectionEnd;
          perform(async () => {
            try {
              const { filename } = await api('media.add', { data: toBase64(new Uint8Array(await image.arrayBuffer())) });
              if (!target.isConnected) return;
              const img = target.ownerDocument.createElement('img');
              if (source) {
                img.setAttribute('src', filename);
                target.setRangeText(img.outerHTML, start, end, 'end');
                update(target.value);
              } else if (range && target.contains(range.commonAncestorContainer)) {
                img.dataset.ankiImage = filename;
                range.deleteContents(); range.insertNode(img); range.setStartAfter(img); range.collapse(true);
                selection.removeAllRanges(); selection.addRange(range);
                commit(target); loadImages(target);
              } else return;
              notify('imageInserted');
            } catch { notify('imageFailed'); }
          });
        } else if (!source) {
          event.preventDefault();
          const html = clipboard.getData('text/html');
          const clean = html && richMarkup(html).html;
          if (clean) command('insertHTML', clean);
          else if (clipboard.getData('text/plain')) command('insertText', clipboard.getData('text/plain'));
        }
      }
      const buttons = [['bold', 'B'], ['italic', 'I'], ['underline', 'U'], ['superscript', 'x²'], ['subscript', 'x₂'], ['insertUnorderedList', '•'], ['insertOrderedList', '1.'], ['removeFormat', 'Tx']];
      return h('div', { className: 'dsh-anki-field' }, h('span', null, name),
        h('div', { className: 'dsh-anki-format', role: 'group', 'aria-label': name },
          !source && buttons.map(([action, symbol]) => h('button', { key: action, type: 'button', tabIndex:-1, title: formatLabel(t, action), 'aria-label': formatLabel(t, action), disabled,
            onMouseDown: (e) => e.preventDefault(), onClick: () => command(action) }, symbol)),
          h('button', { type: 'button', tabIndex:-1, title: t('htmlMode'), 'aria-label': t('htmlMode'), 'aria-pressed': source, disabled,
            onClick: () => { if (source && !richMarkup(value).complete) { notify('sourceRequired'); return; } lastValue.current = null; setSource(!source); } }, '</>')),
        source ? h('textarea', { value, disabled, 'aria-label': name, spellCheck: false, onPaste: paste, onChange: (e) => update(e.target.value) }) :
          h('div', { ref: editor, className: 'dsh-anki-rich', contentEditable: !disabled, role: 'textbox', 'aria-multiline': true, 'aria-disabled': disabled, 'aria-label': name,
            onDrop: (e) => e.preventDefault(), onCopy: copySelection, onCut: copySelection, onPaste: paste, onInput: (e) => commit(e.currentTarget) }),
        source && h(MediaPreview, { html: value, api }));
    }
    function Fields({ names, values, ...props }) {
      return names.map((name) => h(RichField, { key: name, name, value: values[name] || '', ...props }));
    }
    function syncErrorText(t, code, login = false) {
      const known = {
        AUTH_FAILED: 'syncAuthError', AUTHENTICATION_FAILED: 'syncAuthError', NOT_LOGGED_IN: 'syncAuthError',
        SYNC_BUSY: 'syncBusyError', STALE_CONFIRMATION: 'syncConfirmError', INVALID_CONFIRMATION: 'syncConfirmError',
        FULL_SYNC_CONFIRMATION_REQUIRED: 'syncConfirmError'
      };
      return t(known[String(code || '').replace(/^anki\//, '')] || (login ? 'syncLoginFailed' : 'syncFailed'));
    }

    function SyncPanel({ t, api, account, visible, onStatus, onSettled, quickSync, open, close }) {
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
      async function act(operation, login = false, onFailure) {
        if (actionLock.current) return;
        actionLock.current = true; generation.current++;
        setPending(true); setError('');
        try { publish(await operation()); }
        catch (failure) { if (alive.current) { setError(syncErrorText(t, failure?.code, login)); onFailure?.(); } }
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
      React.useEffect(() => {
        quickSync.current = () => {
          if (!locked && snapshot?.loggedIn && !full) act(() => api('sync.run', {}),false,open);
        };
        return () => { quickSync.current = null; };
      }, [api, locked, snapshot, full, open]);
      if (!visible) return null;
      return h(Modal,{label:t('syncTitle'),close:()=>{setPassword('');close();}},
        h('header',{className:'anki-box-head'},h('h2',null,t('syncTitle')),action('×',()=>{setPassword('');close();},false,{'aria-label':t('dismiss')})),
        h('section', { className: 'dsh-anki-sync' },
        h('div',{className:'anki-sync-summary'},h('strong',null,snapshot?.loggedIn ? 'AnkiWeb · '+snapshot.account : t('syncSignedOut')),
          h('b',null,t(phases[snapshot?.phase] || 'syncIdle'))),
        error && h(Toast,{message:error,error:true,dismiss:()=>setError('')}),
        pollError && h('div',{role:'alert',className:'dsh-anki-notice','data-error':true},pollError),
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
                h('button', { type: 'submit', className: 'dsh-anki-primary', disabled: locked || !snapshot || !username.trim() || !password }, t('syncLogin'))),
            h('label', { className: 'dsh-anki-check' }, h('input', { type: 'checkbox', checked: snapshot?.settings?.autoSync !== false, disabled: locked || !snapshot || !!full, onChange: (event) => { const autoSync = event.target.checked; act(() => account('settings', { autoSync })); } }), t('syncAuto'))),
          h('section', { className: 'dsh-anki-transfer-card' }, h('h3', null, t('syncProgress')),
            h('p', { role: 'status', 'aria-live': 'polite' }, t(phases[snapshot?.phase] || 'syncIdle')),
            progress && h('div', { className: 'dsh-anki-sync-progress' },
              number(progress.total) && progress.total > 0 && number(progress.transferred) && h('progress', { max: progress.total, value: Math.min(progress.total, progress.transferred), 'aria-label': t('syncProgress') }),
              ...['transferred', 'checked', 'added', 'removed'].filter((name) => name === 'transferred' ? number(progress[name]) : !!countText(progress[name])).map((name) => h('span', { key: name }, t({ transferred: 'syncTransferred', checked: 'syncChecked', added: 'syncAdded', removed: 'syncRemoved' }[name]) + ': ' + countText(progress[name])))),
            h('p', { className: 'dsh-anki-caption' }, t('syncLast') + ': ' + (number(snapshot?.lastSyncAt) && snapshot.lastSyncAt ? new Date(snapshot.lastSyncAt).toLocaleString() : t('syncNever'))),
            h('div', { className: 'dsh-anki-actions' },
              action(t('syncNow'), () => act(() => api('sync.run', {})), locked || !snapshot?.loggedIn || !!full, { className: 'dsh-anki-primary' }),
              action(t('syncCancel'), () => act(() => api('sync.cancel', {})), pending || !active)),
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
          action(t('syncDismissFull'), () => { setSelection({ token: null, direction: '', consent: false }); act(() => account('dismissFull', {})); }, locked))));
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

    function Meter({ value, label }) {
      return h('div', {className:'anki-meter', role:'meter', 'aria-label':label, 'aria-valuemin':0, 'aria-valuemax':100, 'aria-valuenow':value},
        h('i', {style:{width:value+'%'}}));
    }
    function Dashboard({ activity, remaining, deckTable, searchDeck, start, t, language, syncStrip }) {
      const [detail,setDetail] = React.useState('heatmap');
      const date = new Date((activity?.today || new Date().toISOString().slice(0,10))+'T12:00:00Z');
      const day = offset => new Date(+date + offset * 86400000);
      const key = d => d.toISOString().slice(0,10);
      const history = new Map((activity?.days || []).map(([d,total,fresh]) => [d,{total,fresh}]));
      const entry = n => history.get(key(day(n))) || {total:0,fresh:0};
      const weekday = (date.getUTCDay()+6)%7;
      const series = Array.from({length:14}, (_,i)=>entry(i-13));
      const week = series.slice(-weekday-1);
      const done = entry(0).total;
      const percent = done ? Math.round(100*done/(done+remaining)) : 0;
      const total = week.reduce((n,x)=>n+x.total,0);
      const streak = activity?.streak || 0;
      const max = Math.max(1,...series.map(x=>x.total));
      const due = activity?.due || Array(7).fill(0);
      const short = n => day(n).toLocaleDateString(language,{month:'numeric',day:'numeric',timeZone:'UTC'});
      const months = [];
      for (let column = 0; column < 53; column++) {
        const first = day(column*7-364-weekday);
        if (first.getUTCDate() <= 7 && column < 51) {
          months.push(h('span',{key:column,style:{gridColumn:(column+1)+' / span 3'}},first.toLocaleDateString(language,{month:'short',timeZone:'UTC'})));
        }
      }
      const cells = Array.from({length:53*7},(_,i)=>{
        const n=i-364-weekday, amount=entry(n).total;
        return h('i',{key:i,title:n<=0?key(day(n))+' · '+amount:'',style:{visibility:n>0?'hidden':undefined,'--level':amount?Math.min(100,25+16*Math.log2(amount))+'%':'0%'}});
      });
      const metric = (name,value,extra) => h('section',null,h('h3',null,t(name)),h('strong',null,value),extra);
      const heatKey = h('div',{className:'anki-heat-key',title:t('heatHint')},...[0,25,50,75,100].map(level=>h('i',{key:level,style:{'--level':level+'%'}})));
      const barKey = h('div',{className:'anki-chart-key'},h('i'),t('learn'),h('i'),t('review'));
      const box = (name,tools,...content)=>h('section',{className:'anki-box','data-box':name},h('header',{className:'anki-box-head'},h('h2',null,t(name)),tools),...content);
      return h('div',{className:'anki-dashboard','data-detail':detail},
        h('div',{className:'anki-metrics'},
          metric('todayReview',done+' / '+(done+remaining),h(React.Fragment,null,h(Meter,{value:percent,label:t('todayReview')}),start)),
          metric('streak',streak+' '+t('daysUnit'),h('div',{className:'anki-week'},...Array.from({length:7},(_,i)=>h('span',{key:i,'data-on':!!entry(i-weekday).total,title:key(day(i-weekday))},day(i-weekday).toLocaleDateString(language,{weekday:'narrow',timeZone:'UTC'}))))),
          metric('thisWeek',total,h(React.Fragment,null,h(Meter,{value:Math.round(100*week.filter(x=>x.total).length/7),label:t('activeDays')}),h('small',null,t('activeDays')+' '+week.filter(x=>x.total).length+' / 7')))),
        h(Choice,{className:'anki-detail',value:detail,'aria-label':t('overview'),onChange:e=>setDetail(e.target.value)},
          ...['heatmap','dailyReviews','decks','forecast'].map(key=>h('option',{key,value:key},t(key)))),
        h('div',{className:'anki-charts'},box('heatmap',heatKey,h('div',{className:'anki-months'},months),h('div',{className:'anki-heat'},cells),syncStrip),
          box('dailyReviews',barKey,h('div',{className:'anki-bars'},...series.map((x,i)=>h('div',{key:i,title:key(day(i-13))+' · '+x.total},h('span',null,x.total),h('i',{style:{'--ratio':x.total/max,height:95*x.total/max+'px',background:'linear-gradient(to top,var(--accent) '+(x.total?100*(1-x.fresh/x.total):0)+'%,var(--tint) 0)'}}),h('small',null,short(i-13))))))),
        h('div',{className:'anki-bottom'},box('decks',searchDeck,deckTable),box('forecast',null,...due.map((n,i)=>h('div',{className:'anki-forecast',key:i},h('small',null,short(i)),h(Meter,{value:Math.round(100*n/Math.max(1,...due)),label:short(i)}),h('b',null,n))))));
    }
    function Workspace({ ctx, t: hostT, api, account, deckAction }) {
      React.useSyncExternalStore((listener) => ctx.locale.subscribe(listener), () => ctx.locale.getSnapshot().revision);
      const prefix = React.useId();
      const [status, setStatus] = React.useState(null);
      const [decks, setDecks] = React.useState([]);
      const [models, setModels] = React.useState([]);
      const [deckId, setDeckId] = React.useState('');
      const [tab, setTab] = React.useState('overview');
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
      const [syncState, setSyncState] = React.useState(null);
      const [noteStale, setNoteStale] = React.useState(false);
      const [deckControls, setDeckControls] = React.useState('');
      const [deletePreview, setDeletePreview] = React.useState(null);
      const [deleteName, setDeleteName] = React.useState('');
      const [prefs,setPrefs] = React.useState(() => {
        try { return JSON.parse(window.localStorage.getItem('dsh-anki:appearance')) || {}; } catch { return {}; }
      });
      const [deckFilter,setDeckFilter] = React.useState('');
      const [folded,setFolded] = React.useState([]);
      const [syncOpen,setSyncOpen] = React.useState(false);
      const quickSync = React.useRef(null);
      const [sort,setSort] = React.useState('modified');
      const language = prefs.language || (hostT('decks') === zh.decks ? 'zh' : 'en');
      const t = translate[language] || hostT;
      const theme = themes.find(([color]) => color === prefs.accent) || themes[0];
      const [accent] = theme;
      const dark = prefs.mode === 'dark';
      const local = (chinese, english) => language === 'zh' ? chinese : english;
      function segment(label, choices) {
        return h('div', {className:'anki-segment', role:'group', 'aria-label':label}, ...choices.map(([text, description, selected, action]) =>
          button(text, action, {key:description, title:description, 'aria-label':description, 'aria-pressed':selected, disabled:false})));
      }
      function preference(key,value) {
        const next = {...prefs,[key]:value};
        setPrefs(next);
        try { window.localStorage.setItem('dsh-anki:appearance',JSON.stringify(next)); } catch {}
      }
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
        if (tab !== 'browse' || !hasCollection || syncState?.active || syncState?.pendingFull) return;
        const generation = ++searchGeneration.current;
        setNotesLoading(true);
        api('notes.search', { query: effectiveQuery, offset, limit, sort }).then((result) => {
          if (alive.current && generation === searchGeneration.current) {
            // Deletions/imports can shrink the last page; clamp rather than show a phantom page.
            if (offset > 0 && result.total <= offset) setOffset(Math.max(0, Math.floor((result.total - 1) / limit) * limit));
            else setNotes(result);
          }
        }, (failure) => { if (alive.current && generation === searchGeneration.current) setError(failure?.message || t('unknownError')); })
          .finally(() => { if (alive.current && generation === searchGeneration.current) setNotesLoading(false); });
        return () => { if (generation === searchGeneration.current) searchGeneration.current++; };
      }, [tab, sort, hasCollection, effectiveQuery, offset, epoch, api, !!syncState?.active, !!syncState?.pendingFull]);
      React.useEffect(() => () => { if (tab === 'review') account('releaseReview', {}).catch(() => {}); }, [account, tab === 'review', deckId]);
      function changeTab(value) {
        if (tab === 'decks' && value !== 'decks') clearDelete();
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
      function previewDelete(target) {
        if (!target || sameId(target.id, 1) || lock.current || deleteSafety.current.blocked) return;
        chooseDeck(String(target.id));
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
      const dirty = !!note && (JSON.stringify(editFields) !== JSON.stringify(note.fields || {}) || editTags !== tagsText(note.tags));
      const notificationId = React.useRef(0);
      const notify = key => setNotice({text:t(key), id:++notificationId.current});
      const deckOptions = decks.map((deck) => h('option', { key: String(deck.id), value: String(deck.id) }, deck.name));
      const creating = deckControls === 'create' && tab === 'decks';
      const feedback = error || notice ? h(Toast, {key:error || notice.id, message:error || notice.text,
        error:!!error, dismiss:()=>error ? setError('') : setNotice('')}) : null;
      function cancelCreate() {
        if (!working) { setDeckControls(''); setDeckName(''); }
      }
      const deckForms = creating && h(Modal,{label:t('createDeck'),close:cancelCreate},
        h('h2',null,t('createDeck')),
        h('form',{className:'dsh-anki-form',onSubmit:event=>{
          event.preventDefault();
          perform(async()=>{
            if (!deckName.trim()) throw new Error(t('nameRequired'));
            await api('decks.create',{name:deckName.trim()});
            setDeckControls(''); setDeckName(''); await reload(); notify('deckCreated');
          });
        }},h(Field,{label:t('deckName')},h('input',{autoFocus:true,value:deckName,maxLength:200,placeholder:t('deckPlaceholder'),disabled:busy,onChange:e=>setDeckName(e.target.value)})),
          h('div',{className:'anki-modal-actions'},button(t('deleteCancel'),cancelCreate,{disabled:working}),submit(t('createDeck'),!deckName.trim()))),
        feedback);
      function inlineName(d) {
        const editing = deckControls === 'rename' && sameId(deckId,d.id);
        if (!editing) return h(React.Fragment,null,
          button(d.name.split('::').pop(),()=>{chooseDeck(String(d.id));changeTab('browse');},{className:'anki-name',title:d.name}),
          button(h(Glyph,{name:'pencil',size:14}),()=>{chooseDeck(String(d.id));setRename(d.name);setDeckControls('rename');},
            {className:'anki-pencil',title:t('renameDeck'),'aria-label':t('renameDeck')+' '+d.name}));
        return h('form',{className:'anki-inline-edit',onKeyDown:e=>{if(e.key==='Escape')setDeckControls('');},onSubmit:e=>{
          e.preventDefault();
          if (!rename.trim() || busy) return;
          perform(async()=>{
            if(rename.trim()!==d.name){await api('decks.rename',{deckId:d.id,name:rename.trim()});await reload();notify('deckRenamed');}
            setDeckControls('');
          });
        }},h('input',{autoFocus:true,'aria-label':t('renameDeck'),value:rename,maxLength:200,disabled:busy,onChange:e=>setRename(e.target.value)}),
          h('button',{type:'submit',disabled:busy||!rename.trim(),title:t('save'),'aria-label':t('save')},'✓'),
          button('×',()=>setDeckControls(''),{'aria-label':t('deleteCancel'),title:t('deleteCancel')}));
      }

      const deletePanel = deletePreview && h(Modal,{label:t('deleteTitle'),close:clearDelete,className:'dsh-anki-delete'},
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
          h(Fields, { key: String(note.id), names: editNames, values: editFields, setValues: setEditFields, disabled: busy, api, notify, perform, t }),
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

      const noteSearch = h('form', { className: 'dsh-anki-search', onSubmit: (event) => { event.preventDefault(); setOffset(0); setQuery(searchInput.trim()); setEpoch((before) => before + 1); } },
              h('div', { className: 'dsh-anki-search-box' }, h(Glyph, { name: 'search', size: 16 }),
                h('input', { type: 'search', 'aria-label': t('query'), value: searchInput, placeholder: t('queryPlaceholder'), disabled: busy, onChange: (event) => setSearchInput(event.target.value) })),
              submit(t('search')));
      const browse = h('section', { className: 'dsh-anki-browse' },
        h('div', { className: 'dsh-anki-browser' }, h('div', { className: 'dsh-anki-results', 'aria-busy': notesLoading },
          h('div', { className: 'dsh-anki-results-head' },
            h('strong', { role: 'status' }, t('results')+' · '+(notesLoading ? t('loading') : count(notes.total))),
            h(Choice,{'aria-label':t('sort'),value:sort,onChange:e=>{setSort(e.target.value);setOffset(0);}},...['modified','created'].map(key=>h('option',{key,value:key},t(key))))),
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
        h('div', { className: 'dsh-anki-form-grid' }, h(Field, { label: t('deck') }, h(Choice, { 'aria-label':t('deck'),value: addDeckId, disabled: busy || !decks.length, onChange: (event) => setAddDeckId(event.target.value) }, !decks.length && h('option', { value: '' }, t('chooseDeck')), ...deckOptions)),
          h(Field, { label: t('model') }, h(Choice, { 'aria-label':t('model'),value: modelId, disabled: busy || !models.length, onChange: (event) => setModelId(event.target.value) }, ...models.map((model) => h('option', { key: String(model.id), value: String(model.id) }, model.name))))),
        !models.length && h('p', { className: 'dsh-anki-muted' }, t('noModels')),
        h('div',{className:'anki-fieldpair'},h(Fields, { key: String(modelId), names, values: addFields, setValues: setAddFields, disabled: busy, api, notify, perform, t })),
        selectedModel && (selectedModel.type === 1 || /cloze/i.test(selectedModel.name)) && h('p', { className: 'dsh-anki-caption' }, t('clozeHint')),
        h(Field, { label: t('tags') }, h('input', { value: addTags, placeholder: t('tagsPlaceholder'), disabled: busy, onChange: (event) => setAddTags(event.target.value) })),
        h('div', { className: 'dsh-anki-actions' }, submit(t('add'), !selectedModel || !addDeckId)));

      const queue = card?.remaining;
      const remaining = typeof queue === 'object' && queue !== null
        ? Number(queue.total ?? ['new','learn','review'].reduce((n,key)=>n+Number(queue[key]||0),0))
        : Number(queue || 0);
      const completed = selectedDeck ? decks.reduce((total,deck) =>
        deck.id === selectedDeck.id || deck.name.startsWith(selectedDeck.name+'::')
          ? total + (status?.activity?.byDeck?.[deck.id] || 0) : total,0) : 0;
      const percent = completed ? Math.round(100*completed/(completed+remaining)) : 0;
      const undo = button(t('undo'), () => perform(async () => {
        await api('review.undo', {}); setCard(undefined); setRevealed(null); await syncCounts(); await nextReview(); notify('undoDone');
      }), {disabled:busy || !selectedDeck || status?.undo?.available === false});
      const review = h('section', {className:'anki-review-session'},

        card ? h(React.Fragment, null,
          h('header',{className:'anki-review-summary'},h('div',null,h('strong',null,t('todayReview')+' · '+completed+' / '+(completed+remaining)),h('span',null,t('remaining')+' '+remaining)),
            h(Meter,{value:percent,label:t('todayReview')})),
          h(CardFrame, { key: String(card.token) + (revealed ? '-answer' : '-question'), html: revealed ? revealed.answer : card.question, css: revealed?.css ?? card.css, api, t }),
          h('div', { className: 'dsh-anki-review-actions' }, !revealed ? button(t('reveal'), () => perform(async () => { setRevealed(await api('review.reveal', { token: card.token })); }), { className: 'dsh-anki-primary' })
            : (revealed.buttons || []).filter((entry) => [1, 2, 3, 4].includes(entry.rating)).map((entry) => button(h(React.Fragment, null, h('strong', null, t(['', 'again', 'hard', 'good', 'easy'][entry.rating]))),
              () => perform(async () => {
                await api('review.answer', { token: revealed.token || card.token, rating: entry.rating });
                // Immediately retire consumed tokens, even if a subsequent refresh fails.
                setCard(undefined); setRevealed(null); await syncCounts(); await nextReview();
              }), { key: entry.rating, className: 'dsh-anki-rating','data-rating':entry.rating }))))
          : h(Empty, { check: card === null, title: t(card === null ? 'reviewEmpty' : 'reviewIdle') },
            button(t(card === null ? 'nextCard' : 'startReview'), () => perform(nextReview), { className: 'dsh-anki-primary', disabled: busy || !selectedDeck })),
        );

      const roots = decks.filter(d=>!d.name.includes('::'));
      const pending = d => (d.newCount||0)+(d.learnCount||0)+(d.reviewCount||0);
      function openReview(d) {
        if (!d) { changeTab('decks'); return; }
        chooseDeck(String(d.id)); changeTab('review');
        perform(async()=>setCard(await api('review.next',{deckId:d.id})));
      }
      const reviewButton = d => button(t('startReview'),()=>openReview(d),{className:'dsh-anki-primary'});
      const searchDeck = h('input',{type:'search',value:deckFilter,placeholder:t('deckSearch'),'aria-label':t('deckSearch'),onChange:e=>setDeckFilter(e.target.value)});
      function deckTable(compact) {
        const headers = compact?['deck','due','progress','actions']:['deck','new','learn','due','total','progress','actions'];
        const answered = new Map();
        const parents = new Set();
        for (const deck of decks) {
          const parts = deck.name.split('::');
          let name = '';
          for (const part of parts) {
            name = name ? name+'::'+part : part;
            answered.set(name,(answered.get(name)||0)+(status?.activity?.byDeck?.[deck.id]||0));
            if (name !== deck.name) parents.add(name);
          }
        }
        const list = decks.filter(d=>d.name.toLowerCase().includes(deckFilter.toLowerCase()) && (deckFilter || !folded.some(parent=>d.name.startsWith(parent+'::'))));
        return h('div',{className:'anki-scroll'},h('table',{className:'anki-grid'},h('thead',null,h('tr',null,...headers.map(k=>h('th',{key:k},t(k))))),h('tbody',null,...list.map(d=>{
          const done = answered.get(d.name) || 0;
          const percent = done ? Math.round(100*done/(done+pending(d))) : 0;
          return h('tr',{key:d.id},h('td',{style:{paddingInlineStart:8+12*Math.min(5,d.name.split('::').length-1)}},parents.has(d.name) && button(folded.includes(d.name)?'▸':'▾',()=>setFolded(folded.includes(d.name)?folded.filter(x=>x!==d.name):[...folded,d.name]),{'aria-label':t(folded.includes(d.name)?'expand':'collapse')+' '+d.name}),
            compact ? button(d.name.split('::').pop(),()=>{chooseDeck(String(d.id));changeTab('browse');},{className:'anki-name',title:d.name}) : inlineName(d)),
            !compact && h('td',null,count(d.newCount)),!compact && h('td',null,count(d.learnCount)),h('td',null,count(d.reviewCount)),!compact && h('td',null,count(d.total)),
            h('td',null,percent+'%',h(Meter,{value:percent,label:d.name})),h('td',null,reviewButton(d),!compact && button(h(Glyph,{name:'trash',size:14}),()=>previewDelete(d),{className:'anki-pencil',disabled:busy||sameId(d.id,1),'aria-label':t('deleteDeck')+' '+d.name,title:sameId(d.id,1)?t('deleteDefault'):t('deleteDeck')})));
        }))));
      }
      const syncStrip = h('section',{className:'anki-sync-strip','aria-label':t('syncTitle')},
        h('div',null,h('strong',null,t('syncTitle')),h('span',null,
          syncState?.active ? t('syncSyncing') : syncState?.pendingFull ? t('syncAwaiting') : !syncState?.loggedIn ? t('syncSignedOut') :
          t('syncLast')+' · '+(syncState.lastSyncAt ? new Date(syncState.lastSyncAt).toLocaleString(language) : t('syncNever')))),
        h('div',{className:'dsh-anki-actions'},
          syncState?.loggedIn && !syncState.pendingFull && !syncState.active &&
            button(t('syncNow'),()=>quickSync.current?.(),{className:'dsh-anki-primary'}),
          button(syncState?.loggedIn ? (syncState.active || syncState.pendingFull ? t('syncProgress') : t('syncAccount')) : t('syncLogin'),()=>setSyncOpen(true),{disabled:false})));
      const overview = tab==='overview' && h(Dashboard,{t,language,syncStrip,activity:status?.activity,remaining:roots.reduce((n,d)=>n+pending(d),0),
        start:reviewButton(roots.find(pending)||roots[0]),searchDeck,deckTable:deckTable(true)});
      const decksPage = tab==='decks' && h(React.Fragment,null,deckForms,deckTable(false));
      const scope = h('div',{className:'anki-row'},h('div',{className:'anki-scope-label'},t('deck'),' ',h(Choice,{'aria-label':t('deck'),value:deckId,disabled:busy,onChange:e=>chooseDeck(e.target.value)},!deckId || tab==='browse' ? h('option',{value:''},tab==='review'?t('chooseDeck'):t('allDecks')) : null,deckOptions)),tab==='browse' && noteSearch);
      const titles = {overview:'todayOverview',decks:'decks',browse:'browse',add:'add',review:'review'};
      return h('div',{className:'dsh-anki','data-mode':prefs.mode || 'light',lang:language,style:{'--accent':accent,'--on-accent':'#fff'}},h('style',null,CSS),h('div',{className:'dsh-anki-wrap'},
        h('header',{className:'anki-top'},h('strong',{className:'anki-brand'},'DSH Anki'),
          h('nav',{className:'anki-pages','aria-label':t('title')},...['overview','decks','browse'].map(id=>button(t(id),()=>changeTab(id),{key:id,disabled:working,'aria-current':tab===id?'page':undefined}))),
          h('div',{className:'anki-tools'},button('＋ '+t('quickAdd'),()=>changeTab('add'),{className:'dsh-anki-primary'}),
            h('div',{className:'anki-theme'},h('i',{'aria-hidden':true}),h(Choice,{value:accent,'aria-label':t('theme'),onChange:e=>preference('accent',e.target.value)},
              ...themes.map(([color,zhName,enName])=>h('option',{key:color,value:color},local(zhName,enName))))),
            segment(t('appearance'),[[h(Glyph,{name:'sun',size:14}),local('日间模式','Light mode'),!dark,()=>preference('mode','light')],[h(Glyph,{name:'moon',size:14}),local('夜间模式','Dark mode'),dark,()=>preference('mode','dark')]]),
            segment(t('language'),[['中','中文',language==='zh',()=>preference('language','zh')],['EN','English',language==='en',()=>preference('language','en')]]))),
        h('div',{className:'anki-pagehead'},h('div',{className:'anki-row'},h('h1',null,t(titles[tab])),tab==='overview' && h('time',null,new Date().toLocaleDateString(language,{year:'numeric',month:'long',day:'numeric',weekday:'short'}))),h('div',{className:'anki-heading-tools'},tab==='decks' && searchDeck,tab==='decks' && button(t('createDeck'),()=>setDeckControls(deckControls==='create'?'':'create'),{className:'dsh-anki-primary'}),tab==='review' && scope,tab==='review' && undo)),
        !creating && feedback,
          syncState?.pendingFull && h('div', { className: 'dsh-anki-notice', role: 'alert' }, h('span', null, t('syncDecisionBanner')), button(t('syncOpen'), () => setSyncOpen(true), { disabled: false })),
          note && noteStale && h('div',{className:'dsh-anki-notice',role:'alert'},t('syncChanged')),
        h('main',{'data-page':tab},tab==='decks' && deletePanel,
          (initializing ? t('loading') : !status ? h(Empty,{title:t('notReady'),description:t('notReadyHint')},h(React.Fragment,null,button(t('retry'),()=>perform(reload)),button(t('syncOpen'),()=>setSyncOpen(true),{disabled:false}))) :
            tab==='overview'?overview:tab==='decks'?decksPage:tab==='add'?add:tab==='browse'?h(React.Fragment,null,scope,browse):review),
              h(SyncPanel, { t, api, account, quickSync, open:()=>setSyncOpen(true), close:()=>setSyncOpen(false), visible: syncOpen,
                onStatus: (next) => { setSyncState(next); if (next.active || next.pendingFull) { deleteSafety.current.blocked = true; deleteSafety.current.syncBlocked = true; clearDelete(); setCard(undefined); setRevealed(null); } },
                onSettled: () => { setNoteStale(true); setCard(undefined); setRevealed(null); reload().catch(() => { if (alive.current) setError(t('syncFailed')); }); }
              }))));
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
