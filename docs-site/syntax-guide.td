:::navbar
# :icon[zap]{warning} Taildown

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html)
:::

# Complete Syntax Guide {huge-bold center primary}

**Master every feature of Taildown's elegant markup language.** {center large-muted}

---

## Quick Navigation {large-bold primary}

:::grid {cols-3}
:::card {subtle-glass padded}
**Basics**
- [Markdown Compatibility](#markdown)
- [Inline Attributes](#attributes)
- [Plain English](#plain-english)
:::

:::card {subtle-glass padded}
**Components**
- [Component Blocks](#components)
- [Interactive Components](#interactive)
- [Icons](#icons)
:::

:::card {subtle-glass padded}
**Reference**
- [Quick Reference](#reference)
- [All Components](#component-list)
- [All Shorthands](#shorthands)
:::
:::

---

## Markdown Compatibility {#markdown large-bold primary}

:icon[check]{success large} **Taildown is a superset of Markdown** - every valid Markdown document is also valid Taildown. {large}

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Text Formatting

```markdown
*italic* or _italic_
**bold** or __bold__
***bold italic***
~~strikethrough~~
```

### Lists

**Unordered:**
```markdown
- Item one
- Item two
  - Nested item
  - Another nested
```

**Ordered:**
```markdown
1. First item
2. Second item
   1. Nested ordered
   2. Another nested
```

### Links and Images

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title text")

![Alt text](image.jpg)
![Image with title](image.jpg "Image title")
```

### Code

**Inline code:**
```markdown
Use `backticks` for inline code
```

**Code blocks:**
````markdown
```javascript
function hello() {
  console.log("Hello, world!");
}
```
````

### Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
>
> > And can be nested
```

### Tables

```markdown
| Feature | Status | Notes |
|---------|--------|-------|
| Tables  | ✓      | Full GFM support |
| Alignment | ✓    | Left, center, right |
```

### Horizontal Rules

```markdown
---
***
___
```

---

## Inline Attributes {#attributes large-bold primary}

:icon[brackets]{primary large} **Add styling to any element using curly brace notation.** {large}

### Basic Syntax

Attributes use `{...}` at the end of elements:

```markdown
# Heading {large-bold center}
Paragraph {muted}
[Link](#){button primary}
```

### Attribute Types

**1. CSS Classes** (prefix with `.`):
```markdown
{.text-4xl .font-bold .text-center}
```

**2. Plain English Shorthands:**
```markdown
{large-bold center primary}
```

**3. Component Variants:**
```markdown
{button primary large}
{badge success}
{alert error}
```

**4. Key-Value Pairs:**
```markdown
{id="unique-id"}
{modal="Modal content"}
{tooltip="Help text"}
```

### Where to Use Them

**Headings:**
```markdown
# Main Title {huge-bold center}
## Subtitle {large-primary}
### Section {muted}
```

**Paragraphs:**
```markdown
This is large bold text. {large-bold}

This is centered and muted. {center muted}
```

**Links:**
```markdown
[Regular link](https://example.com)
[Button link](#){button primary}
[Badge link](#){badge success}
```

### Multiple Attributes

Combine multiple attributes with spaces:

```markdown
{large-bold center primary rounded}
{button primary large hover-lift}
{subtle-glass padded-xl rounded-xl}
```

---

## Plain English Styling {#plain-english large-bold primary}

:icon[type]{success large} **Style using natural English instead of CSS classes.** {large}

### The Natural English Principle

Taildown uses **adjective-noun** order (how English works), not **property-value** order (how CSS works).

:::grid {cols-2}
:::card {light-glass padded}
#### :icon[check]{success} Natural English
- `large-text` (large text)
- `bold-primary` (bold primary)
- `subtle-glass` (subtle glass)
- `rounded-corners` (rounded corners)

Reads like natural language!
:::

:::card {subtle-glass padded}
#### :icon[x]{error} CSS Style (Don't use)
- `text-large` (backwards!)
- `primary-bold` (unnatural!)
- `glass-subtle` (wrong!)
- `corners-rounded` (weird!)

Unnatural and confusing.
:::
:::

### Typography

**Sizes:**
```markdown
{xs} {small} {base} {large} {xl} {2xl} {3xl} {huge} {massive}
```

**Weights:**
```markdown
{thin} {light} {normal} {medium} {semibold} {bold} {extra-bold} {black}
```

**Combinations:**
```markdown
{large-bold} {huge-bold} {xl-semibold} {small-light}
```

**Colors:**
```markdown
{primary} {secondary} {success} {warning} {error} {info} {muted}
```

**Styles:**
```markdown
{italic} {uppercase} {lowercase} {capitalize}
```

### Layout

**Alignment:**
```markdown
{center} {left} {right} {justify}
```

**Flexbox:**
```markdown
{flex} {flex-col} {flex-row} {flex-center}
```

**Grid:**
```markdown
{grid-2} {grid-3} {grid-4}
{cols-2} {cols-3} {cols-4}
```

**Spacing:**
```markdown
{padded} {padded-sm} {padded-lg} {padded-xl}
{gap} {gap-sm} {gap-lg} {gap-xl}
{tight} {relaxed} {loose}
```

### Visual Effects

**Borders:**
```markdown
{rounded} {rounded-sm} {rounded-lg} {rounded-xl} {rounded-full}
```

**Shadows:**
```markdown
{shadow} {shadow-sm} {shadow-lg} {elevated} {floating}
```

**Glassmorphism:**
```markdown
{subtle-glass} {light-glass} {glass} {heavy-glass}
```

**Animations:**
```markdown
{fade-in} {slide-up} {slide-down} {zoom-in}
{hover-lift} {hover-glow} {hover-scale}
{fast} {smooth} {slow}
```

---

## Icon Syntax {#icons large-bold primary}

:icon[smile]{warning large} **Embed beautiful SVG icons anywhere with `:icon[name]` syntax.** {large}

### Basic Usage

```markdown
:icon[home]
:icon[heart]
:icon[star]
```

Result: :icon[home] :icon[heart] :icon[star]

### With Attributes

```markdown
:icon[check]{success}
:icon[alert-triangle]{warning large}
:icon[heart]{error xl}
:icon[zap]{primary huge}
```

Result: :icon[check]{success} :icon[alert-triangle]{warning large} :icon[heart]{error xl} :icon[zap]{primary huge}

### Size Keywords

```markdown
:icon[star]{tiny}    → 12px
:icon[star]{xs}      → 16px
:icon[star]{sm}      → 20px
:icon[star]{md}      → 24px (default)
:icon[star]{lg}      → 32px
:icon[star]{xl}      → 40px
:icon[star]{2xl}     → 48px
:icon[star]{huge}    → 64px
```

### Color Keywords

```markdown
:icon[circle]{primary}
:icon[circle]{secondary}
:icon[circle]{success}
:icon[circle]{warning}
:icon[circle]{error}
:icon[circle]{info}
```

Result: :icon[circle]{primary lg} :icon[circle]{secondary lg} :icon[circle]{success lg} :icon[circle]{warning lg} :icon[circle]{error lg} :icon[circle]{info lg}

### In Lists

Icons at the start of list items automatically hide the bullet:

```markdown
- :icon[check]{success} Completed task
- :icon[circle]{warning} In progress
- :icon[x]{error} Failed task
```

Result:
- :icon[check]{success} Completed task
- :icon[circle]{warning} In progress
- :icon[x]{error} Failed task

### Popular Icons

**Navigation:** home, menu, search, settings, user, bell, mail  
**Actions:** check, x, plus, minus, edit, trash, download, upload  
**Arrows:** arrow-right, arrow-left, chevron-right, chevron-down  
**Status:** check-circle, x-circle, alert-circle, alert-triangle, info  
**UI:** heart, star, bookmark, share, link, eye, calendar  
**Social:** github, twitter, facebook, linkedin, youtube

[Browse all 1000+ icons at lucide.dev →](https://lucide.dev/icons/){button secondary}

---

## Component Blocks {#components large-bold primary}

:icon[package]{primary large} **Wrap content in components using `:::name` fences.** {large}

### Basic Syntax

```markdown
:::card
Content inside a card
:::
```

### With Attributes

```markdown
:::card {glass padded rounded-xl}
Beautiful glassmorphic card
:::
```

### Nesting

```markdown
:::grid {cols-2}
:::card
Column 1
:::

:::card
Column 2
:::
:::
```

### Standard Components

**Layout:**
- `:::card` - Content container with glassmorphism
- `:::grid` - Responsive column layout
- `:::button-group` - Intelligent button layout

**Feedback:**
- `:::alert` - Message boxes (info, success, warning, error)

**Navigation:**
- `:::navbar` - Site navigation bar

---

## Interactive Components {#interactive large-bold primary}

:icon[activity]{success large} **Zero-config JavaScript generation for interactive components.** {large}

### Tabs

**Create tabbed interfaces using headings:**

```markdown
:::tabs
## Tab One
Content for first tab

## Tab Two
Content for second tab

## Tab Three
Content for third tab
:::
```

**Features:**
- Headings become tab labels
- First tab active by default
- Click to switch or use arrow keys
- Smooth animations
- Full ARIA support

### Accordion

**Expandable sections using bold text:**

```markdown
:::accordion
**First Section**
Content for first section

**Second Section**
Content for second section

**Third Section**
Content for third section
:::
```

**Features:**
- Bold text becomes triggers
- First item open by default
- Click to expand/collapse
- Smooth animations

### Carousel

**Slideshow using horizontal rules:**

```markdown
:::carousel
First slide content

---

Second slide content

---

Third slide content
:::
```

**Features:**
- `---` divides slides
- Previous/next navigation
- Indicator dots
- Keyboard and swipe support
- 3D card effects

### Modal & Tooltip

**Attachable to any element:**

```markdown
[Click me](#){button modal="Simple alert!"}
[Hover me](#){tooltip="Help text"}
```

**With ID references:**

```markdown
[Open Modal](#){button modal="#my-modal"}

:::modal{id="my-modal"}
# Modal Title
Rich content with **markdown** support
:::
```

**Features:**
- Inline or ID-referenced content
- Backdrop blur
- Keyboard support
- Focus management
- Responsive positioning

---

## Quick Reference Card {#reference large-bold primary}

:::grid {cols-2}
:::card {subtle-glass padded}
### Inline Attributes
```markdown
# Text {attributes}
Paragraph {attributes}
[Link](#){attributes}
```

**Types:**
- CSS: `.class-name`
- English: `large-bold`
- Component: `button primary`
- Key-value: `id="value"`
:::

:::card {subtle-glass padded}
### Icons
```markdown
:icon[name]
:icon[name]{size}
:icon[name]{color size}
```

**Sizes:** tiny, xs, sm, md, lg, xl, 2xl, huge  
**Colors:** primary, success, warning, error, info
:::

:::card {subtle-glass padded}
### Components
```markdown
:::component-name
Content
:::

:::component {attributes}
Content with attributes
:::
```

**Common:** card, grid, tabs, accordion, carousel, modal, tooltip, alert, navbar
:::

:::card {subtle-glass padded}
### Plain English
**Typography:**
- `xs small large xl huge`
- `thin light bold black`
- `primary success error`

**Layout:**
- `center padded gap`
- `flex grid-2 grid-3`

**Effects:**
- `rounded shadow glass`
- `fade-in hover-lift`
:::
:::

---

## Complete Component List {#component-list large-bold primary}

| Component | Purpose | Usage | Variants |
|-----------|---------|-------|----------|
| **card** | Content container | `:::card` | glass, elevated, padded |
| **grid** | Column layout | `:::grid {cols-3}` | cols-2, cols-3, cols-4 |
| **button-group** | Button layout | `:::button-group` | left, center, right |
| **alert** | Messages | `:::alert {success}` | info, success, warning, error |
| **navbar** | Site navigation | `:::navbar` | glass, solid, minimal |
| **tabs** | Tabbed interface | `:::tabs` | Uses headings as tabs |
| **accordion** | Expandable sections | `:::accordion` | Uses bold text as triggers |
| **carousel** | Slideshow | `:::carousel` | Uses `---` as dividers |
| **modal** | Dialog overlay | Attach with `modal="..."` | Inline or ID-referenced |
| **tooltip** | Contextual help | Attach with `tooltip="..."` | Inline or ID-referenced |
| **badge** | Inline label | `[Text](#){badge}` | primary, success, warning |
| **button** | Button styling | `[Text](#){button}` | primary, secondary, outline |

---

## Complete Shorthand Reference {#shorthands large-bold primary}

### Typography Shorthands

| Shorthand | CSS Equivalent | Description |
|-----------|---------------|-------------|
| `xs` | `text-xs` | Extra small (12px) |
| `small` | `text-sm` | Small (14px) |
| `base` | `text-base` | Base (16px) |
| `large` | `text-lg` | Large (18px) |
| `xl` | `text-xl` | Extra large (20px) |
| `2xl` | `text-2xl` | 2X large (24px) |
| `3xl` | `text-3xl` | 3X large (30px) |
| `huge` | `text-4xl` | Huge (36px) |
| `massive` | `text-5xl` | Massive (48px) |
| `thin` | `font-thin` | Thin weight (100) |
| `light` | `font-light` | Light weight (300) |
| `normal` | `font-normal` | Normal weight (400) |
| `medium` | `font-medium` | Medium weight (500) |
| `semibold` | `font-semibold` | Semibold (600) |
| `bold` | `font-bold` | Bold (700) |
| `extra-bold` | `font-extrabold` | Extra bold (800) |
| `black` | `font-black` | Black (900) |

### Color Shorthands

| Shorthand | Description |
|-----------|-------------|
| `primary` | Primary brand color (blue) |
| `secondary` | Secondary color (purple) |
| `accent` | Accent color |
| `success` | Success green |
| `warning` | Warning yellow/orange |
| `error` | Error red |
| `info` | Info blue |
| `muted` | Muted gray |

### Layout Shorthands

| Shorthand | Description |
|-----------|-------------|
| `center` | Center align text |
| `left` | Left align text |
| `right` | Right align text |
| `padded` | Standard padding |
| `padded-sm` | Small padding |
| `padded-lg` | Large padding |
| `padded-xl` | Extra large padding |
| `gap` | Standard gap |
| `gap-sm` | Small gap |
| `gap-lg` | Large gap |
| `flex` | Flex display |
| `flex-col` | Flex column direction |
| `flex-center` | Flex centered |
| `grid-2` | 2 column grid |
| `grid-3` | 3 column grid |
| `grid-4` | 4 column grid |

### Effect Shorthands

| Shorthand | Description |
|-----------|-------------|
| `rounded` | Rounded corners |
| `rounded-lg` | Large rounded corners |
| `rounded-xl` | Extra large rounded |
| `rounded-full` | Fully rounded (pill) |
| `shadow` | Standard shadow |
| `shadow-lg` | Large shadow |
| `elevated` | Elevated shadow |
| `subtle-glass` | Subtle glass effect |
| `light-glass` | Light glass effect |
| `glass` | Standard glass effect |
| `heavy-glass` | Heavy glass effect |
| `fade-in` | Fade in animation |
| `slide-up` | Slide up animation |
| `hover-lift` | Lift on hover |
| `hover-glow` | Glow on hover |
| `hover-scale` | Scale on hover |

### Combination Shorthands

Natural combinations work automatically:

- `large-bold` - Large + bold text
- `huge-bold` - Huge + bold text  
- `small-muted` - Small + muted color
- `large-primary` - Large + primary color
- `bold-primary` - Bold + primary color
- `xl-semibold` - XL + semibold weight

---

## Next Steps {large-bold center primary}

:::card {light-glass padded-xl center}
**You're now a Taildown expert!** {huge-bold}

Ready to build something beautiful? {large-muted}
:::
