# Third-party notices / 第三方许可说明

## This integration / 本集成

The DSH Anki Workspace source is licensed under **GNU AGPL version 3 or later**, with the full license in [LICENSE](<LICENSE>). Source files are shipped in the package; preserve notices and provide corresponding source when required, including applicable network-use obligations. This integration is independent and is not endorsed by the Anki or DSH projects. A local subprocess or RPC boundary is not an exemption from licensing obligations.

本集成源代码采用 GNU AGPL 第 3 版或更新版本，完整文本见上述链接。分发时保留许可说明，并按适用条款提供对应源代码；网络使用相关义务同样需要考虑。独立进程或 RPC 边界不自动免除许可义务。

## Anki core — external dependency / 外部依赖

- Compatible installed release: **26.05**, build `e64c6b1a`, source commit `e64c6b1aee3e8d668fb8bbe084beada8e070d985`.
- Source: https://github.com/ankitects/anki/tree/e64c6b1aee3e8d668fb8bbe084beada8e070d985
- Project: https://apps.ankiweb.net
- Core binaries and their dependency trees are **not bundled** here. This package loads the user's separately installed `app_packages` directory, by default `D:/Anki/app_packages`.
- [ANKI-LICENSE.txt](<ANKI-LICENSE.txt>) is an exact copy of the inspected upstream license notice. Anki is AGPL-3.0-or-later, with specified BSD-3 contributions and other separately licensed components. Refer to the pinned source's LICENSE/CONTRIBUTORS and the installed distribution's notices for the complete component/dependency information. Do not assume this notice replaces them.
- Anki's trademark/logo rights remain with their respective owners; this integration does not redistribute Anki's logo.

Anki 核心为独立安装的外部依赖，未打包进本插件。随附上游说明为原样副本；其各项例外、贡献者及二进制依赖许可仍以对应版本上游和安装发行包为准。未来若重新分发核心或其依赖，必须另行完整审查并履行义务，不能仅凭本说明。

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
