# VS Code Extension Plan for Taildown

## Overview

This document outlines the strategy for building a VS Code extension for Taildown, leveraging our Shiki integration work. Since we now use Shiki (which is built on TextMate grammars - the same technology VS Code uses), we can share language definitions between our compiler and the extension.

---

## Strategic Alignment with Shiki

### Why This Matters

1. **Shared Technology**: Shiki uses TextMate grammars, which are VS Code's native format for syntax highlighting
2. **Consistency**: Users will see identical highlighting in VS Code as in compiled output
3. **Maintenance**: Single source of truth for Taildown syntax patterns
4. **Quality**: VS Code-quality highlighting with minimal effort

### Current State

- ✅ Shiki integrated into compiler (`packages/compiler/src/syntax-highlighting/shiki-highlighter.ts`)
- ✅ CodeMirror 6 for Taildown syntax highlighting (regex-based, works great)
- ✅ 180+ languages supported via Shiki for code blocks
- ❌ No VS Code extension yet
- ❌ No TextMate grammar for Taildown yet

---

## Architecture

### Component Structure

```
vscode-taildown/
├── package.json                    # Extension manifest
├── syntaxes/
│   └── taildown.tmLanguage.json   # TextMate grammar for .td files
├── language-configuration.json     # Brackets, comments, auto-closing
├── themes/
│   ├── taildown-dark.json         # Dark theme (optional)
│   └── taildown-light.json        # Light theme (optional)
├── snippets/
│   └── taildown.json              # Code snippets for common patterns
└── extension.js                    # Extension entry point (optional)
```

---

## Phase 1: TextMate Grammar for Taildown

### Goal

Create `taildown.tmLanguage.json` that provides syntax highlighting for `.td` files in VS Code.

### Approach

Convert our existing CodeMirror 6 regex patterns (from `rehype-codemirror6.ts`) to TextMate grammar format.

### Current CodeMirror Patterns (Reference)

```typescript
// From packages/compiler/src/syntax-highlighting/rehype-codemirror6.ts
const headingRegex = /^(#{1,6})\s+(.*)$/;
const codeBlockRegex = /^```(\w+)?/;
const strongRegex = /\*\*([^*]+?)\*\*/g;
const emphasisRegex = /(?<!\*)\*([^*]+?)\*(?!\*)/g;
const inlineCodeRegex = /`([^`]+?)`/g;
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
const directiveRegex = /^:::(\w+)(?:\s+\{([^}]+)\})?/;
// ... and many more
```

### TextMate Grammar Structure

```json
{
  "scopeName": "source.taildown",
  "name": "Taildown",
  "fileTypes": ["td", "taildown"],
  "patterns": [
    { "include": "#heading" },
    { "include": "#fenced-code-block" },
    { "include": "#directive" },
    { "include": "#inline-attributes" },
    { "include": "#inline-formatting" },
    { "include": "#links" },
    { "include": "#icons" }
  ],
  "repository": {
    "heading": {
      "match": "^(#{1,6})\\s+(.*)$",
      "captures": {
        "1": { "name": "punctuation.definition.heading.taildown" },
        "2": { "name": "entity.name.section.taildown" }
      }
    },
    "directive": {
      "match": "^(:::)(\\w+)(?:\\s+(\\{[^}]+\\}))?",
      "captures": {
        "1": { "name": "punctuation.definition.directive.taildown" },
        "2": { "name": "entity.name.tag.directive.taildown" },
        "3": { "name": "meta.attribute-block.taildown" }
      }
    },
    "inline-attributes": {
      "match": "\\{([^}]+)\\}",
      "name": "meta.attribute-block.taildown",
      "captures": {
        "1": { "name": "entity.other.attribute-name.taildown" }
      }
    }
    // ... more patterns
  }
}
```

### Key Patterns to Implement

1. **Headings** (`# Title {large-bold primary}`)
2. **Directives** (`:::card {glass elevated}`)
3. **Inline Attributes** (`{red bold center}`)
4. **Icons** (`:icon[name]{size variant}`)
5. **Code Fences** (with language detection)
6. **Links** (`[text](url){badge}`)
7. **Inline Formatting** (`**bold**`, `*italic*`, `~~strike~~`)
8. **Horizontal Rules** (`---`)
9. **Lists** (ordered, unordered, task lists)
10. **Tables** (GFM syntax)
11. **Block Attributes** (attributes following blocks)

---

## Phase 2: Language Configuration

### `language-configuration.json`

Defines editor behavior for Taildown files:

```json
{
  "comments": {
    "lineComment": "//",
    "blockComment": ["<!--", "-->"]
  },
  "brackets": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  "autoClosingPairs": [
    { "open": "{", "close": "}" },
    { "open": "[", "close": "]" },
    { "open": "(", "close": ")" },
    { "open": "**", "close": "**" },
    { "open": "*", "close": "*", "notIn": ["string"] },
    { "open": "`", "close": "`" },
    { "open": "\"", "close": "\"" },
    { "open": "'", "close": "'" }
  ],
  "surroundingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["**", "**"],
    ["*", "*"],
    ["`", "`"],
    ["\"", "\""],
    ["'", "'"]
  ],
  "folding": {
    "markers": {
      "start": "^\\s*<!--\\s*#region",
      "end": "^\\s*<!--\\s*#endregion"
    }
  }
}
```

---

## Phase 3: Code Snippets

### `snippets/taildown.json`

Common patterns for faster authoring:

```json
{
  "Card Component": {
    "prefix": "card",
    "body": [
      ":::card {${1:glass padded}}",
      "$0",
      ":::"
    ],
    "description": "Insert a card component"
  },
  "Grid Layout": {
    "prefix": "grid",
    "body": [
      ":::grid {cols-${1:3}}",
      "$0",
      ":::"
    ],
    "description": "Insert a grid layout"
  },
  "Image Comparison": {
    "prefix": "compare",
    "body": [
      ":::compare-images {${1:horizontal} ${2:md}}",
      "before: ${3:https://example.com/before.jpg}",
      "after: ${4:https://example.com/after.jpg}",
      "alt: ${5:Comparison description}",
      ":::"
    ],
    "description": "Insert image comparison slider"
  },
  "Code Diff": {
    "prefix": "diff",
    "body": [
      ":::diff {${1:side-by-side}}",
      "\\`\\`\\`${2:javascript}",
      "// Before",
      "$3",
      "\\`\\`\\`",
      "",
      "\\`\\`\\`${2:javascript}",
      "// After",
      "$0",
      "\\`\\`\\`",
      ":::"
    ],
    "description": "Insert code diff component"
  },
  "Icon": {
    "prefix": "icon",
    "body": [":icon[${1:check}]{${2:success}}"],
    "description": "Insert an icon"
  },
  "Heading with Attributes": {
    "prefix": "h",
    "body": ["## ${1:Title} {${2:large-bold primary}}"],
    "description": "Insert heading with attributes"
  }
}
```

---

## Phase 4: Extension Features (Optional)

### Basic Extension (`extension.js`)

Minimal features for a first release:

1. **File Type Association**: Register `.td` and `.taildown` extensions
2. **Language Server (Future)**: Provide autocomplete, diagnostics, hover info
3. **Preview Command**: Compile and preview Taildown in VS Code
4. **Snippet Contributions**: Register snippets
5. **Theme Integration**: Ensure colors work with VS Code themes

### Advanced Features (Future Roadmap)

1. **IntelliSense**: Autocomplete for component names, variants, attributes
2. **Diagnostics**: Real-time linting for invalid syntax
3. **Hover Documentation**: Show component documentation on hover
4. **Go to Definition**: Jump to component definitions
5. **Refactoring**: Rename components, extract to reusable blocks
6. **Live Preview**: Split-pane preview with hot reload
7. **Component Palette**: Visual picker for inserting components

---

## Implementation Steps

### Step 1: Create TextMate Grammar (Week 1)

1. Create new repository `vscode-taildown`
2. Set up basic extension structure
3. Convert CodeMirror patterns to TextMate format
4. Test grammar with sample `.td` files
5. Iterate on highlighting accuracy

**Resources:**
- [VS Code Language Extensions Guide](https://code.visualstudio.com/api/language-extensions/overview)
- [TextMate Grammar Guide](https://macromates.com/manual/en/language_grammars)
- [Shiki Language Sources](https://github.com/shikijs/shiki/tree/main/packages/shiki/languages)

### Step 2: Package Extension (Week 2)

1. Create `package.json` manifest
2. Add language configuration
3. Add code snippets
4. Test in VS Code development mode
5. Publish to VS Code Marketplace

**Manifest Example:**

```json
{
  "name": "taildown",
  "displayName": "Taildown Language Support",
  "description": "Syntax highlighting for Taildown markup language",
  "version": "0.1.0",
  "publisher": "your-publisher-name",
  "engines": {
    "vscode": "^1.75.0"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [{
      "id": "taildown",
      "aliases": ["Taildown", "taildown"],
      "extensions": [".td", ".taildown"],
      "configuration": "./language-configuration.json"
    }],
    "grammars": [{
      "language": "taildown",
      "scopeName": "source.taildown",
      "path": "./syntaxes/taildown.tmLanguage.json"
    }],
    "snippets": [{
      "language": "taildown",
      "path": "./snippets/taildown.json"
    }]
  }
}
```

### Step 3: Advanced Features (Future)

1. Implement Language Server Protocol (LSP)
2. Add preview command using `@taildown/compiler`
3. Create component library view
4. Add configuration options
5. Integrate with VS Code themes

---

## Testing Strategy

### Manual Testing

1. Open sample `.td` files in VS Code
2. Verify syntax highlighting matches compiled output
3. Test snippets for all common patterns
4. Check bracket matching and auto-closing
5. Verify folding works correctly
6. Test with different VS Code themes

### Automated Testing

1. Use `vscode-test` for integration tests
2. Test grammar patterns with fixture files
3. Validate extension activation
4. Test snippet expansions

---

## Maintenance Plan

### Keeping Grammar in Sync

**Strategy**: Single source of truth for Taildown syntax patterns

1. **Document Patterns**: Maintain a shared pattern reference (this could be in `SYNTAX.md`)
2. **Update Both**: When adding new Taildown syntax, update:
   - CodeMirror patterns in `rehype-codemirror6.ts`
   - TextMate grammar in `taildown.tmLanguage.json`
3. **Testing**: Compare highlighting visually between VS Code and compiled HTML

### Version Alignment

- Extension version should track compiler version
- Major Taildown syntax changes = extension major version bump
- Document breaking changes in extension changelog

---

## Success Metrics

### Phase 1 Goals (Basic Extension)

- ✅ `.td` files recognized by VS Code
- ✅ Syntax highlighting matches compiled output quality
- ✅ Common snippets available
- ✅ Bracket matching and auto-closing works
- ✅ Published to VS Code Marketplace
- ✅ 100+ downloads in first month

### Phase 2 Goals (Advanced Features)

- ✅ Language server with IntelliSense
- ✅ Live preview functionality
- ✅ Diagnostic messages for syntax errors
- ✅ 1,000+ downloads
- ✅ 4+ star rating

---

## Resources

### TextMate Grammar References

- [VS Code Language Extensions Guide](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
- [TextMate Language Grammars](https://macromates.com/manual/en/language_grammars)
- [Writing a TextMate Grammar: Lessons Learned](https://www.apeth.com/nonblog/stories/textmatebundle.html)
- [Scope Naming Conventions](https://www.sublimetext.com/docs/scope_naming.html)

### Example Grammars

- [Markdown Grammar](https://github.com/microsoft/vscode/blob/main/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json)
- [MDX Grammar](https://github.com/mdx-js/mdx-analyzer/blob/main/packages/vscode-mdx/syntaxes/mdx.tmLanguage.json)
- [Shiki Language Sources](https://github.com/shikijs/shiki/tree/main/packages/shiki/languages)

### Extension Development

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)
- [Extension Samples](https://github.com/microsoft/vscode-extension-samples)

---

## Next Steps

1. **Immediate**: Create TextMate grammar by converting CodeMirror patterns
2. **Short-term**: Package and publish basic extension (syntax highlighting + snippets)
3. **Medium-term**: Add language server for IntelliSense and diagnostics
4. **Long-term**: Implement live preview and visual component picker

This plan aligns with our Shiki integration and provides a clear path from basic syntax highlighting to a full-featured VS Code extension.

