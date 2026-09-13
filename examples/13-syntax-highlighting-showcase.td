# :icon[code-2]{primary lg} Syntax Highlighting Showcase {massive center primary}

Explore how Taildown fences display component structure, styling attributes, and inline syntax. {xl center muted relaxed-lines}

---

## Component Blocks with Syntax Highlighting {xl-bold}

Here's how our component syntax appears with proper highlighting:

```taildown
:::card {elevated hover-lift glass}
### :icon[star]{warning} Featured Content {large-bold primary}

This card demonstrates multiple features:
- Glassmorphism styling with `glass` keyword
- Hover animations with `hover-lift`
- Icon integration with size and color
- Typography variants with `large-bold primary`

[Learn More :icon[arrow-right]{xs}](#){button primary large}
:::
```

Compare the component delimiters, attribute words, icon names, and prose in the code block above.

## Complex Nested Structures {xl-bold}

Nested containers retain their source indentation and delimiters:

```taildown
:::container
:::card {heavy-glass fade-in}
### :icon[layers]{info lg} Outer Container {xl-bold}

Content in the outer card with proper highlighting.

:::card {subtle-glass zoom-in}
#### :icon[box]{success} Inner Card {bold}

Nested content with different glass effects.

:::grid
:::card {elevated}
##### :icon[check]{success xs} Grid Item 1
Content in nested grid maintains highlighting.
:::

:::card {elevated}  
##### :icon[check]{success xs} Grid Item 2
All nesting levels properly tokenized.
:::
:::

Back to inner card content.
:::

Back to outer card content.
:::
:::
```

Notice how the syntax highlighting maintains context through multiple nesting levels while keeping content text unhighlighted.

## Icon Syntax Variations {xl-bold}

All icon patterns are properly highlighted:

```taildown
Basic icons: :icon[home] :icon[star] :icon[heart]

With sizes: :icon[search]{xs} :icon[bell]{sm} :icon[settings]{lg} :icon[user]{2xl}

With colors: :icon[check]{success} :icon[alert-triangle]{warning} :icon[x-circle]{error}

Combined attributes: :icon[github]{primary lg} :icon[twitter]{info md} :icon[linkedin]{secondary sm}
```

Each icon component is highlighted with distinct colors for the keyword, brackets, name, and attributes.

## Inline Attributes Showcase {xl-bold}

### Headings with Attributes {large-bold}

```taildown
# Main Title {huge-bold center primary}
## Section Header {xl-bold left secondary}  
### Subsection {large-bold muted}
#### Small Heading {bold success}
```

### Paragraphs with Styling {large-bold}

```taildown
This paragraph has large muted text with relaxed lines. {large muted relaxed-lines}

This text is centered and bold with primary color. {center bold primary}

Small text with tight spacing and success color. {small tight-lines success}
```

### Links with Button Styling {large-bold}

```taildown
[Primary Action :icon[arrow-right]{xs}](#){button primary large}
[Secondary Option](#){button secondary}
[Success Button :icon[check]{xs}](#){button success small}
[Ghost Button](#){button ghost}
[Destructive Action :icon[trash]{xs}](#){button destructive}
```

## Plain English Keywords {xl-bold}

Our natural language syntax gets beautiful highlighting:

### Typography Combinations {large-bold}

```taildown
{huge-bold} - Huge and bold text
{large-muted} - Large muted text  
{xl-bold primary} - Extra large, bold, primary color
{small-light secondary} - Small, light weight, secondary color
{tight-lines bold} - Tight line spacing with bold text
{relaxed-lines italic} - Relaxed spacing with italic style
```

### Layout and Spacing {large-bold}

```taildown
{center padded-lg} - Centered with large padding
{flex-center gap-xl} - Flex center with extra large gap
{grid-3 gap-sm} - 3-column grid with small gap
{left padded-sm} - Left aligned with small padding
{right padded-xl} - Right aligned with extra large padding
```

### Effects and Decorations {large-bold}

```taildown
{rounded-full shadow-xl} - Fully rounded with extra large shadow
{elevated hover-lift} - Elevated with hover lift animation
{glass fade-in} - Glass effect with fade-in animation
{floating hover-glow} - Floating with hover glow effect
{subtle-glass slide-up} - Subtle glass with slide-up animation
```

## Key-Value Attributes {xl-bold}

Modal and tooltip attachments are highlighted distinctly:

```taildown
[Open Simple Modal](#){button primary modal="This is a simple modal message with proper highlighting!"}

[Show Tooltip](#){badge info tooltip="Helpful tooltip information that gets highlighted correctly"}

[Complex Modal](#){button secondary large modal="#welcome-modal"}

:::modal{id="welcome-modal"}
# :icon[star]{warning} Welcome to Taildown! {xl-bold center}

This modal has **rich content** with proper syntax highlighting:
- Multiple paragraphs with formatting
- :icon[check]{success} Icons with colors and sizes
- `Code snippets` with monospace styling
- [Links with attributes](https://example.com){.text-blue-600}

[Close Modal](#){button ghost}
:::
```

## Interactive Components {xl-bold}

All interactive components maintain proper highlighting:

### Tabs Component {large-bold}

```taildown
:::tabs{.custom-styling}
## :icon[home]{primary} First Tab
Content for the first tab with icons and formatting.

## :icon[settings]{secondary} Second Tab  
Content for the second tab with different styling.

## :icon[user]{success} Third Tab
Final tab content with buttons and [links](#){button primary}.
:::
```

### Accordion Component {large-bold}

```taildown
:::accordion{id="main-accordion"}
**:icon[info]{primary} First Section**
Content that expands and collapses with smooth animations.

**:icon[help-circle]{secondary} Second Section**
More content with icons, formatting, and [interactive elements](#){button secondary small}.

**:icon[check-circle]{success} Third Section**
Final section with complex content and call-to-action buttons.
:::
```

### Carousel Component {large-bold}

```taildown
:::carousel{auto-play interval="3000"}
First slide with beautiful content and :icon[star]{warning} icons.

---

Second slide with different styling and [buttons](#){button primary}.

---

Third slide with the final content and [call-to-action](#){button success large}.
:::
```

## Real-World Complex Example {xl-bold}

This illustrative project page combines cards, links, and a modal. The fenced source is displayed for study; it does not run the interactions.

```taildown
:::container
# :icon[zap]{warning lg} Product Features {massive center primary}

Explore the project, review its examples, and plan your next document. {xl center muted relaxed-lines}

:::grid
:::card {light-glass slide-up interactive hover-lift}
### :icon[rocket]{primary lg} Fast Performance
Compile a document and inspect its generated HTML.

[Learn More :icon[arrow-right]{xs}](#){button primary modal="Performance details here"}
:::

:::card {light-glass slide-up interactive hover-lift}  
### :icon[palette]{success lg} Beautiful Design
Combine theme colors, spacing, and surface treatments.

[View Examples :icon[eye]{xs}](#){button secondary tooltip="See live examples"}
:::

:::card {light-glass slide-up interactive hover-lift}
### :icon[smartphone]{info lg} Responsive
Review the page at both narrow and desktop widths.

[Try Demo :icon[play]{xs}](#){button success}
:::
:::

:::card {heavy-glass fade-in}
## :icon[crown]{warning} Project Resources {xl-bold center}

Choose a starting point and adapt it to your content. {large center muted}

- :icon[check]{success} Component reference
- :icon[check]{success} Custom theme support  
- :icon[check]{success} Editable Taildown source
- :icon[check]{success} Compiled HTML examples

[Explore Resources :icon[crown]{xs}](#){button primary huge modal="#upgrade-modal"}

:::modal{id="upgrade-modal"}
# :icon[crown]{warning} Explore the Resources {xl-bold center}

Keep the source and exported page together as you refine your document.

**What's included:**
- Component usage examples
- Design settings in the browser editor
- Authoring reference
- Offline editor download
- Source-checkout build instructions

[Continue :icon[arrow-right]{xs}](#){button primary large}
[Maybe Later](#){button ghost}
:::
:::
:::
```

---

## Reading the Highlighted Source {xl-bold center}

:::alert {success}
:icon[check-circle]{success lg} **One Taildown parser across editor and exports**
:::

:::card
Use the examples above to inspect these syntax groups:

- :icon[check]{success xs} **Component blocks** - Names, delimiters, and nested containers
- :icon[check]{success xs} **Inline attributes** - Typography, layout, effects, colors
- :icon[check]{success xs} **Icon syntax** - Names, sizes, colors, combinations  
- :icon[check]{success xs} **Plain English keywords** - Natural language styling
- :icon[check]{success xs} **Key-value attributes** - Modals, tooltips, custom properties
- :icon[check]{success xs} **Interactive components** - Tabs, accordions, carousels
- :icon[check]{success xs} **Complex nesting** - Multiple levels with proper context
- :icon[check]{success xs} **Real-world patterns** - Practical usage examples

Highlighting distinguishes source structure; it does not validate component behavior or guarantee a finished design. Compile the source and review the rendered result separately.
:::

:::card {light-glass center}
### :icon[trophy]{warning lg} Try an Edit {xl-bold}

Open this source in the editor, change an attribute or nested component, and compare the preview with an HTML export. Taildown fences use the shared editor parser; other code languages use the highlighter available in the Node or browser build. {large muted}
:::
