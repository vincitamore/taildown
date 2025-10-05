# Regenerate all AST fixtures from .td test files
# Usage: .\scripts\regenerate-all-fixtures.ps1

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Regenerating All Syntax Test Fixtures" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Build packages first
Write-Host "Step 1: Building packages..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed"
    exit 1
}
Write-Host "✓ Build complete" -ForegroundColor Green
Write-Host ""

# Find all .td files in syntax-tests/fixtures
$tdFiles = Get-ChildItem -Path "syntax-tests/fixtures" -Filter "*.td" -Recurse

Write-Host "Step 2: Found $($tdFiles.Count) test files" -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($tdFile in $tdFiles) {
    $relativePath = $tdFile.FullName.Substring($PWD.Path.Length + 1)
    $astPath = $tdFile.FullName -replace '\.td$', '.ast.json'
    
    Write-Host "Processing: $relativePath" -ForegroundColor Cyan
    
    try {
        # Generate AST using Node.js
        $nodeScript = @"
const { parse } = require('./packages/compiler/dist/index.js');
const fs = require('fs');

const source = fs.readFileSync('$($tdFile.FullName.Replace('\', '\\'))', 'utf8');

parse(source).then(ast => {
    fs.writeFileSync('$($astPath.Replace('\', '\\'))', JSON.stringify(ast, null, 2) + '\n', 'utf8');
    process.exit(0);
}).catch(err => {
    console.error('Parse error:', err.message);
    process.exit(1);
});
"@

        node -e $nodeScript
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✓ Generated: $($astPath.Substring($PWD.Path.Length + 1))" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "  ✗ Failed to parse" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "  ✗ Error: $_" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Success: $successCount" -ForegroundColor Green
Write-Host "  Failed:  $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "======================================" -ForegroundColor Cyan

if ($failCount -gt 0) {
    exit 1
}

Write-Host ""
Write-Host "All fixtures regenerated successfully! ✓" -ForegroundColor Green

