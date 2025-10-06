#!/bin/bash
# Generate AST fixture for a single .td test file
# Usage: ./scripts/generate-fixture.sh <path-to-td-file>

set -e

if [ $# -eq 0 ]; then
    echo "Error: No file path provided"
    echo "Usage: $0 <path-to-td-file>"
    exit 1
fi

td_file="$1"

# Ensure the .td file exists
if [ ! -f "$td_file" ]; then
    echo "Error: File not found: $td_file"
    exit 1
fi

# Build packages first
echo "Building packages..."
pnpm build > /dev/null 2>&1

# Generate AST
ast_path="${td_file%.td}.ast.json"
echo "Generating AST fixture for: $td_file"
echo "Output: $ast_path"

node --input-type=module -e "
import { parse } from './packages/compiler/dist/index.js';
import { readFileSync, writeFileSync } from 'fs';

const source = readFileSync('$td_file', 'utf8');

try {
    const ast = await parse(source);
    // Write formatted JSON with 2-space indentation
    writeFileSync('$ast_path', JSON.stringify(ast, null, 2) + '\n', 'utf8');
    console.log('✓ Generated AST fixture: $ast_path');
} catch (err) {
    console.error('Error parsing file:', err);
    process.exit(1);
}
"

if [ $? -eq 0 ]; then
    echo "✓ Fixture generated successfully!"
else
    echo "Error: Failed to generate fixture"
    exit 1
fi
