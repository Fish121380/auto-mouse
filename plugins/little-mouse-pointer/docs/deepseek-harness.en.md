# DeepSeek Harness Configuration

[中文配置](deepseek-harness.md)

Little Mouse Pointer connects to DeepSeek Harness through an MCP stdio bridge. The configuration below starts the self-contained executable from the release package and uses a loopback HTTP endpoint for communication with the desktop process. Do not forward MCP stdio through `run.ps1`; a PowerShell wrapper cannot reliably preserve the bidirectional stdin stream required by a standard MCP client.

## cordis.yml

Use the following plugin entry in the Harness `cordis.yml`, preset, or equivalent Cordis configuration layer. Replace `C:/path/to/little-mouse-pointer` with the actual plugin root and use forward slashes in YAML:

```yaml
- id: mcp-little-mouse-pointer
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: little-mouse-pointer
    transport: stdio
    command: 'C:/path/to/little-mouse-pointer/app/MousePointer.Windows.exe'
    args:
      - --mcp-stdio
      - --endpoint
      - 'http://127.0.0.1:49153/'
    cwd: 'C:/path/to/little-mouse-pointer'
    env:
      MOUSE_POINTER_HTTP_PORT: '49153'
```

For a GitHub checkout, the plugin root is `Auto_Mouse/plugins/little-mouse-pointer`. For a standalone release zip, it is the extracted `little-mouse-pointer` directory. `@deepseek-ai/dsh-mcp-client` must already be available in the Harness workspace.

Different Harness versions may place MCP client configuration in a preset or another Cordis configuration layer. Keep the field meanings above and place the entry at the corresponding MCP client extension point for that version.

## Tools

After the client connects, it registers:

```text
mcp__little-mouse-pointer__ui_context_pick
mcp__little-mouse-pointer__ui_context_current
mcp__little-mouse-pointer__ui_context_clear
```

`ui_context_pick` opens or restores the topmost control window and waits for selection, preview, and user confirmation. `ui_context_current` reads the latest approved result. `ui_context_clear` clears the latest result reference. These tools do not click, type, send messages, or operate the original application.

## Port

The default endpoint is `http://127.0.0.1:49153/` and listens on loopback only. If the port is occupied, change both the `--endpoint` port and `MOUSE_POINTER_HTTP_PORT`. Mismatched values prevent the bridge from finding the desktop process.

## Troubleshooting

- Confirm that `cwd` is the complete plugin root and that `command` points directly to `app/MousePointer.Windows.exe`.
- Confirm that the plugin root contains `.codex-plugin/plugin.json`, `.mcp.json`, `app`, and `run.ps1`.
- Do not configure `run.ps1` as the MCP stdio command. It is only for manual GUI startup and self-test.
- Close old `MousePointer.Windows.exe` processes before retrying to avoid competing global mouse hooks.
- Do not write logs or diagnostics to MCP stdout; stdout is reserved for JSON-RPC. `run.ps1` writes startup diagnostics to stderr.
- Always use the authoritative output directory returned by the tool instead of guessing a timestamp or filename.
