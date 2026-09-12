:::navbar
[Taildown](index.html){.navbar-brand}

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html) [Live Editor](editor.html)
:::



# Getting Started with Taildown {huge-bold center primary}

**From zero to beautiful documents in 5 minutes** {center large muted}

---

## Start Writing {bold primary}

:::tabs
## Browser Editor

Open the editor, replace the sample with your own document, and use **Export HTML** to save the compiled page. No installation is required.

The editor keeps a browser recovery copy of your draft when storage is available. If browser settings or a full quota prevent recovery, a notice appears and editing still works. Use **Save** or **Download** to keep a file copy; browser recovery is not a substitute for one.

To print or save a PDF, open the exported HTML in your browser and choose **Print**. The print layout shows every tab panel, accordion answer, details section, and carousel slide; paused scroll animations are made visible. Long code wraps, controls are hidden, and the page uses dark text on white paper. Details panels return to their previous open/closed state afterward. Print the exported document rather than the editor interface; modal overlays and tooltips are not included.

[Open the Live Editor](editor.html){button primary}

Use **Save** to keep the editable Taildown source as well as your exported HTML.

Use **Insert** or **Ctrl+K** (**Cmd+K** on Mac) to search component and formatting commands. Search by name or description, use the arrow keys to choose, then press **Enter** to insert at your selection. **Escape** cancels without changing your source. Components without a prepared example insert an empty block for you to fill using the [component reference](components.html). Link formatting uses **Ctrl/Cmd+Shift+K**.

Cards, alerts, callouts, tabs, accordions, details, statistics, steps, and definitions include editable content examples. Try **Tabs** to get two populated panels, or **Steps** for a three-stage process. These examples work offline and can be restyled with the same attributes as any other Taildown source.

## Command Line

Install Node.js and the repository's declared pnpm version, **8.11.0**, then run:

```bash
# Clone the repository
git clone https://github.com/vincitamore/taildown.git
cd taildown

# Install dependencies
pnpm install --frozen-lockfile

# Build all packages
pnpm build
```

Run the commands below from this repository directory. The browser editor is also available if you prefer to work without a local toolchain.
:::

---

## Your First Document {bold primary}

Create a file named `my-first-document.td`:

```taildown
# Hello World {huge-bold center primary}

Welcome to Taildown! {large muted center}

:::card {light-glass slide-up}
## Your First Card {bold}

This is a card with glassmorphism and a slide-up animation!

- :icon[check]{success} Beautiful by default
- :icon[check]{success} No configuration needed
- :icon[check]{success} Dark mode included

[Learn More](#){button primary}
:::
```

---

## Compile Your Document {bold primary}

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
- `my-first-document.js` - JavaScript for enabled interactive features

### Custom Output

```bash
pnpm taildown compile my-first-document.td --separate -o output/index.html --css output/styles.css
```
:::

---

## Understanding the Output {bold primary}

:::grid {2}
:::card {light-glass}
### :icon[file]{primary} HTML Output {bold}

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
### :icon[palette]{accent} CSS Output {bold}

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

## Basic Syntax Overview {bold primary}

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
## Card Title {bold}

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

## Dark Mode Guide {bold primary}

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

## Compiler API customization {bold primary}

### Custom shorthands in the compiler API

When using `@taildown/compiler` programmatically, pass `styleMappings` to give a document its own vocabulary. Values are whitespace-separated style tokens; mappings expand once before normal style resolution. They can replace a built-in shorthand for that compilation, and do not change other documents or literal code examples.

```javascript
import { compile } from '@taildown/compiler';

const result = await compile('# A quieter heading {editorial}', {
  inlineStyles: true,
  inlineScripts: true,
  styleMappings: {
    editorial: 'text-4xl font-semibold text-primary-600'
  }
});
```

This is a compiler API option; the browser editor currently uses the built-in vocabulary. The [plain-English reference](plain-english.html) lists that vocabulary.

### Custom components

Define reusable containers with `components`. Each key must match its definition's `name`; choose a new name instead of replacing a registered component. `htmlElement` defaults to `div`, and `defaultClasses` contains CSS utility names. Normal Taildown attributes can override those defaults. Definitions belong to the compilation and never change other documents.

```javascript
import { compile, getAuthoringReference } from '@taildown/compiler';

const options = {
  inlineStyles: true,
  inlineScripts: true,
  components: {
    editorial: {
      name: 'editorial',
      htmlElement: 'article',
      defaultClasses: ['p-8', 'rounded-lg', 'text-lg']
    }
  }
};

const result = await compile(
  ':::editorial\n## A considered idea\n\nYour content here.\n:::',
  options
);
const reference = await getAuthoringReference(options);
```

The generated HTML includes the component's markup and styling. Keep the definitions alongside the `.td` source for recompilation. Custom names also work in inline style attributes, such as `# Title {editorial small}`, where they apply classes while preserving the original Markdown element.

Authoring integrations can pass the same options to `getAuthoringReference` to receive custom component names, insertable examples, and custom style names. The hosted editor does not yet expose custom-definition settings. These definitions provide presentation and semantic containers; JavaScript behaviors remain those of the built-in components nested inside them.

## A document's palette and fonts

Pass `theme.colors` and `theme.fonts` to `compile()` to give a document its own palette and font stacks. These values merge with defaults and stay local to that compilation. Fonts must already be available to the browser; a font stack does not download or embed a font file.

```javascript
const result = await compile('# Field notes {serif primary}', {
  inlineStyles: true,
  inlineScripts: true,
  theme: {
    colors: { primary: { DEFAULT: '#86bba1', 600: '#25644a', 700: '#184832' } },
    fonts: { sans: 'Verdana, sans-serif', serif: 'Georgia, serif', mono: 'Consolas, monospace' }
  }
});
```

Use `{sans}`, `{serif}`, or `{mono}` to choose a font family for a block. The editor offers these in style completion and the Insert / Ctrl/Cmd+K menu. Numbered palette utilities such as `text-primary-600`, their hover states, and responsive forms use the same document palette. Semantic text uses readable palette shades: light-mode primary text uses 600 and dark-mode primary text uses 400; override those shades when designing both themes.

Node applications can load a configuration with `loadConfig` from `@taildown/compiler/config`, then pass `{theme: {colors: config.theme.colors, fonts: config.theme.fonts}}` to `compile()`. This option currently covers colors and fonts; file discovery, output defaults, component configuration, glass and animation configuration are not applied automatically by the CLI or hosted editor.

## Next Steps {bold primary center}

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
