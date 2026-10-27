# dsh-anki / DSH Anki 工作区

独立的 DSH 插件：原生 Anki 侧栏与 `anki` AI 工具共用**仅属于当前 DSH 配置的一份独立牌库**，由真实的无界面 Anki 核心驱动。不启动 Anki 桌面窗口、AnkiConnect、Qt 或替代 Web 服务。本项目是独立集成，不是 Anki 官方产品。

**1.4.2 开箱即用**：安装包包含 CPython、Anki 26.05 无界面核心及其全部 Python 运行依赖，安装后无需另外安装 Anki、Python 或 pip，也无需填写核心路径。沿用浅色卡片、青绿色强调色、顶部六格统计，以及「牌组 — 搜索列表 — 编辑器」布局；窄窗口自动适配，各区域内部滚动。

## 安装与升级

**环境要求：** Windows x64、DSH `^0.2.1-rc.2`（已在 **0.2.1-rc.3** 验证；`@deepseek-ai/dsh*` peer 声明为范围而不是精确版本）。随包提供 CPython 3.13.5、官方 PyPI Anki **26.5 / 26.05** Windows x64 wheel 及其依赖；不包含 Qt 或 Anki 桌面界面。**不要求已有 Anki/Python 安装，不在首次启动时下载运行依赖。** AnkiWeb 同步仍需网络和自己的账号。

### 首次安装（公开 Release 安装包）

> **注意：2.0.0 是更名后的版本，尚未发布。** 下面的下载链接仍指向最后发布的 1.4.2（包身份 `@local/dsh-anki`）；2.0.0 发布后再更新本节链接与包名。

1. 从 [v1.4.2 Release](https://github.com/NanoShiki/dsh-anki/releases/tag/v1.4.2) 下载 [dsh-anki-1.4.2.tgz](https://github.com/NanoShiki/dsh-anki/releases/download/v1.4.2/dsh-anki-1.4.2.tgz)，不要用 GitHub 自动生成的 Source code 压缩包代替安装包。
2. 在已认证的 DSH 插件管理器中导入 `.tgz`，保持 `pythonPath`、`ankiPackages` 为空，即自动使用包内运行时与核心。
3. 启用插件并按管理器提示刷新/重启，打开「Anki → 浏览」。`dataDir` 留空即使用当前 DSH 配置的独立数据目录；不要指向 Anki 桌面版牌库。

插件管理器里的显示名称是 **Anki**（来自包内 `locale/*.json` 的 `meta.title`）；技术包名是 `@nanoshiki/dsh-anki`（2.0.0 起；1.4.x 及更早为 `@local/dsh-anki`），只在详情页用于排查安装位置。

`pythonPath` / `ankiPackages` 仅保留为高级用户的绝对路径覆盖项，不再使用作者机器上的路径，也不会静默回退到外部安装。完整包损坏或缺文件时，请重新安装完整 `.tgz`，不是另装 Python/Anki。

本项目通过 GitHub Release 分发预构建安装包，**未发布到 npm**；2.0.0 起包身份为 `@nanoshiki/dsh-anki`，`private: true` 用于防止误发 npm。升级方式仍是下载新 Release 包后卸载旧包再安装，数据目录保持不变。

安装包校验值随 Release 提供；核心逐文件校验值见 [core-sha256.json](<core-sha256.json>)，官方 wheel 下载地址、版本与 SHA-256 见 [core-lock.json](<core-lock.json>)。

**始终最新（稳定链接）：** 每个 Release 都附带同名资产 `dsh-anki.tgz`，所以
`https://github.com/NanoShiki/dsh-anki/releases/latest/download/dsh-anki.tgz`
永久指向最新正式版；市场收录条目用的就是这个链接。发布新版本只需新建 Release 并附上同名资产，**不需要再向市场提交 PR**。要锁定版本或核对哈希时，用上面的版本化链接。

**对应源码与许可：** Anki 核心的固定提交源码、锁定的 Rust 依赖源码、构建说明，以及 Python 依赖源码与完整第三方许可文本，随同一 Release 另行提供（`*-corresponding-source.tar.gz`、`*-python-sources.tar.gz`）。普通用户无需下载它们即可安装；安装包内已包含运行时所需的全部许可与声明文本。

**已装同一包 `@nanoshiki/dsh-anki` 的旧版本：** 等待同步结束 → 禁用插件并等后台 Python 进程退出 → 备份整个数据目录 → 更新同一个包 → 保留 `dataDir` 不变，将旧的 `ankiPackages` / `pythonPath` 覆盖项清空以使用内置核心 → 重新启用，按管理器提示刷新或重启。不迁移、不清空牌库；高级用户主动保留的外部覆盖路径仍会被尊重。

**从 `@local/dsh-anki` 迁移到 `@nanoshiki/dsh-anki`（一次性）：** 2.0.0 换了包身份，市场/插件管理器会把它当作另一个插件，不能覆盖升级。

1. 等同步结束，禁用旧包并等后台 Python 进程退出；备份整个数据目录。
2. 记录当前 `dataDir`（默认留空即 `<profileContext.dir>/data/anki-workspace`），然后卸载旧包，**不要删除数据目录**。
3. 安装新的 `@nanoshiki/dsh-anki`，`dataDir` 保持与原来一致；启用后打开「Anki → 浏览」确认牌组与笔记都在。
4. 新旧两个包不要同时启用；服务名、AI 工具、面板与牌库路径都没有变化。

**从旧包名 `@local/dsh-anki-workspace` 迁移（一次性）：** 改名相当于换了一个新包身份，不能就地覆盖安装。

1. 先等待同步结束，在已认证的 DSH **插件管理器**中禁用旧包，并等它的 Python 进程退出；只关闭标签页并不够。**绝不要同时启用新旧两个包**——两者会有意共用同一个服务和牌库。
2. 记录自定义的 `dataDir`、`ankiPackages`、`pythonPath`，在停用状态下备份整个数据目录。旧包保持禁用，或通过管理器卸载，但**不要删除数据目录**。
3. 导入 [公开 Release 安装包](https://github.com/NanoShiki/dsh-anki/releases/download/v1.4.2/dsh-anki-1.4.2.tgz)，包名为 `@nanoshiki/dsh-anki`；启用前只把 `dataDir` 填回原值（必须完全一致），`pythonPath` / `ankiPackages` 留空以使用 1.4.2 内置运行时与核心。
4. 打开「**Anki → 浏览**」确认牌组与笔记仍在。默认数据仍是**同一个 DSH 配置**下的 `<profileContext.dir>/data/anki-workspace`：改名不会搬迁或删除它，AI 工具 `anki` 与侧栏名称也都不变。
5. **不要把 `dataDir` 指向 Anki 桌面版的配置目录。** 如果安装被拒绝，请保留管理器的错误信息，不要为了「修好」而删除牌库。

**验证边界：** 自动化检查覆盖隔离的原生牌库、本地回环同步服务、客户端结构交互，以及合成状态下的真实浏览器布局。它们不能证明某个具体安装、真实 AnkiWeb 账号或云端连接可用。请使用你已认证的插件管理器与 GUI，按它实际提示刷新/重启；不需要替换服务器，也不依赖未经验证的热更新行为。实时验收清单见 [ACCEPTANCE.md](<ACCEPTANCE.md>)，测试记录见 [VERIFICATION.md](<VERIFICATION.md>)。

源码仓库：[NanoShiki/dsh-anki](https://github.com/NanoShiki/dsh-anki)。

## 参与贡献

**本仓库只接受 Pull Request。** `main` 分支已启用保护：直接 push、强制推送和删除都会被拒绝，仓库所有者也不例外。请从 `main` 拉分支、按 PR 模板提交，并等 `test` 检查通过后合并；流程、本地测试命令与必须保持的不变量见 [CONTRIBUTING.md](<CONTRIBUTING.md>)。

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

A native DSH sidebar and an `anki` AI tool sharing **one independent, per-DSH-profile collection**, powered by real headless Anki — no Anki desktop window, AnkiConnect, Qt or replacement web server is started. Independent integration, not an official Anki product. Version 1.4.2 bundles the headless core and its Python dependencies for out-of-the-box installation, retaining the native responsive layout.

**Requirements:** Windows x64 and DSH `^0.2.1-rc.2` (verified on **0.2.1-rc.3**; `@deepseek-ai/dsh*` peers are declared as ranges, not exact pins). CPython 3.13.5, official Anki **26.5 / 26.05** headless core and all its Python runtime dependencies are bundled. No separate Anki/Python/pip installation or first-start dependency download is required. Qt is not bundled.

**Install:** Download the `.tgz` asset from the [v1.4.2 release](https://github.com/NanoShiki/dsh-anki/releases/tag/v1.4.2), import through the authenticated DSH plugin manager, leave `ankiPackages` and `pythonPath` empty, then enable and refresh/restart as instructed. Explicit absolute overrides remain supported, with no silent external fallback. Version 2.0.0 renames the package to `@nanoshiki/dsh-anki` and is not published yet; the prebuilt asset below is still the `@local/dsh-anki` 1.4.2 release. The package is not published to npm.

**Upgrade:** wait for sync, disable the plugin and let its Python worker exit, back up the whole data directory, then replace the installed package with the new release archive, keeping the data directory unchanged and clearing old `ankiPackages` / `pythonPath` overrides to select the bundled runtime. Version 2.0.0 renames the package to `@nanoshiki/dsh-anki`, so an `@local/dsh-anki` install is a one-time new-package install; migrating from the older `@local/dsh-anki-workspace` identity is likewise one-time. Never enable two copies together, keep the data directory, and never point `dataDir` at an Anki desktop profile.

**Sync:** credentials are entered only on the owner-only Sync page and stored with Windows current-user DPAPI, bound to the workspace path, with no plaintext fallback. Manual sync runs native collection sync and then native media sync. Automatic sync is on by default and is scheduled by the host. **Every full upload or download waits for explicit confirmation** with a mandatory overwrite warning; AI and automatic sync can never confirm a direction. Both full directions snapshot the local collection, media and media database first — **a local backup cannot restore overwritten cloud data**. Failed or cancelled sync can leave partially completed changes; cancellation is not rollback.

**Operations:** deck create/rename, native note types and search, note/tag editing, card suspension, APKG import and export, and review of a selected deck (including descendants) with Again/Hard/Good/Easy. Deck deletion is owner-only, previews the affected subdecks, cards and orphaned notes, requires the exact full deck name, protects the ID-1 default deck, and cannot be undone by review undo. Media is basename-only and capped at 5 MiB per response; reviewer HTML is script-disabled and sandboxed, and add-ons/custom reviewer JavaScript/MathJax are unsupported.

**Permissions:** AI reads work in read-only mode; mutations, exports, `review.next`, `sync.run` and `sync.cancel` require `danger-full-access`, because the private collection lives outside the conversation workspace. Deck deletion, login/logout, settings and full-sync confirmation expose no AI action at all and require an authenticated owner. Imported notes, templates and page content are untrusted data, never instructions.

**Backups:** disable the plugin, wait for its worker to exit, then copy the entire data directory — not a live SQLite file. Import media writes are not atomically rolled back. A whole-directory copy includes protected account state; do not share it.

**Verification:** automated checks cover isolated native collections, localhost sync services, DPAPI, transport, scheduling, structural client behavior and an isolated Chromium layout fixture. They do not establish that a particular live installation, real AnkiWeb account or cloud connection works. Use your existing authenticated plugin manager and GUI; no replacement server is required. See the [acceptance checklist](<ACCEPTANCE.md>) and [verification record](<VERIFICATION.md>). Licensed [AGPL-3.0-or-later](<LICENSE>), with the [Anki upstream notice](<ANKI-LICENSE.txt>), [third-party notices](<THIRD-PARTY-NOTICES.md>) and [Python license](<runtime/LICENSE.txt>).

**Contributing:** changes are accepted **only through pull requests**; `main` is protected against direct pushes, force pushes and deletion, including for the owner. See [CONTRIBUTING.md](<CONTRIBUTING.md>).
