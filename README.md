# Little Mouse Pointer

[English README](README.en.md)

本仓库提供 `Little Mouse Pointer`：一个面向 AI agent 的 Windows 桌面 UI context picker。用户可以用鼠标选择窗口、UI 元素或屏幕区域，通过 UI Automation、截图和本机 OCR 获取上下文，并在确认后通过 MCP 提供给 OpenAI Codex、DeepSeek Harness 或其他兼容客户端。

插件目录为 [`plugins/little-mouse-pointer`](plugins/little-mouse-pointer)。完整功能、协议和运行时说明见插件目录中的 [README](plugins/little-mouse-pointer/README.md)。

## 文档导航

- [新手教程](plugins/little-mouse-pointer/docs/getting-started.md)：第一次安装、首次选取和常见问题的完整流程。
- [新手安装检查表](INSTALL.md)：按 Codex、DeepSeek Harness 和手动运行场景逐项确认。
- [插件完整 README](plugins/little-mouse-pointer/README.md)：功能、使用流程、隐私限制和故障边界。
- [运行时说明](plugins/little-mouse-pointer/docs/runtime.md)：self-contained 运行包、`run.ps1` 和 MCP stdio 行为。
- [DeepSeek Harness 配置](plugins/little-mouse-pointer/docs/deepseek-harness.md)：bundle 不可用时的手工 Cordis 配置。
- [协议说明](plugins/little-mouse-pointer/docs/protocol/dsh-ui-context-v1.md)：工具输出字段和确认流程。

## 从 GitHub 安装到 Codex

在 PowerShell 中执行下面的命令，把 `OWNER/REPOSITORY` 替换成实际 GitHub 仓库：

```powershell
codex plugin marketplace add OWNER/REPOSITORY --ref main
codex plugin add little-mouse-pointer@auto-mouse
```

如果只需要下载插件目录，可以使用 GitHub release zip，或在本地安装 `plugins/little-mouse-pointer` 这一层。不要把仓库根目录误当成直接插件根目录。

## 接入 DeepSeek Harness

复制 [中文安装检查表](INSTALL.md) 或 [English installation checklist](INSTALL.en.md)，再参考 [DeepSeek Harness 配置](plugins/little-mouse-pointer/docs/deepseek-harness.md)，把路径改成实际目录。MCP stdio 必须直接启动：

```text
plugins/little-mouse-pointer/app/MousePointer.Windows.exe
```

不要通过 `run.ps1` 作为 MCP stdio bridge；`run.ps1` 只用于手动启动 GUI 和 self-test。

### 从 GitHub 直接安装 Harness bundle

仓库根目录同时提供符合 Harness `dsh.bundle` 规范的安装包。建议固定发行版 tag：

```powershell
dsh plugin --profile demo add github:Fish121380/auto-mouse#v0.1.1
dsh --profile demo --dump-config
```

该 bundle 会自动定位自己携带的 Windows x64 exe，并注册 `@deepseek-ai/dsh-mcp-client`。它只适用于 Windows x64；端口可在 profile 的 `cordis.patch.yml` 中覆盖：

```yaml
- replace:
    - id: little-mouse-pointer
      config:
        port: 49154
```

## 安装前检查

- Windows 10/11 x64。
- 不需要安装 .NET，发行包已经 self-contained。
- 保留 `plugins/little-mouse-pointer/app` 的全部文件。
- 默认端口为 `49153`，endpoint 和 `MOUSE_POINTER_HTTP_PORT` 必须一致。
- Codex/Harness 运行前关闭旧的 Little Mouse Pointer 实例。
- MCP 工具为 `ui_context_pick`、`ui_context_current`、`ui_context_clear`。
