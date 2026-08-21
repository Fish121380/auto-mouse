# Auto Mouse Plugins

[中文 README](README.md)

This repository provides `Little Mouse Pointer`, a Windows desktop picker for selecting windows, UI elements, or screen regions and delivering user-approved context to Codex, DeepSeek Harness, or another MCP client.

The plugin lives in [`plugins/little-mouse-pointer`](plugins/little-mouse-pointer). See the plugin [README](plugins/little-mouse-pointer/README.en.md) for full feature, protocol, and runtime documentation.

## Install from GitHub in Codex

Run the following commands in PowerShell, replacing `OWNER/REPOSITORY` with the GitHub repository:

```powershell
codex plugin marketplace add OWNER/REPOSITORY --ref main
codex plugin add little-mouse-pointer@auto-mouse
```

For a direct plugin installation, use the GitHub release zip or install the `plugins/little-mouse-pointer` directory. Do not use the repository root as the direct plugin root.

## Connect to DeepSeek Harness

Follow the [English installation checklist](INSTALL.en.md) and [DeepSeek Harness configuration](plugins/little-mouse-pointer/docs/deepseek-harness.en.md), replacing paths with the actual installation directory. MCP stdio must start:

```text
plugins/little-mouse-pointer/app/MousePointer.Windows.exe
```

Do not use `run.ps1` as the MCP stdio bridge; it is for manually starting the GUI and running self-test.

## Preflight checklist

- Windows 10/11 x64.
- No .NET installation is required; the release is self-contained.
- Keep every file under `plugins/little-mouse-pointer/app`.
- The default port is `49153`; the endpoint and `MOUSE_POINTER_HTTP_PORT` must match.
- Close older Little Mouse Pointer instances before starting Codex or Harness.
- MCP tools are `ui_context_pick`, `ui_context_current`, and `ui_context_clear`.
