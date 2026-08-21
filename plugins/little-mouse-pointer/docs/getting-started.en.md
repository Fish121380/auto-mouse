# Getting Started

[中文新手教程](getting-started.md)

Little Mouse Pointer is a read-only Windows desktop UI context picker. It lets an agent read a window, UI element, or screen region after the user approves it; it does not click, type, send messages, or control the original application.

## Before you start

- Windows 10 or Windows 11, x64.
- No .NET SDK, .NET Runtime, or .NET Desktop Runtime installation is required; the release includes its runtime.
- OCR requires the matching Windows OCR language pack.
- Keep only one Little Mouse Pointer instance running. Older instances can hold the port or global mouse hooks.

## Choose one integration

Use the Codex installation for Codex. For DeepSeek Harness, prefer the Harness bundle. Do not configure two MCP servers for the same profile, because they may compete for the same port.

## Install in Codex

Run these commands in PowerShell:

```powershell
codex plugin marketplace add Fish121380/auto-mouse --ref main
codex plugin add little-mouse-pointer@auto-mouse
codex plugin list
```

Confirm that `little-mouse-pointer@auto-mouse` is listed as `installed, enabled`. Start a new task and ask the agent to call `ui_context_pick`.

For a standalone release zip, keep the directory that directly contains:

```text
little-mouse-pointer\
  .codex-plugin\plugin.json
  .mcp.json
  app\
  run.ps1
```

A GitHub checkout and a standalone zip have different directory levels. In a checkout, the plugin root is `Auto_Mouse\plugins\little-mouse-pointer`; in a zip, it is the `little-mouse-pointer` directory that directly contains `.codex-plugin`. Do not use an outer extraction directory as the plugin root.

## Install in DeepSeek Harness

Install the bundle from the repository root:

```powershell
dsh plugin --profile demo add github:Fish121380/auto-mouse#v0.1.1
dsh --profile demo --dump-config
```

After starting Harness, it should discover:

```text
mcp__little-mouse-pointer__ui_context_pick
mcp__little-mouse-pointer__ui_context_current
mcp__little-mouse-pointer__ui_context_clear
```

If the installed Harness version or profile does not support repository-root bundles, add the MCP client from [DeepSeek Harness manual configuration](deepseek-harness.en.md). `command` must point directly to `app\MousePointer.Windows.exe`; do not use `run.ps1` as the MCP stdio bridge.

## Make your first selection

1. Call `ui_context_pick` from the agent.
2. The plugin opens its control window. It is topmost by default, but a full-screen Codex or another full-screen application can temporarily cover it; use `Alt+Tab`, the taskbar, or the tray icon to bring Little Mouse Pointer forward.
3. Click “Enable screen inspection”, move the pointer over the target, and verify the highlight.
4. Click the target. This click selects the target and is not forwarded to the original application.
5. For a canvas, video, or inaccessible custom-drawn control, choose “Pick screen region”, drag a rectangle, press Enter to confirm, or press Esc to cancel.
6. Review the Markdown, JSON, and screenshot in the preview. Remove or avoid approving sensitive information.
7. Click “Confirm and output”. The context is not made available to the agent before approval.

Each selection writes JSON, Markdown, and screenshots to `output\ui-context\timestamp\` on the local machine. Markdown is also copied to the clipboard. The default history keeps the newest five results.

## Results and privacy

Capture, screenshots, and OCR are performed locally by default. A result is provided to the MCP client through the local HTTP endpoint only after the user approves it. Screenshots and OCR may contain passwords, tokens, chat content, or other sensitive information; review the preview before approval and clear `output\ui-context\` when needed.

## Common problems

### MCP tools are missing

Confirm that the plugin is enabled, keep the complete `app` directory, and make sure the Harness `command` points directly to `MousePointer.Windows.exe`. In MCP stdio mode, diagnostic text must not be written to stdout; this plugin writes diagnostics to stderr.

### The control window is not visible

Use `Alt+Tab` or the tray menu to restore it. Full-screen Codex, remote desktop sessions, and some secure desktops can cover ordinary desktop windows. If it still does not appear, close old `MousePointer.Windows.exe` instances and call `ui_context_pick` again.

### Hover highlighting or buttons do not work

Close every old instance and confirm that you are running the executable from the complete release directory rather than copying a DLL or script alone. For a manual check, run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\run.ps1 -SelfTest
```

Native Win32, WPF, WinUI, and accessible Electron controls usually provide the most accurate UI Automation data. Self-drawn surfaces, games, remote desktops, and secure desktops may only return lower-confidence visual-region and OCR data.

### The port is already in use

The default port is `49153`. When changing it, update both the endpoint argument and `MOUSE_POINTER_HTTP_PORT`:

```powershell
$env:MOUSE_POINTER_HTTP_PORT = '49154'
.\app\MousePointer.Windows.exe --mcp-stdio --endpoint http://127.0.0.1:49154/
```

### Selection timed out

After the call starts, complete selection, preview, and approval in the control window. If no approval arrives before the waiting period ends, the tool returns a selection timeout; call `ui_context_pick` again to restart.

## Uninstall

For Codex:

```powershell
codex plugin remove little-mouse-pointer@auto-mouse
```

For DeepSeek Harness, remove the bundle from the profile:

```powershell
dsh plugin --profile demo remove dsh-little-mouse-pointer
```

If you added a manual MCP client, remove it from the relevant `cordis.yml` or profile patch and clear the output directory when appropriate.

## Continue reading

- [Installation checklist](../../../INSTALL.en.md)
- [Runtime notes](runtime.en.md)
- [DeepSeek Harness configuration](deepseek-harness.en.md)
- [DSH UI Context Protocol v1](protocol/dsh-ui-context-v1.en.md)
