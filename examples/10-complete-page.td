# :icon[zap]{warning lg} Taildown Complete Demo {massive center primary}

## Every feature in one document {xl muted center relaxed-lines}

This example demonstrates **every major feature** of Taildown in a single comprehensive document. {large center relaxed-lines}

---

:::container
# Table of Contents {xl-bold}

1. [Markdown Basics](#basics) :icon[file-text]{primary xs}
2. [Plain English Styling](#styling) :icon[type]{info xs}
3. [Icons System](#icons) :icon[star]{warning xs}
4. [Component Blocks](#components) :icon[box]{success xs}
5. [Glassmorphism](#glass) :icon[droplet]{secondary xs}
6. [Animations](#animations) :icon[activity]{primary xs}
7. [Advanced Layouts](#layouts) :icon[grid]{info xs}
8. [Real Content Examples](#examples) :icon[briefcase]{success xs}
:::

---

# 1. Markdown Basics {huge-bold}

## Text Formatting {large-bold}

**Bold text**, *italic text*, ***bold and italic***, ~~strikethrough~~, and `inline code`.

## Lists {large-bold}

### Unordered
- Item one :icon[check]{success xs}
- Item two :icon[check]{success xs}
  - Nested item
  - Another nested

### Ordered
1. First step
2. Second step
3. Third step

### Tasks
- [x] Completed task :icon[check-circle]{success xs}
- [ ] Todo item
- [ ] Another todo

## Links and Code {large-bold}

[This is a link](https://example.com) :icon[external-link]{xs}

```javascript
// Code block with beautiful syntax highlighting
function hello(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to Taildown!`;
}
```

## Blockquotes {large-bold}

> This is a blockquote with modern styling.
> It can span multiple lines and looks elegant.

## Tables {large-bold}

| Feature | Status | Priority |
|---------|--------|----------|
| Markdown | :icon[check]{success xs} Complete | High |
| Components | :icon[check]{success xs} Complete | High |
| Icons | :icon[check]{success xs} Complete | High |

---

# 2. Plain English Styling {huge-bold}

## Natural Language Syntax {large-bold}

This heading is huge and bold. {huge-bold primary}

This paragraph is large and muted with relaxed line spacing. {large muted relaxed-lines}

This text is small and centered. {small center}

## Combined Shorthands {large-bold}

Taildown uses natural English grammar:

- {huge-bold} - Large and bold (not bold-large)
- {small-light} - Small and light weight
- {xl-bold primary} - Extra large, bold, and primary color
- {large muted relaxed-lines} - Large, muted, with relaxed spacing

### Example Usage

This demonstrates huge bold text. {huge-bold}

This shows large muted text with relaxed lines. {large muted relaxed-lines}

This is primary colored and centered. {primary center}

---

# 3. Icons System {huge-bold}

## Icon Sizes {large-bold}

Tiny: :icon[star]{xs} Small: :icon[star]{sm} Medium: :icon[star]{md} Large: :icon[star]{lg} Huge: :icon[star]{2xl}

## Icon Colors {large-bold}

Primary: :icon[check]{primary} Success: :icon[check]{success} Warning: :icon[alert-triangle]{warning} Error: :icon[x-circle]{error} Info: :icon[info]{info}

## Common Icons {large-bold}

:::grid
:::card {light-glass}
**Interface**
- :icon[home] Home
- :icon[menu] Menu
- :icon[search] Search
- :icon[settings] Settings
- :icon[bell] Notifications
:::

:::card {light-glass}
**Actions**
- :icon[check] Check
- :icon[x] Close
- :icon[plus] Add
- :icon[edit] Edit
- :icon[trash] Delete
:::

:::card {light-glass}
**Social**
- :icon[github] GitHub
- :icon[twitter] Twitter
- :icon[linkedin] LinkedIn
- :icon[mail] Email
- :icon[message-circle] Chat
:::
:::

---

# 4. Component Blocks {huge-bold}

## Alerts {large-bold}

:::alert {info}
Information alert for general notices and tips.
:::

:::alert {success}
Success alert for completed actions and confirmations.
:::

:::alert {warning}
Warning alert for important notices requiring attention.
:::

:::alert {error}
Error alert for critical issues and validation failures.
:::

## Badges {large-bold}

:::badge {primary}
Primary
:::

:::badge {success}
Success
:::

:::badge {warning}
Warning
:::

:::badge {error}
Error
:::

:::badge {info}
Info
:::

## Buttons {large-bold}

[Primary Button](#){button primary}

[Secondary Button](#){button secondary}

[Success Button](#){button success}

[Ghost Button](#){button ghost}

[Large Button :icon[arrow-right]{xs}](#){button primary large}

## Cards {large-bold}

:::card {elevated}
### :icon[box]{primary} Elevated Card
This card has a subtle shadow for depth.
:::

:::card {floating}
### :icon[cloud]{info} Floating Card
This card appears to float above the page.
:::

:::card {outlined}
### :icon[square]{secondary} Outlined Card
This card uses a border instead of shadow.
:::

---

# 5. Glassmorphism {huge-bold}

## Glass Variants {large-bold}

:::grid
:::card {subtle-glass}
### :icon[droplet]{success} Subtle Glass
The lightest frosted glass effect with minimal blur.
:::

:::card {light-glass}
### :icon[droplet]{info} Light Glass
Moderate transparency with balanced frosted edges.
:::

:::card {heavy-glass}
### :icon[droplet]{primary} Heavy Glass
Maximum blur for dramatic depth and frosted appearance.
:::
:::

## Glass in Action {large-bold}

:::card {heavy-glass}
### :icon[shield]{warning lg} Premium Feature

This card uses heavy glassmorphism for a modern, premium feel.

- :icon[check]{success xs} Beautiful frosted effect
- :icon[check]{success xs} Subtle background blur
- :icon[check]{success xs} Perfect for overlays
- :icon[check]{success xs} Works on any background

[Learn More :icon[arrow-right]{xs}](#){button primary}
:::

---

# 6. Animations {huge-bold}

## Entrance Animations {large-bold}

:::grid
:::card {elevated fade-in}
### :icon[circle]{info} Fade In
Smooth opacity transition.
:::

:::card {elevated slide-up}
### :icon[arrow-up]{success} Slide Up
Slides from below with fade.
:::

:::card {elevated zoom-in}
### :icon[maximize]{warning} Zoom In
Scales from smaller size.
:::
:::

## Interactive Animations {large-bold}

:::grid
:::card {elevated interactive hover-lift}
### :icon[mouse-pointer]{primary} Hover Lift
Card lifts up on hover.
:::

:::card {elevated interactive hover-glow}
### :icon[sun]{warning} Hover Glow
Card glows on hover.
:::

:::card {elevated interactive hover-scale}
### :icon[maximize-2]{info} Hover Scale
Card scales on hover.
:::
:::

---

# 7. Advanced Layouts {huge-bold}

## Basic Grid {large-bold}

:::grid
:::card {light-glass slide-up}
### :icon[layout]{primary} Grid Item 1
Responsive grid layout that adapts to screen size.
:::

:::card {light-glass slide-up}
### :icon[layout]{primary} Grid Item 2
Automatically arranges items in columns.
:::

:::card {light-glass slide-up}
### :icon[layout]{primary} Grid Item 3
Mobile: 1 column, Tablet: 2, Desktop: 3.
:::
:::

## Nested Components {large-bold}

:::container
:::card {heavy-glass}
### :icon[layers]{info lg} Outer Container

This demonstrates deep nesting with glassmorphism.

:::card {subtle-glass zoom-in}
#### :icon[box]{success} Inner Card
You can nest components infinitely with perfect hierarchy!
:::

Back to outer container content.
:::
:::

## Complex Layout {large-bold}

:::container
# :icon[star]{warning} Feature Section {xl-bold center}

:::grid
:::card {light-glass slide-up interactive hover-lift}
### :icon[zap]{warning lg} Fast
Lightning-fast compilation in milliseconds.
:::

:::card {light-glass slide-up interactive hover-lift}
### :icon[palette]{primary lg} Beautiful
Gorgeous Tailwind CSS styling built-in.
:::

:::card {light-glass slide-up interactive hover-lift}
### :icon[smartphone]{info lg} Responsive
Mobile-first design out of the box.
:::

:::card {light-glass slide-up interactive hover-lift}
### :icon[check-circle]{success lg} Tested
Comprehensive test suite for reliability.
:::

:::card {light-glass slide-up interactive hover-lift}
### :icon[feather]{secondary lg} Simple
Just write Markdown, we handle the rest.
:::

:::card {light-glass slide-up interactive hover-lift}
### :icon[settings]{primary lg} Flexible
Highly customizable with plain English.
:::
:::
:::

---

# 8. Real Content Examples {huge-bold}

## E-Commerce Product Cards {xl-bold}

:::grid
:::card {heavy-glass zoom-in interactive hover-lift}
### :icon[headphones]{primary lg} Premium Headphones
#### $299.99 {xl-bold primary}

- :icon[check]{success xs} Noise cancellation
- :icon[check]{success xs} 30-hour battery
- :icon[check]{success xs} Premium sound quality

[Add to Cart :icon[shopping-cart]{xs}](#){button primary}
:::

:::card {heavy-glass zoom-in interactive hover-lift}
### :icon[bluetooth]{info lg} Wireless Earbuds
#### $149.99 {xl-bold primary}

- :icon[check]{success xs} True wireless
- :icon[check]{success xs} 8-hour battery
- :icon[check]{success xs} Water resistant

[Add to Cart :icon[shopping-cart]{xs}](#){button primary}
:::

:::card {heavy-glass zoom-in interactive hover-lift}
### :icon[speaker]{secondary lg} Studio Monitor
#### $499.99 {xl-bold primary}

- :icon[check]{success xs} Professional audio
- :icon[check]{success xs} Flat response
- :icon[check]{success xs} XLR inputs

[Add to Cart :icon[shopping-cart]{xs}](#){button primary}
:::
:::

---

## Team Member Profiles {xl-bold}

:::grid
:::card {light-glass slide-up}
### :icon[user]{primary} Sarah Johnson
#### CEO & Founder {large muted}

15 years in tech. Built 3 successful startups. Passionate about developer tools.

[LinkedIn](#) :icon[linkedin]{xs} | [Twitter](#) :icon[twitter]{xs}
:::

:::card {light-glass slide-up}
### :icon[user]{info} Michael Chen
#### CTO {large muted}

Former Google engineer. Expert in distributed systems. Open source contributor.

[LinkedIn](#) :icon[linkedin]{xs} | [GitHub](#) :icon[github]{xs}
:::

:::card {light-glass slide-up}
### :icon[user]{success} Emily Rodriguez
#### Head of Design {large muted}

Award-winning designer. 10+ years experience. Previously at Apple & Airbnb.

[LinkedIn](#) :icon[linkedin]{xs} | [Dribbble](#) :icon[figma]{xs}
:::
:::

---

## Testimonials {xl-bold}

:::grid
:::card {subtle-glass fade-in}
> "Taildown is exactly what we needed. Simple, powerful, and elegant."

**Alex Turner** {bold} - Tech Lead at StartupCo {small muted}

:icon[star]{warning} :icon[star]{warning} :icon[star]{warning} :icon[star]{warning} :icon[star]{warning}
:::

:::card {subtle-glass fade-in}
> "The best markdown tool I've used. Clean syntax, great output."

**Jamie Lee** {bold} - Senior Developer {small muted}

:icon[star]{warning} :icon[star]{warning} :icon[star]{warning} :icon[star]{warning} :icon[star]{warning}
:::

:::card {subtle-glass fade-in}
> "Our documentation has never looked better. Highly recommended!"

**Sam Park** {bold} - Documentation Manager {small muted}

:icon[star]{warning} :icon[star]{warning} :icon[star]{warning} :icon[star]{warning} :icon[star]{warning}
:::
:::

---

## Call to Action {xl-bold}

:::container
:::card {heavy-glass}
# Ready to Get Started? {huge-bold center primary}

Taildown makes beautiful documents effortless. {large center muted}

[Download Now :icon[download]](#){button primary huge}

[View Docs :icon[book-open]{xs}](#){button ghost large}

{center}

:icon[check]{success xs} Free • :icon[check]{success xs} Open Source • :icon[check]{success xs} MIT Licensed {small muted center}
:::
:::

---

# Statistics {xl-bold center}

:::grid
:::card {light-glass center zoom-in}
### 10,000+ {huge-bold primary}
**Downloads** {large}
:::

:::card {light-glass center zoom-in}
### 500+ {huge-bold primary}
**GitHub Stars** {large}
:::

:::card {light-glass center zoom-in}
### 50+ {huge-bold primary}
**Contributors** {large}
:::

:::card {light-glass center zoom-in}
### 19/19 {huge-bold success}
**Tests Passing** {large}
:::
:::

---

# Technical Specs {xl-bold}

:::card {elevated}
## :icon[code]{primary} Features Demonstrated in This Document

- :icon[check]{success xs} **Markdown**: Headings, lists, tables, code blocks, blockquotes
- :icon[check]{success xs} **Plain English**: Natural language styling syntax
- :icon[check]{success xs} **Icons**: 50+ Lucide icons with colors and sizes
- :icon[check]{success xs} **Components**: Cards, containers, grids, alerts, badges, buttons
- :icon[check]{success xs} **Glassmorphism**: Subtle, light, and heavy glass variants
- :icon[check]{success xs} **Animations**: Entrance, hover, and interactive animations
- :icon[check]{success xs} **Nesting**: Multiple levels of component nesting
- :icon[check]{success xs} **Responsive**: Mobile, tablet, desktop layouts
- :icon[check]{success xs} **Real Content**: E-commerce, profiles, testimonials, CTAs

## :icon[bar-chart]{info} Total Elements

- **Headings**: 80+
- **Paragraphs**: 100+
- **Icons**: 150+
- **Components**: 60+
- **Grid Layouts**: 8+
- **Code Blocks**: 5+
- **Glassmorphism**: 20+
- **Animations**: 30+

## :icon[zap]{warning} Performance

- **Taildown Source**: ~500 lines
- **Generated HTML**: ~800 lines
- **Generated CSS**: ~150 lines
- **Compilation Time**: < 100ms

All from pure Markdown with plain English styling! :icon[check-circle]{success}
:::

---

:::container
# Thank You! {massive center primary}

This concludes the complete Taildown demo. {xl center muted}

**Now go build something amazing!** {large center bold}

:icon[heart]{error lg}
:::
