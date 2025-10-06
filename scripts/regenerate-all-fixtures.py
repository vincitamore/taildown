#!/usr/bin/env python3
"""
Regenerate all AST fixtures from .td test files
Usage: python3 scripts/regenerate-all-fixtures.py
"""

import subprocess
import json
import sys
from pathlib import Path

def main():
    print("=" * 50)
    print("Regenerating All Syntax Test Fixtures")
    print("=" * 50)
    print()

    # Build packages first
    print("Step 1: Building packages...")
    result = subprocess.run(["pnpm", "build"], capture_output=True)
    if result.returncode != 0:
        print("✗ Build failed")
        sys.exit(1)
    print("✓ Build complete")
    print()

    # Find all .td files in syntax-tests/fixtures
    fixtures_dir = Path("syntax-tests/fixtures")
    td_files = sorted(fixtures_dir.rglob("*.td"))
    
    print(f"Step 2: Found {len(td_files)} test files")
    print()

    success_count = 0
    fail_count = 0

    for td_file in td_files:
        # Convert to absolute path
        td_file = td_file.resolve()
        ast_path = td_file.with_suffix('.ast.json')
        relative_path = td_file.relative_to(Path.cwd().resolve())
        
        print(f"Processing: {relative_path}")
        
        # Create Node.js script to parse and generate AST
        node_script = f"""
import {{ parse }} from './packages/compiler/dist/index.js';
import {{ readFileSync, writeFileSync }} from 'fs';

const source = readFileSync('{td_file}', 'utf8');

try {{
    const ast = await parse(source);
    writeFileSync('{ast_path}', JSON.stringify(ast, null, 2) + '\\n', 'utf8');
    process.exit(0);
}} catch (err) {{
    console.error('Parse error:', err.message);
    process.exit(1);
}}
"""
        
        # Run Node.js to generate AST
        result = subprocess.run(
            ["node", "--input-type=module"],
            input=node_script,
            text=True,
            capture_output=True
        )
        
        if result.returncode == 0:
            print(f"  ✓ Generated: {ast_path.relative_to(Path.cwd())}")
            success_count += 1
        else:
            print(f"  ✗ Failed to parse")
            if result.stderr:
                print(f"    Error: {result.stderr.strip()}")
            fail_count += 1
        
        print()

    print("=" * 50)
    print("Summary:")
    print(f"  Success: {success_count}")
    print(f"  Failed:  {fail_count}")
    print("=" * 50)

    if fail_count > 0:
        sys.exit(1)

    print()
    print("All fixtures regenerated successfully! ✓")

if __name__ == "__main__":
    main()
