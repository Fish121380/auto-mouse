# Runtime Notes

[中文运行时说明](runtime.md)

The `app` directory in the GitHub release is a Windows x64 self-contained publish directory. It includes the .NET 8 Windows Desktop runtime, so users do not need to install the .NET SDK, .NET Runtime, or .NET Desktop Runtime. Run `run.ps1` or `run.cmd` from the plugin root for a manual GUI launch.

`run.ps1` changes the working directory to the plugin root and forwards all arguments to `app\MousePointer.Windows.exe`. It returns exit code `3` when the executable is missing and writes startup failures to stderr. In MCP stdio mode, diagnostics do not go to stdout, so they cannot corrupt JSON-RPC traffic.

Do not move, delete, or replace individual files under `app`. When upgrading, replace the complete plugin directory so the executable and its self-contained runtime remain from the same release.

The MCP manifest starts the executable directly. `run.ps1` is not an MCP stdio transport wrapper because a PowerShell process cannot reliably preserve the bidirectional stdin stream used by standard MCP clients.
