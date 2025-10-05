# Generate AST fixture for a single .td test file
# Usage: .\scripts\generate-fixture.ps1 <path-to-td-file>

param(
    [Parameter(Mandatory=$true)]
    [string]$TdFilePath
)

# Ensure the .td file exists
if (-not (Test-Path $TdFilePath)) {
    Write-Error "File not found: $TdFilePath"
    exit 1
}

# Build packages first
Write-Host "Building packages..." -ForegroundColor Cyan
pnpm build | Out-Null

# Generate AST
$astPath = $TdFilePath -replace '\.td$', '.ast.json'
Write-Host "Generating AST fixture for: $TdFilePath" -ForegroundColor Yellow
Write-Host "Output: $astPath" -ForegroundColor Yellow

$nodeScript = @"
const { parse } = require('./packages/compiler/dist/index.js');
const fs = require('fs');

const source = fs.readFileSync('$($TdFilePath.Replace('\', '\\'))', 'utf8');

parse(source).then(ast => {
    // Write formatted JSON with 2-space indentation
    fs.writeFileSync('$($astPath.Replace('\', '\\'))', JSON.stringify(ast, null, 2) + '\n', 'utf8');
    console.log('✓ Generated AST fixture: $($astPath.Replace('\', '\\'))');
}).catch(err => {
    console.error('Error parsing file:', err);
    process.exit(1);
});
"@

node -e $nodeScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Fixture generated successfully!" -ForegroundColor Green
} else {
    Write-Error "Failed to generate fixture"
    exit 1
}

