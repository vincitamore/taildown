# Taildown {huge-bold center primary}

**Beautiful documents. Zero configuration. Plain English.** {center large muted}

The revolutionary markup language that makes creating stunning, interactive web content as simple as writing. {center muted}

[Get Started](#get-started){button primary large hover-lift} [View Examples](#examples){button secondary large hover-lift} [Dark Mode Guide](#dark-mode){button info large hover-lift}

---

## Why Taildown? {large-bold primary center}

:::grid{3}
:::card{light-glass fade-in hover-lift}
### :icon[zap]{warning huge} Zero Config Beauty {medium-bold center}

Beautiful, professional styling right out of the box. No setup, no configuration files, no build steps. Just write and compile.

**Perfect for:**
- Rapid prototyping
- Documentation sites
- Landing pages
- Blog posts
:::

:::card{light-glass fade-in hover-lift}
### :icon[type]{primary huge} Plain English Syntax {medium-bold center}

Use natural language like `{huge-bold primary center}` instead of cryptic CSS classes. Reads like English, compiles to beautiful HTML and CSS.

**Features:**
- Natural grammar
- Intuitive styling
- Zero learning curve
- Self-documenting
:::

:::card{light-glass fade-in hover-lift}
### :icon[moon]{accent huge} Dark Mode Built-in {medium-bold center}

Automatic dark mode with smooth transitions, localStorage persistence, and system preference detection. Works everywhere, instantly.

**Includes:**
- Auto-toggle button
- Smooth transitions
- System detection
- Zero JavaScript needed
:::
:::

---

## Key Features {large-bold primary center}

:::grid{2}
:::card{subtle-glass slide-up}
### :icon[check-circle]{success} Core Capabilities {medium-bold}

- :icon[check]{success xs} **Markdown Compatible** - Standard Markdown works without modification
- :icon[check]{success xs} **Plain English Styling** - Natural language attributes like `{large-bold primary}`
- :icon[check]{success xs} **Icon System** - Built-in Lucide icons with `:icon[name]` syntax
- :icon[check]{success xs} **Modern Effects** - Glassmorphism, animations, and smooth transitions
- :icon[check]{success xs} **Fast Compilation** - Sub-100ms compile times for instant feedback
- :icon[check]{success xs} **Semantic HTML5** - Clean, accessible markup generation
:::

:::card {subtle-glass slide-up}
### :icon[layers]{accent} Interactive Components {medium-bold}

- :icon[layout]{primary xs} **Tabs** - Zero-config tabbed interfaces
- :icon[list]{primary xs} **Accordion** - Collapsible sections
- :icon[image]{primary xs} **Carousel** - Image/content sliders with 3D effects
- :icon[message-square]{primary xs} **Modal** - Dialog boxes with backdrop blur
- :icon[info]{primary xs} **Tooltip** - Contextual help on hover/click
- :icon[code]{primary xs} **Syntax Highlighting** - Beautiful code blocks with copy button
:::

:::card{subtle-glass slide-up}
### :icon[sparkles]{warning} Attachable Components {medium-bold}

Revolutionary one-line modals and tooltips:

```taildown
[Click Me](#){button modal="Simple message!"}
[Help](#){tooltip="Quick tip"}
```

- Attach to ANY element
- Full Markdown support
- ID references for reusability
- Zero JavaScript configuration
:::

:::card {subtle-glass slide-up}
### :icon[zap]{info} Smart Defaults {medium-bold}

- :icon[palette]{accent xs} **Semantic Colors** - `primary`, `success`, `warning`, `error`
- :icon[wind]{primary xs} **Glassmorphism** - Frosted glass effects with variants
- :icon[move]{success xs} **Scroll Animations** - Entrance animations on scroll
- :icon[grid-3x3]{warning xs} **Responsive Grids** - Mobile-first, adaptive layouts
- :icon[sun]{error xs} **Dark Mode** - Automatic with smooth transitions
- :icon[accessibility]{info xs} **Accessible** - ARIA support, keyboard navigation
:::
:::

---

## Quick Start {id="get-started" large-bold primary center}

Get up and running in under 2 minutes: {center muted}

:::tabs
## :icon[download]{primary xs} Installation

Install Taildown from npm or clone the repository:

```bash
# Via npm (coming soon)
npm install -g taildown

# Or clone the repository
git clone https://github.com/taildown/taildown.git
cd taildown

# Install dependencies
pnpm install

# Build packages
pnpm build
```

## :icon[file-text]{accent xs} Create Document

Create a file named `hello.td`:

```taildown
# Welcome to Taildown {huge-bold center primary}

Build beautiful documents with plain English syntax! {large muted center}

:::card {light-glass slide-up}
### :icon[heart]{error} Why You'll Love It {medium-bold}

- **Zero configuration** - Beautiful by default
- **Plain English** - No CSS knowledge needed
- **Dark mode** - Built-in and automatic
- **Fast** - Compile in milliseconds

[Get Started](#){button primary hover-lift}
:::
```

## :icon[terminal]{success xs} Compile

Compile your document to HTML:

```bash
# Basic compilation
pnpm taildown compile hello.td

# With dark mode (enabled by default)
pnpm taildown compile hello.td

# Separate CSS file
pnpm taildown compile hello.td --separate
```

**Output:**
- `hello.html` - Self-contained HTML with embedded CSS
- JavaScript automatically included inline if interactive components used

Open `hello.html` in your browser to see your beautiful, dark-mode-enabled document!
:::

---

## Dark Mode Showcase {id="dark-mode" large-bold primary center}

Taildown includes automatic dark mode with zero configuration: {center muted}

:::card {heavy-glass padded}
### :icon[moon]{accent} How It Works {large-bold center}

:::grid {3}
:::card {elevated}
### 1. Auto-Detection {medium-bold center}

Automatically detects system preference on first visit using `prefers-color-scheme`.
:::

:::card {elevated}
### 2. Toggle Button {medium-bold center}

Floating toggle button (bottom-right by default) with smooth icon transitions.
:::

:::card {elevated}
### 3. Persistence {medium-bold center}

Saves preference to localStorage for consistent experience across visits.
:::
:::

**Features:**
- :icon[check]{success xs} Smooth 300ms transitions between themes
- :icon[check]{success xs} CSS variables for dynamic theming
- :icon[check]{success xs} Auto-injected toggle button
- :icon[check]{success xs} System preference detection
- :icon[check]{success xs} LocalStorage persistence
- :icon[check]{success xs} Zero configuration required

:::alert {info}
:icon[lightbulb]{info} **Try it now!** Click the moon/sun icon in the bottom-right corner to toggle between light and dark modes. Your preference will be saved automatically.
:::
:::

---

## Examples {id="examples" large-bold primary center}

Explore real-world examples showcasing Taildown's capabilities: {center muted}

:::grid {3}
:::card {light-glass zoom-in interactive}
### :icon[home]{primary} Landing Page {medium-bold}

Complete SaaS landing page with hero section, features grid, and call-to-action. Demonstrates glassmorphism and scroll animations.

[View Example](examples/landing-page.html){button primary small}
:::

:::card{light-glass zoom-in interactive}
### :icon[book]{accent} Documentation {medium-bold}

Technical documentation with syntax highlighting, code examples, and interactive tabs. Shows component organization.

[View Example](examples/documentation.html){button secondary small}
:::

:::card{light-glass zoom-in interactive}
### :icon[file-text]{success} Blog Post {medium-bold}

Long-form blog post with images, code blocks, and beautiful typography. Demonstrates content-focused design.

[View Example](examples/blog-post.html){button info small}
:::

:::card {light-glass zoom-in interactive}
### :icon[briefcase]{warning} Portfolio {medium-bold}

Personal portfolio with project showcase, glass effects, and interactive hover states.

[View Example](examples/portfolio.html){button primary small}
:::

:::card {light-glass zoom-in interactive}
### :icon[palette]{error} Component Library {medium-bold}

Complete showcase of all 18+ Taildown components with variants and customization options.

[View Example](examples/components.html){button secondary small}
:::

:::card{light-glass zoom-in interactive}
### :icon[zap]{info} Interactive Demo {medium-bold}

Tabs, accordions, carousels, modals, and tooltips in action. Full interactivity showcase.

[View Example](examples/interactive.html){button info small}
:::
:::

---

## Documentation {large-bold primary center}

Comprehensive guides to master Taildown: {center muted}

:::grid{2}
:::card{elevated hover-lift}
### :icon[book-open]{primary} Syntax Guide {large-bold}

Learn the complete Taildown syntax from basics to advanced features.

[Read Syntax Guide](syntax-guide.html){button primary}
:::

:::card{elevated hover-lift}
### :icon[type]{accent} Plain English Reference {large-bold}

Complete reference of all plain English styling shorthands.

[View Reference](plain-english.html){button secondary}
:::

:::card{elevated hover-lift}
### :icon[package]{success} Components {large-bold}

Documentation for all 18+ built-in components with examples.

[Browse Components](components.html){button info}
:::

:::card {elevated hover-lift}
### :icon[settings]{warning} Configuration {large-bold}

Customize colors, fonts, and defaults with `taildown.config.js`.

[Configuration Guide](configuration.html){button primary}
:::
:::

---

## Community & Support {large-bold primary center}

:::card {subtle-glass padded}
### Get Help & Contribute {large-bold center}

:::grid {4}
:::card {elevated}
:icon[github]{primary huge} {center}

**GitHub** {large-bold center}

Star, fork, and contribute on GitHub.

[Repository](https://github.com/taildown/taildown){button primary small}
:::

:::card {elevated}
:icon[message-circle]{accent huge} {center}

**Discussions** {large-bold center}

Ask questions and share ideas.

[Join Discussion](https://github.com/taildown/taildown/discussions){button secondary small}
:::

:::card {elevated}
:icon[bug]{error huge} {center}

**Issues** {large-bold center}

Report bugs and request features.

[Open Issue](https://github.com/taildown/taildown/issues){button info small}
:::

:::card {elevated}
:icon[book]{success huge} {center}

**Documentation** {large-bold center}

Read the full documentation.

[Read Docs](docs/){button primary small}
:::
:::
:::

---

:::card{heavy-glass padded}
:icon[heart]{error huge} {center}

**Made with Taildown** {huge-bold center primary}

This entire documentation site is written in Taildown syntax and compiled to static HTML with dark mode, glassmorphism, and scroll animations. View the source to see how it's done! {large center muted}

[View Source](https://github.com/taildown/taildown/tree/main/docs-site){button accent large hover-lift}
:::

