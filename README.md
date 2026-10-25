# dsh-anki / DSH Anki 工作区

独立的 DSH 插件：原生 Anki 侧栏与 `anki` AI 工具共用**仅属于当前 DSH 配置的一份独立牌库**，由真实的无界面 Anki 核心驱动。不启动 Anki 桌面窗口、AnkiConnect、Qt 或替代 Web 服务。本项目是独立集成，不是 Anki 官方产品。

**1.3.0 重做了原生页面**：浅色卡片、青绿色强调色、顶部六格统计，以及「牌组 — 搜索列表 — 编辑器」三栏布局。页面仍然严格贴合 DSH 主面板的可用高度，搜索结果、编辑区、牌组区与其他标签页各自内部滚动；窄窗口下自动改为牌组横向条、结果与编辑器上下分栏。**1.3.1 仅把本文档改为中文为主**，插件行为与牌库数据没有任何变化。

## 安装与升级

**环境要求：** Windows x64、DSH `^0.2.1-rc.2`、内置 CPython 3.13.5；外部 Anki **26.05**，build `e64c6b1a`（`e64c6b1aee3e8d668fb8bbe084beada8e070d985`）。Anki 核心**不随包分发**。**仅支持 Windows x64；需自行安装 Anki 26.05，并把 `ankiPackages` 指向其 `app_packages` 目录。** 默认值 `D:/Anki/app_packages` 只是作者机器的路径，不会自动适配你的安装位置。

### 首次安装（公开 Release 安装包）

1. 自行安装 [Anki 26.05](https://github.com/ankitects/anki/releases/tag/26.05)，找到其实际使用的 `app_packages` 目录；插件运行时不需要启动 Anki 桌面程序。
2. 从 [v1.3.1 Release](https://github.com/NanoShiki/dsh-anki/releases/tag/v1.3.1) 下载 [dsh-anki-1.3.1.tgz](https://github.com/NanoShiki/dsh-anki/releases/download/v1.3.1/dsh-anki-1.3.1.tgz)，不要用 GitHub 自动生成的 Source code 压缩包代替。
3. 在已认证的 DSH 插件管理器中导入下载的 `.tgz` 安装包；启用前将 `ankiPackages` 设置为第 1 步找到的目录。缺少外部核心时会报 `core-missing`，安装包本身不会下载 Anki 核心。
4. 保持 `dataDir` 为独立的插件数据目录，启用插件并按管理器提示刷新/重启，再打开「Anki → 浏览」。不要指向 Anki 桌面版牌库。

本项目通过 GitHub Release 分发安装包，**未发布到 npm**；`@local/dsh-anki` 与 `private: true` 是现有包身份/防止误发 npm 的设置，升级时保留它们，避免改变包身份。这里不承诺未经验证的 GitHub 源码直装路径。

安装包 SHA-256：`778c3be27c2d3f9621c16cf4c24add6d9b4d12b7acfbe1e0496314e0fd4e22b6`。该安装包对应提交 `3c615c9`；本节公开下载说明为随后补充，包内 README 仍为该提交的版本。

**已装同名包 `@local/dsh-anki` 的 1.2.x / 1.3.0：** 等待同步结束 → 在插件管理器中禁用插件并等后台 Python 进程退出 → 备份整个数据目录 → 用 [公开 Release 安装包](https://github.com/NanoShiki/dsh-anki/releases/download/v1.3.1/dsh-anki-1.3.1.tgz) 更新同一个包 → 保留原有设置与数据目录 → 重新启用，并按管理器提示刷新或重启。本次只改文档，不迁移、不清空牌库。

**从旧包名 `@local/dsh-anki-workspace` 迁移（一次性）：** 改名相当于换了一个新包身份，不能就地覆盖安装。

1. 先等待同步结束，在已认证的 DSH **插件管理器**中禁用旧包，并等它的 Python 进程退出；只关闭标签页并不够。**绝不要同时启用新旧两个包**——两者会有意共用同一个服务和牌库。
2. 记录自定义的 `dataDir`、`ankiPackages`、`pythonPath`，在停用状态下备份整个数据目录。旧包保持禁用，或通过管理器卸载，但**不要删除数据目录**。
3. 导入 [公开 Release 安装包](https://github.com/NanoShiki/dsh-anki/releases/download/v1.3.1/dsh-anki-1.3.1.tgz)，包名为 `@local/dsh-anki`；启用前把原自定义设置填回，尤其要保证 `dataDir` 完全一致。
4. 打开「**Anki → 浏览**」确认牌组与笔记仍在。默认数据仍是**同一个 DSH 配置**下的 `<profileContext.dir>/data/anki-workspace`：改名不会搬迁或删除它，AI 工具 `anki` 与侧栏名称也都不变。
5. **不要把 `dataDir` 指向 Anki 桌面版的配置目录。** 如果安装被拒绝，请保留管理器的错误信息，不要为了「修好」而删除牌库。

**验证边界：** 自动化检查覆盖隔离的原生牌库、本地回环同步服务、客户端结构交互，以及合成状态下的真实浏览器布局。它们不能证明某个具体安装、真实 AnkiWeb 账号或云端连接可用。请使用你已认证的插件管理器与 GUI，按它实际提示刷新/重启；不需要替换服务器，也不依赖未经验证的热更新行为。实时验收清单见 [ACCEPTANCE.md](<ACCEPTANCE.md>)，测试记录见 [VERIFICATION.md](<VERIFICATION.md>)。

源码仓库：[NanoShiki/dsh-anki](https://github.com/NanoShiki/dsh-anki)。

## 登录与同步

- 账号密码**只在仅所有者可见的同步页**输入，不要发到聊天里。密码是临时的，提交后即从表单清除；可复用的登录令牌与设置通过 **Windows 当前用户 DPAPI** 加密保存，并额外绑定工作区路径，没有明文降级。换一个 Windows 用户或换路径可能需要重新登录；退出登录会删除已存令牌。本插件不读取其它 Anki 安装的凭据。
- **立即同步**会先做原生牌库同步、再做原生媒体同步，并显示进度、支持取消。完成时间戳只在两者都成功后才写入。原生任务占用牌库期间其它操作不可用，但状态查询与取消始终保持响应。
- **自动同步默认开启**，页面上有可见开关。宿主会在启动/登录后、编辑或复习成功后约 15 秒空闲时、以及大约每 5 分钟各调度一次；存在未处理的复习卡片时会推迟，直到作答或离开。离线失败会退避；它不依赖你停留在同步页，客户端计时器只读取状态。
- **任何全量上传/下载都会停下来等待明确确认。** 页面会显示允许的方向与本地笔记数，并且必须勾选「覆盖警告」。本地库为空且在允许时会推荐下载。确认会过期且只能使用一次；**AI 与自动同步都不能替你确认方向**。
- 两个全量方向都会先把稳定的**本地牌库、媒体与媒体库**（不含账号凭据）快照到私有的 `backups` 目录。**本地备份救不回被覆盖的云端数据。** 全量上传会替换云端牌库，全量下载会替换本地牌库，请特别在首次登录时谨慎选择。
- 失败或取消可能留下**部分完成的本地或云端改动**，取消不等于回滚；重试前先查看状态与备份。鉴权被拒会清除已保存的登录；普通的离线/网络失败会保留受保护的令牌。
- 同步会保留编辑中的草稿，但可能改变它们的版本。版本过期的草稿需要先重新加载笔记再保存；重新加载会丢弃该草稿。后台也会拒绝过期的笔记修订。

## 牌库操作

- 牌组可新建、重命名；支持原生 Anki 笔记类型与搜索语法；可添加/编辑笔记与标签、暂停/恢复卡片。添加笔记默认优先**问答题（输入答案）**，也能识别改名后的输入答案模板；已有的手动选择在刷新后保持不变。若该类型不存在，会优先普通 Basic/问答题而不是图片遮罩；**不会自动新建或重命名任何笔记类型**。
- 删除牌组：先选中牌组，再点重命名下方的「**删除牌组…**」。仅所有者可用的确认预览会列出受影响的根牌组/子牌组、将要删除的卡片与孤立笔记，以及只是被退回原牌组的筛选牌组卡片；需输入**完整牌组名**确认。**普通牌组删除会删掉它的卡片（包括临时在筛选牌组中的卡片）；删除筛选牌组只是退回卡片。在别处仍有卡片的笔记以及媒体文件会保留。** Anki 的 ID-1 默认牌组、以及包含它的父牌组，不能在这里删除。
- **需要的话，删除前先导出 APKG 备份。** 删除**不能用复习撤销**恢复；开启自动同步时还可能传播到 AnkiWeb。取消预览不会改变任何东西。确认是一次性的、五分钟后过期，牌组范围变化即拒绝执行；出错后请重新打开预览。同步/全量同步的限制同样适用。本插件不提供单独的「删除笔记」动作。
- 复习只针对**选定的具体牌组**（含子牌组，遵循原生每日上限），没有全牌组复习器。先显示答案，再选 Again/Hard/Good/Easy。撤销只作用于本后台会话中最近一次可撤销的复习；重启或同步会让临时复习令牌失效，但不会影响已保存的排程。
- 界面与 AI 共用同一后端。AI 编辑笔记时必须先取回笔记，并把不透明的 `modified` 作为 `expectedModified` 传回，否则会被拒绝。
- 导入：把 `.apkg` 放进 `status.importsDir`，只传**文件名**；导入前有原生牌库备份，按合并处理。导出：在 `status.exportsDir` 生成新包，**绝不覆盖**已存在的导出文件。
- 媒体只接受文件名、限制扩展名与类型、单次响应上限 5 MiB。生成的 LaTeX 被禁用；复习器 HTML 禁用脚本并做沙箱隔离。不支持插件（add-ons）、复习器自定义 JavaScript 或 MathJax，复杂模板的显示可能与 Anki 桌面版不同。

## 权限

AI 的读取操作（含 `sync.status`）在只读模式下即可工作。**修改、导出、`review.next`、`sync.run` 与 `sync.cancel` 需要 `danger-full-access`**，因为私有牌库位于对话工作区之外。工具既不会主动申请，也不会绕过授权；没有你的明确意图，不要评分或同步。

**删除牌组、登录/退出、设置与全量同步确认不提供任何 AI 动作**，它们走独立的 RPC，且必须由已认证的所有者发起——即便是内部调用也一样。导入的笔记、模板与网页内容一律是不可信数据，不能当作操作指令。

## 备份

后台进程只打开自己的私有牌库，并持有进程生命周期的系统级锁。**APKG 导入的媒体写入不能原子回滚**，导入前的牌库备份也不等于完整的媒体备份。需要一份独立完整备份时：禁用插件、等后台进程退出，然后复制**整个数据目录**（包含牌库、媒体与附属文件）。**不要只复制一个正在使用的 SQLite 文件。** 整目录副本包含受保护的账号状态，请不要分享；手工迁移后可能需要重新登录。本地并发的文件系统篡改不在本集成的保证范围内。

## 验证与许可

见[验证记录](<VERIFICATION.md>)：覆盖真实核心 + 官方本地同步服务器、DPAPI、传输层、调度器、客户端结构、隔离 Chromium 布局以及真实 Gateway 的检查。测试从不使用桌面版配置或真实 AnkiWeb 账号；合成布局测试**不等于**已认证的生产 UI 验收，也不等于真实云端验收。

插件本身：[AGPL-3.0-or-later](<LICENSE>)。另见 [Anki 上游声明](<ANKI-LICENSE.txt>)、[第三方声明](<THIRD-PARTY-NOTICES.md>) 与 [Python 许可](<runtime/LICENSE.txt>)。子进程边界并不免除许可义务。

## English

A native DSH sidebar and an `anki` AI tool sharing **one independent, per-DSH-profile collection**, powered by real headless Anki — no Anki desktop window, AnkiConnect, Qt or replacement web server is started. Independent integration, not an official Anki product. Version 1.3.1 is a documentation change only; 1.3.0 redesigned the page with a pale canvas, teal accents, a six-stat strip and deck/results/editor panels, while keeping the page bounded to the DSH main slot with internal scrolling.

**Requirements:** Windows x64, DSH `^0.2.1-rc.2`, bundled CPython 3.13.5, and an external Anki **26.05** build `e64c6b1a` (default `ankiPackages`: `D:/Anki/app_packages`). The Anki core is not bundled.

**Install:** Windows x64 only; needs a separately installed Anki 26.05 (point `ankiPackages` at its `app_packages` folder). Download the `.tgz` asset from the [public v1.3.1 release](https://github.com/NanoShiki/dsh-anki/releases/tag/v1.3.1), import it through the authenticated DSH plugin manager, configure `ankiPackages`, then enable the plugin. The default path is author-specific, not auto-detected. The package is not published to npm; its existing `@local/dsh-anki` identity is retained. The release archive is unchanged from commit `3c615c9`; these public-download instructions were added afterward.

**Upgrade:** wait for sync, disable the plugin and let its Python worker exit, back up the whole data directory, then update the same `@local/dsh-anki` package with [the public release archive](https://github.com/NanoShiki/dsh-anki/releases/download/v1.3.1/dsh-anki-1.3.1.tgz), keeping your settings and data directory. Migrating from the old `@local/dsh-anki-workspace` identity is a one-time new-package install: never enable both packages together, keep the data directory, and never point `dataDir` at an Anki desktop profile.

**Sync:** credentials are entered only on the owner-only Sync page and stored with Windows current-user DPAPI, bound to the workspace path, with no plaintext fallback. Manual sync runs native collection sync and then native media sync. Automatic sync is on by default and is scheduled by the host. **Every full upload or download waits for explicit confirmation** with a mandatory overwrite warning; AI and automatic sync can never confirm a direction. Both full directions snapshot the local collection, media and media database first — **a local backup cannot restore overwritten cloud data**. Failed or cancelled sync can leave partially completed changes; cancellation is not rollback.

**Operations:** deck create/rename, native note types and search, note/tag editing, card suspension, APKG import and export, and review of a selected deck (including descendants) with Again/Hard/Good/Easy. Deck deletion is owner-only, previews the affected subdecks, cards and orphaned notes, requires the exact full deck name, protects the ID-1 default deck, and cannot be undone by review undo. Media is basename-only and capped at 5 MiB per response; reviewer HTML is script-disabled and sandboxed, and add-ons/custom reviewer JavaScript/MathJax are unsupported.

**Permissions:** AI reads work in read-only mode; mutations, exports, `review.next`, `sync.run` and `sync.cancel` require `danger-full-access`, because the private collection lives outside the conversation workspace. Deck deletion, login/logout, settings and full-sync confirmation expose no AI action at all and require an authenticated owner. Imported notes, templates and page content are untrusted data, never instructions.

**Backups:** disable the plugin, wait for its worker to exit, then copy the entire data directory — not a live SQLite file. Import media writes are not atomically rolled back. A whole-directory copy includes protected account state; do not share it.

**Verification:** automated checks cover isolated native collections, localhost sync services, DPAPI, transport, scheduling, structural client behavior and an isolated Chromium layout fixture. They do not establish that a particular live installation, real AnkiWeb account or cloud connection works. Use your existing authenticated plugin manager and GUI; no replacement server is required. See the [acceptance checklist](<ACCEPTANCE.md>) and [verification record](<VERIFICATION.md>). Licensed [AGPL-3.0-or-later](<LICENSE>), with the [Anki upstream notice](<ANKI-LICENSE.txt>), [third-party notices](<THIRD-PARTY-NOTICES.md>) and [Python license](<runtime/LICENSE.txt>).
