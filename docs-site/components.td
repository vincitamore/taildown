:::navbar
# Taildown

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html)
:::

---

# Component Reference {#top huge-bold center primary}

**Your complete guide to every Taildown component with live examples.** {center large-muted}

---

## Quick Navigation {#nav large-bold primary}

Jump directly to any component category:

:::grid {cols-4}
:::card {subtle-glass padded center hover-lift}
:icon[layout]{primary huge}

**[Layout](#layout)**

Card, Grid, Button Group
:::

:::card {subtle-glass padded center hover-lift}
:icon[activity]{success huge}

**[Interactive](#interactive)**

Tabs, Accordion, Carousel
:::

:::card {subtle-glass padded center hover-lift}
:icon[message-square]{warning huge}

**[Overlays](#overlays)**

Modal, Tooltip
:::

:::card {subtle-glass padded center hover-lift}
:icon[bell]{error huge}

**[Feedback](#feedback)**

Alert, Badge, Progress
:::
:::

---

# Layout Components {#layout huge-bold center primary}

**Organize and structure your content beautifully.**

---

## Card {#card large-bold primary}

**Versatile content containers with glassmorphism effects.**

### Glassmorphism Variants {medium-bold}

:::grid {cols-3}
:::card {subtle-glass padded}
#### Subtle Glass

Barely-there translucency with soft shadows.

[Example](#){button primary small}
:::

:::card {light-glass padded}
#### Light Glass

Gentle frosted appearance with elegant borders.

[Example](#){button primary small}
:::

:::card {glass padded}
#### Standard Glass

Balanced translucency - the default choice.

[Example](#){button primary small}
:::
:::

:::grid {cols-2}
:::card {heavy-glass padded}
#### Heavy Glass

Pronounced frosted blur that makes a statement.

[Example](#){button primary small}
:::

:::card {elevated padded rounded-xl}
#### Elevated

Classic elevated card with shadow instead of glass.

[Example](#){button primary small}
:::
:::

### Rich Content Example {medium-bold}

:::card {light-glass padded-xl}
#### :icon[sparkles]{warning} Feature Showcase Card

Cards support any content: headings, paragraphs, lists, images, icons, and nested components.

**Key Features:**
- :icon[check]{success} Automatic glassmorphism styling
- :icon[check]{success} Responsive padding variants
- :icon[check]{success} Perfect dark mode support
- :icon[check]{success} Full nesting support

:::alert {info}
:icon[lightbulb]{warning} Cards work perfectly with all other components!
:::

:::button-group
[Primary Action](#){button primary} [Secondary](#){button secondary}
:::
:::

### Syntax & Variants {medium-bold}

```markdown
:::card {glass padded}
Your content here
:::

:::card {subtle-glass padded-xl rounded-xl hover-lift}
Card with multiple attributes
:::
```

**Glass Variants:** `subtle-glass` `light-glass` `glass` `heavy-glass`

**Padding:** `padded-sm` `padded` `padded-lg` `padded-xl`

**Effects:** `elevated` `floating` `hover-lift` `rounded` `rounded-lg` `rounded-xl`

[Back to top](#top){badge primary}

---

## Grid {#grid large-bold primary}

**Responsive column layouts with automatic equal-height columns.**

### Column Examples {medium-bold}

**2 Columns:**

:::grid {cols-2}
:::card {subtle-glass padded}
#### :icon[zap]{warning} Column 1

Equal height columns automatically adjust to match the tallest sibling.
:::

:::card {subtle-glass padded}
#### :icon[heart]{error} Column 2

This column has more content to demonstrate the equal-height behavior. Notice how both columns maintain the same height regardless of content length. This creates a clean, professional grid layout without manual height adjustments.
:::
:::

**3 Columns:**

:::grid {cols-3}
:::card {subtle-glass padded center}
:icon[code]{primary huge}

**Developer Friendly** {bold}

Plain English syntax that just makes sense.
:::

:::card {subtle-glass padded center}
:icon[palette]{success huge}

**Beautiful Design** {bold}

Zero-config professional aesthetics.
:::

:::card {subtle-glass padded center}
:icon[zap]{warning huge}

**Lightning Fast** {bold}

Sub-100ms compilation targets.
:::
:::

**4 Columns:**

:::grid {cols-4}
:::card {subtle-glass padded center}
:icon[home]{primary}

**Home**
:::

:::card {subtle-glass padded center}
:icon[search]{success}

**Search**
:::

:::card {subtle-glass padded center}
:icon[settings]{warning}

**Settings**
:::

:::card {subtle-glass padded center}
:icon[user]{error}

**Profile**
:::
:::

### Nested Grids {medium-bold}

:::grid {cols-2}
:::card {light-glass padded}
#### Main Content

:::grid {cols-2}
:::card {subtle-glass padded center}
:icon[check]{success}

Nested 1
:::

:::card {subtle-glass padded center}
:icon[check]{success}

Nested 2
:::
:::
:::

:::card {light-glass padded}
#### Sidebar

Grids can be nested infinitely for complex layouts that maintain equal heights throughout.
:::
:::

### Syntax & Variants {medium-bold}

```markdown
:::grid {cols-2}
:::card
Column 1
:::

:::card
Column 2
:::
:::

:::grid {cols-3 gap-lg}
Three columns with large gap
:::
```

**Columns:** `cols-2` `cols-3` `cols-4`

**Gaps:** `gap-sm` `gap` `gap-lg`

[Back to top](#top){badge primary}

---

## Button Group {#button-group large-bold primary}

**Intelligent button layout with centering and mobile stacking.**

### Alignment Variants {medium-bold}

:::card {subtle-glass padded}
**Left Aligned:**

:::button-group {left}
[Start](#){button primary} [Progress](#){button secondary} [End](#){button info}
:::

---

**Centered (default):**

:::button-group
[Option A](#){button primary} [Option B](#){button secondary} [Option C](#){button info}
:::

---

**Right Aligned:**

:::button-group {right}
[Save Draft](#){button secondary} [Publish](#){button primary}
:::
:::

### Size Variants {medium-bold}

:::card {subtle-glass padded}
**Small Gap:**

:::button-group {sm}
[Compact](#){button primary small} [Layout](#){button secondary small} [Here](#){button info small}
:::

---

**Medium Gap (default):**

:::button-group
[Standard](#){button primary} [Spacing](#){button secondary} [Works](#){button info}
:::

---

**Large Gap:**

:::button-group {lg}
[Spacious](#){button primary large} [Layout](#){button secondary large}
:::
:::

### Responsive Behavior {medium-bold}

:::card {light-glass padded}
**Desktop:** Horizontal layout with auto-sizing and proper gaps

**Mobile:** Automatically stacks vertically with full-width buttons for better touch targets

**Try resizing your browser to see it in action!**

:::button-group
[Mobile](#){button primary large} [Friendly](#){button secondary large} [Layout](#){button success large}
:::
:::

### Syntax & Variants {medium-bold}

```markdown
:::button-group
[Primary](#){button primary large}
[Secondary](#){button secondary large}
:::

:::button-group {right lg}
Right-aligned with large gaps
:::
```

**Alignment:** `left` `center` `right` `stack`

**Sizes:** `sm` `md` `lg`

[Back to top](#top){badge primary}

---

# Interactive Components {#interactive huge-bold center primary}

**Components with built-in JavaScript behaviors - zero configuration required.**

---

## Tabs {#tabs large-bold primary}

**Tabbed interface using headings as labels.**

### Live Example {medium-bold}

:::tabs
#### :icon[home]{primary} Overview

Tabs use headings (h2-h4) as labels. Everything between headings becomes panel content.

**Features:**
- :icon[check]{success} First tab active by default
- :icon[check]{success} Click or keyboard navigation (arrow keys)
- :icon[check]{success} Smooth transitions
- :icon[check]{success} Full ARIA accessibility

#### :icon[code]{success} Syntax

Simple, intuitive syntax:

```markdown
:::tabs
## First Tab
Content for first tab

## Second Tab
Content for second tab

## Third Tab
Content for third tab
:::
```

#### :icon[sparkles]{warning} Rich Content

Tabs support full Taildown syntax:

- **Bold** and *emphasis*
- `Code snippets`
- [Links](#) and buttons
- :icon[heart]{error} Icons
- Nested components!

:::alert {info}
:icon[lightbulb]{warning} Even alerts work inside tabs!
:::

#### :icon[palette]{error} Nested Components

Complex layouts inside tabs:

:::grid {cols-2}
:::card {subtle-glass padded}
**Left Column**

Cards work perfectly
:::

:::card {subtle-glass padded}
**Right Column**

Grids too!
:::
:::
:::

### Usage Summary {medium-bold}

```markdown
:::tabs
## First Tab
Content

## Second Tab
More content
:::
```

**Key Points:**
- H2-H4 headings become tab labels
- First tab automatically active
- Supports all markdown and components
- Mobile-responsive wrapping

[Back to top](#top){badge primary}

---

## Accordion {#accordion large-bold primary}

**Expandable sections using bold text as triggers.**

### Live Example {medium-bold}

:::accordion
**What is an accordion?**
An accordion is a vertically stacked list where each item expands to reveal content. The first item is open by default. Click any trigger to expand/collapse.

**How do I create one?**
Use `:::accordion` fences and **bold text** for triggers. Everything between triggers becomes panel content.

**What content is supported?**
Everything! Full markdown, components, icons, images - the entire Taildown syntax works inside accordion panels.

**Can I nest components?**
Absolutely! Here's a card inside an accordion:

:::card {subtle-glass padded}
#### Nested Card Example

This card lives inside an accordion panel with full styling support.

:::alert {success}
:icon[check]{success} Alerts work here too!
:::
:::

**How is accessibility handled?**
Accordions include proper ARIA attributes (`aria-expanded`, `aria-controls`) and full keyboard navigation for screen readers.
:::

### Complex Content Example {medium-bold}

:::accordion
**:icon[zap]{warning} Performance**

Optimized for speed:
- :icon[check]{success} Sub-100ms compilation
- :icon[check]{success} Tree-shaking for minimal JS
- :icon[check]{success} GPU-accelerated animations
- :icon[check]{success} Minimal runtime overhead

**:icon[heart]{error} Design System**

Beautiful by default:

:::grid {cols-3}
:::card {subtle-glass padded center}
:icon[sparkles]{warning}

**Glass**

Glassmorphism
:::

:::card {subtle-glass padded center}
:icon[sun]{warning}

**Light**

Light mode
:::

:::card {subtle-glass padded center}
:icon[moon]{primary}

**Dark**

Dark mode
:::
:::

**:icon[code]{primary} Developer Experience**

Simple syntax:

```markdown
:::accordion
**Section Title**
Section content here
:::
```

Clean, intuitive, and powerful!
:::

### Usage Summary {medium-bold}

```markdown
:::accordion
**First Section**
Content (open by default)

**Second Section**
More content

**Third Section**
Even more content
:::
```

**Key Points:**
- Bold text paragraphs become triggers
- First item open by default
- Click to expand/collapse
- Full ARIA support

[Back to top](#top){badge primary}

---

## Carousel {#carousel large-bold primary}

**Slideshow with navigation, indicators, and 3D card effects.**

### Feature Showcase {medium-bold}

:::carousel
:::card {heavy-glass padded-xl center}
:icon[zap]{warning huge}

**Lightning Fast** {huge-bold}

Taildown compiles in milliseconds with sub-100ms targets. {large-muted}

:::button-group
[Learn More](#){button primary large} [Benchmarks](#){button secondary}
:::
:::

---

:::card {heavy-glass padded-xl center}
:icon[heart]{error huge}

**Zero Config Beautiful** {huge-bold}

Every component is gorgeous by default with glassmorphism. {large-muted}

:::button-group
[Examples](#){button primary large} [Style Guide](#){button secondary}
:::
:::

---

:::card {heavy-glass padded-xl center}
:icon[code]{primary huge}

**Plain English** {huge-bold}

Style with natural language: `large-bold`, `subtle-glass`. {large-muted}

:::button-group
[Syntax](#){button primary large} [Get Started](#){button secondary}
:::
:::

---

:::card {heavy-glass padded-xl center}
:icon[package]{success huge}

**Interactive Components** {huge-bold}

Tabs, accordions, modals with auto-generated JavaScript. {large-muted}

:::button-group
[Components](#){button primary large} [Docs](#){button secondary}
:::
:::
:::

### Simple Content Example {medium-bold}

:::carousel
:::card {light-glass padded-xl center}
:icon[image]{primary huge}

**Slide 1** {huge-bold}

Create stunning visual presentations easily. {large-muted}
:::

---

:::card {light-glass padded-xl center}
:icon[video]{success huge}

**Slide 2** {huge-bold}

Embed any media type or content. {large-muted}
:::

---

:::card {light-glass padded-xl center}
:icon[music]{warning huge}

**Slide 3** {huge-bold}

Build multimedia experiences effortlessly. {large-muted}
:::
:::

### Usage Summary {medium-bold}

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
- Previous/next navigation buttons
- Indicator dots
- Keyboard navigation (arrow keys)
- Swipe support on touch devices
- 3D card effects with glassmorphism

[Back to top](#top){badge primary}

---

# Overlay Components {#overlays huge-bold center primary}

**Modals and tooltips for contextual information.**

---

## Modal {#modal large-bold primary}

**Overlay dialogs with backdrop blur and focus management.**

### Inline Content {medium-bold}

The simplest way - content directly in the attribute:

[Simple Alert](#){button primary modal="This is a simple alert modal! Click the backdrop or press Escape to close."}

[Warning Message](#){button warning modal="⚠️ **Warning:** This action cannot be undone. Please proceed with caution."}

### ID-Referenced Content {medium-bold}

For rich content, define the modal separately and reference it by ID:

[Open Rich Modal](#){button success large hover-lift modal="#demo-modal"}

:::modal{id="demo-modal"}
#### :icon[sparkles]{warning} Rich Modal Example

This modal demonstrates full markdown and component support!

:::alert {info}
:icon[lightbulb]{warning} Modals can contain any Taildown content!
:::

**Features:**
- :icon[check]{success} Full markdown support
- :icon[check]{success} Nested components
- :icon[check]{success} Backdrop blur effect
- :icon[check]{success} Focus trap for accessibility
- :icon[check]{success} Escape key to close
- :icon[check]{success} Body scroll lock

:::grid {cols-2}
:::card {subtle-glass padded}
**Column 1**

Even grids work!
:::

:::card {subtle-glass padded}
**Column 2**

Perfectly responsive!
:::
:::

:::button-group
[Primary Action](#){button primary} [Secondary](#){button secondary}
:::
:::

### Shared Modals {medium-bold}

Define once, trigger from multiple elements:

[Trigger A](#){button primary modal="#shared-modal"} [Trigger B](#){button secondary modal="#shared-modal"} [Trigger C](#){button info modal="#shared-modal"}

:::modal{id="shared-modal"}
#### :icon[users]{primary} Shared Modal

This modal is triggered by three different buttons - define once, use everywhere!

**Benefits:**
- DRY principle (Don't Repeat Yourself)
- Easy to maintain
- Consistent user experience
- Better performance
:::

### Usage Summary {medium-bold}

**Inline:**
```markdown
[Click me](#){button modal="Simple message"}
```

**ID-referenced:**
```markdown
[Open Modal](#){button modal="#my-modal"}

:::modal{id="my-modal"}
# Modal Title
Rich content with full markdown support
:::
```

**Features:**
- Backdrop with blur effect
- Close button (top-right)
- Escape key / backdrop click to close
- Focus trap for accessibility
- Body scroll lock when open
- Smooth fade animations

[Back to top](#top){badge primary}

---

## Tooltip {#tooltip large-bold primary}

**Contextual help text on hover or click.**

### Inline Tooltips {medium-bold}

Attach tooltips to any element with simple attributes:

Hover over [this text](#){tooltip="This is a helpful tooltip with inline content!"} to see the tooltip.

Learn about [this feature](#){primary tooltip="Tooltips provide context without cluttering your interface. Perfect for help text and definitions."} with contextual help.

Click this [badge](#){badge warning tooltip="This tooltip explains what the badge means. Works on hover or click!"} for information.

### ID-Referenced Tooltips {medium-bold}

For complex content, use ID references:

[Complex tooltip](#){badge info tooltip="#rich-tooltip"}

:::tooltip{id="rich-tooltip"}
**Rich Tooltip** with:
- Full markdown support
- `Code examples`
- *Emphasis* and **bold**
- Even [links](#)!
:::

### Multiple Triggers {medium-bold}

Share tooltips across elements:

Technical term 1[?](#){badge primary tooltip="#glossary"} and technical term 2[?](#){badge primary tooltip="#glossary"} both use the same tooltip.

:::tooltip{id="glossary"}
**Technical Definition:** A comprehensive explanation with full markdown support for complex concepts requiring detailed information.
:::

### In Context {medium-bold}

Tooltips work on buttons, badges, and links:

[Need Help?](#){button primary tooltip="Submit your form after filling all required fields."} [Cancel](#){button secondary tooltip="Discard changes and return to previous page."}

Status: [Active](#){badge success tooltip="Service is running normally"} | Version: [v2.1.0](#){badge info tooltip="Latest stable release"} | [Beta Feature](#){badge warning tooltip="This feature is experimental"}

### Usage Summary {medium-bold}

**Inline:**
```markdown
[Hover here](#){tooltip="Help text"}
```

**ID-referenced:**
```markdown
[Info](#){tooltip="#help"}

:::tooltip{id="help"}
Detailed help content with markdown
:::
```

**Features:**
- Show on hover (desktop)
- Show on click (mobile/touch)
- Auto-positioned relative to trigger
- Fade animations
- ARIA `aria-describedby` for accessibility
- Attaches to any element

[Back to top](#top){badge primary}

---

# Feedback Components {#feedback huge-bold center primary}

**Display messages, status, and notifications.**

---

## Alert {#alert large-bold primary}

**Semantic message boxes with theming and icons.**

### All Variants {medium-bold}

:::alert {info}
:icon[info]{info} **Information:** This is an informational alert with proper theming and icon integration.
:::

:::alert {success}
:icon[check-circle]{success} **Success:** Your operation completed successfully with no errors!
:::

:::alert {warning}
:icon[alert-triangle]{warning} **Warning:** Please review this information carefully before proceeding.
:::

:::alert {error}
:icon[x-circle]{error} **Error:** An error occurred. Please check your input and try again.
:::

### Rich Content Example {medium-bold}

:::alert {info}
#### :icon[lightbulb]{warning} Pro Tip

Alerts support full markdown content:

- **Bold text** and *emphasis*
- `Code snippets` and technical terms
- [Links](#) and inline buttons
- Lists and structured content

[Learn More](#){button primary small}
:::

### Minimal Style {medium-bold}

:::alert {success}
**Clean alert** without an icon for minimal, focused messaging.
:::

### Usage Summary {medium-bold}

```markdown
:::alert {info}
:icon[info]{info} Information message
:::

:::alert {success}
:icon[check-circle]{success} Success message
:::

:::alert {warning}
:icon[alert-triangle]{warning} Warning message
:::

:::alert {error}
:icon[x-circle]{error} Error message
:::
```

**Variants:** `info` (blue) • `success` (green) • `warning` (yellow) • `error` (red)

**Features:** Proper theming • Dark mode support • Responsive padding • Smooth animations

[Back to top](#top){badge primary}

---

## Badge {#badge large-bold primary}

**Inline labels and status indicators.**

### Color Variants {medium-bold}

[Default](#){badge} [Primary](#){badge primary} [Secondary](#){badge secondary} [Success](#){badge success} [Warning](#){badge warning} [Error](#){badge error} [Info](#){badge info} [Muted](#){badge muted}

### Size Variants {medium-bold}

[Small](#){badge primary small} [Medium (default)](#){badge primary} [Large](#){badge primary large}

### In Context {medium-bold}

Use badges to highlight status and metadata:

**Project Status:** [Active](#){badge success} | **Version:** [v2.1.0](#){badge info} | **License:** [MIT](#){badge primary}

**Features:** [New](#){badge warning} [Beta](#){badge info} [Deprecated](#){badge error} [Coming Soon](#){badge secondary}

### With Icons {medium-bold}

Combine badges with icons for visual context:

[Featured](#){badge primary} :icon[star]{warning} • [Trending](#){badge success} :icon[trending-up]{success} • [Hot](#){badge error} :icon[flame]{error}

### Usage Summary {medium-bold}

```markdown
[Text](#){badge}
[Text](#){badge primary}
[Text](#){badge success small}
[Text](#){badge error large}
```

**Colors:** `default` `primary` `secondary` `success` `warning` `error` `info` `muted`

**Sizes:** `small` `base` (default) `large`

[Back to top](#top){badge primary}

---

# Navigation Components {#navigation huge-bold center primary}

**Components for site navigation and wayfinding.**

---

## Navbar {#navbar large-bold primary}

**Modern navigation bar with glassmorphism and responsive behavior.**

:::alert {success}
:icon[check]{success} **Live Example:** The navbar at the top of this page is a working Taildown navbar!
:::

### Basic Structure {medium-bold}

The navbar uses a heading for branding and paragraph links for navigation:

```markdown
:::navbar
# Brand Name

[Home](/) [About](/about) [Docs](/docs) [Contact](/contact)
:::
```

### Features {medium-bold}

:::grid {cols-2}
:::card {subtle-glass padded}
#### Desktop Experience

- Glassmorphic translucent background
- Horizontal flex layout
- Hover effects on links
- Active link highlighting
- Smooth scroll transparency
:::

:::card {subtle-glass padded}
#### Mobile Experience

- Responsive breakpoints
- Wrapped navigation
- Touch-friendly targets
- Full-width layout
:::
:::

### Theming & Behavior {medium-bold}

:::card {light-glass padded}
**Automatic Theming:**
- Light mode: translucent white with blur
- Dark mode: translucent slate with blur
- Smooth theme transitions

**Scroll Behavior:**
- Fixed position (stays at top)
- Increases transparency on scroll
- Enhanced blur effect when scrolling
- Professional modern appearance
:::

### Usage Summary {medium-bold}

```markdown
:::navbar
# Site Name

[Link 1](#) [Link 2](#) [Link 3](#)
:::
```

**Best Practices:**
- Use H1-H3 for branding
- Use paragraph links for navigation
- Keep navigation concise (5-7 links max)
- Include icons for visual interest

**Variants:** `glass` (default) `solid` `minimal` `floating`

[Back to top](#top){badge primary}

---

# Component Combinations {#combinations huge-bold center primary}

**Powerful layouts using multiple components together.**

---

## Feature Grid Showcase {large-bold primary}

Combine grids, cards, and icons for stunning feature sections:

:::grid {cols-3}
:::card {subtle-glass padded center hover-lift}
:icon[zap]{warning huge}

**Lightning Fast** {large-bold}

Sub-100ms compilation targets
:::

:::card {subtle-glass padded center hover-lift}
:icon[heart]{error huge}

**Beautiful Design** {large-bold}

Zero-config glassmorphism
:::

:::card {subtle-glass padded center hover-lift}
:icon[code]{primary huge}

**Simple Syntax** {large-bold}

Plain English styling
:::

:::card {light-glass padded center hover-lift}
:icon[package]{success huge}

**Rich Components** {large-bold}

Interactive with auto JS
:::

:::card {light-glass padded center hover-lift}
:icon[palette]{info huge}

**Full Theming** {large-bold}

Dark mode everywhere
:::

:::card {light-glass padded center hover-lift}
:icon[accessibility]{warning huge}

**Accessible** {large-bold}

ARIA and keyboard nav
:::
:::

---

## Documentation Section {large-bold primary}

Combine cards, tabs, and alerts for rich documentation:

:::card {light-glass padded}
#### :icon[book]{primary} Quick Reference

:::tabs
### Getting Started

:::alert {info}
:icon[lightbulb]{warning} New to Taildown? Start here for a quick introduction!
:::

**Quick Steps:**
1. Install: `npm install @taildown/cli`
2. Create a `.td` file
3. Compile: `taildown compile file.td`
4. Open the generated HTML

[Full Tutorial](#){button primary}

### Syntax Reference

Common patterns at a glance:

| Syntax | Purpose |
|--------|---------|
| `{large-bold}` | Plain English styling |
| `:icon[name]` | Inline icons |
| `:::component` | Component blocks |
| `[Text](#){button}` | Button links |

[Complete Syntax](#){button primary}

### Components

All available components:

- :icon[check]{success} Layout: Card, Grid, Button Group
- :icon[check]{success} Interactive: Tabs, Accordion, Carousel
- :icon[check]{success} Overlays: Modal, Tooltip
- :icon[check]{success} Feedback: Alert, Badge
- :icon[check]{success} Navigation: Navbar

[Component Reference](#){button primary}
:::
:::

---

## Call to Action Section {large-bold primary}

Cards, buttons, and icons create compelling CTAs:

:::card {heavy-glass padded-xl}
:icon[sparkles]{warning huge} {center}

**Ready to build something amazing?** {huge-bold center primary}

Get started with Taildown in 5 minutes. No configuration, no complexity - just beautiful results. {large-muted center}

:::button-group
[Get Started Free](#){button primary large hover-lift} [View Docs](#){button secondary large} [See Examples](#){button info large}
:::
:::

---

## FAQ Accordion {large-bold primary}

Accordion inside a card for elegant FAQs:

:::card {light-glass padded-xl}
### :icon[help-circle]{primary} Frequently Asked Questions

:::accordion
**Is Taildown production-ready?**

Taildown is in active development with strong stability focus. The core syntax is stable and backwards compatibility is a priority. Many features are production-ready while others are being refined.

**Does it work with existing Markdown?**

Yes! Taildown is a superset of Markdown. Every valid Markdown document is also valid Taildown. You can gradually add Taildown features to existing content.

**What about bundle size?**

Taildown uses tree-shaking to include only JavaScript for components you actually use. Documents with no interactive components generate zero JS. Full component usage is typically 2-5KB minified.

**Can I customize the styling?**

Absolutely! The generated CSS can be extended or overridden. You can use custom CSS classes alongside Taildown's plain English shorthands.

**How does it compare to MDX?**

Taildown focuses on zero-config simplicity with plain English syntax, while MDX focuses on JSX integration. Taildown is markup-first, MDX is component-first. Choose based on your needs!
:::
:::

[Back to top](#top){badge primary}

---

# Complete Component List {#checklist huge-bold center primary}

**Every component at a glance:**

:::grid {cols-2}
:::card {light-glass padded}
### :icon[layout]{primary} Layout Components
- :icon[check]{success} **Card** - Content containers with glass effects
- :icon[check]{success} **Grid** - Equal-height column layouts
- :icon[check]{success} **Button Group** - Intelligent button layout
:::

:::card {light-glass padded}
### :icon[activity]{success} Interactive Components
- :icon[check]{success} **Tabs** - Tabbed interfaces with headings
- :icon[check]{success} **Accordion** - Expandable sections with bold triggers
- :icon[check]{success} **Carousel** - Slideshows with 3D effects
:::

:::card {light-glass padded}
### :icon[message-square]{warning} Overlay Components
- :icon[check]{success} **Modal** - Overlay dialogs with blur
- :icon[check]{success} **Tooltip** - Contextual help text
:::

:::card {light-glass padded}
### :icon[bell]{error} Feedback Components
- :icon[check]{success} **Alert** - Semantic message boxes
- :icon[check]{success} **Badge** - Inline status indicators
- :icon[check]{success} **Progress** - Loading indicators
:::
:::

:::card {subtle-glass padded center}
### :icon[compass]{info} Navigation Components
- :icon[check]{success} **Navbar** - Modern site navigation with glassmorphism
- :icon[check]{success} **Breadcrumb** - Navigation trails
- :icon[check]{success} **Pagination** - Page navigation
:::

---

# Next Steps {#next huge-bold center primary}

:::card {light-glass padded-xl center}
**You've mastered every component!** {huge-bold}

Now start building your own beautiful documents. {large-muted}

:::button-group
[Getting Started](getting-started.html){button primary large hover-lift} [Syntax Guide](syntax-guide.html){button secondary large} [Plain English](plain-english.html){button info large}
:::
:::

---

[Back to top](#top){button primary large}
