# Third-party notices / 第三方许可说明

## This integration / 本集成

The DSH Anki Workspace source is licensed under **GNU AGPL version 3 or later**, with the full license in [LICENSE](<LICENSE>). Source files are shipped in the package; preserve notices and provide corresponding source when required, including applicable network-use obligations. This integration is independent and is not endorsed by the Anki or DSH projects. A local subprocess or RPC boundary is not an exemption from licensing obligations.

本集成源代码采用 GNU AGPL 第 3 版或更新版本，完整文本见上述链接。分发时保留许可说明，并按适用条款提供对应源代码；网络使用相关义务同样需要考虑。独立进程或 RPC 边界不自动免除许可义务。

## Anki core — bundled / 随附

- Bundled official PyPI wheel: **anki 26.5**, Windows x64 CPython abi3 (runtime reports **26.05**), source commit `e64c6b1aee3e8d668fb8bbe084beada8e070d985`.
- Source: https://github.com/ankitects/anki/tree/e64c6b1aee3e8d668fb8bbe084beada8e070d985
- Project: https://apps.ankiweb.net
- The unmodified core wheel and its Python runtime dependency closure are included under [core](<core/>). No `aqt`, Qt, Anki desktop program or user collection is bundled. Official artifact URLs, versions and SHA-256 are pinned in [core-lock.json](<core-lock.json>); extracted files in [core-sha256.json](<core-sha256.json>).
- [ANKI-LICENSE.txt](<ANKI-LICENSE.txt>) is an exact copy of the inspected upstream license notice. Anki is AGPL-3.0-or-later, with specified BSD-3 contributions and other separately licensed components. Refer to the pinned source's LICENSE/CONTRIBUTORS and the installed distribution's notices for the complete component/dependency information. Do not assume this notice replaces them.
- Anki's trademark/logo rights remain with their respective owners; this integration does not redistribute Anki's logo.

Anki 核心及其运行依赖随本插件分发，未修改上游 wheel 内容。对应源码（含固定提交、翻译子模块、锁定的 Rust 依赖和构建说明）与 Python 依赖源码在同一 [v1.4.1 Release](https://github.com/NanoShiki/dsh-anki/releases/tag/v1.4.1) 提供，无需额外账号或费用。源码包不是安装前置项；普通用户只需要插件 `.tgz`。源码提供不表示已经完成可复现的逐位重建。

### Bundled Python dependencies / Python 依赖

All wheel metadata, RECORD files, copyright/license texts and applicable NOTICE files are retained unchanged. The following is an index, not a replacement for those texts or the source archives:

| Distribution | Version | License |
| --- | --- | --- |
| decorator | 5.3.1 | BSD-2-Clause |
| Markdown | 3.10.2 | BSD-3-Clause |
| orjson | 3.11.9 | MPL-2.0 AND (Apache-2.0 OR MIT) |
| protobuf | 7.35.1 | BSD-3-Clause |
| requests | 2.34.2 | Apache-2.0 |
| typing_extensions | 4.15.0 | PSF-2.0 |
| charset-normalizer | 3.4.7 | MIT |
| idna | 3.18 | BSD-3-Clause |
| urllib3 | 2.7.0 | MIT |
| certifi | 2026.5.20 | MPL-2.0 |
| PySocks | 1.7.1 | BSD (see included license) |

Anki's native Rust library also contains separately licensed Rust/native dependencies. Their license/notice texts are preserved in [third-party-licenses/ANKI-NATIVE-NOTICES.txt](<third-party-licenses/ANKI-NATIVE-NOTICES.txt>), and their sources plus build instructions are in the corresponding-source release. Python native extension notices are in [third-party-licenses/PYTHON-NATIVE-NOTICES.txt](<third-party-licenses/PYTHON-NATIVE-NOTICES.txt>). These are not covered by Anki's AGPL or by the Python-only table above; the MPL-covered sources (including certifi and orjson components) are available in the dependency source archives in that release.

## CPython 3.13.5 — bundled / 随附

The package includes the official Windows x64 embeddable CPython **3.13.5** runtime. Its complete license and third-party notices are retained in [runtime/LICENSE.txt](<runtime/LICENSE.txt>), including the Python Software Foundation license and applicable historical/component notices. Keep that file with any redistributed runtime.

Official artifact: https://www.python.org/ftp/python/3.13.5/python-3.13.5-embed-amd64.zip

随附官方 Windows x64 嵌入式 CPython 3.13.5；完整 Python/第三方许可保留在上述文件，分发时不得省略。

## DSH and JavaScript dependencies / DSH 与 JavaScript 依赖

The plugin integrates with the installed DSH Host and client APIs. The package manifest declares `@deepseek-ai/schemastery` and DSH tools/Typert peer APIs; those dependencies retain their own licenses and notices. The existing DSH application and its dependency tree are not copied into this plugin. Refer to the actual resolved dependency distributions for their terms before redistribution.

## License text provenance / 许可文本来源

The full AGPL text in [LICENSE](<LICENSE>) was obtained from the SPDX license-list data mirror for `AGPL-3.0-or-later`:
https://raw.githubusercontent.com/spdx/license-list-data/main/text/AGPL-3.0-or-later.txt

Canonical GNU reference: https://www.gnu.org/licenses/agpl-3.0.html

These notices describe known included/external components, not a claim that every possible transitive dependency is licensed identically or that no further obligations apply.
