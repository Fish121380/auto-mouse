# 安装检查表

[English installation checklist](INSTALL.en.md)

## Codex

1. 使用 Codex `0.147.0` 或更新版本。
2. 在 GitHub 仓库根目录执行：

   ```powershell
   codex plugin marketplace add OWNER/REPOSITORY --ref main
   codex plugin add little-mouse-pointer@auto-mouse
   ```

3. 用 `codex plugin list` 确认 `little-mouse-pointer@auto-mouse` 为 `installed, enabled`。
4. 开始新 task，再调用 `ui_context_pick`。

## DeepSeek Harness

1. 确认 Harness 已安装 `@deepseek-ai/dsh-mcp-client`。
2. 在 `cordis.yml`、preset 或对应的 Cordis 配置层中使用 `plugins/little-mouse-pointer/docs/deepseek-harness.md` 的配置。
3. `command` 直接指向 `app/MousePointer.Windows.exe`，不要指向 `run.ps1`。
4. 保持 `cwd`、exe 路径、endpoint 和 `MOUSE_POINTER_HTTP_PORT` 一致。
5. 启动后应发现：

   ```text
   mcp__little-mouse-pointer__ui_context_pick
   mcp__little-mouse-pointer__ui_context_current
   mcp__little-mouse-pointer__ui_context_clear
   ```

## 本机运行

- Windows 10/11 x64。
- 不需要安装 .NET SDK 或 .NET Desktop Runtime。
- 不要删除 `app` 目录中的运行时文件。
- 端口占用时同时修改 endpoint 和 `MOUSE_POINTER_HTTP_PORT`。
- 手动 GUI 启动使用 `run.ps1` 或 `run.cmd`；MCP stdio 使用 self-contained exe。

GitHub 仓库检出时，插件根目录是 `Auto_Mouse/plugins/little-mouse-pointer`；独立发行版 zip 解压后，插件根目录是直接包含 `.codex-plugin` 的 `little-mouse-pointer` 目录。Codex marketplace 命令应指向仓库根目录 `Auto_Mouse`。
