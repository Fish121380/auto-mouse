# Auto Mouse Plugins

[English README](README.en.md)

本仓库提供 `Little Mouse Pointer`，用于在 Windows 桌面选择窗口、UI 元素或屏幕区域，并将用户确认后的上下文提供给 Codex、DeepSeek Harness 或其他 MCP 客户端。

插件目录为 [`plugins/little-mouse-pointer`](plugins/little-mouse-pointer)。完整功能、协议和运行时说明见插件目录中的 [README](plugins/little-mouse-pointer/README.md)。

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

## 安装前检查

- Windows 10/11 x64。
- 不需要安装 .NET，发行包已经 self-contained。
- 保留 `plugins/little-mouse-pointer/app` 的全部文件。
- 默认端口为 `49153`，endpoint 和 `MOUSE_POINTER_HTTP_PORT` 必须一致。
- Codex/Harness 运行前关闭旧的 Little Mouse Pointer 实例。
- MCP 工具为 `ui_context_pick`、`ui_context_current`、`ui_context_clear`。
