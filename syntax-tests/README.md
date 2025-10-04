# Taildown Syntax Tests

This directory contains the **canonical test suite** for Taildown syntax. These tests serve as the executable specification—implementations must pass all tests to claim conformance.

## Directory Structure

```
syntax-tests/
├── fixtures/                          # Test input/output pairs
│   ├── 01-markdown-compatibility/     # CommonMark compatibility tests
│   ├── 02-inline-attributes/          # Inline attribute syntax
│   ├── 03-component-blocks/           # Component block syntax
│   ├── 04-edge-cases/                 # Edge cases and error handling
│   └── 05-integration/                # Complex real-world documents
├── reference.test.ts                  # Reference test runner (to be created)
└── README.md                          # This file
```

## Test File Format

Each test consists of multiple files with the same base name:

- **`.td`** - Input Taildown source (primary; `.tdown` and `.taildown` also accepted)
- **`.ast.json`** - Expected Abstract Syntax Tree (MDAST format)
- **`.html`** - Expected HTML output (Phase 1+)
- **`.css`** - Expected CSS output (Phase 1+)

### Example

```
02-inline-attributes/
  ├── 01-headings.td             # Input
  ├── 01-headings.ast.json       # Expected AST
  ├── 01-headings.html           # Expected HTML (future)
  └── 01-headings.css            # Expected CSS (future)
```

## Running Tests

### Phase 0 (Current): Manual Verification
Compare parser output against `.ast.json` files manually.

### Phase 1: Automated Testing
```bash
# Run all syntax tests
pnpm test:syntax

# Run specific category
pnpm test:syntax --filter=02-inline-attributes

# Run single test
pnpm test:syntax 02-inline-attributes/01-headings
```

### Phase 2+: Continuous Integration
All syntax tests run automatically on every commit.

## Adding New Tests

1. **Identify the category** (01-05) or create new category
2. **Create `.td` file** with test input
3. **Create `.ast.json` file** with expected AST
4. **Add description** in comments at top of `.td` file
5. **Reference in SYNTAX.md** if testing new rule

> **Note:** Test files use `.td` as the primary extension. The test runner also accepts `.tdown` and `.taildown` for backward compatibility.

### Test Naming Convention

```
NN-descriptive-name.td
```

Where:
- `NN` = zero-padded number (01, 02, 03...)
- `descriptive-name` = kebab-case description of what's being tested

## Test Categories

### 01 - Markdown Compatibility **[REQUIRED]**
Tests that valid CommonMark parses identically in Taildown.

**Coverage:**
- Basic markdown elements (headings, paragraphs, lists)
- Inline formatting (bold, italic, code)
- Links and images
- Code blocks and blockquotes
- Tables (GFM)

### 02 - Inline Attributes **[REQUIRED]**
Tests for inline attribute syntax `{.class}`.

**Coverage:**
- Headings with attributes
- Paragraphs with attributes
- Links with attributes
- Images with attributes
- Whitespace handling
- Malformed attribute syntax
- Edge cases

### 03 - Component Blocks **[REQUIRED]**
Tests for component block syntax `:::component`.

**Coverage:**
- Basic components (card, grid, container)
- Components with attributes
- Nested components
- Empty components
- Malformed component syntax
- Edge cases

### 04 - Edge Cases **[REQUIRED]**
Tests for precedence, ambiguity, and error handling.

**Coverage:**
- Code block precedence
- Inline code protection
- Escaped syntax
- Ambiguous positioning
- Malformed syntax
- Error recovery

### 05 - Integration **[RECOMMENDED]**
Tests for complex real-world documents combining multiple features.

**Coverage:**
- Complete landing pages
- Documentation pages
- Blog posts
- Portfolio pages
- Mixed content types

## AST Format

Taildown uses the **MDAST** (Markdown Abstract Syntax Tree) format with extensions:

```json
{
  "type": "root",
  "children": [
    {
      "type": "heading",
      "depth": 1,
      "children": [
        {
          "type": "text",
          "value": "Heading Text"
        }
      ],
      "data": {
        "hProperties": {
          "className": ["text-4xl", "font-bold"]
        }
      }
    }
  ]
}
```

### Taildown Extensions

**Inline Attributes:**
```json
{
  "data": {
    "hProperties": {
      "className": ["class-one", "class-two"]
    }
  }
}
```

**Component Blocks:**
```json
{
  "type": "containerDirective",
  "name": "card",
  "children": [...],
  "data": {
    "hName": "div",
    "hProperties": {
      "className": ["taildown-component", "component-card"],
      "data-component": "card"
    }
  }
}
```

## Conformance Levels

Implementations must pass tests according to their claimed conformance level:

- **Level 1 (Core)**: Categories 01, 02, 03
- **Level 2 (Standard)**: Categories 01, 02, 03, 04
- **Level 3 (Full)**: Categories 01, 02, 03, 04, 05

## Test Maintenance

### Updating Tests
When modifying tests:
1. Update `.td` input (or `.tdown`/`.taildown` if using alternative extension)
2. Update `.ast.json` expected output
3. Update corresponding section in `SYNTAX.md`
4. Add note to `SYNTAX.md` version history
5. Run full test suite to catch regressions

### Deprecating Tests
To deprecate a test:
1. Move to `deprecated/` subdirectory
2. Add `DEPRECATED:` note to file header
3. Update `SYNTAX.md` to note deprecation

## Contributing Tests

We welcome test contributions! Good test cases:
- Cover edge cases not currently tested
- Demonstrate real-world usage patterns
- Expose ambiguities in the specification
- Test error handling and recovery

See `CONTRIBUTING.md` for submission process.

## References

- **SYNTAX.md** - Canonical syntax specification
- **MDAST Specification** - https://github.com/syntax-tree/mdast
- **CommonMark Spec** - https://spec.commonmark.org/
- **remark-directive** - https://github.com/remarkjs/remark-directive

---

**Maintained by:** Taildown Core Team  
**Last Updated:** 2025-10-04
