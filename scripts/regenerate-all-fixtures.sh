#!/bin/bash
# Regenerate all AST fixtures from .td test files
# Usage: ./scripts/regenerate-all-fixtures.sh

set -e

echo "======================================"
echo "Regenerating All Syntax Test Fixtures"
echo "======================================"
echo ""

# Build packages first
echo "Step 1: Building packages..."
pnpm build
echo "✓ Build complete"
echo ""

# Find all .td files in syntax-tests/fixtures
td_files=$(find syntax-tests/fixtures -name "*.td" -type f | sort)
file_count=$(echo "$td_files" | wc -l)

echo "Step 2: Found $file_count test files"
echo ""

success_count=0
fail_count=0

for td_file in $td_files; do
    relative_path="${td_file#./}"
    ast_path="${td_file%.td}.ast.json"
    
    echo "Processing: $relative_path"
    
    # Generate AST using Node.js with ESM
    if node --input-type=module -e "
import { parse } from './packages/compiler/dist/index.js';
import { readFileSync, writeFileSync } from 'fs';

const source = readFileSync('$td_file', 'utf8');

try {
    const ast = await parse(source);
    writeFileSync('$ast_path', JSON.stringify(ast, null, 2) + '\n', 'utf8');
    process.exit(0);
} catch (err) {
    console.error('Parse error:', err.message);
    process.exit(1);
}
" 2>&1; then
        echo "  ✓ Generated: ${ast_path#./}"
        ((success_count++))
    else
        echo "  ✗ Failed to parse"
        ((fail_count++))
    fi
    
    echo ""
done

echo "======================================"
echo "Summary:"
echo "  Success: $success_count"
echo "  Failed:  $fail_count"
echo "======================================"

if [ $fail_count -gt 0 ]; then
    exit 1
fi

echo ""
echo "All fixtures regenerated successfully! ✓"
