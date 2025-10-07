:::navbar
# :icon[zap]{warning} Taildown

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html)
:::



# Plain English Reference {huge-bold center primary}

**Complete guide to natural language styling in Taildown** {center large muted}

Natural language styling is Taildown's superpower. Write `{large-bold primary}` instead of cryptic CSS classes. {center}

---

## Philosophy {large-bold primary}

:::card {subtle-glass padded}
### :icon[type]{primary} Natural Grammar First {medium-bold}

Taildown follows **natural English grammar and word order**, not CSS conventions. This makes styling intuitive and self-documenting.

**Core Principles:**
- :icon[check]{success xs} **Adjective-Noun Order** - "large text" not "text-large"
- :icon[check]{success xs} **Single Descriptive Words** - "bold" not "font-bold"
- :icon[check]{success xs} **State Modifiers First** - "hover-lift" not "lift-hover"
- :icon[check]{success xs} **Natural Phrases** - Reads like English, compiles to CSS
:::

---

## Typography {large-bold primary}

:::tabs
## Sizes

Control text size with natural keywords:

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

## Colors {large-bold primary}

:::grid {2}
:::card {light-glass}
### :icon[palette]{primary} Semantic Colors {medium-bold}

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
### :icon[droplet]{accent} Background Colors {medium-bold}

Add `-bg` suffix for background colors:

| Shorthand | Result |
|-----------|--------|
| `{primary-bg}` | Primary background + white text |
| `{success-bg}` | Success background + white text |
| `{warning-bg}` | Warning background + dark text |
| `{error-bg}` | Error background + white text |
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

## Layout {large-bold primary}

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

## Spacing {large-bold primary}

:::grid {2}
:::card {subtle-glass}
### :icon[box]{primary} Padding {medium-bold}

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
### :icon[maximize]{accent} Gap {medium-bold}

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

## Effects {large-bold primary}

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

## Animations {large-bold primary}

:::grid {3}
:::card {light-glass fade-in}
### :icon[zap]{warning} Entrance {medium-bold}

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
### :icon[mouse-pointer]{primary} Hover Effects {medium-bold}

Interactive hover animations:

- `{hover-lift}` - Lift on hover
- `{hover-glow}` - Glow on hover
- `{hover-scale}` - Scale up on hover
- `{hover-rotate}` - Rotate on hover
- `{hover-grow}` - Grow on hover

**This card has `{slide-up}` applied!**
:::

:::card {light-glass zoom-in}
### :icon[clock]{accent} Speed {medium-bold}

Control animation speed:

- `{fast}` - Fast animations (150ms)
- `{smooth}` - Smooth (300ms, default)
- `{slow}` - Slow animations (500ms)

**This card has `{zoom-in}` applied!**
:::
:::

---

## Combining Shorthands {large-bold primary}

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

## Best Practices {large-bold primary}

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

## Quick Reference Card {large-bold primary center}

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

