# Taildown Project Organization Rules {huge-bold center primary}

**Last Updated**: 2025-10-05 :icon[calendar]{primary xs} | **Version**: 0.1.0 :icon[package]{accent xs} {center large}

This document defines the structure and organization rules for the Taildown project. Follow these guidelines to keep the repository clean, maintainable, and professional. {center muted large}

---

## NO EMOJIS POLICY {large-bold error}

:::alert {type="error"}
**CRITICAL RULE: ABSOLUTELY NO EMOJIS IN ANY PROJECT FILES**

Taildown is a **professional project** with a sophisticated icon system. We do NOT use emojis anywhere in:
- Documentation files (README.md, SYNTAX.md, tech-spec.md, etc.)
- Code files (TypeScript, JavaScript)
- Example files (.td, .html, .css)
- Test files
- Comments or commit messages
:::

**Instead, use the icon system:**
```taildown
:icon[x]{error} WRONG:  ✓ Feature complete
:icon[x]{error} WRONG:  ✗ Not implemented
:icon[x]{error} WRONG:  ⚠ Warning

:icon[check]{success} CORRECT: :icon[check]{success} Feature complete
:icon[check]{success} CORRECT: :icon[x]{error} Not implemented
:icon[check]{success} CORRECT: :icon[alert-triangle]{warning} Warning
```

:::card {subtle-glass}
### :icon[info]{primary} Why This Rule Exists {medium-bold}

- Emojis are unprofessional and inconsistent across platforms
- We have a comprehensive icon system with 1000+ Lucide icons
- Icons are semantic, accessible, and styleable
- Maintains professional aesthetic throughout project
:::

**This rule applies to:**
- All contributors
- All documentation
- All code and examples
- All commit messages and PRs

**No exceptions.** Use `:icon[name]{attributes}` syntax for all visual indicators.

---

## DOCUMENTATION FORMAT POLICY {large-bold primary}

:::alert {type="info"}
**ALL PROJECT DOCUMENTATION MUST BE WRITTEN IN TAILDOWN FORMAT**
:::

Starting with version 0.1.0, all project documentation should be:
- Written as `.td` files (Taildown format)
- Compiled to HTML for distribution
- Taking full advantage of Taildown's enhanced features

**This applies to:**
- Session summaries and reports in `docs/`
- Implementation documentation
- Status reports and assessments
- Technical documentation
- Planning and design documents

:::card {light-glass}
### :icon[zap]{warning} Why Taildown Format? {medium-bold}

- **Dogfooding**: We use our own tool for our own documentation
- **Showcases capabilities**: Demonstrates Taildown's features in real-world use
- **Professional output**: Provides styled documentation output
- **Best practices**: Shows users how to use Taildown effectively
- **Production testing**: Tests our features in production-like scenarios
:::

**Format Requirements:**
- Use Taildown components (cards, alerts, grids)
- Use plain English shorthands for styling
- Use icon syntax for visual indicators
- Compile to HTML for final output
- Include both .td source and .html output in repository

**Documentation Styling Standards:**
- **Default card style**: Use `:::card` (with glassmorphism) to exemplify zero-config beauty
- **Visual variety**: Use different glass variants (`subtle-glass`, `light-glass`, `heavy-glass`) for aesthetic appeal
- **Showcase features**: Demonstrate various shorthand styles to highlight capabilities
- **Professional aesthetics**: Maintain skillful, aesthetically pleasing standards throughout
- **Avoid overuse of elevated**: `:::card {elevated}` should be used sparingly; prefer glass variants
- **Use native components**: Always use `:::tree` for directory structures and `:::flow` for process diagrams instead of ASCII art

**Example:**
```taildown
# My Document {huge-bold center primary}

:::alert {type="success"}
This is a success message with proper Taildown formatting.
:::

:icon[check]{success} Feature complete
```

**Exceptions:**
- Core documentation that must be readable on GitHub (README.md, SYNTAX.md)
- Configuration files (package.json, tsconfig.json, etc.)
- Legacy documentation (can be migrated gradually)

---

## Directory Structure {large-bold primary}

:::card {subtle-glass}
### :icon[folder]{accent} Project Layout {medium-bold}

**NOTE:** This project structure uses Taildown's native `:::tree` component instead of ASCII art. Always use Taildown features for visualizations in project documentation. {muted}

:::tree {vscode}
- taildown/
  - README.md                    # User-facing overview and quick start
  - SYNTAX.md                    # Canonical syntax specification
  - tech-spec.md                 # Technical architecture specification
  - CONTRIBUTING.md              # Contribution guidelines
  - PROJECT-RULES.md             # This file - project organization
  - package.json                 # Root package configuration
  - pnpm-workspace.yaml          # Monorepo workspace configuration
  - tsconfig.json                # TypeScript configuration
  - vitest.config.ts             # Test configuration
  - .eslintrc.json               # ESLint configuration
  - .prettierrc                  # Prettier configuration
  - .gitignore                   # Git ignore patterns
  - packages/                    # Monorepo packages
    - cli/                       # CLI package
    - compiler/                  # Core compiler package
    - shared/                    # Shared types and utilities
  - examples/                    # Example .td files and outputs
    - README.md                  # Examples documentation
    - *.td                       # Example Taildown files
  - syntax-tests/                # Syntax reference tests
    - fixtures/                  # Test fixtures with .td and .ast.json
    - reference.test.ts          # Syntax validation tests
    - README.md                  # Testing documentation
  - scripts/                     # Utility and automation scripts
    - generate-fixture.ps1       # Generate test fixtures
    - regenerate-all-fixtures.ps1
    - README.md                  # Scripts documentation
  - docs/                        # Historical documentation and notes
    - PHASE-*.md                 # Phase status and summaries
    - SESSION-*.md               # Development session notes
    - BUGFIX-*.md                # Bug fix documentation
    - *.md                       # Planning and implementation docs
  - test-files/                  # Temporary test files and outputs
    - test-*.td                  # Test Taildown files
    - test-*.html                # Generated HTML outputs
    - test-*.css                 # Generated CSS outputs
    - test-*.js                  # Generated JS outputs
    - *.json                     # Debug AST outputs
:::
:::

---

## File Placement Rules {large-bold primary}

:::grid {3}
:::card {elevated}
### :icon[home]{primary} Root Level {medium-bold}

**ONLY** the following types of files belong at root:

**Core Documentation** (4 files max):
- `README.md` - User-facing overview
- `SYNTAX.md` - Canonical syntax reference
- `tech-spec.md` - Technical specification
- `CONTRIBUTING.md` - Contribution guidelines
- `PROJECT-RULES.md` - This file

**Configuration Files**:
- `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- `tsconfig.json`, `vitest.config.ts`
- `.eslintrc.json`, `.prettierrc`
- `.gitignore`, `.cursorignore`

**Nothing Else**: No test files, no session notes, no debug outputs!
:::

:::card {elevated}
### :icon[package]{accent} packages/ - Source Code {medium-bold}

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
:::

:::card {elevated}
### :icon[file-text]{warning} examples/ - Example Files {medium-bold}

**Purpose**: Showcase Taildown syntax and features

**Rules**:
- **ONLY** `.td` files and their compiled outputs (`.html`, `.css`, `.js`)
- Files should be numbered: `01-basic-markdown.td`, `02-inline-attributes.td`
- Each example should demonstrate a specific feature or use case
- Include a `README.md` explaining what each example demonstrates
- Keep examples polished and production-ready

**What Goes Here**:
- `01-basic-markdown.td` - Basic markdown compatibility
- `10-complete-page.td` - Complete landing page example
- Compiled outputs: `.html`, `.css`, `.js` files

**What Does NOT Go Here**:
- Test files (use `test-files/`)
- Debug files (use `test-files/`)
- Incomplete experiments (use `test-files/`)
:::
:::

:::grid {2}
:::card {light-glass}
### :icon[test-tube]{info} syntax-tests/ - Syntax Validation Tests {medium-bold}

**Purpose**: Automated tests validating syntax parsing

**Rules**:
- Test fixtures in `fixtures/` subdirectories
- Each fixture has a `.td` file and corresponding `.ast.json`
- Organized by feature: `01-markdown-compatibility/`, `02-inline-attributes/`, etc.
- Tests in `reference.test.ts` validate AST output
- Never manually edit `.ast.json` files - regenerate with scripts

**Structure**:

:::tree {minimal}
- syntax-tests/
  - fixtures/
    - 01-markdown-compatibility/
      - 01-basic-markdown.td
      - 01-basic-markdown.ast.json
    - 02-inline-attributes/
    - ...
  - reference.test.ts
  - README.md
:::
:::

:::card {light-glass}
### :icon[settings]{success} scripts/ - Utility Scripts {medium-bold}

**Purpose**: Automation, debugging, and development utilities

**Rules**:
- PowerShell scripts: `.ps1` extension
- Node.js scripts: `.js` or `.ts` extension
- Each script should have a comment header explaining purpose
- Include a `README.md` documenting all scripts
- Scripts should be runnable from project root

**What Goes Here**:
- `generate-fixture.ps1` - Generate test fixtures
- `regenerate-all-fixtures.ps1` - Regenerate all fixtures
- `install-vscode-extension.ps1` - VSCode extension installer
- Debug scripts like `test-toHast-behavior.js`

**Example Script Header**:
```powershell
# Script: generate-fixture.ps1
# Purpose: Generate .ast.json fixture from .td file
# Usage: .\scripts\generate-fixture.ps1 path/to/file.td
```
:::
:::

:::grid {2}
:::card {heavy-glass}
### :icon[book]{primary} docs/ - Historical Documentation {medium-bold}

**Purpose**: Session notes, planning docs, implementation notes

**Rules**:
- Only historical/archived documentation goes here
- Use descriptive prefixes: `PHASE-`, `SESSION-`, `BUGFIX-`, `PLANNING-`
- Date files if applicable: `SESSION-2025-10-05.md`
- These are for reference only - not user-facing
- Do NOT put core docs here (those stay at root)

**What Goes Here**:
- `PHASE-1-STATUS.md` - Phase status tracking
- `SESSION-SUMMARY.md` - Development session notes
- `BUGFIX-FENCE-WITHOUT-BLANK-LINE.md` - Bug documentation
- `CUSTOM-DIRECTIVE-PARSER-PLAN.md` - Planning documents
- `DOCUMENTATION-GAPS.md` - Gap analysis

**What Does NOT Go Here**:
- `README.md` (stays at root)
- `SYNTAX.md` (stays at root)
- `tech-spec.md` (stays at root)
:::

:::card {heavy-glass}
### :icon[beaker]{warning} test-files/ - Temporary Test Files {medium-bold}

**Purpose**: Ad-hoc testing, debugging, and experimentation

**Rules**:
- Prefix all files with `test-`
- Include both `.td` source and all outputs (`.html`, `.css`, `.js`)
- Clean up regularly - don't let this folder grow unbounded
- These files are NOT committed to examples or syntax-tests
- Use descriptive names: `test-attachable-modals.td`, not `test1.td`

**What Goes Here**:
- `test-interactive.td` - Testing interactive components
- `test-attachable.td` - Testing attachable modal/tooltip
- `test-*.html`, `test-*.css`, `test-*.js` - Generated outputs
- `temp-ast.json` - Debug AST output
- `debug-simple.css` - Debug artifacts

**Cleanup Policy**:
- Files can be deleted once feature is validated
- Keep only actively used test files
- When a test file proves a feature works, consider moving to `examples/`
:::
:::

---

## Workflow Guidelines {large-bold primary}

:::tabs
## :icon[code]{primary} Creating Test Files

```bash
# Always create in test-files/
cd test-files/
touch test-my-feature.td

# Compile from project root
node packages/cli/dist/cli.js compile test-files/test-my-feature.td
```

## :icon[arrow-up]{accent} Promoting Test to Example

```bash
# Once validated, move to examples/ and rename
mv test-files/test-my-feature.td examples/11-my-feature.td
mv test-files/test-my-feature.html examples/11-my-feature.html
mv test-files/test-my-feature.css examples/11-my-feature.css
mv test-files/test-my-feature.js examples/11-my-feature.js

# Update examples/README.md with new example
```

## :icon[test-tube]{warning} Creating Syntax Test Fixtures

```bash
# Use the script (automatically places in syntax-tests/)
.\scripts\generate-fixture.ps1 "path/to/source.td" "01-markdown-compatibility/01-basic-markdown"
```

## :icon[wrench]{info} Adding Utility Scripts

```bash
# Create in scripts/ with proper header
touch scripts/my-utility.ps1

# Add documentation to scripts/README.md
```

## :icon[file-text]{success} Documentation Updates

```bash
# Core docs: Edit at root
code README.md
code SYNTAX.md
code tech-spec.md

# Session notes: Create in docs/
touch docs/SESSION-2025-10-05.md
touch docs/BUGFIX-tooltip-positioning.md
```
:::

---

## Pre-Commit Checklist {large-bold primary}

:::card {light-glass}
### :icon[check-square]{primary} Before committing, ensure: {medium-bold}

- :icon[square]{muted} No test files at root level
- :icon[square]{muted} No debug artifacts at root level (`.json`, `.css`, `.html`)
- :icon[square]{muted} Core documentation files are at root
- :icon[square]{muted} Test files are in `test-files/` or promoted to `examples/`
- :icon[square]{muted} New scripts are in `scripts/` with documentation
- :icon[square]{muted} Session notes are in `docs/`
- :icon[square]{muted} `.gitignore` excludes `test-files/` and `node_modules/`
:::

---

## Common Mistakes to Avoid {large-bold error}

:::grid {2}
:::card {elevated}
### :icon[x]{error} Incorrect {medium-bold}

:::tree
- taildown/
  - test-something.td          # NO - use test-files/
  - debug.html                 # NO - use test-files/
  - SESSION-NOTES.md           # NO - use docs/
  - my-script.ps1              # NO - use scripts/
  - temp.json                  # NO - use test-files/
:::
:::

:::card {elevated}
### :icon[check]{success} Correct {medium-bold}

:::tree
- taildown/
  - README.md                  # YES - core documentation
  - SYNTAX.md                  # YES - core documentation
  - test-files/
    - test-something.td        # YES - test file
    - debug.html               # YES - debug artifact
  - docs/
    - SESSION-NOTES.md         # YES - session notes
  - scripts/
    - my-script.ps1            # YES - utility script
:::
:::
:::

---

## Maintenance Schedule {large-bold primary}

:::accordion
**:icon[calendar]{primary} Weekly**

- Review `test-files/` and delete obsolete test files
- Update examples if new features are stable

**:icon[package]{accent} Before Each Release**

- Clean up `test-files/` - keep only actively used tests
- Review `docs/` for outdated information
- Ensure all examples compile without errors
- Update version numbers in documentation
:::

---

## Questions? {large-bold primary}

:::card {subtle-glass}
### :icon[help-circle]{primary} If you're unsure where a file belongs: {medium-bold}

1. **Is it core user-facing documentation?** → Root level
2. **Is it a configuration file?** → Root level
3. **Is it source code?** → `packages/`
4. **Is it a polished example?** → `examples/`
5. **Is it a test fixture?** → `syntax-tests/fixtures/`
6. **Is it a utility script?** → `scripts/`
7. **Is it session notes or planning?** → `docs/`
8. **Is it a temporary test file?** → `test-files/`

**When in doubt, ask or put it in `test-files/` temporarily.**
:::

---

## Enforcement {large-bold primary}

:::alert{type="info"}
These rules are enforced through:
- Manual code review
- `.gitignore` patterns
- Pre-commit checklist (above)
- Common sense and professional standards
:::

:::card {light-glass padded}
### :icon[shield]{primary huge} Keep the root clean. Keep the project professional. {huge-bold center}
:::