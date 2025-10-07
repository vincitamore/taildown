:::navbar
# :icon[zap]{warning} Taildown

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html)
:::

---

# Complete Syntax Guide {huge-bold center primary}

**Master every feature of Taildown's elegant markup language.** {center large-muted}

---

:::card {light-glass padded}
:::button-group
[Plain English Reference](plain-english.html){button secondary large} [Components Reference](components.html){button primary large hover-lift}
:::
:::

---

## Table of Contents {large-bold primary}

:::grid {cols-2}
:::card {subtle-glass padded hover-lift}
### :icon[book]{primary} Basics
- [Markdown Compatibility](#markdown)
- [Inline Attributes](#inline-attributes)
- [Plain English Styling](#plain-english)
:::

:::card {subtle-glass padded hover-lift}
### :icon[layout]{success} Components
- [Component Blocks](#components)
- [Interactive Components](#interactive)
- [Attachable Components](#attachable)
:::

:::card {subtle-glass padded hover-lift}
### :icon[sparkles]{warning} Advanced
- [Icon Syntax](#icons)
- [ID References](#id-references)
- [Button Groups](#button-groups)
:::

:::card {subtle-glass padded hover-lift}
### :icon[zap]{error} Reference
- [Quick Syntax Reference](#quick-reference)
- [Component List](#component-list)
- [Style Shorthands](#style-shorthands)
:::
:::

---

<a name="markdown"></a>
## :icon[check]{success large} Markdown Compatibility {large-bold primary}

**Taildown is a superset of Markdown** - every valid Markdown document is also valid Taildown. {large}

:::tabs
### Standard Markdown

All standard Markdown syntax works exactly as expected:

**Headings:**
```markdown
# Heading 1
## Heading 2
### Heading 3
```

**Emphasis:**
```markdown
*italic* or _italic_
**bold** or __bold__
***bold italic***
```

**Lists:**
```markdown
- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Another item
   1. Nested ordered
```

**Links and Images:**
```markdown
[Link text](https://example.com)
![Alt text](image.jpg)
```

**Code:**
````markdown
Inline `code` with backticks

```javascript
// Code block
function hello() {
  console.log("Hello!");
}
```
````

### Tables

Full GitHub Flavored Markdown table support:

```markdown
| Feature | Supported | Notes |
|---------|-----------|-------|
| Tables  | ✓         | Full GFM support |
| Alignment | ✓      | Left, center, right |
| Styling | ✓         | Apply attributes |
```

**Result:**

| Feature | Supported | Notes |
|---------|-----------|-------|
| Tables  | ✓         | Full GFM support |
| Alignment | ✓      | Left, center, right |
| Styling | ✓         | Apply attributes |

### Blockquotes

Standard Markdown blockquotes:

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> > And can be nested.
```

**Result:**

> This is a blockquote.
> It can span multiple lines.
>
> > And can be nested.
:::

---

<a name="inline-attributes"></a>
## :icon[brackets]{primary large} Inline Attributes {large-bold primary}

**Add styling to any element using curly brace notation.** {large}

:::alert {info}
:icon[lightbulb]{warning} **Pro Tip:** Attributes must appear at the END of the element, with optional single space before `{`.
:::

### Basic Syntax

Inline attributes use `{...}` at the end of elements:

```markdown
# Heading with attributes {large-bold center}

Paragraph with styling {muted center}

[Button link](#){button primary large}
```

### CSS Classes

Prefix classes with a dot (`.`):

```markdown
# Heading {.text-4xl .font-bold .text-center}

Paragraph {.text-gray-600 .max-w-prose}
```

:::tabs
### Headings

Attributes appear at the end of heading text:

```markdown
# Large Centered Title {huge-bold center}
## Primary Colored {large primary}
### Muted Subheading {muted}
```

**Result:**

# Large Centered Title {huge-bold center}
## Primary Colored {large primary}
### Muted Subheading {muted}

### Paragraphs

Attributes at the end of paragraph:

```markdown
This text is large and bold. {large-bold}

This text is centered and muted. {center muted}

Multiple paragraphs can each have their own styling. {italic primary}
```

**Result:**

This text is large and bold. {large-bold}

This text is centered and muted. {center muted}

Multiple paragraphs can each have their own styling. {italic primary}

### Links

Attributes immediately after closing parenthesis:

```markdown
[Regular link](https://example.com)
[Button link](#){button primary}
[Large success button](#){button success large hover-lift}
```

**Result:**

[Regular link](https://example.com)
[Button link](#){button primary}
[Large success button](#){button success large hover-lift}
:::

### Multiple Attributes

Combine multiple attributes with spaces:

```markdown
{large-bold center primary}
{button primary large hover-lift}
{subtle-glass padded rounded}
```

**Processing order:**
1. CSS classes (starting with `.`)
2. Component variants (`button`, `badge`, etc.)
3. Plain English shorthands (`large`, `bold`, `center`)
4. Key-value pairs (`id="..."`, `modal="..."`)

---

<a name="plain-english"></a>
## :icon[type]{success large} Plain English Styling {large-bold primary}

**Style your content using natural English instead of CSS classes.** {large}

:::alert {success}
:icon[star]{warning} **Philosophy:** Taildown uses natural English grammar (adjective-noun), not CSS conventions (property-value).
:::

### The Natural English Principle

Taildown prioritizes **how humans speak**, not how CSS works.

:::grid {cols-2}
:::card {subtle-glass padded}
#### :icon[check]{success} Natural English
```markdown
{large-text}
{bold-primary}
{subtle-glass}
{rounded-corners}
```

Reads like: "large text", "bold primary", "subtle glass"
:::

:::card {subtle-glass padded}
#### :icon[x]{error} CSS Style
```markdown
{text-large}
{primary-bold}
{glass-subtle}
{corners-rounded}
```

Backwards and unnatural.
:::
:::

### Typography Shorthands

:::tabs
### Sizes

Control text size with single keywords:

```markdown
{xs} {small} {base} {large} {xl} {2xl} {3xl} {huge} {massive}
```

**Examples:**

Extra small text {xs}

Small text {small}

Base text {base}

Large text {large}

Extra large text {xl}

Huge text {huge}

### Weights

Font weight keywords:

```markdown
{thin} {light} {normal} {medium} {semibold} {bold} {extra-bold} {black}
```

**Examples:**

Thin weight {thin}

Light weight {light}

Normal weight {normal}

Medium weight {medium}

Semibold weight {semibold}

Bold weight {bold}

Extra bold weight {extra-bold}

Black weight {black}

### Combinations

Combine size + weight naturally:

```markdown
{large-bold}
{huge-bold}
{small-light}
{xl-semibold}
```

**Examples:**

Large and bold text {large-bold}

Huge and bold text {huge-bold}

Small and light text {small-light}

Extra large semibold text {xl-semibold}

### Colors

Semantic color keywords:

```markdown
{primary} {secondary} {success} {warning} {error} {info} {muted}
```

**Examples:**

Primary colored text {primary}

Secondary colored text {secondary}

Success colored text {success}

Warning colored text {warning}

Error colored text {error}

Info colored text {info}

Muted colored text {muted}
:::

### Layout Shorthands

:::tabs
### Alignment

Text and content alignment:

```markdown
{center} {left} {right} {justify}
{center-x} {center-y} {center-both}
```

**Examples:**

Centered text {center}

Left aligned text {left}

Right aligned text {right}

### Spacing

Padding, gap, and spacing control:

```markdown
{padded} {padded-sm} {padded-lg} {padded-xl}
{gap} {gap-sm} {gap-lg} {gap-xl}
{tight} {relaxed} {loose}
```

### Flexbox

Flex layout shorthands:

```markdown
{flex} {flex-col} {flex-row} {flex-center}
{flex-wrap} {flex-nowrap}
```

### Grid

Grid layout helpers:

```markdown
{grid-2} {grid-3} {grid-4}
{cols-2} {cols-3} {cols-4}
```
:::

### Visual Effects

:::tabs
### Borders & Rounding

```markdown
{rounded} {rounded-sm} {rounded-lg} {rounded-xl} {rounded-full}
{border} {border-none}
```

**Examples:**

:::card {subtle-glass padded rounded}
Rounded corners
:::

:::card {subtle-glass padded rounded-xl}
Extra rounded corners
:::

:::card {subtle-glass padded rounded-full}
Fully rounded (pill shape)
:::

### Shadows

```markdown
{shadow} {shadow-sm} {shadow-lg} {elevated} {floating}
```

**Examples:**

:::card {padded shadow}
Small shadow
:::

:::card {padded shadow-lg}
Large shadow
:::

:::card {padded elevated}
Elevated shadow
:::

### Glassmorphism

Beautiful translucent glass effects:

```markdown
{subtle-glass} {light-glass} {glass} {heavy-glass}
```

**Examples:**

:::card {subtle-glass padded}
Subtle glass effect - barely visible translucency
:::

:::card {light-glass padded}
Light glass effect - soft frosted appearance
:::

:::card {glass padded}
Standard glass effect - balanced translucency
:::

:::card {heavy-glass padded}
Heavy glass effect - strong frosted blur
:::

### Animations

Entrance and hover animations:

**Entrance:**
```markdown
{fade-in} {slide-up} {slide-down} {zoom-in}
```

**Hover:**
```markdown
{hover-lift} {hover-glow} {hover-scale}
```

**Speed:**
```markdown
{fast} {smooth} {slow}
```

**Examples:**

:::card {subtle-glass padded hover-lift}
Hover to lift
:::

:::card {light-glass padded hover-glow}
Hover to glow
:::

:::card {glass padded hover-scale}
Hover to scale
:::
:::

---

<a name="icons"></a>
## :icon[smile]{warning large} Icon Syntax {large-bold primary}

**Embed beautiful SVG icons anywhere using simple syntax.** {large}

### Basic Icon Syntax

Use `:icon[name]` to embed icons:

```markdown
:icon[home]
:icon[heart]
:icon[star]
```

**Result:**

:icon[home] :icon[heart] :icon[star]

### Icon with Attributes

Add size, color, and style:

```markdown
:icon[check]{success}
:icon[alert-triangle]{warning large}
:icon[heart]{error xl}
:icon[zap]{primary huge}
```

**Result:**

:icon[check]{success} :icon[alert-triangle]{warning large} :icon[heart]{error xl} :icon[zap]{primary huge}

:::tabs
### Size Keywords

```markdown
:icon[star]{tiny}
:icon[star]{xs}
:icon[star]{sm}
:icon[star]{md}
:icon[star]{lg}
:icon[star]{xl}
:icon[star]{2xl}
:icon[star]{huge}
```

**Result:**

:icon[star]{tiny} :icon[star]{xs} :icon[star]{sm} :icon[star]{md} :icon[star]{lg} :icon[star]{xl} :icon[star]{2xl} :icon[star]{huge}

### Color Keywords

```markdown
:icon[circle]{primary}
:icon[circle]{secondary}
:icon[circle]{success}
:icon[circle]{warning}
:icon[circle]{error}
:icon[circle]{info}
```

**Result:**

:icon[circle]{primary large} :icon[circle]{secondary large} :icon[circle]{success large} :icon[circle]{warning large} :icon[circle]{error large} :icon[circle]{info large}

### Stroke Width

```markdown
:icon[circle]{thin}
:icon[circle]{normal}
:icon[circle]{thick}
:icon[circle]{bold}
```

**Result:**

:icon[circle]{thin xl} :icon[circle]{normal xl} :icon[circle]{thick xl} :icon[circle]{bold xl}

### Combined Attributes

```markdown
:icon[heart]{error large bold}
:icon[check-circle]{success xl}
:icon[alert-triangle]{warning huge thick}
```

**Result:**

:icon[heart]{error large bold} :icon[check-circle]{success xl} :icon[alert-triangle]{warning huge thick}
:::

### Icon Library

Taildown uses **Lucide Icons** (1000+ icons available).

**Popular icons:**

:::grid {cols-4}
:icon[home]{lg} home

:icon[user]{lg} user

:icon[search]{lg} search

:icon[settings]{lg} settings

:icon[bell]{lg} bell

:icon[mail]{lg} mail

:icon[heart]{lg} heart

:icon[star]{lg} star

:icon[check]{lg} check

:icon[x]{lg} x

:icon[plus]{lg} plus

:icon[minus]{lg} minus

:icon[edit]{lg} edit

:icon[trash]{lg} trash

:icon[download]{lg} download

:icon[upload]{lg} upload

:icon[arrow-right]{lg} arrow-right

:icon[arrow-left]{lg} arrow-left

:icon[chevron-right]{lg} chevron-right

:icon[chevron-down]{lg} chevron-down

:icon[menu]{lg} menu

:icon[more-vertical]{lg} more-vertical

:icon[link]{lg} link

:icon[external-link]{lg} external-link

:icon[file]{lg} file

:icon[folder]{lg} folder

:icon[image]{lg} image

:icon[video]{lg} video

:icon[music]{lg} music

:icon[calendar]{lg} calendar

:icon[clock]{lg} clock

:icon[map-pin]{lg} map-pin

:icon[shield]{lg} shield

:icon[lock]{lg} lock

:icon[eye]{lg} eye

:icon[eye-off]{lg} eye-off

:icon[info]{lg} info

:icon[help-circle]{lg} help-circle

:icon[alert-circle]{lg} alert-circle

:icon[alert-triangle]{lg} alert-triangle

:icon[check-circle]{lg} check-circle

:icon[x-circle]{lg} x-circle

:icon[zap]{lg} zap

:icon[trending-up]{lg} trending-up

:icon[activity]{lg} activity

:icon[github]{lg} github

:icon[twitter]{lg} twitter

:icon[facebook]{lg} facebook

:icon[linkedin]{lg} linkedin
:::

[Browse all 1000+ icons at lucide.dev →](https://lucide.dev/icons/){button secondary hover-lift}

### Icon Lists

When a list item starts with an icon, the bullet point is automatically hidden:

```markdown
- :icon[check]{success} Completed task
- :icon[circle]{warning} In progress
- :icon[x]{error} Failed task
```

**Result:**

- :icon[check]{success} Completed task
- :icon[circle]{warning} In progress
- :icon[x]{error} Failed task

### Icons in Context

Icons work everywhere:

```markdown
# Welcome :icon[wave]{large} 

Click the :icon[star]{warning} button to favorite

[Download :icon[download]](#){button primary}
```

**Result:**

# Welcome :icon[wave]{large}

Click the :icon[star]{warning} button to favorite

[Download :icon[download]](#){button primary}

---

<a name="components"></a>
## :icon[package]{primary large} Component Blocks {large-bold primary}

**Wrap content in powerful components using triple-colon fences.** {large}

### Basic Component Syntax

Components use `:::name` to open and `:::` to close:

```markdown
:::card
Content inside a card
:::
```

### Components with Attributes

Add attributes to the opening fence:

```markdown
:::card {glass padded rounded-xl}
Beautiful glassmorphic card
:::
```

### Standard Components

:::tabs
### Card

The versatile content container:

```markdown
:::card
Basic card content
:::

:::card {subtle-glass padded}
Glassmorphic card with padding
:::

:::card {elevated padded-xl rounded-xl}
Elevated card with extra padding
:::
```

**Example:**

:::card {light-glass padded}
#### :icon[box]{primary} Card Example

This is content inside a card component. Cards are perfect for grouping related information and creating visual hierarchy.

[Learn More](#){button primary small}
:::

### Grid

Layout content in responsive columns:

```markdown
:::grid {cols-2}
:::card
First column
:::

:::card
Second column
:::
:::

:::grid {cols-3}
:::card
Column 1
:::

:::card
Column 2
:::

:::card
Column 3
:::
:::
```

**Example:**

:::grid {cols-3}
:::card {subtle-glass padded center}
:icon[zap]{warning huge}

**Fast** {bold}

Lightning-quick compilation
:::

:::card {subtle-glass padded center}
:icon[heart]{error huge}

**Beautiful** {bold}

Zero-config aesthetics
:::

:::card {subtle-glass padded center}
:icon[code]{primary huge}

**Simple** {bold}

Plain English syntax
:::
:::

### Alert

Semantic alert messages:

```markdown
:::alert {info}
:icon[info]{info} This is an informational message.
:::

:::alert {success}
:icon[check-circle]{success} Operation completed successfully!
:::

:::alert {warning}
:icon[alert-triangle]{warning} Warning: Please review carefully.
:::

:::alert {error}
:icon[x-circle]{error} Error: Something went wrong.
:::
```

**Example:**

:::alert {info}
:icon[info]{info} This is an informational message with full theming support.
:::

:::alert {success}
:icon[check-circle]{success} Operation completed successfully with proper dark mode colors!
:::

:::alert {warning}
:icon[alert-triangle]{warning} Warning: Please review this information carefully.
:::

:::alert {error}
:icon[x-circle]{error} Error: Something went wrong. Please try again.
:::

### Navbar

Modern navigation bar:

```markdown
:::navbar
# :icon[zap]{warning} Brand Name

[Home](/) [About](/about) [Contact](/contact)
:::
```

The navbar includes:
- Automatic glassmorphism styling
- Responsive layout (mobile/desktop)
- Active link states
- Smooth transitions

### Button Group

Intelligent button layout:

```markdown
:::button-group
[Primary](#){button primary large}
[Secondary](#){button secondary large}
[Tertiary](#){button info}
:::
```

**Example:**

:::card {subtle-glass padded}
:::button-group
[Primary Action](#){button primary large} [Secondary Action](#){button secondary large} [Tertiary](#){button info}
:::
:::

**Features:**
- Auto-centers on desktop
- Stacks vertically on mobile
- Proper gap spacing
- Wraps naturally
:::

### Nesting Components

Components can be nested infinitely:

```markdown
:::grid {cols-2}
:::card {glass padded}
### Left Column

Nested content here

:::alert {info}
Alert inside a card inside a grid!
:::
:::

:::card {glass padded}
### Right Column

More nested content
:::
:::
```

---

<a name="interactive"></a>
## :icon[activity]{success large} Interactive Components {large-bold primary}

**Five interactive components with zero-configuration JavaScript generation.** {large}

:::alert {info}
:icon[lightbulb]{warning} **Zero Config:** JavaScript is automatically generated only for components you use. No setup required!
:::

### Tabs Component

Create tabbed interfaces using headings:

```markdown
:::tabs
## First Tab
Content for the first tab goes here.

## Second Tab
Content for the second tab.

## Third Tab
Content for the third tab.
:::
```

**Features:**
- Headings become clickable tabs
- First tab active by default
- Keyboard navigation (arrow keys)
- Smooth transitions
- ARIA accessibility

**Example:**

:::tabs
### :icon[home]{primary} Overview
Tabs use headings (h2 or h3) as labels. Everything between headings becomes panel content. The first tab is active by default.

### :icon[code]{success} Usage
Simply wrap your content in `:::tabs` fences. No configuration needed. The component intelligently detects headings and creates tabs automatically.

### :icon[sparkles]{warning} Variants
Tabs support multiple style variants:
- Default glassmorphic style
- Boxed variant
- Pills variant
- Minimal variant
- Underline variant
:::

### Accordion Component

Expandable sections using bold text:

```markdown
:::accordion
**First Section Title**
Content for the first section (open by default).

**Second Section Title**
Content for the second section.

**Third Section Title**
Content for the third section.
:::
```

**Features:**
- Bold text paragraphs become triggers
- First item open by default
- Click to expand/collapse
- Smooth animations
- ARIA attributes

**Example:**

:::accordion
**What is Taildown?**
Taildown is a superset of Markdown that adds powerful styling and component features while maintaining full backwards compatibility. It compiles to beautiful HTML, CSS, and JavaScript.

**How does it work?**
Taildown uses a custom compiler that parses your `.td` files, processes inline attributes and component blocks, resolves plain English shorthands, and generates optimized output files.

**Why use Taildown?**
Zero configuration beauty, plain English syntax, and modern interactive components with automatic JavaScript generation. Perfect for documentation, blogs, and landing pages.

**Is it production-ready?**
Taildown is in active development with a focus on stability and backwards compatibility. The core syntax is stable, and new features are added carefully with extensive testing.
:::

### Carousel Component

Image or content carousel using dividers:

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
- Horizontal rules (`---`) divide slides
- Previous/next navigation
- Indicator dots
- Keyboard navigation
- Swipe support (touch)
- 3D card effects

**Example:**

:::carousel
:::card {heavy-glass padded-xl center}
:icon[zap]{warning huge}

**Slide 1: Performance** {huge-bold}

Lightning-fast compilation with sub-100ms target for large documents. {large-muted}
:::

---

:::card {heavy-glass padded-xl center}
:icon[heart]{error huge}

**Slide 2: Beautiful** {huge-bold}

Zero-config beauty with glassmorphism, animations, and modern design. {large-muted}
:::

---

:::card {heavy-glass padded-xl center}
:icon[code]{primary huge}

**Slide 3: Simple** {huge-bold}

Plain English syntax that reads like natural language. {large-muted}
:::
:::

### Modal Component

Overlay dialogs (see Attachable Components section):

```markdown
:::modal{id="my-modal"}
# Modal Title
Modal content with **full markdown** support.
:::
```

### Tooltip Component

Contextual help text (see Attachable Components section):

```markdown
:::tooltip{id="my-tooltip"}
Helpful tooltip content
:::
```

---

<a name="attachable"></a>
## :icon[link]{warning large} Attachable Components {large-bold primary}

**Attach modals and tooltips to ANY element using simple attributes.** {large}

:::alert {success}
:icon[star]{warning} **Game Changer:** Attach interactive components to any link, button, or text using plain English attributes.
:::

### Modal Attachment

#### Inline Content

Simple text content inline:

```markdown
[Click me](#){button modal="This is a simple alert!"}

[Learn more](#){modal="Extended information about this feature."}
```

**Example:**

[Click me](#){button primary modal="This is a simple alert modal with inline content!"} [Learn more](#){button secondary modal="Extended information about this feature. Inline modals are perfect for short messages and alerts."}

#### ID Reference

Reference a modal defined elsewhere:

```markdown
[Open Welcome](#){button modal="#welcome-modal"}

:::modal{id="welcome-modal"}
# Welcome to Taildown!

This modal has **rich markdown** content:

- Multiple paragraphs
- Lists and formatting
- Even nested components

:::card {subtle-glass padded}
Cards inside modals work perfectly!
:::
:::
```

**Example:**

[Open Rich Modal](#){button primary large hover-lift modal="#demo-modal"}

:::modal{id="demo-modal"}
# :icon[sparkles]{warning} Rich Modal Example

This modal demonstrates the full power of ID-referenced modals:

## :icon[check]{success} Features

- **Full Markdown Support** - Use any markdown syntax
- **Component Nesting** - Include cards, alerts, grids
- **Interactive Elements** - Buttons, links, everything works
- **Beautiful Styling** - Glassmorphism and animations

:::grid {cols-2}
:::card {subtle-glass padded}
### Left Column
Cards work inside modals!
:::

:::card {subtle-glass padded}
### Right Column
Even grids work perfectly!
:::
:::

:::alert {info}
:icon[lightbulb]{warning} **Pro Tip:** Use ID references for complex modals with rich content. Use inline content for simple alerts.
:::
:::

### Tooltip Attachment

#### Inline Content

Brief help text inline:

```markdown
[Hover here](#){tooltip="Helpful tip!"}

Learn about [important concepts](#){tooltip="Additional context"}
```

**Example:**

[Hover here](#){tooltip="This is a helpful tooltip with inline content!"} to see the tooltip.

Learn about [important concepts](#){primary tooltip="Tooltips provide additional context without cluttering your main content."} with contextual help.

#### ID Reference

Reference a tooltip defined elsewhere:

```markdown
Technical term[?](#){tooltip="#glossary-term"}

:::tooltip{id="glossary-term"}
**Definition:** Detailed explanation with *emphasis* and `code`.
:::
```

**Example:**

This is a complex technical concept[?](#){badge info tooltip="#tech-tooltip"} that needs detailed explanation.

:::tooltip{id="tech-tooltip"}
**Technical Concept Definition**

A comprehensive explanation with:
- Multiple bullet points
- `Code examples`
- **Formatted text**
- And full markdown support!
:::

### Combined Usage

Mix attachable components with other attributes:

```markdown
[Submit](#){button primary large modal="Form submitted!" id="submit-btn"}

[Help](#){badge info tooltip="Click for assistance" .custom-class}

[Settings](#){button secondary hover-lift modal="#settings-modal"}
```

**Example:**

:::button-group
[Submit Form](#){button primary large hover-lift modal="Form submitted successfully! Your data has been saved."} [Need Help?](#){button secondary tooltip="Click this button to open the help modal for assistance."} [Advanced Settings](#){button info modal="#settings-modal"}
:::

:::modal{id="settings-modal"}
# :icon[settings]{primary} Advanced Settings

Configure your Taildown experience:

:::alert {warning}
:icon[alert-triangle]{warning} **Warning:** Changing these settings may affect output quality.
:::

## Compiler Options

- **Minify Output** - Reduce file sizes
- **Source Maps** - Enable debugging
- **Tree Shaking** - Remove unused code

[Save Changes](#){button primary} [Cancel](#){button secondary}
:::

---

<a name="id-references"></a>
## :icon[hash]{success large} ID References {large-bold primary}

**Define once, reference multiple times using IDs.** {large}

### Why Use ID References?

**DRY Principle:** Don't repeat yourself - define content once, use it everywhere.

:::grid {cols-2}
:::card {subtle-glass padded}
#### :icon[x]{error} Without ID References

```markdown
[Button 1](#){modal="Same content"}
[Button 2](#){modal="Same content"}
[Button 3](#){modal="Same content"}
```

Repetitive and hard to maintain
:::

:::card {light-glass padded}
#### :icon[check]{success} With ID References

```markdown
[Button 1](#){modal="#info"}
[Button 2](#){modal="#info"}
[Button 3](#){modal="#info"}

:::modal{id="info"}
Shared content here
:::
```

Clean, maintainable, efficient
:::
:::

### ID Syntax Rules

- IDs MUST be unique within document
- IDs MUST start with letter or underscore
- IDs MAY contain letters, numbers, hyphens, underscores
- References MUST start with `#` (e.g., `modal="#id"`)

**Valid IDs:**
```markdown
{id="welcome-modal"}
{id="section_1"}
{id="FAQ"}
{id="_hidden"}
```

**Invalid IDs:**
```markdown
{id="123-modal"}      # Cannot start with number
{id="my modal"}       # No spaces
{id="my@modal"}       # No special chars
```

### Shared Modals

Multiple triggers, one modal:

[Trigger A](#){button primary modal="#shared"} [Trigger B](#){button secondary modal="#shared"} [Trigger C](#){button info modal="#shared"}

:::modal{id="shared"}
# :icon[users]{primary} Shared Modal

This modal is triggered by three different buttons. Define the content once, reference it everywhere.

**Benefits:**
- Single source of truth
- Easy to maintain
- Consistent experience
- Better performance
:::

### Shared Tooltips

Same concept for tooltips:

```markdown
Technical term 1[?](#){tooltip="#glossary"}
Technical term 2[?](#){tooltip="#glossary"}

:::tooltip{id="glossary"}
**Definition:** Comprehensive explanation here.
:::
```

---

<a name="button-groups"></a>
## :icon[square]{primary large} Button Groups {large-bold primary}

**Intelligent button layout with automatic centering and spacing.** {large}

### Basic Button Group

Wrap buttons in `:::button-group` for automatic layout:

```markdown
:::button-group
[Primary](#){button primary large}
[Secondary](#){button secondary large}
[Info](#){button info}
:::
```

**Result:**

:::card {subtle-glass padded}
:::button-group
[Primary Action](#){button primary large} [Secondary Action](#){button secondary large} [Info](#){button info}
:::
:::

### Features

**Desktop behavior:**
- Centers buttons horizontally
- Auto-sizing with `fit-content`
- Proper gap spacing (0.75rem)
- Wraps naturally when constrained

**Mobile behavior:**
- Stacks buttons vertically
- Full-width for better touch targets
- Maintains proper spacing

### Variants

Button groups support alignment variants:

```markdown
:::button-group {left}
[Left](#){button primary} [Aligned](#){button secondary}
:::

:::button-group {right}
[Right](#){button primary} [Aligned](#){button secondary}
:::

:::button-group {center}
[Centered](#){button primary} [Buttons](#){button secondary}
:::
```

### Size Variants

Control gap spacing:

```markdown
:::button-group {sm}
Small gaps between buttons
:::

:::button-group {md}
Medium gaps (default)
:::

:::button-group {lg}
Large gaps between buttons
:::
```

### Practical Examples

**Call to action:**

:::card {light-glass padded-xl center}
**Ready to get started?** {huge-bold primary}

Join thousands of developers using Taildown. {large-muted}

:::button-group
[Get Started Free](#){button primary large hover-lift} [View Documentation](#){button secondary large}
:::
:::

**Form actions:**

:::card {subtle-glass padded}
**Edit Profile**

Update your account settings and preferences.

:::button-group
[Save Changes](#){button primary} [Cancel](#){button secondary} [Reset](#){button error}
:::
:::

---

<a name="quick-reference"></a>
## :icon[book-open]{warning large} Quick Syntax Reference {large-bold primary}

**Rapid reference for all Taildown syntax.** {large}

:::tabs
### Inline Attributes

```markdown
# Heading {large-bold center}
Paragraph {muted italic}
[Link](#){button primary large}
```

**Attribute types:**
- CSS classes: `.class-name`
- Plain English: `large-bold`
- Components: `button primary`
- Key-value: `id="..."` `modal="..."`

### Icons

```markdown
:icon[name]
:icon[name]{size}
:icon[name]{color}
:icon[name]{color size style}
```

**Examples:**
- `:icon[heart]{error}`
- `:icon[check]{success large}`
- `:icon[star]{primary huge bold}`

### Components

```markdown
:::component-name
Content
:::

:::component {attributes}
Content with attributes
:::
```

**Standard components:**
- `card` `grid` `alert` `navbar`
- `tabs` `accordion` `carousel`
- `modal` `tooltip` `button-group`

### Attachable

```markdown
[Text](#){modal="Inline"}
[Text](#){modal="#id"}

[Text](#){tooltip="Inline"}
[Text](#){tooltip="#id"}

:::modal{id="modal-id"}
Content
:::

:::tooltip{id="tip-id"}
Content
:::
```

### Plain English

**Typography:**
```markdown
{xs small large xl huge massive}
{thin light bold black}
{italic uppercase lowercase}
```

**Layout:**
```markdown
{center left right}
{padded gap tight relaxed}
{flex grid-2 grid-3}
```

**Effects:**
```markdown
{rounded shadow elevated}
{glass light-glass heavy-glass}
{fade-in hover-lift hover-glow}
```

**Colors:**
```markdown
{primary secondary accent}
{success warning error info muted}
```
:::

---

<a name="component-list"></a>
## :icon[list]{success large} Complete Component List {large-bold primary}

**Every built-in component at a glance.** {large}

:::grid {cols-2}
:::card {subtle-glass padded}
### :icon[package]{primary} Layout Components

**Card**
- Purpose: Content container
- Variants: glass, elevated, rounded
- Usage: `:::card {glass padded}`

**Grid**
- Purpose: Column layout
- Variants: cols-2, cols-3, cols-4
- Usage: `:::grid {cols-3}`

**Button Group**
- Purpose: Button layout
- Variants: left, center, right, stack
- Usage: `:::button-group`
:::

:::card {subtle-glass padded}
### :icon[activity]{success} Interactive Components

**Tabs**
- Purpose: Tabbed interface
- Variants: glass, boxed, pills
- Usage: `:::tabs` with headings

**Accordion**
- Purpose: Expandable sections
- Variants: default, minimal
- Usage: `:::accordion` with bold text

**Carousel**
- Purpose: Slideshow
- Variants: auto-play, loop
- Usage: `:::carousel` with `---` dividers

**Modal**
- Purpose: Overlay dialog
- Attachment: `modal="..."` or `modal="#id"`
- Usage: `:::modal{id="..."}` 

**Tooltip**
- Purpose: Contextual help
- Attachment: `tooltip="..."` or `tooltip="#id"`
- Usage: `:::tooltip{id="..."}`
:::

:::card {subtle-glass padded}
### :icon[bell]{warning} Feedback Components

**Alert**
- Purpose: Message display
- Variants: info, success, warning, error
- Usage: `:::alert {success}`

**Badge**
- Purpose: Inline labels
- Variants: primary, success, warning, error
- Usage: `[Text](#){badge primary}`
:::

:::card {subtle-glass padded}
### :icon[layout]{error} Navigation Components

**Navbar**
- Purpose: Site navigation
- Variants: glass, solid, minimal, floating
- Usage: `:::navbar` with heading and links

**Breadcrumb**
- Purpose: Navigation trail
- Usage: Auto-generated from links

**Pagination**
- Purpose: Page navigation
- Usage: Auto-generated from page structure
:::
:::

---

<a name="style-shorthands"></a>
## :icon[palette]{error large} Complete Style Shorthands {large-bold primary}

**Every plain English shorthand in one place.** {large}

:::tabs
### Typography

| Shorthand | CSS Equivalent | Description |
|-----------|---------------|-------------|
| `xs` | `text-xs` | Extra small text |
| `small` | `text-sm` | Small text |
| `base` | `text-base` | Base text size |
| `large` | `text-lg` | Large text |
| `xl` | `text-xl` | Extra large text |
| `2xl` | `text-2xl` | 2X large text |
| `3xl` | `text-3xl` | 3X large text |
| `huge` | `text-4xl` | Huge text |
| `massive` | `text-5xl` | Massive text |
| `thin` | `font-thin` | Thin weight (100) |
| `light` | `font-light` | Light weight (300) |
| `normal` | `font-normal` | Normal weight (400) |
| `medium` | `font-medium` | Medium weight (500) |
| `semibold` | `font-semibold` | Semibold weight (600) |
| `bold` | `font-bold` | Bold weight (700) |
| `extra-bold` | `font-extrabold` | Extra bold (800) |
| `black` | `font-black` | Black weight (900) |
| `italic` | `italic` | Italic style |
| `uppercase` | `uppercase` | UPPERCASE TEXT |
| `lowercase` | `lowercase` | lowercase text |
| `capitalize` | `capitalize` | Capitalize Text |

### Combinations

| Shorthand | Description |
|-----------|-------------|
| `large-bold` | Large + bold text |
| `huge-bold` | Huge + bold text |
| `small-muted` | Small + muted color |
| `large-primary` | Large + primary color |
| `bold-primary` | Bold + primary color |
| `xl-semibold` | XL + semibold |

### Colors

| Shorthand | Description |
|-----------|-------------|
| `primary` | Primary brand color |
| `secondary` | Secondary color |
| `accent` | Accent color |
| `success` | Success green |
| `warning` | Warning yellow/orange |
| `error` | Error red |
| `info` | Info blue |
| `muted` | Muted gray text |

### Layout

| Shorthand | CSS Equivalent | Description |
|-----------|---------------|-------------|
| `center` | `text-align: center` | Center text |
| `left` | `text-align: left` | Left align text |
| `right` | `text-align: right` | Right align text |
| `justify` | `text-align: justify` | Justify text |
| `flex` | `display: flex` | Flex container |
| `flex-col` | `flex-direction: column` | Flex column |
| `flex-row` | `flex-direction: row` | Flex row |
| `flex-center` | Flex + center | Center flex items |
| `grid-2` | `grid-cols-2` | 2 column grid |
| `grid-3` | `grid-cols-3` | 3 column grid |
| `grid-4` | `grid-cols-4` | 4 column grid |
| `cols-2` | `grid-template-columns: 2` | 2 columns |
| `cols-3` | `grid-template-columns: 3` | 3 columns |
| `cols-4` | `grid-template-columns: 4` | 4 columns |

### Spacing

| Shorthand | Description |
|-----------|-------------|
| `padded` | Standard padding |
| `padded-sm` | Small padding |
| `padded-lg` | Large padding |
| `padded-xl` | Extra large padding |
| `gap` | Standard gap |
| `gap-sm` | Small gap |
| `gap-lg` | Large gap |
| `gap-xl` | Extra large gap |
| `tight` | Tight spacing |
| `relaxed` | Relaxed spacing |
| `loose` | Loose spacing |
| `tight-lines` | Tight line height |
| `relaxed-lines` | Relaxed line height |
| `loose-lines` | Loose line height |

### Visual Effects

| Shorthand | Description |
|-----------|-------------|
| `rounded` | Rounded corners |
| `rounded-sm` | Small rounded |
| `rounded-lg` | Large rounded |
| `rounded-xl` | Extra large rounded |
| `rounded-full` | Fully rounded (pill) |
| `shadow` | Standard shadow |
| `shadow-sm` | Small shadow |
| `shadow-lg` | Large shadow |
| `elevated` | Elevated shadow |
| `floating` | Floating shadow |
| `subtle-glass` | Subtle glass effect |
| `light-glass` | Light glass effect |
| `glass` | Standard glass |
| `heavy-glass` | Heavy glass effect |

### Animations

| Shorthand | Description |
|-----------|-------------|
| `fade-in` | Fade in entrance |
| `slide-up` | Slide up entrance |
| `slide-down` | Slide down entrance |
| `zoom-in` | Zoom in entrance |
| `hover-lift` | Lift on hover |
| `hover-glow` | Glow on hover |
| `hover-scale` | Scale on hover |
| `fast` | Fast animation |
| `smooth` | Smooth animation |
| `slow` | Slow animation |
:::

---

## Next Steps {large-bold center primary}

:::card {light-glass padded-xl center}
**You're now a Taildown syntax expert!** {huge-bold}

Ready to build something beautiful? {large-muted}

:::button-group
[View Components Reference](components.html){button primary large hover-lift} [Explore Examples](getting-started.html#examples){button secondary large} [Back to Home](index.html){button info}
:::
:::

