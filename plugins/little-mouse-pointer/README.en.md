# Little Mouse Pointer

[中文 README](README.md)

Little Mouse Pointer is a Windows desktop UI context picker for OpenAI Codex, DeepSeek Harness, and other MCP-compatible clients. Select a window, UI element, or screen region with hover highlighting, UI Automation, screenshots, and local OCR; review privacy-filtered Markdown, JSON, and screenshots; then explicitly approve the context before it is provided to an AI agent over MCP stdio.

## Documentation

- [Getting started tutorial](docs/getting-started.en.md): installation, first selection, and common problems.
- [Beginner installation checklist](../../INSTALL.en.md): verify installation through the first tool call.
- [Runtime notes](docs/runtime.en.md): the packaged runtime, manual startup, and MCP stdio.
- [DeepSeek Harness configuration](docs/deepseek-harness.en.md): manual configuration when the bundle is unavailable.
- [Protocol reference](docs/protocol/dsh-ui-context-v1.en.md): tool names, output files, and approval semantics.
- [中文 README](README.md)：中文功能与配置说明。

## Features

- Highlights windows and accessible UI elements under the pointer.
- Supports UI Automation, Win32 fallback, screen-region capture, and local OCR.
- Requires user review and approval before output.
- Provides `ui_context_pick`, `ui_context_current`, and `ui_context_clear`.
- Stores results locally under `output\ui-context\`, keeping the newest five by default.
- Uses a topmost control window; closing it hides it, while the tray menu can restore or exit.

## Requirements

- Windows 10 or Windows 11, x64.
- No .NET SDK, .NET Runtime, or .NET Desktop Runtime installation is required. The release is self-contained and includes the .NET 8 Windows Desktop runtime in `app`.
- The matching Windows OCR language pack is needed for OCR.

Keep the complete plugin directory, especially the runtime files under `app`.

## Install in Codex

1. Download the GitHub source archive or release zip and extract the complete directory.
2. For GitHub marketplace installation, use the repository root `Auto_Mouse`; do not use `plugins/little-mouse-pointer` as the marketplace root. See the repository [README](../../README.en.md) for the commands.
3. For the standalone release zip, the plugin root must directly contain `.codex-plugin\plugin.json`, `.mcp.json`, `app`, and `run.ps1`; keep the complete directory.
4. Enable `Little Mouse Pointer` in Codex. The control window starts when `ui_context_pick` is called.

Do not select an outer wrapper directory as the plugin root. If extraction creates an extra directory level, use the directory that contains `.codex-plugin`.

## Connect to DeepSeek Harness

Add the MCP configuration from [English DeepSeek Harness configuration](docs/deepseek-harness.en.md) or [中文配置](docs/deepseek-harness.md) to the Harness `cordis.yml`, replacing the example paths with the actual installation path. The MCP configuration must start `app\MousePointer.Windows.exe` directly instead of forwarding stdio through `run.ps1`; keep `cwd`, the executable path, the HTTP endpoint, and `MOUSE_POINTER_HTTP_PORT` aligned to the same directory and port.

The tool names are:

```text
mcp__little-mouse-pointer__ui_context_pick
mcp__little-mouse-pointer__ui_context_current
mcp__little-mouse-pointer__ui_context_clear
```

## Run manually

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run.ps1
```

You can also double-click `run.cmd`. MCP stdio example:

```powershell
.\app\MousePointer.Windows.exe --mcp-stdio --endpoint http://127.0.0.1:49153/
```

The default HTTP port is `49153`. When changing it, change both the endpoint and the environment variable:

```powershell
$env:MOUSE_POINTER_HTTP_PORT = '49154'
.\app\MousePointer.Windows.exe --mcp-stdio --endpoint http://127.0.0.1:49154/
```

If the port is occupied, choose another port or close the running `MousePointer.Windows.exe` instance first. Do not run multiple instances at once.

If PowerShell blocks scripts, that only affects manual `run.ps1` use; the MCP stdio configuration starts the executable directly. In MCP stdio mode, diagnostics must not be written to stdout.

## User flow

Start the executable and click “Enable screen inspection”. Move the pointer to the target, verify the highlight, and click the target. The click selects the target without forwarding it to the original application. For canvas content or inaccessible controls, choose “Pick screen region”, drag a rectangle, then press Enter to confirm or Esc to cancel.

Review the filtered content in the preview window and click “Confirm and output”. Nothing is sent to the agent before approval. Markdown is copied to the clipboard, while JSON, Markdown, and screenshots are written to `output\ui-context\timestamp\`. Screenshots and OCR may contain sensitive information; inspect the preview before approval and clear the output directory when needed.

## Privacy and safety

All capture and OCR are performed locally by default. Results are published to the local HTTP endpoint only after user approval. The plugin provides context-reading and output capabilities only; it does not provide click, typing, message-sending, or other original-application control tools. An agent must not operate the original application solely from context text.

Windows UI Automation is strongest for native Win32, WPF, WinUI, and accessible Electron controls. Self-drawn surfaces, remote desktops, games, secure desktops, and inaccessible canvases may only return low-confidence visual-region and OCR information.

## Documentation

- [Runtime notes](docs/runtime.en.md)
- [DeepSeek Harness configuration](docs/deepseek-harness.en.md)
- [DSH UI Context Protocol v1](docs/protocol/dsh-ui-context-v1.en.md)
- [中文 README](README.md)

## Performance and output history

Each approved result is written to its own `output/ui-context/timestamp/` directory. The default history keeps the newest five results; `0` or `-1` keeps all results. An output notification opens the specific result directory only after the user clicks it.
