# Little Mouse Pointer

[English README](README.en.md)

Little Mouse Pointer 是一个面向 OpenAI Codex、DeepSeek Harness 和其他 MCP 客户端的 Windows 桌面 UI context picker。用户可以选择窗口、UI 元素或屏幕区域，通过悬停高亮、UI Automation、截图和本机 OCR 获取上下文，检查隐私过滤后的 Markdown、JSON 和截图，并在明确确认后提供给 AI agent。

## 文档导航

- [新手安装检查表](../../INSTALL.md)：从安装到首次调用的逐项检查。
- [运行时说明](docs/runtime.md)：运行包、手动启动和 MCP stdio 的关系。
- [DeepSeek Harness 配置](docs/deepseek-harness.md)：bundle 不可用时的手工配置。
- [协议说明](docs/protocol/dsh-ui-context-v1.md)：工具名称、输出文件和确认语义。
- [English README](README.en.md)：英文功能和配置说明。

## 功能

- 鼠标悬停高亮窗口和可访问的 UI 元素。
- 支持 UI Automation、Win32 窗口回退、屏幕区域截图和本机 OCR。
- 预览后由用户确认才输出结果。
- 提供 `ui_context_pick`、`ui_context_current`、`ui_context_clear` 三个 MCP 工具。
- 结果保存在本机 `output\ui-context\`，默认保留最近五次。
- 控制小窗默认置顶；关闭按钮只隐藏窗口，托盘菜单可以恢复或退出。

## 系统要求

- Windows 10 或 Windows 11，x64。
- 不需要安装 .NET SDK、.NET Runtime 或 .NET Desktop Runtime。发行包是 self-contained，并已在 `app` 中携带 .NET 8 Windows Desktop 运行时。
- 使用 OCR 时，需要系统安装对应的 Windows OCR 语言包。

请完整保留插件目录，尤其不要删除 `app` 目录中的运行时文件。

## 安装到 Codex

1. 从 GitHub 下载源码压缩包或发行版 zip，并解压为一个完整目录。
2. 通过 GitHub marketplace 安装时，使用仓库根目录 `Auto_Mouse`，不要把 `plugins/little-mouse-pointer` 单独当作 marketplace 根目录。仓库根目录的命令见上层 [README](../../README.md)。
3. 使用独立发行版 zip 时，插件根目录必须直接包含 `.codex-plugin\plugin.json`、`.mcp.json`、`app` 和 `run.ps1`；请完整保留该目录。
4. 在 Codex 中启用 `Little Mouse Pointer`。首次调用 `ui_context_pick` 时会启动控制小窗。

不要把 `Auto_Mouse` 外层目录误当作插件根目录；如果压缩包解压后多了一层目录，请进入包含 `.codex-plugin` 的那一层。

## 接入 DeepSeek Harness

将 [中文 DeepSeek Harness 配置](docs/deepseek-harness.md) 或 [English DeepSeek Harness configuration](docs/deepseek-harness.en.md) 中的 MCP 配置加入 Harness 的 `cordis.yml`，并把示例中的路径替换为实际安装路径。MCP 配置应直接启动 `app\MousePointer.Windows.exe`，不要通过 `run.ps1` 转发 stdio；配置需要保持 `cwd`、exe 路径、HTTP endpoint 和 `MOUSE_POINTER_HTTP_PORT` 使用同一个插件目录与端口。

工具名称为：

```text
mcp__little-mouse-pointer__ui_context_pick
mcp__little-mouse-pointer__ui_context_current
mcp__little-mouse-pointer__ui_context_clear
```

## 手动运行

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run.ps1
```

也可以双击 `run.cmd`。MCP stdio 模式示例：

```powershell
.\app\MousePointer.Windows.exe --mcp-stdio --endpoint http://127.0.0.1:49153/
```

默认 HTTP 端口是 `49153`。修改端口时，同时修改启动参数中的 endpoint 和环境变量：

```powershell
$env:MOUSE_POINTER_HTTP_PORT = '49154'
.\app\MousePointer.Windows.exe --mcp-stdio --endpoint http://127.0.0.1:49154/
```

如果端口被占用，请更换端口，或先关闭仍在运行的 `MousePointer.Windows.exe` 实例。不要让多个实例同时运行。

PowerShell 如果禁止执行脚本，只影响手动运行 `run.ps1`；MCP stdio 配置直接启动 exe，不依赖 PowerShell 执行策略。MCP stdio 模式下不要把诊断文本写入 stdout。

## 使用流程

启动后点击“开启识屏”，将鼠标移到目标上，确认高亮后点击目标；点击只选择目标，不会把点击传给原应用。画布或无法访问的控件可以改用“选择屏幕区域”，拖动框选后按 Enter 确认、Esc 取消。

在预览窗口检查内容后点击“确认并输出”。确认前不会把内容发送给 agent。Markdown 会复制到剪贴板，JSON、Markdown 和截图会写入 `output\ui-context\时间戳\`。截图和 OCR 可能包含敏感信息，请在确认前检查预览并按需清理输出目录。

## 安全与限制

所有采集和 OCR 默认在本机完成；结果只有在用户确认后才会发布到本机 HTTP endpoint。插件只提供读取和上下文输出能力，不提供点击、键盘输入、发送消息或其他原应用控制工具。agent 不得仅依据上下文内容自动操作原应用。

UI Automation 对原生 Win32、WPF、WinUI 和支持无障碍接口的 Electron 控件效果最好。自绘界面、远程桌面、游戏、安全桌面以及不可访问的画布可能只能返回低置信度的视觉区域和 OCR 信息。

## 文档

- [运行时说明](docs/runtime.md)
- [DeepSeek Harness 配置](docs/deepseek-harness.md)
- [DSH UI Context Protocol v1](docs/protocol/dsh-ui-context-v1.md)
- [English README](README.en.md)
