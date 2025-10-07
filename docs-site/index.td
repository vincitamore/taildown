:::navbar
# Taildown

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html)
:::



# Taildown {huge-bold center primary}

**Write markdown. Get magic.** {center large}

The markup language that transforms plain English into stunning, interactive web pages - zero configuration required. {center}

---

## What Is Taildown? {large-bold primary center}

**Taildown is a superset of Markdown** that adds powerful features while maintaining full backwards compatibility. Write natural English styling instead of CSS classes, create interactive components with simple syntax, and compile to beautiful HTML + CSS + JavaScript. {center large}

:::grid {3}
:::card {subtle-glass hover-lift fade-in}
### :icon[zap]{warning huge} Zero Config {medium-bold center}

Beautiful, professional styling out of the box. No setup, no configuration files, no webpack. Just write and compile.

**What you get:**
- Modern glassmorphism effects
- Automatic dark mode
- Responsive design
- Smooth animations
:::

:::card {subtle-glass hover-lift fade-in}
### :icon[type]{primary huge} Plain English {medium-bold center}

Use natural language for styling - `{large-bold primary center}` instead of cryptic CSS classes.

**Natural syntax:**
- `{huge-bold}` not `{.text-4xl .font-bold}`
- `{light-glass}` not `{.bg-white/75 .backdrop-blur}`
- `{hover-lift}` not `{.hover:translate-y-1}`
:::

:::card {subtle-glass hover-lift fade-in}
### :icon[moon]{accent huge} Dark Mode Built-in {medium-bold center}

Every Taildown document includes automatic dark mode with system detection, localStorage persistence, and smooth transitions.

**Features:**
- Auto-toggle button
- System preference detection
- 300ms smooth transitions
- Zero JavaScript required
:::
:::

---

## See It In Action {large-bold primary center}

### Example: Create a Beautiful Card {medium-bold}

:::tabs
## Taildown Syntax

Write this:

```taildown
:::card {light-glass padded-lg hover-lift}
## Welcome! {large-bold primary}

This card has glassmorphism, padding, and hover effects with **zero CSS**.

[Click Me](#){button primary hover-lift}
:::
```

Natural English. Readable. Powerful.

## Traditional HTML/CSS

Would require:

```html
<div class="backdrop-blur-md bg-white/75 border border-white/50 
     rounded-xl shadow-lg p-8 transition-transform 
     hover:-translate-y-1">
  <h2 class="text-2xl font-bold text-blue-600">Welcome!</h2>
  <p>This card has glassmorphism, padding, and hover effects 
     with <strong>zero CSS</strong>.</p>
  <a href="#" class="inline-block px-6 py-3 bg-blue-600 
     text-white rounded-lg hover:-translate-y-0.5">
    Click Me
  </a>
</div>
```

Plus custom CSS for dark mode, animations, etc.
:::

---

## Core Features {large-bold primary center}

:::tabs
## Plain English Styling

**Natural language replaces cryptic CSS classes**

| Instead of This | Write This |
|----------------|------------|
| `.text-4xl .font-bold` | `{huge-bold}` |
| `.bg-blue-600 .text-white` | `{primary-bg}` |
| `.rounded-lg .shadow-xl` | `{rounded-lg elevated}` |
| `.hover:translate-y-1` | `{hover-lift}` |

Everything reads like English. Everything makes sense.

## Components

**18+ built-in components with zero configuration**

```taildown
:::card {light-glass}
Card with glassmorphism
:::

:::tabs
## Tab One
Content for tab one
## Tab Two  
Content for tab two
:::

:::alert {success}
Operation completed successfully!
:::
```

Tabs, accordions, carousels, modals, tooltips, and more.

## Icons

**1000+ Lucide icons with simple syntax**

```taildown
:icon[check]{success} Task complete
:icon[heart]{error large} Love it
:icon[zap]{warning huge} Fast
```

Icons adapt to dark mode, resize naturally, and integrate perfectly.

## Glassmorphism

**Frosted glass effects in four variants**

```taildown
:::card {subtle-glass}
90% transparency - very subtle
:::

:::card {light-glass}
75% transparency - light frosted
:::

:::card {glass}
60% transparency - standard
:::

:::card {heavy-glass}
40% transparency - heavy frosted
:::
```

All with backdrop blur, gradient borders, and smooth transitions.

## Animations

**Scroll-triggered and hover animations**

```taildown
:::card {fade-in hover-lift}
Fades in on scroll, lifts on hover
:::

:::grid {3}
:::card {slide-up}
Slides up when scrolled into view
:::
:::card {zoom-in}
Zooms in from center
:::
:::card {slide-left}
Slides from the right
:::
:::
```

Smooth, performant, GPU-accelerated.

## Dark Mode

**Automatic with smooth transitions**

- System preference detection on first visit
- Floating toggle button (bottom-right)
- LocalStorage persistence
- 300ms smooth transitions
- CSS variables for theming
- Works everywhere instantly

**Try it now!** Click the moon/sun button :icon[arrow-down]{primary}
:::

---

## Interactive Components {large-bold primary center}

**Zero-config tabs, accordions, modals, tooltips, and carousels** {center muted}

:::grid {2}
:::card {light-glass}
### :icon[layout]{primary} Tabs {medium-bold}

Headings become tabs automatically:

```taildown
:::tabs
## First Tab
Content for first tab
## Second Tab
Content for second tab
:::
```

**Features:**
- Click or keyboard navigation
- ARIA accessible
- Smooth transitions
- Centered, responsive layout
:::

:::card {light-glass}
### :icon[list]{accent} Accordion {medium-bold}

Bold text becomes triggers:

```taildown
:::accordion
**First Section**
Content for first section
**Second Section**
Content for second section
:::
```

**Features:**
- Click to expand/collapse
- First item open by default
- Smooth animations
- Full ARIA support
:::

:::card {light-glass}
### :icon[image]{success} Carousel {medium-bold}

Horizontal rules divide slides:

```taildown
:::carousel
First slide

---

Second slide

---

Third slide
:::
```

**Features:**
- 3D card effects
- Swipe support
- Navigation buttons
- Indicator dots
:::

:::card {light-glass}
### :icon[message-square]{warning} Modals & Tooltips {medium-bold}

Attach to ANY element:

```taildown
[Click Me](#){button modal="Hello!"}

[Help](#){tooltip="Helpful tip"}
```

**Features:**
- One-line syntax
- Full markdown support
- ID references for reuse
- Backdrop blur effects
:::
:::

---

## Why Taildown? {large-bold primary center}

:::grid {2}
:::card {elevated hover-lift}
### :icon[check-circle]{success} For You {large-bold success}

- :icon[check]{success xs} **Zero learning curve** - If you know Markdown, you know Taildown
- :icon[check]{success xs} **Beautiful by default** - Professional styling without design skills  
- :icon[check]{success xs} **Plain English** - Natural language instead of cryptic classes
- :icon[check]{success xs} **Fast development** - Build in minutes, not hours
- :icon[check]{success xs} **No build tools** - Single command compilation
- :icon[check]{success xs} **Dark mode free** - Automatic, everywhere
:::

:::card {elevated hover-lift}
### :icon[code]{primary} For Your Projects {large-bold primary}

- :icon[check]{primary xs} **Self-contained output** - Single HTML file with embedded styles
- :icon[check]{primary xs} **Mobile optimized** - Responsive by default
- :icon[check]{primary xs} **Accessible** - ARIA attributes, keyboard navigation
- :icon[check]{primary xs} **Performant** - GPU-accelerated, optimized CSS
- :icon[check]{primary xs} **SEO friendly** - Semantic HTML5
- :icon[check]{primary xs} **Framework free** - Vanilla JavaScript, no dependencies
:::
:::

---

## Perfect For {large-bold primary center}

:::grid {4}
:::card {subtle-glass center}
:icon[book-open]{primary huge}

**Documentation** {medium-bold}

Technical docs, API references, user guides
:::

:::card {subtle-glass center}
:icon[layout]{accent huge}

**Landing Pages** {medium-bold}

Product pages, portfolios, SaaS sites
:::

:::card {subtle-glass center}
:icon[file-text]{success huge}

**Blog Posts** {medium-bold}

Articles, tutorials, long-form content
:::

:::card {subtle-glass center}
:icon[zap]{warning huge}

**Prototyping** {medium-bold}

Rapid mockups, design exploration
:::
:::

---

## Quick Start {large-bold primary center}

Get up and running in under 2 minutes: {center muted}

:::card {heavy-glass padded-lg}
### :icon[download]{primary} Step 1: Install {medium-bold}

```bash
# Via npm (coming soon)
npm install -g taildown

# Or clone repository
git clone https://github.com/vincitamore/taildown.git
cd taildown && pnpm install && pnpm build
```

### :icon[file-text]{accent} Step 2: Create Document {medium-bold}

Create `hello.td`:

```taildown
# Hello World {huge-bold center primary}

Welcome to Taildown! {large center muted}

:::card {light-glass hover-lift}
## Your First Card {medium-bold}

Beautiful by default with zero configuration.

[Get Started](#){button primary hover-lift}
:::
```

### :icon[terminal]{success} Step 3: Compile {medium-bold}

```bash
pnpm taildown compile hello.td
```

**Output:** `hello.html` - Self-contained, dark mode enabled, ready to deploy!
:::

---

## Real-World Examples {large-bold primary center}

**See what people are building with Taildown** {center muted}

:::grid {3}
:::card {light-glass zoom-in hover-lift}
### :icon[globe]{primary huge} {center}

**This Documentation** {large-bold center}

This entire site is written in Taildown. View source to see how!

[View Source](https://github.com/vincitamore/taildown/tree/main/docs-site){button secondary small}
:::

:::card {light-glass zoom-in hover-lift}
### :icon[file-text]{accent huge} {center}

**Plain English Guide** {large-bold center}

Comprehensive reference with tables, tabs, and examples.

[View Example](plain-english.html){button secondary small}
:::

:::card {light-glass zoom-in hover-lift}
### :icon[book-open]{success huge} {center}

**Getting Started** {large-bold center}

Tutorial with interactive components and code examples.

[View Example](getting-started.html){button secondary small}
:::
:::

---

## Community & Support {large-bold primary center}

:::card {subtle-glass padded}
### Get Involved {large-bold center}

:::grid {4}
:::card {elevated hover-lift center}
:icon[github]{primary huge}

**GitHub** {medium-bold}

Star, fork, contribute

[Repository](https://github.com/vincitamore/taildown){button primary small}
:::

:::card {elevated hover-lift center}
:icon[message-circle]{accent huge}

**Discussions** {medium-bold}

Ask questions, share ideas

[Join](https://github.com/vincitamore/taildown/discussions){button secondary small}
:::

:::card {elevated hover-lift center}
:icon[bug]{error huge}

**Issues** {medium-bold}

Report bugs, request features

[Open Issue](https://github.com/vincitamore/taildown/issues){button info small}
:::

:::card {elevated hover-lift center}
:icon[book]{success huge}

**Documentation** {medium-bold}

Complete reference

[Read Docs](syntax-guide.html){button primary small}
:::
:::
:::

---

:::card {heavy-glass padded-xl center}
:icon[heart]{error huge}

**Ready to build something beautiful?** {huge-bold primary}

Get started in 5 minutes. No configuration. No complexity. Just pure creative flow. {large muted}
:::
