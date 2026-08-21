# 新手教程

[English tutorial](getting-started.en.md)

Little Mouse Pointer 是一个只读的 Windows 桌面 UI context picker。它让 agent 在用户确认后读取窗口、UI 元素或屏幕区域；它不会替用户点击、输入、发送消息或控制原应用。

## 开始前

- Windows 10 或 Windows 11，x64。
- 不需要安装 .NET SDK、.NET Runtime 或 .NET Desktop Runtime，发行包已经自带运行时。
- 使用 OCR 时，需要安装对应语言的 Windows OCR 语言包。
- 只保留一个 Little Mouse Pointer 实例运行。旧实例可能占用端口或全局鼠标钩子。

## 选择一种接入方式

普通 Codex 用户使用 Codex 安装；使用 DeepSeek Harness 的用户优先使用 Harness bundle。不要同时为同一个 profile 配置两份 MCP server，否则它们可能竞争同一个端口。

## 安装到 Codex

在 PowerShell 中执行：

```powershell
codex plugin marketplace add Fish121380/auto-mouse --ref main
codex plugin add little-mouse-pointer@auto-mouse
codex plugin list
```

确认列表中出现 `little-mouse-pointer@auto-mouse`，状态为 `installed, enabled`。然后开始一个新 task，要求 agent 调用 `ui_context_pick`。

如果使用独立 release zip，解压后要保留直接包含下列内容的目录：

```text
little-mouse-pointer\
  .codex-plugin\plugin.json
  .mcp.json
  app\
  run.ps1
```

GitHub checkout 和独立 zip 的目录层级不同：checkout 中插件根目录是 `Auto_Mouse\plugins\little-mouse-pointer`，zip 中插件根目录是直接包含 `.codex-plugin` 的 `little-mouse-pointer`。不要把外层解压目录当成插件根目录。

## 安装到 DeepSeek Harness

推荐安装仓库根目录提供的 bundle：

```powershell
dsh plugin --profile demo add github:Fish121380/auto-mouse#v0.1.1
dsh --profile demo --dump-config
```

启动 Harness 后应发现以下工具：

```text
mcp__little-mouse-pointer__ui_context_pick
mcp__little-mouse-pointer__ui_context_current
mcp__little-mouse-pointer__ui_context_clear
```

如果当前 Harness 版本或 profile 不支持仓库根目录 bundle，请按照 [DeepSeek Harness 手工配置](deepseek-harness.md) 添加 MCP client。`command` 必须直接指向 `app\MousePointer.Windows.exe`，不要把 `run.ps1` 当作 MCP stdio bridge。

## 第一次选取

1. 在 agent 中调用 `ui_context_pick`。
2. 插件会打开控制小窗。它默认保持置顶，但如果 Codex 或其他应用处于全屏状态，窗口可能暂时被全屏窗口遮住；使用 `Alt+Tab`、任务栏或托盘图标切换到 Little Mouse Pointer。
3. 点击“开启识屏”，将鼠标移到目标上，确认目标出现高亮。
4. 点击目标。这个点击只用于选择，不会传递给原应用。
5. 如果目标是画布、视频或无法访问的自绘控件，选择“选择屏幕区域”，拖动框选区域后按 Enter 确认，按 Esc 取消。
6. 在预览窗口检查 Markdown、JSON 和截图，确认内容没有不应分享的敏感信息。
7. 点击“确认并输出”。确认前，内容不会提供给 agent。

一次选取的 JSON、Markdown 和截图会写入本机 `output\ui-context\时间戳\`。Markdown 也会复制到剪贴板。默认只保留最近五次结果。

## 结果和隐私

采集、截图和 OCR 默认都在本机完成。结果只有在用户点击确认后，才通过本机 HTTP endpoint 提供给 MCP client。截图和 OCR 可能包含密码、令牌、聊天内容或其他敏感信息；确认前请检查预览，使用后按需清理 `output\ui-context\`。

## 常见问题

### 找不到 MCP 工具

确认插件已启用，完整保留 `app` 目录，并确认 Harness 的 `command` 直接指向 `MousePointer.Windows.exe`。MCP stdio 模式下不要把诊断文字写入 stdout；本插件的诊断会写入 stderr。

### 控制窗口看不见

先使用 `Alt+Tab` 或托盘菜单恢复窗口。全屏 Codex、远程桌面和某些安全桌面可能遮挡普通桌面窗口。确认后仍无法显示时，关闭旧的 `MousePointer.Windows.exe` 实例，再重新调用 `ui_context_pick`。

### 悬停没有高亮或按钮没有反应

关闭所有旧实例，确认运行的是完整发行目录中的 exe，而不是只复制了一个 DLL 或脚本。手动运行时可以执行：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run.ps1 -SelfTest
```

原生 Win32、WPF、WinUI 和支持无障碍接口的 Electron 控件通常能提供较准确的 UI Automation 信息。自绘界面、游戏、远程桌面和安全桌面可能只能返回低置信度的视觉区域和 OCR 信息。

### 端口被占用

默认端口是 `49153`。更换端口时，必须同时修改启动参数中的 endpoint 和 `MOUSE_POINTER_HTTP_PORT`：

```powershell
$env:MOUSE_POINTER_HTTP_PORT = '49154'
.\app\MousePointer.Windows.exe --mcp-stdio --endpoint http://127.0.0.1:49154/
```

### 选择超时

调用后需要在控制小窗中完成选择、预览和确认。若在等待期限内没有确认，工具会返回 selection timeout；重新调用 `ui_context_pick` 即可再次开始。

## 卸载

Codex 中运行：

```powershell
codex plugin remove little-mouse-pointer@auto-mouse
```

DeepSeek Harness 中从对应 profile 移除 bundle：

```powershell
dsh plugin --profile demo remove dsh-little-mouse-pointer
```

如果手工配置过 MCP client，也要从对应的 `cordis.yml` 或 profile patch 中删除该配置，并按需清理输出目录。

## 继续阅读

- [安装检查表](../../../INSTALL.md)
- [运行时说明](runtime.md)
- [DeepSeek Harness 配置](deepseek-harness.md)
- [DSH UI Context Protocol v1](protocol/dsh-ui-context-v1.md)
