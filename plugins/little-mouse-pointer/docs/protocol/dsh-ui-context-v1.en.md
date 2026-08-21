# DSH UI Context Protocol v1

[中文协议](dsh-ui-context-v1.md)

Little Mouse Pointer uses a local HTTP endpoint for UI context data and exposes the tools through MCP stdio. The protocol covers only desktop context that the user explicitly selects and approves.

## MCP Tools

### `ui_context_pick`

Opens or restores the topmost control window, waits for the user to select a window, UI element, or screen region, and waits for preview approval. On success, it returns JSON, Markdown, screenshots, and file information from the output directory for that confirmed selection. The optional `timeoutMs` range is `1000` to `600000` milliseconds; when omitted, the client default is used.

### `ui_context_current`

Returns the latest approved context and its authoritative output directory. When no approved result exists, it returns an explicit empty result or error state.

### `ui_context_clear`

Clears the latest result reference. It does not delete history files from disk; users manage those files separately.

## Result Handling

Prefer the `json` and `markdown` fields in the tool result. When reading screenshots or other attachments, use the complete output directory returned by the tool. Callers must not infer an output path from a timestamp, current working directory, or filename.

Results may come from Windows UI Automation, Win32 window information, visual screen-region analysis, or local OCR. Describe certainty using the returned `source` and `confidence` fields. Visual inference and OCR must not be described as exact UI Automation control data.

## User Approval and Safety

Selection, preview, and final output approval are performed by the user in the desktop control window. Screenshots, OCR text, window titles, and control values may contain sensitive information and must be treated as user-provided data.

The protocol does not provide click, typing, message-sending, dragging, or other original-application control operations. A caller must not operate the original application based only on context text; any follow-up operation requires an explicit user request.

## Connection Constraints

- The default endpoint is `http://127.0.0.1:49153/`.
- `MOUSE_POINTER_HTTP_PORT` must use the same port as the endpoint.
- MCP stdout carries JSON-RPC only. Startup diagnostics go to stderr. Compatible clients must start `app/MousePointer.Windows.exe` directly instead of forwarding stdin through `run.ps1`.
- The output directory is defined by the tool result and is not a fixed protocol path.
