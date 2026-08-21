# DeepSeek Harness 配置

[English configuration](deepseek-harness.en.md)

Little Mouse Pointer 通过 MCP stdio bridge 接入 DeepSeek Harness。下面的配置直接启动发行包中的 self-contained exe，并通过本机 loopback HTTP endpoint 与桌面程序通信。MCP stdio 不应通过 `run.ps1` 转发，因为 PowerShell 脚本层不能可靠保持标准 MCP 客户端的双向 stdin 流。

## cordis.yml

将下面的插件项加入 Harness 的 `cordis.yml`、preset 或对应的 Cordis 配置层，把 `C:/path/to/little-mouse-pointer` 替换为实际插件根目录。YAML 中建议使用正斜杠，避免反斜杠转义问题。

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

对于 GitHub 仓库检出，插件根目录是 `Auto_Mouse/plugins/little-mouse-pointer`；对于独立发行版 zip，插件根目录是解压后的 `little-mouse-pointer` 目录。不同 Harness 版本可能把 MCP client 配置放在 preset 或其他 Cordis 配置层；保留上面的字段含义，并按照该版本的 MCP client 配置入口放置即可。`@deepseek-ai/dsh-mcp-client` 必须已经安装在 Harness 工作区中。

## 工具

客户端注册后提供以下工具：

```text
mcp__little-mouse-pointer__ui_context_pick
mcp__little-mouse-pointer__ui_context_current
mcp__little-mouse-pointer__ui_context_clear
```

`ui_context_pick` 会打开或恢复控制小窗，并等待用户完成选取、预览和确认。`ui_context_current` 读取最近一次已经确认的结果。`ui_context_clear` 清除最近一次结果引用。工具不会自动点击、输入、发送消息或操作原应用。

## 端口

默认端口为 `49153`，只监听 `127.0.0.1`。如果端口已占用，必须同时修改 `--endpoint` 的端口和 `MOUSE_POINTER_HTTP_PORT` 的值。端口配置不一致会导致 bridge 找不到桌面程序。

## 排查

- 确认 `cwd` 指向完整插件根目录，`command` 直接指向该目录下的 `app/MousePointer.Windows.exe`。
- 确认该目录直接包含 `.codex-plugin\plugin.json`、`.mcp.json`、`app` 和 `run.ps1`。
- `command` 必须指向 `app/MousePointer.Windows.exe`，不要把 `run.ps1` 配成 stdio bridge。
- `run.ps1` 只用于手动启动 GUI 或 self-test，不用于 Harness 的 MCP stdio 子进程。
- 关闭旧的 `MousePointer.Windows.exe` 实例后再重试，避免多个全局鼠标钩子竞争。
- 不要把日志或诊断文本写入 MCP stdout；`run.ps1` 已将启动诊断写到 stderr。
- 工具返回输出目录时，始终使用返回结果中的权威路径读取 JSON、Markdown 和截图，不要猜测路径。
