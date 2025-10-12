:::navbar
# Taildown

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html) [Live Editor](editor.html)
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

**Layout** {large-bold}

Card, Grid, Button Group
:::

:::card {subtle-glass padded center hover-lift href="#interactive"}
:icon[activity]{success huge}

**Interactive** {large-bold}

Tabs, Accordion, Carousel
:::

:::card {subtle-glass padded center hover-lift href="#overlays"}
:icon[message-square]{warning huge}

**Overlays** {large-bold}

Modal, Tooltip
:::

:::card {subtle-glass padded center hover-lift href="#feedback"}
:icon[bell]{error huge}

**Feedback** {large-bold}

Alert, Badge, Progress
:::

:::card {subtle-glass padded center hover-lift href="#content"}
:icon[file-text]{info huge}

**Content** {large-bold}

Details, Callout, Columns, Definitions, Stats, Divider, Steps, Mark
:::

:::card {subtle-glass padded center hover-lift href="#data"}
:icon[table]{success huge}

**Data & Comparison** {large-bold}

Enhanced Tables, Image Comparison Slider, Mermaid Diagrams, Math Equations, Timeline
:::

:::card {subtle-glass padded center hover-lift href="#media"}
:icon[video]{accent huge}

**Media** {large-bold}

Video Embeds
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

:::grid {2}
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

:::grid {3}
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

:::grid {4}
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

:::grid {2}
:::card {light-glass padded}
#### Main Content

:::grid {2}
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
:::grid {2}
:::card
Column 1
:::

:::card
Column 2
:::
:::

:::grid {3 gap-lg}
Three columns with large gap
:::
```

**Columns:** `2` `3` `4`

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
:icon[lightbulb]{warning} Pro Tip: Badges support content but don't go overboard.
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

# Content Components {#content huge-bold center primary}

**Progressive disclosure and semantic alert boxes for better content organization.**

---

## Details/Summary {#details large-bold primary}

**Native HTML5 disclosure widget with beautiful Taildown styling - zero JavaScript required!**

### What is Details/Summary? {medium-bold}

The `<details>` element is a native HTML5 component for progressive disclosure - perfect for FAQs, collapsible content, and expandable sections. Taildown adds beautiful glassmorphism styling while maintaining full accessibility.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Zero JavaScript** - Uses native HTML5
- :icon[check]{success} **Perfect Accessibility** - Built-in ARIA support
- :icon[check]{success} **Keyboard Navigation** - Enter/Space to toggle
- :icon[check]{success} **Smooth Animations** - CSS transitions
:::

### Live Examples {medium-bold}

:::details {glass}
**What is Taildown?** {bold}

Taildown is a markup language for creating beautiful UIs with plain English styling. It compiles to pure HTML, CSS, and minimal vanilla JavaScript.

**Key Features:**
- Zero-config beautiful defaults
- Plain English syntax
- Glassmorphism built-in
- Full dark mode support

[Learn More](getting-started.html){button primary small}
:::

:::details {subtle-glass}
**How do I install it?**

Installation is simple with pnpm, npm, or yarn:

```bash
pnpm install @taildown/cli
```

Then create a `.td` file and compile it:

```bash
taildown compile myfile.td
```
:::

:::details {elevated}
**What components are available?**

Taildown includes a comprehensive component library:

- **Layout**: Card, Grid, Button Group
- **Interactive**: Tabs, Accordion, Carousel
- **Overlays**: Modal, Tooltip
- **Feedback**: Alert, Badge, Progress
- **Content**: Details, Callout
- **Navigation**: Navbar, Breadcrumb, Pagination
:::

### Glass Variants {medium-bold}

:::grid {3}
:::details {subtle-glass}
**Subtle Glass** {bold}

Minimal transparency with soft shadows for a clean, professional look.
:::

:::details {glass}
**Standard Glass** {bold}

Balanced glassmorphism - the default choice for most use cases.
:::

:::details {heavy-glass}
**Heavy Glass** {bold}

Pronounced frosted blur that makes a bold statement.
:::
:::

### Open by Default {medium-bold}

Add `{open}` to start expanded:

:::details {glass open}
**This details is open by default** {bold}

Perfect for showing important content that should be visible initially while still being collapsible.

Users can still click to collapse it if they want to focus on other content.
:::

### Syntax & Variants {medium-bold}

```taildown
:::details {glass}
**Summary Text** {bold}

Details content here - supports full markdown, components, everything!
:::

:::details {elevated open}
**Open by Default**

Content visible initially
:::
```

**Glass Variants:** `subtle-glass` `glass` `light-glass` `heavy-glass`

**Other Variants:** `elevated` `bordered`

**Attributes:** `open` - Start expanded

[Back to top](#top){badge primary}

---

## Callout/Admonition {#callout large-bold primary}

**Semantic alert boxes with color-coded types for notes, tips, warnings, and critical alerts.**

### What are Callouts? {medium-bold}

Callouts (also known as admonitions) are highlighted content boxes that draw attention to important information. They're essential for documentation, technical writing, and any content that needs clear visual hierarchy.

:::card {light-glass padded}
**Why Use Callouts?**
- :icon[check]{success} **Visual Hierarchy** - Important info stands out
- :icon[check]{success} **Semantic Meaning** - Color conveys message type
- :icon[check]{success} **Better Scanning** - Readers quickly identify key points
- :icon[check]{success} **Professional Look** - Polished documentation style
:::

### All Callout Types {medium-bold}

:::callout {note}
:icon[info]{primary} **Note:** This is a note callout for general information and context. Use for neutral, informational content that provides additional detail.
:::

:::callout {info}
:icon[info]{info} **Info:** Similar to note but with a lighter blue color scheme. Perfect for helpful information and guidance.
:::

:::callout {tip}
:icon[lightbulb]{success} **Pro Tip:** This is a tip callout for helpful advice and best practices. Use green to convey positive, helpful guidance.
:::

:::callout {success}
:icon[check-circle]{success} **Success:** Use for positive messages, confirmations, and successful outcomes. Emphasizes that something worked correctly.
:::

:::callout {warning}
:icon[alert-triangle]{warning} **Warning:** This is a warning callout for caution messages. The amber/orange color draws attention without being alarming.
:::

:::callout {danger}
:icon[alert-octagon]{error} **Danger:** For critical warnings about destructive or irreversible actions. The red border immediately signals importance.
:::

:::callout {error}
:icon[x-circle]{error} **Error:** For error messages and problems that need attention. Use when something went wrong or failed.
:::

### Rich Content Callouts {medium-bold}

Callouts support full markdown and nested components:

:::callout {tip glass}
:icon[sparkles]{warning} **Advanced Usage Tip**

You can nest any Taildown content inside callouts:

**Example workflow:**
1. Create your `.td` file
2. Add components and styling
3. Compile with `taildown compile`
4. Deploy the HTML

:::grid {2}
:::card {subtle-glass padded center}
:icon[zap]{warning}

**Fast**
:::

:::card {subtle-glass padded center}
:icon[heart]{error}

**Beautiful**
:::
:::

[View Full Tutorial](getting-started.html){button primary small}
:::

### Callout without Icons {medium-bold}

Icons are optional - callouts work great with just text:

:::callout {note}
**Clean and Minimal:** Callouts don't require icons. The colored left border and background tint provide clear visual distinction.
:::

:::callout {success}
**Operation Successful:** Your changes have been saved and deployed to production.
:::

### Glass Effect Callouts {medium-bold}

Add `{glass}` for glassmorphism styling:

:::callout {warning glass}
:icon[alert-triangle]{warning} **Important Notice:** Combining callout types with glass effects creates a modern, professional appearance while maintaining readability.
:::

### Syntax & Variants {medium-bold}

```taildown
:::callout {note}
:icon[info]{primary} **Note:** Additional information here
:::

:::callout {tip glass}
:icon[lightbulb]{success} **Pro Tip:** Helpful advice with glass effect
:::

:::callout {danger elevated}
:icon[alert-octagon]{error} **Danger:** Critical warning with shadow
:::
```

**Types:** `note` `info` `tip` `success` `warning` `danger` `error`

**Visual Variants:** `glass` `elevated` `bordered`

**Sizes:** `sm` `md` `lg`

[Back to top](#top){badge primary}

---

## Multi-Column Layout {#columns large-bold primary}

**CSS multi-column layout for magazine-style text flow - content reflows naturally.**

### What are Columns? {medium-bold}

The `:::columns` component uses CSS multi-column layout to create magazine-style text flow. Content automatically reflows between columns, creating professional, space-efficient layouts perfect for long-form content.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Natural Flow** - Text reflows like a magazine
- :icon[check]{success} **Zero JavaScript** - Pure CSS solution
- :icon[check]{success} **Responsive** - Mobile: 1 column, scales up on larger screens
- :icon[check]{success} **Smart Breaks** - Prevents awkward heading/image splits
:::

### Live Example - 2 Columns {medium-bold}

:::columns {2}
**Magazine-style text flow** {medium-bold}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

**Automatic reflow** {medium-bold}

The text naturally flows from one column to the next, creating a professional magazine-style layout. Paragraphs, lists, and images all work seamlessly within the column structure.

This is perfect for long-form content, documentation, articles, and any content that benefits from shorter line lengths for improved readability.
:::

### 3 Column Example {medium-bold}

:::columns {3 gap-lg}
**First Column** - Content automatically distributes across three columns with large gaps between them for optimal readability and visual separation.

**Second Column** - Notice how the text flows naturally and the layout remains balanced. CSS columns automatically handle the distribution.

**Third Column** - Perfect for feature lists, specifications, or any content that benefits from compact, organized presentation.
:::

### Syntax & Variants {medium-bold}

```taildown
:::columns {2}
Content flows between 2 columns
:::

:::columns {3 gap-lg}
Three columns with large gap
:::

:::columns {4 divider}
Four columns with divider lines
:::
```

**Column Counts:** `2` `3` `4` `auto`

**Gap Sizes:** `gap-sm` `gap` (default) `gap-lg` `gap-xl`

**Options:** `divider` (column rule line) `balanced` (equal column heights)

[Back to top](#top){badge primary}

---

## Definition List {#definitions large-bold primary}

**Semantic `<dl>` element for term-definition pairs - perfect for glossaries and API docs.**

### What are Definition Lists? {medium-bold}

Definition lists use semantic HTML (`<dl>`, `<dt>`, `<dd>`) to pair terms with their definitions. They're perfect for glossaries, API parameters, metadata, and any key-value documentation.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Semantic HTML** - Proper term-definition structure
- :icon[check]{success} **Flexible Layouts** - Vertical, horizontal, or compact
- :icon[check]{success} **Better than Tables** - For simple key-value pairs
- :icon[check]{success} **Excellent Accessibility** - Screen reader friendly
:::

### Vertical Layout (Default) {medium-bold}

:::definitions {glass}
**API Key** {term}
: A unique identifier for authentication with the service. Keep this secure and never commit it to version control.

**Base URL** {term}
: https://api.example.com/v1

**Rate Limit** {term}
: 1000 requests per hour per API key. Contact support for higher limits.

**Authentication** {term}
: Bearer token authentication via the Authorization header. Include your API key in all requests.
:::

### Horizontal Layout {medium-bold}

:::definitions {horizontal elevated}
**Name:** John Doe
**Email:** john@example.com
**Role:** Lead Developer
**Location:** San Francisco, CA
**Status:** :badge[Active]{success}
:::

### Compact Layout {medium-bold}

:::definitions {compact subtle-glass}
**Version:** v2.1.0
**License:** MIT
**Author:** Taildown Team
**Updated:** 2025-10-11
:::

### Syntax & Variants {medium-bold}

```taildown
:::definitions {glass}
**Term** {term}
: Definition text here

**Another Term** {term}
: Another definition
:::

:::definitions {horizontal}
**Key:** Value
**Another:** Value
:::
```

**Layouts:** `vertical` (default) `horizontal` `compact`

**Visual Variants:** `glass` `subtle-glass` `elevated` `bordered`

**Sizes:** `sm` `md` `lg`

[Back to top](#top){badge primary}

---

## Stats/Metrics Display {#stats large-bold primary}

**Large, prominent statistics for landing pages, dashboards, and social proof.**

### What are Stats? {medium-bold}

The stats component displays large, eye-catching numbers with labels and icons - perfect for showcasing key metrics, social proof, and important statistics on landing pages.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **High Visual Impact** - Large, prominent numbers
- :icon[check]{success} **Scannable** - Easy to digest at a glance
- :icon[check]{success} **Responsive Grid** - Adapts to all screen sizes
- :icon[check]{success} **Glass Effects** - Beautiful by default
:::

### Live Example - 3 Stats {medium-bold}

:::stats {3 glass}
### 10,000+ {stat}
:icon[users]{primary huge}
Active Users

### 99.9% {stat}
:icon[check-circle]{success huge}
Uptime SLA

### < 50ms {stat}
:icon[zap]{warning huge}
Response Time
:::

### 4 Stats Grid {medium-bold}

:::stats {4 elevated}
### 1M+ {stat}
:icon[download]{primary huge}
Downloads

### 150 {stat}
:icon[users]{success huge}
Contributors

### 5.0★ {stat}
:icon[star]{warning huge}
Rating

### 24/7 {stat}
:icon[headphones]{info huge}
Support
:::

### Syntax & Variants {medium-bold}

```taildown
:::stats {3}
### 10,000+ {stat}
:icon[users]{primary huge}
Active Users

### 99.9% {stat}
:icon[check-circle]{success huge}
Uptime

### < 50ms {stat}
:icon[zap]{warning huge}
Response Time
:::
```

**Column Counts:** `2` `3` (default) `4`

**Visual Variants:** `glass` `elevated` `bordered` `compact`

**Usage:** Use H3 headings with `{stat}` marker, add icon above, label text below

[Back to top](#top){badge primary}

---

## Divider/Separator {#divider large-bold primary}

**Enhanced horizontal rules with text, icons, and decorative styles.**

### What are Dividers? {medium-bold}

Dividers create visual section breaks with more expressiveness than plain markdown `---`. Add text, icons, gradients, and decorative styles to match your brand.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Visual Breaks** - Clear section separation
- :icon[check]{success} **Decorative Options** - Gradients, dots, waves
- :icon[check]{success} **Brand Styling** - Colored and themed
- :icon[check]{success} **Better than HR** - More expressive than `---`
:::

### Basic Divider {medium-bold}

:::divider
Simple divider
:::

### Text Divider {medium-bold}

:::divider {text}
Section Break
:::

### Icon Divider {medium-bold}

:::divider {icon}
:icon[star]{warning}
:::

### Gradient Divider {medium-bold}

:::divider {gradient primary}
:::

### Decorative Styles {medium-bold}

**Dotted:**

:::divider {dots}
:::

**Dashed:**

:::divider {dashed muted}
:::

**Thick:**

:::divider {thick primary}
:::

**Double Line:**

:::divider {double}
:::

### Colored Dividers {medium-bold}

:::divider {gradient success}
:::

:::divider {text warning}
Important Section
:::

:::divider {thick error}
:::

### Syntax & Variants {medium-bold}

```taildown
:::divider
Basic divider
:::

:::divider {text}
Section Break
:::

:::divider {icon}
:icon[star]{warning}
:::

:::divider {gradient primary}
Gradient with color
:::

:::divider {dots muted}
Decorative style
:::
```

**Styles:** `solid` `text` `icon` `gradient` `dots` `dashed` `double` `wavy` `thick`

**Colors:** `primary` `accent` `muted` `success` `warning` `error`

[Back to top](#top){badge primary}

---

## Enhanced Blockquote {#blockquote large-bold primary}

**Beautiful blockquotes with attribution, citations, and pull-quote styling.**

### What are Enhanced Blockquotes? {medium-bold}

Enhanced blockquotes go beyond basic markdown `>` syntax with professional styling, attribution support, and special variants for pull quotes and testimonials.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Professional Presentation** - Decorative quote marks
- :icon[check]{success} **Attribution Support** - Proper citation formatting
- :icon[check]{success} **Pull Quotes** - Large, emphasized quotes
- :icon[check]{success} **Testimonials** - Glass cards for reviews
:::

### Standard Blockquote {medium-bold}

> This is a standard blockquote with regular styling. It has a colored left border, subtle background tint, and decorative quote marks.

> Multiple paragraphs in a blockquote work seamlessly.
>
> Each paragraph flows naturally with proper spacing and formatting.

### Pull Quote Variant {medium-bold}

> The best design tool I've used. Taildown makes beautiful UIs effortless.
{pull-quote primary}

### Testimonial Variant {medium-bold}

> Taildown transformed our documentation. The glassmorphism is stunning and the plain English syntax is so intuitive. Our entire team adopted it in days.
>
> — Sarah Chen, Lead Designer
> Company Name
{testimonial glass}

### Glass Effect Blockquote {medium-bold}

> This blockquote has a beautiful glassmorphism effect with backdrop blur, creating a modern, professional appearance that stands out.
{glass}

### Bordered Variant {medium-bold}

> This blockquote features a heavier left border (6px) for extra emphasis without background styling.
{bordered primary}

### Color Variants {medium-bold}

> Information blockquote with blue accent
{primary}

> Success or positive quote
{success}

> Warning or caution quote
{warning}

> Error or critical quote
{error}

### Syntax & Variants {medium-bold}

```taildown
> Standard blockquote
> with multiple lines

> Pull quote for emphasis
{pull-quote primary}

> Testimonial with attribution
>
> — Author Name
> Title/Company
{testimonial glass}

> Glass effect blockquote
{glass}

> Bordered with color
{bordered success}
```

**Variants:** `pull-quote` `testimonial` `bordered` `glass` `subtle-glass`

**Colors:** `primary` `success` `warning` `error` `accent`

[Back to top](#top){badge primary}

---

## Step Indicator {#steps large-bold primary}

**Visual progress indicator for multi-step processes, tutorials, and onboarding flows.**

### What are Step Indicators? {medium-bold}

Step indicators show progress through multi-step processes with visual markers, numbers, and connecting lines. Perfect for installation guides, tutorials, and documenting workflows.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Visual Progress** - Clear step-by-step guidance
- :icon[check]{success} **State Indicators** - Completed, current, pending states
- :icon[check]{success} **Auto-Numbering** - Automatic step numbers
- :icon[check]{success} **Responsive** - Horizontal becomes vertical on mobile
:::

### Vertical Steps (Default) {medium-bold}

:::steps {numbered connected glass}
### Install Dependencies {step completed}
Run `pnpm install` to install all required packages.

### Configure Environment {step current}
Create a `.env` file with your configuration settings:

```bash
API_KEY=your-api-key-here
BASE_URL=https://api.example.com
```

### Build Project {step}
Run `pnpm build` to compile the project.

### Deploy {step}
Push to production using your deployment pipeline.
:::

### Horizontal Layout {medium-bold}

:::steps {horizontal numbered}
### Setup {step completed}
Initial setup and configuration

### Build {step current}
Compile and package

### Deploy {step}
Push to production
:::

### Syntax & Variants {medium-bold}

```taildown
:::steps {numbered connected}
### Install Dependencies {step completed}
First step is done

### Configure {step current}
Currently working on this

### Deploy {step}
Future step
:::

:::steps {horizontal glass}
Simple horizontal steps
:::
```

**Layouts:** `vertical` (default) `horizontal` `compact`

**Styles:** `numbered` `icons` `connected` (connecting lines)

**States:** `{step}` `{step current}` `{step completed}`

**Visual Variants:** `glass` `elevated` `bordered`

[Back to top](#top){badge primary}

---

## Mark/Highlight Text {#mark large-bold primary}

**Inline text highlighting with semantic colors - like a highlighter pen for your content.**

### What is Mark/Highlight? {medium-bold}

The `==highlighted text==` syntax creates inline text highlighting with semantic color variants. Better than just bold or italic, it provides visual emphasis with meaning.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Semantic Highlighting** - Color conveys meaning
- :icon[check]{success} **Easy Syntax** - Simple `==text==` wrapper
- :icon[check]{success} **Inline Flow** - Works anywhere in text
- :icon[check]{success} **Search Emphasis** - Perfect for highlighting matches
:::

### All Color Variants {medium-bold}

This is ==highlighted text== with default yellow background.

==Important!=={warning} uses orange/red highlighting for warnings.

==Success=={success} uses green highlighting for positive emphasis.

==Critical=={error} uses red highlighting for errors or critical content.

==Note=={info} uses blue highlighting for informational content.

==Featured=={primary} uses the primary brand color.

==Muted=={muted} uses gray for subtle emphasis.

### In Context {medium-bold}

:::card {subtle-glass padded}
**Example Documentation:**

The API uses ==REST=={primary} architecture with ==JSON=={info} payloads. 

:icon[check]{success} ==Recommended=={success}: Use HTTPS for all requests

:icon[alert-triangle]{warning} ==Warning=={warning}: Rate limits apply

:icon[x-circle]{error} ==Deprecated=={error}: Legacy endpoint removed
:::

### Syntax & Variants {medium-bold}

```taildown
==highlighted text== with default yellow

==Important!=={warning} orange/red

==Success=={success} green

==Critical=={error} red

==Note=={info} blue

==Custom=={primary} brand color

==Subtle=={muted} gray
```

**Variants:** `warning` `success` `error` `info` `primary` `muted` (default: yellow)

**Usage:** Wrap text with `==` on both sides, optionally add `{variant}` after

[Back to top](#top){badge primary}

---

# Media Components {#media huge-bold center primary}

**Embed videos and rich media with responsive aspect ratios.**

---

## Video Embed {#video large-bold primary}

**Responsive video embeds for YouTube, Vimeo, and self-hosted videos with aspect ratio preservation.**

### What are Video Embeds? {medium-bold}

The video component creates responsive video embeds with automatic aspect ratio preservation, lazy loading, and platform detection. Works with YouTube, Vimeo, or self-hosted videos.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Responsive** - Maintains aspect ratio on all screens
- :icon[check]{success} **Lazy Loading** - Native browser lazy load support
- :icon[check]{success} **Privacy-Friendly** - YouTube nocookie domain
- :icon[check]{success} **Aspect Ratios** - 16:9, 4:3, 21:9, 1:1
:::

### YouTube Embed {medium-bold}

:::video {youtube glass}
https://youtube.com/watch?v=dQw4w9WgXcQ
:::

### Vimeo Embed {medium-bold}

:::video {vimeo 16:9}
https://vimeo.com/123456789
:::

### Self-Hosted Video {medium-bold}

:::video {16:9 glass}
![Demo Video](demo.mp4)
:::

### Different Aspect Ratios {medium-bold}

**Widescreen (16:9 default):**

:::video {16:9}
https://youtube.com/watch?v=EXAMPLE_ID
:::

**Standard (4:3):**

:::video {4:3}
https://youtube.com/watch?v=EXAMPLE_ID
:::

**Ultrawide (21:9):**

:::video {21:9}
https://youtube.com/watch?v=EXAMPLE_ID
:::

**Square (1:1):**

:::video {1:1}
https://youtube.com/watch?v=EXAMPLE_ID
:::

### Syntax & Variants {medium-bold}

```taildown
:::video {youtube}
https://youtube.com/watch?v=VIDEO_ID
:::

:::video {vimeo glass}
https://vimeo.com/VIDEO_ID
:::

:::video {16:9}
![Video](video.mp4)
:::

:::video {glass autoplay muted loop}
![Background](bg-video.mp4)
:::
```

**Platforms:** `youtube` `vimeo` (auto-detected from URL)

**Aspect Ratios:** `16:9` (default) `4:3` `21:9` `1:1`

**Visual Variants:** `glass` `subtle-glass`

**Attributes:** `autoplay` `muted` `loop` `controls`

[Back to top](#top){badge primary}

---

# Data & Comparison Components {#data huge-bold center primary}

**Professional data presentation and visual comparison tools.**

---

## Enhanced Table {#table large-bold primary}

**GFM tables supercharged with sorting, zebra striping, glass effects, and sticky headers.**

### What are Enhanced Tables? {medium-bold}

Enhanced tables extend GitHub Flavored Markdown tables with professional features like client-side sorting, alternating row colors, glassmorphism effects, and sticky headers. Perfect for data presentation, documentation, and dashboards.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Zero Config** - Works with standard GFM table syntax
- :icon[check]{success} **Interactive Sorting** - Click headers to sort (~1KB JS)
- :icon[check]{success} **Visual Polish** - Zebra striping, glass effects, hover states
- :icon[check]{success} **Mobile Responsive** - Horizontal scrolling with sticky first column
:::

### Live Example - Sortable Table {medium-bold}

Click any header to sort the data:

| Employee | Department | Salary | Performance | Status |
|----------|-----------|--------|-------------|--------|
| Alice Chen | Engineering | $95,000 | Excellent | :badge[Active]{success} |
| Bob Smith | Design | $82,000 | Good | :badge[Active]{success} |
| Charlie Davis | Product | $105,000 | Excellent | :badge[Active]{success} |
| Diana Wilson | Marketing | $78,000 | Very Good | :badge[Active]{success} |
| Eve Martinez | Engineering | $98,000 | Excellent | :badge[Active]{success} |
| Frank Johnson | Sales | $88,000 | Good | :badge[Active]{success} |
{sortable zebra hoverable}

**Try it:** Click on "Salary" to sort by amount, or "Department" to alphabetize!

### Glass Effect Table {medium-bold}

:::card {padded}
| Metric | Q1 2024 | Q2 2024 | Q3 2024 | Growth |
|--------|---------|---------|---------|--------|
| Revenue | $1.2M | $1.5M | $1.8M | :icon[trending-up]{success} +50% |
| Users | 10,500 | 12,300 | 14,800 | :icon[trending-up]{success} +41% |
| Conversion | 3.2% | 3.8% | 4.1% | :icon[trending-up]{success} +28% |
| Churn | 2.1% | 1.8% | 1.5% | :icon[trending-down]{success} -29% |
{glass sticky-header}
:::

### Compact Data Table {medium-bold}

| Setting | Value | Description |
|---------|-------|-------------|
| Version | v2.1.0 | Current release |
| License | MIT | Open source |
| Build | 1,234 | Latest CI run |
| Status | :icon[check-circle]{success} Passing | All tests green |
{compact bordered sm}

### All Variants {medium-bold}

:::grid {2}
:::card {subtle-glass padded}
**Styling Variants:**
- `sortable` - Interactive column sorting
- `zebra` / `striped` - Alternating row colors
- `bordered` - Full cell borders
- `glass` - Glassmorphism effect
- `sticky-header` - Header stays on scroll
- `compact` - Tighter spacing
- `hoverable` - Row hover effects
:::

:::card {subtle-glass padded}
**Size Modifiers:**
- `sm` - Small (0.5rem/0.75rem padding)
- `md` - Medium (default)
- `lg` - Large (1rem/1.25rem padding)

**Combinations:**
```taildown
{sortable zebra hoverable}
{glass sticky-header}
{compact bordered sm}
```
:::
:::

### Syntax & Usage {medium-bold}

```taildown
# Basic sortable table
| Name | Value | Status |
|------|-------|--------|
| Item A | 100 | Active |
| Item B | 200 | Pending |
{sortable}

# Full-featured dashboard table
| Metric | Q1 | Q2 | Q3 |
|--------|-----|-----|-----|
| Revenue | $1.2M | $1.5M | $1.8M |
| Users | 10.5K | 12.3K | 14.8K |
{sortable zebra glass sticky-header hoverable}

# Compact data list
| Key | Value |
|-----|-------|
| API | v2.0 |
| Status | Live |
{compact bordered sm}
```

**Attributes:** Place `{variants}` after the table (last row or separate line)

**Features:**
- :icon[check]{success} **Auto-type Detection** - Sorts strings, numbers, dates correctly
- :icon[check]{success} **Keyboard Accessible** - Enter/Space to trigger sort
- :icon[check]{success} **Visual Indicators** - Sort direction arrows (↑/↓)
- :icon[check]{success} **ARIA Support** - `aria-sort` attributes for screen readers

[Back to top](#top){badge primary}

---

## Image Comparison Slider {#compare-images large-bold primary}

**Interactive before/after image comparisons with draggable slider - perfect for showcasing transformations.**

### What is Image Comparison? {medium-bold}

The image comparison slider creates interactive before/after comparisons with a draggable slider. Perfect for design showcases, photo editing demos, renovation projects, or any visual transformation.

:::card {light-glass padded}
**Key Benefits:**
- :icon[check]{success} **Interactive** - Drag, touch, or keyboard control
- :icon[check]{success} **Zero-Config Beautiful** - Rounded corners and shadows by default
- :icon[check]{success} **Viewport Aware** - Never awkward scrolling on large screens
- :icon[check]{success} **Fully Accessible** - ARIA roles, keyboard navigation, alt text
:::

### Basic Horizontal Example {medium-bold}

:::compare-images {horizontal}
before: https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop
after: https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=450&fit=crop
alt: Office workspace transformation
:::

**Try it:** Click and drag the slider, or use arrow keys!

### With Labels {medium-bold}

:::compare-images {horizontal labels glass}
before: https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=450&fit=crop
after: https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=450&fit=crop
alt: Modern office redesign
:::

### Vertical Comparison {medium-bold}

:::compare-images {vertical labels}
before: https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=600&fit=crop
after: https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop
alt: Design evolution
:::

### Size Variants {medium-bold}

:::grid {2}
:::card {subtle-glass padded}
**Small (280px):**

Perfect for thumbnails or compact comparisons.

:::compare-images {sm labels}
before: https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=450&fit=crop
after: https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop
alt: Small comparison
:::
:::

:::card {subtle-glass padded}
**Large (580px):**

Great for detailed visual comparisons.

:::compare-images {lg labels glass}
before: https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&h=450&fit=crop
after: https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop
alt: Large comparison
:::
:::
:::

### Extra Large Showcase {medium-bold}

:::compare-images {xl labels shadow}
before: https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=1200&h=675&fit=crop
after: https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=675&fit=crop
alt: Portfolio showcase
:::

### All Variants {medium-bold}

:::grid {2}
:::card {subtle-glass padded}
**Orientation:**
- `horizontal` - Left/right comparison (default)
- `vertical` - Top/bottom comparison

**Visual:**
- `labels` - Show "Before" and "After" overlays
- `glass` - Glassmorphism on handle and labels
- `shadow` - Enhanced shadow on handle
:::

:::card {subtle-glass padded}
**Sizes:**
- `sm` - 280px (36px handle)
- `md` - 450px (48px handle, default)
- `lg` - 580px (48px handle)
- `xl` - 700px (56px handle)
- `full` - Full height (400px min)

All sizes respect viewport (no awkward scrolling!)
:::
:::

### Syntax & Usage {medium-bold}

```taildown
# Basic horizontal
:::compare-images {horizontal}
before: https://example.com/before.jpg
after: https://example.com/after.jpg
alt: Workspace transformation
:::

# Vertical with labels
:::compare-images {vertical labels}
before: /images/design-v1.png
after: /images/design-v2.png
beforeAlt: Original design
afterAlt: New design
:::

# Small with glass effect
:::compare-images {sm glass labels}
before: /photos/original.jpg
after: /photos/edited.jpg
alt: Photo editing showcase
:::

# Extra large hero
:::compare-images {xl labels shadow}
before: /portfolio/mockup-before.png
after: /portfolio/mockup-after.png
alt: Website redesign
:::
```

**Required Attributes:**
- `before` - URL to before image
- `after` - URL to after image

**Optional Attributes:**
- `alt` - Alt text for both images
- `beforeAlt` - Specific alt for before image
- `afterAlt` - Specific alt for after image

### Interaction Features {medium-bold}

:::card {elevated padded}
**Mouse/Track Interaction:**
- :icon[mouse-pointer]{primary} Click and drag the handle
- :icon[hand]{success} Entire handle is draggable (not just center!)
- Smooth real-time updates

**Touch Devices:**
- :icon[smartphone]{info} Touch and drag on mobile/tablets
- Works perfectly on all touch screens
- Native touch event handling

**Keyboard Navigation:**
- :icon[keyboard]{warning} Focus the slider with Tab
- :icon[arrow-left]{primary} Left/Up: Move slider left/up (5% steps)
- :icon[arrow-right]{success} Right/Down: Move slider right/down (5% steps)
- Full keyboard accessibility
:::

### Accessibility Features {medium-bold}

:::card {light-glass padded}
**Enterprise-Grade Accessibility:**
- :icon[check]{success} `role="slider"` with ARIA attributes
- :icon[check]{success} `aria-valuenow` updates as slider moves (0-100)
- :icon[check]{success} Keyboard navigation fully supported
- :icon[check]{success} Proper `alt` text for screen readers
- :icon[check]{success} Focus visible indicators
- :icon[check]{success} Screen reader announcements
:::

[Back to top](#top){badge primary}

---

## Mermaid Diagrams {#mermaid large-bold primary}

**Client-side rendered diagrams with zero-overhead tree-shaking.**

:::alert {info}
:icon[zap]{warning} **Tree-Shaken:** 0KB overhead when no diagrams present. ~2.7MB inline UMD bundle only when diagrams detected.
:::

### What are Mermaid Diagrams? {medium-bold}

Mermaid enables you to create diagrams and visualizations using text-based syntax:

```mermaid
graph LR
  A[Start] --> B{Decision}
  B -->|Yes| C[Action 1]
  B -->|No| D[Action 2]
  C --> E[End]
  D --> E
```

### Supported Diagram Types {medium-bold}

:::grid {cols-3}
:::card {subtle-glass padded}
#### :icon[git-branch]{primary} Flow & Process
- Flowcharts
- Sequence Diagrams
- State Machines
- Git Graphs
:::

:::card {subtle-glass padded}
#### :icon[database]{success} Data & Structure
- Class Diagrams
- ER Diagrams
- Pie Charts
- Gantt Charts
:::

:::card {subtle-glass padded}
#### :icon[user]{info} User & Journey
- User Journey Maps
- Timeline Diagrams
:::
:::

### Basic Flowchart {medium-bold}

Simple decision tree:

```mermaid
graph TD
  A[Christmas] -->|Get money| B(Go shopping)
  B --> C{Let me think}
  C -->|One| D[Laptop]
  C -->|Two| E[iPhone]
  C -->|Three| F[Car]
```

### Sequence Diagram {medium-bold}

UML sequence diagram for interactions:

```mermaid {glass}
sequenceDiagram
  participant Alice
  participant Bob
  Alice->>John: Hello John, how are you?
  loop Healthcheck
    John->>John: Fight against hypochondria
  end
  Note right of John: Rational thoughts!
  John-->>Alice: Great!
  John->>Bob: How about you?
  Bob-->>John: Jolly good!
```

### Class Diagram {medium-bold}

Object-oriented structure:

```mermaid
classDiagram
  Animal <|-- Duck
  Animal <|-- Fish
  Animal <|-- Zebra
  Animal : +int age
  Animal : +String gender
  Animal: +isMammal()
  Animal: +mate()
  class Duck{
    +String beakColor
    +swim()
    +quack()
  }
  class Fish{
    -int sizeInFeet
    -canEat()
  }
  class Zebra{
    +bool is_wild
    +run()
  }
```

### State Diagram {medium-bold compact}

State machine visualization:

```mermaid {compact bordered}
stateDiagram-v2
  [*] --> Still
  Still --> [*]
  Still --> Moving
  Moving --> Still
  Moving --> Crash
  Crash --> [*]
```

### Gantt Chart {medium-bold}

Project timeline:

```mermaid {lg}
gantt
  title Project Development Timeline
  dateFormat YYYY-MM-DD
  section Design Phase
  Research & Planning    :a1, 2024-01-01, 30d
  UI/UX Design          :a2, after a1, 20d
  Design Review         :milestone, after a2, 0d
  section Development
  Backend Development    :b1, 2024-02-15, 45d
  Frontend Development   :b2, after b1, 30d
  Integration           :b3, after b2, 15d
  section Testing
  QA Testing            :c1, after b3, 20d
  User Acceptance       :c2, after c1, 10d
  Launch                :milestone, after c2, 0d
```

### Pie Chart {medium-bold}

Data visualization:

```mermaid
pie title Browser Usage
  "Chrome" : 65
  "Firefox" : 15
  "Safari" : 12
  "Edge" : 5
  "Other" : 3
```

### Git Graph {medium-bold}

Branch visualization:

```mermaid
gitGraph
  commit
  commit
  branch develop
  checkout develop
  commit
  commit
  checkout main
  merge develop
  commit
  commit
```

### ER Diagram {medium-bold}

Entity relationships:

```mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
  CUSTOMER {
    string name
    string custNumber
    string sector
  }
  ORDER ||--|{ LINE-ITEM : contains
  ORDER {
    int orderNumber
    string deliveryAddress
  }
  LINE-ITEM {
    string productCode
    int quantity
    float pricePerUnit
  }
```

### User Journey {medium-bold}

Journey map:

```mermaid
journey
  title My working day
  section Go to work
    Make tea: 5: Me
    Go upstairs: 3: Me
    Do work: 1: Me, Cat
  section Go home
    Go downstairs: 5: Me
    Sit down: 5: Me
```

### Styling Variants {medium-bold}

:::grid {cols-2}
:::card {subtle-glass padded}
**Glass Effect:**

```mermaid {glass compact}
graph LR
  A --> B
  B --> C
  C --> A
```
:::

:::card {subtle-glass padded}
**Elevated:**

```mermaid {elevated compact}
graph TD
  Start --> Stop
```
:::
:::

### Size Modifiers {medium-bold}

Control diagram container size:

```taildown
```mermaid {sm}        # Small (max-width: 640px)
```mermaid {md}        # Medium (768px, default)
```mermaid {lg}        # Large (1024px)
```mermaid {xl}        # Extra Large (1280px)
```

### Performance & Features {medium-bold}

:::grid {cols-2}
:::card {light-glass padded}
**Performance:**
- :icon[zap]{warning} Tree-shaken (0KB when unused)
- :icon[package]{success} ~2.7MB inline when used
- :icon[activity]{info} Client-side rendering
- :icon[refresh-cw]{primary} Theme-aware (auto light/dark)
:::

:::card {light-glass padded}
**Features:**
- :icon[check]{success} 9 diagram types
- :icon[check]{success} Standard Mermaid syntax
- :icon[check]{success} SVG output (scalable)
- :icon[check]{success} Professional styling
:::
:::

### Accessibility {medium-bold}

:::card {light-glass padded}
**Enterprise-Grade Accessibility:**
- :icon[check]{success} SVG includes `<title>` and `<desc>` elements
- :icon[check]{success} Semantic container with `role="img"`
- :icon[check]{success} Keyboard navigable focus
- :icon[check]{success} Screen reader compatible
:::

[Back to top](#top){badge primary}

---

## Math Equations {#math large-bold primary}

**Compile-time LaTeX to MathML conversion with zero runtime JavaScript.**

:::alert {info}
:icon[zap]{warning} **Zero Overhead:** MathML is generated at compile time. No JavaScript libraries loaded in browser!
:::

### What are Math Equations? {medium-bold}

Write beautiful mathematical equations using standard LaTeX syntax. Rendered as native MathML for perfect rendering in modern browsers:

**Inline Math:** The quadratic formula $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ is fundamental in algebra.

**Display Math (Centered):**

$$
E = mc^2
$$

### Basic Syntax {medium-bold}

:::grid {cols-2}
:::card {subtle-glass padded}
#### :icon[type]{primary} Inline Math
Use single `$` delimiters for inline equations:

```taildown
Einstein's $E = mc^2$ changed physics.
```

**Result:** Einstein's $E = mc^2$ changed physics.
:::

:::card {subtle-glass padded}
#### :icon[maximize]{success} Display Math
Use double `$$` for centered display equations:

```taildown
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

**Result:**

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
:::
:::

### Common Examples {medium-bold}

#### Greek Letters & Symbols {medium-bold}

Greek letters: $\alpha$, $\beta$, $\gamma$, $\Delta$, $\Sigma$, $\Omega$

Special symbols: $\infty$, $\partial$, $\nabla$, $\approx$, $\neq$, $\leq$, $\geq$

#### Subscripts & Superscripts {medium-bold}

Simple: $x_1$, $x^2$, $x_1^2$

Complex: $x_{i,j}^{n+1}$, $e^{i\pi}$

#### Fractions & Roots {medium-bold}

Fraction: $\frac{numerator}{denominator}$

Roots: $\sqrt{x}$, $\sqrt[3]{x}$, $\sqrt[n]{x}$

#### Summations & Products {medium-bold}

Sum of natural numbers:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

Product notation:

$$
\prod_{i=1}^{n} i = n!
$$

### Advanced Examples {medium-bold}

:::grid {cols-2}
:::card {subtle-glass padded}
#### Calculus

Definition of derivative:

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

Fundamental theorem:

$$
\int_a^b f(x) dx = F(b) - F(a)
$$
:::

:::card {subtle-glass padded}
#### Linear Algebra

Identity matrix:

$$
I = \begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
$$
:::
:::

### Complex Equations {medium-bold}

#### Euler's Identity {medium-bold}

Often called the most beautiful equation in mathematics:

$$
e^{i\pi} + 1 = 0
$$

#### Normal Distribution {medium-bold}

The probability density function:

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

#### Maxwell's Equations {medium-bold}

The foundations of electromagnetism:

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

### Supported LaTeX Features {medium-bold}

:::grid {cols-3}
:::card {subtle-glass padded}
#### :icon[plus]{primary} Basic Operations
- `+`, `-`, `\times`, `\div`
- `\pm`, `\mp`
- `=`, `\neq`
- `<`, `>`, `\leq`, `\geq`
:::

:::card {subtle-glass padded}
#### :icon[code]{success} Functions
- `\frac{a}{b}` - Fractions
- `\sqrt{x}` - Square root
- `\sqrt[n]{x}` - Nth root
- `x^2`, `x_i` - Exponents/subscripts
:::

:::card {subtle-glass padded}
#### :icon[star]{info} Advanced
- `\sum`, `\prod`, `\int`
- `\lim`, `\log`, `\sin`, `\cos`
- `\begin{bmatrix}` - Matrices
- `\begin{aligned}` - Alignment
:::
:::

### Features & Performance {medium-bold}

:::grid {cols-2}
:::card {light-glass padded}
**Performance:**
- :icon[zap]{warning} Zero runtime JavaScript
- :icon[clock]{success} Compile-time conversion
- :icon[feather]{info} Small MathML output
- :icon[check]{success} No external libraries
:::

:::card {light-glass padded}
**Features:**
- :icon[check]{success} Full LaTeX syntax
- :icon[check]{success} Professional math fonts
- :icon[check]{success} Theme-aware colors
- :icon[check]{success} Responsive scaling
:::
:::

### Browser Support {medium-bold}

:::card {light-glass padded}
**Modern Browser Support:**
- :icon[check]{success} Chrome 109+ (native MathML)
- :icon[check]{success} Firefox 78+ (native MathML)
- :icon[check]{success} Safari 14.1+ (native MathML)
- :icon[check]{success} Edge 109+ (native MathML)

**Accessibility:** MathML provides semantic meaning for screen readers, making equations accessible to all users.
:::

### Best Practices {medium-bold}

:::alert {success}
**Tips for Beautiful Math:**

1. Use display math (`$$`) for important equations
2. Use inline math (`$`) for simple formulas in text
3. Break complex equations into multiple lines
4. Use `\begin{aligned}` for equation systems
5. Add spacing with `\,` `\:` `\;` `\quad` where needed
:::

[Back to top](#top){badge primary}

---

## Timeline {#timeline large-bold primary}

**Chronological visualization of events and milestones with state management.**

:::alert {info}
:icon[clock]{info} **Perfect For:** Project roadmaps, company history, process workflows, and event chronologies!
:::

### What is a Timeline? {medium-bold}

Display events in chronological order with visual state indicators and connecting lines. H2 headings automatically become milestones:

:::timeline {compact glass}
## Example Started {completed}
This milestone is marked as completed with a checkmark.

## Currently Here {current}
This milestone is marked as current with a pulsing dot.

## Coming Soon
This milestone has no state (pending by default).
:::

### Basic Syntax {medium-bold}

:::grid {cols-2}
:::card {subtle-glass padded}
#### :icon[file-text]{primary} Structure
```taildown
:::timeline
## Milestone Title {state}

Content for this milestone goes here.

- List items
- More details

## Next Milestone {state}

More content...
:::
```

**H2 headings** become milestones automatically.
:::

:::card {subtle-glass padded}
#### :icon[check-circle]{success} States
Add state markers to milestones:

- `{completed}` - Green checkmark ✓
- `{current}` - Pulsing dot ●
- No marker - Pending ○

```taildown
## Done {completed}
## Active {current}
## Todo
```
:::
:::

### Timeline Variants {medium-bold}

:::grid {cols-3}
:::card {subtle-glass padded center}
:icon[align-left]{primary huge}

**Default (Vertical)**

Left-aligned milestones with connecting line

```taildown
:::timeline
## Milestone 1
:::
```
:::

:::card {subtle-glass padded center}
:icon[align-center]{success huge}

**Centered**

Alternating left/right alignment

```taildown
:::timeline {centered}
## Milestone 1
:::
```
:::

:::card {subtle-glass padded center}
:icon[minimize]{info huge}

**Compact**

Smaller markers, tighter spacing

```taildown
:::timeline {compact}
## Milestone 1
:::
```
:::
:::

### Styling Variants {medium-bold}

:::grid {cols-3}
:::card {subtle-glass padded center}
:icon[droplet]{primary huge}

**Glass Effect**

Glassmorphism on content

```taildown
:::timeline {glass}
## Milestone
:::
```
:::

:::card {subtle-glass padded center}
:icon[box]{success huge}

**Elevated**

Shadow elevation

```taildown
:::timeline {elevated}
## Milestone
:::
```
:::

:::card {subtle-glass padded center}
:icon[square]{warning huge}

**Bordered**

Primary color border

```taildown
:::timeline {bordered}
## Milestone
:::
```
:::
:::

### Project Roadmap Example {medium-bold}

A typical project timeline with phases and current status:

:::timeline {glass}
## Phase 1: Research & Planning {completed}

**Duration:** 4 weeks | **Status:** ✓ Complete

Initial planning and requirements gathering phase.

**Key Deliverables:**
- Requirements document
- User personas
- Technical architecture
- Project timeline

> "Understanding the problem is half the solution"

## Phase 2: Design & Prototyping {completed}

**Duration:** 6 weeks | **Status:** ✓ Complete

Created comprehensive designs and interactive prototypes.

**Achievements:**
- Wireframes for all 20+ screens
- Interactive Figma prototype
- Design system components
- Accessibility guidelines (WCAG 2.1 AA)

**Team:** 3 designers, 1 UX researcher

## Phase 3: Development {current}

**Duration:** 12 weeks | **Status:** 🔄 In Progress (Week 7)

Building core features and functionality.

**Current Sprint Focus:**
- [ ] Backend API development
- [x] Database schema design
- [x] Authentication system
- [x] User management
- [ ] Frontend components
- [ ] Integration tests

**Tech Stack:**
- Next.js 15 + TypeScript
- PostgreSQL + Prisma
- Tailwind CSS
- Vercel deployment

**Progress:** 60% complete

## Phase 4: Testing & QA

**Duration:** 4 weeks | **Status:** ⏳ Upcoming

Comprehensive testing and quality assurance phase.

**Testing Plan:**
- Unit tests (target: 80% coverage)
- Integration tests
- End-to-end tests
- Performance testing
- Security audit
- User acceptance testing

## Phase 5: Launch

**Duration:** 2 weeks | **Status:** ⏳ Planned

Final deployment and go-live.

**Launch Checklist:**
- Production deployment
- DNS configuration
- SSL certificates
- Monitoring setup
- Analytics integration
- Marketing campaign
:::

### Company History Timeline {medium-bold}

Centered layout for alternating presentation:

:::timeline {centered elevated}
## 2020 - Foundation {completed}

Company founded with initial seed funding of $1M.

**Founders:** Alex Kim, Sarah Chen, Michael Rodriguez

**Mission:** Transform how teams collaborate on complex projects.

## 2021 - Product Launch {completed}

Launched MVP and acquired first 100 customers.

**Metrics:**
- 100 paying customers
- $500K ARR
- 4.8/5 customer satisfaction
- Team grew to 15 people

## 2022 - Series A {completed}

Closed $10M Series A led by Accel Partners.

**Achievements:**
- Expanded to 1,000 customers
- $5M ARR
- Opened European office (London)
- Team grew to 45 people
- Launched mobile apps

## 2023 - Expansion {current}

Expanding into EMEA and APAC markets.

**Current Status:**
- 5,000+ customers worldwide
- $25M ARR run rate
- 3 offices (SF, London, Singapore)
- 120 employees
- Launched enterprise tier

## 2024 - IPO Planning

Planning initial public offering.

**Targets:**
- 20,000 customers
- $100M ARR
- Profitable unit economics
- SOC 2 Type II certified
:::

### Daily Schedule Example {medium-bold}

Compact timeline for dense information:

:::timeline {compact}
## 9:00 AM {completed}

**Team Standup Meeting**

Daily sync - 15 minutes

## 10:30 AM {completed}

**Client Presentation**

Q4 roadmap review with Acme Corp

## 12:00 PM {current}

**Lunch Break**

Team lunch at the new cafe

## 2:00 PM

**Code Review Session**

Review PRs from morning work

## 3:30 PM

**1-on-1 with Manager**

Quarterly goal check-in

## 4:00 PM

**Sprint Planning**

Plan next week's sprint
:::

### Process Workflow Timeline {medium-bold}

Timeline for documenting multi-stage processes:

:::timeline {bordered glass}
## Stage 1: Awareness {completed}

**Goal:** Build brand recognition and attract potential customers.

**Tactics:**
- Content marketing (blog, videos)
- Social media campaigns
- SEO optimization
- Conference presence

**KPIs:**
- Website traffic: 50K monthly visitors
- Social followers: 10K+
- Brand mentions: 500+/month

## Stage 2: Interest {completed}

**Goal:** Convert awareness into qualified leads.

**Tactics:**
- Lead magnets (ebooks, webinars)
- Email marketing campaigns
- Retargeting ads
- Free tools and calculators

**KPIs:**
- Email list growth: 1,000/month
- Lead quality score: 7+/10
- Engagement rate: 25%+

## Stage 3: Consideration {current}

**Goal:** Nurture leads and demonstrate value.

**Tactics:**
- Product demos and trials
- Case studies and testimonials
- Comparison guides
- Free consultations

**KPIs:**
- Demo requests: 200/month
- Trial signups: 150/month
- Trial-to-paid: 30%

## Stage 4: Conversion

**Goal:** Close deals and onboard customers.

**Tactics:**
- Sales calls and negotiations
- Custom proposals
- Onboarding support
- Quick wins demonstration

**KPIs:**
- Closed deals: 45/month
- Average deal size: $10K
- Sales cycle: 30 days

## Stage 5: Retention & Advocacy

**Goal:** Keep customers happy and turn them into advocates.

**Tactics:**
- Customer success programs
- Regular check-ins
- Feature updates
- Referral incentives

**KPIs:**
- Churn rate: <5%/year
- NPS score: 50+
- Referrals: 20%
:::

### Features & Best Practices {medium-bold}

:::grid {cols-2}
:::card {light-glass padded}
**Visual Features:**
- :icon[circle]{success} State markers (completed, current, pending)
- :icon[git-branch]{primary} Connecting gradient line
- :icon[circle]{info} Animated pulsing on current
- :icon[layout]{warning} Responsive design
:::

:::card {light-glass padded}
**Best Practices:**
- :icon[check]{success} Use H2 for milestone titles
- :icon[check]{success} Keep titles concise and clear
- :icon[check]{success} Group related content
- :icon[check]{success} Combine glass + elevated for impact
:::

:::card {light-glass padded}
**Use Cases:**
- :icon[briefcase]{primary} Project roadmaps
- :icon[trending-up]{success} Company milestones
- :icon[calendar]{info} Event schedules
- :icon[settings]{warning} Process workflows
:::

:::card {light-glass padded}
**Accessibility:**
- :icon[check]{success} Semantic H3 headings
- :icon[check]{success} ARIA labels on icons
- :icon[check]{success} High contrast markers
- :icon[check]{success} Screen reader friendly
:::
:::

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

:::card {light-glass padded}
### :icon[file-text]{info} Content Components
- :icon[check]{success} **Details** - Progressive disclosure (HTML5)
- :icon[check]{success} **Callout** - Semantic alert boxes
- :icon[check]{success} **Columns** - Multi-column layouts
- :icon[check]{success} **Definitions** - Term-definition pairs
- :icon[check]{success} **Stats** - Prominent metrics display
- :icon[check]{success} **Divider** - Enhanced separators
- :icon[check]{success} **Steps** - Progress indicators
- :icon[check]{success} **Mark** - Text highlighting
:::

:::card {light-glass padded}
### :icon[table]{success} Data & Visualization
- :icon[check]{success} **Enhanced Table** - Sortable, zebra, glass effects
- :icon[check]{success} **Image Comparison** - Interactive before/after slider
- :icon[check]{success} **Mermaid Diagrams** - Flowcharts, sequence, Gantt, and more
- :icon[check]{success} **Math Equations** - LaTeX to MathML conversion
:::

:::card {light-glass padded}
### :icon[video]{accent} Media Components
- :icon[check]{success} **Video** - Responsive video embeds
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
