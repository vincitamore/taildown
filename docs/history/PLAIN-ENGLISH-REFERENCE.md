# Plain English Syntax Reference

**Phase 2 Feature**  
**Version:** 0.2.0  
**Status:** Implementation Ready

---

## Quick Reference

This document provides a comprehensive reference for Taildown's plain English syntax - an intuitive alternative to Tailwind CSS class names.

---

## 🎨 Colors

### Semantic Colors

| Plain English | CSS Classes | Example |
|--------------|-------------|---------|
| `primary` | `text-primary-600 hover:text-primary-700` | `{primary}` |
| `secondary` | `text-secondary-600 hover:text-secondary-700` | `{secondary}` |
| `accent` | `text-accent-600 hover:text-accent-700` | `{accent}` |

### With Prefixes

| Plain English | CSS Classes | Example |
|--------------|-------------|---------|
| `bg-primary` | `bg-primary-600 hover:bg-primary-700` | `{bg-primary}` |
| `bg-secondary` | `bg-secondary-600 hover:bg-secondary-700` | `{bg-secondary}` |
| `bg-accent` | `bg-accent-600 hover:bg-accent-700` | `{bg-accent}` |
| `border-primary` | `border-primary-600` | `{border-primary}` |

### State Colors

| Plain English | CSS Class | Use Case |
|--------------|-----------|----------|
| `muted` | `text-gray-500` | Subtle, secondary text |
| `success` | `text-green-600` | Success messages |
| `warning` | `text-yellow-600` | Warnings |
| `error` | `text-red-600` | Error messages |
| `info` | `text-blue-600` | Information |

**Example:**
```taildown
# Main Heading {primary}
## Subheading {secondary}
Success message! {success bold}
```

---

## 📝 Typography

### Sizes

| Plain English | CSS Class | Size | Example |
|--------------|-----------|------|---------|
| `xs` | `text-xs` | 0.75rem | Very small |
| `small` | `text-sm` | 0.875rem | Small |
| `base` | `text-base` | 1rem | Normal |
| `large` | `text-lg` | 1.125rem | Large |
| `xl` | `text-xl` | 1.25rem | Extra large |
| `2xl` | `text-2xl` | 1.5rem | 2× large |
| `3xl` | `text-3xl` | 1.875rem | 3× large |
| `4xl` | `text-4xl` | 2.25rem | 4× large |
| `huge` | `text-4xl` | 2.25rem | Alias for 4xl |
| `massive` | `text-6xl` | 3.75rem | Very large |

### Weight

| Plain English | CSS Class | Weight |
|--------------|-----------|--------|
| `light` | `font-light` | 300 |
| `normal` | `font-normal` | 400 |
| `medium` | `font-medium` | 500 |
| `semibold` | `font-semibold` | 600 |
| `bold` | `font-bold` | 700 |

### Alignment

| Plain English | CSS Class | Alignment |
|--------------|-----------|-----------|
| `left` | `text-left` | Left-aligned |
| `center` | `text-center` | Center-aligned |
| `right` | `text-right` | Right-aligned |

**Example:**
```taildown
# Hero Title {massive bold center primary}
## Subtitle {2xl medium center secondary}
Regular paragraph text. {base}
Small print. {small muted}
```

---

## 📐 Layout & Spacing

### Flexbox

| Plain English | CSS Classes | Description |
|--------------|-------------|-------------|
| `flex` | `flex items-center` | Flex with centered items |
| `flex-col` | `flex flex-col` | Vertical flex |
| `center` | `text-center` | Center text |
| `center-x` | `mx-auto` | Center horizontally |
| `center-y` | `my-auto` | Center vertically |

### Grid

| Plain English | CSS Classes | Description |
|--------------|-------------|-------------|
| `grid-2` | `grid grid-cols-2` | 2-column grid |
| `grid-3` | `grid grid-cols-3` | 3-column grid |
| `grid-4` | `grid grid-cols-4` | 4-column grid |

### Gaps

| Plain English | CSS Class | Size |
|--------------|-----------|------|
| `gap-sm` | `gap-2` | 0.5rem (8px) |
| `gap` | `gap-4` | 1rem (16px) |
| `gap-lg` | `gap-8` | 2rem (32px) |

### Padding

| Plain English | CSS Class | Size |
|--------------|-----------|------|
| `padded-sm` | `p-4` | 1rem |
| `padded` | `p-6` | 1.5rem |
| `padded-lg` | `p-8` | 2rem |
| `padded-xl` | `p-12` | 3rem |

### Vertical Spacing

| Plain English | CSS Class | Description |
|--------------|-----------|-------------|
| `tight` | `space-y-1` | Tight vertical spacing |
| `relaxed` | `space-y-4` | Relaxed vertical spacing |
| `loose` | `space-y-8` | Loose vertical spacing |

**Example:**
```taildown
:::container {padded-lg}
:::grid {grid-3 gap-lg}
:::card {padded}
Content
:::
:::
:::
```

---

## ✨ Effects

### Shadows

| Plain English | CSS Class | Description |
|--------------|-----------|-------------|
| `shadow` | `shadow-md` | Basic shadow |
| `elevated` | `shadow-xl` | Elevated shadow |
| `floating` | `shadow-2xl` | Floating effect |

### Border Radius

| Plain English | CSS Class | Radius |
|--------------|-----------|--------|
| `rounded-sm` | `rounded-md` | Small rounded |
| `rounded` | `rounded-lg` | Normal rounded |
| `rounded-full` | `rounded-full` | Fully rounded |

### Glassmorphism 💎

| Plain English | CSS Classes | Description |
|--------------|-------------|-------------|
| `glass` | `backdrop-blur-md bg-white/80 border border-white/20` | Light glass effect |
| `glass-dark` | `backdrop-blur-md bg-black/60 border border-white/10` | Dark glass effect |

### Special Effects

| Plain English | CSS Classes | Description |
|--------------|-------------|-------------|
| `gradient` | `bg-gradient-to-r from-primary-600 to-accent-600` | Gradient background |
| `glow` | `shadow-lg shadow-primary-500/50` | Glowing shadow |

**Example:**
```taildown
:::card {glass elevated rounded}
# Glassmorphic Card
Beautiful frosted glass effect
:::

:::card {glow rounded}
# Glowing Card
Subtle glow around the edges
:::
```

---

## 🎭 Transitions & Animations

### Speed

| Plain English | CSS Classes | Duration |
|--------------|-------------|----------|
| `fast` | `transition-all duration-150` | 150ms |
| `smooth` | `transition-all duration-300 ease-out` | 300ms |
| `slow` | `transition-all duration-500` | 500ms |

### Hover Effects

| Plain English | CSS Classes | Description |
|--------------|-------------|-------------|
| `hover-lift` | `hover:transform hover:-translate-y-1 transition-transform` | Lifts on hover |
| `hover-grow` | `hover:scale-105 transition-transform` | Grows on hover |
| `hover-glow` | `hover:shadow-xl hover:shadow-primary-500/50 transition-shadow` | Glows on hover |

**Example:**
```taildown
:::card {elevated hover-lift smooth}
# Interactive Card
Hover over me!
:::

[Button](#){button primary hover-grow smooth}
```

---

## 🧩 Component Shorthands

### Card Variants

| Plain English | Description |
|--------------|-------------|
| `flat` | No shadow, with border |
| `elevated` | Large shadow, lifts on hover |
| `glass` | Glassmorphism effect |
| `bordered` | With visible border |
| `interactive` | Cursor pointer, lifts on hover |

**Example:**
```taildown
:::card {glass}
Content
:::

:::card {elevated hover-lift}
Content
:::
```

### Button Variants

| Plain English | Description |
|--------------|-------------|
| `primary` | Primary button style |
| `secondary` | Secondary button style |
| `outline` | Outlined button |
| `ghost` | Transparent with hover |
| `link` | Link-style button |
| `destructive` | Red/danger button |

**Sizes:**
- `sm` - Small button
- `md` - Medium (default)
- `lg` - Large button

**Example:**
```taildown
[Primary Button](#){button primary lg}
[Secondary](#){button secondary}
[Outline](#){button outline sm}
```

### Alert Types

| Plain English | Description |
|--------------|-------------|
| `info` | Blue info alert |
| `success` | Green success alert |
| `warning` | Yellow warning alert |
| `error` | Red error alert |

**Example:**
```taildown
:::alert {success}
:icon[check-circle] Operation completed successfully!
:::

:::alert {error}
:icon[x-circle] Something went wrong.
:::
```

---

## 🎯 Icon Syntax

### Basic Usage

```taildown
:icon[heart]                    # Basic icon
:icon[heart]{large error}       # With plain English styles
:icon[github]{size-6 primary}   # Mixed styles
```

### Common Icons

| Icon Name | Description |
|-----------|-------------|
| `heart` | Heart |
| `star` | Star |
| `check` | Checkmark |
| `check-circle` | Checkmark in circle |
| `x` | X/close |
| `x-circle` | X in circle |
| `alert-triangle` | Warning triangle |
| `info` | Info circle |
| `arrow-right` | Right arrow |
| `arrow-left` | Left arrow |
| `github` | GitHub logo |
| `twitter` | Twitter logo |
| `mail` | Email |
| `phone` | Phone |
| `home` | House |
| `user` | User profile |
| `settings` | Settings gear |
| `search` | Magnifying glass |

**Example:**
```taildown
# Features :icon[star]{large accent}

:icon[check-circle]{success} Feature One
:icon[check-circle]{success} Feature Two

[Contact Us :icon[mail]](#){button primary}
```

---

## 💡 Real-World Examples

### Hero Section

```taildown
:::container {padded-xl center}
# Build Amazing Things {massive bold primary}
## With Taildown's intuitive syntax {2xl secondary}

[Get Started :icon[arrow-right]](#){button primary lg hover-lift smooth}
[Learn More](#){button outline lg}
:::
```

### Feature Cards

```taildown
:::grid {grid-3 gap-lg}

:::card {glass hover-lift smooth}
:icon[zap]{huge accent}
### Lightning Fast {large bold}
Compile documents in milliseconds {muted}
:::

:::card {glass hover-lift smooth}
:icon[palette]{huge primary}
### Beautiful Defaults {large bold}
Zero config, production-ready {muted}
:::

:::card {glass hover-lift smooth}
:icon[code]{huge secondary}
### Developer Friendly {large bold}
Plain English syntax {muted}
:::

:::
```

### Alert Messages

```taildown
:::alert {info}
:icon[info]{size-5} Remember to save your work!
:::

:::alert {success}
:icon[check-circle]{size-5} Profile updated successfully!
:::

:::alert {warning}
:icon[alert-triangle]{size-5} Your session will expire soon.
:::

:::alert {error}
:icon[x-circle]{size-5} Failed to connect to server.
:::
```

### Navigation Bar

```taildown
:::navbar {glass}
[Home :icon[home]](#){link}
[Features :icon[star]](#){link}
[Docs :icon[book]](#){link}
[GitHub :icon[github]](#){button outline sm}
:::
```

---

## 🎨 Combining Shorthands

You can combine multiple shorthands for powerful styling:

```taildown
# Heading {primary massive bold center}
# = text-primary-600, text-6xl, font-bold, text-center

[Button](#){button primary lg hover-lift smooth}
# = All button primary styles + large size + hover lift + smooth transition

:::card {glass elevated hover-grow smooth rounded}
# = Glassmorphism + elevated shadow + hover grow + smooth transition + rounded corners
```

---

## 📋 Complete Shorthand List

**Colors (15):**
`primary`, `secondary`, `accent`, `muted`, `success`, `warning`, `error`, `info`, `bg-primary`, `bg-secondary`, `bg-accent`, `border-primary`, `text-primary`, etc.

**Typography (25):**
`xs`, `small`, `base`, `large`, `xl`, `2xl`, `3xl`, `4xl`, `huge`, `massive`, `light`, `normal`, `medium`, `semibold`, `bold`, `left`, `center`, `right`, etc.

**Layout (30):**
`flex`, `flex-col`, `grid-2`, `grid-3`, `grid-4`, `center`, `center-x`, `center-y`, `padded`, `padded-sm`, `padded-lg`, `padded-xl`, `gap`, `gap-sm`, `gap-lg`, `tight`, `relaxed`, `loose`, etc.

**Effects (40):**
`rounded`, `rounded-sm`, `rounded-full`, `shadow`, `elevated`, `floating`, `glass`, `glass-dark`, `gradient`, `glow`, `smooth`, `fast`, `slow`, `hover-lift`, `hover-grow`, `hover-glow`, etc.

**Components (10):**
`button`, `primary`, `secondary`, `outline`, `ghost`, `link`, `flat`, `elevated`, `glass`, `bordered`, `interactive`, `info`, `success`, `warning`, `error`, etc.

**Total: 120+ shorthands** covering all common styling needs.

---

## 🔄 Migration from Phase 1

### Before (CSS Classes)
```taildown
:::card {.shadow-xl .rounded-lg .p-6 .bg-white .hover:shadow-2xl .transition-shadow}
# Title {.text-4xl .font-bold .text-blue-600 .text-center}
[Button](#){.bg-blue-600 .text-white .px-6 .py-3 .rounded-lg .hover:bg-blue-700}
:::
```

### After (Plain English)
```taildown
:::card {elevated rounded padded hover-lift smooth}
# Title {primary huge bold center}
[Button](#){button primary}
:::
```

**Benefits:**
- ✅ **90% shorter** syntax
- ✅ More **readable**
- ✅ Easier to **remember**
- ✅ **Consistent** patterns
- ✅ Still supports CSS classes if needed

---

## ⚙️ Configuration

Shorthands can be customized in `taildown.config.js`:

```javascript
export default {
  theme: {
    colors: {
      primary: {
        DEFAULT: '#your-color',
        600: '#your-shade',
        // ...
      }
    }
  },
  
  // Custom shorthands (Phase 3)
  shorthands: {
    'super-huge': ['text-8xl', 'font-black', 'tracking-tight']
  }
}
```

---

## 📚 See Also

- **SYNTAX.md** - Full syntax specification
- **PHASE-2-IMPLEMENTATION-PLAN.md** - Technical implementation
- **README.md** - Getting started guide
- **Component documentation** - Individual component references

---

**Last Updated:** October 4, 2025  
**Version:** 0.2.0 (Phase 2)  
**Maintained by:** Taildown Core Team

