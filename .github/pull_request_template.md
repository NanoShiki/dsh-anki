## 变更内容

<!-- 做了什么、为什么，关联 Issue 编号（如有）。 -->

## 验证方式

<!-- 勾选实际跑过的检查，并写明结果；未跑请说明原因。 -->

- [ ] `node --test` JavaScript 测试（82 项）
- [ ] `runtime/python.exe -B -m unittest discover -s tests -p "test_*.py"`（39 项）
- [ ] `tests/host-smoke.mjs`（真实 Host/Gateway）
- [ ] 打包后 `tests/verify_release.py` 与 `tests/self-contained-smoke.mjs`（改动加载器/打包时）
- [ ] 文档已同步（README / VERIFICATION / ACCEPTANCE）

## 风险与回滚

<!-- 影响面：牌库数据、同步、权限、兼容性或包身份。如何回滚？ -->

## 合规确认

- [ ] 未包含真实牌库、媒体、备份、凭据、会话记录、构建缓存或个人路径
- [ ] 若改动内置核心/依赖：已同步 `core-lock.json`、`core-sha256.json`、`third-party-licenses/`，并在 Release 中提供对应源码
- [ ] 若提升版本：测试版本断言、README 安装链接与 Release 资产已同步
