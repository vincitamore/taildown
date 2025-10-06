# Taildown {huge-bold center primary}

**Version:** 0.1.0 :icon[package]{primary xs} | **Status:** Active Development :icon[code]{accent xs} {center large}

A revolutionary markup language that extends Markdown with plain English styling, interactive components, and zero-config interactivity. Write beautiful, responsive web applications using natural language while maintaining perfect readability. {center muted large}

---

## Overview {large-bold primary}

Taildown bridges the gap between simple Markdown and complex web development, enabling rapid prototyping and content creation with modern UI/UX standards. Write content in familiar Markdown syntax, add styling with intuitive plain English commands, and leverage pre-built components to create production-ready HTML and CSS.

---

## Key Features {large-bold primary}

:::grid {cols="3"}
:::card {elevated}
### :icon[check-circle]{success} Core Features {medium-bold}

- **Markdown Compatible** - Standard Markdown works without modification
- **Plain English Styling** - Use natural language like `{huge-bold primary center}`
- **Icon System** - Built-in Lucide icons with `:icon[name]` syntax
- **Modern Effects** - Glassmorphism and smooth entrance animations
- **Fast Compilation** - Sub-100ms compile times
- **Zero Configuration** - Production-ready styles out of the box
- **Semantic HTML5** - Clean, accessible markup generation
:::

:::card {elevated}
### :icon[layers]{accent} Interactive Components {medium-bold}

- **Tabs** - Zero-config tabbed interfaces with keyboard navigation
- **Accordion** - Collapsible sections with smooth animations
- **Carousel** - Image/content carousels with 3D effects
- **Modal** - Dialog boxes with backdrop blur
- **Tooltip** - Contextual help on hover/click
:::

:::card {elevated}
### :icon[zap]{warning} Attachable Components {medium-bold}

- **One-Line Modals** - `[Click](#){modal="Message"}`
- **Inline Tooltips** - `[Help](#){tooltip="Info"}`
- **ID References** - Define once, use everywhere
- **Works on Anything** - Attach to any element
- **Full Markdown** - Rich content in tooltips/modals
:::
:::

:::grid {cols="2"}
:::card {light-glass}
### :icon[code]{primary} JavaScript Generation {medium-bold}

- **Vanilla JS** - ~2-5KB of clean, dependency-free code
- **Tree-Shaking** - Only includes JS for components you use
- **Event Delegation** - Efficient, performant event handling
- **Accessibility** - Full ARIA support, keyboard navigation
:::

:::card {light-glass}
### :icon[sparkles]{accent} Zero Config Beauty {medium-bold}

- **Professional Defaults** - Beautiful out of the box
- **Responsive Design** - Mobile-first, adaptive layouts
- **Semantic Colors** - `primary`, `success`, `warning`, `error`
- **Natural Grammar** - Plain English that reads naturally
:::
:::

---

## Quick Start {large-bold primary}

:::card {elevated padded}
### :icon[download]{primary} Installation {medium-bold}

```bash
# Clone the repository
git clone https://github.com/taildown/taildown.git
cd taildown

# Install dependencies
pnpm install

# Build all packages
pnpm build
```
:::

:::card {elevated padded}
### :icon[file-text]{accent} Create Your First Document {medium-bold}

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
:::

:::card {elevated padded}
### :icon[terminal]{success} Compile {medium-bold}

```bash
pnpm taildown compile hello.td
```

This generates three files:
- `hello.html` - Semantic HTML5 markup :icon[file]{xs}
- `hello.css` - Optimized, scoped styles :icon[palette]{xs}
- `hello.js` - Minimal vanilla JavaScript :icon[code]{xs} (only if interactive components used)

Open `hello.html` in your browser to see your interactive document!
:::

---

## Syntax Guide {large-bold primary}

:::alert {info}
:icon[book-open]{info} **Complete Syntax Reference:** See [`SYNTAX.md`](SYNTAX.md) for the canonical, comprehensive syntax specification.
:::

:::grid {cols="2"}
:::card {elevated}
### :icon[type]{primary} Plain English Styling {medium-bold}

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
:::

:::card {elevated}
### :icon[smile]{accent} Icon Integration {medium-bold}

Simple syntax for Lucide icons:

```taildown
:icon[heart]{primary} Love this feature

:icon[check-circle]{success xs} Completed task

:icon[arrow-right] Learn more
```

**20+ built-in icons** from Lucide library with natural size attributes: `xs`, `small`, `large`, `huge`
:::

:::card {elevated}
### :icon[box]{warning} Component Blocks {medium-bold}

Use triple-colon syntax for component blocks:

```taildown
:::card {elevated hover-lift}
## Card Title {large-bold}

Card content with automatic styling.

[Button Text](#){button primary}
:::
```

**Components:** card, alert, badge, grid, container, tabs, accordion, carousel, modal, tooltip
:::

:::card {elevated}
### :icon[wind]{info} Glassmorphism {medium-bold}

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
:::

:::card {elevated}
### :icon[sparkles]{success} Animations {medium-bold}

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

**Entrance:** `fade-in`, `slide-up`, `slide-down`, `zoom-in`, `scale-in`  
**Hover:** `hover-lift`, `hover-glow`, `hover-scale`
:::

:::card {elevated}
### :icon[grid-3x3]{primary} Grid Layouts {medium-bold}

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

Grid automatically adapts: **1 column on mobile, 2 on tablet, 3 on desktop**.
:::
:::

---

## Interactive Components {large-bold primary}

Taildown includes five interactive components with zero configuration required. JavaScript is automatically generated only for components you use. {center muted}

:::grid {cols="2"}
:::card {light-glass}
### :icon[layout]{primary} Tabs {medium-bold}

```taildown
:::tabs
## First Tab
Content here

## Second Tab
More content
:::
```

**Features:** Zero-config, keyboard navigation, smooth transitions
:::

:::card {light-glass}
### :icon[list]{accent} Accordion {medium-bold}

```taildown
:::accordion
**Section 1**
Content (open by default)

**Section 2**
Click to expand
:::
```

**Features:** Smooth animations, collapsible sections, accessible
:::

:::card {light-glass}
### :icon[image]{warning} Carousel {medium-bold}

```taildown
:::carousel
Slide 1

---

Slide 2
:::
```

**Features:** 3D effects, swipe support, auto-play option
:::

:::card {light-glass}
### :icon[message-square]{info} Modal & Tooltip {medium-bold}

```taildown
[Click Me](#){modal="Your message"}
[Hover](#){tooltip="Help text"}

[Open Rich Modal](#){modal="#welcome"}

:::modal {id="welcome"}
# Welcome!
Full **markdown** support here.
:::
```

**Features:** Backdrop blur, focus management, keyboard navigation
:::
:::

---

## Attachable Components {large-bold primary}

The most revolutionary feature: attach modals and tooltips to ANY element with one line. {center large muted}

:::card {elevated padded}
### Quick Examples {medium-bold primary}

```taildown
[Info](#){modal="Simple message"}
[Help](#){tooltip="Quick tip"}
[Button](#){button primary modal="#details"}
```
:::

:::card {elevated padded}
### ID References {medium-bold primary}

Define once, use everywhere:

```taildown
[Open 1](#){modal="#shared"}
[Open 2](#){modal="#shared"}

:::modal {id="shared"}
Content defined once, used twice!
:::
```
:::

:::card {light-glass padded}
### :icon[star]{warning huge} Why Revolutionary {large-bold center}

**Traditional approach:** 50+ lines of HTML + JavaScript  
**Taildown:** `[Click](#){modal="Message"}`

Zero configuration. Zero complexity. Maximum readability. {center large}
:::

:::alert {info}
:icon[book-open]{info} **See [`SYNTAX.md`](SYNTAX.md) §2.8 for complete attachable component documentation.**
:::

---

## JavaScript Output {large-bold primary}

:::grid {cols="3"}
:::card {elevated}
### :icon[file-code]{primary} Tree-Shaking {medium-bold}

Only includes JS for components you actually use. Empty documents generate zero JavaScript!
:::

:::card {elevated}
### :icon[code]{accent} Vanilla ES6+ {medium-bold}

No framework dependencies. Clean, modern JavaScript that works everywhere.
:::

:::card {elevated}
### :icon[accessibility]{success} Accessible {medium-bold}

Full ARIA support, keyboard navigation, focus management built-in.
:::
:::

:::card {light-glass padded}
**Browser Support:** Chrome 51+, Firefox 54+, Safari 10+, Edge 15+ {center large}

**Output structure:**
```
document.td → document.html (HTML5)
           → document.css (scoped CSS)
           → document.js (only if interactive components present)
```
:::

:::alert {info}
:icon[book-open]{info} **See [`SYNTAX.md`](SYNTAX.md) §3.9 for complete JavaScript generation documentation.**
:::

---

## Implemented Components {large-bold primary}

:::grid {cols="2"}
:::card {elevated}
### :icon[square]{primary} Card {medium-bold}

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
:::

:::card {elevated}
### :icon[mouse-pointer]{accent} Button {medium-bold}

Inline component for styled links.

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `success`, `warning`  
**Sizes:** `sm`, `md`, `lg`, `xl`

```taildown
[Click Me](#){button primary}

[Learn More :icon[arrow-right]{xs}](#){button secondary large}
```
:::

:::card {elevated}
### :icon[alert-circle]{warning} Alert {medium-bold}

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
:::

:::card {elevated}
### :icon[tag]{info} Badge {medium-bold}

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
:::

:::card {elevated}
### :icon[user]{success} Avatar {medium-bold}

User profile images with fallbacks.

**Shapes:** `circular`, `square`, `rounded`  
**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`, `2xl`

```taildown
:::avatar {circular md}
![User](avatar.jpg)
:::
```
:::

:::card {elevated}
### :icon[grid-3x3]{primary} Grid {medium-bold}

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
:::

:::card {elevated}
### :icon[maximize]{accent} Container {medium-bold}

Max-width container with automatic centering.

**Variants:** `narrow`, `normal`, `wide`, `extra-wide`, `full`

```taildown
:::container
Centered content with max-width
:::
```
:::

:::card {elevated}
### :icon[layout]{warning} Tabs, Accordion, Carousel {medium-bold}

Interactive components with zero configuration.

**Features:**
- Automatic JavaScript generation
- Keyboard navigation
- ARIA support
- Smooth animations
- Mobile-responsive

See [`SYNTAX.md`](SYNTAX.md) §3.7 for complete documentation.
:::
:::

---

## Plain English Style System {large-bold primary}

:::grid {cols="3"}
:::card {light-glass}
### :icon[palette]{primary} Colors {medium-bold}

**Semantic colors:**
- `primary`
- `secondary`
- `accent`
- `success`
- `warning`
- `error`
- `info`
- `muted`

All colors support prefixes: `text-`, `bg-`, `border-`
:::

:::card {light-glass}
### :icon[type]{accent} Typography {medium-bold}

**Sizes:** `xs`, `small`, `large`, `xl`, `2xl`, `3xl`, `huge`, `massive`

**Weight:** `thin`, `light`, `normal`, `medium`, `semibold`, `bold`, `extra-bold`, `black`

**Combinations:** `huge-bold`, `large-bold`, `xl-bold`, `small-light`
:::

:::card {light-glass}
### :icon[move]{warning} Spacing {medium-bold}

**Padding:** `padded`, `padded-sm`, `padded-lg`, `padded-xl`

**Gaps:** `gap`, `gap-sm`, `gap-lg`, `gap-xl`

**Line Height:** `tight-lines`, `normal-lines`, `relaxed-lines`, `loose-lines`
:::

:::card {light-glass}
### :icon[layout]{info} Layout {medium-bold}

**Alignment:** `center`, `left`, `right`, `justify`

**Display:** `flex`, `grid`, `inline`, `block`

**Position:** `relative`, `absolute`, `fixed`, `sticky`
:::

:::card {light-glass}
### :icon[sun]{success} Effects {medium-bold}

**Shadows:** `shadow`, `shadow-sm`, `shadow-lg`, `shadow-xl`, `elevated`, `floating`

**Borders:** `rounded`, `rounded-sm`, `rounded-lg`, `rounded-full`

**Glass:** `subtle-glass`, `light-glass`, `heavy-glass`
:::

:::card {light-glass}
### :icon[zap]{primary} Animations {medium-bold}

**Entrance:** `fade-in`, `slide-up`, `slide-down`, `zoom-in`, `scale-in`

**Hover:** `hover-lift`, `hover-glow`, `hover-scale`

**States:** `interactive` (enables hover effects)
:::
:::

---

## CLI Usage {large-bold primary}

:::card {elevated padded}
### Basic Commands {medium-bold primary}

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
:::

---

## Examples {large-bold primary}

The `examples/` directory contains 10 complete Taildown documents demonstrating Phase 2 features: {center large muted}

:::grid {cols="2"}
:::card {elevated}
**1. 01-basic-markdown.td** :icon[file]{xs}  
Markdown basics with icons
:::

:::card {elevated}
**2. 02-inline-attributes.td** :icon[palette]{xs}  
Plain English styling showcase
:::

:::card {elevated}
**3. 03-component-basics.td** :icon[box]{xs}  
All components and variants
:::

:::card {elevated}
**4. 04-grid-layouts.td** :icon[grid-3x3]{xs}  
Responsive grids with glassmorphism
:::

:::card {elevated}
**5. 05-nested-components.td** :icon[layers]{xs}  
Deep nesting with glass effects
:::

:::card {elevated}
**6. 06-real-world-landing.td** :icon[home]{xs}  
Complete SaaS landing page
:::

:::card {elevated}
**7. 07-documentation-page.td** :icon[book]{xs}  
API documentation with alerts
:::

:::card {elevated}
**8. 08-blog-post.td** :icon[file-text]{xs}  
Long-form blog with icons and glass
:::

:::card {elevated}
**9. 09-portfolio-page.td** :icon[briefcase]{xs}  
Portfolio with heavy glassmorphism
:::

:::card {elevated}
**10. 10-complete-page.td** :icon[star]{xs}  
Ultimate feature showcase (1000+ nodes)
:::
:::

:::card {light-glass padded}
### :icon[terminal]{primary} To compile any example: {medium-bold center}

```bash
pnpm taildown compile examples/10-complete-page.td
```
:::

---

## Technical Architecture {large-bold primary}

:::card {elevated padded}
### System Components {medium-bold primary}

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
 Static Output (HTML + CSS + JS)
```
:::

:::grid {cols="2"}
:::card {light-glass}
### :icon[layers]{primary} Technology Stack {medium-bold}

**Core Implementation:** TypeScript + Node.js 18+

- **Parser:** `unified` + `remark` + `rehype` ecosystem
- **Custom Directive Parser:** In-house `:::` component syntax parser
- **Extensions:** `remark-gfm`
- **Syntax Highlighting:** `rehype-prism-plus` with custom Taildown language
- **Icons:** `lucide` (Lucide icon library)
- **CSS Generation:** Custom resolver with Tailwind-inspired utilities
- **Testing:** Vitest
- **Build Tool:** tsup
- **CLI:** commander
:::

:::card {light-glass}
### :icon[package]{accent} Packages {medium-bold}

**@taildown/compiler** :icon[box]{xs}  
Core compilation engine

**@taildown/cli** :icon[terminal]{xs}  
Command-line interface

**@taildown/shared** :icon[share-2]{xs}  
Shared types and utilities
:::
:::

---

## Development {large-bold primary}

:::card {elevated padded}
### :icon[code]{primary} Setup {medium-bold}

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
:::

:::card {light-glass padded}
### :icon[folder]{accent} Project Structure {medium-bold}

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
:::

---

## Roadmap {large-bold primary}

:::grid {cols="2"}
:::card {elevated}
### :icon[check-circle]{success} Phase 1: Foundation (Complete) {medium-bold}

- Basic parser (Markdown + inline styles + component blocks)
- HTML/CSS generator
- CLI compiler tool
- Test suite with syntax fixtures
- 3 initial components (card, grid, container)
:::

:::card {elevated}
### :icon[code]{accent} Phase 2: Component System (In Progress) {medium-bold}

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
:::

:::card {elevated}
### :icon[edit]{warning} Phase 3: Editor (Planned) {medium-bold}

- VS Code extension enhancements
- Live preview pane
- IntelliSense and autocomplete
- Command palette
- Export functionality
:::

:::card {elevated}
### :icon[zap]{info} Phase 4: Enhancement (Future) {medium-bold}

- Performance optimization
- Plugin system
- Standalone editor (Tauri app)
- Advanced theming
- Animation presets
:::
:::

---

## Contributing {large-bold primary}

:::card {light-glass padded}
We welcome contributions! :icon[heart]{primary} {center large}

**Please follow these steps:**

1. Fork the repository :icon[git-fork]{xs}
2. Create a feature branch :icon[git-branch]{xs}
3. Make your changes with tests :icon[edit]{xs}
4. Ensure all tests pass (`pnpm test`) :icon[check-circle]{xs}
5. Run type checking (`pnpm typecheck`) :icon[check]{xs}
6. Format code (`pnpm format`) :icon[code]{xs}
7. Submit a Pull Request :icon[git-pull-request]{xs}
:::

:::card {elevated padded}
### :icon[shield]{primary} Code Standards {medium-bold}

- TypeScript with strict mode
- Prettier for formatting
- ESLint for code quality
- Vitest for testing
- Minimum 80% test coverage
:::

---

## Documentation {large-bold primary}

:::grid {cols="2"}
:::card {elevated}
:icon[book-open]{primary huge} {center}

**[SYNTAX.md](SYNTAX.md)** {large-bold center}

Canonical syntax specification (v0.2.0)
:::

:::card {elevated}
:icon[file-text]{accent huge} {center}

**[tech-spec.md](tech-spec.md)** {large-bold center}

Technical specification
:::

:::card {elevated}
:icon[folder]{warning huge} {center}

**[examples/](examples/)** {large-bold center}

Sample documents
:::

:::card {elevated}
:icon[book]{info huge} {center}

**[examples/README.md](examples/README.md)** {large-bold center}

Example documentation
:::
:::

---

## License {large-bold primary}

:::card {light-glass padded}
### :icon[file-text]{primary} MIT License {large-bold center}

Copyright (c) 2025 Taildown Team {center muted}
:::

---

## Acknowledgments {large-bold primary}

Taildown is built on excellent open-source projects: {center large muted}

:::grid {cols="3"}
:::card {elevated}
:icon[hash]{primary} {center}

**Markdown**

CommonMark specification
:::

:::card {elevated}
:icon[wind]{accent} {center}

**Tailwind CSS**

Utility-first CSS approach
:::

:::card {elevated}
:icon[box]{warning} {center}

**shadcn/ui**

Component design patterns
:::

:::card {elevated}
:icon[code]{info} {center}

**unified/remark/rehype**

Content transformation
:::

:::card {elevated}
:icon[feather]{success} {center}

**Lucide**

Beautiful icon library
:::

:::card {elevated}
:icon[code-2]{primary} {center}

**Prism.js**

Syntax highlighting
:::
:::

---

## FAQ {large-bold primary}

:::card {elevated padded}
**Q: How is Taildown different from MDX?** {large-bold}

A: Taildown focuses on styling and layout with simpler, non-React syntax. It generates static HTML/CSS without requiring a JavaScript framework.
:::

:::card {elevated padded}
**Q: Do I need to know Tailwind CSS?** {large-bold}

A: No! Taildown uses plain English like `{huge-bold primary}` that translates automatically. Tailwind knowledge is optional.
:::

:::card {elevated padded}
**Q: Can I use Taildown in production?** {large-bold}

A: Phase 2 is in active development. It's suitable for experimentation and internal tools but not yet recommended for production.
:::

:::card {elevated padded}
**Q: How do I customize styles?** {large-bold}

A: The configuration system (`taildown.config.js`) is implemented but customization APIs are being finalized in Phase 2.
:::

:::card {elevated padded}
**Q: Does Taildown support dark mode?** {large-bold}

A: Dark mode system is planned and will be implemented soon in Phase 2.
:::

---

:::card {light-glass padded}
:icon[heart]{primary huge} {center}

**Built with care by the Taildown Team** {huge-bold center primary}

**Last Updated:** October 6, 2025 {center muted large}
:::
