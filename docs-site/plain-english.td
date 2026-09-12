:::navbar
[Taildown](index.html){.navbar-brand}

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html) [Live Editor](editor.html)
:::



# Plain English Reference {huge-bold center primary}

**Complete guide to natural language styling in Taildown** {center large muted}

Natural language styling is Taildown's superpower. Write `{large-bold primary}` instead of cryptic CSS classes. {center}

---

## Philosophy {bold primary}

:::card {subtle-glass padded}
### :icon[type]{primary} Natural Grammar First {bold}

Taildown follows **natural English grammar and word order**, not CSS conventions. This makes styling intuitive and self-documenting.

**Core Principles:**
- :icon[check]{success xs} **Adjective-Noun Order** - "large text" not "text-large"
- :icon[check]{success xs} **Single Descriptive Words** - "bold" not "font-bold"
- :icon[check]{success xs} **State Modifiers First** - "hover-lift" not "lift-hover"
- :icon[check]{success xs} **Natural Phrases** - Reads like English, compiles to CSS
:::

---

## Typography {bold primary}

:::tabs
## Sizes

Control text size with natural keywords:

Unstyled reading text scales from 16px to 18px with the viewport. Headings retain their semantic size hierarchy and use compact line spacing. Explicit size and line-height attributes override these defaults.

Inline code uses a readable text/background pair in both themes, including inside tables and tooltips. Customize `--inline-code-text` and `--inline-code-background` in your CSS when composing a different palette; fenced code retains its syntax-highlighting theme.

| Shorthand | Result | CSS Equivalent |
|-----------|--------|----------------|
| `{xs}` | Extra small text | `text-xs` |
| `{small}` | Small text | `text-sm` |
| `{base}` | Base size (default) | `text-base` |
| `{large}` | Large text | `text-lg` |
| `{xl}` | Extra large text | `text-xl` |
| `{2xl}` | 2X large text | `text-2xl` |
| `{3xl}` | 3X large text | `text-3xl` |
| `{huge}` | Huge text | `text-4xl` |
| `{massive}` | Massive text | `text-6xl` |

**Examples:**
```taildown
# Huge Heading {huge}
Normal paragraph text {base}
Small footnote {small muted}
```

## Font families

| Shorthand | Family | CSS Equivalent |
|-----------|--------|----------------|
| `{sans}` | Sans-serif | `font-sans` |
| `{serif}` | Serif | `font-serif` |
| `{mono}` | Monospace | `font-mono` |

These use the document's font stacks. Set `theme.fonts` in the compiler API to override the stacks; font files are not downloaded automatically. The editor exposes all three in style completion and the Insert / Ctrl/Cmd+K menu.

A considered idea {serif large}

A clear instruction {sans}

const idea = 'make it readable'; {mono}

## Weights

Control font weight naturally:

| Shorthand | Result | CSS Equivalent |
|-----------|--------|----------------|
| `{thin}` | Thin weight | `font-thin` |
| `{light}` | Light weight | `font-light` |
| `{normal}` | Normal weight | `font-normal` |
| `{medium}` | Medium weight | `font-medium` |
| `{semibold}` | Semi-bold | `font-semibold` |
| `{bold}` | Bold weight | `font-bold` |
| `{extra-bold}` | Extra bold | `font-extrabold` |
| `{black}` | Black weight | `font-black` |

**Examples:**
```taildown
# Bold Heading {bold}
Semibold emphasis {semibold primary}
Light muted text {light muted}
```

## Combinations

Combine size and weight naturally:

Use the listed compound shorthands or separate tokens, such as `{xl bold}`. `medium` means font weight, so use `{bold}` for a bold heading at its natural size rather than the unsupported `medium-bold`.

```taildown
# Large Bold Title {large-bold primary}
Medium weight subheading {medium}
Small light muted text {small-light muted}
```

**Common combinations:**
- `{large-bold}` - Large and bold
- `{huge-bold}` - Huge and bold  
- `{small-light}` - Small and light
- `{xl-semibold}` - XL and semi-bold

## Line Height

Control line spacing with natural phrases:

| Shorthand | Result |
|-----------|--------|
| `{tight-lines}` | Tight line spacing |
| `{normal-lines}` | Normal spacing (default) |
| `{relaxed-lines}` | Relaxed spacing |
| `{loose-lines}` | Loose spacing |

**Example:**
```taildown
Paragraph with tight lines {tight-lines}
Paragraph with relaxed lines {relaxed-lines}
```
:::

---

## Colors {bold primary}

:::grid {2}
:::card {light-glass}
### :icon[palette]{primary} Semantic Colors {bold}

`success`, `warning`, `error`, and `info` use separate text colors for light and dark pages. Customize `--success-text` (and the corresponding status variables) independently of the background `--success` and its `--success-foreground`. Explicit numbered utilities keep their fixed shades.

`muted` and combinations such as `small-muted` use the theme's `--muted-foreground`, keeping supporting text readable in both themes. Use a numbered gray utility when you specifically want a fixed shade.

`primary`, `secondary`, and `accent` text colors follow the active light or dark theme, including their hover shades. Use these semantic names for readable accents on the default page and card surfaces. Explicit numbered utilities such as `text-primary-600` keep their fixed shade. Custom CSS can tune `--primary-text` and `--primary-text-hover` (and the corresponding secondary/accent variables) independently of button and background colors.

Use semantic color names for consistency:

| Color | Usage | Example |
|-------|-------|---------|
| `primary` | Primary brand color | :icon[circle]{primary} Primary |
| `secondary` | Secondary brand color | :icon[circle]{secondary} Secondary |
| `accent` | Accent highlights | :icon[circle]{accent} Accent |
| `success` | Success states | :icon[circle]{success} Success |
| `warning` | Warning states | :icon[circle]{warning} Warning |
| `error` | Error states | :icon[circle]{error} Error |
| `info` | Information | :icon[circle]{info} Info |
| `muted` | Muted/subtle text | :icon[circle]{muted} Muted |

**Examples:**
```taildown
# Primary Heading {primary}
Success message {success}
Error alert {error bold}
Muted footer text {muted small}
```
:::

:::card {light-glass}
### :icon[droplet]{accent} Background Colors {bold}

Add `-bg` suffix for background colors. Status pairs use the same theme colors and contrasting foregrounds as status buttons:

| Shorthand | Result |
|-----------|--------|
| `{primary-bg}` | Primary background + white text |
| `{success-bg}` | Success background + contrasting text |
| `{warning-bg}` | Warning background + dark text |
| `{error-bg}` | Error background + contrasting text |
| `{muted-bg}` | Muted background + dark text |

**Examples:**
```taildown
:::card {primary-bg}
Primary colored card
:::

:::alert {success-bg}
Success message with background
:::
```
:::
:::

---

## Layout {bold primary}

:::tabs
## Flex

Flexible layout with natural syntax:

| Shorthand | Result |
|-----------|--------|
| `{flex}` | Flex container |
| `{flex-col}` | Flex column direction |
| `{flex-row}` | Flex row direction |
| `{flex-center}` | Flex with centered items |
| `{flex-wrap}` | Flex with wrapping |

**Example:**
```taildown
:::card {flex flex-center}
Centered content
:::
```

## Grid

Grid layouts made simple:

| Shorthand | Result |
|-----------|--------|
| `{grid}` | Grid container |
| `{grid-2}` | 2-column grid |
| `{grid-3}` | 3-column grid |
| `{grid-4}` | 4-column grid |
| `{grid-auto}` | Auto-fit grid |

**Example:**
```taildown
:::grid {3}
Three column grid
:::
```

## Centering

Center elements naturally:

| Shorthand | Result |
|-----------|--------|
| `{center}` | Center text |
| `{center-x}` | Center horizontally |
| `{center-y}` | Center vertically |
| `{center-both}` | Center both directions |

**Example:**
```taildown
# Centered Heading {center}
:::card {center-both}
Fully centered card
:::
```
:::

---

## Spacing {bold primary}

:::grid {2}
:::card {subtle-glass}
### :icon[box]{primary} Padding {bold}

Control internal spacing:

| Shorthand | Size |
|-----------|------|
| `{padded-xs}` | Extra small padding |
| `{padded-sm}` | Small padding |
| `{padded}` | Default padding |
| `{padded-lg}` | Large padding |
| `{padded-xl}` | Extra large padding |

**Example:**
```taildown
:::card {padded-lg}
Large padded card
:::
```
:::

:::card {subtle-glass}
### :icon[maximize]{accent} Gap {bold}

Control spacing between items:

| Shorthand | Size |
|-----------|------|
| `{gap-xs}` | Extra small gap |
| `{gap-sm}` | Small gap |
| `{gap}` | Default gap |
| `{gap-lg}` | Large gap |
| `{gap-xl}` | Extra large gap |

**Example:**
```taildown
:::grid {3 gap-lg}
Grid with large gaps
:::
```
:::
:::

---

## Effects {bold primary}

:::tabs
## Borders & Corners

Rounded corners and borders:

| Shorthand | Result |
|-----------|--------|
| `{rounded}` | Default rounded corners |
| `{rounded-sm}` | Small rounded corners |
| `{rounded-lg}` | Large rounded corners |
| `{rounded-xl}` | Extra large rounded |
| `{rounded-full}` | Fully rounded (circle/pill) |

**Example:**
```taildown
:::card {rounded-xl}
Extra rounded card
:::

[Pill Button](#){button primary rounded-full}
```

## Shadows

Add depth with shadows:

| Shorthand | Result |
|-----------|--------|
| `{shadow}` | Default shadow |
| `{shadow-sm}` | Small shadow |
| `{shadow-lg}` | Large shadow |
| `{shadow-xl}` | Extra large shadow |
| `{elevated}` | Elevated appearance |
| `{floating}` | Floating effect |

**Example:**
```taildown
:::card {elevated}
Elevated card
:::

:::card {shadow-xl}
Deep shadow card
:::
```

## Glassmorphism

Frosted glass effects:

| Shorthand | Transparency | Use Case |
|-----------|--------------|----------|
| `{subtle-glass}` | 90% | Very subtle |
| `{light-glass}` | 75% | Light frosted |
| `{glass}` | 60% | Standard glass |
| `{heavy-glass}` | 40% | Heavy frosted |

**Example:**
```taildown
:::card {light-glass}
Light frosted glass card
:::

:::card {heavy-glass padded-xl}
Heavy frosted with padding
:::
```
:::

---

## Animations {bold primary}

:::grid {3}
:::card {light-glass fade-in}
### :icon[zap]{warning} Entrance {bold}

Scroll-triggered entrance animations:

- `{fade-in}` - Fade in
- `{slide-up}` - Slide up
- `{slide-down}` - Slide down
- `{slide-left}` - Slide left
- `{slide-right}` - Slide right
- `{zoom-in}` - Zoom in
- `{zoom-out}` - Zoom out

**This card has `{fade-in}` applied!**
:::

:::card {light-glass slide-up}
### :icon[mouse-pointer]{primary} Hover Effects {bold}

Interactive hover animations:

- `{hover-lift}` - Lift on hover
- `{hover-glow}` - Glow on hover
- `{hover-scale}` - Scale up on hover
- `{hover-rotate}` - Rotate on hover
- `{hover-grow}` - Grow on hover

**This card has `{slide-up}` applied!**
:::

:::card {light-glass zoom-in}
### :icon[clock]{accent} Speed {bold}

Control animation speed:

- `{fast}` - Fast animations (150ms)
- `{smooth}` - Smooth (300ms, default)
- `{slow}` - Slow animations (500ms)

**This card has `{zoom-in}` applied!**
:::
:::

---

## Combining Shorthands {bold primary}

:::card {heavy-glass padded-lg}
### :icon[layers]{primary huge} The Power of Composition {large-bold center}

Taildown shorthands combine naturally to create complex styles with readable syntax.

:::grid {2}
:::card {elevated hover-lift}
**Simple Example**

```taildown
# Heading {large-bold primary center}
```

Combines:
- `large` - Large text size
- `bold` - Bold font weight
- `primary` - Primary color
- `center` - Centered alignment
:::

:::card {elevated hover-lift}
**Complex Example**

```taildown
:::card {light-glass padded-xl rounded-xl hover-lift fade-in}
Card content
:::
```

Combines:
- `light-glass` - Frosted glass effect
- `padded-xl` - Extra large padding
- `rounded-xl` - Extra large corners
- `hover-lift` - Lift on hover
- `fade-in` - Entrance animation
:::
:::
:::

---

## Best Practices {bold primary}

:::grid {2}
:::card {subtle-glass}
### :icon[check-circle]{success} Do {large-bold success}

- :icon[check]{success xs} Use natural English word order
- :icon[check]{success xs} Combine shorthands for rich effects
- :icon[check]{success xs} Keep it readable and self-documenting
- :icon[check]{success xs} Use semantic color names
- :icon[check]{success xs} Leverage glassmorphism for modern looks
- :icon[check]{success xs} Add hover effects for interactivity

```taildown
# Great Title {huge-bold primary center}

:::card {light-glass padded-lg hover-lift}
Beautiful, readable, and powerful!
:::
```
:::

:::card {subtle-glass}
### :icon[x-circle]{error} Don't {large-bold error}

- :icon[x]{error xs} Don't use CSS property names
- :icon[x]{error xs} Don't reverse natural word order
- :icon[x]{error xs} Don't overuse effects
- :icon[x]{error xs} Don't hardcode colors
- :icon[x]{error xs} Don't ignore semantic meaning

```taildown
# Bad Title {.text-4xl .font-bold .text-blue-500}

:::card {.bg-white .p-8}
Falls back to raw CSS classes
:::
```
:::
:::

---

## Color transparency {bold primary}

Add an integer opacity from `0` to `100` after a color utility: `bg-primary/20`, `text-gray-900/80`, or `border-primary/30`. This changes that color rather than fading the element's children. It also works with configured colors and prefixes such as `dark:bg-primary/10` or `md:bg-primary/20`.

```taildown
:::card {bg-primary/10 dark:bg-primary/20 border-primary/30 padded}
A translucent surface with fully opaque text.
:::
```

## Styling dark mode {bold primary}

Semantic colors adapt automatically. For a deliberate palette in each theme, prefix a utility with `dark:`. The rule applies while the document's dark-mode toggle is active, including in exported HTML.

```taildown
Your text {text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 padded}

Hover here {dark:hover:text-primary-600}

Responsive text {md:dark:text-gray-100}
```

Dark variants compose with `hover:`, `active:`, `focus:`, `focus-visible:`, `disabled:`, `last:`, and the `sm:`, `md:`, `lg:`, `xl:`, `2xl:` breakpoints. Use utility names after the prefix, such as `dark:text-gray-100`. In the editor, search **Dark mode colors** in the Insert menu to start with an editable example.

## Quick Reference Card {bold primary center}

:::card {heavy-glass padded-xl}
### :icon[bookmark]{primary} Cheat Sheet {large-bold center}

**Typography:** `xs` `small` `large` `xl` `2xl` `3xl` `huge` `massive` | `thin` `light` `normal` `medium` `semibold` `bold` `extra-bold` `black`

**Colors:** `primary` `secondary` `accent` `success` `warning` `error` `info` `muted`

**Layout:** `flex` `flex-col` `flex-row` `flex-center` | `grid` `grid-2` `grid-3` `grid-4` | `center` `center-x` `center-y`

**Spacing:** `padded-xs` `padded-sm` `padded` `padded-lg` `padded-xl` | `gap-xs` `gap-sm` `gap` `gap-lg` `gap-xl`

**Effects:** `rounded` `rounded-sm` `rounded-lg` `rounded-xl` `rounded-full` | `shadow` `shadow-sm` `shadow-lg` `elevated` `floating`

**Glass:** `subtle-glass` `light-glass` `glass` `heavy-glass`

**Animations:** `fade-in` `slide-up` `slide-down` `zoom-in` | `hover-lift` `hover-glow` `hover-scale` | `fast` `smooth` `slow`
:::

---

