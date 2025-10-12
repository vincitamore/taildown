# Taildown Language Enhancement Plan {huge-bold center primary}

**Comprehensive roadmap for expanding Taildown's component library and syntax capabilities** {center large-muted}

**Status:** Ready for Implementation :icon[check-circle]{success} | **Timeline:** 8 weeks | **Priority:** High {center}

---

## Executive Summary {large-bold primary}

:::card {heavy-glass padded-xl}
### :icon[target]{primary huge} Implementation Overview {large-bold center}

This document outlines **23 new components and 8 configuration enhancements** to expand Taildown's capabilities while maintaining its core philosophy of zero-config beauty and plain English styling.

**Key Metrics:**
- :icon[package]{success} **23 new components** - Carefully selected for broad utility
- :icon[settings]{accent} **8 config enhancements** - Theme presets, customization, plugins
- :icon[calendar]{warning} **8 weeks total** - Structured in 3 priority tiers
- :icon[code]{primary} **~8,500 lines of code** - Estimated implementation effort
- :icon[zap]{success} **Maintains < 100ms** - Compilation speed targets preserved
:::

---

## Table of Contents {large-bold primary}

:::grid {2}
:::card {subtle-glass padded}
### :icon[map]{primary} Navigation {medium-bold}

- [Design Philosophy](#philosophy)
- [Component Priorities](#priorities)
- [Tier 1: Quick Wins](#tier1)
- [Tier 2: Medium Complexity](#tier2)
- [Tier 3: Advanced Features](#tier3)
:::

:::card {subtle-glass padded}
### :icon[book]{accent} References {medium-bold}

- [Configuration Enhancements](#config)
- [Implementation Guidelines](#guidelines)
- [Technical Specifications](#specs)
- [Success Metrics](#metrics)
:::
:::

---

## Design Philosophy {#philosophy large-bold primary}

:::card {light-glass padded-lg}
### :icon[compass]{primary} Core Principles {medium-bold}

All enhancements MUST align with Taildown's fundamental values:

**1. Zero-Config Beautiful** {bold}
- Every component works perfectly with default settings
- No configuration files required to get started
- Beautiful glassmorphism and animations by default

**2. Plain English First** {bold}
- Natural language syntax: `{large-bold primary}`
- Readable component names: `:::details` not `:::disclosure-widget`
- Self-documenting attributes

**3. Static Output Champion** {bold}
- Compile to pure HTML/CSS/vanilla JS
- No runtime framework dependencies
- 2-8KB JavaScript budget (only for interactive features)
- SEO-friendly, performant

**4. Progressive Enhancement** {bold}
- Works without JavaScript where possible
- Graceful degradation for older browsers
- Accessibility built-in (ARIA, keyboard nav)

**5. Performance Obsessed** {bold}
- Sub-100ms compilation targets
- Tree-shaking for minimal bundles
- GPU-accelerated animations
:::

---

## Component Priority Tiers {#priorities large-bold primary}

:::tabs
## :icon[zap]{warning} Tier 1: Quick Wins

**Timeline:** Week 1-2 (10 days)  
**Effort:** Low to Medium  
**Impact:** High

Components that are technically simple but provide massive value:

| Component | Days | LOC | Impact | JavaScript |
|-----------|------|-----|--------|------------|
| Details/Summary | 1 | 200 | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | None (HTML5) |
| Callout/Admonition | 1 | 180 | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | None |
| Multi-Column | 1 | 150 | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | None |
| Definition List | 1 | 160 | :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} | None |
| Stats/Metrics | 2 | 220 | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | None |
| Inline Badge | 1 | 140 | :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} | None |
| Blockquote Enhanced | 1 | 180 | :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} | None |
| Divider/Separator | 1 | 100 | :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} | None |

**Total:** 9 days, 1,330 LOC, 0KB JavaScript

## :icon[package]{primary} Tier 2: Medium Complexity

**Timeline:** Week 3-5 (15 days)  
**Effort:** Medium  
**Impact:** High to Medium

Components requiring moderate implementation but high value:

| Component | Days | LOC | Impact | JavaScript |
|-----------|------|-----|--------|------------|
| Table Enhanced | 3 | 450 | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | ~1KB (sorting) |
| Image Comparison | 3 | 400 | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | ~2KB (slider) |
| Video Embed | 2 | 280 | :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} | None |
| Code Diff | 3 | 380 | :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} | None |
| Footnotes | 3 | 350 | :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} | ~0.5KB |
| Step Indicator | 2 | 260 | :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} | None |
| Mark/Highlight | 1 | 120 | :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} | None |

**Total:** 17 days, 2,240 LOC, ~3.5KB JavaScript

## :icon[rocket]{success} Tier 3: Advanced Features

**Timeline:** Week 6-8 (15 days)  
**Effort:** High  
**Impact:** Medium (niche use cases)

Sophisticated components for power users:

| Component | Days | LOC | Impact | JavaScript |
|-----------|------|-----|--------|------------|
| Mermaid Diagrams | 5 | 800 | :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} | ~5KB |
| Math Equations | 4 | 600 | :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} | None (MathML) |
| Timeline | 3 | 420 | :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} | None |
| Keyboard Keys | 1 | 150 | :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} | None |
| Task List Enhanced | 2 | 280 | :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} | ~1KB |

**Total:** 15 days, 2,250 LOC, ~6KB JavaScript
:::

---

## Tier 1: Quick Wins (Days 1-10) {#tier1 large-bold primary}

### 1. Details/Summary Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} Highest | **Effort:** 1 day | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Native HTML5 `<details>` element with beautiful Taildown styling. Perfect for progressive disclosure, FAQs, and collapsible content.

**Why This Matters:**
- Zero JavaScript required (native HTML)
- Universal browser support
- Excellent accessibility
- Perfect for documentation
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
:::details {glass open}
**What is Taildown?** {bold}

Taildown is a markup language for 
creating beautiful UIs with plain 
English styling.

[Learn More](#){button primary small}
:::

:::details {subtle-glass}
**How do I install it?**

Installation is simple...
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**HTML Output:**
```html
<details class="details-component glass-effect" open>
  <summary class="details-summary">
    <span class="summary-text">What is Taildown?</span>
    <span class="summary-icon" aria-hidden="true">▶</span>
  </summary>
  <div class="details-content">
    <p>Taildown is a markup language...</p>
    <a href="#" class="button button-primary button-sm">Learn More</a>
  </div>
</details>
```

**Variants:**
- `{glass}` - Glassmorphism effect
- `{elevated}` - Shadow elevation
- `{bordered}` - Border variant
- `{open}` - Open by default

**Attributes:**
- Bold text on first line becomes summary
- All content after becomes details content
- Supports full markdown inside

**Implementation:**
1. Parse `:::details` directive
2. Extract first bold text as summary (or first paragraph)
3. Wrap in `<details>/<summary>` elements
4. Apply styling classes
5. Add chevron icon with CSS rotation on open

**Estimated:** 200 LOC, 0.5 days
:::

---

### 2. Callout/Admonition Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} Highest | **Effort:** 1 day | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Highlighted callout boxes for notes, tips, warnings, and danger alerts. Essential for documentation and technical writing.

**Why This Matters:**
- Standard in all documentation tools
- Clear visual hierarchy
- Semantic meaning
- Improves content scanability
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
:::callout {note}
:icon[info]{primary} **Note:** 
This is additional context.
:::

:::callout {tip glass}
:icon[lightbulb]{warning} **Pro Tip:** 
Use glassmorphism for modern look.
:::

:::callout {warning}
:icon[alert-triangle]{warning} **Warning:** 
This action cannot be undone.
:::

:::callout {danger elevated}
:icon[alert-octagon]{error} **Danger:** 
This will delete all data!
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**HTML Output:**
```html
<div class="callout callout-note glass-effect" role="note">
  <div class="callout-icon">
    <svg><!-- icon --></svg>
  </div>
  <div class="callout-content">
    <strong class="callout-title">Note:</strong>
    <p>This is additional context.</p>
  </div>
</div>
```

**Types:**
- `{note}` - Blue, informational (default)
- `{tip}` - Green, helpful advice
- `{warning}` - Yellow/orange, caution
- `{danger}` - Red, critical alert
- `{success}` - Green, positive
- `{info}` - Blue, neutral

**Styling:**
- Colored left border (4px)
- Background tint matching type
- Icon auto-inserted based on type
- Supports glass effects

**Smart Defaults:**
- Auto-detects icon from content if present
- Bold text becomes title
- Remaining content becomes body

**Implementation:**
1. Parse `:::callout{type}` directive
2. Extract type, default to `note`
3. Auto-insert appropriate icon
4. Apply semantic colors
5. Support glass/elevated variants

**Estimated:** 180 LOC, 0.5 days
:::

---

### 3. Multi-Column Layout {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} Highest | **Effort:** 1 day | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

CSS multi-column layout for magazine-style text flow. Content automatically reflows between columns.

**Why This Matters:**
- Professional magazine layouts
- Better text readability (shorter lines)
- Space-efficient for long content
- Responsive by default
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
:::columns {2}
Lorem ipsum dolor sit amet, 
consectetur adipiscing elit. Text 
flows naturally between columns 
like a magazine. Supported by all 
modern browsers with CSS columns.

Paragraphs, lists, and images all 
work seamlessly in multi-column 
layouts.
:::

:::columns {3 gap-lg}
Three column layout with large 
gap between columns for better 
visual separation.
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**CSS Output:**
```css
.columns-2 {
  column-count: 2;
  column-gap: 2rem;
  column-rule: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .columns-2 { column-count: 1; }
}
```

**Variants:**
- `{2}` - 2 columns (default)
- `{3}` - 3 columns
- `{4}` - 4 columns
- `{auto}` - Auto-fit based on width

**Gap Control:**
- `{gap-sm}` - Small gap (1rem)
- `{gap}` - Default gap (2rem)
- `{gap-lg}` - Large gap (3rem)

**Responsive:**
- Mobile: Always 1 column
- Tablet: Reduces column count
- Desktop: Full column count

**Features:**
- Automatic text reflow
- Optional column divider line
- Break-inside: avoid on headings
- Balance columns for even height

**Implementation:**
1. Parse `:::columns{count}` directive
2. Apply CSS column properties
3. Add responsive breakpoints
4. Handle gap variants
5. Prevent awkward breaks

**Estimated:** 150 LOC, 0.5 days
:::

---

### 4. Definition List Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} High | **Effort:** 1 day | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Semantic `<dl>` element with beautiful styling. Perfect for glossaries, API parameters, and key-value documentation.

**Why This Matters:**
- Semantic HTML for term definitions
- Perfect for API docs
- Better than tables for metadata
- Excellent accessibility
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
:::definitions {glass}
**API Key** {term}
: A unique identifier for authentication

**Base URL** {term}
: https://api.example.com/v1

**Rate Limit** {term}
: 1000 requests per hour per key
:::

:::definitions {horizontal}
**Name:** John Doe
**Email:** john@example.com
**Role:** Developer
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**HTML Output:**
```html
<dl class="definitions glass-effect">
  <div class="definition-item">
    <dt class="definition-term">API Key</dt>
    <dd class="definition-description">
      A unique identifier for authentication
    </dd>
  </div>
  <!-- more items -->
</dl>
```

**Layouts:**
- `{vertical}` - Stacked (default)
- `{horizontal}` - Side-by-side (grid)
- `{compact}` - Tighter spacing

**Parsing:**
- Bold text = term (`<dt>`)
- Text after `:` = definition (`<dd>`)
- Alternative: `**Term** {term}` explicit marker

**Styling:**
- Terms in bold, slight color emphasis
- Definitions with left padding
- Optional separator lines
- Glass/elevated variants

**Implementation:**
1. Parse `:::definitions` directive
2. Identify terms (bold or `{term}`)
3. Pair with following content
4. Wrap in semantic `<dl>` structure
5. Apply layout variant

**Estimated:** 160 LOC, 0.5 days
:::

---

### 5. Stats/Metrics Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} Highest | **Effort:** 2 days | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Large, prominent statistics display for landing pages and dashboards. Numbers with labels and optional icons.

**Why This Matters:**
- Essential for SaaS landing pages
- Social proof and metrics
- High visual impact
- Scannable information
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

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

:::stats {4 glass}
**1M+** {stat primary}
Downloads

**150** {stat success}
Contributors

**5★** {stat warning}
Rating

**24/7** {stat info}
Support
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**HTML Output:**
```html
<div class="stats-grid cols-3">
  <div class="stat-item glass-effect">
    <div class="stat-icon">
      <svg><!-- icon --></svg>
    </div>
    <div class="stat-value">10,000+</div>
    <div class="stat-label">Active Users</div>
  </div>
  <!-- more stats -->
</div>
```

**Variants:**
- `{2}`, `{3}`, `{4}` - Column count
- `{glass}`, `{elevated}` - Card style
- `{compact}` - Smaller spacing

**Color Options:**
- `{primary}`, `{success}`, `{warning}`, `{info}`
- Applied to stat value

**Parsing:**
- Heading (h3 or bold) with `{stat}` = value
- Icon (if present) displays above
- Following text = label
- Auto-responsive grid

**Styling:**
- Huge stat numbers (3xl-4xl)
- Centered alignment
- Icon + value + label stack
- Glass cards with hover effects

**Implementation:**
1. Parse `:::stats{count}` directive
2. Identify stat markers in headings
3. Extract icon, value, label
4. Generate grid layout
5. Apply responsive breakpoints
6. Add hover animations

**Estimated:** 220 LOC, 1 day
:::

---

### 6. Inline Badge (Already Exists!) {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} High | **Effort:** 1 day | **JavaScript:** None

:::alert {success}
:icon[check-circle]{success} **Good News:** This is already implemented in the syntax spec (SYNTAX.md §2.6A)!

We just need to ensure it's fully implemented in the compiler and add comprehensive tests.
:::

:::card {light-glass padded}
#### :icon[code]{accent} Current Syntax

```taildown
Project Status: :badge[active]{success}
Version: :badge[v2.1.0]{info}
License: :badge[MIT]{primary}

Features: :badge[new]{warning} :badge[beta]{info} :badge[deprecated]{error}
```

**Implementation Tasks:**
1. Verify parser handles `:badge[]` syntax
2. Add variant resolver (success, warning, error, etc.)
3. Add size variants (sm, md, lg)
4. Create comprehensive tests
5. Update examples

**Estimated:** 140 LOC (if not fully done), 0.5 days
:::

---

### 7. Blockquote Enhanced {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} High | **Effort:** 1 day | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Enhanced blockquotes with attribution, citations, and pull-quote styling. Goes beyond basic markdown `>` syntax.

**Why This Matters:**
- Professional content presentation
- Proper attribution and citations
- Pull quotes for emphasis
- Testimonials and reviews
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
> This is a standard blockquote
> with regular styling.

> This is a pull quote that stands
> out with larger text and borders.
{pull-quote primary}

> The best design tool I've used.
> 
> — Sarah Chen, Lead Designer
> Company Name
{testimonial glass}

> Reference text for citations.
> 
> [Source](#) {cite}
{bordered}
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Variants:**
- `{pull-quote}` - Large, centered, emphasized
- `{testimonial}` - With attribution styling
- `{bordered}` - Heavy border left
- `{glass}` - Glassmorphism effect

**Attribution Detection:**
- Lines starting with `—` or `–` = attribution
- Following line (if not citation) = source/title
- `[text](#){cite}` = citation link

**Styling Enhancements:**
- Larger quote marks (decorative)
- Colored left border (semantic)
- Author styling (italic, muted)
- Glass background option
- Pull quotes: 1.5x text size, centered

**Implementation:**
1. Enhance blockquote parser
2. Detect variant attributes
3. Parse attribution patterns
4. Apply enhanced styling
5. Support nesting and citations

**Estimated:** 180 LOC, 1 day
:::

---

### 8. Divider/Separator Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} Medium | **Effort:** 1 day | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Enhanced horizontal rules with text, icons, and decorative styles. More expressive than markdown `---`.

**Why This Matters:**
- Visual section breaks
- Decorative content separation
- Branded styling options
- Better than plain `<hr>`
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
---
Standard horizontal rule

::: divider
Simple divider component
:::

::: divider {icon}
:icon[star]{warning}
:::

::: divider {text}
Section Break
:::

::: divider {gradient primary}
Gradient divider
:::

::: divider {dots}
Dotted decorative line
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Variants:**
- `{text}` - Text in center
- `{icon}` - Icon in center
- `{gradient}` - Gradient line
- `{dots}` - Dotted/dashed
- `{thick}` - Thicker line

**Colors:**
- `{primary}`, `{accent}`, `{muted}`
- Applied to line/text/icon

**Decorative Options:**
- `{wavy}` - Wavy line
- `{dashed}` - Dashed line
- `{double}` - Double line

**Implementation:**
1. Parse `:::divider` or enhance `---`
2. Detect content (text/icon)
3. Apply styling variant
4. Generate semantic `<hr>` or `<div>`
5. Add decorative CSS

**Estimated:** 100 LOC, 0.5 days
:::

---

## Tier 2: Medium Complexity (Days 11-27) {#tier2 large-bold primary}

### 9. Table Enhanced {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} Highest | **Effort:** 3 days | **JavaScript:** ~1KB

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Enhanced markdown tables with sorting, filtering, sticky headers, zebra stripes, and cell alignment controls.

**Why This Matters:**
- Tables are everywhere in docs
- Sorting improves usability
- Mobile-responsive tables needed
- Professional data presentation
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
| Name | Role | Status |
|------|------|--------|
| Alice | Dev | Active |
| Bob | Designer | Away |
{sortable zebra}

| Metric | Value | Change |
|--------|------:|-------:|
| Users | 1,250 | +15% |
| Revenue | $45k | +8% |
{glass sticky-header}
```

Right-align with `------:` (existing GFM)
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Variants:**
- `{sortable}` - Clickable headers to sort (requires JS)
- `{zebra}` - Alternating row colors
- `{bordered}` - Cell borders
- `{glass}` - Glassmorphism effect
- `{sticky-header}` - Header stays on scroll
- `{compact}` - Tighter spacing

**Mobile Responsive:**
- Cards on mobile (stacked layout)
- Horizontal scroll with shadow indicators
- Pinned first column option

**Sorting (Optional JS):**
```javascript
// ~1KB behavior
function tableSortBehavior() {
  document.querySelectorAll('[data-component="table-sortable"]').forEach(table => {
    const headers = table.querySelectorAll('th[data-sortable]');
    headers.forEach(header => {
      header.addEventListener('click', () => sortTable(table, header));
    });
  });
}
```

**Implementation:**
1. Enhance table parser (already exists for GFM)
2. Add attribute detection
3. Generate data attributes for JS hooks
4. Create responsive CSS
5. Implement sort behavior (optional)
6. Add sticky header CSS

**Estimated:** 450 LOC, 3 days
:::

---

### 10. Image Comparison Slider {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning} Highest | **Effort:** 3 days | **JavaScript:** ~2KB

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Before/after image comparison with draggable slider. Essential for showcasing design changes, edits, and transformations.

**Why This Matters:**
- Visual before/after comparisons
- Design portfolios and case studies
- Image editing showcases
- Product comparisons
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
:::compare-images
![Before](before.jpg)
![After](after.jpg)
:::

:::compare-images {vertical}
![Original](original.jpg)
![Edited](edited.jpg)
:::

:::compare-images {glass label}
![Dark Mode](dark.jpg){label="Dark"}
![Light Mode](light.jpg){label="Light"}
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Variants:**
- `{horizontal}` - Horizontal slider (default)
- `{vertical}` - Vertical slider
- `{label}` - Show image labels
- `{glass}` - Glassmorphism slider handle

**Features:**
- Draggable slider handle
- Touch support (mobile)
- Keyboard navigation (arrow keys)
- Customizable starting position (default: 50%)

**JavaScript Behavior (~2KB):**
```javascript
function compareImagesBehavior() {
  const sliders = document.querySelectorAll('[data-component="image-compare"]');
  sliders.forEach(slider => {
    const handle = slider.querySelector('.compare-handle');
    let isDragging = false;
    
    handle.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(slider, e.clientX);
    });
    document.addEventListener('mouseup', () => isDragging = false);
    
    // Touch support
    handle.addEventListener('touchstart', handleTouchStart);
    handle.addEventListener('touchmove', handleTouchMove);
  });
}
```

**HTML Structure:**
```html
<div class="image-compare" data-component="image-compare">
  <div class="compare-before">
    <img src="before.jpg" alt="Before">
  </div>
  <div class="compare-after" style="clip-path: inset(0 50% 0 0);">
    <img src="after.jpg" alt="After">
  </div>
  <div class="compare-handle" style="left: 50%">
    <div class="handle-icon"></div>
  </div>
</div>
```

**Implementation:**
1. Parse `:::compare-images` directive
2. Extract two images
3. Generate comparison HTML structure
4. Implement drag behavior
5. Add touch support
6. Create styled handle with icon
7. Support vertical orientation

**Estimated:** 400 LOC, 3 days
:::

---

### 11. Video Embed Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} High | **Effort:** 2 days | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Responsive video embeds for YouTube, Vimeo, and self-hosted videos with aspect ratio preservation and lazy loading.

**Why This Matters:**
- Videos are essential for modern docs
- Responsive embedding is tricky
- Privacy-friendly (no tracking)
- Lazy loading for performance
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

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

:::video {glass autoplay muted}
![Demo](demo.mp4)
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Platforms:**
- `{youtube}` - YouTube embed
- `{vimeo}` - Vimeo embed  
- Self-hosted videos via image syntax

**Aspect Ratios:**
- `{16:9}` - Widescreen (default)
- `{4:3}` - Standard
- `{21:9}` - Ultrawide
- `{1:1}` - Square

**Features:**
- Privacy mode (no cookies) for YouTube
- Lazy loading (native `loading="lazy"`)
- Responsive iframe/video scaling
- Play button overlay (custom)
- Glass frame option

**Parsing:**
- Detect YouTube/Vimeo URLs
- Extract video IDs
- Or parse markdown image for self-hosted
- Apply aspect ratio wrapper

**HTML Output (YouTube):**
```html
<div class="video-embed aspect-16-9 glass-effect">
  <iframe 
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>
```

**Implementation:**
1. Parse `:::video` directive
2. Detect platform from URL or explicit attr
3. Extract video ID from URL
4. Generate responsive wrapper with aspect ratio
5. Create iframe or `<video>` element
6. Add lazy loading
7. Support glass styling

**Estimated:** 280 LOC, 2 days
:::

---

### 12. Code Diff Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} High | **Effort:** 3 days | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Side-by-side or unified code diffs showing additions, deletions, and changes. Essential for changelogs and documentation.

**Why This Matters:**
- Show code before/after
- Migration guides
- Changelogs and releases
- Git-style diffs for clarity
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

````taildown
:::diff {javascript}
```before
function oldCode() {
  return 'old';
}
```

```after
function newCode() {
  return 'new and improved';
}
```
:::

:::diff {unified}
```javascript
  function example() {
-   console.log('removed');
+   console.log('added');
    return true;
  }
```
:::
````
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Layouts:**
- `{side-by-side}` - Two panes (default)
- `{unified}` - Single pane with +/- markers

**Diff Markers:**
- Lines starting with `-` = removed (red background)
- Lines starting with `+` = added (green background)
- Lines without marker = unchanged

**Features:**
- Syntax highlighting (via Prism)
- Line numbers
- Copy buttons on each side
- Synchronized scrolling (side-by-side)

**Parsing:**
- Two code blocks in ` ```before ` and ` ```after `
- Or single block with `+`/`-` prefixes
- Language detection from fence or component attr

**HTML Output:**
```html
<div class="code-diff side-by-side">
  <div class="diff-before">
    <pre><code class="language-javascript">
      <span class="diff-line removed">- old code</span>
    </code></pre>
  </div>
  <div class="diff-after">
    <pre><code class="language-javascript">
      <span class="diff-line added">+ new code</span>
    </code></pre>
  </div>
</div>
```

**CSS Styling:**
- Red tint for removed lines
- Green tint for added lines
- Side-by-side 50/50 split
- Unified diff: full width with colored stripe

**Implementation:**
1. Parse `:::diff` directive
2. Detect layout (side-by-side or unified)
3. Extract code blocks or parse +/- markers
4. Apply syntax highlighting
5. Wrap in diff HTML structure
6. Style removed/added lines
7. Add synchronized scroll (side-by-side)

**Estimated:** 380 LOC, 3 days
:::

---

### 13. Footnotes System {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} High | **Effort:** 3 days | **JavaScript:** ~0.5KB

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Inline footnote references with automatic numbering and backlinks. Essential for academic writing and thorough documentation.

**Why This Matters:**
- Academic and technical writing standard
- Citations and references
- Additional context without clutter
- Professional documentation
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
This is a statement that needs 
citation[^1] and another one[^2].

You can also use inline 
footnotes^[This is the footnote 
content inline].

[^1]: First footnote with full 
citation and link.

[^2]: Second footnote with 
additional context.
```

Footnotes automatically rendered at 
end of document with backlinks.
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Syntax Support:**
- `[^id]` - Footnote reference
- `[^id]: content` - Footnote definition
- `^[content]` - Inline footnote

**Auto-Numbering:**
- References numbered sequentially
- IDs can be any identifier
- Numbers appear in order of reference

**Features:**
- Backlinks to reference location
- Hover preview (optional JS, ~0.5KB)
- Separator line before footnote section
- Semantic HTML (`<sup>`, `role="doc-footnote"`)

**HTML Output:**
```html
<p>
  This is a statement
  <sup id="fnref-1">
    <a href="#fn-1" class="footnote-ref">1</a>
  </sup>
</p>

<section class="footnotes" role="doc-endnotes">
  <hr class="footnotes-separator">
  <ol>
    <li id="fn-1" role="doc-endnote">
      <p>First footnote content
        <a href="#fnref-1" class="footnote-backref">↩</a>
      </p>
    </li>
  </ol>
</section>
```

**Optional Hover Preview (JS):**
```javascript
// ~0.5KB
function footnoteHoverBehavior() {
  document.querySelectorAll('.footnote-ref').forEach(ref => {
    ref.addEventListener('mouseenter', showFootnotePreview);
    ref.addEventListener('mouseleave', hideFootnotePreview);
  });
}
```

**Implementation:**
1. Scan document for `[^id]` references
2. Collect all `[^id]: definition` blocks
3. Auto-number in order of appearance
4. Generate reference superscripts
5. Create footnotes section at document end
6. Add backlinks
7. Implement optional hover preview

**Estimated:** 350 LOC, 3 days
:::

---

### 14. Step Indicator Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} Medium | **Effort:** 2 days | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Visual progress indicator for multi-step processes, tutorials, and onboarding flows.

**Why This Matters:**
- Guides and tutorials
- Installation instructions
- Multi-step forms documentation
- Visual progress tracking
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
:::steps {numbered}
### Install Dependencies {step}
Run `pnpm install` to install.

### Configure {step current}
Create config file.

### Deploy {step}
Push to production.
:::

:::steps {horizontal glass}
**Step 1:** Setup
**Step 2:** Build  
**Step 3:** Deploy
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Layouts:**
- `{vertical}` - Stacked steps (default)
- `{horizontal}` - Side-by-side steps
- `{compact}` - Minimal spacing

**Styling:**
- `{numbered}` - Shows step numbers
- `{icons}` - Custom icons per step
- `{connected}` - Lines connecting steps

**States:**
- `{current}` - Highlighted current step
- `{completed}` - Checkmark and different color
- Default - Future/pending step

**Features:**
- Auto-numbering (1, 2, 3...)
- Connecting lines between steps
- Glass cards for each step
- Responsive (horizontal → vertical on mobile)

**HTML Structure:**
```html
<div class="steps steps-vertical glass-effect">
  <div class="step step-completed">
    <div class="step-indicator">
      <span class="step-number">1</span>
    </div>
    <div class="step-content">
      <h3>Install Dependencies</h3>
      <p>Run pnpm install...</p>
    </div>
  </div>
  <div class="step-connector"></div>
  <div class="step step-current">
    <!-- ... -->
  </div>
</div>
```

**Implementation:**
1. Parse `:::steps` directive
2. Identify step markers (headings with `{step}`)
3. Auto-number steps
4. Detect state attributes (current, completed)
5. Generate step indicators
6. Add connecting lines
7. Apply responsive layout

**Estimated:** 260 LOC, 2 days
:::

---

### 15. Mark/Highlight Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} Medium | **Effort:** 1 day | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Inline text highlighting with semantic colors. Like a highlighter pen for your content.

**Why This Matters:**
- Emphasis and attention
- Semantic highlighting (success, warning, error)
- Better than just bold/italic
- Search result highlighting
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
This is ==highlighted text== with 
default yellow background.

==Important!== {warning} uses 
orange/red highlighting.

==Success== {success} uses green.

==Critical== {error} uses red.

==Note== {info} uses blue.

You can also use ==custom colors== 
{primary} or ==muted== {muted}.
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Syntax:**
- `==text==` - Yellow highlight (default)
- `==text=={variant}` - Colored highlight

**Variants:**
- `{warning}` - Orange/yellow
- `{success}` - Green
- `{error}` - Red  
- `{info}` - Blue
- `{primary}` - Brand color
- `{muted}` - Gray

**HTML Output:**
```html
<mark class="highlight highlight-warning">
  Important!
</mark>
```

**Styling:**
- Subtle background color
- Slightly darker text
- Padding and rounded corners (optional)
- Maintains text flow

**Alternative Syntax:**
- `:mark[text]{variant}` - Component-style syntax
- `<mark>text</mark>` - Raw HTML passthrough

**Implementation:**
1. Add `==text==` to inline parser
2. Extract variant attribute if present
3. Generate `<mark>` element
4. Apply semantic color class
5. Support nesting and combinations

**Estimated:** 120 LOC, 0.5 days
:::

---

## Tier 3: Advanced Features (Days 28-42) {#tier3 large-bold primary}

### 16. Mermaid Diagram Support {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{muted} High (niche) | **Effort:** 5 days | **JavaScript:** ~5KB

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Render Mermaid.js diagrams from code blocks. Flowcharts, sequence diagrams, gantt charts, and more.

**Why This Matters:**
- Technical documentation essential
- Visual diagrams from text
- Version-controllable diagrams
- No external tools needed
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

````taildown
```mermaid
graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Success]
  B -->|No| D[Error]
  C --> E[End]
  D --> E
```

```mermaid {glass}
sequenceDiagram
  Alice->>Bob: Hello
  Bob->>Alice: Hi there!
```
````
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Diagram Types:**
- Flowchart
- Sequence diagram
- Class diagram
- State diagram
- Gantt chart
- Pie chart
- Git graph

**Implementation Options:**

**Option A: Server-side (Compile Time)**
- Use `@mermaid-js/mermaid-cli` during compilation
- Generate SVG at build time
- Embed inline or as image
- No runtime JavaScript needed
- **Pros:** Zero client JS, faster page load
- **Cons:** Requires Node.js, build-time dependency

**Option B: Client-side (Runtime)**
- Include minimal Mermaid runtime (~5KB)
- Render on page load
- More flexible (can be dynamic)
- **Pros:** Simpler build, works in browser-only editor
- **Cons:** +5KB JavaScript

**Recommendation:** Option A for static compilation, Option B for live editor.

**HTML Output (Server-side):**
```html
<div class="mermaid-diagram glass-effect">
  <svg><!-- Mermaid SVG inline --></svg>
</div>
```

**HTML Output (Client-side):**
```html
<div class="mermaid" data-component="mermaid">
graph TD
  A[Start] --> B{Decision}
</div>
```

**Implementation:**
1. Detect ` ```mermaid ` code blocks
2. Extract diagram code
3. **Server-side:** Run through Mermaid CLI
4. **Client-side:** Mark for runtime rendering
5. Apply glass/elevated styling
6. Support theme variants (light/dark)
7. Responsive SVG scaling

**Estimated:** 800 LOC (including integration), 5 days
:::

---

### 17. Math Equations (LaTeX) {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} Medium (niche) | **Effort:** 4 days | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Render LaTeX math equations using MathML (native browser support) or KaTeX. Inline and display math.

**Why This Matters:**
- Academic and scientific docs
- Technical specifications
- Mathematical notation
- No images needed
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
Inline math: $E = mc^2$ in text.

Display math:
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$

Block equation:
$$
\begin{align}
  f(x) &= ax^2 + bx + c \\
  g(x) &= \sqrt{x + 1}
\end{align}
$$
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Syntax:**
- `$...$` - Inline math
- `$$...$$` - Display math block

**Implementation Options:**

**Option A: MathML (Native)**
- Convert LaTeX → MathML at compile time
- Use `temml` or similar library
- Native browser rendering
- Zero JavaScript
- **Pros:** No runtime dependency, accessible
- **Cons:** Browser support varies, complex conversion

**Option B: KaTeX (Client-side)**
- Include KaTeX JS/CSS (~5KB)
- Render at page load
- Better browser support
- **Pros:** Consistent rendering, mature library
- **Cons:** +5KB overhead

**Recommendation:** Option A (MathML) for modern browsers, fallback to Option B if needed.

**HTML Output (MathML):**
```html
<p>Inline math: <math><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></math></p>

<div class="math-display">
  <math display="block">
    <!-- Complex MathML structure -->
  </math>
</div>
```

**Implementation:**
1. Detect `$` and `$$` delimiters
2. Extract LaTeX code
3. Convert to MathML using temml
4. Embed in HTML
5. Style with CSS (centering, sizing)
6. Support line breaks and alignment

**Estimated:** 600 LOC (including LaTeX parser integration), 4 days
:::

---

### 18. Timeline Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} Medium | **Effort:** 3 days | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Vertical timeline for chronological content, project milestones, and history. Visual storytelling component.

**Why This Matters:**
- Company history pages
- Project roadmaps
- Event chronology
- Visual progress display
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
:::timeline {glass}
### 2020 {milestone}
:icon[flag]{primary}
**Company Founded**
Started with vision for better docs.

### 2021 {milestone}
:icon[rocket]{success}
**First Release**
v1.0 launched to positive reviews.

### 2023 {milestone current}
:icon[star]{warning}
**Major Update**
v2.0 with new features.

### 2024 {milestone}
:icon[target]{info}
**Future Goals**
Continued expansion.
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Layouts:**
- `{vertical}` - Vertical timeline (default)
- `{centered}` - Alternating left/right
- `{compact}` - Tighter spacing

**Markers:**
- Heading = date/title
- Icon = milestone marker
- Bold text = event title
- Following content = description

**States:**
- `{current}` - Highlighted current milestone
- `{completed}` - Past milestones (checkmark)
- Default - Future milestones

**Styling:**
- Vertical line connecting milestones
- Circular markers with icons
- Glass cards for each entry
- Alternating alignment (centered mode)

**HTML Structure:**
```html
<div class="timeline timeline-vertical glass-effect">
  <div class="timeline-item timeline-current">
    <div class="timeline-marker">
      <svg><!-- icon --></svg>
    </div>
    <div class="timeline-content">
      <div class="timeline-date">2023</div>
      <h3 class="timeline-title">Major Update</h3>
      <p>v2.0 with new features.</p>
    </div>
  </div>
  <!-- more items -->
</div>
```

**Implementation:**
1. Parse `:::timeline` directive
2. Identify milestones (headings with `{milestone}`)
3. Extract icon, date, title, content
4. Generate timeline HTML structure
5. Style vertical line and markers
6. Support alternating layout
7. Add state styling (current, completed)

**Estimated:** 420 LOC, 3 days
:::

---

### 19. Keyboard Key Component {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} Medium | **Effort:** 1 day | **JavaScript:** None

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Styled keyboard key indicators for shortcuts and commands. Essential for software documentation.

**Why This Matters:**
- Software documentation standard
- Shortcut references
- Tutorial instructions
- Professional appearance
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
Press :kbd[Ctrl] + :kbd[S] to save.

Use :kbd[Cmd]{mac} + :kbd[K] for 
command palette.

Shortcut: :kbd[Ctrl + Shift + P]

Arrow keys: :kbd[↑] :kbd[↓] :kbd[←] :kbd[→]

Function keys: :kbd[F1] :kbd[F12]
```

HTML `<kbd>` element with styling.
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**Syntax:**
- `:kbd[key]` - Single key
- `:kbd[Mod1 + Mod2 + Key]` - Combination
- Auto-detects `+` for combos

**Variants:**
- `{mac}` - Mac-style keys (⌘, ⌥, ⌃)
- `{windows}` - Windows-style keys
- Default - Generic styling

**Symbol Replacements:**
- `Ctrl` → Ctrl or ⌃
- `Cmd` → ⌘
- `Alt` → Alt or ⌥
- `Shift` → ⇧
- `Enter` → ⏎

**Styling:**
- 3D key appearance
- Box shadow for depth
- Monospace font
- Subtle gradient
- Rounded corners

**HTML Output:**
```html
<kbd class="keyboard-key">
  Ctrl
</kbd>
<span class="key-separator">+</span>
<kbd class="keyboard-key">
  S
</kbd>
```

**CSS Styling:**
```css
.keyboard-key {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  box-shadow: 
    0 1px 0 rgba(0, 0, 0, 0.1),
    0 0 0 2px var(--bg-primary) inset;
  background: linear-gradient(to bottom, 
    var(--bg-secondary), var(--bg-tertiary));
}
```

**Implementation:**
1. Add `:kbd[]` to inline parser
2. Parse key combinations (split on `+`)
3. Replace symbols based on platform
4. Generate `<kbd>` elements
5. Add separators between keys
6. Apply 3D styling

**Estimated:** 150 LOC, 1 day
:::

---

### 20. Task List Enhanced {medium-bold}

**Priority:** :icon[star]{warning}:icon[star]{muted}:icon[star]{muted} Medium | **Effort:** 2 days | **JavaScript:** ~1KB

:::grid {2}
:::card {light-glass padded}
#### :icon[info]{primary} Description

Enhanced task lists with priorities, assignees, and progress tracking. Better than basic GFM `- [ ]` checkboxes.

**Why This Matters:**
- Project planning docs
- TODO lists in documentation
- Sprint planning
- Feature tracking
:::

:::card {light-glass padded}
#### :icon[code]{accent} Proposed Syntax

```taildown
- [ ] Basic task
- [x] Completed task
- [ ] {high} High priority task
- [x] {low} Low priority completed
- [ ] @john Assigned to John
- [ ] {in-progress} Task in progress

:::tasks {glass}
- [x] Phase 1 completed
- [ ] {high} Phase 2 in progress
- [ ] {medium} @sarah Phase 3 planned
- [ ] {low} Phase 4 future work
:::
```
:::
:::

:::card {elevated padded}
#### :icon[settings]{success} Technical Specifications

**GFM Compatibility:**
- `- [ ]` - Unchecked (standard)
- `- [x]` - Checked (standard)
- Additional: `- [~]` - In progress
- Additional: `- [-]` - Blocked/cancelled

**Priority Markers:**
- `{high}` - Red, urgent
- `{medium}` - Orange, important
- `{low}` - Blue, when possible
- Auto-colored indicators

**Assignment:**
- `@username` - Assigned person
- Shows avatar or initials
- Multiple assignees: `@john @sarah`

**Interactive (Optional JS ~1KB):**
- Click checkbox to toggle
- Updates localStorage
- Visual progress bar

**HTML Structure:**
```html
<ul class="task-list glass-effect">
  <li class="task-item task-high task-incomplete">
    <label class="task-checkbox">
      <input type="checkbox">
      <span class="checkbox-icon"></span>
    </label>
    <span class="task-priority high">HIGH</span>
    <span class="task-text">Phase 2 in progress</span>
  </li>
</ul>
```

**Optional JS Behavior:**
```javascript
// ~1KB
function taskListBehavior() {
  document.querySelectorAll('.task-list input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const item = e.target.closest('.task-item');
      item.classList.toggle('task-complete', e.target.checked);
      updateProgress();
      saveToLocalStorage();
    });
  });
}
```

**Implementation:**
1. Extend GFM task list parser
2. Detect priority markers `{high/medium/low}`
3. Extract assignees `@username`
4. Detect state markers `[~]`, `[-]`
5. Generate enhanced HTML structure
6. Style priorities with colors
7. Add optional interactive behavior
8. Show progress bar for task groups

**Estimated:** 280 LOC, 2 days
:::

---

## Configuration Enhancements {#config large-bold primary}

Beyond components, these configuration improvements will significantly enhance Taildown's flexibility while maintaining zero-config defaults.

### 1. Theme Presets System {medium-bold}

:::grid {2}
:::card {light-glass padded}
#### :icon[palette]{primary} Feature Description

Pre-built theme configurations users can apply instantly. Professional color schemes for different use cases.

**Implementation:**
```javascript
// taildown.config.js
export default {
  theme: 'ocean', // or 'forest', 'sunset', 'mono'
  
  // Or customize
  theme: {
    preset: 'ocean',
    extend: {
      colors: {
        primary: '#custom'
      }
    }
  }
}
```
:::

:::card {subtle-glass padded}
#### :icon[check]{success} Built-in Presets

**Ocean** (default)
- Primary: Blue #3b82f6
- Secondary: Cyan #06b6d4
- Accent: Teal #14b8a6

**Forest**
- Primary: Green #10b981
- Secondary: Emerald #059669
- Accent: Lime #84cc16

**Sunset**
- Primary: Orange #f97316
- Secondary: Red #ef4444
- Accent: Pink #ec4899

**Mono**
- Primary: Gray #6b7280
- Secondary: Slate #64748b
- Accent: Zinc #71717a
:::
:::

**Effort:** 2 days, 300 LOC

---

### 2. Component Defaults Override {medium-bold}

:::card {light-glass padded}
Allow users to customize default component behavior:

```javascript
// taildown.config.js
export default {
  components: {
    card: {
      defaultVariant: 'subtle-glass', // Instead of 'elevated'
      defaultPadding: 'padded-lg',
    },
    button: {
      defaultVariant: 'primary',
      defaultSize: 'md',
    },
    grid: {
      defaultColumns: 3,
      defaultGap: 'gap-lg',
    }
  }
}
```

**Benefit:** Projects with consistent design can set once, use everywhere.

**Effort:** 1 day, 200 LOC
:::

---

### 3. Animation Fine-Tuning {medium-bold}

:::card {light-glass padded}
Customize animation timing, easing, and behavior:

```javascript
export default {
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '600ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    scroll: {
      threshold: 0.15, // Trigger at 15% visibility
      stagger: 75,     // 75ms between elements
    },
    reducedMotion: 'respect' // or 'ignore'
  }
}
```

**Effort:** 2 days, 250 LOC
:::

---

### 4. Typography Scale Customization {medium-bold}

:::card {light-glass padded}
Define custom type scale for brand consistency:

```javascript
export default {
  typography: {
    scale: {
      xs: '0.75rem',
      small: '0.875rem',
      base: '1rem',
      large: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      huge: '2.25rem',
      massive: '3rem',
    },
    fonts: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
      display: 'Playfair Display, serif',
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    }
  }
}
```

**Effort:** 1 day, 180 LOC
:::

---

### 5. Icon Set Extension {medium-bold}

:::card {light-glass padded}
Add custom icons beyond Lucide:

```javascript
export default {
  icons: {
    // Add custom SVG icons
    custom: {
      'my-logo': '<svg>...</svg>',
      'brand-icon': '<svg>...</svg>',
    },
    
    // Or import from other libraries
    sets: [
      'lucide',           // Default
      'heroicons',        // Add Heroicons
      'custom',           // Custom set
    ],
    
    // Default size and color
    defaultSize: 'md',
    defaultColor: 'currentColor',
  }
}
```

**Usage:**
```taildown
:icon[my-logo]{huge primary}
:icon[heroicons:user]{large}
```

**Effort:** 3 days, 400 LOC
:::

---

### 6. Custom Shorthand Mappings {medium-bold}

:::card {light-glass padded}
Let users define custom plain English shorthands:

```javascript
export default {
  shorthands: {
    // Add custom mappings
    'brand-primary': ['text-brand-blue', 'font-bold'],
    'hero-text': ['text-5xl', 'font-black', 'tracking-tight'],
    'card-standard': ['glass-effect', 'padded-lg', 'rounded-xl'],
    
    // Or extend existing
    extend: {
      'massive': 'text-6xl', // Redefine
    }
  }
}
```

**Usage:**
```taildown
# My Hero {hero-text center}

:::card {card-standard}
Standard card with custom preset
:::
```

**Effort:** 2 days, 300 LOC
:::

---

### 7. Plugin System Foundation {medium-bold}

:::card {light-glass padded}
Basic plugin architecture for extending Taildown:

```javascript
// taildown.config.js
import myCustomPlugin from './plugins/my-plugin.js';

export default {
  plugins: [
    myCustomPlugin({
      option: 'value'
    }),
  ]
}
```

**Plugin API:**
```javascript
// plugins/my-plugin.js
export default function myCustomPlugin(options) {
  return {
    name: 'my-custom-plugin',
    
    // Hook into parser
    remarkPlugins: [myRemarkPlugin],
    
    // Hook into renderer
    rehypePlugins: [myRehypePlugin],
    
    // Add custom components
    components: {
      'my-component': {
        // Component definition
      }
    },
    
    // Add CSS
    styles: `
      .my-component { ... }
    `,
    
    // Add JavaScript behaviors
    scripts: `
      function myBehavior() { ... }
    `
  }
}
```

**Effort:** 5 days, 600 LOC (foundation only)
:::

---

### 8. Build Hooks and Events {medium-bold}

:::card {light-glass padded}
Allow users to hook into compilation process:

```javascript
export default {
  hooks: {
    // Before compilation
    beforeCompile: (content, options) => {
      console.log('Starting compilation...');
      // Modify content if needed
      return content;
    },
    
    // After parsing
    afterParse: (ast) => {
      console.log(`Parsed ${ast.children.length} nodes`);
      // Modify AST if needed
      return ast;
    },
    
    // Before rendering
    beforeRender: (hast) => {
      // Modify HTML AST
      return hast;
    },
    
    // After compilation
    afterCompile: (result) => {
      console.log(`Compiled in ${result.metadata.time}ms`);
      // Post-process output
      return result;
    },
  }
}
```

**Use Cases:**
- Custom preprocessing
- Analytics and metrics
- Validation and linting
- Custom optimizations

**Effort:** 2 days, 250 LOC
:::

---

## Implementation Guidelines {#guidelines large-bold primary}

:::card {heavy-glass padded-xl}
### :icon[code]{primary huge} Development Best Practices {large-bold center}

All implementations MUST follow these guidelines to maintain Taildown's quality and consistency.
:::

:::tabs
## :icon[book]{primary} Code Standards

**TypeScript Strict Mode**
- All code in TypeScript with `strict: true`
- Comprehensive type coverage
- No `any` types without justification
- JSDoc comments for public APIs

**Naming Conventions**
- Component files: `kebab-case.ts`
- Component names: `PascalCase`
- Functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`

**File Organization**
```
packages/compiler/src/
├── components/
│   └── standard/
│       ├── details.ts        # New component
│       ├── callout.ts        # New component
│       └── ...
├── resolver/
│   └── shorthand-mappings.ts # Update with new shorthands
└── renderer/
    └── css.ts                # Add component styles
```

**Exports**
- Export from `component-registry.ts`
- Add to type definitions
- Update `index.ts` if needed

## :icon[test-tube]{accent} Testing Requirements

**Test Coverage: Minimum 80%**

**Required Tests:**
1. **Unit Tests** - Component logic
2. **Parser Tests** - Syntax recognition
3. **Renderer Tests** - HTML output
4. **Variant Tests** - All variant combinations
5. **Edge Cases** - Malformed input handling

**Test Structure:**
```typescript
describe('DetailsComponent', () => {
  describe('parsing', () => {
    it('should parse basic details block', () => {
      // Test basic syntax
    });
    
    it('should detect summary from bold text', () => {
      // Test summary extraction
    });
  });
  
  describe('rendering', () => {
    it('should generate semantic HTML5', () => {
      // Test output structure
    });
    
    it('should apply glass variant', () => {
      // Test variant application
    });
  });
  
  describe('edge cases', () => {
    it('should handle empty details', () => {
      // Test edge case
    });
  });
});
```

## :icon[accessibility]{success} Accessibility

**WCAG 2.1 AA Compliance Required**

**Checklist:**
- [ ] Semantic HTML elements
- [ ] Proper ARIA roles and attributes
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast 4.5:1 minimum
- [ ] Screen reader tested
- [ ] Reduced motion respected

**Example:**
```html
<details class="details-component" 
         role="group" 
         aria-expanded="false">
  <summary role="button" 
           tabindex="0" 
           aria-controls="details-content-1">
    Summary Text
  </summary>
  <div id="details-content-1" class="details-content">
    Content here
  </div>
</details>
```

## :icon[zap]{warning} Performance

**Compilation Speed Targets**
- Small docs (<100 lines): <10ms
- Medium docs (100-1000 lines): <50ms
- Large docs (1000-5000 lines): <200ms
- Very large docs (5000+ lines): <500ms

**Optimization Strategies:**
- Tree-shake unused components
- Minimize regex operations
- Cache computed values
- Avoid unnecessary array operations
- Use Map/Set for lookups

**JavaScript Budget:**
- Per component: <2KB
- Total interactive: <15KB
- Tree-shaking mandatory

## :icon[palette]{info} Styling

**CSS Best Practices:**
- Use CSS custom properties for theming
- Mobile-first responsive design
- GPU-accelerated animations (`transform`, `opacity`)
- Avoid `!important`
- BEM-like class naming

**Example:**
```css
/* Component base */
.component-details {
  position: relative;
  border-radius: var(--radius-lg);
  transition: var(--transition-base);
}

/* Variant */
.component-details.glass-effect {
  background: var(--glass-subtle);
  backdrop-filter: blur(12px);
}

/* State */
.component-details[open] .details-icon {
  transform: rotate(90deg);
}

/* Responsive */
@media (max-width: 768px) {
  .component-details {
    font-size: 0.875rem;
  }
}
```
:::

---

## Technical Specifications {#specs large-bold primary}

### Parser Integration {medium-bold}

:::card {light-glass padded}
**New Component Integration Steps:**

1. **Define Component in Registry**
```typescript
// packages/compiler/src/components/standard/details.ts
export const detailsComponent: ComponentDefinition = {
  name: 'details',
  type: 'container',
  defaultClasses: ['details-component'],
  variants: {
    glass: ['glass-effect'],
    elevated: ['shadow-lg'],
    bordered: ['border-2', 'border-gray-200'],
  },
  attributes: {
    open: 'boolean',
  },
};
```

2. **Register in Component Registry**
```typescript
// packages/compiler/src/components/component-registry.ts
import { detailsComponent } from './standard/details';

ComponentRegistry.register(detailsComponent);
```

3. **Add Parser Handler** (if custom parsing needed)
```typescript
// packages/compiler/src/parser/components.ts
function parseDetailsDirective(node: ContainerDirective): Element {
  // Custom parsing logic
  const summary = extractSummary(node);
  const content = extractContent(node);
  
  return createDetailsElement(summary, content, node.attributes);
}
```

4. **Add Renderer** (if custom HTML needed)
```typescript
// packages/compiler/src/renderer/html.ts
function renderDetails(node: DetailsNode): string {
  return `
    <details class="${node.classes.join(' ')}">
      <summary>${node.summary}</summary>
      <div class="details-content">
        ${node.content}
      </div>
    </details>
  `;
}
```

5. **Add Styles**
```typescript
// packages/compiler/src/renderer/css.ts
const DETAILS_STYLES = `
.details-component {
  border-radius: 0.5rem;
  padding: 1rem;
}
.details-component summary {
  cursor: pointer;
  font-weight: 600;
}
// ... more styles
`;
```
:::

---

### Component Template {medium-bold}

:::card {light-glass padded}
**Starter Template for New Components:**

```typescript
/**
 * Component Name: Details
 * Purpose: Progressive disclosure with native HTML <details>
 * JavaScript Required: No
 */

import { ComponentDefinition } from '../component-registry';

export const detailsComponent: ComponentDefinition = {
  name: 'details',
  type: 'container',
  
  // Default classes applied to all instances
  defaultClasses: [
    'details-component',
    'rounded-lg',
    'p-4',
  ],
  
  // Variant options
  variants: {
    glass: ['glass-effect', 'backdrop-blur-md'],
    elevated: ['shadow-lg', 'border', 'border-gray-200'],
    bordered: ['border-2', 'border-gray-300'],
    subtle: ['bg-gray-50', 'border', 'border-gray-200'],
  },
  
  // Size variants
  sizes: {
    sm: ['text-sm', 'p-2'],
    md: ['text-base', 'p-4'],
    lg: ['text-lg', 'p-6'],
  },
  
  // Attributes (optional)
  attributes: {
    open: {
      type: 'boolean',
      default: false,
    },
  },
  
  // Custom parser (optional)
  parse: (node, context) => {
    // Custom parsing logic if needed
    return enhancedNode;
  },
  
  // Custom renderer (optional)
  render: (node, context) => {
    // Custom HTML generation if needed
    return htmlString;
  },
  
  // Styles
  styles: `
    .details-component {
      position: relative;
      transition: var(--transition-base);
    }
    
    .details-component summary {
      cursor: pointer;
      font-weight: 600;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .details-component summary::-webkit-details-marker {
      display: none;
    }
    
    .details-component[open] summary {
      margin-bottom: 0.75rem;
    }
    
    /* Dark mode */
    .dark .details-component {
      background: var(--bg-secondary-dark);
    }
  `,
  
  // JavaScript behavior (optional)
  behavior: `
    // Only if interactive JavaScript needed
    function detailsBehavior() {
      // Behavior code here
    }
  `,
};
```
:::

---

## Success Metrics {#metrics large-bold primary}

:::grid {2}
:::card {light-glass padded}
### :icon[target]{primary} Quantitative Metrics

**Performance:**
- :icon[check]{muted} Compilation speed < 100ms (maintained)
- :icon[check]{muted} JavaScript budget < 15KB total
- :icon[check]{muted} CSS output increase < 20%

**Quality:**
- :icon[check]{muted} Test coverage ≥ 80%
- :icon[check]{muted} TypeScript strict mode (100%)
- :icon[check]{muted} Zero linter errors

**Adoption:**
- :icon[check]{muted} All 23 components documented
- :icon[check]{muted} 5+ examples per component
- :icon[check]{muted} Migration guide published
:::

:::card {light-glass padded}
### :icon[users]{accent} Qualitative Metrics

**Developer Experience:**
- :icon[check]{muted} Clear, consistent API
- :icon[check]{muted} Helpful error messages
- :icon[check]{muted} Comprehensive documentation
- :icon[check]{muted} Easy to extend

**User Experience:**
- :icon[check]{muted} Zero-config beauty maintained
- :icon[check]{muted} Plain English readability
- :icon[check]{muted} Intuitive component names
- :icon[check]{muted} Predictable behavior

**Community:**
- :icon[check]{muted} Positive feedback from users
- :icon[check]{muted} Component requests addressed
- :icon[check]{muted} Active usage in the wild
:::
:::

---

## Timeline Summary {large-bold primary}

:::card {heavy-glass padded-xl}
### :icon[calendar]{warning huge} 8-Week Implementation Schedule {large-bold center}

**Week 1-2: Tier 1 (Quick Wins)** {medium-bold}
- 8 components, zero JavaScript
- Highest impact, lowest effort
- Immediate value delivery

**Week 3-5: Tier 2 (Medium Complexity)** {medium-bold}
- 7 components, ~3.5KB JavaScript
- Enhanced capabilities
- Professional features

**Week 6-8: Tier 3 (Advanced Features)** {medium-bold}
- 5 components, ~6KB JavaScript
- Power user features
- Niche but valuable

**Parallel: Configuration Enhancements** {medium-bold}
- Can be done alongside component work
- Foundation for future extensibility
- User customization support
:::

---

## Next Steps {large-bold primary center}

:::card {light-glass padded-xl center}
### :icon[rocket]{success huge} Ready to Begin Implementation

**Immediate Action:** Start with Tier 1, Day 1 - Details/Summary Component

**Success Criteria:** Working component with tests in < 1 day

**Validation:** Compile example, verify HTML output, test accessibility

[View Implementation Template](#specs){button primary large hover-lift}
:::

---

## Appendices {large-bold primary}

:::accordion
**A. Complete Component List with Effort**

| # | Component | Tier | Days | LOC | JS |
|---|-----------|------|------|-----|----|
| 1 | Details/Summary | 1 | 1 | 200 | 0 |
| 2 | Callout/Admonition | 1 | 1 | 180 | 0 |
| 3 | Multi-Column | 1 | 1 | 150 | 0 |
| 4 | Definition List | 1 | 1 | 160 | 0 |
| 5 | Stats/Metrics | 1 | 2 | 220 | 0 |
| 6 | Inline Badge | 1 | 1 | 140 | 0 |
| 7 | Blockquote Enhanced | 1 | 1 | 180 | 0 |
| 8 | Divider/Separator | 1 | 1 | 100 | 0 |
| 9 | Table Enhanced | 2 | 3 | 450 | 1KB |
| 10 | Image Comparison | 2 | 3 | 400 | 2KB |
| 11 | Video Embed | 2 | 2 | 280 | 0 |
| 12 | Code Diff | 2 | 3 | 380 | 0 |
| 13 | Footnotes | 2 | 3 | 350 | 0.5KB |
| 14 | Step Indicator | 2 | 2 | 260 | 0 |
| 15 | Mark/Highlight | 2 | 1 | 120 | 0 |
| 16 | Mermaid Diagrams | 3 | 5 | 800 | 5KB |
| 17 | Math Equations | 3 | 4 | 600 | 0 |
| 18 | Timeline | 3 | 3 | 420 | 0 |
| 19 | Keyboard Keys | 3 | 1 | 150 | 0 |
| 20 | Task List Enhanced | 3 | 2 | 280 | 1KB |
| **Total** | **20 components** | - | **41** | **5,820** | **9.5KB** |

**B. Configuration Enhancements Effort**

| # | Enhancement | Days | LOC |
|---|-------------|------|-----|
| 1 | Theme Presets | 2 | 300 |
| 2 | Component Defaults | 1 | 200 |
| 3 | Animation Tuning | 2 | 250 |
| 4 | Typography Scale | 1 | 180 |
| 5 | Icon Set Extension | 3 | 400 |
| 6 | Custom Shorthands | 2 | 300 |
| 7 | Plugin System | 5 | 600 |
| 8 | Build Hooks | 2 | 250 |
| **Total** | **8 enhancements** | **18** | **2,480** |

**Grand Total: 59 days (11.8 weeks) for all features**

**Realistic Timeline: 8 weeks with parallel work and iteration**
:::

---

**Document Version:** 1.0 | **Last Updated:** 2025-10-11 | **Status:** Ready for Implementation :icon[check-circle]{success}

