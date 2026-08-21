# Little Mouse Pointer

[中文 README](README.md)

This repository provides `Little Mouse Pointer`, a Windows desktop UI context picker for AI agents. Select windows, UI elements, or screen regions with hover highlighting, UI Automation, screenshots, and local OCR, then provide the user-approved context to OpenAI Codex, DeepSeek Harness, or another MCP-compatible client over MCP.

The plugin lives in [`plugins/little-mouse-pointer`](plugins/little-mouse-pointer). See the plugin [README](plugins/little-mouse-pointer/README.en.md) for full feature, protocol, and runtime documentation.

## Documentation

- [Beginner installation checklist](INSTALL.en.md): verify Codex, DeepSeek Harness, and manual-run setups step by step.
- [Complete plugin README](plugins/little-mouse-pointer/README.en.md): features, user flow, privacy limits, and known boundaries.
- [Runtime notes](plugins/little-mouse-pointer/docs/runtime.en.md): the self-contained runtime, `run.ps1`, and MCP stdio behavior.
- [DeepSeek Harness configuration](plugins/little-mouse-pointer/docs/deepseek-harness.en.md): manual Cordis configuration when the bundle is unavailable.
- [Protocol reference](plugins/little-mouse-pointer/docs/protocol/dsh-ui-context-v1.en.md): tool output fields and the approval flow.

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

### Install the Harness bundle from GitHub

The repository root also provides a `dsh.bundle` package for direct Harness installation. Pin a release tag:

```powershell
dsh plugin --profile demo add github:Fish121380/auto-mouse#v0.1.1
dsh --profile demo --dump-config
```

The bundle locates the Windows x64 executable shipped inside itself and registers `@deepseek-ai/dsh-mcp-client`. It is Windows x64 only. Override the port in the profile's `cordis.patch.yml` when needed:

```yaml
- replace:
    - id: little-mouse-pointer
      config:
        port: 49154
```

## Preflight checklist

- Windows 10/11 x64.
- No .NET installation is required; the release is self-contained.
- Keep every file under `plugins/little-mouse-pointer/app`.
- The default port is `49153`; the endpoint and `MOUSE_POINTER_HTTP_PORT` must match.
- Close older Little Mouse Pointer instances before starting Codex or Harness.
- MCP tools are `ui_context_pick`, `ui_context_current`, and `ui_context_clear`.
