# 运行时

[English runtime notes](runtime.en.md)

GitHub 发行包中的 `app` 是 Windows x64 self-contained 发布目录，已经包含 .NET 8 Windows Desktop 运行时。普通用户不需要安装 .NET SDK、.NET Runtime 或 .NET Desktop Runtime，直接运行插件根目录的 `run.ps1` 或 `run.cmd` 即可。

`run.ps1` 会把工作目录切换到插件根目录，然后启动 `app\MousePointer.Windows.exe`，并原样转发参数。缺少可执行文件时返回退出码 `3`；启动异常会写入 stderr。MCP stdio 模式下，诊断信息不会写入 stdout，因此不会污染 JSON-RPC 通信。

请不要单独移动、删除或覆盖 `app` 目录中的运行时文件。升级时应替换完整插件目录，以保持可执行文件与运行时版本一致。
