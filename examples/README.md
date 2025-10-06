# Taildown Examples

This directory contains 11 example documents demonstrating progressively more complex features of Taildown.

## Quick Start

Compile any example:

```bash
taildown compile examples/01-basic-markdown.td -o output.html --inline
```

Or compile all examples:

```bash
for file in examples/*.td; do
  taildown compile "$file" -o "${file%.td}.html" --inline
done
```

## Phase 2 Features

All examples have been updated to showcase Taildown Phase 2 features:

### Plain English Syntax
Natural language shorthands replace verbose CSS classes:

```taildown
Before (Phase 1):  {.text-lg .font-bold .text-center}
After (Phase 2):   {large-bold center}
```

**Available Shorthands:**
- **Typography:** `large`, `huge`, `bold`, `italic`, `center`
- **Spacing:** `padded`, `gap`, `tight-lines`, `relaxed-lines`
- **Effects:** `rounded`, `shadow`, `elevated`, `floating`
- **Glass:** `glass`, `subtle-glass`, `light-glass`, `heavy-glass`
- **Animations:** `fade-in`, `slide-up`, `zoom-in`, `hover-lift`, `hover-glow`
- **Combinations:** `large-bold`, `huge-bold`, `bold-primary`, `large-muted`

See SYNTAX.md §2.7 for the complete grammar reference.

### Icon System
Inline SVG icons from the Lucide library (1000+ icons):

```taildown
Basic icon:          :icon[home]
With styling:        :icon[search]{large primary}
In headings:         ## Welcome :icon[wave]{large}
In buttons:          [Click :icon[arrow-right]](#){button primary}
```

**Common Icons:**
- **Navigation:** `home`, `menu`, `search`, `settings`, `user`
- **Actions:** `check`, `x`, `plus`, `minus`, `edit`, `trash`
- **Arrows:** `arrow-right`, `arrow-left`, `chevron-right`
- **Social:** `github`, `twitter`, `linkedin`, `mail`
- **UI:** `heart`, `star`, `bookmark`, `share`, `bell`

See SYNTAX.md §2.6 for icon syntax specification.

### Glassmorphism Effects
Professional frosted glass effects for modern UIs:

```taildown
:::card {subtle-glass}     - Minimal transparency (90%)
:::card {light-glass}      - Light transparency (75%)
:::card {glass}            - Medium transparency (60%)
:::card {heavy-glass}      - Heavy transparency (40%)
```

All glass variants include automatic hover effects and smooth transitions.

### Animation System
Elegant entrance and hover animations with `prefers-reduced-motion` support:

```taildown
Entrance:  {fade-in}      - Fade in smoothly
           {slide-up}     - Slide up from below
           {zoom-in}      - Scale from small

Hover:     {hover-lift}   - Lift on hover
           {hover-glow}   - Glow effect on hover
           {hover-scale}  - Subtle scale on hover
```

## Examples Overview

### 01. Basic Markdown (`01-basic-markdown.td`)
**Complexity:** Beginner  
**Features:** Standard Markdown, GFM extensions  
**Use Case:** Learn what Markdown features are supported

Demonstrates all standard Markdown syntax including:
- Text formatting (bold, italic, strikethrough)
- Lists (ordered, unordered, task lists)
- Links and images
- Code blocks with syntax highlighting
- Blockquotes
- Tables

### 02. Inline Attributes (`02-inline-attributes.td`)
**Complexity:** Beginner  
**Features:** Plain English styling on Markdown elements  
**Use Case:** Style individual elements with natural language shorthands

Shows how to add CSS classes to:
- Headings with different sizes and colors
- Paragraphs with alignment and spacing
- Links styled as buttons
- Multiple classes on single elements

### 03. Component Basics (`03-component-basics.td`)
**Complexity:** Intermediate  
**Features:** Card, button, alert, badge components with variants  
**Use Case:** Learn standard components with plain English variants

Introduces:
- `:::card` for content blocks
- `:::container` for page layout
- Empty components
- Components with custom attributes

### 04. Grid Layouts (`04-grid-layouts.td`)
**Complexity:** Intermediate  
**Features:** Responsive grid system with icons  
**Use Case:** Create responsive multi-column layouts

Demonstrates:
- Basic 3-column grid
- Responsive behavior (mobile/tablet/desktop)
- Feature grids with inline icons
- Custom grid spacing with plain English

### 05. Nested Components (`05-nested-components.td`)
**Complexity:** Intermediate  
**Features:** Component nesting with variants  
**Use Case:** Build complex layouts with nested containers

Shows:
- Card inside container
- Multiple cards in container with different variants
- Grid inside container
- Deep nesting (cards within cards)

### 06. Real-World Landing Page (`06-real-world-landing.td`)
**Complexity:** Advanced  
**Features:** Full landing page with glassmorphism and icons  
**Use Case:** SaaS product marketing site

Complete landing page with:
- Hero section with CTA buttons and icons
- Feature grid with icon integration
- Pricing cards with glass effects
- Customer testimonials
- Responsive layout with animations

### 07. Documentation Page (`07-documentation-page.td`)
**Complexity:** Advanced  
**Features:** Technical documentation with plain English  
**Use Case:** API reference, developer docs

Professional API documentation with:
- Authentication guide with icons
- Endpoint documentation
- Request/response examples in code blocks
- Error handling reference
- Rate limiting table
- SDK links with external icons

### 08. Blog Post (`08-blog-post.td`)
**Complexity:** Advanced  
**Features:** Long-form content with icons  
**Use Case:** Technical blog, articles, tutorials

Comprehensive blog post featuring:
- Article metadata with icons (author, date, reading time)
- Table of contents with navigation
- Pros/cons cards with check/x icons
- Code examples with syntax highlighting
- Tables and diagrams
- Pull quotes with styling
- Case study section

### 09. Portfolio Page (`09-portfolio-page.td`)
**Complexity:** Advanced  
**Features:** Personal portfolio with glassmorphism  
**Use Case:** Developer portfolio, resume

Professional portfolio with:
- Skills grid with icons (4 categories)
- Featured projects with tech stack icons
- Work experience timeline
- Open source contributions with GitHub icons
- Education and awards
- Blog posts and contact section with social icons

### 10. Complete Page (`10-complete-page.td`)
**Complexity:** Expert  
**Features:** Everything - Plain English, icons, glass, animations  
**Use Case:** Comprehensive Phase 2 feature demonstration

Kitchen-sink example showcasing:
- All Markdown features
- All inline attribute styles
- All component types
- Multiple grid layouts
- Deep nesting
- E-commerce product cards
- Team member profiles
- Testimonials grid
- Call-to-action sections
- Statistics display
- Technical specifications

### 11. Text Illustrations (`11-text-illustrations.td`)
**Complexity:** Intermediate  
**Features:** File trees, flow diagrams, ASCII art  
**Use Case:** Technical documentation, project structures, process diagrams

Professional text-based illustration components:
- File/directory tree visualization with syntax highlighting
- Flow diagrams with vertical and horizontal layouts
- ASCII art with modern styling and glassmorphism
- Unicode box-drawing characters
- Mobile-optimized with horizontal scroll
- Multiple variants for each component type

## File Sizes

| Example | Lines | Size | Compile Time |
|---------|-------|------|--------------|
| 01-basic-markdown.td | 85 | 1.4 KB | ~8ms |
| 02-inline-attributes.td | 48 | 1.3 KB | ~7ms |
| 03-component-basics.td | 51 | 1.3 KB | ~7ms |
| 04-grid-layouts.td | 61 | 1.2 KB | ~8ms |
| 05-nested-components.td | 70 | 1.5 KB | ~8ms |
| 06-real-world-landing.td | 124 | 3.2 KB | ~10ms |
| 07-documentation-page.td | 169 | 4.3 KB | ~11ms |
| 08-blog-post.td | 265 | 7.7 KB | ~12ms |
| 09-portfolio-page.td | 215 | 5.7 KB | ~11ms |
| 10-complete-page.td | 289 | 7.9 KB | ~13ms |
| 11-text-illustrations.td | 202 | 6.7 KB | ~11ms |

**Total:** 1,579 lines • 42.2 KB

## Learning Path

We recommend following the examples in order:

1. Start with **01-basic-markdown** to understand Markdown support
2. Move to **02-inline-attributes** to learn styling
3. Learn components with **03-component-basics**
4. Master layouts with **04-grid-layouts**
5. Understand nesting with **05-nested-components**
6. Study real-world examples **06-10** for inspiration

## Compiling Examples

### Single File

```bash
# With inline CSS
taildown compile examples/01-basic-markdown.td -o output.html --inline

# With external CSS
taildown compile examples/01-basic-markdown.td -o output.html --css styles.css

# Minified
taildown compile examples/01-basic-markdown.td -o output.html --inline --minify
```

### Batch Processing

**Bash/Linux:**
```bash
for file in examples/*.td; do
  taildown compile "$file" -o "${file%.td}.html" --inline
done
```

**PowerShell:**
```powershell
Get-ChildItem examples/*.td | ForEach-Object {
  taildown compile $_.FullName -o ($_.FullName -replace '.td$','.html') --inline
}
```

## Example Highlights

### Most Features
**10-complete-page.td** - Uses every Taildown feature

### Best for Learning
**03-component-basics.td** - Clear, simple introduction

### Most Practical
**06-real-world-landing.td** - Ready-to-use landing page template

### Most Complex
**08-blog-post.td** - Long-form content with rich formatting

### Best Structure
**07-documentation-page.td** - Well-organized technical content

## Common Patterns

### Hero Section with Icons
```taildown
# Product Name {huge-bold center}
## Tagline here {large muted center}

[Get Started :icon[arrow-right]](#){button primary large hover-lift}
```

### Feature Grid with Icons
```taildown
:::grid
:::card {elevated hover-lift}
### :icon[check]{success} Feature 1
Description with natural language styling.
:::

:::card {elevated hover-lift}
### :icon[star]{primary} Feature 2
Description with icons integrated inline.
:::

:::card {elevated hover-lift}
### :icon[zap]{warning} Feature 3
Description with plain English classes.
:::
:::
```

### Pricing Cards with Glassmorphism
```taildown
:::grid
:::card {subtle-glass padded-lg}
### Starter Plan
#### $29/month {huge bold-primary}

- Feature 1 :icon[check]{success small}
- Feature 2 :icon[check]{success small}
- Feature 3 :icon[check]{success small}

[Choose Plan](#){button primary hover-glow}
:::

:::card {light-glass padded-lg}
### Pro Plan {primary}
#### $99/month {huge bold-primary}

- All Starter features
- Feature 4 :icon[check]{success small}
- Feature 5 :icon[check]{success small}

[Choose Plan](#){button primary large hover-glow}
:::
:::
```

## Tips for Using Examples

1. **Copy and Modify** - These examples are MIT licensed, use them freely
2. **Mix and Match** - Combine sections from different examples
3. **Check the HTML** - Compile and view source to understand the output
4. **Experiment** - Try changing classes and content
5. **Performance** - All examples compile in <15ms

## Need Help?

- Read the **SYNTAX.md** for specification details
- Check **README.md** for general Taildown documentation
- View **test fixtures** in `syntax-tests/fixtures/` for edge cases

## Contributing Examples

Have a great example to share? Please contribute!

1. Create a new `.td` file in this directory
2. Follow the naming convention (`##-description.td`)
3. Add complexity level and feature tags
4. Test that it compiles successfully
5. Submit a pull request

---

**Generated with Taildown** • Examples last updated: October 6, 2025

