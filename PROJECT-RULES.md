# Taildown Project Organization Rules

> **Last Updated**: 2025-10-05  
> **Version**: 1.0.0

This document defines the structure and organization rules for the Taildown project. Follow these guidelines to keep the repository clean, maintainable, and professional.

---

## 📁 Directory Structure

```
taildown/
├── README.md                    # User-facing overview and quick start
├── SYNTAX.md                    # Canonical syntax specification
├── tech-spec.md                 # Technical architecture specification
├── CONTRIBUTING.md              # Contribution guidelines
├── PROJECT-RULES.md            # This file - project organization
├── package.json                # Root package configuration
├── pnpm-workspace.yaml         # Monorepo workspace configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Test configuration
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── .gitignore                  # Git ignore patterns
│
├── packages/                   # Monorepo packages
│   ├── cli/                    # CLI package
│   ├── compiler/               # Core compiler package
│   └── shared/                 # Shared types and utilities
│
├── examples/                   # Example .td files and outputs
│   ├── README.md               # Examples documentation
│   └── *.td                    # Example Taildown files
│
├── syntax-tests/               # Syntax reference tests
│   ├── fixtures/               # Test fixtures with .td and .ast.json
│   ├── reference.test.ts       # Syntax validation tests
│   └── README.md               # Testing documentation
│
├── scripts/                    # Utility and automation scripts
│   ├── generate-fixture.ps1    # Generate test fixtures
│   ├── regenerate-all-fixtures.ps1
│   └── README.md               # Scripts documentation
│
├── docs/                       # Historical documentation and notes
│   ├── PHASE-*.md              # Phase status and summaries
│   ├── SESSION-*.md            # Development session notes
│   ├── BUGFIX-*.md             # Bug fix documentation
│   └── *.md                    # Planning and implementation docs
│
└── test-files/                 # Temporary test files and outputs
    ├── test-*.td               # Test Taildown files
    ├── test-*.html             # Generated HTML outputs
    ├── test-*.css              # Generated CSS outputs
    ├── test-*.js               # Generated JS outputs
    └── *.json                  # Debug AST outputs
```

---

## 📋 File Placement Rules

### Root Level
**ONLY** the following types of files belong at root:

1. **Core Documentation** (4 files max):
   - `README.md` - User-facing overview
   - `SYNTAX.md` - Canonical syntax reference
   - `tech-spec.md` - Technical specification
   - `CONTRIBUTING.md` - Contribution guidelines
   - `PROJECT-RULES.md` - This file

2. **Configuration Files**:
   - `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
   - `tsconfig.json`, `vitest.config.ts`
   - `.eslintrc.json`, `.prettierrc`
   - `.gitignore`, `.cursorignore`

3. **Nothing Else**: No test files, no session notes, no debug outputs!

---

### packages/ - Source Code
**Purpose**: Monorepo packages with source code and build artifacts

**Rules**:
- Each package has its own `package.json`, `tsconfig.json`, `tsup.config.ts`
- Source files in `src/`, compiled output in `dist/`
- Each package has its own `node_modules/` (managed by pnpm)
- No test files here - use `syntax-tests/` for integration tests
- Unit tests can live in `__tests__/` subdirectories within packages

**Current Packages**:
- `packages/cli/` - Command-line interface
- `packages/compiler/` - Core compiler with parser, renderer, JS generator
- `packages/shared/` - Shared types and constants

---

### examples/ - Example Files
**Purpose**: Showcase Taildown syntax and features

**Rules**:
- **ONLY** `.td` files and their compiled outputs (`.html`, `.css`, `.js`)
- Files should be numbered: `01-basic-markdown.td`, `02-inline-attributes.td`
- Each example should demonstrate a specific feature or use case
- Include a `README.md` explaining what each example demonstrates
- Keep examples polished and production-ready

**What Goes Here**:
- ✅ `01-basic-markdown.td` - Basic markdown compatibility
- ✅ `10-complete-page.td` - Complete landing page example
- ✅ Compiled outputs: `.html`, `.css`, `.js` files

**What Does NOT Go Here**:
- ❌ Test files (use `test-files/`)
- ❌ Debug files (use `test-files/`)
- ❌ Incomplete experiments (use `test-files/`)

---

### syntax-tests/ - Syntax Validation Tests
**Purpose**: Automated tests validating syntax parsing

**Rules**:
- Test fixtures in `fixtures/` subdirectories
- Each fixture has a `.td` file and corresponding `.ast.json`
- Organized by feature: `01-markdown-compatibility/`, `02-inline-attributes/`, etc.
- Tests in `reference.test.ts` validate AST output
- Never manually edit `.ast.json` files - regenerate with scripts

**Structure**:
```
syntax-tests/
├── fixtures/
│   ├── 01-markdown-compatibility/
│   │   ├── 01-basic-markdown.td
│   │   └── 01-basic-markdown.ast.json
│   ├── 02-inline-attributes/
│   └── ...
├── reference.test.ts
└── README.md
```

---

### scripts/ - Utility Scripts
**Purpose**: Automation, debugging, and development utilities

**Rules**:
- PowerShell scripts: `.ps1` extension
- Node.js scripts: `.js` or `.ts` extension
- Each script should have a comment header explaining purpose
- Include a `README.md` documenting all scripts
- Scripts should be runnable from project root

**What Goes Here**:
- ✅ `generate-fixture.ps1` - Generate test fixtures
- ✅ `regenerate-all-fixtures.ps1` - Regenerate all fixtures
- ✅ `install-vscode-extension.ps1` - VSCode extension installer
- ✅ Debug scripts like `test-toHast-behavior.js`

**Example Script Header**:
```powershell
# Script: generate-fixture.ps1
# Purpose: Generate .ast.json fixture from .td file
# Usage: .\scripts\generate-fixture.ps1 path/to/file.td
```

---

### docs/ - Historical Documentation
**Purpose**: Session notes, planning docs, implementation notes

**Rules**:
- Only historical/archived documentation goes here
- Use descriptive prefixes: `PHASE-`, `SESSION-`, `BUGFIX-`, `PLANNING-`
- Date files if applicable: `SESSION-2025-10-05.md`
- These are for reference only - not user-facing
- Do NOT put core docs here (those stay at root)

**What Goes Here**:
- ✅ `PHASE-1-STATUS.md` - Phase status tracking
- ✅ `SESSION-SUMMARY.md` - Development session notes
- ✅ `BUGFIX-FENCE-WITHOUT-BLANK-LINE.md` - Bug documentation
- ✅ `CUSTOM-DIRECTIVE-PARSER-PLAN.md` - Planning documents
- ✅ `DOCUMENTATION-GAPS.md` - Gap analysis

**What Does NOT Go Here**:
- ❌ `README.md` (stays at root)
- ❌ `SYNTAX.md` (stays at root)
- ❌ `tech-spec.md` (stays at root)

---

### test-files/ - Temporary Test Files
**Purpose**: Ad-hoc testing, debugging, and experimentation

**Rules**:
- Prefix all files with `test-`
- Include both `.td` source and all outputs (`.html`, `.css`, `.js`)
- Clean up regularly - don't let this folder grow unbounded
- These files are NOT committed to examples or syntax-tests
- Use descriptive names: `test-attachable-modals.td`, not `test1.td`

**What Goes Here**:
- ✅ `test-interactive.td` - Testing interactive components
- ✅ `test-attachable.td` - Testing attachable modal/tooltip
- ✅ `test-*.html`, `test-*.css`, `test-*.js` - Generated outputs
- ✅ `temp-ast.json` - Debug AST output
- ✅ `debug-simple.css` - Debug artifacts

**Cleanup Policy**:
- Files can be deleted once feature is validated
- Keep only actively used test files
- When a test file proves a feature works, consider moving to `examples/`

---

## 🛠️ Workflow Guidelines

### Creating Test Files
```bash
# Always create in test-files/
cd test-files/
touch test-my-feature.td

# Compile from project root
node packages/cli/dist/cli.js compile test-files/test-my-feature.td
```

### Promoting Test to Example
```bash
# Once validated, move to examples/ and rename
mv test-files/test-my-feature.td examples/11-my-feature.td
mv test-files/test-my-feature.html examples/11-my-feature.html
mv test-files/test-my-feature.css examples/11-my-feature.css
mv test-files/test-my-feature.js examples/11-my-feature.js

# Update examples/README.md with new example
```

### Creating Syntax Test Fixtures
```bash
# Use the script (automatically places in syntax-tests/)
.\scripts\generate-fixture.ps1 "path/to/source.td" "01-markdown-compatibility/01-basic-markdown"
```

### Adding Utility Scripts
```bash
# Create in scripts/ with proper header
touch scripts/my-utility.ps1

# Add documentation to scripts/README.md
```

### Documentation Updates
```bash
# Core docs: Edit at root
code README.md
code SYNTAX.md
code tech-spec.md

# Session notes: Create in docs/
touch docs/SESSION-2025-10-05.md
touch docs/BUGFIX-tooltip-positioning.md
```

---

## ✅ Pre-Commit Checklist

Before committing, ensure:

- [ ] No test files at root level
- [ ] No debug artifacts at root level (`.json`, `.css`, `.html`)
- [ ] Core documentation files are at root
- [ ] Test files are in `test-files/` or promoted to `examples/`
- [ ] New scripts are in `scripts/` with documentation
- [ ] Session notes are in `docs/`
- [ ] `.gitignore` excludes `test-files/` and `node_modules/`

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
```
taildown/
├── test-something.td          # NO - use test-files/
├── debug.html                 # NO - use test-files/
├── SESSION-NOTES.md           # NO - use docs/
├── my-script.ps1              # NO - use scripts/
└── temp.json                  # NO - use test-files/
```

### ✅ DO:
```
taildown/
├── README.md                  # YES - core documentation
├── SYNTAX.md                  # YES - core documentation
├── test-files/
│   ├── test-something.td      # YES - test file
│   └── debug.html             # YES - debug artifact
├── docs/
│   └── SESSION-NOTES.md       # YES - session notes
└── scripts/
    └── my-script.ps1          # YES - utility script
```

---

## 🔄 Maintenance Schedule

### Weekly:
- Review `test-files/` and delete obsolete test files
- Update examples if new features are stable

### Before Each Release:
- Clean up `test-files/` - keep only actively used tests
- Review `docs/` for outdated information
- Ensure all examples compile without errors
- Update version numbers in documentation

---

## 📞 Questions?

If you're unsure where a file belongs:

1. **Is it core user-facing documentation?** → Root level
2. **Is it a configuration file?** → Root level
3. **Is it source code?** → `packages/`
4. **Is it a polished example?** → `examples/`
5. **Is it a test fixture?** → `syntax-tests/fixtures/`
6. **Is it a utility script?** → `scripts/`
7. **Is it session notes or planning?** → `docs/`
8. **Is it a temporary test file?** → `test-files/`

**When in doubt, ask or put it in `test-files/` temporarily.**

---

## 🏆 Enforcement

These rules are enforced through:
- Manual code review
- `.gitignore` patterns
- Pre-commit checklist (above)
- Common sense and professional standards

**Keep the root clean. Keep the project professional.**

