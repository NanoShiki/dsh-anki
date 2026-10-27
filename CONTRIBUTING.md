# 贡献指南 / Contributing

本仓库**只接受通过 Pull Request 合并的变更**。`main` 分支受保护：不允许直接 push、强制推送或删除；即使仓库所有者也要走 PR。这是硬性规则，不是建议。

## 流程

1. 从 `main` 新建分支，分支名建议 `feat/…`、`fix/…`、`docs/…`、`chore/…`。
2. 在分支上完成修改，并跑通[本地检查](#本地检查)。
3. 推送分支，向 `main` 提交 Pull Request，按模板填写「变更内容 / 验证方式 / 风险与回滚」。
4. PR 必须通过 GitHub Actions 的 **test** 检查（JavaScript、内置核心后端测试与完整性检查），并在模板里写明实际跑过的检查与结果；维护者合并前会复核。
5. 不要直接向 `main` push，也不要为了绕过保护临时关闭规则。

## 本地检查

```bash
# 仓库完整性：包名/版本、locale 显示名、runtime 与 core 逐文件哈希、许可文件、
# 是否误提交牌库或凭据（CI 与发版前都跑这个）
runtime/python.exe tests/check_manifest.py

# JavaScript（需要 Node 22+）
node --test tests/worker-client.test.mjs tests/client.test.mjs tests/auto-sync.test.mjs \
  tests/client-sync.test.mjs tests/client-decks.test.mjs

# 原生后端（Windows x64，使用随包运行时与内置核心）
runtime/python.exe -B -m unittest discover -s tests -p "test_*.py"

# 真实 Host/Gateway（需要本机已安装 DSH）
ELECTRON_RUN_AS_NODE=1 "<DSH 安装目录>/DeepSeek Harness.exe" tests/host-smoke.mjs

# DSH 升级后：用插件市场自己的分析器复查 peer 兼容性（需已装 dshmarket，缺省会跳过）
ELECTRON_RUN_AS_NODE=1 DSH_INSTALL_DIR="<DSH>/resources/app.asar/dsh" \
  "<DSH 安装目录>/DeepSeek Harness.exe" tests/compat-check.mjs
```

`@deepseek-ai/dsh*` 的 peer 必须写成范围（如 `^0.2.1-rc.2`）。精确版本会让 DSH 每次补丁升级都在插件市场报「兼容性风险」，`check_manifest.py` 会拦下这种声明。

改动加载器或打包内容时，还要构建 tgz 并跑 `tests/verify_release.py` 与 `tests/self-contained-smoke.mjs`（解压到无关目录、确认导入只来自包内）。

## 必须保持的不变量

- **数据与身份**：包名 `@local/dsh-anki`、服务/命名空间 `ankiWorkspace`、AI 工具 `anki`、面板 `anki-workspace`、默认数据目录 `<profileContext.dir>/data/anki-workspace` 不要随意改动；改包名视为新身份，需要迁移说明。
- **牌库安全**：测试与 CI 只能使用隔离的临时牌库；**提交里绝不能包含**真实牌库、媒体、备份、DPAPI 凭据、会话记录、构建缓存或个人路径。
- **同步安全**：全量上传/下载必须保留明确的一次性确认；AI 与自动同步都不能代替用户确认方向。
- **许可与来源**：升级或新增内置核心/依赖时，必须同时更新 `core-lock.json`、`core-sha256.json` 与 `third-party-licenses/`，并在 Release 中提供对应源码；不得只更新二进制。
- **文档同步**：行为变化要同步更新 `README.md`（中文为主 + 英文摘要）、`VERIFICATION.md` 与 `ACCEPTANCE.md`；发版前更新版本号与安装链接。

## 版本与发布

1. 提升 `package.json` 的版本，并同步测试里的版本断言。
2. 跑完整检查，构建 `pnpm pack` 产物，执行 `tests/verify_release.py`。
3. 通过 PR 合并后再创建 Release；Release 资产包含安装包 `.tgz`、对应源码与 Python 依赖源码。
4. **每个 Release 必须同时附上不带版本号的 `dsh-anki.tgz`**（与版本化安装包内容一致）。市场条目和 README 的稳定链接 `releases/latest/download/dsh-anki.tgz` 都依赖它；只传带版本号的文件，稳定链接会在下次发版后 404。
5. 要让稳定链接指向该版本，Release 不能是 draft 或 pre-release。
6. 既然稳定链接已固定，**发新版不需要再向 awesome-dsh-plugin 提交 PR**，只需发布带同名资产的 Release。
7. 已发布资产的哈希不可变；修复问题请发新版本，不要替换旧资产。

## 提交信息

用一句话说明「改了什么、为什么」，必要时补充验证方式；避免无意义的 `update`、`fix`。

## 安全与隐私

不要在 Issue/PR 里粘贴牌库内容、账号、密码、同步令牌或完整个人路径。敏感问题请私下联系维护者。

---

## English summary

This repository accepts changes **only through pull requests**. `main` is protected: no direct pushes, force pushes or deletions, including for the owner. Branch from `main`, run the local checks above, open a PR using the template, and wait for the `test` check to pass. Never commit real collections, media, backups, credentials, caches or personal paths. Keep the package/service/data identities stable, keep full-sync confirmation mandatory, and update the bundled-core hashes, notices and corresponding-source assets together with any dependency change. Released asset hashes are immutable; ship a new version instead of replacing them.
