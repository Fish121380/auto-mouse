# Installation Checklist

[中文安装检查表](INSTALL.md)

For a first installation, start with the [getting started tutorial](plugins/little-mouse-pointer/docs/getting-started.en.md), then use this page to verify the environment and discovered tools. Paths on this page are relative to the GitHub repository root.

## Codex

1. Use Codex `0.147.0` or newer.
2. For a GitHub marketplace installation, run these commands from the repository root, replacing `OWNER/REPOSITORY`:

   ```powershell
   codex plugin marketplace add OWNER/REPOSITORY --ref main
   codex plugin add little-mouse-pointer@auto-mouse
   ```

3. Run `codex plugin list` and confirm that `little-mouse-pointer@auto-mouse` is `installed, enabled`.
4. Start a new task, then call `ui_context_pick`.

For a standalone release zip, keep the directory that directly contains `.codex-plugin\plugin.json`, `.mcp.json`, `app`, and `run.ps1`. A GitHub repository checkout and a standalone plugin zip have different roots:

```text
GitHub checkout:  Auto_Mouse/plugins/little-mouse-pointer
Standalone zip:  little-mouse-pointer
```

The Codex marketplace command targets the repository root `Auto_Mouse`, not the nested plugin directory.

## DeepSeek Harness

1. Confirm that the Harness workspace provides `@deepseek-ai/dsh-mcp-client`.
2. Prefer installing the repository-root Harness bundle:

   ```powershell
   dsh plugin --profile demo add github:Fish121380/auto-mouse#v0.1.1
   dsh --profile demo --dump-config
   ```

   If the installed Harness version or profile does not support this bundle, add the configuration from [DeepSeek Harness configuration](plugins/little-mouse-pointer/docs/deepseek-harness.en.md) to the applicable `cordis.yml`, preset, or Cordis configuration layer.
3. Set `command` to `app/MousePointer.Windows.exe`; do not use `run.ps1` as the MCP stdio bridge.
4. Keep `cwd`, the executable path, the endpoint, and `MOUSE_POINTER_HTTP_PORT` aligned to the same plugin root and port.
5. After startup, the Harness should discover:

   ```text
   mcp__little-mouse-pointer__ui_context_pick
   mcp__little-mouse-pointer__ui_context_current
   mcp__little-mouse-pointer__ui_context_clear
   ```

## Manual Run

- Windows 10 or Windows 11, x64.
- No .NET SDK or .NET Desktop Runtime installation is required.
- Keep every file under `app`.
- If the port is occupied, change both the endpoint and `MOUSE_POINTER_HTTP_PORT`.
- Use `run.ps1` or `run.cmd` for manual GUI startup; use the self-contained executable for MCP stdio.

## Troubleshooting

- Close old `MousePointer.Windows.exe` processes before retrying. Multiple instances compete for the global mouse hooks and port.
- If the control window is not visible, use the tray menu or call `ui_context_pick` again after bringing the picker to the foreground.
- If no tools are discovered, verify the executable path, `cwd`, endpoint, environment variable, and that the full `app` directory is present.
- In MCP stdio mode, stdout is reserved for JSON-RPC. Diagnostics belong on stderr.
- If hover highlighting or buttons do not respond, close old instances, verify the runtime directory is complete, and run `run.ps1 -SelfTest`.
- If selection times out, complete selection, preview, and approval in the control window after calling `ui_context_pick`, then call it again.

See the [getting started tutorial](plugins/little-mouse-pointer/docs/getting-started.en.md) for the full workflow.

## Continue reading

- [Complete plugin README](plugins/little-mouse-pointer/README.en.md)
- [Getting started tutorial](plugins/little-mouse-pointer/docs/getting-started.en.md)
- [Runtime notes](plugins/little-mouse-pointer/docs/runtime.en.md)
- [DeepSeek Harness manual configuration](plugins/little-mouse-pointer/docs/deepseek-harness.en.md)
