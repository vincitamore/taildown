:::navbar
# Taildown

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html) [Live Editor](editor.html)
:::



# Getting Started with Taildown {huge-bold center primary}

**From zero to beautiful documents in 5 minutes** {center large muted}

---

## Installation {large-bold primary}

:::tabs
## npm (Coming Soon)

```bash
# Global installation
npm install -g taildown

# Or use npx
npx taildown compile document.td
```

## Clone Repository

```bash
# Clone the repository
git clone https://github.com/vincitamore/taildown.git
cd taildown

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

## Manual Setup

1. Download the latest release from GitHub
2. Extract to your preferred location
3. Run `pnpm install` in the extracted directory
4. Run `pnpm build` to compile packages
:::

---

## Your First Document {large-bold primary}

Create a file named `my-first-document.td`:

```taildown
# Hello World {huge-bold center primary}

Welcome to Taildown! {large muted center}

:::card {light-glass slide-up}
## Your First Card {medium-bold}

This is a card with glassmorphism and a slide-up animation!

- :icon[check]{success} Beautiful by default
- :icon[check]{success} No configuration needed
- :icon[check]{success} Dark mode included

[Learn More](#){button primary}
:::
```

---

## Compile Your Document {large-bold primary}

:::card {elevated padded}
### Basic Compilation

```bash
pnpm taildown compile my-first-document.td
```

This creates:
- `my-first-document.html` - Self-contained HTML with embedded CSS and JavaScript

### Separate CSS File

```bash
pnpm taildown compile my-first-document.td --separate
```

This creates:
- `my-first-document.html` - HTML file
- `my-first-document.css` - Separate CSS file

### Custom Output

```bash
pnpm taildown compile my-first-document.td -o output/index.html --css output/styles.css
```
:::

---

## Understanding the Output {large-bold primary}

:::grid {2}
:::card {light-glass}
### :icon[file]{primary} HTML Output {medium-bold}

- Semantic HTML5 structure
- Proper heading hierarchy
- Accessible ARIA attributes
- Mobile-responsive viewport
- Dark mode support

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>/* CSS here */</style>
</head>
<body>
  <!-- Your content -->
  <script>/* JS here */</script>
</body>
</html>
```
:::

:::card {light-glass}
### :icon[palette]{accent} CSS Output {medium-bold}

- Tailwind-inspired utilities
- CSS custom properties for themes
- Dark mode with `.dark` class
- Glassmorphism effects
- Scroll animations
- Component styles

```css
:root {
  --primary: #3b82f6;
  --background: #ffffff;
}

.dark {
  --background: #030712;
}
```
:::
:::

---

## Basic Syntax Overview {large-bold primary}

:::tabs
## Plain English Styling

Use natural language for styling:

```taildown
# Large Bold Primary Heading {huge-bold primary center}

This paragraph has muted text and relaxed line spacing. {large muted relaxed-lines}

[Click Me](#){button primary large hover-lift}
```

**Common shorthands:**
- Sizes: `xs`, `small`, `large`, `xl`, `2xl`, `huge`, `massive`
- Colors: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `muted`
- Weights: `thin`, `light`, `normal`, `semibold`, `bold`
- Effects: `rounded`, `shadow`, `elevated`, `glass`

## Icons

Use the `:icon[]` syntax for Lucide icons:

```taildown
:icon[heart]{primary} Love this feature
:icon[check-circle]{success large} Completed
:icon[arrow-right] Next step
```

**Popular icons:**
- Navigation: `home`, `menu`, `search`, `settings`, `user`
- Actions: `check`, `x`, `plus`, `edit`, `trash`
- Social: `github`, `twitter`, `linkedin`
- UI: `heart`, `star`, `bookmark`, `share`

## Components

Use `:::component` syntax for component blocks:

```taildown
:::card {elevated hover-lift}
## Card Title {large-bold}

Card content with automatic styling.

[Button Text](#){button primary}
:::
```

**Built-in components:**
- Containers: `card`, `container`, `grid`
- Interactive: `tabs`, `accordion`, `carousel`, `modal`, `tooltip`
- UI: `alert`, `button`, `badge`, `avatar`

## Glassmorphism

Add frosted glass effects:

```taildown
:::card {subtle-glass}
Light frosted glass (90% transparency)
:::

:::card {light-glass}
Medium frosted glass (75% transparency)
:::

:::card {heavy-glass}
Heavy frosted glass (60% transparency)
:::
```

All glass effects include:
- Backdrop blur
- Gradient borders
- Subtle shadows
- Smooth transitions
:::

---

## Dark Mode Guide {large-bold primary}

:::card {heavy-glass padded}
### :icon[moon]{accent huge} Dark Mode is Automatic {large-bold center}

Every Taildown document includes dark mode by default:

**Features:**
- :icon[check]{success} Auto-detection of system preference
- :icon[check]{success} Floating toggle button (bottom-right)
- :icon[check]{success} LocalStorage persistence
- :icon[check]{success} Smooth 300ms transitions
- :icon[check]{success} CSS variables for colors
- :icon[check]{success} Zero configuration required

**How it works:**

1. **First Visit:** Detects system dark mode preference (`prefers-color-scheme`)
2. **Toggle:** Click the moon/sun button to switch themes
3. **Persistence:** Your choice is saved to localStorage
4. **Consistency:** Same theme on all future visits

**CSS Variables:**

```css
:root {
  --background: #ffffff;
  --foreground: #111827;
  --primary: #3b82f6;
}

.dark {
  --background: #030712;
  --foreground: #f9fafb;
  --primary: #3b82f6;
}
```

All components automatically adapt to dark mode!
:::

---

## Next Steps {large-bold primary center}

:::grid {3}
:::card {elevated zoom-in hover-lift}
### :icon[book-open]{primary huge} {center}

**Syntax Guide** {large-bold center}

Deep dive into Taildown syntax and capabilities.

[Read Guide](syntax-guide.html){button primary}
:::

:::card {elevated zoom-in hover-lift}
### :icon[palette]{accent huge} {center}

**Plain English** {large-bold center}

Complete reference of all styling shorthands.

[View Reference](plain-english.html){button secondary}
:::

:::card {elevated zoom-in hover-lift}
### :icon[package]{success huge} {center}

**Components** {large-bold center}

Explore all 18+ built-in components.

[Browse Components](components.html){button info}
:::
:::

---

:::alert {success}
:icon[check-circle]{success} **You're ready to start!** Create your first document and see the magic happen. Remember, dark mode works automatically - just try clicking the toggle button!
:::

[Back to Home](index.html){button primary large hover-lift}
