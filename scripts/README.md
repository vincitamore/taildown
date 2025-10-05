# Development Scripts

This directory contains utility scripts for Taildown development.

## Available Scripts

### Fixture Generation

#### `generate-fixture.ps1`
Generate an AST fixture for a single `.td` test file.

**Usage:**
```powershell
.\scripts\generate-fixture.ps1 syntax-tests/fixtures/02-inline-attributes/01-headings.td
```

**What it does:**
1. Builds all packages
2. Parses the specified `.td` file
3. Generates a `.ast.json` fixture with the same base name
4. Formats the JSON with 2-space indentation

#### `regenerate-all-fixtures.ps1`
Regenerate all AST fixtures from `.td` test files in the `syntax-tests/fixtures/` directory.

**Usage:**
```powershell
.\scripts\regenerate-all-fixtures.ps1
```

**What it does:**
1. Builds all packages
2. Finds all `.td` files in `syntax-tests/fixtures/`
3. Parses each file and generates/updates the corresponding `.ast.json` fixture
4. Reports success/failure for each file
5. Displays a summary at the end

**When to use:**
- After making changes to the parser that affect AST structure
- After adding new syntax test cases
- After fixing parser bugs
- Following the Build-Validate-Test workflow

## Adding New Scripts

When adding new utility scripts:

1. **Name clearly:** Use descriptive kebab-case names (e.g., `analyze-performance.ps1`)
2. **Add usage docs:** Include a comment block at the top with usage instructions
3. **Update this README:** Document the new script here
4. **Use proper exit codes:** Exit with 0 for success, non-zero for failures
5. **Provide feedback:** Use colored output to indicate progress and results

## Script Categories

- **Fixture Management:** `generate-fixture.ps1`, `regenerate-all-fixtures.ps1`
- **Build & Test:** (TBD)
- **Analysis:** (TBD)
- **Deployment:** (TBD)

## Best Practices

- Always build packages before running scripts that depend on compiled code
- Use relative paths from project root
- Provide clear error messages
- Clean up temporary files when done
- Test scripts before committing

