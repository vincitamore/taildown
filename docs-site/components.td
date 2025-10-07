:::navbar
# Taildown

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html)
:::

---

# Component Reference {huge-bold center primary}

**Interactive showcase of every Taildown component with live examples.** {center large-muted}

---

## :icon[package]{primary large} Layout Components {large-bold primary}

Components for structuring and organizing your content.

---

### Card Component

**The versatile content container with glassmorphism effects.**

:::tabs
### Basic Cards

Standard card with various glass effects:

:::grid {cols-3}
:::card {subtle-glass padded}
#### Subtle Glass

The most understated glass effect - barely visible translucency with soft shadows.

[Learn More](#){button primary small}
:::

:::card {light-glass padded}
#### Light Glass

Soft frosted appearance with gentle blur and elegant borders.

[Learn More](#){button primary small}
:::

:::card {glass padded}
#### Standard Glass

Balanced translucency with moderate blur - the default choice.

[Learn More](#){button primary small}
:::
:::

:::grid {cols-2}
:::card {heavy-glass padded}
#### Heavy Glass

Strong frosted blur with pronounced translucency - makes a statement.

[Learn More](#){button primary small}
:::

:::card {elevated padded-xl rounded-xl}
#### Elevated Card

Classic elevated card with shadow instead of glass effect.

[Learn More](#){button primary small}
:::
:::

### With Content

:::card {light-glass padded-xl}
#### :icon[sparkles]{warning} Feature Card

Cards can contain any content including headings, paragraphs, lists, images, and nested components.

**Key Features:**
- :icon[check]{success} Automatic glassmorphism styling
- :icon[check]{success} Responsive padding variants
- :icon[check]{success} Dark mode support
- :icon[check]{success} Nesting support

:::alert {info}
:icon[lightbulb]{warning} Cards work perfectly with all other components!
:::

:::button-group
[Primary Action](#){button primary} [Secondary](#){button secondary}
:::
:::

### Usage

```markdown
:::card {glass padded}
Your content here
:::

:::card {subtle-glass padded-xl rounded-xl}
Card with multiple attributes
:::
```

**Variants:**
- `subtle-glass` `light-glass` `glass` `heavy-glass`
- `padded` `padded-sm` `padded-lg` `padded-xl`
- `rounded` `rounded-lg` `rounded-xl`
- `elevated` `floating`
:::

---

### Grid Component

**Responsive column layout system with automatic equal-height columns.**

:::tabs
### 2 Columns

:::grid {cols-2}
:::card {subtle-glass padded}
#### :icon[zap]{warning} Column 1

Equal height columns automatically adjust to match the tallest sibling.
:::

:::card {subtle-glass padded}
#### :icon[heart]{error} Column 2

This column has more content to demonstrate the equal-height behavior. Notice how both columns have the same height regardless of content length. This creates a clean, professional grid layout.
:::
:::

### 3 Columns

:::grid {cols-3}
:::card {subtle-glass padded center}
:icon[code]{primary huge}

**Developer Friendly** {bold}

Plain English syntax
:::

:::card {subtle-glass padded center}
:icon[palette]{success huge}

**Beautiful** {bold}

Zero-config aesthetics
:::

:::card {subtle-glass padded center}
:icon[zap]{warning huge}

**Fast** {bold}

Lightning compilation
:::
:::

### 4 Columns

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

### Nested Grids

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

Grids can be nested infinitely for complex layouts.
:::
:::

### Usage

```markdown
:::grid {cols-2}
:::card
Column 1
:::

:::card
Column 2
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

**Variants:**
- `cols-2` `cols-3` `cols-4`
- `gap` `gap-sm` `gap-lg`
:::

---

### Button Group Component

**Intelligent button layout with automatic centering and mobile stacking.**

:::tabs
### Basic Usage

:::card {subtle-glass padded}
**Default (Centered):**

:::button-group
[Primary](#){button primary large} [Secondary](#){button secondary large} [Tertiary](#){button info}
:::
:::

### Alignment Variants

:::card {subtle-glass padded}
**Left Aligned:**

:::button-group {left}
[Left](#){button primary} [Aligned](#){button secondary} [Buttons](#){button info}
:::

---

**Centered (default):**

:::button-group {center}
[Centered](#){button primary} [Button](#){button secondary} [Group](#){button info}
:::

---

**Right Aligned:**

:::button-group {right}
[Right](#){button primary} [Aligned](#){button secondary} [Buttons](#){button info}
:::
:::

### Size Variants

:::card {subtle-glass padded}
**Small Gap:**

:::button-group {sm}
[Button A](#){button primary small} [Button B](#){button secondary small} [Button C](#){button info small}
:::

---

**Medium Gap (default):**

:::button-group
[Button A](#){button primary} [Button B](#){button secondary} [Button C](#){button info}
:::

---

**Large Gap:**

:::button-group {lg}
[Button A](#){button primary large} [Button B](#){button secondary large}
:::
:::

### Responsive Behavior

:::card {light-glass padded}
**Desktop:**
- Centers horizontally
- Auto-sizing with proper gaps
- Wraps when space constrained

**Mobile:**
- Stacks vertically automatically
- Full-width for better touch targets
- Maintains proper spacing

Try resizing your browser to see it in action!

:::button-group
[Try](#){button primary large} [Resizing](#){button secondary large} [Browser](#){button info large}
:::
:::

### Usage

```markdown
:::button-group
[Primary](#){button primary large}
[Secondary](#){button secondary large}
:::

:::button-group {left}
Left-aligned buttons
:::

:::button-group {lg}
Large gaps between buttons
:::
```

**Variants:**
- Alignment: `left` `center` `right` `stack`
- Sizes: `sm` `md` `lg`
:::

---

## :icon[activity]{success large} Interactive Components {large-bold primary}

Components with built-in JavaScript behaviors - zero configuration required.

---

### Tabs Component

**Tabbed interface using headings as labels.**

:::tabs
### Live Demo

Here's a live example of tabs in action!

:::tabs
#### :icon[home]{primary} Tab One

This is the content for the first tab. Tabs use headings (h2 or h3) as labels, and everything between headings becomes the panel content.

**Features:**
- :icon[check]{success} First tab active by default
- :icon[check]{success} Click to switch tabs
- :icon[check]{success} Keyboard navigation (arrow keys)
- :icon[check]{success} Smooth transitions
- :icon[check]{success} ARIA accessibility

#### :icon[code]{success} Tab Two

The tabs component is incredibly simple to use. Just wrap your content in `:::tabs` fences and use headings to define each tab.

```markdown
:::tabs
## First Tab
Content here

## Second Tab
More content
:::
```

#### :icon[sparkles]{warning} Tab Three

Tabs support all markdown and Taildown syntax inside them:

- Lists work
- **Bold text** works
- :icon[heart]{error} Icons work
- [Links](#) work
- Even nested components!

:::alert {info}
:icon[lightbulb]{warning} Alerts inside tabs work perfectly!
:::

#### :icon[palette]{error} Tab Four

You can have as many tabs as you need. They'll automatically wrap on mobile for better usability.
:::

### With Rich Content

:::tabs
#### :icon[layout]{primary} Complex Content

Tabs can contain complex nested structures:

:::grid {cols-2}
:::card {subtle-glass padded}
##### Left Column
Cards inside tabs work!
:::

:::card {subtle-glass padded}
##### Right Column
Even grids inside tabs!
:::
:::

#### :icon[table]{success} Tables

Tables work inside tabs too:

| Feature | Status | Notes |
|---------|--------|-------|
| Markdown | ✓ | Full support |
| Components | ✓ | All work |
| JavaScript | ✓ | Auto-generated |
| Dark Mode | ✓ | Themed properly |

#### :icon[image]{warning} Media

You can include any media:

:::card {subtle-glass padded center}
:icon[image]{primary huge}

**Image Placeholder**

Images, videos, and other media work perfectly inside tabs.
:::
:::

### Usage

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

**Features:**
- Uses h2 or h3 headings as tab labels
- First tab automatically active
- Click or keyboard navigation
- Smooth animations
- Full ARIA support
- Works with all content types
:::

---

### Accordion Component

**Expandable sections using bold text as triggers.**

:::tabs
### Live Demo

:::accordion
**What is an accordion?**
An accordion is a vertically stacked list of items where each item can be expanded to reveal associated content. The first item is open by default.

**How do I create one?**
Simply wrap your content in `:::accordion` fences and use bold text (`**Bold**`) for the trigger labels. Everything between triggers becomes the panel content.

**What content can go inside?**
Anything! Markdown, components, icons, images - the full Taildown syntax is supported inside accordion panels.

**Can I nest components?**
Absolutely! Accordions can contain cards, grids, alerts, and even other accordions:

:::card {subtle-glass padded}
##### Nested Card

This card is inside an accordion panel. Pretty cool, right?

:::alert {success}
:icon[check]{success} Alerts work too!
:::
:::

**How is accessibility handled?**
Accordions include proper ARIA attributes (`aria-expanded`, `aria-controls`) and are fully keyboard navigable for screen reader users.
:::

### With Rich Content

:::accordion
**:icon[zap]{warning} Performance Features**

Taildown is designed for speed:

- :icon[check]{success} Sub-100ms compilation target
- :icon[check]{success} Tree-shaking for minimal JS
- :icon[check]{success} Optimized CSS generation
- :icon[check]{success} Minimal runtime overhead

**:icon[heart]{error} Beautiful Design**

Zero-config aesthetics:

:::grid {cols-3}
:::card {subtle-glass padded center}
:icon[sparkles]{warning}

**Glass** {bold}

Glassmorphism
:::

:::card {subtle-glass padded center}
:icon[sun]{warning}

**Light** {bold}

Light mode
:::

:::card {subtle-glass padded center}
:icon[moon]{primary}

**Dark** {bold}

Dark mode
:::
:::

**:icon[code]{primary} Developer Experience**

Built for developers:

```markdown
:::accordion
**Section Title**
Section content
:::
```

Simple, intuitive, and powerful.

**:icon[book]{success} Documentation**

Comprehensive documentation:

| Resource | Description |
|----------|-------------|
| Syntax Guide | Complete syntax reference |
| Components | Component showcase |
| Plain English | Style shorthand reference |
| Examples | Real-world examples |
:::

### Usage

```markdown
:::accordion
**First Section**
Content for first section (open by default)

**Second Section**
Content for second section

**Third Section**
Content for third section
:::
```

**Features:**
- Bold text paragraphs become triggers
- First item open by default
- Click to expand/collapse
- Smooth expand/collapse animations
- ARIA attributes for accessibility
- Supports all content types
:::

---

### Carousel Component

**Slideshow with navigation and 3D card effects.**

:::tabs
### Live Demo

:::carousel
:::card {heavy-glass padded-xl center}
:icon[zap]{warning huge}

**Slide 1: Lightning Fast** {huge-bold}

Taildown compiles your documents in milliseconds with sub-100ms targets for even large documents. {large-muted}

:::button-group
[Learn More](#){button primary large} [View Benchmark](#){button secondary}
:::
:::

---

:::card {heavy-glass padded-xl center}
:icon[heart]{error huge}

**Slide 2: Zero Config Beautiful** {huge-bold}

Every component is beautiful by default with glassmorphism, animations, and modern design. {large-muted}

:::button-group
[See Examples](#){button primary large} [Style Guide](#){button secondary}
:::
:::

---

:::card {heavy-glass padded-xl center}
:icon[code]{primary huge}

**Slide 3: Plain English** {huge-bold}

Style your content using natural language: `large-bold`, `subtle-glass`, `hover-lift`. {large-muted}

:::button-group
[Syntax Reference](#){button primary large} [Get Started](#){button secondary}
:::
:::

---

:::card {heavy-glass padded-xl center}
:icon[package]{success huge}

**Slide 4: Interactive Components** {huge-bold}

Tabs, accordions, modals, tooltips - all with auto-generated JavaScript. {large-muted}

:::button-group
[Component List](#){button primary large} [Documentation](#){button secondary}
:::
:::
:::

### With Images

:::carousel
:::card {light-glass padded-xl center}
:icon[image]{primary huge}

**Image Slide 1** {huge-bold}

Add images to your carousel slides for stunning visual presentations. {large-muted}
:::

---

:::card {light-glass padded-xl center}
:icon[video]{success huge}

**Video Slide 2** {huge-bold}

Embed videos, animations, or any media type. {large-muted}
:::

---

:::card {light-glass padded-xl center}
:icon[music]{warning huge}

**Audio Slide 3** {huge-bold}

Create multimedia experiences with ease. {large-muted}
:::
:::

### Usage

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
- Auto-play option (via attributes)
:::

---

### Modal Component

**Overlay dialogs with backdrop blur and focus management.**

:::tabs
### Attachable Modals

The recommended way to use modals is to attach them to buttons or links:

**Inline content:**

[Simple Alert](#){button primary modal="This is a simple alert modal! Click the backdrop or press Escape to close."}

**ID-referenced content:**

[Rich Modal](#){button success large hover-lift modal="#demo-modal"}

:::modal{id="demo-modal"}
#### :icon[sparkles]{warning} Rich Modal Example

This modal demonstrates full markdown and component support:

:::alert {info}
:icon[lightbulb]{warning} Modals can contain any Taildown content!
:::

**Features:**
- :icon[check]{success} Full markdown support
- :icon[check]{success} Nested components
- :icon[check]{success} Backdrop blur effect
- :icon[check]{success} Focus trap
- :icon[check]{success} Escape key to close
- :icon[check]{success} Body scroll lock

:::grid {cols-2}
:::card {subtle-glass padded}
##### Column 1
Even grids work!
:::

:::card {subtle-glass padded}
##### Column 2
Perfectly responsive!
:::
:::

:::button-group
[Primary Action](#){button primary} [Secondary](#){button secondary}
:::
:::

### Multiple Triggers

Use ID references to share one modal across multiple triggers:

[Trigger A](#){button primary modal="#shared-modal"} [Trigger B](#){button secondary modal="#shared-modal"} [Trigger C](#){button info modal="#shared-modal"}

:::modal{id="shared-modal"}
#### :icon[users]{primary} Shared Modal

This modal is triggered by three different buttons - define once, use everywhere!

**Benefits:**
- DRY principle (Don't Repeat Yourself)
- Easy to maintain
- Consistent experience
- Better performance
:::

### Usage

**Inline content:**
```markdown
[Click me](#){button modal="Simple message"}
```

**ID-referenced:**
```markdown
[Open Modal](#){button modal="#my-modal"}

:::modal{id="my-modal"}
# Modal Title
Modal content with full markdown support
:::
```

**Features:**
- Backdrop with blur effect
- Close button (top-right)
- Escape key to close
- Click backdrop to close
- Focus trap for accessibility
- Body scroll lock when open
- Fade in/out animations
- Can be attached to any element
:::

---

### Tooltip Component

**Contextual help text on hover or click.**

:::tabs
### Attachable Tooltips

Tooltips attach to any element using simple attributes:

**Inline content:**

Hover over [this text](#){tooltip="This is a helpful tooltip with inline content!"} to see the tooltip.

Learn about [this feature](#){primary tooltip="Tooltips provide context without cluttering your interface. Perfect for help text and definitions."} with contextual help.

**ID-referenced content:**

[Complex tooltip](#){badge warning tooltip="#rich-tooltip"}

:::tooltip{id="rich-tooltip"}
**Complex Tooltip** with:
- Full markdown support
- `Code examples`
- *Emphasis* and **bold**
- Even [links](#)!
:::

### Multiple Triggers

Share tooltips across triggers:

Technical term 1[?](#){badge info tooltip="#glossary"} and technical term 2[?](#){badge info tooltip="#glossary"} both use the same tooltip.

:::tooltip{id="glossary"}
**Technical Definition:** A comprehensive explanation with full markdown support for complex concepts.
:::

### In Buttons

[Need Help?](#){button primary tooltip="Click this button to submit your form. Make sure all required fields are filled."} [Cancel](#){button secondary tooltip="Discard changes and return to the previous page."}

### Usage

**Inline content:**
```markdown
[Hover here](#){tooltip="Help text"}
```

**ID-referenced:**
```markdown
[Info](#){tooltip="#help"}

:::tooltip{id="help"}
Detailed help content
:::
```

**Features:**
- Show on hover (desktop)
- Show on click (mobile/touch)
- Auto-positioned relative to trigger
- Fade in/out animations
- ARIA `aria-describedby` for accessibility
- Full markdown in ID-referenced tooltips
- Can attach to any element
:::

---

## :icon[bell]{warning large} Feedback Components {large-bold primary}

Components for displaying messages and status information.

---

### Alert Component

**Semantic message boxes with theming and icons.**

:::tabs
### Variants

All four semantic variants:

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

### With Content

Alerts can contain rich content:

:::alert {info}
#### :icon[lightbulb]{warning} Pro Tip

Alerts support full markdown:

- **Bold text** and *emphasis*
- `Code snippets`
- [Links](#) and buttons
- Even nested components!

[Learn More](#){button primary small}
:::

### Without Icons

Alerts work without icons too:

:::alert {success}
**Clean alert** without an icon for minimal design.
:::

### Usage

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

**Variants:**
- `info` (blue)
- `success` (green)
- `warning` (yellow/orange)
- `error` (red)

**Features:**
- Proper theming with CSS variables
- Dark mode support
- Full markdown support inside
- Responsive padding
- Smooth animations
:::

---

### Badge Component

**Inline labels and status indicators.**

:::tabs
### Color Variants

Badges come in all semantic colors:

[Default](#){badge} [Primary](#){badge primary} [Secondary](#){badge secondary} [Success](#){badge success} [Warning](#){badge warning} [Error](#){badge error} [Info](#){badge info} [Muted](#){badge muted}

### Size Variants

Three size options:

[Small](#){badge primary small} [Medium (default)](#){badge primary} [Large](#){badge primary large}

### In Context

Use badges to highlight information:

**Status:** [Active](#){badge success} | **Version:** [v1.0.0](#){badge info} | **License:** [MIT](#){badge primary}

### With Icons

Combine badges with icons:

[New](#){badge primary} :icon[star]{warning} [Beta](#){badge warning} :icon[zap]{warning} [Deprecated](#){badge error} :icon[alert-triangle]{error}

### Usage

```markdown
[Text](#){badge}
[Text](#){badge primary}
[Text](#){badge success small}
[Text](#){badge error large}
```

**Colors:**
- `default` `primary` `secondary` `success`
- `warning` `error` `info` `muted`

**Sizes:**
- `small` `base` (default) `large`
:::

---

## :icon[layout]{error large} Navigation Components {large-bold primary}

Components for site navigation and wayfinding.

---

### Navbar Component

**Modern navigation bar with glassmorphism and responsive behavior.**

The navbar you see at the top of this page is a live example!

:::tabs
### Basic Structure

The navbar uses a heading for branding and paragraph links for navigation:

```markdown
:::navbar
# :icon[zap]{warning} Brand Name

[Home](/) [About](/about) [Docs](/docs) [Contact](/contact)
:::
```

### Features

**Desktop:**
- Glassmorphic background with blur
- Horizontal layout with flex
- Hover effects on links
- Active link highlighting

**Mobile:**
- Responsive breakpoints
- Wrapped navigation
- Touch-friendly targets

**Theming:**
- Light mode with translucent white
- Dark mode with translucent slate
- Smooth theme transitions

### Variants

The navbar supports style variants:

```markdown
:::navbar {glass}
Glass variant (default)
:::

:::navbar {solid}
Solid background variant
:::

:::navbar {minimal}
Minimal variant
:::

:::navbar {floating}
Floating with more shadow
:::
```

### Usage

```markdown
:::navbar
# :icon[logo]{primary} Site Name

[Link 1](#) [Link 2](#) [Link 3](#)
:::
```

**Best Practices:**
- Use a heading (h1-h3) for branding
- Use paragraph links for navigation
- Include icons for visual interest
- Keep navigation concise (5-7 links max)
:::

---

## Component Combinations {large-bold center primary}

**Powerful layouts using multiple components together.**

---

### Feature Grid

:::grid {cols-3}
:::card {subtle-glass padded center hover-lift}
:icon[zap]{warning huge}

**Lightning Fast** {large-bold}

Sub-100ms compilation even for large documents.
:::

:::card {subtle-glass padded center hover-lift}
:icon[heart]{error huge}

**Beautiful** {large-bold}

Zero-config glassmorphism and modern design.
:::

:::card {subtle-glass padded center hover-lift}
:icon[code]{primary huge}

**Simple** {large-bold}

Plain English syntax that just makes sense.
:::

:::card {light-glass padded center hover-lift}
:icon[package]{success huge}

**Components** {large-bold}

Rich interactive components with auto JS.
:::

:::card {light-glass padded center hover-lift}
:icon[palette]{info huge}

**Themed** {large-bold}

Dark mode support built-in everywhere.
:::

:::card {light-glass padded center hover-lift}
:icon[accessibility]{warning huge}

**Accessible** {large-bold}

ARIA attributes and keyboard navigation.
:::
:::

---

### Tabbed Content with Cards

:::card {light-glass padded}
#### :icon[book]{primary} Documentation Sections

:::tabs
### Getting Started

:::alert {info}
:icon[lightbulb]{warning} New to Taildown? Start here!
:::

Follow these steps to get up and running:

1. Install Taildown: `npm install @taildown/cli`
2. Create your first `.td` file
3. Compile: `taildown compile your-file.td`
4. Open the generated HTML

[View Full Guide](#){button primary}

### Syntax Reference

Quick reference for common syntax:

| Syntax | Description |
|--------|-------------|
| `{large-bold}` | Plain English styling |
| `:icon[name]` | Inline icons |
| `:::component` | Component blocks |
| `[Link](#){button}` | Button links |

[Full Syntax Guide](#){button primary}

### Components

All available components:

- :icon[check]{success} Card, Grid, Button Group
- :icon[check]{success} Tabs, Accordion, Carousel
- :icon[check]{success} Modal, Tooltip
- :icon[check]{success} Alert, Badge
- :icon[check]{success} Navbar

[Component Reference](#){button primary}
:::
:::

---

### Call to Action Section

:::card {heavy-glass padded-xl}
:icon[sparkles]{warning huge} {center}

**Ready to build something amazing?** {huge-bold center primary}

Get started with Taildown in just 5 minutes. No configuration, no complexity - just beautiful results. {large-muted center}

:::button-group
[Get Started Free](#){button primary large hover-lift} [View Documentation](#){button secondary large} [See Examples](#){button info large}
:::
:::

---

### FAQ Accordion in Card

:::card {light-glass padded-xl}
### :icon[help-circle]{primary} Frequently Asked Questions

:::accordion
**Is Taildown production-ready?**

Taildown is in active development with a strong focus on stability. The core syntax is stable, and backwards compatibility is a priority. Many features are production-ready, while others are still being refined.

**Does it work with my existing Markdown files?**

Yes! Taildown is a superset of Markdown. Every valid Markdown document is also a valid Taildown document. You can gradually add Taildown features to existing content.

**What about bundle size?**

Taildown uses tree-shaking to only include JavaScript for components you actually use. A document with no interactive components generates zero JS. Full component usage is typically 2-5KB minified.

**Can I customize the styling?**

Absolutely! The generated CSS can be extended or overridden. You can also use custom CSS classes alongside Taildown's plain English shorthands.

**How does it compare to MDX?**

Taildown focuses on zero-config simplicity with plain English syntax, while MDX focuses on JSX integration. Taildown is markup-first, while MDX is component-first. Choose based on your needs!
:::
:::

---

## Complete Component Checklist {large-bold center primary}

**Every component at a glance:**

:::grid {cols-2}
:::card {subtle-glass padded}
### Layout Components
- :icon[check]{success} **Card** - Content containers
- :icon[check]{success} **Grid** - Column layouts
- :icon[check]{success} **Button Group** - Button layout
:::

:::card {subtle-glass padded}
### Interactive Components
- :icon[check]{success} **Tabs** - Tabbed interfaces
- :icon[check]{success} **Accordion** - Expandable sections
- :icon[check]{success} **Carousel** - Slideshows
- :icon[check]{success} **Modal** - Overlay dialogs
- :icon[check]{success} **Tooltip** - Contextual help
:::

:::card {subtle-glass padded}
### Feedback Components
- :icon[check]{success} **Alert** - Message boxes
- :icon[check]{success} **Badge** - Inline labels
:::

:::card {subtle-glass padded}
### Navigation Components
- :icon[check]{success} **Navbar** - Site navigation
- :icon[check]{success} **Breadcrumb** - Nav trail
- :icon[check]{success} **Pagination** - Page nav
:::
:::

---

## Next Steps {large-bold center primary}

:::card {light-glass padded-xl center}
**You've seen every component!** {huge-bold}

Ready to use them in your project? {large-muted}
:::

