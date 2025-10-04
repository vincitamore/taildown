# Taildown

**Version:** 0.1.0 (Phase 1)  
**Status:** Foundation - In Development

A markup language that extends Markdown with Tailwind CSS-inspired styling directives and component systems. Taildown enables developers and content creators to build beautiful, responsive web layouts using plain English commands while maintaining readability.

---

## Overview

Taildown bridges the gap between simple Markdown and complex web development, enabling rapid prototyping and content creation with modern UI/UX standards. Write content in familiar Markdown syntax, add styling with intuitive class attributes, and leverage pre-built components to create production-ready HTML and CSS.

### Key Features

- **Markdown Compatible**: Standard Markdown works without modification, ensuring backward compatibility
- **Tailwind-Inspired Styling**: Use Tailwind CSS classes or plain English shorthands for styling
- **Component System**: Pre-built components (cards, grids, containers) with sensible defaults
- **Fast Compilation**: Sub-100ms compile times for typical documents
- **Static Output**: Generates standalone HTML and CSS with no runtime dependencies
- **Zero Configuration**: Production-ready styles out of the box
- **Semantic HTML5**: Clean, accessible markup generation

---

## Quick Start

### Installation

```bash
npm install -g @taildown/cli
```

### Create Your First Document

Create a file named `hello.tdown`:

```taildown
# Hello Taildown {.text-4xl .font-bold .text-center}

This is a basic example demonstrating Taildown's core features.

## Features

- Easy to write: Just Markdown with styling classes
- Beautiful output: Styled with Tailwind CSS conventions
- Fast compilation: Sub-second compile times

:::card
### Welcome Card
This card component has automatic padding, rounded corners, and shadow styling applied.
:::
```

### Compile

```bash
taildown compile hello.tdown
```

Open the generated `hello.html` in your browser to see the styled output.

---

## Syntax Guide

### Inline Style Attributes

Add styling to any Markdown element using curly braces with class names:

```taildown
# Heading with Styles {.text-blue-600 .text-4xl .font-bold}

This is a paragraph with custom styling {.text-gray-700 .leading-relaxed}

[Button Text](#link){.button .button-primary .shadow-lg}
```

### Component Blocks

Use triple-colon syntax for component blocks:

```taildown
:::card {.shadow-xl .rounded-lg}
## Card Title

Card content with automatic styling and structure.

[Learn More](#){.button .button-primary}
:::
```

### Grid Layouts

Create responsive grid layouts easily:

```taildown
:::grid {.cols-3 .gap-4}
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

### Container and Layout Components

```taildown
:::container {.max-w-6xl .mx-auto}
# Page content is automatically containerized
:::

:::section {.py-16}
## Hero Section
Full-width section with vertical padding
:::
```

### Plain English Shorthands

Use readable aliases that translate to Tailwind classes:

```taildown
# Heading {primary large bold center}
// Translates to: text-primary text-4xl font-bold text-center

:::card {elevated rounded padded}
// Translates to: shadow-xl rounded-lg p-6
:::
```

---

## Technical Architecture

### System Components

```
Taildown File (.tdown)
        |
        v
    Parser (Lexer + AST)
        |
        v
  Transformer (Style Resolver)
        |
        v
   Renderer (HTML + CSS)
        |
        v
 Static Output (HTML + CSS)
```

### Technology Stack

**Core Implementation: TypeScript**

- **Runtime**: Node.js 18+
- **Parser Foundation**: unified + remark + rehype ecosystem
- **Extensions**: remark-directive, remark-gfm
- **CSS Generation**: Custom style resolver with Tailwind-inspired utilities
- **Testing**: Vitest
- **Build Tool**: tsup
- **CLI Framework**: commander

### Packages

This project is organized as a monorepo with the following packages:

- **@taildown/compiler** - Core compilation engine (parser, transformer, renderer)
- **@taildown/cli** - Command-line interface for file compilation
- **@taildown/shared** - Shared types, constants, and utilities

---

## Development

### Prerequisites

- Node.js 18 or higher
- pnpm package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/taildown/taildown.git
cd taildown

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type checking
pnpm typecheck
```

### Project Structure

```
taildown/
├── packages/
│   ├── compiler/          # Core compiler logic
│   │   ├── src/
│   │   │   ├── parser/    # Markdown + extension parsing
│   │   │   ├── renderer/  # HTML and CSS generation
│   │   │   └── styles/    # Style resolution system
│   │   └── package.json
│   ├── cli/               # CLI tool
│   │   ├── src/
│   │   └── package.json
│   └── shared/            # Shared types and utilities
│       ├── src/
│       └── package.json
├── examples/              # Sample .tdown files
├── docs/                  # Documentation
├── package.json           # Monorepo root
├── pnpm-workspace.yaml    # Workspace configuration
└── tsconfig.json          # Root TypeScript config
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test -- --coverage

# Run tests in watch mode
pnpm test -- --watch
```

### Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/compiler
pnpm build
```

---

## CLI Usage

### Basic Commands

**Compile a file:**
```bash
taildown compile input.tdown
```

**Specify output location:**
```bash
taildown compile input.tdown -o output.html
```

**Inline CSS in HTML:**
```bash
taildown compile input.tdown --inline
```

**Minify output:**
```bash
taildown compile input.tdown --minify
```

**Custom CSS output location:**
```bash
taildown compile input.tdown --css styles.css
```

---

## Examples

The `examples/` directory contains 10 complete Taildown documents demonstrating various features:

1. **01-basic.tdown** - Basic Markdown with inline styles
2. **02-components.tdown** - Component blocks (cards, grids)
3. **03-styled.tdown** - Plain English styling
4. **04-landing-page.tdown** - Simple landing page layout
5. **05-documentation.tdown** - API documentation format
6. **06-blog-post.tdown** - Blog post layout
7. **07-grid-layout.tdown** - Grid layout examples
8. **08-typography.tdown** - Typography demonstrations
9. **09-containers.tdown** - Container components
10. **10-complete-page.tdown** - Complete portfolio page

To compile any example:

```bash
taildown compile examples/01-basic.tdown --inline
```

---

## Roadmap

### Phase 1: Foundation (Current)

**Status:** In Development  
**Timeline:** Weeks 1-4

- Basic parser (Markdown + inline styles + component blocks)
- HTML/CSS generator
- CLI compiler tool
- 10 example documents
- Test suite with 80%+ coverage

**Success Criteria:**
- Parse standard Markdown correctly
- Support inline style attributes
- Support component blocks
- Generate semantic HTML5
- Compile sample documents in under 100ms

### Phase 2: Component System (Upcoming)

**Timeline:** Weeks 5-8

- Full component library (15+ components)
- Style resolver with plain English to CSS translation
- Lucide icon integration
- Configuration file support (taildown.config.js)
- Responsive layout engine
- Documentation site

### Phase 3: Editor (Future)

**Timeline:** Weeks 9-12

- VS Code extension
- Syntax highlighting
- Live preview pane
- IntelliSense and autocomplete
- Command palette
- Export functionality

### Phase 4: Enhancement (Future)

**Timeline:** Weeks 13-16

- Performance optimization
- Plugin system
- Standalone editor (Tauri app)
- Theming system
- Dark mode support
- Animation presets

### Phase 5: Community & Ecosystem (Ongoing)

- Public beta release
- Community templates
- Plugin marketplace
- Integration with popular tools (Hugo, Next.js, Astro)
- Conference talks and blog posts

---

## Core Design Principles

1. **Readability First**: Syntax remains as readable as standard Markdown
2. **Progressive Enhancement**: Add styling incrementally with inline directives or blocks
3. **Natural Language**: Use descriptive terms rather than cryptic codes
4. **Component-Based**: Reusable patterns with simple invocation
5. **Semantic Clarity**: Syntax conveys both structure and design intent
6. **Zero Config Beauty**: Default styles are production-ready
7. **Fast Compilation**: Optimized for speed without sacrificing features

---

## Style System Vocabulary

### Color Palette
- `primary`, `secondary`, `accent`, `neutral`
- `success`, `warning`, `error`, `info`
- Prefixes: `text-*`, `bg-*`, `border-*`
- Variants: `light`, `dark`, `muted`

### Spacing
- Line height: `tight`, `normal`, `relaxed`, `loose`
- Padding: `padded`, `padded-sm`, `padded-lg`, `padded-xl`
- Gaps: `gap-*`, `space-*`

### Effects
- Shadows: `shadow`, `elevated`, `floating`
- Borders: `rounded`, `rounded-sm`, `rounded-lg`, `rounded-full`
- Hover: `hover-lift`, `hover-glow`, `hover-scale`
- Gradients: `gradient-*`
- Visual: `blur`, `backdrop-blur`, `3d`, `3d-card`

### Layout
- Display: `flex`, `grid`, `cols-N`, `rows-N`
- Alignment: `center`, `center-x`, `center-y`
- Responsive: `responsive` (automatic breakpoint handling)
- Width: `container`, `full-width`, `contained`

---

## Supported Components (Phase 1)

### Card
Basic card container with padding, rounded corners, and shadow.

```taildown
:::card
Content here
:::
```

### Grid
Responsive grid layout with automatic column wrapping.

```taildown
:::grid
:::card
Item 1
:::
:::card
Item 2
:::
:::
```

### Container
Max-width container with automatic centering and horizontal padding.

```taildown
:::container
Contained content
:::
```

---

## API Reference

### Compiler API

```typescript
import { compile } from '@taildown/compiler';

const result = await compile(source, options);
```

**Parameters:**
- `source` (string): The Taildown source code
- `options` (CompileOptions): Optional compilation options

**Options:**
```typescript
interface CompileOptions {
  inlineStyles?: boolean;      // Inline CSS in HTML (default: false)
  minify?: boolean;            // Minify output (default: false)
  sourceMaps?: boolean;        // Include source maps (default: false)
  components?: Record<...>;    // Custom component definitions
  styleMappings?: Record<...>; // Custom style mappings
}
```

**Returns:**
```typescript
interface CompileResult {
  html: string;           // Generated HTML
  css: string;            // Generated CSS
  metadata: {
    compileTime: number;  // Compilation time in milliseconds
    nodeCount: number;    // Number of AST nodes
    warnings: Array<...>; // Compilation warnings
  };
}
```

---

## Performance

### Benchmarks

- Simple documents (< 50 nodes): < 50ms
- Medium documents (50-200 nodes): < 100ms
- Large documents (200-1000 nodes): < 500ms

### Optimization Strategy

- Incremental parsing for future watch mode
- AST caching for repeated compilations
- Tree-shaking for CSS (only used classes)
- Minimal dependencies for fast installation

---

## Contributing

We welcome contributions from the community. Please read our contributing guidelines before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pnpm test`)
6. Run type checking (`pnpm typecheck`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Code Standards

- TypeScript with strict mode enabled
- Prettier for code formatting
- ESLint for code quality
- Vitest for testing
- Minimum 80% test coverage for new code

---

## Documentation

- **Tech Spec**: See `tech-spec.md` for comprehensive technical specification
- **Phase 1 Plan**: See `phase-1-implementation-plan.md` for detailed implementation guide
- **Examples**: See `examples/` directory for sample documents
- **API Docs**: Coming in Phase 2

---

## License

MIT License - Copyright (c) 2025 Taildown Team

---

## Support and Community

- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join conversations about Taildown development
- **Documentation**: Comprehensive docs coming in Phase 2
- **Discord**: Community server (coming soon)

---

## Acknowledgments

Taildown is inspired by and built upon excellent open-source projects:

- **Markdown**: The foundation for readable markup (CommonMark spec)
- **Tailwind CSS**: Design system and utility-first CSS approach
- **shadcn/ui**: Component design patterns and philosophy
- **unified/remark/rehype**: Powerful AST-based content transformation
- **MDX**: Inspiration for extending Markdown capabilities
- **Pandoc**: Attribute syntax inspiration

---

## Frequently Asked Questions

**Q: How is Taildown different from MDX?**  
A: Taildown focuses on styling and layout with a simpler, non-React syntax. MDX embeds JSX in Markdown for React components. Taildown generates static HTML/CSS without requiring a JavaScript framework.

**Q: Do I need to know Tailwind CSS?**  
A: No. Taildown supports plain English shorthands (like "primary", "large", "bold") that translate automatically. Knowledge of Tailwind CSS is optional and only needed for advanced customization.

**Q: Can I use Taildown with static site generators?**  
A: Phase 1 generates standalone HTML/CSS. Phase 5 will include plugins for Hugo, Next.js, Gatsby, and Astro.

**Q: Is Taildown production-ready?**  
A: Phase 1 is in active development. It's suitable for experimentation but not yet recommended for production use. Phase 2 will include production-ready features.

**Q: How do I customize the default styles?**  
A: Phase 2 will introduce `taildown.config.js` for theme customization. Phase 1 focuses on sensible defaults.

**Q: Does Taildown support dark mode?**  
A: Dark mode support is planned for Phase 4. Phase 1 generates light mode styles.

---

**Built with care by the Taildown Team**  
**Last Updated:** October 4, 2025
