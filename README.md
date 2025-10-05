# Taildown

**Version:** 0.1.0  
**Status:** Active Development (Phase 2 In Progress)

A revolutionary markup language that extends Markdown with plain English styling, interactive components, and zero-config interactivity. Write beautiful, responsive web applications using natural language while maintaining perfect readability.

---

## Overview

Taildown bridges the gap between simple Markdown and complex web development, enabling rapid prototyping and content creation with modern UI/UX standards. Write content in familiar Markdown syntax, add styling with intuitive plain English commands, and leverage pre-built components to create production-ready HTML and CSS.

### Key Features

#### Core Features
- **Markdown Compatible**: Standard Markdown works without modification
- **Plain English Styling**: Use natural language like `{huge-bold primary center}` instead of CSS classes
- **Icon System**: Built-in Lucide icons with `:icon[name]{size color}` syntax
- **Modern Effects**: Glassmorphism and smooth entrance animations
- **Fast Compilation**: Sub-100ms compile times for typical documents
- **Zero Configuration**: Production-ready styles out of the box
- **Semantic HTML5**: Clean, accessible markup generation

#### Interactive Components
- **Tabs**: Zero-config tabbed interfaces with keyboard navigation
- **Accordion**: Collapsible sections with smooth animations
- **Carousel**: Image/content carousels with 3D effects and swipe support
- **Modal**: Dialog boxes with backdrop blur and focus management
- **Tooltip**: Contextual help on hover/click with fade animations

#### Attachable Components
- **One-Line Modals**: `[Click Me](#){modal="Your message here"}`
- **Inline Tooltips**: `[Help](#){tooltip="Helpful information"}`
- **ID References**: Define once, use everywhere with `modal="#id"`
- **Works on Anything**: Attach to buttons, links, badges, or any element
- **Full Markdown**: Rich content in tooltips/modals with complete markdown support

#### JavaScript Generation
- **Vanilla JS**: ~2-5KB of clean, dependency-free JavaScript
- **Tree-Shaking**: Only includes JS for components you actually use
- **Event Delegation**: Efficient, performant event handling
- **Accessibility**: Full ARIA support, keyboard navigation, focus management

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/taildown/taildown.git
cd taildown

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Create Your First Document

Create a file named `hello.td`:

```taildown
# Hello Taildown {huge-bold center primary}

Welcome to the future of beautiful documents! {large muted}

:::card {light-glass slide-up}
### :icon[zap]{warning} Getting Started

This card uses **glassmorphism** and **entrance animations** with plain English syntax.

[Learn More :icon[arrow-right]{xs}](#){button primary modal="Welcome to Taildown! 
Get started by exploring our examples and documentation."}

[Need Help? :icon[help-circle]{xs}](#){button secondary tooltip="Click any button to see it in action!"}
:::

:::tabs
## Features
Taildown includes interactive tabs, modals, tooltips, and more!

## Examples
Check out the examples/ directory for comprehensive demos.

## Documentation
See SYNTAX.md for complete syntax reference.
:::
```

### Compile

```bash
pnpm taildown compile hello.td
```

This generates three files:
- `hello.html` - Semantic HTML5 markup
- `hello.css` - Optimized, scoped styles  
- `hello.js` - Minimal vanilla JavaScript (only if interactive components used)

Open `hello.html` in your browser to see your interactive document!

---

## Syntax Guide

> **Complete Syntax Reference**: See [`SYNTAX.md`](SYNTAX.md) for the canonical, comprehensive syntax specification.

### Plain English Styling

Use natural language that reads like English instead of CSS classes:

```taildown
# Large Bold Primary Heading {huge-bold primary}

This paragraph is muted with relaxed line spacing. {large muted relaxed-lines}

This text is centered. {center}
```

**Natural Grammar Rules:**
- Adjectives before nouns: `large-text` not `text-large`
- Descriptive modifiers first: `bold-primary` not `primary-bold`
- Readable combinations: `huge-bold` combines naturally

### Icon Integration

Simple syntax for Lucide icons:

```taildown
:icon[heart]{primary} Love this feature

:icon[check-circle]{success xs} Completed task

:icon[arrow-right] Learn more
```

### Component Blocks

Use triple-colon syntax for component blocks:

```taildown
:::card {elevated hover-lift}
## Card Title {large-bold}

Card content with automatic styling.

[Button Text](#){button primary}
:::
```

### Glassmorphism

Modern frosted glass effects:

```taildown
:::card {subtle-glass}
Light frosted glass with 90% transparency
:::

:::card {light-glass}
Medium frosted glass with 75% transparency
:::

:::card {heavy-glass}
Heavy frosted glass with 60% transparency
:::
```

### Animations

Smooth entrance and hover animations:

```taildown
:::card {elevated fade-in}
Fades in smoothly on page load
:::

:::card {light-glass slide-up}
Slides up from below with fade
:::

:::card {elevated zoom-in interactive hover-lift}
Zooms in, then lifts on hover
:::
```

### Grid Layouts

Create responsive grid layouts easily:

```taildown
:::grid
:::card {elevated fade-in}
Content 1
:::

:::card {elevated fade-in}
Content 2
:::

:::card {elevated fade-in}
Content 3
:::
:::
```

Grid automatically adapts: 1 column on mobile, 2 on tablet, 3 on desktop.

---

## Interactive Components

Taildown includes five interactive components with zero configuration required. JavaScript is automatically generated only for components you use.

### Tabs

```taildown
:::tabs
## First Tab
Content here

## Second Tab
More content
:::
```

### Accordion

```taildown
:::accordion
**Section 1**
Content (open by default)

**Section 2**
Click to expand
:::
```

### Carousel

```taildown
:::carousel
Slide 1

---

Slide 2
:::
```

### Modal & Tooltip (Attachable)

```taildown
[Click Me](#){modal="Your message"}
[Hover](#){tooltip="Help text"}

[Open Rich Modal](#){modal="#welcome"}

:::modal{id="welcome"}
# Welcome!
Full **markdown** support here.
:::
```

**See [`SYNTAX.md`](SYNTAX.md) §3.7 for complete interactive component documentation.**

---

## Attachable Components

The most revolutionary feature: attach modals and tooltips to ANY element with one line.

### Quick Examples

```taildown
[Info](#){modal="Simple message"}
[Help](#){tooltip="Quick tip"}
[Button](#){button primary modal="#details"}
```

### ID References

Define once, use everywhere:

```taildown
[Open 1](#){modal="#shared"}
[Open 2](#){modal="#shared"}

:::modal{id="shared"}
Content defined once, used twice!
:::
```

### Why Revolutionary

**Traditional approach**: 50+ lines of HTML + JavaScript  
**Taildown**: `[Click](#){modal="Message"}`

Zero configuration. Zero complexity. Maximum readability.

**See [`SYNTAX.md`](SYNTAX.md) §2.8 for complete attachable component documentation.**

---

## JavaScript Output

Taildown generates ~2-5KB of optimized vanilla JavaScript (only for interactive components).

**Tree-Shaking**: Only includes JS for components you actually use  
**Vanilla ES6+**: No framework dependencies  
**Accessible**: Full ARIA support, keyboard navigation  
**Browser Support**: Chrome 51+, Firefox 54+, Safari 10+, Edge 15+

**Output structure**:
```
document.td → document.html (HTML5)
           → document.css (scoped CSS)
           → document.js (only if interactive components present)
```

**See [`SYNTAX.md`](SYNTAX.md) §3.9 for complete JavaScript generation documentation.**

---

## Implemented Components

### Card

Flexible container with multiple variants and effects.

**Variants:** `flat`, `elevated`, `floating`, `outlined`, `bordered`, `interactive`  
**Glass Effects:** `subtle-glass`, `light-glass`, `heavy-glass`  
**Sizes:** `sm`, `md`, `lg`, `xl`

```taildown
:::card {elevated}
Basic elevated card
:::

:::card {light-glass slide-up interactive hover-lift}
Glass card with animations
:::
```

### Button

Inline component for styled links.

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `success`, `warning`  
**Sizes:** `sm`, `md`, `lg`, `xl`

```taildown
[Click Me](#){button primary}

[Learn More :icon[arrow-right]{xs}](#){button secondary large}
```

### Alert

Contextual feedback messages.

**Types:** `info`, `success`, `warning`, `error`  
**Sizes:** `sm`, `md`, `lg`

```taildown
:::alert {info}
Information alert for general notices.
:::

:::alert {success}
Success alert for completed actions.
:::
```

### Badge

Inline status indicators and labels.

**Variants:** `default`, `primary`, `success`, `warning`, `error`, `info`  
**Sizes:** `sm`, `md`, `lg`

```taildown
:::badge {primary}
New
:::

:::badge {success small}
Active
:::
```

### Avatar

User profile images with fallbacks.

**Shapes:** `circular`, `square`, `rounded`  
**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

```taildown
:::avatar {circular md}
![User](avatar.jpg)
:::
```

### Grid

Responsive grid layout system.

**Variants:** `tight`, `normal`, `loose`, `extra-loose` (gap sizes)  
**Columns:** Auto-responsive (1→2→3 columns) or specify `{2}`, `{3}`, `{4}`

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

Max-width container with automatic centering.

**Variants:** `narrow`, `normal`, `wide`, `extra-wide`, `full`

```taildown
:::container
Centered content with max-width
:::
```

---

## Plain English Style System

### Colors

**Semantic:** `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`, `muted`

### Typography

**Sizes:** `xs`, `small`, `large`, `xl`, `2xl`, `3xl`, `huge`, `massive`  
**Weight:** `thin`, `light`, `normal`, `medium`, `semibold`, `bold`, `extra-bold`, `black`  
**Combinations:** `huge-bold`, `large-bold`, `xl-bold`, `small-light`

### Spacing

**Padding:** `padded`, `padded-sm`, `padded-lg`, `padded-xl`  
**Gaps:** `gap`, `gap-sm`, `gap-lg`, `gap-xl`  
**Line Height:** `tight-lines`, `normal-lines`, `relaxed-lines`, `loose-lines`

### Layout

**Alignment:** `center`, `left`, `right`, `justify`  
**Display:** `flex`, `grid`, `inline`, `block`

### Effects

**Shadows:** `shadow`, `shadow-sm`, `shadow-lg`, `shadow-xl`, `elevated`, `floating`  
**Borders:** `rounded`, `rounded-sm`, `rounded-lg`, `rounded-full`  
**Glass:** `subtle-glass`, `light-glass`, `heavy-glass`

### Animations

**Entrance:** `fade-in`, `slide-up`, `slide-down`, `zoom-in`, `scale-in`  
**Hover:** `hover-lift`, `hover-glow`, `hover-scale`  
**States:** `interactive` (enables hover effects)

---

## CLI Usage

### Basic Commands

**Compile a file:**
```bash
pnpm taildown compile input.td
```

**Files are generated in the same directory as the input:**
```bash
pnpm taildown compile examples/01-basic-markdown.td
# Creates: examples/01-basic-markdown.html and examples/01-basic-markdown.css
```

**Specify custom output location:**
```bash
pnpm taildown compile input.td -o output.html --css output.css
```

**Inline CSS in HTML:**
```bash
pnpm taildown compile input.td --inline
```

**Minify output:**
```bash
pnpm taildown compile input.td --minify
```

---

## Examples

The `examples/` directory contains 10 complete Taildown documents demonstrating Phase 2 features:

1. **01-basic-markdown.td** - Markdown basics with icons
2. **02-inline-attributes.td** - Plain English styling showcase
3. **03-component-basics.td** - All components and variants
4. **04-grid-layouts.td** - Responsive grids with glassmorphism
5. **05-nested-components.td** - Deep nesting with glass effects
6. **06-real-world-landing.td** - Complete SaaS landing page
7. **07-documentation-page.td** - API documentation with alerts
8. **08-blog-post.td** - Long-form blog with icons and glass
9. **09-portfolio-page.td** - Portfolio with heavy glassmorphism
10. **10-complete-page.td** - Ultimate feature showcase (1000+ nodes)

To compile any example:

```bash
pnpm taildown compile examples/10-complete-page.td
```

---

## Technical Architecture

### System Components

```
Taildown File (.td)
        |
        v
    Parser (unified + custom directive parser)
        |
        v
  Transformer (Style Resolver + Components)
        |
        v
   Renderer (HTML + CSS Generator)
        |
        v
 Static Output (HTML + CSS)
```

### Technology Stack

**Core Implementation: TypeScript + Node.js 18+**

- **Parser**: `unified` + `remark` + `rehype` ecosystem
- **Custom Directive Parser**: In-house `:::` component syntax parser (handles blank lines correctly)
- **Extensions**: `remark-gfm`
- **Syntax Highlighting**: `rehype-prism-plus` with custom Taildown language
- **Icons**: `lucide` (Lucide icon library)
- **CSS Generation**: Custom resolver with Tailwind-inspired utilities
- **Testing**: Vitest
- **Build Tool**: tsup
- **CLI**: commander

### Packages

- **@taildown/compiler** - Core compilation engine
- **@taildown/cli** - Command-line interface
- **@taildown/shared** - Shared types and utilities

---

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Lint code
pnpm lint

# Format code
pnpm format
```

### Project Structure

```
taildown/
├── packages/
│   ├── compiler/          # Core compiler
│   │   ├── src/
│   │   │   ├── parser/    # Markdown + directive parsing
│   │   │   ├── renderer/  # HTML and CSS generation
│   │   │   ├── resolver/  # Plain English → CSS resolution
│   │   │   ├── components/# Component definitions
│   │   │   ├── themes/    # Glassmorphism + animations
│   │   │   ├── icons/     # Icon parser and renderer
│   │   │   └── config/    # Configuration system
│   │   └── package.json
│   ├── cli/               # CLI tool
│   └── shared/            # Shared types
├── examples/              # Sample .td files
├── syntax-tests/          # Syntax test fixtures
└── .vscode/extensions/    # VSCode syntax highlighting
```

---

## Roadmap

### Phase 1: Foundation (Complete)

- Basic parser (Markdown + inline styles + component blocks)
- HTML/CSS generator
- CLI compiler tool
- Test suite with syntax fixtures
- 3 initial components (card, grid, container)

### Phase 2: Component System (In Progress)

**Completed:**
- Plain English style resolver (120+ shorthand mappings)
- 7 components (card, button, alert, badge, avatar, grid, container)
- Lucide icon integration (`:icon[name]` syntax)
- Glassmorphism system (subtle/light/heavy glass)
- Animation system (entrance + hover animations)
- Configuration system (schema, loader, defaults)
- 10 example documents updated
- VSCode extension for syntax highlighting
- Modern code block styling with syntax highlighting

**In Progress:**
- Dark mode system
- Additional components (tabs, accordion, modal, navbar, etc.)
- Comprehensive test suite
- Documentation site

### Phase 3: Editor (Planned)

- VS Code extension enhancements
- Live preview pane
- IntelliSense and autocomplete
- Command palette
- Export functionality

### Phase 4: Enhancement (Future)

- Performance optimization
- Plugin system
- Standalone editor (Tauri app)
- Advanced theming
- Animation presets

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass (`pnpm test`)
5. Run type checking (`pnpm typecheck`)
6. Format code (`pnpm format`)
7. Submit a Pull Request

### Code Standards

- TypeScript with strict mode
- Prettier for formatting
- ESLint for code quality
- Vitest for testing
- Minimum 80% test coverage

---

## Documentation

- **[SYNTAX.md](SYNTAX.md)** - Canonical syntax specification (v0.2.0)
- **[tech-spec.md](tech-spec.md)** - Technical specification
- **[examples/](examples/)** - Sample documents
- **[examples/README.md](examples/README.md)** - Example documentation

---

## License

MIT License - Copyright (c) 2025 Taildown Team

---

## Acknowledgments

Taildown is built on excellent open-source projects:

- **Markdown** - CommonMark specification
- **Tailwind CSS** - Utility-first CSS approach
- **shadcn/ui** - Component design patterns
- **unified/remark/rehype** - Content transformation
- **Lucide** - Beautiful icon library
- **Prism.js** - Syntax highlighting

---

## FAQ

**Q: How is Taildown different from MDX?**  
A: Taildown focuses on styling and layout with simpler, non-React syntax. It generates static HTML/CSS without requiring a JavaScript framework.

**Q: Do I need to know Tailwind CSS?**  
A: No! Taildown uses plain English like `{huge-bold primary}` that translates automatically. Tailwind knowledge is optional.

**Q: Can I use Taildown in production?**  
A: Phase 2 is in active development. It's suitable for experimentation and internal tools but not yet recommended for production.

**Q: How do I customize styles?**  
A: The configuration system (`taildown.config.js`) is implemented but customization APIs are being finalized in Phase 2.

**Q: Does Taildown support dark mode?**  
A: Dark mode system is planned and will be implemented soon in Phase 2.

---

**Built with care by the Taildown Team**  
**Last Updated:** October 5, 2025
