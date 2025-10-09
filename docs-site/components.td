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

:::grid {2}
:::card {subtle-glass padded center hover-lift href="#layout"}
:icon[layout]{primary huge}

**Layout** {huge-bold}

Card, Grid, Button Group
:::

:::card {subtle-glass padded center hover-lift href="#interactive"}
:icon[activity]{success huge}

**Interactive** {huge-bold}

Tabs, Accordion, Carousel
:::

:::card {subtle-glass padded center hover-lift href="#overlays"}
:icon[message-square]{warning huge}

**Overlays** {huge-bold}

Modal, Tooltip
:::

:::card {subtle-glass padded center hover-lift href="#feedback"}
:icon[bell]{error huge}

**Feedback** {huge-bold}

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

### Clickable Cards {medium-bold}

Make entire cards clickable by adding an `href` attribute - modern UX best practice!

:::grid {cols-2}
:::card {light-glass padded hover-lift href="#layout"}
#### :icon[mouse-pointer]{primary} Clickable Navigation Card

The entire card is a link! This is the modern approach for navigation cards - no visible link styling, just an intuitive clickable surface.

Try hovering over this card - the whole thing responds!
:::

:::card {subtle-glass padded hover-lift href="#interactive"}
#### :icon[hand]{success} Interactive Card Link

Click anywhere on this card to navigate. The `hover-lift` variant provides visual feedback on hover.

**Syntax:**
```
:::card {glass hover-lift href="#target"}
Content here
:::
```
:::
:::

**Benefits:**
- :icon[check]{success} Larger click target (better UX)
- :icon[check]{success} No distracting link underlines
- :icon[check]{success} Entire card provides visual feedback
- :icon[check]{success} Modern, clean aesthetic

### Syntax & Variants {medium-bold}

```taildown
:::card {glass padded}
Your content here
:::

:::card {subtle-glass padded-xl rounded-xl hover-lift}
Card with multiple attributes
:::

:::card {glass padded hover-lift href="#destination"}
Clickable card - entire card is a link
:::
```

**Glass Variants:** `subtle-glass` `light-glass` `glass` `heavy-glass`

**Padding:** `padded-sm` `padded` `padded-lg` `padded-xl`

**Effects:** `elevated` `floating` `hover-lift` `rounded` `rounded-lg` `rounded-xl`

**Clickable:** Add `href="#target"` to make entire card a link

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

```taildown
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

```taildown
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

:::container
:::tabs
### :icon[home]{primary} Overview

Tabs use headings (h2 or h3) as labels. Everything between headings becomes panel content.

**Features:**
- :icon[check]{success} First tab active by default
- :icon[check]{success} Click or keyboard navigation (arrow keys)
- :icon[check]{success} Smooth transitions
- :icon[check]{success} Full ARIA accessibility

### :icon[code]{success} Syntax

Simple, intuitive syntax:

```taildown
:::tabs
## First Tab
Content for first tab

## Second Tab
Content for second tab

## Third Tab
Content for third tab
:::
```

### :icon[sparkles]{warning} Rich Content

Tabs support full Taildown syntax:

- **Bold** and *emphasis*
- `Code snippets`
- [Links](#) and buttons
- :icon[heart]{error} Icons
- Nested components!

:::alert {info}
:icon[lightbulb]{warning} Even alerts work inside tabs!
:::

### :icon[palette]{error} Nested Components

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
:::

### Usage Summary {medium-bold}

```taildown
:::tabs
## First Tab
Content

## Second Tab
More content
:::
```

**Key Points:**
- H2 or H3 headings become tab labels (not H4!)
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

```taildown
:::accordion
**Section Title**
Section content here
:::
```

Clean, intuitive, and powerful!
:::

### Usage Summary {medium-bold}

```taildown
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

:::container
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
:::

### Usage Summary {medium-bold}

```taildown
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

**Create stunning modals and tooltips with zero configuration - just add an attribute.**

:::grid {3}
:::card {glass padded center}
:icon[layers]{primary huge}

**Modals** {large-bold}

Overlay dialogs with backdrop blur, focus management, and accessibility built-in.
:::

:::card {light-glass padded center}
:icon[message-circle]{info huge}

**Tooltips** {large-bold}

Contextual help on hover or click. Perfect for definitions, hints, and extra context.
:::

:::card {subtle-glass padded center}
:icon[zap]{warning huge}

**Zero Config** {large-bold}

No JavaScript setup required. Just add `modal="..."` or `tooltip="..."` to any element.
:::
:::

---

## Modal {#modal large-bold primary}

**Powerful overlay dialogs that work beautifully across all devices.**

:::card {glass padded}
### :icon[sparkles]{primary} Quick Start {medium-bold}

The simplest modal is just one attribute:

[Try Simple Modal](#){button primary modal="Success! This is an inline modal. Click anywhere outside or press Escape to close."}

```taildown
[Click Me](#){button primary modal="Your message here"}
```

**Perfect for:** Alerts, confirmations, simple messages
:::

### Rich Content Modals {medium-bold}

For complex layouts with markdown, components, and interactivity, use ID-referenced modals:

:::grid {3}
[Welcome Dialog](#){button primary large hover-lift modal="#welcome-modal"}
[Feature Tour](#){button info large hover-lift modal="#feature-modal"}
[Pricing Details](#){button success large hover-lift modal="#pricing-modal"}
:::

:::modal{id="welcome-modal"}
### :icon[sparkles]{warning} Welcome to Taildown! {center}

The future of content markup is here. {large-muted center}

:::grid {2}
:::card {subtle-glass padded}
:icon[code]{primary}

**Plain English** {medium-bold}

Natural syntax that reads like regular text. No cryptic class names.
:::

:::card {subtle-glass padded}
:icon[layers]{success}

**Zero Config** {medium-bold}

Beautiful by default. No setup, no build tools, no configuration files.
:::

:::card {subtle-glass padded}
:icon[zap]{warning}

**Lightning Fast** {medium-bold}

Compiles to pure HTML, CSS, and vanilla JS. No framework overhead.
:::

:::card {subtle-glass padded}
:icon[check-circle]{info}

**Production Ready** {medium-bold}

Battle-tested syntax with comprehensive test coverage.
:::
:::

[Get Started](#getting-started){button primary large} [View Examples](#examples){button secondary large}
:::

:::modal{id="feature-modal"}
### :icon[layers]{primary} Feature Highlights

Everything you need to create modern, responsive content:

- :icon[check]{success} **Components**: Cards, grids, tabs, accordions, carousels, modals, tooltips
- :icon[check]{success} **Styling**: Plain English shorthands like `large-bold`, `center`, `glass-effect`
- :icon[check]{success} **Icons**: 1000+ Lucide icons with `:icon[name]{attributes}` syntax
- :icon[check]{success} **Interactive**: Tabs, accordions, carousels with automatic JavaScript generation
- :icon[check]{success} **Responsive**: Mobile-first with smart breakpoints
- :icon[check]{success} **Accessible**: ARIA attributes and keyboard navigation built-in

:::alert {info}
:icon[lightbulb]{warning} **Pro Tip:** You can nest any Taildown content inside modals - even other components!
:::
:::

:::modal{id="pricing-modal"}
### :icon[dollar-sign]{success} Simple Pricing

:icon[gift]{success huge} {center}

**100% Free & Open Source** {huge-bold center}

Forever. No hidden costs, no premium tiers. {large-muted center}

:::grid {3}
:::card {padded center}
:icon[check]{success}

**MIT Licensed**
:::

:::card {padded center}
:icon[check]{success}

**No Watermarks**
:::

:::card {padded center}
:icon[check]{success}

**Commercial Use OK**
:::
:::

[View on GitHub](#){button primary large} [Read Docs](#){button secondary large}
:::

### Shared Modals {medium-bold}

Define once, trigger from anywhere. Perfect for reusable content:

:::card {light-glass padded}
[Trigger A](#){button primary modal="#shared-content"} [Trigger B](#){button secondary modal="#shared-content"} [Trigger C](#){button info modal="#shared-content"} [Trigger D](#){button success modal="#shared-content"}

**All four buttons open the same modal** {muted}
:::

:::modal{id="shared-content"}
### :icon[users]{primary} Shared Modal

This modal is defined once but can be triggered by any number of elements throughout your document.

**Benefits:**
- :icon[check]{success} DRY principle - Don't Repeat Yourself
- :icon[check]{success} Single source of truth for content
- :icon[check]{success} Easy to maintain and update
- :icon[check]{success} Better performance (content only rendered once)
- :icon[check]{success} Consistent user experience

```taildown
[Button 1](#){button modal="#shared"}
[Button 2](#){button modal="#shared"}

:::modal{id="shared"}
Content defined once
:::
```
:::

### Modal Syntax Reference {medium-bold}

:::grid {2}
:::card {padded}
#### Inline Modals {medium-bold}

```taildown
[Button](#){button modal="Simple text"}
[Link](#){modal="Also works on links"}
```

**Best for:** Short messages, alerts, confirmations
:::

:::card {padded}
#### ID-Referenced Modals {medium-bold}

```taildown
[Open](#){button modal="#my-modal"}

:::modal{id="my-modal"}
# Full Markdown Support
With components, styling, everything!
:::
```

**Best for:** Rich content, complex layouts, reusable modals
:::
:::

:::card {elevated padded}
### :icon[shield]{success} Accessibility Features {medium-bold}

Modals include enterprise-grade accessibility out of the box:

- :icon[check]{success} **Focus trap**: Tab stays within modal when open
- :icon[check]{success} **Escape key**: Press ESC to close
- :icon[check]{success} **Backdrop click**: Click outside to dismiss
- :icon[check]{success} **Body scroll lock**: Prevents scrolling main content
- :icon[check]{success} **ARIA attributes**: Proper roles and labels for screen readers
- :icon[check]{success} **Keyboard navigation**: Full keyboard support
:::

[Back to top](#top){badge primary}

---

## Tooltip {#tooltip large-bold primary}

**Contextual help that appears on hover or click. Perfect for hints, definitions, and extra context.**

:::card {glass padded}
### :icon[message-circle]{info} Quick Start {medium-bold}

Add tooltips to any element with one attribute:

Hover over [this text](#){tooltip="Simple tooltip content!"} or [this link](#){primary tooltip="Tooltips provide context without cluttering your UI."} to see tooltips in action.

```taildown
[Hover me](#){tooltip="Helpful information"}
```

**Perfect for:** Help text, definitions, extra context, hints
:::

### Tooltip Showcase {medium-bold}

:::grid {2}
:::card {light-glass padded}
**On Buttons** {medium-bold}

[Need Help?](#){button primary tooltip="This button submits your form after validation."} [Cancel](#){button secondary tooltip="Discard changes and return to the previous page."}
:::

:::card {light-glass padded}
**On Badges** {medium-bold}

Status: [Active](#){badge success tooltip="Service is running normally"} [Beta](#){badge warning tooltip="Feature is in beta testing"} [v2.1.0](#){badge info tooltip="Latest stable release"}
:::

:::card {subtle-glass padded}
**On Icons** {medium-bold}

:icon[help-circle]{primary tooltip="Click for help documentation"}
:icon[settings]{muted tooltip="Open settings panel"}
:icon[info]{info tooltip="View additional information"}
:::

:::card {subtle-glass padded}
**In Text** {medium-bold}

The API uses REST[?](#){badge primary tooltip="REpresentational State Transfer - architectural style for distributed systems"} architecture with JSON[?](#){badge primary tooltip="JavaScript Object Notation - lightweight data format"} payloads.
:::
:::

### Rich Content Tooltips {medium-bold}

For complex tooltip content, use ID references:

:::card {padded}
Hover over [this badge](#){badge info tooltip="#rich-tooltip-demo"} for a rich tooltip with full markdown support.

[Another trigger](#){primary tooltip="#rich-tooltip-demo"} can reference the same tooltip content.
:::

:::tooltip{id="rich-tooltip-demo"}
**Rich Tooltip Example** {large-bold}

Tooltips support full markdown:
- Bulleted lists
- `Code examples`
- *Emphasis* and **bold text**
- Even [links](#) work!

Perfect for detailed explanations.
:::

### Multiple Triggers {medium-bold}

Share one tooltip across multiple triggers for consistency:

:::card {light-glass padded}
Technical terms: API[?](#){badge primary tooltip="#api-definition"}, REST[?](#){badge primary tooltip="#api-definition"}, endpoint[?](#){badge primary tooltip="#api-definition"}, JSON[?](#){badge primary tooltip="#api-definition"}

All four terms share the same tooltip definition.
:::

:::tooltip{id="api-definition"}
**API Terminology** {medium-bold}

These terms relate to Application Programming Interface design and implementation using RESTful architecture patterns.
:::

### Tooltip Syntax Reference {medium-bold}

:::grid {2}
:::card {padded}
#### Inline Tooltips {medium-bold}

```taildown
[Text](#){tooltip="Help text"}
[Button](#){button tooltip="Hint"}
[Badge](#){badge tooltip="Info"}
```

**Best for:** Short hints, simple definitions
:::

:::card {padded}
#### ID-Referenced Tooltips {medium-bold}

```taildown
[Term 1](#){tooltip="#def"}
[Term 2](#){tooltip="#def"}

:::tooltip{id="def"}
**Definition** with full markdown
:::
```

**Best for:** Complex content, shared definitions
:::
:::

:::card {elevated padded}
### :icon[shield]{info} Tooltip Features {medium-bold}

Professional tooltips with excellent UX:

- :icon[check]{info} **Smart positioning**: Auto-positions to stay in viewport
- :icon[check]{info} **Hover on desktop**: Shows on mouse hover
- :icon[check]{info} **Click on mobile**: Touch-friendly behavior
- :icon[check]{info} **Fade animations**: Smooth appearance and dismissal
- :icon[check]{info} **ARIA attributes**: `aria-describedby` for screen readers
- :icon[check]{info} **Attaches to anything**: Works on any element
:::

:::card {glass padded}
### :icon[lightbulb]{warning} Best Practices {medium-bold}

**Do:**
- :icon[check]{success} Use for supplementary information
- :icon[check]{success} Keep tooltips concise (or use ID references for longer content)
- :icon[check]{success} Ensure tooltip text is meaningful
- :icon[check]{success} Use consistent terminology

**Don't:**
- :icon[x]{error} Put critical information only in tooltips
- :icon[x]{error} Use tooltips for interactive content (use modals instead)
- :icon[x]{error} Nest tooltips inside other tooltips
- :icon[x]{error} Overuse - not everything needs a tooltip
:::

[Back to top](#top){badge primary}

---

# Feedback Components {#feedback huge-bold center primary}

**Display messages, status, and notifications.**

---

## Alert {#alert center large-bold primary}

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

```taildown
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

:::badge {lg info}
info
:::

:::badge {lg success}
success
:::

:::badge {warning lg}
warning
:::

:::badge {error lg}
error
:::

**Features:** Proper theming • Dark mode support • Responsive padding • Smooth animations

[Back to top](#top){badge primary}

---

## Badges {#badge center large-bold primary}

:::grid {2}
:::card
### Inline labels and status indicators

#### Color Variants {medium-bold}
:::card
:badge[default]{default} :badge[primary]{primary} :badge[secondary]{secondary} :badge[success]{success} :badge[warning]{warning} :badge[error]{error} :badge[info]{info} :badge[muted]{muted}
:::

#### Size Variants {medium-bold}
:::container
:::card
:::badge {muted sm}
small badges for subtle badges
:::
:::badge {primary}
medium badges for regular badges
:::
:::badge {warning lg}
large badges for emphasized badges
:::
:::
:::    
:::

:::card
### In Context {medium-bold}

Use badges to highlight status and metadata:

:::container
    :::card
#### Project Status: :badge[active]{success} 
#### Version :badge[v2.1.0]{info} 
#### License :badge[MIT]{primary}
:::
:::

**Features:** :badge[new]{warning} :badge[beta]{info} :badge[deprecated]{error} :badge[coming soon]{secondary}

### With Icons {medium-bold}

Combine badges with icons and markdown content for visual context and alternative use:

:::badge {primary}
:icon[lightbulb]{warning} Pro Tip: Badges support full markdown content:

- **Bold text** and *emphasis*
- `Code snippets` and technical terms
- Lists and structured content
- Useful for more subdued styled message boxes than alerts

:::
:::badge {success}
:icon[trending-up]{success} trending
:::
:::badge {error}
:icon[flame]{error} hot
:::
:::
:::

### Usage Summary {medium-bold}

```taildown
# Inline badges
Project Status: :badge[active]{success}
Version: :badge[v2.1.0]{info}
License: :badge[MIT]{primary}

Features: :badge[new]{warning} :badge[beta]{info} :badge[deprecated]{error}

# Component syntax
Combine badges with icons for visual context:

:::badge {primary}
:icon[star]{warning} featured
:::
:::badge {success}
:icon[trending-up]{success} trending
:::
:::badge {error}
:icon[flame]{error} hot
:::

```

**Colors:** `default` `primary` `secondary` `success` `warning` `error` `info` `muted`

**Sizes:** `sm` `md (default)` `lg`

[Back to top](#top){button link}

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

```taildown
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

```taildown
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
