# Taildown Component & Syntax Enhancement Plan {huge-bold center primary}

**Easy Win Components for Language Output Features** {center large-muted}

**Date:** 2025-10-10 | **Version:** 1.0.0 | **Status:** Implementation Ready {center muted}

---

## Executive Summary {large-bold primary}

:::card {heavy-glass padded-xl}
This plan focuses on enhancing **Taildown's output capabilities** - the components and syntax features that improve what you can BUILD with Taildown (not the editor tool itself).

**Scope:**
- :icon[check]{success} New components for Taildown language
- :icon[check]{success} Syntax enhancements for better markup
- :icon[check]{success} Configuration improvements
- :icon[check]{success} Plain English shorthand additions

**These are "easy wins"** - high value, low to medium complexity implementations that dramatically expand Taildown's use cases.

**Total Implementation Time:** 16 days for Tier 1 & 2  
**Bundle Impact:** Minimal (tree-shaking keeps unused components out)  
**Use Cases Unlocked:** Documentation, marketing, storytelling, education, e-commerce
:::

---

## Part 1: Component Implementation Plan {huge-bold center primary}

### 1.1 Tier 1 Components (High Impact, Low Complexity) {large-bold primary}

:::accordion
**Component 1: Details/Summary (Progressive Disclosure)**

**Implementation Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} Highest

**Use Cases:**
- FAQ sections
- Collapsible documentation sections
- Progressive disclosure UI patterns
- Lightweight alternative to accordion

**Proposed Syntax:**
```taildown
:::details {glass}
**What is Taildown?** {bold}

Taildown is a markup language for UI/UX web design that compiles to beautiful HTML/CSS/JavaScript.

[Learn More](#){button primary}
:::

:::details {open}
**Already expanded** {bold}

This section is open by default with the `open` attribute.
:::
```

**Generated HTML:**
```html
<details class="taildown-details glass">
  <summary class="taildown-summary">
    <span class="summary-text">What is Taildown?</span>
    <svg class="summary-icon"><!-- chevron --></svg>
  </summary>
  <div class="details-content">
    <p>Taildown is a markup language...</p>
  </div>
</details>
```

**Variants:**
- `{open}` - Expanded by default
- `{glass}`, `{light-glass}`, `{heavy-glass}` - Glassmorphism variants
- `{bordered}` - Add visible border
- `{padded}` - Internal padding

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/details.ts`
- **Lines of Code:** ~200
- **Time Estimate:** 1 day
- **Complexity:** Low
- **JavaScript Required:** No (native HTML)
- **Test Fixtures:** `syntax-tests/fixtures/09-details/`
- **Example:** `examples/15-progressive-disclosure.td`

**CSS Features:**
- Smooth expand/collapse animation
- Custom chevron icon rotation
- Dark mode support
- Hover states

**Why It's an Easy Win:**
- Native HTML5 element (no JavaScript required!)
- Simple implementation
- Huge value for documentation
- Accessible by default

---

**Component 2: Callout/Admonition (Documentation Highlights)**

**Implementation Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} Highest

**Use Cases:**
- Technical documentation
- Notes, tips, warnings, danger alerts
- Highlighted information boxes
- Tutorial callouts

**Proposed Syntax:**
```taildown
:::callout {note}
:icon[lightbulb]{warning} **Note:** This is an important reminder.
:::

:::callout {tip glass}
:icon[zap]{primary} **Pro Tip:** Use keyboard shortcuts for faster editing!
:::

:::callout {warning}
:icon[alert-triangle]{warning} **Warning:** This action cannot be undone.
:::

:::callout {danger}
:icon[alert-octagon]{error} **Danger:** This will permanently delete all data.
:::

:::callout {success}
:icon[check-circle]{success} **Success:** Your changes have been saved.
:::
```

**Generated HTML:**
```html
<div class="taildown-callout callout-note" data-component="callout">
  <div class="callout-icon">
    <!-- Icon SVG -->
  </div>
  <div class="callout-content">
    <p><strong>Note:</strong> This is an important reminder.</p>
  </div>
</div>
```

**Variants:**
- `{note}` - Blue, informational
- `{tip}` - Green, helpful suggestions
- `{warning}` - Orange/yellow, caution
- `{danger}` - Red, critical warnings
- `{success}` - Green, positive confirmation
- `{info}` - Blue, general information

**Glass Support:** All variants work with `{glass}`, `{light-glass}`, `{heavy-glass}`

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/callout.ts`
- **Lines of Code:** ~300
- **Time Estimate:** 1 day
- **Complexity:** Low
- **JavaScript Required:** No
- **Test Fixtures:** `syntax-tests/fixtures/10-callouts/`
- **Example:** `examples/16-documentation-callouts.td`

**CSS Features:**
- Color-coded left border (4px thick)
- Icon integration in left gutter
- Semantic background colors
- Dark mode optimized

**Why It's an Easy Win:**
- Standard pattern from GitHub, GitLab, Docusaurus
- Pure CSS implementation
- Essential for technical docs
- Semantic and intuitive

---

**Component 3: Multi-Column Layout**

**Implementation Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} High

**Use Cases:**
- Magazine-style articles
- Newsletter layouts
- Blog posts with better readability
- Multi-column lists

**Proposed Syntax:**
```taildown
:::columns {2}
Long content automatically flows between two columns. This is perfect for magazine-style layouts, newsletters, and improving readability for long-form text content.

Lists, images, and other markdown elements work seamlessly within columns. The layout is fully responsive and adapts to mobile devices.
:::

:::columns {3 gap-lg}
Three columns with large gaps. Great for feature comparisons or side-by-side content presentation.
:::

:::columns {auto}
Automatic column count based on content width and viewport size.
:::
```

**Generated HTML:**
```html
<div class="taildown-columns columns-2" data-component="columns">
  <!-- Content flows naturally -->
</div>
```

**Variants:**
- `{2}`, `{3}`, `{4}` - Explicit column count
- `{auto}` - Auto column count based on width
- `{gap-sm}`, `{gap}`, `{gap-lg}` - Gap between columns
- `{balanced}` - Balance column heights
- `{glass}` - Glassmorphism effect

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/columns.ts`
- **Lines of Code:** ~150
- **Time Estimate:** 1 day
- **Complexity:** Low
- **JavaScript Required:** No
- **CSS Feature:** `column-count`, `column-gap`, `column-rule`
- **Test Fixtures:** `syntax-tests/fixtures/11-columns/`
- **Example:** `examples/17-magazine-layout.td`

**CSS Features:**
- CSS Multi-column layout
- Responsive (1 column on mobile)
- Break-inside rules for headings
- Column rules (divider lines)

**Why It's an Easy Win:**
- Pure CSS implementation
- Professional typography
- Responsive by default
- Common publishing pattern

---

**Component 4: Definition List**

**Implementation Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} High

**Use Cases:**
- Glossaries
- API parameter documentation
- Term definitions
- Technical specifications

**Proposed Syntax:**
```taildown
:::definitions {glass}
**API Key** {bold-primary}
: A unique identifier used to authenticate API requests.

**Webhook** {bold-primary}
: An HTTP callback triggered when a specific event occurs.

**Rate Limit** {bold-primary}
: Maximum number of requests allowed per time period.
:::

:::definitions {horizontal}
**Term** → **Definition** on the same line for compact layout.
:::
```

**Generated HTML:**
```html
<dl class="taildown-definitions glass">
  <dt class="definition-term">API Key</dt>
  <dd class="definition-description">
    A unique identifier used to authenticate API requests.
  </dd>
  <!-- More terms -->
</dl>
```

**Variants:**
- `{vertical}` - Default, term above definition
- `{horizontal}` - Term and definition side-by-side
- `{compact}` - Reduced spacing
- `{glass}` - Glassmorphism

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/definitions.ts`
- **Lines of Code:** ~200
- **Time Estimate:** 1 day
- **Complexity:** Low
- **JavaScript Required:** No
- **Test Fixtures:** `syntax-tests/fixtures/12-definitions/`
- **Example:** `examples/18-glossary.td`

**CSS Features:**
- Semantic HTML (`<dl>`, `<dt>`, `<dd>`)
- Grid layout for horizontal variant
- Bold terms by default
- Divider lines between entries

**Why It's an Easy Win:**
- Semantic HTML5 elements
- Common documentation need
- Pure CSS
- Accessible by default

---

**Component 5: Stats/Metrics Display**

**Implementation Priority:** :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} High

**Use Cases:**
- Landing page statistics
- Dashboard summaries
- Achievement displays
- Social proof numbers

**Proposed Syntax:**
```taildown
:::stats {grid-4}
**10,000+** {huge-bold primary}
Active Users

**99.9%** {huge-bold success}
Uptime SLA

**50ms** {huge-bold warning}
Avg Response

**24/7** {huge-bold info}
Support
:::

:::stats {glass cols-3}
Three stat columns with glassmorphism
:::
```

**Generated HTML:**
```html
<div class="taildown-stats grid-4" data-component="stats">
  <div class="stat-item">
    <div class="stat-number">10,000+</div>
    <div class="stat-label">Active Users</div>
  </div>
  <!-- More stats -->
</div>
```

**Variants:**
- `{grid-2}`, `{grid-3}`, `{grid-4}` - Column count
- `{glass}` - Glassmorphism effect
- `{center}` - Center-aligned
- `{large}`, `{huge}` - Size variants

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/stats.ts`
- **Lines of Code:** ~250
- **Time Estimate:** 1 day
- **Complexity:** Low
- **JavaScript Required:** Optional (count-up animation)
- **Test Fixtures:** `syntax-tests/fixtures/13-stats/`
- **Example:** `examples/19-landing-stats.td`

**CSS Features:**
- Grid layout with responsive breakpoints
- Large, bold numbers
- Smaller, muted labels
- Card-like styling per stat

**Optional JavaScript:**
- Count-up animation on scroll into view
- ~1KB if used

**Why It's an Easy Win:**
- Simple grid + typography
- High visual impact
- Common landing page pattern
- Optional interactivity
:::

**Tier 1 Summary:** 5 components, 5 days, massive use case expansion

---

### 1.2 Tier 2 Components (High Impact, Medium Complexity) {large-bold primary}

:::accordion
**Component 6: Timeline**

**Implementation Priority:** :icon[package]{primary}:icon[package]{primary}:icon[package]{primary}:icon[package]{primary} High

**Use Cases:**
- Company history
- Project milestones
- Event chronology
- Process steps

**Proposed Syntax:**
```taildown
:::timeline {vertical}
**2020** {bold-primary}

Founded the company with a revolutionary vision.

---

**2022** {bold-primary}

Raised Series A funding and grew to 15 people.

---

**2024** {bold-primary}

Launched Taildown 1.0 with 10,000+ users.

---

**2025** {bold-primary}

Global expansion and enterprise adoption.
:::

:::timeline {horizontal glass}
**Phase 1** → **Phase 2** → **Phase 3** → **Complete**
:::
```

**Variants:**
- `{vertical}` - Default, top-to-bottom
- `{horizontal}` - Left-to-right (mobile stacks)
- `{alternating}` - Left/right alternating (vertical only)
- `{glass}` - Glassmorphism on items
- `{centered}` - Center alignment

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/timeline.ts`
- **Lines of Code:** ~400
- **Time Estimate:** 2 days
- **Complexity:** Medium
- **JavaScript Required:** No
- **Test Fixtures:** `syntax-tests/fixtures/14-timeline/`
- **Example:** `examples/20-company-history.td`

**CSS Features:**
- Flexbox layout
- Connector lines with pseudo-elements
- Circle markers at each point
- Responsive (horizontal → vertical on mobile)

---

**Component 7: Stepper/Progress Indicator**

**Implementation Priority:** :icon[package]{primary}:icon[package]{primary}:icon[package]{primary}:icon[package]{primary} High

**Use Cases:**
- Multi-step forms
- Onboarding flows
- Tutorial progression
- Process visualization

**Proposed Syntax:**
```taildown
:::stepper {current="2"}
## Step 1: Create Account {completed}
Sign up and verify your email address.

## Step 2: Setup Profile {active}
Fill in your profile information and preferences.

## Step 3: Add Content
Start creating your first document.

## Step 4: Publish
Go live with your beautiful content!
:::

:::stepper {horizontal glass}
**Account** → **Profile** → **Content** → **Publish**
:::
```

**Variants:**
- `{vertical}` - Default, top-to-bottom
- `{horizontal}` - Left-to-right with connector
- `{glass}` - Glassmorphism on steps
- States: `{completed}`, `{active}`, `{pending}`

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/stepper.ts`
- **Lines of Code:** ~500
- **Time Estimate:** 2 days
- **Complexity:** Medium
- **JavaScript Required:** Optional (for interactivity)
- **Test Fixtures:** `syntax-tests/fixtures/15-stepper/`
- **Example:** `examples/21-onboarding-flow.td`

**CSS Features:**
- Progress bar between steps
- Check icons for completed steps
- Number badges for steps
- Color-coded states

---

**Component 8: Code Comparison**

**Implementation Priority:** :icon[package]{success}:icon[package]{success}:icon[package]{success}:icon[package]{success} High

**Use Cases:**
- Before/after examples
- Migration guides
- API change documentation
- Tutorial comparisons

**Proposed Syntax:**
```taildown
:::code-compare
## Before
```javascript
const old = 'verbose approach';
const result = processOldWay(old);
```

## After
```javascript
const clean = 'simple approach';
const result = process(clean);
```
:::

:::code-compare {vertical}
Vertical layout for mobile or narrow spaces
:::
```

**Variants:**
- `{horizontal}` - Default, side-by-side
- `{vertical}` - Stacked layout
- `{diff}` - Highlight additions/removals
- `{labels}` - Custom labels (Before/After, Old/New)

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/code-compare.ts`
- **Lines of Code:** ~400
- **Time Estimate:** 2 days
- **Complexity:** Medium
- **JavaScript Required:** No
- **Test Fixtures:** `syntax-tests/fixtures/16-code-compare/`
- **Example:** `examples/22-migration-guide.td`

**CSS Features:**
- Grid layout for side-by-side
- Diff highlighting (+ green, - red)
- Syntax highlighting for both
- Responsive (side-by-side → stacked)

---

**Component 9: Pricing Table**

**Implementation Priority:** :icon[package]{warning}:icon[package]{warning}:icon[package]{warning}:icon[package]{warning} High

**Use Cases:**
- SaaS landing pages
- Product comparison tables
- Feature matrices
- Subscription plans

**Proposed Syntax:**
```taildown
:::pricing
:::plan {featured}
### Pro Plan {large-bold}
#### $99/month {huge-bold primary}

Everything in Starter, plus:
- :icon[check]{success} Priority support
- :icon[check]{success} Advanced analytics
- :icon[check]{success} Custom integrations
- :icon[check]{success} Unlimited seats

[Choose Pro](#){button primary large}
:::

:::plan
### Starter Plan
#### $29/month {large-bold}

Perfect for individuals:
- :icon[check]{success} 10 projects
- :icon[check]{success} 1GB storage
- :icon[check]{success} Email support
- :icon[check]{success} Basic analytics

[Choose Starter](#){button secondary}
:::

:::plan
### Enterprise
#### Custom Pricing {large-bold}

For large teams:
- :icon[check]{success} Unlimited everything
- :icon[check]{success} Dedicated support
- :icon[check]{success} Custom SLA
- :icon[check]{success} On-premise option

[Contact Sales](#){button info}
:::
:::
```

**Variants:**
- `{featured}` - Highlighted/recommended plan
- `{glass}` - Glassmorphism effect
- `{cols-2}`, `{cols-3}`, `{cols-4}` - Column count

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/pricing.ts`
- **Lines of Code:** ~600
- **Time Estimate:** 3 days
- **Complexity:** Medium
- **JavaScript Required:** Optional (monthly/yearly toggle)
- **Test Fixtures:** `syntax-tests/fixtures/17-pricing/`
- **Example:** `examples/23-saas-pricing.td`

**CSS Features:**
- Grid layout with equal heights
- Featured plan scale/elevation
- Price emphasis styling
- CTA button prominence

---

**Component 10: Testimonial**

**Implementation Priority:** :icon[package]{info}:icon[package]{info}:icon[package]{info} Medium

**Use Cases:**
- Customer reviews
- Social proof sections
- Case studies
- User feedback

**Proposed Syntax:**
```taildown
:::testimonials {carousel}
:::testimonial {glass}
> "Taildown transformed how we create documentation. The plain English syntax is a game-changer for our entire team."

**Sarah Johnson** {bold}  
CTO, TechCorp {muted}

:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}
:::

:::testimonial {glass}
> "We migrated from Markdown to Taildown and cut our styling time by 80%. The zero-config philosophy is exactly what we needed."

**Mike Chen** {bold}  
Lead Developer, StartupXYZ {muted}

:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}
:::
:::

:::testimonials {grid-3}
Three-column grid layout instead of carousel
:::
```

**Variants:**
- `{carousel}` - Swipeable carousel
- `{grid-2}`, `{grid-3}` - Grid layout
- `{glass}` - Glassmorphism
- `{centered}` - Center-aligned

**Implementation Details:**
- **File:** `packages/compiler/src/components/standard/testimonial.ts`
- **Lines of Code:** ~350
- **Time Estimate:** 2 days
- **Complexity:** Medium
- **JavaScript Required:** Only if carousel variant
- **Test Fixtures:** `syntax-tests/fixtures/18-testimonials/`
- **Example:** `examples/24-customer-reviews.td`

**CSS Features:**
- Quote styling with large quotation marks
- Avatar/photo support
- Rating star display
- Subtle elevation
:::

**Tier 2 Summary:** 5 components, 11 days, professional/commercial features

---

### 1.3 Component Implementation Checklist {large-bold primary}

:::card {light-glass padded}
**For Each Component, Follow This Process:**

**Phase 1: Design (2-3 hours)**
- :icon[square]{muted} Define Taildown syntax
- :icon[square]{muted} Design attribute system  
- :icon[square]{muted} Plan variant options
- :icon[square]{muted} Create usage examples

**Phase 2: Component Definition (3-4 hours)**
- :icon[square]{muted} Create component file in `packages/compiler/src/components/standard/`
- :icon[square]{muted} Define ComponentDefinition structure
- :icon[square]{muted} Specify default classes
- :icon[square]{muted} Define all variants
- :icon[square]{muted} Add to component registry

**Phase 3: CSS Implementation (2-3 hours)**
- :icon[square]{muted} Write base component styles
- :icon[square]{muted} Create variant styles
- :icon[square]{muted} Add dark mode support
- :icon[square]{muted} Implement responsive behavior
- :icon[square]{muted} Add glassmorphism support

**Phase 4: JavaScript (if needed) (2-3 hours)**
- :icon[square]{muted} Write behavior function
- :icon[square]{muted} Add to JS generator tree-shaking
- :icon[square]{muted} Test event handlers
- :icon[square]{muted} Ensure accessibility

**Phase 5: Testing (2-3 hours)**
- :icon[square]{muted} Create test fixtures
- :icon[square]{muted} Write unit tests
- :icon[square]{muted} Test all variants
- :icon[square]{muted} Test nesting scenarios
- :icon[square]{muted} Accessibility audit

**Phase 6: Documentation (1-2 hours)**
- :icon[square]{muted} Update SYNTAX.md
- :icon[square]{muted} Create example file
- :icon[square]{muted} Add to docs-site/components.td
- :icon[square]{muted} Update plain-english.td if new shorthands

**Phase 7: Integration (1 hour)**
- :icon[square]{muted} Build with `pnpm build`
- :icon[square]{muted} Compile test file
- :icon[square]{muted} Run test suite with `pnpm test`
- :icon[square]{muted} Update fixtures with `pnpm test:syntax`

**Total Time Per Component:** ~14-18 hours (factored into estimates)
:::

---

## Part 2: Syntax Enhancements {huge-bold center primary}

### 2.1 Enhanced Attribute Syntax {large-bold primary}

:::card {heavy-glass padded-xl}
**Current Syntax:**
```taildown
:::card {glass padded}
Content
:::
```

**Enhanced Syntax Proposals:**

**1. Custom Data Attributes**
```taildown
:::card {glass data-category="featured" data-priority="high"}
Enables custom JavaScript hooks and CSS selectors
:::
```

**2. ARIA Attributes for Accessibility**
```taildown
:::card {glass aria-label="Featured Product" aria-describedby="desc-1"}
Improves accessibility for screen readers
:::
```

**3. Anchor ID Shorthand**
```taildown
# Section Title {#my-section large-bold primary}
Creates id="my-section" for deep linking
:::
```

**Implementation:**
- **File:** `packages/compiler/src/parser/attributes.ts` (extend existing)
- **Lines of Code:** ~100 additions
- **Time Estimate:** 1 day
- **Complexity:** Low

**Why It's Valuable:**
- More flexibility for developers
- Better accessibility
- Enables JavaScript interactions
- Standards-compliant
:::

---

### 2.2 Responsive Shorthand Syntax {large-bold primary}

:::card {light-glass padded}
**Current Approach:**
```taildown
{large} applies to all screen sizes
```

**Enhanced Responsive Syntax:**
```taildown
{small-mobile large-tablet huge-desktop}
{grid-1-mobile grid-3-tablet grid-4-desktop}
{hidden-mobile visible-tablet}
{padded-sm-mobile padded-lg-desktop}
```

**Generated CSS:**
```css
/* small-mobile large-tablet huge-desktop */
@media (max-width: 767px) {
  .text-sm { font-size: 0.875rem; }
}
@media (min-width: 768px) and (max-width: 1023px) {
  .text-lg { font-size: 1.125rem; }
}
@media (min-width: 1024px) {
  .text-4xl { font-size: 2.25rem; }
}
```

**Implementation:**
- **File:** `packages/compiler/src/resolver/responsive-resolver.ts` (new)
- **Lines of Code:** ~300
- **Time Estimate:** 2 days
- **Complexity:** Medium

**Why It's Valuable:**
- Fine-grained responsive control
- Maintains plain English approach
- No need for CSS media queries
- Common design pattern
:::

---

### 2.3 Variable References {large-bold primary}

:::card {subtle-glass padded}
**Proposal:** Reference theme variables from config

**Syntax:**
```taildown
# Heading {$brand-primary}
:::card {$card-default-style}
[Button](#){button $button-default-variant}
```

**Configuration:**
```javascript
// taildown.config.js
export default {
  variables: {
    'brand-primary': 'huge-bold primary center',
    'card-default-style': 'light-glass padded-lg rounded-xl',
    'button-default-variant': 'primary large hover-lift'
  }
}
```

**Implementation:**
- **File:** `packages/compiler/src/resolver/variable-resolver.ts` (new)
- **Lines of Code:** ~200
- **Time Estimate:** 1 day
- **Complexity:** Low

**Why It's Valuable:**
- DRY principle (Don't Repeat Yourself)
- Consistent styling across project
- Easy theme changes
- Maintainable
:::

---

## Part 3: Configuration Enhancements {huge-bold center primary}

### 3.1 Theme Preset System {large-bold primary}

:::card {glass padded-xl}
**Proposal:** Pre-built themes that can be activated instantly

**Configuration:**
```javascript
// taildown.config.js
export default {
  theme: {
    preset: 'ocean', // or 'forest', 'sunset', 'midnight', 'default'
    
    // Or custom theme
    custom: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#8b5cf6',
        accent: '#f43f5e',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      fonts: {
        heading: 'Outfit, sans-serif',
        body: 'Inter, sans-serif',
        mono: 'JetBrains Mono, monospace'
      },
      effects: {
        glassBlur: '16px',
        glassOpacity: 0.75,
        animationSpeed: '300ms',
        shadowIntensity: 'medium'
      }
    }
  }
}
```

**Presets to Include:**

:::grid {2}
:::card {subtle-glass padded}
**Ocean Theme**
- Primary: Sky blue
- Secondary: Teal
- Accent: Cyan
- Vibe: Professional, tech

**Use Case:** SaaS, tech companies
:::

:::card {subtle-glass padded}
**Forest Theme**
- Primary: Forest green
- Secondary: Sage
- Accent: Lime
- Vibe: Natural, organic

**Use Case:** Environmental, wellness
:::

:::card {subtle-glass padded}
**Sunset Theme**
- Primary: Orange
- Secondary: Rose
- Accent: Purple
- Vibe: Creative, warm

**Use Case:** Creative agencies, portfolios
:::

:::card {subtle-glass padded}
**Midnight Theme**
- Primary: Indigo
- Secondary: Purple
- Accent: Pink
- Vibe: Modern, bold

**Use Case:** Gaming, entertainment
:::
:::

**Implementation:**
- **File:** `packages/compiler/src/config/theme-presets.ts` (new)
- **Lines of Code:** ~400
- **Time Estimate:** 2 days
- **Complexity:** Medium

**Why It's Valuable:**
- Quick theme switching
- Professional color combinations
- Consistent design systems
- Easy customization
:::

---

### 3.2 Component Default Overrides {large-bold primary}

:::card {light-glass padded}
**Proposal:** Set project-wide defaults for components

**Configuration:**
```javascript
// taildown.config.js
export default {
  components: {
    card: {
      defaultVariant: 'light-glass',
      defaultClasses: ['padded-lg', 'rounded-xl', 'hover-lift']
    },
    button: {
      defaultVariant: 'primary',
      defaultSize: 'large',
      defaultEffect: 'hover-lift'
    },
    grid: {
      defaultColumns: 3,
      defaultGap: 'gap-lg'
    }
  }
}
```

**Usage:**
```taildown
# Without config:
:::card {light-glass padded-lg rounded-xl hover-lift}

# With config (defaults applied):
:::card
Still gets light-glass, padded-lg, rounded-xl, hover-lift!
:::

# Override defaults:
:::card {heavy-glass padded-sm}
Overrides the defaults
:::
```

**Implementation:**
- **File:** `packages/compiler/src/components/apply-defaults.ts` (new)
- **Lines of Code:** ~200
- **Time Estimate:** 1 day
- **Complexity:** Low

**Why It's Valuable:**
- Less repetition
- Project-wide consistency
- Brand alignment
- Still overrideable
:::

---

### 3.3 Animation Configuration {large-bold primary}

:::card {subtle-glass padded}
**Proposal:** Fine-tune animation behavior globally

**Configuration:**
```javascript
// taildown.config.js
export default {
  animations: {
    entrance: {
      enabled: true,
      duration: '600ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      stagger: '100ms',
      threshold: 0.15 // % of element visible to trigger
    },
    hover: {
      liftHeight: '8px',
      glowIntensity: 0.3,
      scaleAmount: 1.05,
      duration: '200ms'
    },
    reducedMotion: 'respect' // or 'ignore'
  }
}
```

**Implementation:**
- **File:** `packages/compiler/src/config/animation-config.ts` (new)
- **Lines of Code:** ~250
- **Time Estimate:** 1 day
- **Complexity:** Low

**Why It's Valuable:**
- Brand-specific animation timing
- Accessibility (reduced motion)
- Consistent feel across site
- Fine-grained control
:::

---

## Part 4: Implementation Timeline {huge-bold center primary}

### 4.1 Week-by-Week Breakdown {large-bold primary}

:::card {heavy-glass padded-xl}
**Week 1: Foundation Components**

**Monday-Tuesday:** Details/Summary Component
- Design syntax
- Implement component
- Write tests
- Create example

**Wednesday-Thursday:** Callout Component
- Design types (note, tip, warning, danger)
- Implement with icon integration
- Write tests
- Create documentation example

**Friday:** Multi-Column Layout
- Design responsive behavior
- Implement CSS columns
- Test mobile responsiveness
- Create magazine-style example

**Deliverables:** 3 components, expanding documentation and content use cases

---

**Week 2: Stats & Definitions**

**Monday:** Definition List Component
- Implement vertical/horizontal layouts
- Add glassmorphism support
- Create glossary example

**Tuesday-Wednesday:** Stats/Metrics Component
- Design grid layouts
- Implement number/label styling
- Optional count-up animation
- Create landing page example

**Thursday-Friday:** Testing & Documentation
- Complete all test fixtures
- Update SYNTAX.md
- Update docs-site/components.td
- Run full test suite

**Deliverables:** 5 total Tier 1 components complete

---

**Week 3: Advanced Components**

**Monday-Tuesday:** Timeline Component
- Vertical and horizontal variants
- Connector line styling
- Alternating layout
- History example

**Wednesday-Thursday:** Stepper Component
- Multi-step visualization
- State indicators (completed/active/pending)
- Progress bar
- Onboarding example

**Friday:** Code Comparison
- Side-by-side layout
- Diff highlighting
- Responsive stacking
- Migration guide example

**Deliverables:** 8 total components (Tier 1 + partial Tier 2)

---

**Week 4: Commercial & Polish**

**Monday-Wednesday:** Pricing Table
- Multi-column layouts
- Featured plan highlighting
- Feature comparison matrix
- SaaS pricing example

**Thursday:** Testimonial Component
- Carousel integration
- Grid layout option
- Rating display
- Social proof example

**Friday:** Integration & Testing
- Full test suite
- Performance validation
- Documentation updates
- Example compilation

**Deliverables:** 10 total components, comprehensive examples

---

**Week 5-6: Configuration & Enhancements**

**Week 5:**
- Theme preset system
- Component default overrides
- Animation configuration
- Variable reference system

**Week 6:**
- Responsive shorthand syntax
- Enhanced attribute parsing
- Documentation site updates
- Release preparation

**Deliverables:** Enhanced configuration, new syntax features, v0.2.0 ready
:::

---

### 4.2 Priority Matrix {large-bold primary}

:::card {elevated padded}
| Component | Priority | Days | Complexity | Use Cases |
|-----------|----------|------|------------|-----------|
| **Details/Summary** | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | 1 | Low | Docs, FAQ |
| **Callout** | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | 1 | Low | Docs, tutorials |
| **Multi-Column** | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | 1 | Low | Articles, newsletters |
| **Definitions** | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | 1 | Low | Glossaries, APIs |
| **Stats** | :icon[star]{warning}:icon[star]{warning}:icon[star]{warning}:icon[star]{warning} | 1 | Low | Landing pages |
| **Timeline** | :icon[package]{primary}:icon[package]{primary}:icon[package]{primary} | 2 | Medium | History, process |
| **Stepper** | :icon[package]{primary}:icon[package]{primary}:icon[package]{primary} | 2 | Medium | Onboarding, forms |
| **Code Compare** | :icon[package]{primary}:icon[package]{primary}:icon[package]{primary} | 2 | Medium | Migration guides |
| **Pricing** | :icon[package]{primary}:icon[package]{primary}:icon[package]{primary} | 3 | Medium | SaaS, e-commerce |
| **Testimonials** | :icon[package]{success}:icon[package]{success} | 2 | Medium | Social proof |

**Total:** 16 days for all 10 components
:::

---

## Part 5: Technical Implementation Guide {huge-bold center primary}

### 5.1 Component Template {large-bold primary}

:::tabs
## TypeScript Definition

```typescript
// packages/compiler/src/components/standard/details.ts

import { ComponentDefinition } from '../component-registry';

export const detailsComponent: ComponentDefinition = {
  name: 'details',
  type: 'block',
  category: 'disclosure',
  
  description: 'Progressive disclosure component',
  
  defaultClasses: [
    'taildown-details',
    'border',
    'border-gray-300',
    'dark:border-gray-700',
    'rounded-lg',
    'overflow-hidden',
    'transition-all'
  ],
  
  variants: {
    glass: [
      'glass-effect',
      'backdrop-blur-md',
      'bg-white/75',
      'dark:bg-gray-900/75'
    ],
    'light-glass': [
      'light-glass-effect',
      'backdrop-blur-md',
      'bg-white/85',
      'dark:bg-gray-900/85'
    ],
    bordered: [
      'border-2',
      'border-gray-400'
    ]
  },
  
  sizes: {
    sm: ['text-sm', 'p-3'],
    md: ['text-base', 'p-4'], // default
    lg: ['text-lg', 'p-6']
  },
  
  attributes: {
    open: { type: 'boolean', default: false }
  }
};

// Register component
import { componentRegistry } from '../component-registry';
componentRegistry.register(detailsComponent);
```

## Renderer Implementation

```typescript
// In packages/compiler/src/renderer/components/details-renderer.ts

import { Element } from 'hast';

export function renderDetails(node: any, classes: string[]): Element {
  const attributes = node.attributes || {};
  const isOpen = attributes.open === true || attributes.open === 'true';
  
  // Extract summary (first paragraph with bold)
  const children = node.children || [];
  let summaryContent = null;
  let detailsContent = [];
  
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (i === 0 && child.type === 'paragraph') {
      summaryContent = child;
    } else {
      detailsContent.push(child);
    }
  }
  
  return {
    type: 'element',
    tagName: 'details',
    properties: {
      className: classes,
      'data-component': 'details',
      ...(isOpen && { open: true })
    },
    children: [
      {
        type: 'element',
        tagName: 'summary',
        properties: { className: ['taildown-summary'] },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['summary-text'] },
            children: summaryContent ? summaryContent.children : []
          },
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['summary-icon'] },
            children: [/* SVG chevron */]
          }
        ]
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['details-content'] },
        children: detailsContent
      }
    ]
  };
}
```

## CSS Styles

```css
/* Details/Summary Component */
.taildown-details {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.taildown-summary {
  padding: 1rem 1.5rem;
  cursor: pointer;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface-color);
  font-weight: 500;
  transition: background 200ms;
  list-style: none; /* Remove default marker */
}

.taildown-summary::-webkit-details-marker {
  display: none; /* Remove default marker in webkit */
}

.taildown-summary:hover {
  background: var(--surface-hover);
}

.summary-text {
  flex: 1;
}

.summary-icon {
  margin-left: 1rem;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.taildown-details[open] .summary-icon {
  transform: rotate(180deg);
}

.details-content {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  animation: slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode */
.dark .taildown-details {
  border-color: var(--border-dark);
  background: var(--bg-secondary-dark);
}

.dark .taildown-summary {
  background: var(--surface-dark);
}

.dark .taildown-summary:hover {
  background: var(--surface-hover-dark);
}

/* Glass variants */
.taildown-details.glass-effect {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.dark .taildown-details.glass-effect {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## Test Fixture

```taildown
# syntax-tests/fixtures/09-details/01-basic-details.td

:::details
**Basic Details** {bold}

This is the content that expands when the summary is clicked.
:::

:::details {open}
**Open by Default** {bold}

This details component is expanded by default.
:::

:::details {glass}
**Glass Effect** {bold}

Beautiful glassmorphism on the details component.
:::
```
:::

---

### 5.2 Callout Implementation Example {large-bold primary}

:::tabs
## TypeScript Definition

```typescript
// packages/compiler/src/components/standard/callout.ts

export const calloutComponent: ComponentDefinition = {
  name: 'callout',
  type: 'block',
  category: 'feedback',
  
  description: 'Highlighted information boxes',
  
  defaultClasses: [
    'taildown-callout',
    'rounded-lg',
    'p-4',
    'border-l-4',
    'flex',
    'gap-3'
  ],
  
  variants: {
    note: [
      'callout-note',
      'bg-blue-50',
      'dark:bg-blue-950',
      'border-blue-500',
      'text-blue-900',
      'dark:text-blue-100'
    ],
    tip: [
      'callout-tip',
      'bg-green-50',
      'dark:bg-green-950',
      'border-green-500',
      'text-green-900',
      'dark:text-green-100'
    ],
    warning: [
      'callout-warning',
      'bg-yellow-50',
      'dark:bg-yellow-950',
      'border-yellow-500',
      'text-yellow-900',
      'dark:text-yellow-100'
    ],
    danger: [
      'callout-danger',
      'bg-red-50',
      'dark:bg-red-950',
      'border-red-500',
      'text-red-900',
      'dark:text-red-100'
    ],
    success: [
      'callout-success',
      'bg-emerald-50',
      'dark:bg-emerald-950',
      'border-emerald-500',
      'text-emerald-900',
      'dark:text-emerald-100'
    ],
    info: [
      'callout-info',
      'bg-sky-50',
      'dark:bg-sky-950',
      'border-sky-500',
      'text-sky-900',
      'dark:text-sky-100'
    ]
  }
};
```

## CSS Implementation

```css
/* Callout/Admonition Component */
.taildown-callout {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
  margin: 1rem 0;
}

.callout-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.callout-content {
  flex: 1;
  min-width: 0;
}

.callout-content > *:first-child {
  margin-top: 0;
}

.callout-content > *:last-child {
  margin-bottom: 0;
}

/* Type-specific styling */
.callout-note {
  background: rgb(239, 246, 255);
  border-color: rgb(59, 130, 246);
}

.dark .callout-note {
  background: rgba(30, 58, 138, 0.3);
  border-color: rgb(96, 165, 250);
}

.callout-tip {
  background: rgb(240, 253, 244);
  border-color: rgb(16, 185, 129);
}

.dark .callout-tip {
  background: rgba(6, 78, 59, 0.3);
  border-color: rgb(52, 211, 153);
}

.callout-warning {
  background: rgb(254, 252, 232);
  border-color: rgb(245, 158, 11);
}

.dark .callout-warning {
  background: rgba(120, 53, 15, 0.3);
  border-color: rgb(251, 191, 36);
}

.callout-danger {
  background: rgb(254, 242, 242);
  border-color: rgb(239, 68, 68);
}

.dark .callout-danger {
  background: rgba(127, 29, 29, 0.3);
  border-color: rgb(248, 113, 113);
}

/* Glass effect overlay */
.taildown-callout.glass-effect {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.8);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.dark .taildown-callout.glass-effect {
  background: rgba(15, 23, 42, 0.8);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```
:::

---

## Part 6: Use Case Impact Analysis {huge-bold center primary}

### 6.1 Before vs. After {large-bold primary}

:::grid {2}
:::card {light-glass padded}
#### :icon[file-text]{primary} Before (Current - 18 Components) {medium-bold}

**What You Can Build:**
- Basic documentation pages
- Simple landing pages
- Blog posts with cards
- Feature showcases
- Portfolio pages

**Limitations:**
- No progressive disclosure
- No documentation callouts
- No magazine layouts
- No glossaries
- No statistics displays
- No timeline visualizations
- No pricing tables
- No testimonials
:::

:::card {subtle-glass padded}
#### :icon[sparkles]{success} After (28 Components) {medium-bold}

**What You Can Build:**
- **Professional documentation** (callouts, details, definitions)
- **Magazine-style content** (multi-column)
- **SaaS landing pages** (stats, pricing, testimonials)
- **Company sites** (timeline, social proof)
- **Educational content** (stepper, progressive disclosure)
- **Migration guides** (code comparison)
- **E-commerce** (pricing tables, product comparisons)
- **Everything before** + so much more!

**Unlocked Use Cases:**
- :icon[check]{success} Technical documentation sites
- :icon[check]{success} Marketing and SaaS sites
- :icon[check]{success} Educational platforms
- :icon[check]{success} Company history pages
- :icon[check]{success} Product launch pages
:::
:::

---

### 6.2 Real-World Examples {large-bold primary}

:::accordion
**Example 1: Technical Documentation Site**

**Components Used:**
- Callouts (note, tip, warning, danger)
- Details/Summary (FAQ sections)
- Definition lists (API glossary)
- Code comparison (migration guides)
- Tabs (multi-language examples)

**Before:** Basic text with alerts  
**After:** Professional technical documentation rivaling Read the Docs, GitBook, Docusaurus

**Example 2: SaaS Landing Page**

**Components Used:**
- Stats display (10,000+ users, 99.9% uptime)
- Pricing table (Starter, Pro, Enterprise)
- Testimonials (customer reviews carousel)
- Timeline (company milestones)
- Hero section with glassmorphism cards

**Before:** Basic hero + feature grid  
**After:** Complete professional SaaS site with social proof and clear pricing

**Example 3: Educational Content**

**Components Used:**
- Stepper (course progression)
- Details/Summary (optional reading)
- Callouts (learning tips)
- Code comparison (before/after examples)
- Multi-column (text-heavy content)

**Before:** Linear content only  
**After:** Interactive learning experience with progressive disclosure

**Example 4: Company Website**

**Components Used:**
- Timeline (company history)
- Stats (achievements and metrics)
- Testimonials (customer feedback)
- Team cards (about page)
- Multi-column (news/blog)

**Before:** Static pages with basic cards  
**After:** Engaging storytelling with visual timeline and social proof

**Example 5: Developer Portfolio**

**Components Used:**
- Timeline (career history)
- Stats (GitHub stats, contributions)
- Code comparison (before/after improvements)
- Details/Summary (project deep-dives)
- Testimonials (client feedback)

**Before:** Basic grid of projects  
**After:** Comprehensive portfolio with story and proof points
:::

---

## Part 7: Implementation Best Practices {huge-bold center primary}

### 7.1 Component Design Principles {large-bold primary}

:::card {light-glass padded-xl}
**1. Zero-Config Beauty**

Every component must work beautifully with ZERO attributes:

```taildown
:::details
**Click to expand**
Content here
:::
```

Should produce a professional-looking details component immediately.

---

**2. Plain English Variants**

All variants must use natural language:

```taildown
CORRECT: {light-glass}  {heavy-glass}  {subtle-glass}
WRONG:   {glass-light}  {glass-heavy}  {glass-subtle}

CORRECT: {large-bold}  {huge-bold}
WRONG:   {bold-large}  {bold-huge}
```

Follow adjective-noun order (natural English grammar).

---

**3. Glassmorphism Support**

Every component should support glass variants:
- `{glass}` - Standard glassmorphism
- `{light-glass}` - Light transparency
- `{heavy-glass}` - Heavy frosted effect
- `{subtle-glass}` - Barely-there translucency

---

**4. Dark Mode by Default**

All component CSS must include dark mode:

```css
.component {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.dark .component {
  background: var(--bg-primary-dark);
  color: var(--text-primary-dark);
}
```

---

**5. Responsive Behavior**

Components should gracefully adapt:
- Desktop: Full layout
- Tablet: Adjusted layout
- Mobile: Stacked or simplified

Test every component at 375px (mobile), 768px (tablet), 1024px+ (desktop).

---

**6. Accessibility First**

- Semantic HTML5 elements
- ARIA attributes where needed
- Keyboard navigation
- Screen reader tested
- Color contrast WCAG AA minimum

---

**7. Composable**

Components should nest and combine:

```taildown
:::card {glass}
:::details
**Expand for more**
:::grid {2}
More components inside
:::
:::
:::
```
:::

---

### 7.2 Testing Requirements {large-bold primary}

:::card {elevated padded}
**For Every Component:**

**1. Syntax Tests**
- :icon[square]{muted} Basic usage
- :icon[square]{muted} All variants
- :icon[square]{muted} Attribute combinations
- :icon[square]{muted} Edge cases

**2. Integration Tests**
- :icon[square]{muted} Nesting with other components
- :icon[square]{muted} Inside grids
- :icon[square]{muted} Inside cards
- :icon[square]{muted} Multiple instances

**3. Visual Tests**
- :icon[square]{muted} Compile test file
- :icon[square]{muted} Inspect HTML structure
- :icon[square]{muted} Check CSS classes
- :icon[square]{muted} Verify dark mode
- :icon[square]{muted} Test mobile responsive

**4. Accessibility Tests**
- :icon[square]{muted} Screen reader navigation
- :icon[square]{muted} Keyboard interaction
- :icon[square]{muted} Color contrast check
- :icon[square]{muted} ARIA attributes present

**5. Performance Tests**
- :icon[square]{muted} Compilation speed maintained
- :icon[square]{muted} CSS bundle size reasonable
- :icon[square]{muted} JavaScript tree-shaking works

**Test Template Location:** `syntax-tests/fixtures/XX-component-name/`
:::

---

### 7.3 Documentation Requirements {large-bold primary}

:::card {glass padded}
**For Every Component, Update:**

**1. SYNTAX.md**
- Add to §3.4 Standard Components table
- Create new subsection with:
  - Purpose description
  - Basic syntax
  - All variants
  - Examples
  - Accessibility notes

**2. docs-site/components.td**
- Add section with:
  - Live examples
  - All variants demonstrated
  - Usage summary
  - Best practices

**3. Create Example File**
- `examples/XX-component-showcase.td`
- Demonstrate all variants
- Show nesting scenarios
- Include best practices

**4. Update Plain English Reference**
- If new shorthands added
- Document in docs-site/plain-english.td

**5. README.md**
- Update component count
- Update features list
- Update examples list
:::

---

## Part 8: Detailed Implementation Specifications {huge-bold center primary}

### 8.1 Multi-Column Layout Implementation {large-bold primary}

:::tabs
## Syntax Design

```taildown
:::columns {2}
Long content automatically flows between two columns. This is perfect for:

- Newsletter layouts
- Magazine articles
- Blog posts with better readability
- Side-by-side comparisons

The content breaks naturally at good points, and headings stay with their following paragraphs.
:::

:::columns {3 gap-lg balanced}
Three columns with large gaps and balanced heights.
:::

:::columns {auto}
Automatic column count based on viewport width.
:::
```

## Component Definition

```typescript
export const columnsComponent: ComponentDefinition = {
  name: 'columns',
  type: 'block',
  category: 'layout',
  
  defaultClasses: [
    'taildown-columns',
    'column-gap'
  ],
  
  variants: {
    '2': ['columns-2'],
    '3': ['columns-3'],
    '4': ['columns-4'],
    'auto': ['columns-auto'],
    'balanced': ['columns-balanced'],
    'gap-sm': ['column-gap-sm'],
    'gap-lg': ['column-gap-lg']
  }
};
```

## CSS Implementation

```css
.taildown-columns {
  column-gap: 2rem;
  line-height: 1.75;
}

.columns-2 {
  column-count: 2;
}

.columns-3 {
  column-count: 3;
}

.columns-4 {
  column-count: 4;
}

.columns-auto {
  column-width: 300px;
  column-count: auto;
}

/* Responsive */
@media (max-width: 767px) {
  .taildown-columns {
    column-count: 1 !important;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .columns-3, .columns-4 {
    column-count: 2;
  }
}

/* Prevent breaks */
.taildown-columns h1,
.taildown-columns h2,
.taildown-columns h3,
.taildown-columns h4 {
  break-after: avoid;
  column-break-after: avoid;
}

.taildown-columns p,
.taildown-columns li {
  break-inside: avoid;
  column-break-inside: avoid;
}

/* Column rule (divider) */
.taildown-columns {
  column-rule: 1px solid var(--border-color);
}

.dark .taildown-columns {
  column-rule: 1px solid var(--border-dark);
}

/* Gap variants */
.column-gap-sm {
  column-gap: 1rem;
}

.column-gap-lg {
  column-gap: 3rem;
}

/* Balanced */
.columns-balanced {
  column-fill: balance;
}
```
:::

---

### 8.2 Stats/Metrics Implementation {large-bold primary}

:::tabs
## Syntax Design

```taildown
:::stats {grid-4}
**10,000+** {huge-bold primary}
Active Users

**99.9%** {huge-bold success}
Uptime Guarantee

**50ms** {huge-bold warning}
Average Response Time

**24/7** {huge-bold info}
Customer Support
:::

:::stats {glass cols-3 center}
Three stats with glassmorphism and center alignment
:::
```

## Component Definition

```typescript
export const statsComponent: ComponentDefinition = {
  name: 'stats',
  type: 'block',
  category: 'display',
  
  defaultClasses: [
    'taildown-stats',
    'grid',
    'gap-6'
  ],
  
  variants: {
    'grid-2': ['grid-cols-1', 'md:grid-cols-2'],
    'grid-3': ['grid-cols-1', 'md:grid-cols-3'],
    'grid-4': ['grid-cols-2', 'md:grid-cols-4'],
    'cols-2': ['grid-cols-2'],
    'cols-3': ['grid-cols-3'],
    'cols-4': ['grid-cols-4'],
    'center': ['text-center']
  }
};
```

## Renderer Logic

```typescript
export function renderStats(node: any, classes: string[]): Element {
  const children = node.children || [];
  const stats = [];
  
  let currentStat = { number: null, label: [] };
  
  // Parse children into stat items
  for (const child of children) {
    if (child.type === 'paragraph') {
      const text = extractText(child);
      // First paragraph = number
      if (!currentStat.number) {
        currentStat.number = child;
      } else {
        // Subsequent paragraphs = label
        currentStat.label.push(child);
      }
    }
    
    // On blank line or end, save stat
    if (isBlankOrEnd) {
      stats.push(currentStat);
      currentStat = { number: null, label: [] };
    }
  }
  
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: classes },
    children: stats.map(stat => ({
      type: 'element',
      tagName: 'div',
      properties: { className: ['stat-item'] },
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['stat-number'] },
          children: [stat.number]
        },
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['stat-label'] },
          children: stat.label
        }
      ]
    }))
  };
}
```

## CSS Implementation

```css
.taildown-stats {
  display: grid;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  transition: all 300ms;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Dark mode */
.dark .stat-item {
  background: var(--bg-secondary-dark);
  border-color: var(--border-dark);
}

/* Responsive */
@media (max-width: 767px) {
  .taildown-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
```

## Optional JavaScript (Count-up)

```javascript
// Optional count-up animation behavior
function statsCountUp() {
  const stats = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        const finalValue = parseFloat(entry.target.textContent);
        if (!isNaN(finalValue)) {
          animateCount(entry.target, 0, finalValue, 2000);
          entry.target.dataset.counted = 'true';
        }
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => observer.observe(stat));
}

function animateCount(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      element.textContent = formatNumber(end);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}
```

**Size:** ~1KB for count-up behavior (only included if stats component detected)
:::

---

## Part 9: Release Strategy {huge-bold center primary}

### 9.1 Phased Rollout {large-bold primary}

:::card {heavy-glass padded-xl}
**Phase 1: Quick Wins (Week 1-2)**

**Release:** v0.2.0 (Minor version bump)

**Components:**
- Details/Summary
- Callout/Admonition
- Multi-Column Layout
- Definition List
- Stats Display

**Impact:**
- 5 new components
- Total: 23 components
- Documentation and content creation unlocked

**Release Notes:**
```markdown
# Taildown v0.2.0 - Documentation & Content Components

## New Components
- Details/Summary for progressive disclosure
- Callout for documentation highlights (note, tip, warning, danger)
- Multi-column layouts for magazine-style content
- Definition lists for glossaries
- Stats display for landing page metrics

## Use Cases Unlocked
- Professional technical documentation
- Magazine and newsletter layouts
- API reference documentation
- Landing page statistics

## Examples Added
- 15-progressive-disclosure.td
- 16-documentation-callouts.td
- 17-magazine-layout.td
- 18-glossary.td
- 19-landing-stats.td
```

---

**Phase 2: Professional Features (Week 3-4)**

**Release:** v0.3.0 (Minor version bump)

**Components:**
- Timeline
- Stepper/Progress
- Code Comparison
- Pricing Table
- Testimonials

**Impact:**
- 5 more components
- Total: 28 components
- Commercial and storytelling use cases

**Release Notes:**
```markdown
# Taildown v0.3.0 - Commercial & Storytelling Components

## New Components
- Timeline for chronological content
- Stepper for multi-step processes
- Code comparison for migration guides
- Pricing tables for SaaS pages
- Testimonials for social proof

## Use Cases Unlocked
- SaaS landing pages with pricing
- Company history and milestones
- Educational content with step progression
- Migration documentation
- Social proof and credibility

## Examples Added
- 20-company-history.td
- 21-onboarding-flow.td
- 22-migration-guide.td
- 23-saas-pricing.td
- 24-customer-reviews.td
```

---

**Phase 3: Configuration & Polish (Week 5-6)**

**Release:** v0.4.0 (Minor version bump)

**Features:**
- Theme preset system
- Component default overrides
- Animation configuration
- Variable references
- Responsive shorthands

**Impact:**
- Enhanced customization
- Project-wide consistency
- Better developer experience

**Release Notes:**
```markdown
# Taildown v0.4.0 - Configuration & Customization

## Configuration Enhancements
- Theme presets (ocean, forest, sunset, midnight)
- Component default overrides
- Animation fine-tuning
- Variable reference system ($brand-primary)
- Responsive shorthand syntax

## Developer Experience
- Less repetition with defaults
- Consistent styling with variables
- Quick theme switching
- Fine-grained responsive control
```
:::

---

### 9.2 Backward Compatibility {large-bold primary}

:::card {light-glass padded}
**Guarantee:**

All existing Taildown documents will continue to compile identically. New components and syntax are purely additive.

**Versioning:**
- Minor version bumps (0.2.0, 0.3.0, 0.4.0) for new features
- No breaking changes until 1.0.0
- Deprecation warnings before removal

**Migration:**
- No migration needed
- New features optional
- Existing syntax unchanged
:::

---

## Part 10: Quick Reference {huge-bold center primary}

### 10.1 Component Quick Reference {large-bold primary}

:::card {elevated padded}
| Component | Syntax | Use Case | Priority | Days |
|-----------|--------|----------|----------|------|
| **Details/Summary** | `:::details` | FAQ, disclosure | Tier 1 | 1 |
| **Callout** | `:::callout {note}` | Docs highlights | Tier 1 | 1 |
| **Multi-Column** | `:::columns {2}` | Magazine layout | Tier 1 | 1 |
| **Definitions** | `:::definitions` | Glossaries | Tier 1 | 1 |
| **Stats** | `:::stats {grid-4}` | Landing stats | Tier 1 | 1 |
| **Timeline** | `:::timeline` | Chronology | Tier 2 | 2 |
| **Stepper** | `:::stepper` | Multi-step | Tier 2 | 2 |
| **Code Compare** | `:::code-compare` | Migrations | Tier 2 | 2 |
| **Pricing** | `:::pricing` | SaaS plans | Tier 2 | 3 |
| **Testimonials** | `:::testimonials` | Social proof | Tier 2 | 2 |

**Total:** 10 components, 16 days
:::

---

### 10.2 Implementation Order {large-bold primary}

:::card {glass padded}
**Recommended Sequence:**

**Day 1:** Details/Summary  
**Day 2:** Callout  
**Day 3:** Multi-Column  
**Day 4:** Definitions  
**Day 5:** Stats  
**Days 6-7:** Timeline  
**Days 8-9:** Stepper  
**Days 10-11:** Code Compare  
**Days 12-14:** Pricing  
**Days 15-16:** Testimonials

**Why This Order:**
- Easiest first (build momentum)
- Related components together
- Most valuable early
- Complex components last (more experience)
:::

---

## Part 11: Success Metrics {huge-bold center primary}

:::card {heavy-glass padded-xl}
**After Tier 1 Implementation (Week 2):**

- :icon[check]{success} **Components:** 18 → 23 (27% increase)
- :icon[check]{success} **Use Cases:** Documentation, content creation, landing stats
- :icon[check]{success} **Compile Time:** Still under 100ms for typical docs
- :icon[check]{success} **Bundle Size:** Tree-shaking keeps unused components out
- :icon[check]{success} **Examples:** 14 → 19 example files
- :icon[check]{success} **Test Coverage:** All components 100% tested

**After Tier 2 Implementation (Week 4):**

- :icon[check]{success} **Components:** 23 → 28 (55% total increase)
- :icon[check]{success} **Use Cases:** + SaaS marketing, storytelling, education, e-commerce
- :icon[check]{success} **Professional Ready:** Can build commercial-grade sites
- :icon[check]{success} **Examples:** 19 → 24 example files
- :icon[check]{success} **Documentation:** Complete component reference

**After Configuration Enhancements (Week 6):**

- :icon[check]{success} **Customization:** Theme presets + custom themes
- :icon[check]{success} **Consistency:** Component defaults system
- :icon[check]{success} **Flexibility:** Variable references
- :icon[check]{success} **Developer Experience:** Significantly improved
:::

---

## Conclusion {huge-bold center primary}

:::card {heavy-glass padded-xl center}
:icon[rocket]{primary huge}

**Ready to Implement** {huge-bold primary}

This plan provides 10 high-value components that dramatically expand Taildown's capabilities for creating professional documentation, SaaS landing pages, educational content, and marketing sites. {large-muted}

**Key Strengths:**
- :icon[check]{success} All "easy wins" (low to medium complexity)
- :icon[check]{success} Clear implementation specifications
- :icon[check]{success} 16-day timeline (realistic)
- :icon[check]{success} Maintains Taildown philosophy (zero-config, beautiful)
- :icon[check]{success} Tree-shaking keeps bundle sizes minimal

**Next Step:** Begin with Details/Summary component (highest priority, 1 day). {muted}

:::button-group
[Start Implementation](#){button primary large hover-lift} [View Specifications](#){button secondary large} [Review Timeline](#){button info large}
:::
:::

---

**Plan by:** AI Research Assistant  
**Date:** 2025-10-10  
**Version:** 1.0.0  
**Type:** Implementation Plan (Language Components)  
**Scope:** Taildown output features (not editor tool)  
**Timeline:** 16 days for Tier 1 & 2  
**Impact:** 55% more components, massive use case expansion

*Following PROJECT-RULES.td: Professional format, icons via `:icon[]`, glassmorphism, plain English*
