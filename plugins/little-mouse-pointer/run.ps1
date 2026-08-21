param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $RemainingArgs
)

$ErrorActionPreference = 'Stop'
$pluginRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$appPath = Join-Path $pluginRoot 'app\MousePointer.Windows.exe'

function Write-Diagnostic([string] $Message) {
    [Console]::Error.WriteLine("[Little Mouse Pointer] $Message")
}

if (-not (Test-Path -LiteralPath $appPath)) {
    Write-Diagnostic "找不到应用文件：$appPath"
    exit 3
}

$exitCode = 1
try {
    Set-Location -LiteralPath $pluginRoot
    & $appPath @RemainingArgs
    $exitCode = $LASTEXITCODE
}
catch {
    Write-Diagnostic $_.Exception.Message
}

exit $exitCode
