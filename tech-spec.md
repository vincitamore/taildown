# Taildown - Technical Specification

**Version:** 0.3.0  
**Date:** 2025-10-05  
**Status:** Living Document

---

## Executive Summary

Taildown is a markup language that extends Markdown with Tailwind CSS-inspired styling directives and component systems. It enables developers and content creators to build beautiful, responsive web layouts using plain English commands while maintaining readability. The project consists of three main components: a syntax specification, a compilation engine, and a lightweight editor with live preview.

---

## 1. Project Vision & Goals

### 1.1 Vision Statement
Create a human-readable markup language that bridges the gap between simple Markdown and complex web development, enabling rapid prototyping and content creation with modern UI/UX standards.

### 1.2 Core Goals (Implementation Status)
- ✅ **Readability First**: Syntax remains as readable as Markdown
- ✅ **Plain English Styling**: Natural language replaces CSS classes (`huge-bold primary`)
- ✅ **Zero Config Beauty**: Default styles are production-ready with glassmorphism
- ✅ **Component Rich**: 18+ pre-built components implemented
- ✅ **Interactive Components**: Tabs, accordion, carousel, modal, tooltip with zero config
- ✅ **Attachable Components**: One-line modal/tooltip attachment to ANY element
- ✅ **Responsive by Default**: All layouts automatically adapt (mobile → tablet → desktop)
- ✅ **JavaScript Generation**: Tree-shaken vanilla JS (~2-5KB) for interactive components
- ✅ **Fast Compilation**: Sub-100ms compile times achieved (66ms for 1000 nodes)
- ✅ **Icon Integration**: Lucide icon support with `:icon[name]{attributes}` syntax
- ✅ **Modern Effects**: Glassmorphism and smooth entrance animations

### 1.3 Target Users
- Technical writers
- Documentation authors
- Rapid prototypers
- Content creators with design sensibility
- Developers building landing pages/static sites

---

## 2. Syntax Specification

> **📖 Canonical Syntax Reference**: This section provides an overview of Taildown syntax. For the complete, authoritative specification, see [`SYNTAX.md`](SYNTAX.md), which serves as the single source of truth for all syntax rules, grammar, and edge cases.

### 2.1 Core Principles

1. **Backward Compatible**: Standard Markdown should work without modification
2. **Progressive Enhancement**: Add styling with inline directives or blocks
3. **Natural Language**: Use descriptive terms (e.g., "blue-primary" not "#3b82f6")
4. **Component-Based**: Reusable patterns with simple invocation
5. **Semantic Clarity**: Syntax conveys both structure and intent

### 2.2 Syntax Extensions

> **Note**: The examples below are illustrative. For precise parsing rules, grammar definitions, and edge case handling, always refer to [`SYNTAX.md`](SYNTAX.md).

#### 2.2.1 Style Attributes (Inline)
Extend Markdown with curly brace attributes inspired by Pandoc/Djot:

```taildown
# Heading with style {.text-blue-600 .text-4xl .font-bold}

This is a paragraph {.text-gray-700 .leading-relaxed}

[Button Text](#link){.button .button-primary .shadow-lg}
```

#### 2.2.2 Component Blocks
Use fence-style blocks for complex components:

```taildown
:::card {.shadow-xl .hover-lift .border-radius-lg}
## Card Title {.text-center}

Card content goes here with automatic padding and styling.

[Learn More](#){.button .button-primary}
:::

:::grid {.cols-3 .gap-4 .responsive}
:::card
Content 1
:::

:::card
Content 2
:::

:::card
Content 3
:::
:::
```

#### 2.2.3 Layout Directives
Special syntax for common layout patterns:

```taildown
::: container {.max-w-6xl .mx-auto .px-4}
# Page content is automatically containerized
:::

::: section {.bg-gradient-blue .py-16}
## Hero Section
:::

::: flex {.justify-between .items-center}
![Logo](logo.png)
[Sign In](#){.button}
:::
```

#### 2.2.4 Icon Integration
Simple icon syntax using Lucide icon names:

```taildown
:icon[heart] Love this feature
:icon[arrow-right]{.text-blue-500 .size-6}
:icon[github]{.inline} View on GitHub
```

#### 2.2.5 Style Shorthands (Plain English)
Human-readable style aliases:

```taildown
# Heading {primary large bold center}
// Translates to: text-primary text-4xl font-bold text-center

:::card {elevated rounded padded hover-lift}
// Translates to: shadow-xl rounded-lg p-6 hover:transform hover:scale-105 transition
:::

[Button Text](#){button primary large rounded-full}
// Translates to: btn btn-primary btn-lg rounded-full
```

### 2.3 Style System Vocabulary

#### 2.3.1 Color Palette (Semantic Naming)
- `primary`, `secondary`, `accent`, `neutral`
- `success`, `warning`, `error`, `info`
- `text-*`, `bg-*`, `border-*` prefixes
- Shade variants: `light`, `dark`, `muted`

#### 2.3.2 Spacing
- `tight`, `normal`, `relaxed`, `loose` (for line-height)
- `padded`, `padded-sm`, `padded-lg`, `padded-xl`
- `gap-*`, `space-*`

#### 2.3.3 Effects
- `shadow`, `elevated`, `floating` (shadow variations)
- `rounded`, `rounded-sm`, `rounded-lg`, `rounded-full`
- `hover-lift`, `hover-glow`, `hover-scale`
- `gradient-*` (common gradient presets)
- `blur`, `backdrop-blur`
- `3d`, `3d-card` (3D transform effects)

#### 2.3.4 Layout
- `flex`, `grid`, `cols-N`, `rows-N`
- `center`, `center-x`, `center-y`
- `responsive` (automatic breakpoint handling)
- `container`, `full-width`, `contained`

---

## 3. Technical Architecture

### 3.1 System Components

```
┌─────────────────┐
│  Taildown File  │
│     (.td)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Parser      │
│  (Lexer + AST)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Transformer   │
│ Style Resolver  │
│ + Registries    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Renderers    │
│  HTML + CSS +   │
│   JS Generator  │
└────────┬────────┘
         │
         ├──────────┬──────────┐
         ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │  .html │ │  .css  │ │  .js   │
    │ (HTML5)│ │(Scoped)│ │(Vanilla│
    └────────┘ └────────┘ │Tree-   │
                           │Shaken) │
                           └────────┘
```

### 3.2 Parser Architecture

**Technology Choice: Rust or JavaScript/TypeScript**

#### Option A: Rust Implementation
**Pros:**
- Blazing fast parsing (critical for large documents)
- Memory efficient
- Can compile to WASM for browser use
- Strong type system prevents bugs

**Cons:**
- Steeper learning curve
- Smaller ecosystem for Markdown parsers

**Recommended Crates:**
- `pulldown-cmark` - Fast Markdown parser
- `nom` or `pest` - Parser combinators
- `serde` - Serialization for AST
- `syntect` - Syntax highlighting

#### Option B: TypeScript Implementation
**Pros:**
- Easier ecosystem integration
- Rich Markdown tooling (unified, remark, rehype)
- Better for web-based editor
- More contributors can participate

**Cons:**
- Slower than Rust (but still acceptable)
- More memory overhead

**Recommended Packages:**
- `unified` - Plugin ecosystem
- `remark-parse` - Markdown AST
- `remark-directive` - Directive syntax
- `rehype` - HTML generation

**Recommendation:** Start with TypeScript for rapid prototyping, consider Rust compiler for v2.0 performance optimization.

### 3.3 Core Modules

#### 3.3.1 Lexer/Tokenizer
- Tokenize Taildown source into stream
- Recognize Markdown + extensions
- Handle nested structures
- Preserve source maps for error reporting

#### 3.3.2 Parser
- Build Abstract Syntax Tree (AST)
- Validate syntax correctness
- Handle ambiguous cases gracefully
- Extensible for future syntax additions

#### 3.3.3 Style Resolver
- Translate plain English → Tailwind classes
- Resolve style conflicts (last-wins or specificity)
- Apply default component styles
- Handle responsive variants
- Generate minimal CSS (tree-shaking)

#### 3.3.4 Component Library

**Implementation Status: 7 of 15+ components**

✅ **Implemented Components:**

- **Card** - Container with variants: flat, elevated, floating, outlined, bordered, interactive, glass effects (subtle-glass, light-glass, heavy-glass), sizes (sm, md, lg, xl)
- **Button** - Inline link styling with variants: primary, secondary, outline, ghost, link, destructive, success, warning; sizes (sm, md, lg, xl)
- **Alert** - Contextual messages with types: info, success, warning, error; sizes (sm, md, lg)
- **Badge** - Status indicators with variants: default, primary, success, warning, error, info; sizes (sm, md, lg)
- **Avatar** - Profile images with shapes: circular, square, rounded; sizes (xs, sm, md, lg, xl, 2xl)
- **Grid** - Responsive layout with auto-columns (1→2→3) or specified columns (1-5); gap variants: tight, normal, loose, extra-loose
- **Container** - Max-width with variants: narrow, normal, wide, extra-wide, full

⏳ **Planned Components (Phase 2):**

- **Tabs** - Tabbed content interface
- **Accordion** - Collapsible content panels
- **Modal/Dialog** - Overlay dialogs
- **Form elements** - Input, select, checkbox, radio
- **Navigation** - Navbar, sidebar, breadcrumbs
- **Pagination** - Page navigation
- **Progress** - Progress indicators
- **Skeleton** - Loading placeholders
- **Tooltip** - Hover tooltips

#### 3.3.5 Icon System ✅ IMPLEMENTED

**Syntax:** `:icon[icon-name]{attributes}`

**Features:**
- ✅ Lucide icon library integration (1000+ icons)
- ✅ Inline SVG injection with proper attributes
- ✅ Size variants: xs, sm, md, lg, xl, 2xl
- ✅ Color support via plain English: `{primary}`, `{success}`, `{warning}`, etc.
- ✅ Custom stroke width support
- ✅ Accessibility attributes (role, aria-hidden)

**Example:**
```taildown
:icon[check-circle]{success lg}
:icon[arrow-right]{primary xs}
:icon[heart]
```

#### 3.3.6 HTML/CSS Generator
- Semantic HTML5 output
- Modern CSS (Grid, Flexbox)
- Critical CSS inlining option
- Dark mode support
- Accessibility attributes (ARIA)

### 3.4 Configuration System

**taildown.config.js** or **taildown.config.json**

```javascript
export default {
  // Theme customization
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#ec4899'
    },
    fonts: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'Fira Code, monospace'
    }
  },
  
  // Component defaults
  components: {
    card: {
      defaultClasses: 'shadow-md rounded-lg p-6',
      variants: {
        elevated: 'shadow-xl',
        flat: 'shadow-none border'
      }
    },
    button: {
      defaultClasses: 'px-4 py-2 rounded transition',
      variants: {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-white'
      }
    }
  },
  
  // Output options
  output: {
    format: 'html', // html | html+css | react | vue
    minify: true,
    inlineStyles: false,
    darkMode: 'class' // class | media | false
  },
  
  // Plugin system
  plugins: [
    'taildown-plugin-animations',
    'taildown-plugin-charts'
  ]
}
```

---

### 3.5 JavaScript Generation Architecture

Taildown generates optimized vanilla JavaScript for interactive components using a tree-shaking system that only includes code for components actually used.

#### 3.5.1 Generation Pipeline

```
┌──────────────┐
│  HAST Tree   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Component Detection      │
│ - Scan for data-component│
│ - Find modal/tooltip refs│
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Tree-Shaking Decision    │
│ - Which components used? │
│ - Generate minimal set   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Behavior Assembly        │
│ - Include only needed JS │
│ - Wrap in IIFE           │
└──────┬───────────────────┘
       │
       ▼
┌──────────────┐
│ output.js    │
│ (~2-5KB)     │
└──────────────┘
```

**Location**: `packages/compiler/src/js-generator/`

**Behavior Modules**: Each interactive component has a self-contained behavior (~700-1200 bytes each).

**Tree-Shaking**: Only behaviors for components actually used are included in output.

**See SYNTAX.md §3.9 for complete JavaScript generation specification.**

---

### 3.6 Component Registry System

Registry system enables "define once, use everywhere" pattern for ID-referenced modals and tooltips.

**Architecture**:
```typescript
const modalRegistry = new Map<string, Element>();
const tooltipRegistry = new Map<string, Element>();

// Pre-pass: populate registries before HAST conversion
prepopulateRegistries(mdast);

// Lookup: during attachment processing
const content = modalRegistry.get(id);
```

**Two-Pass Rendering**:
1. **Pass 1**: Scan for `:::modal{id="..."}`, convert to HAST, store
2. **Pass 2**: Process attachments, lookup by ID, wrap triggers

**See SYNTAX.md §3.8 for ID-referenced component specification.**

---

### 3.7 Attachment System

Enables one-line modal/tooltip attachment to any element.

**Syntax**: `[Element](#){modal="content"}` or `{tooltip="content"}`

**Processing**:
1. Parser extracts key-value pairs from `{...}` blocks
2. Stored in `node.data.hProperties['data-modal-attach']`
3. Renderer calls `wrapWithAttachments(element, nodeData)`
4. Creates wrapper with trigger + modal/tooltip structure

**Wrapper Structure**:
- Trigger element (enhanced with data attributes)
- Modal/tooltip element (positioned, styled, ARIA)
- Event handlers (via generated JavaScript)

**See SYNTAX.md §2.8 for attachable component specification.**

---

### 3.8 Compilation Pipeline (Complete)

```
1. Parse:       Markdown → MDAST (remark-parse)
2. Directives:  Scan ::: → containerDirective nodes
3. Attributes:  Extract {attr} → node.data.hProperties
4. Registries:  Store :::modal{id="..."} content ⭐ NEW
5. MDAST→HAST:  Convert with custom handlers + attachments
6. Post-HAST:   Syntax highlighting, icons, class collection
7. Generate:    HTML + CSS + JS (tree-shaken) ⭐ NEW
8. Output:      .html + .css + .js (conditional) ⭐ NEW
```

**Key Innovation**: Registry pre-population (step 4) enables ID references to work correctly.

---

## 4. Editor Specification

### 4.1 Editor Features

**Core Requirements:**
- Split-pane: Source (left) + Live Preview (right)
- Syntax highlighting for Taildown
- Real-time compilation (debounced)
- Responsive preview (device simulation)
- Export to HTML/CSS
- File system integration

**Nice-to-Have:**
- Command palette (⌘K)
- Snippet library
- Component inspector
- Style picker (visual class selection)
- Accessibility checker
- Version control integration

### 4.2 Editor Technology Stack

**Option A: Web-Based (Electron or Tauri)**
- **Framework:** React or Svelte
- **Editor:** CodeMirror 6 or Monaco Editor
- **Styling:** Tailwind CSS (dogfooding)
- **Build:** Vite
- **Desktop:** Tauri (Rust) or Electron (if TypeScript parser)

**Option B: VS Code Extension**
- Leverage existing VS Code infrastructure
- Focus on language support and preview
- Faster time-to-market

**Recommendation:** Start with VS Code extension, build standalone editor in phase 2.

### 4.3 Editor Architecture

```
┌────────────────────────────────────────┐
│           Editor Window                │
├──────────────────┬─────────────────────┤
│                  │                     │
│   Source Pane    │   Preview Pane      │
│                  │                     │
│  ┌────────────┐  │  ┌──────────────┐   │
│  │  CodeMirror│  │  │   iframe     │   │
│  │  (Syntax   │  │  │  (Rendered   │   │
│  │  Highlight)│  │  │   Output)    │   │
│  │            │  │  │              │   │
│  └────────────┘  │  └──────────────┘   │
│                  │                     │
│  ┌────────────┐  │  ┌──────────────┐   │
│  │  Toolbar   │  │  │  Responsive  │   │
│  │  (Actions) │  │  │  Controls    │   │
│  └────────────┘  │  └──────────────┘   │
│                  │                     │
└──────────────────┴─────────────────────┘
         │                    │
         ▼                    ▼
    File System          Compiler API
```

### 4.4 VS Code Extension Features

**Language Support:**
- Syntax highlighting (TextMate grammar)
- IntelliSense for classes/components
- Auto-completion for icons
- Bracket matching
- Folding
- Error diagnostics

**Commands:**
- `Taildown: Preview` - Open preview pane
- `Taildown: Export HTML` - Save compiled output
- `Taildown: Insert Component` - Component picker
- `Taildown: Insert Icon` - Icon browser
- `Taildown: Toggle Device Preview` - Responsive testing

**Settings:**
- Theme selection
- Auto-save compilation
- Preview synchronization
- Custom config path

---

## 5. Implementation Roadmap

### Phase 1: Foundation ✅ COMPLETE (Weeks 1-4)

**Goal:** Proof of concept with basic syntax and compilation

**Deliverables:**
1. ✅ Syntax specification (v0.1.0 → v0.2.0)
2. ✅ Parser (unified + remark + rehype + remark-directive)
3. ✅ HTML/CSS generator with modern styling
4. ✅ CLI compiler tool with proper output handling
5. ✅ 10 example documents (basic + Phase 2 features)

**Technology Decisions:**
- ✅ **Chosen: TypeScript** (Node.js 18+)
- ✅ Monorepo structure with pnpm workspaces
- ✅ Vitest for testing
- ✅ tsup for building

**Success Criteria:**
- ✅ Parse standard Markdown correctly (CommonMark compliant)
- ✅ Support inline style attributes with plain English
- ✅ Generate semantic HTML5
- ✅ Compile in <100ms (achieved: 66ms for 1000 nodes)

### Phase 2: Component System 🚧 IN PROGRESS (Weeks 5-8)

**Goal:** Rich component library with styling system

**Completed Deliverables:**
1. ✅ Component library (7 of 15+ components)
2. ✅ Style resolver with 120+ plain English shorthands
3. ✅ Icon system (Lucide integration complete)
4. ✅ Configuration system (schema, loader, defaults)
5. ✅ Responsive layout engine (grid with breakpoints)
6. ✅ Glassmorphism system (subtle/light/heavy variants)
7. ✅ Animation system (entrance + hover effects)
8. ✅ VSCode extension for syntax highlighting
9. ✅ Modern code block styling with syntax highlighting

**In Progress:**
- ⏳ Additional 8 components (tabs, accordion, modal, etc.)
- ⏳ Dark mode system
- ⏳ Comprehensive test suite (currently 20+ syntax tests)
- ⏳ Documentation site

**Success Criteria (Progress):**
- ✅ 7/15 components working with variants
- ✅ Plain English resolution working correctly
- ✅ Responsive layouts working (1→2→3 columns)
- ✅ Config system architecture complete

### Phase 3: Editor (Weeks 9-12)
**Goal:** VS Code extension with live preview

**Deliverables:**
1. VS Code extension
2. Syntax highlighting
3. Live preview pane
4. IntelliSense/autocomplete
5. Command palette
6. Export functionality

**Success Criteria:**
- Extension installs from VSIX
- Preview updates in real-time (<500ms)
- Autocomplete suggests valid classes
- Export generates standalone HTML

### Phase 4: Enhancement (Weeks 13-16)
**Goal:** Polish, performance, and ecosystem

**Deliverables:**
1. Performance optimization
2. Plugin system
3. Standalone editor (Tauri app)
4. Theming system
5. Dark mode support
6. Animation presets
7. Comprehensive test suite
8. Video tutorials

**Success Criteria:**
- Compile 10,000 line doc <500ms
- Plugin API documented
- Standalone editor shipped
- 90%+ test coverage
- 10+ tutorial videos

### Phase 5: Community & Ecosystem (Ongoing)
**Goal:** Build community and extend ecosystem

**Activities:**
1. Public beta release
2. Documentation expansion
3. Community templates
4. Plugin marketplace
5. Integration with popular tools (Hugo, Next.js, etc.)
6. Conference talks/blog posts

---

## 6. Technology Stack Summary

### 6.1 Compiler Core ✅ IMPLEMENTED IN TYPESCRIPT

**Runtime & Core:**
- **Runtime:** Node.js 18+ (Required)
- **Language:** TypeScript 5.3+ with strict mode
- **Build Tool:** tsup (esbuild wrapper)
- **Package Manager:** pnpm 8+
- **Testing:** Vitest with coverage

**Parser Pipeline:**
- **Foundation:** `unified` (v11) - Pluggable content transformation
- **Markdown:** `remark-parse` (v11) - CommonMark parsing
- **Custom Directive Parser:** Built in-house to handle `:::` component syntax with proper blank line support (replaces remark-directive which doesn't handle our spec correctly)
- **Extensions:** `remark-gfm` (v4) - GitHub Flavored Markdown (tables, strikethrough)
- **HTML Transform:** `mdast-util-to-hast` (v13) - Markdown AST → HTML AST
- **HTML Generation:** `rehype-stringify` (v10) - HTML output
- **Syntax Highlighting:** `rehype-prism-plus` (v2) - Code block highlighting with custom Taildown language

**CSS Generation:**
- **Custom Resolver:** Plain English → CSS class mapping (120+ shorthands)
- **Utilities:** 224 Tailwind-inspired utility classes in `TAILWIND_UTILITIES` dictionary
- **Tree-shaking:** Only used classes included in output
- **Modern Features:** CSS Grid, Flexbox, backdrop-filter, transforms, animations
- **Global Styles:** Professional base styles with modern fonts (Inter, Fira Code)
- **Component Styles:** Glassmorphism and animation CSS generators

**Icons:**
- **Library:** `lucide` (v0.294+) - 1000+ SVG icons
- **Rendering:** Inline SVG injection with attributes
- **Parser:** Custom unified transformer for `:icon[name]` syntax

**Syntax Highlighting:**
- **Library:** `prismjs` (v1.30+) with `rehype-prism-plus`
- **Custom Language:** Taildown language definition registered with Prism
- **Theme:** One Dark Pro inspired color scheme for code blocks
- **Styling:** Terminal-framed code blocks with traffic lights and custom scrollbars

### 6.2 Actual Implementation Architecture ✅

The following describes the actual module structure as implemented in `packages/compiler/src/`:

**Parser Modules (`parser/`):**
- `index.ts` - Main parser entry, exports `parse()` and `parseWithWarnings()`
- `directive-scanner.ts` - Phase 1: Scans MDAST for `:::` fence markers
- `directive-builder.ts` - Phase 2: Builds component tree with stack-based nesting
- `directive-parser.ts` - Phase 3: Unified plugin that orchestrates scanning and building
- `directive-types.ts` - TypeScript types for directive AST nodes
- `attributes.ts` - Parses inline `{class1 class2}` attributes on elements
- `components.ts` - Transforms component directives into HTML-ready structure

**Resolver Modules (`resolver/`):**
- `style-resolver.ts` - Main resolver: plain English → CSS classes
- `shorthand-mappings.ts` - 120+ shorthand definitions (huge-bold, primary, etc.)
- `semantic-colors.ts` - Resolves semantic colors (primary, success, etc.)
- `variant-resolver.ts` - Component-specific variant resolution

**Component Modules (`components/`):**
- `component-registry.ts` - Singleton registry for all components
- `variant-system.ts` - Handles variant/size resolution and class merging
- `standard/card.ts` - Card component with 6 variants + 3 glass effects
- `standard/button.ts` - Button component with 8 variants
- `standard/alert.ts` - Alert component with 4 types
- `standard/badge.ts` - Badge component with 6 variants
- `standard/avatar.ts` - Avatar component with 3 shapes

**Theme Modules (`themes/`):**
- `glassmorphism.ts` - Glass effect configs and CSS generation (subtle/light/heavy)
- `animations.ts` - Entrance animations (fade, slide, zoom) and hover effects

**Icon Modules (`icons/`):**
- `icon-parser.ts` - Parses `:icon[name]{attrs}` syntax into AST nodes
- `icon-renderer.ts` - Converts icon nodes to inline SVG with attributes
- `lucide-icons.ts` - Extracts SVG paths from Lucide icon library

**Prism Modules (`prism/`):**
- `taildown-language.ts` - Custom Prism language definition for Taildown syntax
- `register-language-plugin.ts` - Rehype plugin to register language with Prism

**Renderer Modules (`renderer/`):**
- `index.ts` - Exports main render functions
- `html.ts` - HTML generation with unified/rehype pipeline
- `css.ts` - CSS generation with 224 utility classes, global styles, and tree-shaking

**Config Modules (`config/`):**
- `config-schema.ts` - Zod schema for `taildown.config.js` validation
- `config-loader.ts` - Loads and validates configuration files
- `default-config.ts` - Default theme and component configurations
- `theme-merger.ts` - Merges user config with defaults

**Main Entry (`index.ts`):**
- Exports `compile()` function - Main compilation API
- Orchestrates: parse → render CSS → render HTML
- Returns `CompileResult` with HTML, CSS, and metadata (time, node count, warnings)

### 6.3 Editor ✅ BASIC IMPLEMENTATION COMPLETE

**VS Code Extension (`.vscode/extensions/taildown/`):**
- **Type:** Grammar-only extension (no activation required)
- **Grammar:** TextMate grammar defined in JSON (`.tmLanguage.json`)
- **Scopes:** Custom scopes for components, icons, attributes, fences
- **Compatibility:** Uses standard TextMate scope names for theme support
- **Installation:** Manual copy to `~/.vscode/extensions/` directory
- **Features:**
  - Syntax highlighting for `:::` component fences
  - Icon directive highlighting (`:icon[name]`)
  - Inline attribute highlighting (`{classes}`)
  - Keyword recognition for variants, sizes, effects
  - Plain English shorthand recognition

**Implementation Files:**
- `package.json` - Extension manifest with language definition
- `syntaxes/taildown.tmLanguage.json` - TextMate grammar patterns
- `install-vscode-extension.ps1` - PowerShell installation script

**Standalone Editor:**
- **Framework:** Svelte or React
- **Editor Component:** CodeMirror 6
- **Desktop Shell:** Tauri
- **Styling:** Tailwind CSS
- **Build:** Vite

### 6.3 Component Library
- **Base Styles:** Tailwind CSS v3+
- **Inspiration:** shadcn/ui patterns
- **Icons:** Lucide React/Svelte
- **Animations:** Tailwind transitions + CSS transforms

### 6.4 Infrastructure
- **Monorepo:** Turborepo or Nx
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Package Manager:** pnpm
- **Documentation:** VitePress or Docusaurus (or Taildown itself!)
- **Website:** Built with Taildown (dogfooding)

---

## 7. Challenges & Considerations

### 7.1 Technical Challenges

**1. Parsing Ambiguity**
- **Challenge:** Distinguishing Markdown from Taildown extensions
- **Solution:** Use explicit delimiters (`::: ` for blocks, `{.}` for inline)

**2. CSS Bundle Size**
- **Challenge:** Tailwind can generate large CSS files
- **Solution:** Tree-shaking, only include used classes, critical CSS extraction

**3. Responsive Layouts**
- **Challenge:** Auto-generating responsive layouts is complex
- **Solution:** Define breakpoint rules, use CSS Grid/Flexbox defaults, `.responsive` flag

**4. Style Conflicts**
- **Challenge:** Multiple classes affecting same property
- **Solution:** Last-wins rule, specificity calculator, warning system

**5. Performance at Scale**
- **Challenge:** Large documents (10,000+ lines) slow compilation
- **Solution:** Incremental parsing, caching, worker threads

### 7.2 Design Challenges

**1. Syntax Balance**
- **Challenge:** Too verbose vs. too terse
- **Solution:** Provide both shorthands and explicit options

**2. Learning Curve**
- **Challenge:** Users need to learn new syntax
- **Solution:** Excellent docs, autocomplete, interactive tutorial

**3. Customization vs. Simplicity**
- **Challenge:** Power users want control, beginners want simplicity
- **Solution:** Sensible defaults, progressive disclosure, config file

### 7.3 Ecosystem Challenges

**1. Tooling Integration**
- **Challenge:** Integrate with existing static site generators
- **Solution:** Provide plugins for Hugo, Next.js, Gatsby, Astro

**2. Adoption**
- **Challenge:** Why use Taildown over MDX or regular Markdown?
- **Solution:** Clear value prop, showcase beautiful examples, better DX

**3. Maintenance**
- **Challenge:** Keeping up with Tailwind updates
- **Solution:** Abstraction layer, semantic classes, automated updates

---

## 8. Success Metrics

### 8.1 Technical Metrics
- **Compile Speed:** <100ms for typical doc (1000 lines)
- **Bundle Size:** <50KB for compiler (gzipped)
- **Output Size:** <150KB HTML+CSS (typical page)
- **Test Coverage:** >85%

### 8.2 User Metrics
- **Time to First Document:** <10 minutes (install → first render)
- **Learning Curve:** 80% of users productive within 1 hour
- **Adoption:** 1,000+ GitHub stars in first 6 months
- **Documentation:** 95%+ satisfaction rating

### 8.3 Quality Metrics
- **Accessibility:** WCAG 2.1 AA compliance
- **Browser Support:** Last 2 versions of major browsers
- **Mobile Responsive:** All outputs work on mobile
- **Dark Mode:** All components support dark mode

---

## 9. Example Use Cases

### 9.1 Landing Page
```taildown
::: section {.hero .gradient-blue-purple .text-white .text-center .py-24}
# Build Beautiful Sites with Taildown {.text-6xl .bold .mb-4}
## The markup language for modern web design {.text-xl .text-white-muted}

[Get Started](#){.button .large .white .shadow-xl} [View Docs](#){.button .large .outline}
:::

::: container {.max-w-6xl .my-16}
::: grid {.cols-3 .gap-8 .responsive}

:::card {.3d-card .hover-lift}
:icon[zap]{.text-yellow-500 .size-12 .mb-4}
### Lightning Fast
Compile documents in milliseconds
:::

:::card {.3d-card .hover-lift}
:icon[palette]{.text-pink-500 .size-12 .mb-4}
### Beautiful Defaults
Production-ready styles out of the box
:::

:::card {.3d-card .hover-lift}
:icon[code]{.text-blue-500 .size-12 .mb-4}
### Developer Friendly
Plain English syntax that's easy to learn
:::

:::
:::
```

### 9.2 Documentation Page
```taildown
::: container {.docs-layout}

# API Reference {.docs-heading}

::: alert {.info}
:icon[info] This documentation is for Taildown v1.0
:::

## Installation

::bash
npm install taildown
::

## Basic Usage

```javascript
import { compile } from 'taildown';

const output = compile(source);
```

::: grid {.cols-2 .gap-4}

:::card {.padded}
### Input
Your .td file with styling
:::

:::card {.padded}
### Output
Beautiful HTML + CSS
:::

:::

:::
```

### 9.3 Blog Post
```taildown
---
title: "Introducing Taildown"
date: 2025-10-04
author: "You"
tags: [markdown, tailwind, design]
---

# Introducing Taildown {.article-title}

![Hero Image](hero.jpg){.rounded-lg .shadow-xl .w-full}

::: article-meta
:icon[calendar] October 4, 2025
:icon[user] By You
:icon[clock] 5 min read
:::

This is a **bold** statement about Taildown. It's going to change how we write content.

::: callout {.accent .padded .rounded}
:icon[lightbulb] **Pro Tip:** Use components to create engaging layouts!
:::

## Key Features

::: grid {.cols-2 .gap-6}

:::card {.feature-card}
:icon[check-circle]{.text-green-500}
### Easy to Learn
Just Markdown with superpowers
:::

:::card {.feature-card}
:icon[check-circle]{.text-green-500}
### Powerful Styling
Tailwind CSS at your fingertips
:::

:::

[Read More](#){.button .primary .large} [Share this](#){.button .outline}
```

---

## 10. Competitive Analysis

### 10.1 Existing Solutions

| Tool | Pros | Cons | Taildown Advantage |
|------|------|------|-------------------|
| **MDX** | React integration, JSX support | Complex setup, requires build step, React-specific | Simpler syntax, no React needed, static output |
| **Markdoc** | Stripe's solution, extensible | Limited styling, requires custom components | Built-in component library, styling first-class |
| **AsciiDoc** | Powerful, mature | Outdated syntax, steep learning curve | Modern syntax, Tailwind integration |
| **HTML + Tailwind** | Full control | Verbose, not writer-friendly | Concise syntax, Markdown familiarity |
| **Notion** | Great UI, collaborative | Proprietary, export limitations | Open source, full control, static output |
| **Wordpress Gutenberg** | Visual editor | Heavy, requires WordPress | Lightweight, framework-agnostic |

### 10.2 Unique Value Propositions

1. **Best of Both Worlds:** Markdown simplicity + Tailwind power
2. **Plain English Styling:** Non-developers can create beautiful layouts
3. **Zero Config Beauty:** Sensible defaults = production ready immediately
4. **Static Output:** No runtime dependencies, SEO-friendly
5. **Component Library:** Pre-built patterns inspired by shadcn
6. **Fast Compilation:** Optimized for speed
7. **Open Source:** Community-driven, extensible

---

## 11. Open Questions & Future Research

### 11.1 Questions to Resolve
1. Should we support JSX-like component composition?
2. How do we handle custom components (user-defined)?
3. Should there be a runtime mode (vs. compile-only)?
4. How to handle animations (CSS-only or JS-based)?
5. Should we support data-driven documents (JSON/YAML input)?
6. How to integrate with CMS systems?
7. Should we support Web Components output?

### 11.2 Future Enhancements (Post v1.0)
- **Taildown Templates Marketplace:** Community-shared layouts
- **Collaboration Features:** Real-time co-editing
- **Version Control:** Built-in document history
- **AI Assistant:** Natural language → Taildown generation
- **Chart/Data Viz:** Built-in charting components
- **Form Builder:** Interactive form creation
- **A/B Testing:** Built-in variant testing
- **Analytics Integration:** Track document engagement
- **Localization:** Multi-language support
- **Accessibility Checker:** Real-time WCAG validation

---

## 12. Next Steps

### Immediate Actions (This Week)
1. ✅ Create tech spec (this document)
2. ⬜ Finalize syntax specification v1.0
3. ⬜ Choose TypeScript vs. Rust
4. ⬜ Set up repository structure
5. ⬜ Create 5 example Taildown documents
6. ⬜ Build minimal parser prototype
7. ⬜ Set up CI/CD pipeline

### Short Term (Next 2 Weeks)
1. ⬜ Implement core parser
2. ⬜ Basic HTML/CSS generation
3. ⬜ CLI tool for compilation
4. ⬜ Unit test suite
5. ⬜ Documentation site setup

### Medium Term (Next Month)
1. ⬜ Component library (10 components)
2. ⬜ Style resolver system
3. ⬜ Icon integration
4. ⬜ Responsive engine
5. ⬜ VS Code extension (alpha)

---

## 13. Resources & References

### Inspiration & Research
- **Markdown:** [CommonMark Spec](https://commonmark.org/)
- **Tailwind CSS:** [Tailwind Docs](https://tailwindcss.com/)
- **shadcn/ui:** [Component Patterns](https://ui.shadcn.com/)
- **Lucide Icons:** [Icon Library](https://lucide.dev/)
- **MDX:** [MDX Docs](https://mdxjs.com/)
- **Markdoc:** [Markdoc by Stripe](https://markdoc.dev/)
- **Pandoc:** [Pandoc Attributes](https://pandoc.org/MANUAL.html)
- **Djot:** [Djot Markup](https://djot.net/)

### Technical References
- **unified ecosystem:** [unified.js.org](https://unified.js.org/)
- **remark:** [Markdown processor](https://remark.js.org/)
- **rehype:** [HTML processor](https://rehype.js.org/)
- **pulldown-cmark:** [Rust Markdown parser](https://github.com/raphlinus/pulldown-cmark)
- **CodeMirror 6:** [Code editor](https://codemirror.net/)
- **Tauri:** [Desktop app framework](https://tauri.app/)

### Community
- **Discord Server:** TBD
- **GitHub Discussions:** TBD
- **Twitter/X:** TBD
- **Weekly Office Hours:** TBD

---

## Appendix A: Syntax Grammar (EBNF)

```ebnf
document       ::= block*
block          ::= markdown_block | component_block | directive_block
markdown_block ::= heading | paragraph | list | code_block | blockquote
heading        ::= "#"+ SPACE text attributes?
paragraph      ::= inline+ attributes?
inline         ::= text | emphasis | strong | link | icon | code
attributes     ::= "{" class_list? "}"
class_list     ::= class+
class          ::= "." IDENTIFIER
component_block ::= ":::" component_name attributes? NEWLINE block* ":::"
directive_block ::= "::" directive_name NEWLINE content "::"
icon           ::= ":icon[" icon_name "]" attributes?
link           ::= "[" text "]" "(" url ")" attributes?
```

---

## Appendix B: Style Class Reference (Top 50)

### Layout
- `flex`, `grid`, `container`, `cols-{n}`, `rows-{n}`
- `gap-{size}`, `space-{size}`, `mx-auto`, `px-{size}`, `py-{size}`

### Typography
- `text-{size}`, `font-{weight}`, `text-{color}`, `text-center/left/right`
- `leading-{size}`, `tracking-{size}`, `uppercase`, `lowercase`, `capitalize`

### Colors
- `bg-{color}`, `text-{color}`, `border-{color}`
- `primary`, `secondary`, `accent`, `neutral`, `success`, `warning`, `error`

### Spacing
- `p-{size}`, `m-{size}`, `padded`, `tight`, `relaxed`, `loose`

### Effects
- `shadow`, `shadow-{size}`, `rounded`, `rounded-{size}`, `elevated`
- `hover-lift`, `hover-scale`, `hover-glow`, `transition`, `3d`

### Responsive
- `responsive`, `hidden-mobile`, `hidden-desktop`, `cols-{sm/md/lg}`

---

## Appendix C: Component Library Reference

### Card Component
```taildown
:::card {variant} {size} {effects}
Content
:::

Variants: basic, elevated, flat, 3d
Sizes: small, medium, large
Effects: hover-lift, hover-glow, shadow-xl
```

### Button Component
```taildown
[Text](#url){.button .variant .size}

Variants: primary, secondary, outline, ghost, link, destructive
Sizes: small, medium, large
States: disabled, loading
```

### Grid Component
```taildown
:::grid {.cols-N .gap-size .responsive}
Child elements (cards, images, etc.)
:::

Columns: 1-12
Gap: tight, normal, relaxed, loose
```

---

**End of Technical Specification**

---

## Document Control

**Authors:** AI Assistant  
**Reviewers:** [To be assigned]  
**Approval:** [Pending]  
**Next Review:** After Phase 1 completion  
**Version History:**
- v0.1.0 (2025-10-04): Initial draft
