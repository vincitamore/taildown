# Install Taildown VSCode Extension
# Run this script to install the Taildown syntax highlighting extension

$ExtensionSource = Join-Path $PSScriptRoot ".vscode\extensions\taildown"
$ExtensionDest = Join-Path $env:USERPROFILE ".vscode\extensions\taildown-syntax-0.2.0"

Write-Host "Installing Taildown VSCode Extension..." -ForegroundColor Cyan

# Check if source exists
if (-not (Test-Path $ExtensionSource)) {
    Write-Host "ERROR: Extension source not found at $ExtensionSource" -ForegroundColor Red
    exit 1
}

# Remove old version if exists
if (Test-Path $ExtensionDest) {
    Write-Host "Removing old version..." -ForegroundColor Yellow
    Remove-Item $ExtensionDest -Recurse -Force
}

# Copy extension
Write-Host "Copying extension files..." -ForegroundColor Green
Copy-Item -Path $ExtensionSource -Destination $ExtensionDest -Recurse -Force

Write-Host ""
Write-Host "Taildown VSCode Extension installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Reload VSCode: Press Ctrl+Shift+P -> Type 'Reload Window' -> Press Enter"
Write-Host "2. Open any .td file to see syntax highlighting"
Write-Host ""
Write-Host "Extension location: $ExtensionDest" -ForegroundColor Gray

