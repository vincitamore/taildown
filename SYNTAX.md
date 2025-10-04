# Taildown Syntax Specification

**Version:** 0.1.0  
**Date:** 2025-10-04  
**Status:** Canonical Reference  
**Stability:** Experimental (Pre-1.0)

---

## About This Document

This document is the **single source of truth** for Taildown syntax. All implementations, documentation, examples, and tests must conform to the rules defined here.

### Document Purpose

- **Canonical Reference**: The authoritative definition of what is and isn't valid Taildown syntax
- **Implementation Guide**: Parser implementations must match this specification exactly
- **Test Foundation**: All syntax tests are derived from examples in this document
- **Change Control**: All syntax changes must be documented here first

### Version Policy

- **Breaking changes** require a major version bump (e.g., 0.1.0 → 0.2.0 pre-1.0, or 1.0.0 → 2.0.0)
- **Additions** (backward compatible) require a minor version bump
- **Clarifications** (no behavioral change) require a patch version bump
- See `SYNTAX-CHANGES.md` for the change management process

### Conformance Levels

Implementations MUST implement all features marked:
- **[REQUIRED]** - Core syntax that must be supported
- **[RECOMMENDED]** - Should be supported for full compliance
- **[OPTIONAL]** - May be supported in future versions
- **[RESERVED]** - Syntax reserved for future use, currently invalid

---

## 1. Document Model

### 1.1 Document Structure **[REQUIRED]**

A Taildown document is a **superset of CommonMark Markdown** with extensions for styling and components.

**Grammar:**
```ebnf
document          ::= block*
block             ::= markdown_block | component_block
markdown_block    ::= heading | paragraph | list | code_block | blockquote | thematic_break | table
```

**Parsing Rule 1.1.1**: Valid CommonMark documents MUST parse identically in Taildown
```
Test: syntax-tests/fixtures/01-markdown-compatibility/
Note: Taildown files use .td extension (primary), with .tdown and .taildown also accepted.
```

**Parsing Rule 1.1.2**: Unknown extensions MUST be preserved as plain text (graceful degradation)

---

## 2. Inline Attributes

### 2.1 Syntax Definition **[REQUIRED]**

Inline attributes attach styling classes to block-level and inline elements using curly brace notation.

**Grammar:**
```ebnf
element_with_attrs ::= element SPACE? attribute_block
attribute_block    ::= "{" class_list "}"
class_list         ::= class (SPACE class)*
class              ::= "." class_name
class_name         ::= [a-zA-Z0-9_-]+
```

**Examples:**
```taildown
# Heading with attributes {.text-4xl .font-bold .text-center}

Paragraph with attributes {.text-gray-700 .leading-relaxed}

[Link text](url){.button .primary}
```

### 2.2 Parsing Rules

**Rule 2.2.1 - Attribute Position**: Attributes MUST appear:
- At the **end** of heading text (same line)
- At the **end** of paragraph text (last inline element)
- Immediately **after** link closing parenthesis `](url){attrs}`
- No intervening whitespace except a single space before `{`

**Rule 2.2.2 - Class Syntax**: Each class MUST:
- Start with a dot `.`
- Contain only alphanumeric characters, hyphens, and underscores
- Not start with a digit after the dot (`.0invalid` is invalid)

**Rule 2.2.3 - Multiple Classes**: Classes are space-separated within braces:
```taildown
Valid:   {.class-one .class-two .class-three}
Invalid: {.class-one, .class-two}          # No commas
Invalid: {.class-one}{.class-two}          # Single block only
```

**Rule 2.2.4 - Whitespace Handling**:
```taildown
Valid:   {.class-one .class-two}           # Single space
Valid:   {.class-one  .class-two}          # Multiple spaces (normalized to single)
Valid:   { .class-one .class-two }         # Spaces inside braces (trimmed)
Invalid: { .class-one
           .class-two }                    # No newlines inside attribute block
```

**Rule 2.2.5 - Attribute Extraction**: When parsing:
1. Scan backwards from end of text content
2. Match pattern `\s*\{[^}]+\}\s*$`
3. Extract classes from matched block
4. Remove attribute syntax from text content
5. Attach classes to element's metadata

**Rule 2.2.6 - No Attributes Found**: If no valid attribute block is found, element has no classes

### 2.3 Supported Elements **[REQUIRED]**

Inline attributes MAY be applied to:
- **Headings** (h1-h6): `# Text {.class}`
- **Paragraphs**: `Text {.class}`
- **Links**: `[text](url){.class}`
- **Images**: `![alt](url){.class}` **[RECOMMENDED]**
- **Lists**: List items inherit from list marker **[OPTIONAL]**

### 2.4 Edge Cases

**Edge Case 2.4.1 - Literal Braces**: To include literal `{.class}` in text without parsing:
```taildown
Use backticks: `{.not-a-class}`
Use code block: \`\`\`{.not-a-class}\`\`\`
```

**Edge Case 2.4.2 - Empty Attribute Block**:
```taildown
# Heading {}                    # Valid, no classes applied
# Heading {  }                  # Valid, no classes applied
```

**Edge Case 2.4.3 - Malformed Attributes**:
```taildown
# Heading {class-without-dot}   # Invalid: treated as plain text
# Heading {.class                # Invalid: unclosed brace, treated as plain text
# Heading .class}                # Invalid: no opening brace, treated as plain text
```

**Edge Case 2.4.4 - Nested Braces**:
```taildown
# Heading {.outer {.nested}}    # Invalid: no nesting allowed
                                 # Parses as: classes = ["outer", "{", "nested}"]
                                 # Implementation note: Second '{' stops class parsing
```

**Edge Case 2.4.5 - Attributes in Code**:
```taildown
`code {.not-parsed}`             # Attributes NOT parsed in inline code
\`\`\`
code block {.not-parsed}
\`\`\`                            # Attributes NOT parsed in code blocks
```

### 2.5 Test Coverage

```
Test fixtures:
- syntax-tests/fixtures/02-inline-attributes/01-headings.td
- syntax-tests/fixtures/02-inline-attributes/02-paragraphs.td
- syntax-tests/fixtures/02-inline-attributes/03-links.td
- syntax-tests/fixtures/02-inline-attributes/04-edge-cases.td
```

---

## 3. Component Blocks

### 3.1 Syntax Definition **[REQUIRED]**

Component blocks are fenced containers that group content and apply pre-defined component styling.

**Grammar:**
```ebnf
component_block   ::= fence_open component_content fence_close
fence_open        ::= ":::" component_name attribute_block? NEWLINE
fence_close       ::= NEWLINE ":::"
component_name    ::= [a-z][a-z0-9-]*
component_content ::= block*
```

**Examples:**
```taildown
:::card
Content inside a card component
:::

:::card {.shadow-xl .rounded-lg}
Card with custom attributes
:::

:::grid
:::card
Nested component 1
:::
:::card
Nested component 2
:::
:::
```

### 3.2 Parsing Rules

**Rule 3.2.1 - Fence Markers**: Component fences MUST:
- Use exactly three colons `:::`
- Appear at the start of a line (no leading whitespace)
- Be followed by component name on same line (open fence)
- Appear alone on closing line (close fence)

**Rule 3.2.2 - Component Names**: Component names MUST:
- Start with a lowercase letter `[a-z]`
- Contain only lowercase letters, digits, and hyphens `[a-z0-9-]*`
- Not start or end with a hyphen
- Not contain consecutive hyphens

```taildown
Valid:   :::card
Valid:   :::grid-item
Valid:   :::card2
Invalid: :::Card              # Uppercase not allowed
Invalid: :::-card             # Cannot start with hyphen
Invalid: :::card-             # Cannot end with hyphen
Invalid: :::grid--item        # No consecutive hyphens
Invalid: :::2card             # Cannot start with digit
```

**Rule 3.2.3 - Attributes on Components**: Attributes MAY be added to component fence:
```taildown
:::component-name {.class-one .class-two}
Content
:::
```

Rules from Section 2.2 apply, except:
- Attributes appear on same line as fence open, after component name
- One space required between component name and attribute block

**Rule 3.2.4 - Component Nesting**: Components MAY be nested:
```taildown
:::outer
Content in outer
  :::inner
  Content in inner
  :::
More content in outer
:::
```

Parsing rules:
- Fence close `:::` closes the most recently opened component
- Nesting depth is unlimited
- Indentation is NOT significant for fence markers

**Rule 3.2.5 - Unclosed Components**:
```taildown
:::card
Content without closing fence
```

Behavior: Implementation MUST either:
1. Auto-close at document end (RECOMMENDED), OR
2. Emit a parse error/warning

**Rule 3.2.6 - Empty Components**:
```taildown
:::card
:::
```
Valid: Empty components are allowed and render as empty containers

### 3.3 Component Content

**Rule 3.3.1 - Content Parsing**: Content inside components is parsed as standard Taildown:
- Markdown blocks
- Inline attributes
- Nested components

**Rule 3.3.2 - Indentation**: Content indentation is NOT significant:
```taildown
:::card
No indent
:::

:::card
  Two space indent
:::

:::card
    Four space indent
:::
```
All three are equivalent; indentation is for readability only.

### 3.4 Standard Components **[REQUIRED]**

Phase 1 requires these components:

| Component | Purpose | Default Classes |
|-----------|---------|----------------|
| `card` | Content card | Padding, shadow, rounded corners |
| `grid` | Grid layout | CSS Grid with gap |
| `container` | Max-width container | Centered, constrained width |

**Note**: Component default classes are defined in implementation, not syntax spec.

### 3.5 Edge Cases

**Edge Case 3.5.1 - Incomplete Fence**:
```taildown
::card                          # Two colons: NOT a component fence
::::card                        # Four colons: NOT a component fence
::: card                        # Space before name: NOT a component fence (treated as text)
```

**Edge Case 3.5.2 - Component Name in Content**:
```taildown
:::card
The word :::card inside content is treated as plain text, not a fence.
:::
```
Rule: Fences must start at beginning of line (column 0).

**Edge Case 3.5.3 - Mismatched Components**:
```taildown
:::card
:::grid                         # Closes card (first-opened, first-closed)
```
The `:::grid` closes the `:::card` (fence close doesn't need to match name).

**Edge Case 3.5.4 - Code Block Interaction**:
````taildown
:::card
```
Code block can contain ::: without closing component
```
:::
````
Rule: Code blocks take precedence; content inside code blocks is not parsed for component fences.

### 3.6 Test Coverage

```
Test fixtures:
- syntax-tests/fixtures/03-component-blocks/01-basic.td
- syntax-tests/fixtures/03-component-blocks/02-attributes.td
- syntax-tests/fixtures/03-component-blocks/03-nesting.td
- syntax-tests/fixtures/03-component-blocks/04-edge-cases.td
```

---

## 4. Reserved Syntax

### 4.1 Icon Syntax **[RESERVED]**

Reserved for future use:
```taildown
:icon[icon-name]
:icon[icon-name]{.class}
```

**Current behavior**: Parsers MUST treat this as plain text in v0.1.0

### 4.2 Directive Syntax **[RESERVED]**

Reserved for future use:
```taildown
::directive-name
content
::
```

Two colons (vs three for components) reserved for future directives.

### 4.3 Frontmatter **[RESERVED]**

Reserved for future use:
```taildown
---
key: value
---
```

YAML frontmatter syntax reserved for metadata in future versions.

### 4.4 Extended Attributes **[RESERVED]**

Reserved for future use:
```taildown
{#id .class key="value"}
```

ID and key-value attributes reserved for future versions.

---

## 5. Character Encoding & Escaping

### 5.1 Character Encoding **[REQUIRED]**

**Rule 5.1.1**: Taildown documents MUST be encoded in **UTF-8**

**Rule 5.1.2**: Implementations MUST support the full Unicode character set in content

### 5.2 Escaping **[REQUIRED]**

**Rule 5.2.1**: Taildown inherits CommonMark escaping rules:
- Backslash `\` escapes special characters
- Escaped characters are treated as literals

```taildown
\# Not a heading                # Renders as: # Not a heading
\:::card                        # Renders as: :::card (not a component)
\{.not-a-class}                 # Renders as: {.not-a-class}
```

**Rule 5.2.2**: Inside code blocks and inline code, escaping is NOT processed:
```taildown
`\# Not escaped`                # Renders with backslash: \# Not escaped
```

---

## 6. Whitespace & Line Endings

### 6.1 Line Endings **[REQUIRED]**

**Rule 6.1.1**: Implementations MUST accept:
- Unix line endings (`\n`)
- Windows line endings (`\r\n`)
- Legacy Mac line endings (`\r`)

**Rule 6.1.2**: Implementations SHOULD normalize to `\n` internally

### 6.2 Trailing Whitespace **[REQUIRED]**

**Rule 6.2.1**: Trailing whitespace on lines is NOT significant (except for CommonMark line breaks)

**Rule 6.2.2**: Trailing whitespace inside attribute blocks is trimmed:
```taildown
{.class }                       # Equivalent to: {.class}
```

### 6.3 Blank Lines **[REQUIRED]**

**Rule 6.3.1**: Blank lines separate blocks (standard Markdown behavior)

**Rule 6.3.2**: Multiple consecutive blank lines are equivalent to one blank line

---

## 7. Precedence & Ambiguity Resolution

### 7.1 Parsing Precedence **[REQUIRED]**

When multiple interpretations are possible, precedence (highest to lowest):

1. **Code blocks** (fenced and indented)
2. **Inline code** (backticks)
3. **Component blocks** (:::)
4. **Inline attributes** ({.class})
5. **Standard Markdown** (headings, lists, etc.)

**Example:**
````taildown
```
:::card {.class}                # Treated as code content, not component
```
````

### 7.2 Ambiguity Resolution **[REQUIRED]**

**Rule 7.2.1**: When attribute syntax appears in invalid position, treat as literal text:
```taildown
{.invalid} # Heading            # Classes at start: treated as plain text
```

**Rule 7.2.2**: When component fence is malformed, treat as paragraph:
```taildown
::: card                        # Space after :::, treated as paragraph starting with :::
```

**Rule 7.2.3**: When in doubt, prefer standard Markdown interpretation (principle of least surprise)

---

## 8. Error Handling

### 8.1 Error Philosophy **[REQUIRED]**

Taildown follows the **robustness principle**:
- Be lenient in what you accept (parse liberally)
- Be strict in what you produce (validate strictly)

### 8.2 Error Levels

**Parse Errors**: Syntax that cannot be parsed
- **Action**: Treat as plain text, optionally emit warning
- **Example**: Unclosed attribute block `{.class`

**Validation Warnings**: Valid syntax but potentially problematic
- **Action**: Parse normally, emit warning
- **Example**: Unclosed component block at EOF

**Semantic Errors**: Valid syntax but invalid semantics (implementation-specific)
- **Action**: Parse normally, renderer decides behavior
- **Example**: Unknown component name `:::unknown-component`

### 8.3 Error Recovery **[RECOMMENDED]**

Implementations SHOULD:
- Continue parsing after errors when possible
- Collect all errors/warnings in document
- Provide error positions (line, column) when possible

---

## 9. Conformance Testing

### 9.1 Test Fixtures **[REQUIRED]**

The `syntax-tests/fixtures/` directory contains canonical test cases:

```
syntax-tests/fixtures/
├── 01-markdown-compatibility/    # CommonMark compatibility
├── 02-inline-attributes/          # Inline attribute syntax
├── 03-component-blocks/           # Component block syntax
├── 04-edge-cases/                 # Edge cases & error handling
└── 05-integration/                # Complex real-world documents
```

Each test case consists of:
- **Input**: `.td` file with source (also accepts `.tdown` and `.taildown`)
- **Expected AST**: `.ast.json` file with expected abstract syntax tree
- **Expected HTML**: `.html` file with expected output (Phase 1+)
- **Expected CSS**: `.css` file with expected styles (Phase 1+)

### 9.2 Conformance Levels

**Level 1 - Core Conformance**: 
- All `[REQUIRED]` features
- Pass all tests in: 01, 02, 03

**Level 2 - Standard Conformance**:
- All `[REQUIRED]` and `[RECOMMENDED]` features
- Pass all tests in: 01, 02, 03, 04

**Level 3 - Full Conformance**:
- All features (including `[OPTIONAL]`)
- Pass all tests in: 01, 02, 03, 04, 05

### 9.3 Test Naming Convention

Test files follow the pattern:
```
NN-category-name/
  ├── NN-test-name.td
  ├── NN-test-name.ast.json
  ├── NN-test-name.html
  └── NN-test-name.css

Note: Test files use .td extension (primary). The compiler also accepts
.tdown and .taildown extensions for backward compatibility.
```

Where `NN` is a zero-padded number (01, 02, etc.)

---

## 10. Implementation Notes

### 10.1 Parser Architecture

Recommended approach:
1. **Lexer/Tokenizer**: CommonMark + Taildown extensions
2. **Parser**: Build AST matching CommonMark structure
3. **Transformer**: Resolve attributes and components
4. **Renderer**: Generate HTML/CSS output

### 10.2 AST Extensions

Taildown extends the CommonMark/MDAST AST with:

```typescript
// Additional node data
interface TaildownNodeData {
  hProperties?: {
    className?: string[];      // Classes from inline attributes
  };
  component?: {
    name: string;              // Component name
    attributes: string[];      // Component attributes
  };
}
```

### 10.3 Attribute Storage

Attributes should be stored in node metadata, following rehype conventions:
```javascript
{
  type: 'heading',
  depth: 1,
  children: [...],
  data: {
    hProperties: {
      className: ['text-4xl', 'font-bold']
    }
  }
}
```

---

## 11. Version History

### v0.1.0 (2025-10-04) - Initial Specification

**Added:**
- Document structure definition
- Inline attribute syntax (headings, paragraphs, links)
- Component block syntax (card, grid, container)
- Character encoding rules
- Whitespace handling
- Precedence and ambiguity resolution
- Error handling philosophy
- Conformance testing framework

**Reserved:**
- Icon syntax `:icon[]`
- Directive syntax `::`
- Frontmatter `---`
- Extended attributes `{#id key="value"}`

---

## 12. References

### 12.1 Standards

- **CommonMark Specification**: https://spec.commonmark.org/
- **MDAST** (Markdown AST): https://github.com/syntax-tree/mdast
- **Pandoc Attributes**: https://pandoc.org/MANUAL.html#extension-attributes
- **Djot Markup**: https://djot.net/

### 12.2 Related Documents

- `README.md` - User-facing overview and quick start
- `tech-spec.md` - Technical architecture and implementation guide
- `phase-1-implementation-plan.md` - Phase 1 development plan
- `SYNTAX-CHANGES.md` - Process for proposing syntax changes

---

## 13. Contributing to This Specification

### 13.1 Proposing Changes

All syntax changes must follow the process in `SYNTAX-CHANGES.md`:

1. Open an issue describing the proposed change
2. Discuss rationale and alternatives
3. Create test fixtures demonstrating desired behavior
4. Update this specification
5. Implement in reference parser
6. Update all documentation

### 13.2 Specification Maintenance

This document is maintained as part of the Taildown repository:
- **Location**: `SYNTAX.md` at repository root
- **Format**: Markdown (this document is itself Taildown-compatible!)
- **Review**: All PRs touching syntax require maintainer review

---

**End of Taildown Syntax Specification v0.1.0**

---

## Document Meta

- **Maintained by**: Taildown Core Team
- **Discussion**: GitHub Discussions
- **Issues**: GitHub Issues with label `syntax`
- **License**: CC BY 4.0 (documentation), MIT (code examples)
