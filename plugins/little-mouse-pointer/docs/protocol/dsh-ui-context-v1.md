# DSH UI Context Protocol v1

[English protocol](dsh-ui-context-v1.en.md)

Little Mouse Pointer 使用本机 HTTP endpoint 提供 UI context 数据，并通过 MCP stdio bridge 暴露工具。协议只用于读取用户明确选择并确认的桌面上下文。

## MCP 工具

### `ui_context_pick`

打开或恢复置顶控制小窗，等待用户选择窗口、UI 元素或屏幕区域，并等待用户在预览中确认。成功后返回本次输出目录中的 JSON、Markdown、截图和文件信息。可选参数 `timeoutMs` 的范围是 `1000` 到 `600000` 毫秒；未提供时使用客户端默认值。

### `ui_context_current`

返回最近一次已经确认的上下文结果，以及该结果的权威输出目录。没有可用结果时返回明确的空结果或错误状态。

### `ui_context_clear`

清除最近一次结果的引用。它不会删除用户磁盘上的历史文件，历史文件请由用户自行管理。

## 结果处理

优先使用工具结果中的 `json` 和 `markdown` 字段。读取截图或其他附件时，必须使用工具返回的完整输出文件夹路径。调用方不得根据时间戳、当前工作目录或文件名自行猜测输出路径。

结果可能来自 Windows UI Automation、Win32 窗口信息、屏幕区域视觉信息或本机 OCR。调用方应根据结果中的 `source` 和 `confidence` 描述确定程度；视觉推断和 OCR 不应被表述为精确 UI Automation 控件信息。

## 用户确认与安全

选择、预览和最终输出都由用户在桌面控制小窗中完成。截图、OCR 文本、窗口标题和控件值可能包含敏感信息，调用方应把它们视为用户提供的数据。

本协议不提供点击、输入、发送消息、拖动或其他原应用控制能力。调用方不得仅根据上下文文本自动操作原应用；任何后续操作都必须得到用户明确请求。

## 连接约束

- endpoint 默认是 `http://127.0.0.1:49153/`。
- `MOUSE_POINTER_HTTP_PORT` 必须与 endpoint 端口一致。
- MCP stdio stdout 只传输 JSON-RPC 数据；启动诊断写入 stderr。兼容客户端应直接启动 `app/MousePointer.Windows.exe`，不要通过 PowerShell `run.ps1` 转发 stdin。
- 输出目录以工具返回值为准，不应被当作固定路径协议。
