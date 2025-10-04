# Taildown - Technical Specification

**Version:** 0.1.0  
**Date:** 2025-10-04  
**Status:** Initial Draft

---

## Executive Summary

Taildown is a markup language that extends Markdown with Tailwind CSS-inspired styling directives and component systems. It enables developers and content creators to build beautiful, responsive web layouts using plain English commands while maintaining readability. The project consists of three main components: a syntax specification, a compilation engine, and a lightweight editor with live preview.

---

## 1. Project Vision & Goals

### 1.1 Vision Statement
Create a human-readable markup language that bridges the gap between simple Markdown and complex web development, enabling rapid prototyping and content creation with modern UI/UX standards.

### 1.2 Core Goals
- **Readability First**: Syntax remains as readable as Markdown
- **Design System Integration**: Leverage Tailwind CSS conventions and shadcn/ui patterns
- **Zero Config Beauty**: Default styles should be production-ready
- **Component Rich**: Pre-built components (cards, grids, buttons, forms)
- **Responsive by Default**: All layouts automatically adapt to viewport sizes
- **Static Output**: Compile to standalone HTML/CSS files
- **Fast Compilation**: Sub-second compile times for typical documents
- **Icon Integration**: Built-in Lucide icon support

### 1.3 Target Users
- Technical writers
- Documentation authors
- Rapid prototypers
- Content creators with design sensibility
- Developers building landing pages/static sites

---

## 2. Syntax Specification

### 2.1 Core Principles

1. **Backward Compatible**: Standard Markdown should work without modification
2. **Progressive Enhancement**: Add styling with inline directives or blocks
3. **Natural Language**: Use descriptive terms (e.g., "blue-primary" not "#3b82f6")
4. **Component-Based**: Reusable patterns with simple invocation
5. **Semantic Clarity**: Syntax conveys both structure and intent

### 2.2 Syntax Extensions

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
│   (.tdown)      │
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
│ (Style Resolver)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Renderer     │
│  (HTML + CSS)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Static Output  │
│  (HTML + CSS)   │
└─────────────────┘
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
- Pre-built component definitions
- Customizable via configuration
- Shadcn-inspired design system
- Variants system (sizes, colors, states)

Components to include:
- **Card** (basic, hover, 3D)
- **Button** (primary, secondary, outline, ghost, link)
- **Grid** (responsive columns)
- **Container** (max-width constraints)
- **Alert** (info, warning, error, success)
- **Badge**
- **Avatar**
- **Tabs**
- **Accordion**
- **Modal/Dialog**
- **Form elements** (input, select, checkbox, radio)
- **Navigation** (navbar, sidebar, breadcrumbs)

#### 3.3.5 Icon System
- Lucide icon integration
- Inline SVG injection
- Size/color variants
- Tree-shaking (only used icons)

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

### Phase 1: Foundation (Weeks 1-4)
**Goal:** Proof of concept with basic syntax and compilation

**Deliverables:**
1. Syntax specification (v1.0)
2. Basic parser (Markdown + inline styles)
3. HTML/CSS generator
4. CLI compiler tool
5. 10 example documents

**Technology Decisions:**
- Choose TypeScript or Rust
- Set up monorepo structure
- CI/CD pipeline

**Success Criteria:**
- Parse standard Markdown correctly
- Support inline style attributes
- Generate semantic HTML
- Compile sample document <100ms

### Phase 2: Component System (Weeks 5-8)
**Goal:** Rich component library with styling system

**Deliverables:**
1. Component library (15+ components)
2. Style resolver (plain English → CSS)
3. Icon system (Lucide integration)
4. Configuration file support
5. Responsive layout engine
6. Documentation site (built with Taildown!)

**Success Criteria:**
- All planned components working
- Style conflicts resolved correctly
- Responsive previews work
- Config file is loaded and applied

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

### 6.1 Compiler Core
**Primary Choice: TypeScript**
- **Runtime:** Node.js 18+
- **Parser:** `unified` + `remark` + `rehype`
- **Syntax Extension:** `remark-directive`
- **CSS Generation:** `tailwindcss` (via API)
- **Testing:** Vitest
- **Build:** tsup or esbuild

**Alternative: Rust**
- **Parser:** `pulldown-cmark`
- **CSS:** Custom generator or `lightningcss`
- **WASM:** `wasm-pack` for browser
- **Testing:** Cargo test

### 6.2 Editor
**VS Code Extension:**
- **Language:** TypeScript
- **Framework:** VS Code Extension API
- **Grammar:** TextMate grammar (YAML)
- **Build:** esbuild + vsce

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
Your .tdown file with styling
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
