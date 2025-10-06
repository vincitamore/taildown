# Taildown CodeMirror6 Syntax Highlighting

Professional-grade syntax highlighting for Taildown's complex nested structures, designed for both editor use and Obsidian plugin compatibility.

## Features

- **Complete Coverage**: Highlights all Taildown syntax elements while leaving content text unhighlighted
- **Complex Nesting**: Properly handles nested component blocks, attributes, and icons
- **Plain English Support**: Recognizes and highlights natural language styling keywords
- **Obsidian Ready**: Compatible with CodeMirror6 for future Obsidian plugin development
- **Professional Themes**: Includes both light and dark theme variants

## Architecture

### Components

1. **`codemirror6-language.ts`** - Main language definition with streaming parser
2. **`rehype-codemirror6.ts`** - Rehype plugin for HTML code block highlighting
3. **`index.ts`** - Public API exports

### Syntax Coverage

The highlighter recognizes and properly tokenizes:

#### Component Blocks
```taildown
:::card {elevated hover-lift}
Content here
:::
```

#### Inline Attributes
```taildown
# Heading {huge-bold center primary}
Text with styling {large muted relaxed-lines}
[Button](#){button primary large}
```

#### Icon Syntax
```taildown
:icon[star]{warning large}
:icon[check]{success}
:icon[home]
```

#### Plain English Keywords
- **Typography**: `huge-bold`, `large-muted`, `xl-bold`, `tight-lines`
- **Layout**: `center`, `padded-lg`, `flex-center`, `grid-3`
- **Effects**: `elevated`, `hover-lift`, `glass`, `fade-in`
- **Colors**: `primary`, `secondary`, `success`, `warning`, `error`
- **Sizes**: `xs`, `sm`, `lg`, `xl`, `2xl`, `huge`

#### Key-Value Attributes
```taildown
[Modal Trigger](#){button modal="Content here"}
[Tooltip](#){badge tooltip="Help text"}
```

## Usage

### In Compiler (Automatic)

The syntax highlighting is automatically applied to code blocks with `language-taildown` or `language-td`:

```html
<pre><code class="language-taildown">
:::card {elevated}
Content
:::
</code></pre>
```

### For Editors (CodeMirror6)

```typescript
import { taildown, taildownHighlightStyle } from '@taildown/compiler';
import { EditorView } from '@codemirror/view';

const editor = new EditorView({
  extensions: [
    taildown(),
    EditorView.theme(taildownHighlightStyle),
  ],
});
```

### For Obsidian Plugin

```typescript
import { taildownLanguage } from '@taildown/compiler';
import { LanguageSupport } from '@codemirror/language';

// Register with Obsidian's CodeMirror instance
const taildownSupport = new LanguageSupport(taildownLanguage);
```

## Token Types

The highlighter generates these token types for styling:

| Token Type | Usage | Example |
|------------|-------|---------|
| `punctuation` | Fences, brackets | `:::`, `{`, `}`, `[`, `]` |
| `tagName` | Component names | `card`, `grid`, `alert` |
| `keyword` | Component keywords | `button`, `badge`, `:icon` |
| `className` | CSS classes & variants | `.text-lg`, `primary`, `success` |
| `number` | Size keywords | `xs`, `lg`, `xl`, `2xl` |
| `function` | Animation keywords | `fade-in`, `hover-lift` |
| `emphasis` | Typography keywords | `bold`, `huge-bold` |
| `propertyName` | Layout keywords | `center`, `padded-lg` |
| `attributeName` | Decoration keywords | `rounded`, `shadow` |
| `string` | Attribute values | `"modal content"` |

## Themes

### Light Theme
Professional colors optimized for readability:
- Component names: Green (`#059669`)
- Keywords: Red (`#dc2626`)
- Variants: Blue (`#2563eb`)
- Sizes: Orange (`#ea580c`)

### Dark Theme
High-contrast colors for dark environments:
- Component names: Light green (`#34d399`)
- Keywords: Light red (`#f87171`)
- Variants: Light blue (`#60a5fa`)
- Sizes: Light orange (`#fb923c`)

## Philosophy

**Only content text should be unhighlighted** - Every syntax element receives appropriate highlighting, making it easy to distinguish between Taildown syntax and actual content that will appear in the rendered output.

## Performance

- **Streaming Parser**: Efficient character-by-character parsing
- **State Tracking**: Maintains context for nested structures
- **Minimal Overhead**: Only processes syntax elements, skips content text
- **Tree Shaking**: Only includes highlighting for used components

## Compatibility

- **CodeMirror6**: Full compatibility with latest version
- **Obsidian**: Ready for plugin integration
- **Browsers**: Works in all modern browsers
- **Node.js**: Server-side rendering support

## Migration from Prism.js

This implementation replaces the previous Prism.js integration with several advantages:

1. **Better Control**: Custom parser designed specifically for Taildown
2. **Obsidian Ready**: Native CodeMirror6 compatibility
3. **Professional Quality**: Consistent with modern editor standards
4. **Maintainable**: Single codebase for both editor and HTML highlighting

## Testing

Test files demonstrate comprehensive coverage:
- `test-codemirror6-syntax-highlighting.td` - Complete feature coverage
- `test-simple-syntax-highlighting.td` - Basic functionality verification

Both generate properly highlighted HTML with `<span class="token ...">` elements for all syntax components.