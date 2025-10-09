# Taildown Syntax Specification

**Version:** 0.1.0  
**Date:** 2025-10-05  
**Status:** Canonical Reference  
**Stability:** Experimental (Pre-1.0)

---

## About This Document

This document is the **single source of truth** for Taildown syntax. All implementations, documentation, examples, and tests must conform to the rules defined here.

### Document Purpose

- **Canonical Reference**: The authoritative definition of what is and isn't valid Taildown syntax
- **Implementation Guide**: Parser implementations must match this specification exactly
- **Test Foundation**: All syntax tests are derived from examples in this document
- **Change Control**: All syntax changes must be documented here first

### Version Policy

- **Breaking changes** require a major version bump (e.g., 0.1.0 → 0.2.0 pre-1.0, or 1.0.0 → 2.0.0)
- **Additions** (backward compatible) require a minor version bump
- **Clarifications** (no behavioral change) require a patch version bump
- See `SYNTAX-CHANGES.md` for the change management process

### Conformance Levels

Implementations MUST implement all features marked:
- **[REQUIRED]** - Core syntax that must be supported
- **[RECOMMENDED]** - Should be supported for full compliance
- **[OPTIONAL]** - May be supported in future versions
- **[RESERVED]** - Syntax reserved for future use, currently invalid

---

## 1. Document Model

### 1.1 Document Structure **[REQUIRED]**

A Taildown document is a **superset of CommonMark Markdown** with extensions for styling and components.

**Grammar:**
```ebnf
document          ::= block*
block             ::= markdown_block | component_block
markdown_block    ::= heading | paragraph | list | code_block | blockquote | thematic_break | table
```

**Parsing Rule 1.1.1**: Valid CommonMark documents MUST parse identically in Taildown
```
Test: syntax-tests/fixtures/01-markdown-compatibility/
Note: Taildown files use .td extension (primary), with .tdown and .taildown also accepted.
```

**Parsing Rule 1.1.2**: Unknown extensions MUST be preserved as plain text (graceful degradation)

---

## 2. Inline Attributes

### 2.1 Syntax Definition **[REQUIRED]**

Inline attributes attach styling classes, component variants, and key-value pairs to block-level and inline elements using curly brace notation.

**Grammar:**
```ebnf
element_with_attrs ::= element SPACE? attribute_block
attribute_block    ::= "{" attribute_list "}"
attribute_list     ::= attribute (SPACE attribute)*
attribute          ::= css_class | plain_english | key_value_pair | anchor_id
css_class          ::= "." class_name
plain_english      ::= identifier ("-" identifier)*
key_value_pair     ::= key "=" QUOTE value QUOTE
anchor_id          ::= "#" identifier
key                ::= identifier
value              ::= [^"']+
identifier         ::= [a-zA-Z][a-zA-Z0-9-]*
class_name         ::= [a-zA-Z0-9_-]+
```

**Examples:**
```taildown
# Heading with CSS classes {.text-4xl .font-bold .text-center}

# Heading with plain English {huge-bold center}

# Heading with anchor ID {#section-id huge-bold primary}

Paragraph with component variant {button primary large}

[Link](url){button modal="Click me for info!"}

[Text](#){tooltip="Helpful tip" id="my-tooltip"}
```

### 2.2 Parsing Rules

**Rule 2.2.1 - Attribute Position**: Attributes MUST appear:
- At the **end** of heading text (same line)
- At the **end** of paragraph text (last inline element)
- Immediately **after** link closing parenthesis `](url){attrs}`
- No intervening whitespace except a single space before `{`

**Rule 2.2.2 - Class Syntax**: Each class MUST:
- Start with a dot `.`
- Contain only alphanumeric characters, hyphens, and underscores
- Not start with a digit after the dot (`.0invalid` is invalid)

**Rule 2.2.3 - Multiple Classes**: Classes are space-separated within braces:
```taildown
Valid:   {.class-one .class-two .class-three}
Invalid: {.class-one, .class-two}          # No commas
Invalid: {.class-one}{.class-two}          # Single block only
```

**Rule 2.2.4 - Whitespace Handling**:
```taildown
Valid:   {.class-one .class-two}           # Single space
Valid:   {.class-one  .class-two}          # Multiple spaces (normalized to single)
Valid:   { .class-one .class-two }         # Spaces inside braces (trimmed)
Invalid: { .class-one
           .class-two }                    # No newlines inside attribute block
```

**Rule 2.2.5 - Attribute Extraction**: When parsing:
1. Scan backwards from end of text content
2. Match pattern `\s*\{[^}]+\}\s*$`
3. Extract classes from matched block
4. Remove attribute syntax from text content
5. Attach classes to element's metadata

**Rule 2.2.6 - No Attributes Found**: If no valid attribute block is found, element has no classes

**Rule 2.2.7 - Key-Value Attributes**: Attributes MAY include key-value pairs:
```taildown
Valid:   {id="unique-id"}
Valid:   {modal="Simple text content"}
Valid:   {tooltip="Helpful information"}
Valid:   {button primary id="submit-btn"}
Valid:   {modal="#welcome-modal" class="custom"}
```

- Keys MUST start with a letter and contain only alphanumeric characters and hyphens
- Values MUST be quoted with double or single quotes
- Values MAY contain any characters except the closing quote
- Key-value pairs MAY be mixed with CSS classes and plain English shorthands
- Common keys: `id`, `modal`, `tooltip`, `aria-*`, custom data attributes

**Rule 2.2.8 - Attribute Processing Order**:
1. Extract all key-value pairs (`key="value"`)
2. Extract anchor IDs (tokens starting with `#`)
3. Extract CSS classes (tokens starting with `.`)
4. Extract plain English shorthands and component names (remaining tokens)
5. Resolve plain English and component variants to CSS classes
6. Merge all classes and apply to element
7. Apply anchor ID as element's `id` attribute if present

**Rule 2.2.9 - Anchor ID Syntax**: Anchor IDs provide native in-page navigation:
```taildown
# Section Title {#anchor-id}                    # Sets id="anchor-id" on heading
## Subsection {#my-section large-bold primary}  # ID combined with styling

[Jump to section](#anchor-id)                   # Standard markdown link to anchor
```

- Anchor IDs MUST start with `#` within attribute block
- ID names MUST start with a letter and contain only alphanumeric characters, hyphens, and underscores
- Only ONE anchor ID is allowed per attribute block (first one wins)
- Anchor IDs MAY be combined with styling attributes
- Generated HTML will have `id="..."` attribute for native browser navigation
- Scroll targets automatically account for sticky navbar offset (`:target { scroll-margin-top: 80px; }`)

**Valid anchor ID examples:**
```taildown
# Introduction {#intro}
## Getting Started {#getting-started large-bold}
### API Reference {#api-reference primary center}
```

**Invalid anchor ID examples:**
```taildown
# Title {#123invalid}          # IDs cannot start with numbers
# Title {#my section}           # IDs cannot contain spaces
# Title {#first #second}        # Multiple IDs not allowed (first wins)
```

### 2.3 Supported Elements **[REQUIRED]**

Inline attributes MAY be applied to:
- **Headings** (h1-h6): `# Text {.class}`
- **Paragraphs**: `Text {.class}`
- **Links**: `[text](url){.class}`
- **Images**: `![alt](url){.class}` **[RECOMMENDED]**
- **Lists**: List items inherit from list marker **[OPTIONAL]**

### 2.4 Edge Cases

**Edge Case 2.4.1 - Literal Braces**: To include literal `{.class}` in text without parsing:
```taildown
Use backticks: `{.not-a-class}`
Use code block: \`\`\`{.not-a-class}\`\`\`
```

**Edge Case 2.4.2 - Empty Attribute Block**:
```taildown
# Heading {}                    # Valid, no classes applied
# Heading {  }                  # Valid, no classes applied
```

**Edge Case 2.4.3 - Malformed Attributes**:
```taildown
# Heading {class-without-dot}   # Invalid: treated as plain text
# Heading {.class                # Invalid: unclosed brace, treated as plain text
# Heading .class}                # Invalid: no opening brace, treated as plain text
```

**Edge Case 2.4.4 - Nested Braces**:
```taildown
# Heading {.outer {.nested}}    # Invalid: no nesting allowed
                                 # Parses as: classes = ["outer", "{", "nested}"]
                                 # Implementation note: Second '{' stops class parsing
```

**Edge Case 2.4.5 - Attributes in Code**:
```taildown
`code {.not-parsed}`             # Attributes NOT parsed in inline code
\`\`\`
code block {.not-parsed}
\`\`\`                            # Attributes NOT parsed in code blocks
```

### 2.5 Test Coverage

```
Test fixtures:
- syntax-tests/fixtures/02-inline-attributes/01-headings.td
- syntax-tests/fixtures/02-inline-attributes/02-paragraphs.td
- syntax-tests/fixtures/02-inline-attributes/03-links.td
- syntax-tests/fixtures/02-inline-attributes/04-edge-cases.td
```

### 2.6 Icon Syntax **[REQUIRED]**

Inline icons use a specialized syntax to embed SVG icons from the Lucide icon library.

**Grammar:**
```ebnf
icon_element     ::= ":icon[" icon_name "]" attribute_block?
icon_name        ::= [a-z][a-z0-9-]*
attribute_block  ::= "{" (class_list | shorthand_list) "}"
class_list       ::= ("." class_name | shorthand) (SPACE ("." class_name | shorthand))*
shorthand        ::= size_keyword | color_keyword | style_keyword
size_keyword     ::= "tiny" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "huge"
color_keyword    ::= "primary" | "secondary" | "success" | "warning" | "error" | "info"
style_keyword    ::= "thin" | "thick" | "bold"
```

**Examples:**
```taildown
Basic icon:           :icon[home]
Icon with size:       :icon[search]{large}
Icon with color:      :icon[heart]{primary}
Multiple attributes:  :icon[check]{success large}
CSS classes:          :icon[menu]{.text-blue-500 .w-8}
Mixed syntax:         :icon[star]{primary .w-6 .h-6}
```

#### 2.6.1 Parsing Rules

**Rule 2.6.1.1 - Icon Name Format**:
- Icon names MUST start with a lowercase letter
- Icon names MAY contain lowercase letters, numbers, and hyphens
- Icon names MUST correspond to valid Lucide icon names (converted from kebab-case to PascalCase)

**Examples:**
```taildown
Valid:   :icon[home]
Valid:   :icon[arrow-right]
Valid:   :icon[alert-triangle]
Invalid: :icon[Home]              # Uppercase not allowed
Invalid: :icon[123-icon]          # Cannot start with number
Invalid: :icon[icon_name]         # Underscores not allowed
```

**Rule 2.6.1.2 - Attribute Processing**:
1. Attributes are **optional** - icons work without attributes
2. Attributes MAY contain CSS classes (starting with `.`)
3. Attributes MAY contain plain English shorthands (no dot prefix)
4. All shorthands are resolved via the style resolver system
5. Size keywords control SVG width/height attributes
6. Color keywords are applied via CSS classes
7. Stroke width keywords affect the SVG stroke-width attribute

**Rule 2.6.1.3 - Size Mapping**:
```
tiny → 12px
xs   → 16px
sm   → 20px
md   → 24px (default)
lg   → 32px
xl   → 40px
2xl  → 48px
huge → 64px
```

**Rule 2.6.1.4 - Icon Rendering**:
- Icons are rendered as inline `<svg>` elements
- SVG includes `viewBox="0 0 24 24"` for proper scaling
- Icon paths are extracted from the Lucide library at compile time
- Missing icons render as `[icon-name]` placeholder with error class

#### 2.6.2 Integration with Text

**Rule 2.6.2.1 - Inline Positioning**:
Icons are **inline elements** and flow with text:

```taildown
Text before :icon[home] text after
Multiple icons: :icon[star] :icon[star] :icon[star]
In headings: # Welcome :icon[wave]{large}
In links: [Click here :icon[arrow-right]](#)
```

**Rule 2.6.2.2 - Component Integration**:
Icons work inside component blocks:

```taildown
:::card
### Title with icon :icon[bookmark]{primary}
Content with :icon[info]{sm} inline icon.
:::
```

#### 2.6.3 Styling and Customization

**Rule 2.6.3.1 - Color Inheritance**:
Icons use `stroke="currentColor"` by default, inheriting text color:

```taildown
Red text with icon {.text-red-500}: :icon[heart]
Primary icon: :icon[heart]{primary}             # Overrides with primary color
```

**Rule 2.6.3.2 - Size Customization**:
Three ways to control icon size:

```taildown
1. Size keywords:     :icon[star]{large}        # Using size mapping
2. Tailwind classes:  :icon[star]{.w-8 .h-8}    # Direct width/height
3. Plain English:     :icon[star]{xl}           # Shorthand (preferred)
```

**Rule 2.6.3.3 - Stroke Width**:
Control stroke thickness:

```taildown
Default (2px):    :icon[circle]
Thin (1px):       :icon[circle]{thin}
Thick (3px):      :icon[circle]{thick}
Bold (3px):       :icon[circle]{bold}
```

#### 2.6.4 Icon Library

**Rule 2.6.4.1 - Lucide Integration**:
- Taildown uses the **Lucide icon library** (https://lucide.dev/)
- 1000+ icons available
- Icons are converted from kebab-case to PascalCase internally
- Example: `:icon[arrow-right]` → `ArrowRight` icon in Lucide

**Rule 2.6.4.2 - Common Icons**:
```
Navigation:  home, menu, search, settings, user, bell, mail
Actions:     check, x, plus, minus, edit, trash, download, upload
Arrows:      arrow-right, arrow-left, arrow-up, arrow-down, chevron-right
Social:      github, twitter, facebook, linkedin, youtube
UI:          heart, star, bookmark, share, link, copy, eye
Alerts:      alert-circle, alert-triangle, info, help-circle, x-circle
```

#### 2.6.5 Icon-Only Lists **[REQUIRED]**

When a list item starts with an icon as its first child, the default bullet point is automatically hidden, allowing the icon to serve as the visual indicator.

**Rule 2.6.5.1 - Automatic Bullet Suppression**:
```taildown
- :icon[check]{success} Task completed
- :icon[x]{error} Task failed  
- :icon[circle]{warning} Task pending
```

**Generated CSS behavior**:
```css
li:has(> .icon:first-child) {
  list-style: none;
}
```

**Use cases**:
- Status lists with semantic icons
- Feature lists with visual indicators
- Step-by-step instructions with icons
- Navigation or action menus

**Example - Contributing steps**:
```taildown
- :icon[git-fork]{accent} Fork the repository
- :icon[git-branch]{primary} Create a feature branch
- :icon[edit]{success} Make your changes with tests
- :icon[check-circle]{success} Ensure all tests pass
- :icon[git-pull-request]{primary} Submit a Pull Request
```

**Rendering**: Each icon replaces the bullet point, providing better visual hierarchy and semantic meaning.

#### 2.6.6 Edge Cases

**Edge Case 2.6.6.1 - Invalid Icon Names**:
```taildown
:icon[nonexistent-icon]         # Renders as placeholder: [nonexistent-icon]
:icon[]                         # Invalid: empty name, treated as plain text
:icon[icon with spaces]         # Invalid: spaces not allowed
```

**Edge Case 2.6.5.2 - Escaped Syntax**:
```taildown
`\:icon[home]`                  # Escaped in backticks, not parsed
Icon syntax: `:icon[star]`      # In code, not parsed
```

**Edge Case 2.6.5.3 - Nested in Links**:
```taildown
[Text with :icon[star] icon](url)              # Icon inside link text
[:icon[home]](#)                               # Icon as entire link text
[:icon[arrow-right]](#){button primary}        # Icon in button link
```

#### 2.6.6 Accessibility

**Rule 2.6.6.1 - SVG Accessibility**:
All rendered icons include:
- `<title>` element with icon name for screen readers
- `role="img"` attribute (generated automatically)
- Descriptive `data-icon` attribute

**Rule 2.6.6.2 - Semantic Context**:
When using icons without accompanying text, provide context:

```taildown
Good: [Delete :icon[trash]](#)              # Text explains action
Good: :icon[info]{title="Information"}      # Title provides context
Bad:  [:icon[x]](#)                         # Icon-only without context
```

#### 2.6.7 Test Coverage

```
Test fixtures:
- syntax-tests/fixtures/07-icons/01-basic-icons.td
- syntax-tests/fixtures/07-icons/02-icon-attributes.td
- syntax-tests/fixtures/07-icons/03-icon-integration.td
- syntax-tests/fixtures/07-icons/04-edge-cases.td
```

### 2.6A Inline Badges **[REQUIRED]**

Inline badges provide short, semantic labels that flow with text.

Grammar:
```
badge_element   ::= ":badge[" text "]" attribute_block?
text            ::= any characters except "]"
attribute_block ::= "{" (class_list | shorthand_list) "}"
```

Examples:
```taildown
Project Status: :badge[active]{success}
Version: :badge[v2.1.0]{info}
License: :badge[MIT]{primary}

Features: :badge[new]{warning} :badge[beta]{info} :badge[deprecated]{error}
```

Rules:
- Attributes resolve through the badge component’s variant system.
- Supported colors: `default` `primary` `secondary` `success` `warning` `error` `info` `muted`
- Supported sizes: `sm` `md` (default) `lg`
- Badges render as `<span>` with appropriate classes and `data-component="badge"`.
- Inline badges work inside links, headings, paragraphs, and component content.

Edge cases:
- `:badge[]` (empty text) is invalid and treated as plain text.
- Inside code/backticks, the syntax is not parsed (CommonMark behavior).

Test Coverage:
```
Add fixtures under: syntax-tests/fixtures/07-inline-badges/
- 01-basic.td
- 02-attributes.td
- 03-integration.td
- 04-edge-cases.td
```

---

### 2.7 Plain English Grammar Rules **[REQUIRED]**

Taildown prioritizes **natural English grammar and word order** over CSS conventions for all styling shorthands.

#### 2.7.1 Design Philosophy

**PRIME DIRECTIVE**: All styling and shorthand MUST follow natural English grammar and word order, NOT CSS property-value conventions.

**Why?** CSS inverts natural language order (e.g., `text-large` instead of "large text", `font-bold` instead of "bold font"). This creates cognitive overhead for non-developers and feels unnatural. Taildown restores natural language patterns.

#### 2.7.2 Core Grammar Rules

**Rule 2.7.2.1 - Adjective-Noun Order**:
Always use adjective-noun order (English grammar), never noun-adjective (CSS style).

```taildown
CORRECT (Natural English):
{large-text bold-primary rounded-corners}
{subtle-glass heavy-shadow}
{tight-lines relaxed-spacing}

INCORRECT (CSS Style):
{text-large primary-bold corners-rounded}
{glass-subtle shadow-heavy}
{leading-tight spacing-relaxed}
```

**Rule 2.7.2.2 - Single Word Descriptors**:
When possible, use single descriptive words without property prefixes.

```taildown
CORRECT (Simple and Natural):
{bold rounded padded elevated}
{large centered muted}

INCORRECT (Verbose CSS Style):
{font-bold border-rounded padding-large shadow-elevated}
{text-large align-center color-muted}
```

**Rule 2.7.2.3 - State Modifiers First**:
For state-based modifiers (hover, focus, dark mode), the state comes first.

```taildown
CORRECT (State First):
{hover-lift focus-ring active-scale}
{dark-background mobile-hidden}

ALSO CORRECT (This pattern is natural):
{hover-grow hover-glow}
```

**Rule 2.7.2.4 - Natural Phrases**:
Multi-word shorthands should read like natural English phrases.

```taildown
CORRECT (Reads Like English):
{flex-center}          → "flex and center"
{rounded-full}         → "rounded fully"
{hover-lift}           → "lift on hover"
{tight-lines}          → "tight lines"
{large-bold}           → "large and bold"

INCORRECT (Reads Like Code):
{center-flex}          → unnatural
{full-rounded}         → unnatural
{lift-hover}           → backwards
{leading-tight}        → CSS property name
```

**Rule 2.7.2.5 - Avoid CSS Property Names**:
Never use CSS property names as prefixes unless they're common English words.

```taildown
AVOID (CSS Property Names):
{leading-tight}        → CSS "line-height" property
{tracking-wide}        → CSS "letter-spacing" property
{decoration-underline} → CSS "text-decoration" property

USE INSTEAD (Plain English):
{tight-lines}          → describes the result
{wide-spacing}         → natural description
{underlined}           → simple adjective
```

#### 2.7.3 Combination Shorthands

Taildown supports natural combinations of descriptors:

**Size + Weight Combinations**:
```taildown
{large-bold}     → Large and bold text
{huge-bold}      → Huge and bold text
{small-light}    → Small and light weight text
{large-light}    → Large and light weight text
```

**Size + Color Combinations**:
```taildown
{large-muted}    → Large muted text
{small-muted}    → Small muted text
{large-primary}  → Large primary-colored text
{large-success}  → Large success-colored text
```

**Background + Text Pairs**:
```taildown
{primary-bg}     → Primary background with contrasting text
{success-bg}     → Success background with white text
{muted-bg}       → Muted background with dark text
```

**Weight + Color Combinations**:
```taildown
{bold-primary}   → Bold primary-colored text
{bold-muted}     → Bold muted text
{italic-muted}   → Italic muted text
```

#### 2.7.4 Shorthand Categories

**Typography**:
```taildown
Sizes:    {xs small base large xl 2xl 3xl huge massive}
Weights:  {thin light normal medium semibold bold extra-bold black}
Style:    {italic uppercase lowercase capitalize}
Lines:    {tight-lines normal-lines relaxed-lines loose-lines}
```

**Layout**:
```taildown
Flex:    {flex flex-col flex-row flex-center}
Grid:    {grid-2 grid-3 grid-4}
Center:  {center-x center-y center-both}
```

**Spacing**:
```taildown
Padding:  {padded padded-sm padded-lg padded-xl}
Gap:      {gap gap-sm gap-lg gap-xl}
Vertical: {tight relaxed loose}
```

**Effects**:
```taildown
Borders:  {rounded rounded-sm rounded-lg rounded-full}
Shadows:  {shadow shadow-sm shadow-lg elevated floating}
Glass:    {glass subtle-glass light-glass heavy-glass}
```

**Animations**:
```taildown
Entrance: {fade-in slide-up slide-down zoom-in}
Hover:    {hover-lift hover-glow hover-scale}
Speed:    {fast smooth slow}
```

**Colors (Semantic)**:
```taildown
States:   {muted success warning error info}
Primary:  {primary secondary accent}
```

#### 2.7.5 Examples

**Document Header**:
```taildown
# Welcome to Taildown {huge-bold center}

A modern markup language that speaks plain English.
{large-muted center}
```

**Card Component**:
```taildown
:::card {subtle-glass padded-lg rounded-xl}
## Features {large-bold primary}

- Beautiful by default :icon[check]{success}
- Plain English syntax :icon[type]{primary}
- Zero configuration :icon[zap]{warning}
:::
```

**Button Examples**:
```taildown
[Get Started](#){button primary large hover-lift}
[Learn More](#){button secondary hover-glow}
[Cancel](#){button muted small}
```

#### 2.7.6 Style Resolution

**Rule 2.7.6.1 - Resolution Order**:
1. Component-specific variants (e.g., `{primary}` on a button)
2. Plain English shorthands (e.g., `{large-bold}`)
3. Direct CSS classes (e.g., `{.text-4xl}`)

**Rule 2.7.6.2 - Class Merging**:
Multiple shorthands are resolved and merged into a single class list:

```taildown
{large bold primary rounded}
↓ Resolves to:
class="text-lg font-bold text-blue-600 rounded-lg"
```

**Rule 2.7.6.3 - Conflict Resolution**:
Later attributes override earlier ones:

```taildown
{large small}        → small wins (last one wins)
{bold thin}          → thin wins
{primary secondary}  → secondary wins
```

#### 2.7.7 Future Additions

**Rule 2.7.7.1 - Extending Shorthands**:
When adding new shorthands, they MUST follow these grammar rules:
- Use natural English word order
- Avoid CSS property names as prefixes
- Prefer single descriptive words
- Create natural phrases for multi-word shorthands

**Rule 2.7.7.2 - Community Contributions**:
All shorthand proposals must include:
- Natural English justification
- Examples in context
- Comparison with CSS equivalent
- Proof of natural word order

#### 2.7.8 Test Coverage

```
Test fixtures:
- syntax-tests/fixtures/06-plain-english/01-basic-shorthands.td
- syntax-tests/fixtures/06-plain-english/02-combinations.td
- syntax-tests/fixtures/06-plain-english/03-resolution-order.td
- syntax-tests/fixtures/06-plain-english/04-natural-phrases.td
```

---

### 2.8 Attachable Components **[REQUIRED]**

Attachable components allow modals and tooltips to be attached to ANY element using plain English syntax.

**Philosophy**: Zero-config attachment - just add `modal="content"` or `tooltip="content"` to any element.

#### 2.8.1 Modal Attachment

**Inline Content**:
```taildown
[Click me](#){button modal="This is a simple alert!"}
[Learn more](#){modal="Extended information about this feature"}
Regular text can also have a [modal link](#){modal="Inline content"}
```

**ID Reference**:
```taildown
[Open Welcome Dialog](#){button modal="#welcome-modal"}

:::modal{id="welcome-modal"}
# Welcome to Taildown!

This modal has **rich markdown** content:
- Multiple paragraphs
- Lists and formatting
- Even `code blocks`
:::
```

**Syntax Rules**:
- `modal="text"` - Inline content (simple text or short messages)
- `modal="#id"` - Reference to `:::modal{id="..."}` block elsewhere
- Can be attached to links, buttons, badges, or any inline element
- Automatically generates trigger, backdrop, and close button
- ARIA attributes applied automatically
- Escape key and backdrop click to close

#### 2.8.2 Tooltip Attachment

**Inline Content**:
```taildown
[Hover here](#){tooltip="Helpful tip!"}
Learn about [important concepts](#){tooltip="Additional context"}
```

**ID Reference**:
```taildown
[More Info](#){button tooltip="#detailed-info"}

:::tooltip{id="detailed-info"}
This is a **detailed tooltip** with full markdown support including `code` and *emphasis*.
:::
```

**Syntax Rules**:
- `tooltip="text"` - Inline content (brief help text)
- `tooltip="#id"` - Reference to `:::tooltip{id="..."}` block
- Shows on hover (desktop) or click (mobile/touch)
- Automatically positioned relative to trigger
- Fade in/out animations
- ARIA attributes for accessibility

#### 2.8.3 Combined with Component Variants

Attachable components work seamlessly with other attributes:

```taildown
[Submit](#){button primary large modal="Form submitted successfully!"}
[Help](#){badge info tooltip="Click for assistance"}
[Settings](#){button secondary modal="#settings-modal" .custom-class}
```

#### 2.8.4 Benefits

**1. Natural Syntax**: Plain English, no JavaScript configuration
```taildown
BAD (typical JS library):  <div data-modal-target="#modal1" data-modal-show>Click</div>
GOOD (Taildown):           [Click](#){modal="Message"}
```

**2. DRY Principle**: Define once, reference multiple times
```taildown
[Button 1](#){modal="#info"}
[Button 2](#){modal="#info"}
[Button 3](#){modal="#info"}

:::modal{id="info"}
Shared content here
:::
```

**3. Markdown Support**: Full markdown in ID-referenced content
```taildown
:::modal{id="welcome"}
# Welcome!

- Feature 1
- Feature 2

[Learn more](https://example.com)
:::
```

**4. Zero Configuration**: Works out of the box, no setup required

#### 2.8.5 Test Coverage

```
Test fixtures:
- syntax-tests/fixtures/08-components-advanced/01-attachable-modals.td
- syntax-tests/fixtures/08-components-advanced/02-attachable-tooltips.td
- syntax-tests/fixtures/08-components-advanced/03-id-references.td
```

---

### 2.9 Component Variants **[REQUIRED]**

Component variants allow natural English styling of common UI elements.

**Syntax**: `{component_name variant1 variant2 ...}`

#### 2.9.1 Button Variants

```taildown
[Default Button](#){button}
[Primary Action](#){button primary}
[Secondary Action](#){button secondary}
[Success](#){button success}
[Warning](#){button warning}
[Error](#){button error}
[Info](#){button info}

[Large Button](#){button primary large}
[Small Button](#){button secondary small}
```

**Available variants**:
- **Colors**: `primary` `secondary` `success` `warning` `error` `info` `muted`
- **Sizes**: `xs` `small` `base` `large` `xl`
- **Styles**: `outline` `ghost` `link`

#### 2.9.2 Badge Variants

```taildown
[New](#){badge primary}
[Beta](#){badge info}
[Deprecated](#){badge warning}
[Error](#){badge error}
```

**Available variants**:
- **Colors**: `primary` `secondary` `success` `warning` `error` `info` `muted`
- **Sizes**: `small` `base` `large`

#### 2.9.3 Alert Variants

In `:::alert` blocks:
```taildown
:::alert{success}
Operation completed successfully!
:::

:::alert{error}
An error occurred. Please try again.
:::
```

**Available variants**:
- **Types**: `info` `success` `warning` `error`

#### 2.9.4 Natural Language Philosophy

Variants follow natural English word order:
```taildown
CORRECT: {button primary large}    # "button that is primary and large"
CORRECT: {badge success small}     # "badge that is success-colored and small"

INCORRECT: {large primary button}  # Unnatural word order
```

#### 2.9.5 Variant Resolution

**Processing order**:
1. Identify component name (first token without dot)
2. Extract remaining tokens as variants
3. Resolve variants to CSS classes via component registry
4. Apply size, color, and style modifiers
5. Merge with any explicit CSS classes

**Example resolution**:
```taildown
{button primary large}
↓
component: "button"
variants: ["primary", "large"]
↓
classes: ["inline-block", "px-6", "py-3", "rounded-lg", "font-medium", 
          "bg-blue-600", "text-white", "hover:bg-blue-700", "text-lg", "px-8", "py-4"]
```

---

## 3. Component Blocks

### 3.1 Syntax Definition **[REQUIRED]**

Component blocks are fenced containers that group content and apply pre-defined component styling.

**Grammar:**
```ebnf
component_block   ::= fence_open component_content fence_close
fence_open        ::= ":::" component_name attribute_block? NEWLINE
fence_close       ::= NEWLINE ":::"
component_name    ::= [a-z][a-z0-9-]*
component_content ::= block*
```

**Examples:**
```taildown
:::card
Content inside a card component
:::

:::card {.shadow-xl .rounded-lg}
Card with custom attributes
:::

:::grid
:::card
Nested component 1
:::
:::card
Nested component 2
:::
:::
```

### 3.2 Parsing Rules

**Rule 3.2.1 - Fence Markers**: Component fences MUST:
- Use exactly three colons `:::`
- Appear at the start of a line (no leading whitespace)
- Be followed by component name on same line (open fence)
- Appear alone on closing line (close fence)

**Rule 3.2.2 - Component Names**: Component names MUST:
- Start with a lowercase letter `[a-z]`
- Contain only lowercase letters, digits, and hyphens `[a-z0-9-]*`
- Not start or end with a hyphen
- Not contain consecutive hyphens

```taildown
Valid:   :::card
Valid:   :::grid-item
Valid:   :::card2
Invalid: :::Card              # Uppercase not allowed
Invalid: :::-card             # Cannot start with hyphen
Invalid: :::card-             # Cannot end with hyphen
Invalid: :::grid--item        # No consecutive hyphens
Invalid: :::2card             # Cannot start with digit
```

**Rule 3.2.3 - Attributes on Components**: Attributes MAY be added to component fence:
```taildown
:::component-name {.class-one .class-two}
Content
:::
```

Rules from Section 2.2 apply, except:
- Attributes appear on same line as fence open, after component name
- One space required between component name and attribute block

**Rule 3.2.4 - Component Nesting**: Components MAY be nested:
```taildown
:::outer
Content in outer
  :::inner
  Content in inner
  :::
More content in outer
:::
```

Parsing rules:
- Fence close `:::` closes the most recently opened component
- Nesting depth is unlimited
- Indentation is NOT significant for fence markers

**Rule 3.2.5 - Unclosed Components**:
```taildown
:::card
Content without closing fence
```

Behavior: Implementation MUST either:
1. Auto-close at document end (RECOMMENDED), OR
2. Emit a parse error/warning

**Rule 3.2.6 - Empty Components**:
```taildown
:::card
:::
```
Valid: Empty components are allowed and render as empty containers

### 3.3 Component Content

**Rule 3.3.1 - Content Parsing**: Content inside components is parsed as standard Taildown:
- Markdown blocks
- Inline attributes
- Nested components

**Rule 3.3.2 - Indentation**: Content indentation is NOT significant:
```taildown
:::card
No indent
:::

:::card
  Two space indent
:::

:::card
    Four space indent
:::
```
All three are equivalent; indentation is for readability only.

### 3.4 Standard Components **[REQUIRED]**

Phase 1 requires these components:

| Component | Purpose | Default Classes |
|-----------|---------|----------------|
| `card` | Content card | Padding, shadow, rounded corners |
| `grid` | Grid layout | CSS Grid with gap |
| `container` | Max-width container | Centered, constrained width |
| `tree` | Directory/hierarchy visualization | Semantic list markup with tree styling |
| `flow` | Process/workflow diagrams | Sequential flow with connectors |

**Note**: Component default classes are defined in implementation, not syntax spec.

### 3.4.1 Clickable Components **[REQUIRED]**

Any component can be made clickable by adding an `href` attribute. The component will render as an `<a>` tag instead of its default element.

**Syntax:**
```taildown
:::card {glass padded href="#destination"}
Entire card is clickable
:::

:::card {subtle-glass center hover-lift href="/page.html"}
Click anywhere on this card to navigate
:::
```

**Behavior:**
- Component with `href` renders as `<a>` tag (instead of default `<div>`)
- All styling and component functionality is preserved
- `no-underline` and `cursor-pointer` classes are automatically added
- Entire component surface area becomes the click target

**Best Practices:**
- Use with `hover-lift` for visual feedback
- Combine with cards for navigation grids (modern UX pattern)
- Larger click targets improve usability (especially on mobile)
- Avoid nested interactive elements inside clickable components

**Example - Navigation Cards:**
```taildown
:::grid {cols-3}
:::card {subtle-glass padded center hover-lift href="#features"}
:icon[star]{primary huge}
**Features**
Learn about our features
:::

:::card {subtle-glass padded center hover-lift href="#pricing"}
:icon[dollar-sign]{success huge}
**Pricing**
View pricing plans
:::

:::card {subtle-glass padded center hover-lift href="#contact"}
:icon[mail]{info huge}
**Contact**
Get in touch
:::
:::
```

**Generated HTML:**
```html
<a class="component-card glass-effect ... no-underline cursor-pointer" 
   href="#features" 
   data-component="card">
  <!-- Card content -->
</a>
```

**Notes:**
- Works with any component (card, grid-item, container, etc.)
- External links supported: `href="https://example.com"`
- Anchor links supported: `href="#section-id"`
- Relative links supported: `href="/path/to/page.html"`

### 3.4.2 Tree Component **[REQUIRED]**

The `tree` component renders directory structures and hierarchical data with professional styling.

**Basic Syntax:**
```taildown
:::tree
- root/
  - folder/
    - subfolder/
    - file.txt
  - another-folder/
:::
```

**Variants:**
- `vscode` - VS Code style with chevrons (▸) and connecting lines (├── └──)
- `minimal` - Ultra-clean with no visual clutter
- `colored` - Color-coded by depth for visual hierarchy
- `rounded` - Soft rounded connectors with blue accents
- `glass` - Modern glassmorphism effect
- `dark` - Dark theme optimized styling

**Size Modifiers:** `sm`, `md`, `lg`

**Examples:**
```taildown
:::tree {vscode}
- project/
  - src/
    - components/
    - utils/
  - tests/
  - package.json
:::

:::tree {colored lg}
- project/
  - src/
    - components/
    - utils/
  - tests/
  - package.json
:::

:::tree {glass}
- docs/
  - api/
  - guides/
:::
```

**Rendering:** Generates semantic `<ul>` and `<li>` elements with appropriate CSS classes for tree visualization. Each list item is styled with connecting lines and indentation to show hierarchy.

### 3.4.3 Flow Component **[REQUIRED]**

The `flow` component renders process flows, pipelines, and decision trees.

**Basic Syntax:**
```taildown
:::flow
- Step 1
- Step 2
- Step 3
:::
```

**Variants:**
- `vertical` - Vertical flow with downward arrows (default)
- `horizontal` - Left-to-right process flow
- `stepped` - Numbered steps with automatic counters
- `branching` - Decision tree with nested branches
- `timeline` - Timeline-style presentation
- `minimal` - Clean minimal styling
- `glass` - Glassmorphism effect
- `dark` - Dark theme optimized

**Size Modifiers:** `sm`, `md`, `lg`

**Examples:**
```taildown
:::flow {stepped}
- Initialize
- Process
- Validate
- Complete
:::

:::flow {branching}
- Request
  - Validate
    - Valid → Process
    - Invalid → Reject
:::

:::flow {horizontal lg}
- Input → Transform → Output
:::
```

**Rendering:** Generates semantic list markup with CSS styling for flow visualization. Horizontal flows automatically convert to vertical on mobile devices for responsive behavior.

### 3.5 Edge Cases

**Edge Case 3.5.1 - Incomplete Fence**:
```taildown
::card                          # Two colons: NOT a component fence
::::card                        # Four colons: NOT a component fence
::: card                        # Space before name: NOT a component fence (treated as text)
```

**Edge Case 3.5.2 - Component Name in Content**:
```taildown
:::card
The word :::card inside content is treated as plain text, not a fence.
:::
```
Rule: Fences must start at beginning of line (column 0).

**Edge Case 3.5.3 - Mismatched Components**:
```taildown
:::card
:::grid                         # Closes card (first-opened, first-closed)
```
The `:::grid` closes the `:::card` (fence close doesn't need to match name).

**Edge Case 3.5.4 - Code Block Interaction**:
````taildown
:::card
```
Code block can contain ::: without closing component
```
:::
````
Rule: Code blocks take precedence; content inside code blocks is not parsed for component fences.

### 3.6 Test Coverage

```
Test fixtures:
- syntax-tests/fixtures/03-component-blocks/01-basic.td
- syntax-tests/fixtures/03-component-blocks/02-attributes.td
- syntax-tests/fixtures/03-component-blocks/03-nesting.td
- syntax-tests/fixtures/03-component-blocks/04-edge-cases.td
```

---

### 3.7 Interactive Components **[REQUIRED]**

Taildown includes five interactive components that work with zero configuration and generate vanilla JavaScript.

**Philosophy**: Intelligent parsing with sensible defaults. No explicit markup required for common patterns.

#### 3.7.1 Tabs Component

**Zero-Config Syntax**: Headings become tab labels, content becomes panels.

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

**Features**:
- `h2` or `h3` headings automatically become clickable tabs
- Content between headings becomes tab panels
- First tab active by default
- Click to switch, keyboard navigation (arrow keys)
- ARIA roles: `tablist`, `tab`, `tabpanel`
- Smooth transitions

#### 3.7.2 Accordion Component

**Zero-Config Syntax**: Bold text becomes triggers, following content becomes panels.

```taildown
:::accordion
**First Section**
Content for first section (open by default)

**Second Section**
Content for second section

**Third Section**
Content for third section
:::
```

**Features**:
- `**Bold text**` paragraphs automatically become clickable triggers
- Content between triggers becomes accordion panels
- First item open by default
- Click to expand/collapse
- Smooth expand/collapse animations
- ARIA attributes: `aria-expanded`, `aria-controls`

#### 3.7.3 Carousel Component

**Zero-Config Syntax**: Horizontal rules `---` divide slides.

```taildown
:::carousel
First slide content

---

Second slide content

---

Third slide content
:::
```

**Features**:
- `---` dividers automatically split content into slides
- Navigation buttons (prev/next)
- Indicator dots
- Keyboard navigation (arrow keys)
- Swipe support on touch devices
- 3D card effects with glassmorphism
- Auto-play (optional, via attributes)

#### 3.7.4 Modal Component

**Standalone Modal**:
```taildown
:::modal
# Modal Title
Modal content here
:::
```

**ID-Referenced Modal** (recommended):
```taildown
[Open Modal](#){button modal="#my-modal"}

:::modal{id="my-modal"}
# Welcome!
This content appears in the modal.
:::
```

**Features**:
- Backdrop with blur effect
- Close button (top-right)
- Escape key to close
- Click backdrop to close
- Focus trap (accessibility)
- Body scroll lock when open
- Fade in/out animations
- Can be attached to any element (see §2.8)

#### 3.7.5 Tooltip Component

**Standalone Tooltip**:
```taildown
:::tooltip
Tooltip content
:::
```

**ID-Referenced Tooltip** (recommended):
```taildown
[Hover for info](#){tooltip="#help-text"}

:::tooltip{id="help-text"}
Detailed help information
:::
```

**Features**:
- Show on hover (desktop)
- Show on click (mobile/touch)
- Positioned relative to trigger
- Fade in/out animations
- `aria-describedby` for accessibility
- Can be attached to any element (see §2.8)

#### 3.7.6 Component Attributes

All interactive components support attributes:

```taildown
:::tabs{.custom-class}
Content
:::

:::accordion{id="faq-accordion"}
Content
:::

:::carousel{auto-play interval="3000"}
Content
:::
```

#### 3.7.7 JavaScript Generation

**Automatic**: JavaScript is generated ONLY for components actually used.
- Tree-shaking: Only includes necessary behaviors
- Small footprint: ~2-5KB total for all components
- Vanilla ES6+: No framework dependencies
- Event delegation: Efficient event handling
- Data attributes: `data-component`, `data-tab`, etc.

**Output**: `.js` file alongside `.html` and `.css`

```
input.td → compile → input.html
                   → input.css
                   → input.js (only if interactive components used)
```

#### 3.7.8 Accessibility

All interactive components include:
- Proper ARIA roles and attributes
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Semantic HTML structure

---

### 3.8 ID-Referenced Components **[REQUIRED]**

Components with `id` attributes can be referenced by other elements.

**Syntax**: `:::component{id="unique-identifier"}`

#### 3.8.1 Modal References

```taildown
[Button 1](#){button modal="#shared-modal"}
[Button 2](#){button modal="#shared-modal"}
[Button 3](#){button modal="#shared-modal"}

:::modal{id="shared-modal"}
# Shared Modal
This content is shown when any of the three buttons is clicked.
:::
```

**Benefits**:
- DRY: Define content once, reference multiple times
- Maintainability: Update modal content in one place
- Performance: Content only rendered once in HTML

#### 3.8.2 Tooltip References

```taildown
Technical term 1[?](#){tooltip="#glossary-term"}
Technical term 2[?](#){tooltip="#glossary-term"}

:::tooltip{id="glossary-term"}
**Definition**: Detailed explanation of the technical term.
:::
```

#### 3.8.3 Registry System

**Implementation detail** (for parser developers):
1. **Pre-pass**: Scan document for `:::modal{id="..."}` and `:::tooltip{id="..."}`
2. **Storage**: Convert content to HAST and store in registry
3. **Lookup**: When `modal="#id"` encountered, lookup from registry
4. **Render**: Attach modal/tooltip content to trigger element

**Why?**: Ensures ID-referenced content is available before attachment processing.

#### 3.8.4 ID Syntax Rules

- IDs MUST be unique within document
- IDs MUST start with letter or underscore
- IDs MAY contain letters, numbers, hyphens, underscores
- ID references MUST start with `#` (e.g., `modal="#welcome"`)
- Invalid ID reference falls back to inline text

---

### 3.9 JavaScript Output **[REQUIRED]**

Taildown generates vanilla JavaScript for interactive components.

#### 3.9.1 Output Format

**Structure**:
```javascript
// Generated file: document.js
(function() {
  'use strict';
  
  // Component behaviors (only included if used)
  // - tabsBehavior
  // - accordionBehavior
  // - carouselBehavior
  // - modalBehavior
  // - tooltipBehavior
  
  // Initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // Initialize components
  }
})();
```

**Characteristics**:
- IIFE (Immediately Invoked Function Expression)
- Strict mode
- Self-contained (no global pollution)
- ES6+ syntax
- ~2-5KB total (minified)

#### 3.9.2 Tree-Shaking

**Optimization**: Only includes JavaScript for components actually used in the document.

| Component | Size | Included When |
|-----------|------|---------------|
| Tabs      | ~0.8KB | `:::tabs` found |
| Accordion | ~0.7KB | `:::accordion` found |
| Carousel  | ~1.2KB | `:::carousel` found |
| Modal     | ~1.0KB | `:::modal` or `modal="..."` found |
| Tooltip   | ~0.9KB | `:::tooltip` or `tooltip="..."` found |

**Example**: Document with only tabs → generates ~0.8KB JS, not 5KB.

#### 3.9.3 Data Attributes

JavaScript targets elements using `data-*` attributes:

```html
<!-- Tabs -->
<div data-component="tabs">
  <button data-tab="0" aria-selected="true">Tab 1</button>
  <div data-tab-panel="0">Content</div>
</div>

<!-- Modal -->
<button data-modal-trigger="modal-id">Open</button>
<div id="modal-id" data-component="modal">...</div>

<!-- Tooltip -->
<span data-tooltip-trigger="true" aria-describedby="tooltip-id">
  Hover me
</span>
<div id="tooltip-id" role="tooltip">Tooltip content</div>
```

**Why**: Clean separation between styling (classes) and behavior (data attributes).

#### 3.9.4 Event Delegation

**Pattern**: Events attached to document root, delegated to targets.

**Benefits**:
- Performance: Single event listener per event type
- Dynamic content: Works with dynamically added elements
- Memory efficient: No per-element listeners

**Example**:
```javascript
// Instead of: element.addEventListener('click', ...)
// Use: document.addEventListener('click', (e) => {
//   if (e.target.matches('[data-modal-trigger]')) { ... }
// });
```

#### 3.9.5 Browser Compatibility

**Target**: Modern browsers (ES6+ support)
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+

**No polyfills**: Vanilla JavaScript only, no dependencies.

**Fallback**: Components degrade gracefully without JavaScript (content remains accessible).

#### 3.9.6 Customization

**Via CSS**: Behaviors use CSS classes, fully customizable:
```css
/* Override modal backdrop */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Custom carousel card */
.carousel-card {
  transform: scale(1.1);
}
```

**Via Attributes**: Some components support configuration:
```taildown
:::carousel{auto-play interval="3000" loop="true"}
Content
:::
```

**Advanced**: Modify generated JavaScript by extending compilation pipeline (see tech-spec.md).

---

## 4. Reserved Syntax

### 4.1 Icon Syntax **[RESERVED]**

Reserved for future use:
```taildown
:icon[icon-name]
:icon[icon-name]{.class}
```

**Current behavior**: Parsers MUST treat this as plain text in v0.1.0

### 4.2 Directive Syntax **[RESERVED]**

Reserved for future use:
```taildown
::directive-name
content
::
```

Two colons (vs three for components) reserved for future directives.

### 4.3 Frontmatter **[RESERVED]**

Reserved for future use:
```taildown
---
key: value
---
```

YAML frontmatter syntax reserved for metadata in future versions.

### 4.4 Extended Attributes **[RESERVED]**

Reserved for future use:
```taildown
{#id .class key="value"}
```

ID and key-value attributes reserved for future versions.

---

## 5. Character Encoding & Escaping

### 5.1 Character Encoding **[REQUIRED]**

**Rule 5.1.1**: Taildown documents MUST be encoded in **UTF-8**

**Rule 5.1.2**: Implementations MUST support the full Unicode character set in content

### 5.2 Escaping **[REQUIRED]**

**Rule 5.2.1**: Taildown inherits CommonMark escaping rules:
- Backslash `\` escapes special characters
- Escaped characters are treated as literals

```taildown
\# Not a heading                # Renders as: # Not a heading
\:::card                        # Renders as: :::card (not a component)
\{.not-a-class}                 # Renders as: {.not-a-class}
```

**Rule 5.2.2**: Inside code blocks and inline code, escaping is NOT processed:
```taildown
`\# Not escaped`                # Renders with backslash: \# Not escaped
```

---

## 6. Whitespace & Line Endings

### 6.1 Line Endings **[REQUIRED]**

**Rule 6.1.1**: Implementations MUST accept:
- Unix line endings (`\n`)
- Windows line endings (`\r\n`)
- Legacy Mac line endings (`\r`)

**Rule 6.1.2**: Implementations SHOULD normalize to `\n` internally

### 6.2 Trailing Whitespace **[REQUIRED]**

**Rule 6.2.1**: Trailing whitespace on lines is NOT significant (except for CommonMark line breaks)

**Rule 6.2.2**: Trailing whitespace inside attribute blocks is trimmed:
```taildown
{.class }                       # Equivalent to: {.class}
```

### 6.3 Blank Lines **[REQUIRED]**

**Rule 6.3.1**: Blank lines separate blocks (standard Markdown behavior)

**Rule 6.3.2**: Multiple consecutive blank lines are equivalent to one blank line

---

## 7. Precedence & Ambiguity Resolution

### 7.1 Parsing Precedence **[REQUIRED]**

When multiple interpretations are possible, precedence (highest to lowest):

1. **Code blocks** (fenced and indented)
2. **Inline code** (backticks)
3. **Component blocks** (:::)
4. **Inline attributes** ({.class})
5. **Standard Markdown** (headings, lists, etc.)

**Example:**
````taildown
```
:::card {.class}                # Treated as code content, not component
```
````

### 7.2 Ambiguity Resolution **[REQUIRED]**

**Rule 7.2.1**: When attribute syntax appears in invalid position, treat as literal text:
```taildown
{.invalid} # Heading            # Classes at start: treated as plain text
```

**Rule 7.2.2**: When component fence is malformed, treat as paragraph:
```taildown
::: card                        # Space after :::, treated as paragraph starting with :::
```

**Rule 7.2.3**: When in doubt, prefer standard Markdown interpretation (principle of least surprise)

---

## 8. Error Handling

### 8.1 Error Philosophy **[REQUIRED]**

Taildown follows the **robustness principle**:
- Be lenient in what you accept (parse liberally)
- Be strict in what you produce (validate strictly)

### 8.2 Error Levels

**Parse Errors**: Syntax that cannot be parsed
- **Action**: Treat as plain text, optionally emit warning
- **Example**: Unclosed attribute block `{.class`

**Validation Warnings**: Valid syntax but potentially problematic
- **Action**: Parse normally, emit warning
- **Example**: Unclosed component block at EOF

**Semantic Errors**: Valid syntax but invalid semantics (implementation-specific)
- **Action**: Parse normally, renderer decides behavior
- **Example**: Unknown component name `:::unknown-component`

### 8.3 Error Recovery **[RECOMMENDED]**

Implementations SHOULD:
- Continue parsing after errors when possible
- Collect all errors/warnings in document
- Provide error positions (line, column) when possible

---

## 9. Conformance Testing

### 9.1 Test Fixtures **[REQUIRED]**

The `syntax-tests/fixtures/` directory contains canonical test cases:

```
syntax-tests/fixtures/
├── 01-markdown-compatibility/    # CommonMark compatibility
├── 02-inline-attributes/          # Inline attribute syntax
├── 03-component-blocks/           # Component block syntax
├── 04-edge-cases/                 # Edge cases & error handling
└── 05-integration/                # Complex real-world documents
```

Each test case consists of:
- **Input**: `.td` file with source (also accepts `.tdown` and `.taildown`)
- **Expected AST**: `.ast.json` file with expected abstract syntax tree
- **Expected HTML**: `.html` file with expected output (Phase 1+)
- **Expected CSS**: `.css` file with expected styles (Phase 1+)

### 9.2 Conformance Levels

**Level 1 - Core Conformance**: 
- All `[REQUIRED]` features
- Pass all tests in: 01, 02, 03

**Level 2 - Standard Conformance**:
- All `[REQUIRED]` and `[RECOMMENDED]` features
- Pass all tests in: 01, 02, 03, 04

**Level 3 - Full Conformance**:
- All features (including `[OPTIONAL]`)
- Pass all tests in: 01, 02, 03, 04, 05

### 9.3 Test Naming Convention

Test files follow the pattern:
```
NN-category-name/
  ├── NN-test-name.td
  ├── NN-test-name.ast.json
  ├── NN-test-name.html
  └── NN-test-name.css

Note: Test files use .td extension (primary). The compiler also accepts
.tdown and .taildown extensions for backward compatibility.
```

Where `NN` is a zero-padded number (01, 02, etc.)

---

## 10. Implementation Notes

### 10.1 Parser Architecture

Recommended approach:
1. **Lexer/Tokenizer**: CommonMark + Taildown extensions
2. **Parser**: Build AST matching CommonMark structure
3. **Transformer**: Resolve attributes and components
4. **Renderer**: Generate HTML/CSS output

### 10.2 AST Extensions

Taildown extends the CommonMark/MDAST AST with:

```typescript
// Additional node data
interface TaildownNodeData {
  hProperties?: {
    className?: string[];      // Classes from inline attributes
  };
  component?: {
    name: string;              // Component name
    attributes: string[];      // Component attributes
  };
}
```

### 10.3 Attribute Storage

Attributes should be stored in node metadata, following rehype conventions:
```javascript
{
  type: 'heading',
  depth: 1,
  children: [...],
  data: {
    hProperties: {
      className: ['text-4xl', 'font-bold']
    }
  }
}
```

---

## 11. Version History

### v0.1.0 (2025-10-04) - Initial Specification

**Added:**
- Document structure definition
- Inline attribute syntax (headings, paragraphs, links)
- Component block syntax (card, grid, container)
- Character encoding rules
- Whitespace handling
- Precedence and ambiguity resolution
- Error handling philosophy
- Conformance testing framework

**Reserved:**
- Icon syntax `:icon[]`
- Directive syntax `::`
- Frontmatter `---`
- Extended attributes `{#id key="value"}`

---

## 12. References

### 12.1 Standards

- **CommonMark Specification**: https://spec.commonmark.org/
- **MDAST** (Markdown AST): https://github.com/syntax-tree/mdast
- **Pandoc Attributes**: https://pandoc.org/MANUAL.html#extension-attributes
- **Djot Markup**: https://djot.net/

### 12.2 Related Documents

- `README.md` - User-facing overview and quick start
- `tech-spec.md` - Technical architecture and implementation guide
- `phase-1-implementation-plan.md` - Phase 1 development plan
- `SYNTAX-CHANGES.md` - Process for proposing syntax changes

---

## 13. Contributing to This Specification

### 13.1 Proposing Changes

All syntax changes must follow the process in `SYNTAX-CHANGES.md`:

1. Open an issue describing the proposed change
2. Discuss rationale and alternatives
3. Create test fixtures demonstrating desired behavior
4. Update this specification
5. Implement in reference parser
6. Update all documentation

### 13.2 Specification Maintenance

This document is maintained as part of the Taildown repository:
- **Location**: `SYNTAX.md` at repository root
- **Format**: Markdown (this document is itself Taildown-compatible!)
- **Review**: All PRs touching syntax require maintainer review

---

## 10. Implementation Notes

### 10.1 Reference Implementation

The canonical Taildown compiler (`@taildown/compiler`) uses a custom directive parser that provides full compliance with this specification.

**Architecture:**
- **Parser**: Custom unified plugin for component directives, integrated with remark-parse for Markdown
- **Renderer**: mdast-to-hast for HTML, custom CSS generator for styling
- **Performance**: ~50 nodes/ms, sub-linear scaling

**Key Implementation Details:**

1. **Component Parsing** (§3):
   - Three-phase approach: Scan → Build → Parse
   - Stack-based nesting (LIFO) for proper component hierarchy
   - Recursive scanning to extract fences from lists and complex paragraphs
   - Handles blank lines between siblings per Rule 3.2.4

2. **Inline Attributes** (§2):
   - Processed in order: links, headings, paragraphs
   - Links processed first to claim their attributes (Rule 2.3)
   - Invalid attribute blocks treated as plain text (Rule 2.2.6)

3. **CSS Generation**:
   - Responsive class selectors escaped (`:` → `\:`)
   - Only used classes included (tree-shaking)
   - Nested components get adaptive padding
   - shadcn-inspired button styling with 3D effects

4. **Parsing Edge Cases**:
   - Fences without blank lines: Supported via recursive list scanning
   - Multiple consecutive fences: All extracted and processed
   - Mixed content paragraphs: Split into content and markers maintaining order
   - Code blocks: Fences inside code blocks ignored per Edge Case 3.5.4

**Performance Characteristics:**
- Small docs (<50 chars): ~600µs
- Medium docs (~500 chars): ~1ms
- Large docs (~10KB, 577 nodes): ~11ms ✓
- Very large docs (~20KB, 1153 nodes): ~22ms ✓
- **Target (<100ms): ACHIEVED**

### 10.2 Testing

Reference test suite location: `syntax-tests/reference.test.ts`

**Test Coverage:**
- 19 total tests across 5 categories
- All [REQUIRED] features: 100% coverage
- All [RECOMMENDED] features: 100% coverage
- Conformance Levels 1, 2, 3: All passing

**Test Categories:**
1. Markdown Compatibility (1 test)
2. Inline Attributes (4 tests)
3. Component Blocks (4 tests, including deep nesting)
4. Edge Cases (2 tests)
5. Integration (2 tests)
6. Conformance verification (3 tests)
7. Infrastructure validation (3 tests)

### 10.3 Known Limitations (Phase 1)

**Not Yet Implemented:**
- Custom components beyond standard set (Phase 2)
- Shorthand syntax for common patterns (Phase 2)
- Advanced layout primitives (Phase 3)
- Custom CSS utility definitions (Phase 3)

**By Design:**
- Inline attributes only apply to headings, paragraphs, and links (Rule 2.2.6)
- Component names must be lowercase with hyphens (Rule 3.2.2)
- Blank lines recommended between sibling components (though not strictly required)

### 10.4 Migration from Previous Parsers

If migrating from `remark-directive`:

**Breaking Changes:**
- Blank lines between siblings now work correctly
- Fences without blank lines are now supported
- Multiple consecutive fences handled properly

**No Changes Needed:**
- Basic component syntax remains the same
- Attribute syntax unchanged
- Output HTML/CSS structure compatible

---

**End of Taildown Syntax Specification v0.1.0**

---

## Document Meta

- **Maintained by**: Taildown Core Team
- **Discussion**: GitHub Discussions
- **Issues**: GitHub Issues with label `syntax`
- **License**: CC BY 4.0 (documentation), MIT (code examples)
