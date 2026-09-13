:::navbar
[Taildown](index.html){.navbar-brand}

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html) [Live Editor](editor.html)
:::

:::container {wide}

# A small vocabulary. A wide canvas. {#top}

Component reference {primary bold}

Build a reading room, a project brief, or an interactive field guide. These working examples show how Taildown's components compose—and give you the exact source to make them your own.

[Open the editor](editor.html){button primary} [Read the syntax guide](syntax-guide.html){button secondary}

## Find your building block {#nav}

35 components, plus Markdown quotes, highlights and mathematics. Open **View source** beneath an example to inspect or copy it. The Fieldnotes names and measurements are illustrative.

| Family | Components |
| --- | --- |
| [Layout](#layout) | [Container](#container) · [Card](#card) · [Grid](#grid) · [Columns](#columns) · [Button](#button) · [Button group](#button-group) |
| [Interaction](#interactive) | [Tabs](#tabs) · [Accordion](#accordion) · [Carousel](#carousel) · [Modal](#modal) · [Tooltip](#tooltip) · [Details](#details) |
| [Feedback](#feedback) | [Alert](#alert) · [Badge](#badge) · [Progress](#progress) · [Skeleton](#skeleton) |
| [Content](#content) | [Callout](#callout) · [Definitions](#definitions) · [Stats](#stats) · [Divider](#divider) · [Steps](#steps) · [Timeline](#timeline) · [Blockquote](#blockquote) · [Mark / highlight](#mark) · [Footnotes](#footnotes) |
| [Navigation](#navigation) | [Navbar](#navbar) · [Breadcrumb](#breadcrumb) · [Pagination](#pagination) · [Sidebar](#sidebar) · [Avatar](#avatar) |
| [Data & media](#data) | [Tree](#tree) · [Flow](#flow) · [Enhanced table](#table) · [Code diff](#diff) · [Image comparison](#compare-images) · [Mermaid](#mermaid) · [Math](#math) · [Video](#video) |

The examples use the page theme. Change it with the theme control to compare light and dark surfaces. Styling words compose with component variants; [component presets](getting-started.html#component-presets) explain shared defaults and custom variants.

---

## Layout {#layout}

### Container {#container}

Give a section a comfortable maximum width. Containers center and pad content; use a grid inside when you need columns.

:::container {narrow}
:::card {bordered padded}
#### A comfortable reading measure
A container keeps a short field note from stretching across the entire screen. Its width is a maximum, so it still fits a smaller parent.
:::
:::

:::details
**View source**

````taildown
:::container {narrow}
:::card {bordered padded}
#### A comfortable reading measure
A container keeps a short field note from stretching across the entire screen. Its width is a maximum, so it still fits a smaller parent.
:::
:::
````
:::

**Options:** `extra-wide`, `full`, `lg`, `md`, `narrow`, `normal`, `sm`, `wide`, `xl`.

Widths: `narrow` 42rem, `normal` 56rem, `wide` 72rem (default), `extra-wide` 1536px, `full` 100%. Size aliases `sm` / `md` / `lg` / `xl` select the first four widths. Nesting a wider container cannot make it wider than its parent.



[Back to index](#nav){small}

---

### Card {#card}

Group related content with a surface that suits the document. Compare a quiet border, a raised surface, and a translucent treatment.

:::grid {cols-3 gap-lg}
:::card {bordered padded}
:icon[book-open]{primary large}
#### Reading room
A clear outline keeps the emphasis on the words.
[Explore layouts](#grid)
:::
:::card {elevated padded}
:icon[layers]{primary large}
#### Project collection
A raised surface separates a group from its surroundings.
[Explore interaction](#interactive)
:::
:::card {glass padded}
:icon[sparkles]{primary large}
#### Evening notes
A translucent surface adds depth while preserving contrast.
[Explore feedback](#feedback)
:::
:::

:::details
**View source**

````taildown
:::grid {cols-3 gap-lg}
:::card {bordered padded}
:icon[book-open]{primary large}
#### Reading room
A clear outline keeps the emphasis on the words.
[Explore layouts](#grid)
:::
:::card {elevated padded}
:icon[layers]{primary large}
#### Project collection
A raised surface separates a group from its surroundings.
[Explore interaction](#interactive)
:::
:::card {glass padded}
:icon[sparkles]{primary large}
#### Evening notes
A translucent surface adds depth while preserving contrast.
[Explore feedback](#feedback)
:::
:::
````
:::

**Options:** `bordered`, `elevated`, `flat`, `floating`, `glass`, `heavy-glass`, `interactive`, `lg`, `light-glass`, `md`, `outlined`, `sm`, `subtle-glass`, `xl`.

Glass strengths run from `subtle-glass` through `light-glass`, `glass`, and `heavy-glass`. `href="…"` turns a whole card into a link; use that for a single destination and avoid nested interactive controls. Padding, colors, borders, typography and hover effects can be composed with [styling words](plain-english.html).



[Back to index](#nav){small}

---

### Grid {#grid}

Arrange independent items into responsive tracks. Unlike columns, a grid keeps each child together.

:::grid {cols-3 gap-lg}
:::card {light-glass padded}
**01 / OBSERVE** {small primary}

Notice what deserves attention.
:::
:::card {light-glass padded}
**02 / CONNECT** {small primary}

Bring the related ideas together.
:::
:::card {light-glass padded}
**03 / SHARE** {small primary}

Give the reader a useful next step.
:::
:::

:::details
**View source**

````taildown
:::grid {cols-3 gap-lg}
:::card {light-glass padded}
**01 / OBSERVE** {small primary}

Notice what deserves attention.
:::
:::card {light-glass padded}
**02 / CONNECT** {small primary}

Bring the related ideas together.
:::
:::card {light-glass padded}
**03 / SHARE** {small primary}

Give the reader a useful next step.
:::
:::
````
:::

**Options:** `1`, `2`, `3`, `4`, `5`, `cols-1`, `cols-2`, `cols-3`, `cols-4`, `cols-5`, `extra-loose`, `loose`, `normal`, `tight`.

Column counts `1`–`5` (or `cols-1`–`cols-5`) provide responsive defaults. Use `gap-sm`, `gap`, `gap-lg`, or `gap-xl` for spacing. Resize the page: the cards stack at narrow widths.



[Back to index](#nav){small}

---

### Columns {#columns}

Let prose flow between columns, like a magazine. Use this for continuous reading rather than independent cards.

:::columns {2 gap-lg divider}
A field notebook is a place to notice before deciding. Keep the first observation simple: what changed, what remained, and what deserves a closer look?

The second reading is different. Patterns begin to appear, and a few details become more useful than the rest. Leave enough space for those details to stand out.

When the note is ready to share, retain the observations that support it. A clear record lets another reader follow the same path and reach their own conclusion.
:::

:::details
**View source**

````taildown
:::columns {2 gap-lg divider}
A field notebook is a place to notice before deciding. Keep the first observation simple: what changed, what remained, and what deserves a closer look?

The second reading is different. Patterns begin to appear, and a few details become more useful than the rest. Leave enough space for those details to stand out.

When the note is ready to share, retain the observations that support it. A clear record lets another reader follow the same path and reach their own conclusion.
:::
````
:::

**Options:** `2`, `3`, `4`, `auto`, `balanced`, `divider`, `gap`, `gap-lg`, `gap-sm`, `gap-xl`.

`2`, `3`, `4` and `auto` control the column layout. `divider` adds a rule between columns; `balanced` balances column heights. Prefer [Grid](#grid) when a heading and its card must stay together.



[Back to index](#nav){small}

---

### Button {#button}

Make a link read as an action. These examples navigate to real sections of this reference.

:::button-group {left}
[Start with a card](#card){button primary}
[Read the syntax](syntax-guide.html){button secondary}
[See the source workflow](#authoring){button outline}
:::

:::details
**View source**

````taildown
:::button-group {left}
[Start with a card](#card){button primary}
[Read the syntax](syntax-guide.html){button secondary}
[See the source workflow](#authoring){button outline}
:::
````
:::

**Options:** `accent`, `destructive`, `error`, `ghost`, `info`, `lg`, `link`, `md`, `outline`, `primary`, `secondary`, `sm`, `success`, `warning`, `xl`.

Apply `{button …}` to a Markdown link to retain native navigation and keyboard behavior. A block `:::button` without a link is a native button; it needs application behavior to perform an action. Styling a label does not invent a save, payment or submission workflow.



[Back to index](#nav){small}

---

### Button group {#button-group}

Keep related actions together, with wrapping and a usable narrow-screen layout.

:::button-group {left sm}
[Components](#nav){button primary}
[Examples](#combinations){button outline}
[Open editor](editor.html){button ghost}
:::

:::details
**View source**

````taildown
:::button-group {left sm}
[Components](#nav){button primary}
[Examples](#combinations){button outline}
[Open editor](editor.html){button ghost}
:::
````
:::

**Options:** `center`, `default`, `left`, `lg`, `md`, `right`, `sm`, `stack`.

Choose `left`, `center` or `right` alignment, or `stack` for a vertical arrangement. `sm`, `md` and `lg` control group spacing. The group arranges its children; each link or button retains its own behavior.



[Back to index](#nav){small}

---

## Interaction {#interactive}

### Tabs {#tabs}

Offer related views without making the reader lose their place. Headings become tab labels; the content beneath each heading becomes its panel.

:::tabs {pills}
## Overview
#### Fieldnotes / Issue 04
A collection of observations about making useful things.

:badge[Ready to read]{success}
## Contents
- A place to begin
- The value of a rough draft
- Leaving room for another idea
## Details
:::definitions {compact}
**Format** {term}
: A portable HTML document

**Source** {term}
: An editable Taildown file
:::
:::

:::details
**View source**

````taildown
:::tabs {pills}
## Overview
#### Fieldnotes / Issue 04
A collection of observations about making useful things.

:badge[Ready to read]{success}
## Contents
- A place to begin
- The value of a rough draft
- Leaving room for another idea
## Details
:::definitions {compact}
**Format** {term}
: A portable HTML document

**Source** {term}
: An editable Taildown file
:::
:::
````
:::

**Options:** `boxed`, `default`, `glass`, `lg`, `md`, `minimal`, `pills`, `sm`.

Compare the default strip with `pills` and `minimal`. Arrow keys move between tabs; Home and End select the first and last. Tab then enters the selected panel. Keep tab labels concise and use nested tabs only when the content needs another independent choice.



[Back to index](#nav){small}

---

### Accordion {#accordion}

Make a short collection of questions easy to scan. Bold opening paragraphs become controls; the following content is the answer.

:::accordion {separated}
**Can I keep the source?**

Yes. The `.td` file stays editable, and the HTML export is a separate artifact.

**What works offline?**

Embedded styles and interactive behavior travel with the export. Authored remote images, videos and URLs still need their hosts.

**Can I combine components?**

Yes. Put a callout inside a panel, or pair a grid with a set of details. Each control keeps ownership of its own interaction.
:::

:::details
**View source**

````taildown
:::accordion {separated}
**Can I keep the source?**

Yes. The `.td` file stays editable, and the HTML export is a separate artifact.

**What works offline?**

Embedded styles and interactive behavior travel with the export. Authored remote images, videos and URLs still need their hosts.

**Can I combine components?**

Yes. Put a callout inside a panel, or pair a grid with a set of details. Each control keeps ownership of its own interaction.
:::
````
:::

**Options:** `bordered`, `default`, `flush`, `lg`, `md`, `separated`, `sm`.

`bordered`, `separated` and `flush` change the grouping. Activate each heading with Enter or Space. Use [Details](#details) for a single disclosure instead of creating an accordion with one item.



[Back to index](#nav){small}

---

### Carousel {#carousel}

Present a short sequence one panel at a time. A horizontal rule separates slides.

:::carousel {indicators}
#### 01 / A question
What is the smallest useful thing this page can say?

:icon[lightbulb]{large primary}

---

#### 02 / An observation
Write down the detail that changes the answer.

:icon[notebook-pen]{large primary}

---

#### 03 / A next step
Leave the reader with somewhere meaningful to go.

[Explore composition](#combinations){button primary}
:::

:::details
**View source**

````taildown
:::carousel {indicators}
#### 01 / A question
What is the smallest useful thing this page can say?

:icon[lightbulb]{large primary}

---

#### 02 / An observation
Write down the detail that changes the answer.

:icon[notebook-pen]{large primary}

---

#### 03 / A next step
Leave the reader with somewhere meaningful to go.

[Explore composition](#combinations){button primary}
:::
````
:::

**Options:** `autoplay`, `default`, `fade`, `full`, `indicators`, `lg`, `md`, `slide`, `sm`, `xl`.

Use the arrow controls, dot controls, or keyboard navigation. This example starts paused. The `autoplay` variant starts playback unless reduced motion is requested; keep its pause control available. Avoid hiding essential instructions in a carousel. Test the exported document when slides contain other interactive controls.



[Back to index](#nav){small}

---

### Modal {#modal}

Keep a short secondary task or explanation nearby. Define a dialog with an ID, then attach a trigger to that ID.

[Read the publishing note](#modal){button primary modal="#publishing-note"}

:::modal {id="publishing-note" sm}
#### Before you share
Keep the source beside your export so you can revise the page later.

:::callout {info}
The exported HTML contains its styles and behavior. Remote resources retain their original URLs.
:::
:::

:::details
**View source**

````taildown
[Read the publishing note](#modal){button primary modal="#publishing-note"}

:::modal {id="publishing-note" sm}
#### Before you share
Keep the source beside your export so you can revise the page later.

:::callout {info}
The exported HTML contains its styles and behavior. Remote resources retain their original URLs.
:::
:::
````
:::

**Options:** `centered`, `default`, `drawer`, `full-screen`, `lg`, `md`, `sm`, `xl`.

The trigger opens the dialog; Escape and the close control dismiss it. Keyboard focus stays inside while open and returns to the trigger on close. Modal IDs must be unique. Sizes control dialog width, not the amount of content a reader should have to navigate.



[Back to index](#nav){small}

---

### Tooltip {#tooltip}

Explain a short unfamiliar term without interrupting the sentence. Tooltips work on focus as well as hover.

A portable document keeps its presentation close to its content.{tooltip="A file with its styles and behavior included."}

:icon[info]{primary tooltip="Focus this icon with Tab to read the explanation."}

Read [the authoring guide](#authoring) when you are ready{tooltip="Links inside this explanation keep their normal navigation."}

:::details
**View source**

````taildown
A portable document keeps its presentation close to its content.{tooltip="A file with its styles and behavior included."}

:icon[info]{primary tooltip="Focus this icon with Tab to read the explanation."}

Read [the authoring guide](#authoring) when you are ready{tooltip="Links inside this explanation keep their normal navigation."}
````
:::

**Options:** `default`, `error`, `lg`, `light`, `md`, `sm`, `success`, `warning`.

Use `tooltip="Short explanation"` for an inline definition or `tooltip="#definition-id"` for an ID-defined `:::tooltip` body. Escape dismisses a visible tooltip. Put essential instructions in visible prose or a callout; do not make hover the only route to information.



[Back to index](#nav){small}

---

### Details {#details}

Make one optional explanation expandable with native browser behavior. The leading paragraph or heading becomes the summary.

:::details
**What belongs in a field note?**

An observation, the context needed to understand it, and a useful next question.

- Keep the source clear.
- Preserve details that affect the conclusion.
- Let the reader choose how far to explore.
:::

:::details
**View source**

````taildown
:::details
**What belongs in a field note?**

An observation, the context needed to understand it, and a useful next question.

- Keep the source clear.
- Preserve details that affect the conclusion.
- Let the reader choose how far to explore.
:::
````
:::

**Options:** `bordered`, `elevated`, `glass`, `heavy-glass`, `lg`, `light-glass`, `md`, `sm`, `subtle-glass`.

Enter or Space toggles the summary. `{open}` starts expanded. Formatting in the title and body is preserved; without a leading paragraph or heading, the summary falls back to “Details”. This page uses the same primitive for every source disclosure.



[Back to index](#nav){small}

---

## Feedback {#feedback}

### Alert {#alert}

Give a status message an appropriate semantic color. Each message says what happened and what the reader can do next.

:::alert {info}
**A useful starting point.** You can edit these examples in the browser.
:::
:::alert {success}
**Export ready.** Your document can be kept as a standalone HTML file.
:::
:::alert {warning}
**Check remote media.** Linked images and videos need their original hosts.
:::
:::alert {error}
**An example error.** Correct the highlighted source before trying again.
:::

:::details
**View source**

````taildown
:::alert {info}
**A useful starting point.** You can edit these examples in the browser.
:::
:::alert {success}
**Export ready.** Your document can be kept as a standalone HTML file.
:::
:::alert {warning}
**Check remote media.** Linked images and videos need their original hosts.
:::
:::alert {error}
**An example error.** Correct the highlighted source before trying again.
:::
````
:::

**Options:** `error`, `info`, `lg`, `md`, `sm`, `success`, `warning`.

Use `info`, `success`, `warning` and `error` for meaning, not decoration. These are authored message examples; they do not report the state of a real export on this page.



[Back to index](#nav){small}

---

### Badge {#badge}

Attach a short label to a document, item or state without turning it into a full message.

:badge[Draft]{muted} :badge[In review]{warning} :badge[Published]{success} :badge[Fieldnotes]{primary}

A small label can live inside ordinary prose: this note is :badge[Updated]{info}.

:::details
**View source**

````taildown
:badge[Draft]{muted} :badge[In review]{warning} :badge[Published]{success} :badge[Fieldnotes]{primary}

A small label can live inside ordinary prose: this note is :badge[Updated]{info}.
````
:::

**Options:** `default`, `error`, `info`, `lg`, `md`, `muted`, `primary`, `secondary`, `sm`, `success`, `warning`.

Inline syntax is `:badge[Label]{variant}`. Block `:::badge` is available when needed. Labels should be short; use an [Alert](#alert) or [Callout](#callout) when the reader needs an explanation.



[Back to index](#nav){small}

---

### Progress {#progress}

Show a known fraction of completion, or an explicitly unknown amount of remaining work.

:::progress {value="35" max="100" striped}
Preparing **Fieldnotes** — 35% complete
:::
:::progress {value="3" max="8" lg}
Three of eight chapters reviewed
:::
:::progress
Waiting for the next observation
:::

:::details
**View source**

````taildown
:::progress {value="35" max="100" striped}
Preparing **Fieldnotes** — 35% complete
:::
:::progress {value="3" max="8" lg}
Three of eight chapters reviewed
:::
:::progress
Waiting for the next observation
:::
````
:::

**Options:** `animated`, `default`, `indeterminate`, `lg`, `md`, `sm`, `striped`, `xl`, `xs`.

The native bar uses `max="100"` by default. Values must be finite, with `max > 0` and `0 ≤ value ≤ max`; zero and fractions are valid. Missing or invalid values render indeterminate; invalid values produce a located warning. `indeterminate` overrides a supplied value with a warning. Sizes `xs`–`xl` change height; `striped` and `animated` change presentation, with reduced motion respected. Supply visible label content or an explicit `aria-label` / `aria-labelledby`. Taildown displays authored values; it does not track background work.



[Back to index](#nav){small}

---

### Skeleton {#skeleton}

Reserve a recognizable shape while an application loads content. Here the placeholders remain visible so you can inspect their shape and pulse treatment.

:::grid {cols-3 gap-lg}
:::skeleton {rectangle aria-hidden="true"}
:::
:::container {full}
:::skeleton {text aria-hidden="true"}
:::
:::skeleton {text aria-hidden="true"}
:::
:::skeleton {text aria-hidden="true"}
:::
:::
:::skeleton {circle aria-hidden="true"}
:::
:::

:::details
**View source**

````taildown
:::grid {cols-3 gap-lg}
:::skeleton {rectangle aria-hidden="true"}
:::
:::container {full}
:::skeleton {text aria-hidden="true"}
:::
:::skeleton {text aria-hidden="true"}
:::
:::skeleton {text aria-hidden="true"}
:::
:::
:::skeleton {circle aria-hidden="true"}
:::
:::
````
:::

**Options:** `circle`, `default`, `lg`, `md`, `rectangle`, `sm`, `text`, `xl`, `xs`.

Choose `text`, `circle`, or `rectangle` to describe the space being reserved. Skeletons do not fetch or replace content themselves. Hide decorative placeholders from assistive technology and supply a real loading status elsewhere when an application needs one.



[Back to index](#nav){small}

---

## Content {#content}

### Callout {#callout}

Give a useful aside its own place in the reading flow.

:::callout {info}
**Keep the source close.** The `.td` file is the editable document; the HTML export is what you share.
:::
:::callout {warning}
**Leave room for context.** A striking visual is more useful when the reader understands what it represents.
:::

:::details
**View source**

````taildown
:::callout {info}
**Keep the source close.** The `.td` file is the editable document; the HTML export is what you share.
:::
:::callout {warning}
**Leave room for context.** A striking visual is more useful when the reader understands what it represents.
:::
````
:::

**Options:** `bordered`, `danger`, `elevated`, `error`, `glass`, `info`, `lg`, `md`, `note`, `sm`, `success`, `tip`, `warning`.

A callout remains part of the document rather than appearing as a transient notification. Use the semantic variants listed above and normal styling attributes; do not assume an unlisted decorative variant exists.



[Back to index](#nav){small}

---

### Definitions {#definitions}

Pair terms with their meanings using a semantic definition list.

:::definitions {horizontal bordered}
**Source** {term}
: The editable Taildown document.

**Export** {term}
: The generated HTML file, with optional companion assets.

**Preset** {term}
: Shared component defaults that keep related documents consistent.
:::

:::details
**View source**

````taildown
:::definitions {horizontal bordered}
**Source** {term}
: The editable Taildown document.

**Export** {term}
: The generated HTML file, with optional companion assets.

**Preset** {term}
: Shared component defaults that keep related documents consistent.
:::
````
:::

**Options:** `bordered`, `compact`, `elevated`, `glass`, `heavy-glass`, `horizontal`, `lg`, `light-glass`, `md`, `sm`, `subtle-glass`, `vertical`.

Use bold terms with `{term}` and a following `: definition` line. `vertical` stacks entries, `horizontal` puts term and definition side by side, and `compact` reduces spacing. Surface variants change the surrounding treatment.



[Back to index](#nav){small}

---

### Stats {#stats}

Arrange a few meaningful metrics with their labels. These values are sample editorial data, not Taildown performance claims.

:::stats {3}
### 24 {stat}
Field notes

### 8 {stat}
Contributors

### 3 {stat}
Open questions
:::

:::details
**View source**

````taildown
:::stats {3}
### 24 {stat}
Field notes

### 8 {stat}
Contributors

### 3 {stat}
Open questions
:::
````
:::

**Options:** `2`, `3`, `4`, `bordered`, `compact`, `elevated`, `glass`, `heavy-glass`, `light-glass`, `subtle-glass`.

Headings marked `{stat}` supply the values; the following text supplies labels. Choose `2`, `3` or `4` for the column count, then add a surface treatment. Use a table when comparing many rows or when values need additional context.



[Back to index](#nav){small}

---

### Divider {#divider}

Mark a change of topic without adding another box.

:::divider
:::

:::divider {text}
A new observation
:::

:::divider {gradient}
:::

:::details
**View source**

````taildown
:::divider
:::

:::divider {text}
A new observation
:::

:::divider {gradient}
:::
````
:::

**Options:** `accent`, `dashed`, `dots`, `double`, `error`, `gradient`, `icon`, `muted`, `primary`, `solid`, `success`, `text`, `thick`, `warning`, `wavy`.

Use a plain horizontal rule `---` when that is enough. Text and icon content can label a separator; decorative variants are most useful between major sections, not every paragraph.



[Back to index](#nav){small}

---

### Steps {#steps}

Show the state of a short ordered process. Each heading marked `{step}` becomes one step.

:::steps {numbered connected}
### Gather observations {step completed}
Collect the details that matter.

### Shape the document {step current}
Choose a structure that makes the relationships clear.

### Share and revise {step}
Export the page and keep the source for the next edition.
:::

:::details
**View source**

````taildown
:::steps {numbered connected}
### Gather observations {step completed}
Collect the details that matter.

### Shape the document {step current}
Choose a structure that makes the relationships clear.

### Share and revise {step}
Export the page and keep the source for the next edition.
:::
````
:::

**Options:** `bordered`, `compact`, `connected`, `elevated`, `glass`, `horizontal`, `icons`, `lg`, `md`, `numbered`, `sm`, `subtle-glass`, `vertical`.

`completed` and `current` mark authored states; an unmarked step remains upcoming. The component does not advance automatically. Horizontal arrangements suit short labels; vertical steps leave more room for explanation.



[Back to index](#nav){small}

---

### Timeline {#timeline}

Place milestones along a chronological line. Headings form events; their following blocks provide the details.

:::timeline {compact}
## First observations {completed}
**Monday · 09:00**
The team records the questions worth exploring.

## A working draft {current}
**Wednesday · 14:00**
A shared document brings the observations together.

## The next edition
**Friday · 11:00**
Reader feedback shapes a more useful version.
:::

:::details
**View source**

````taildown
:::timeline {compact}
## First observations {completed}
**Monday · 09:00**
The team records the questions worth exploring.

## A working draft {current}
**Wednesday · 14:00**
A shared document brings the observations together.

## The next edition
**Friday · 11:00**
Reader feedback shapes a more useful version.
:::
````
:::

**Options:** `centered`, `compact`, `glass`, `vertical`.

Use `{completed}` and `{current}` on event headings. Use `vertical`, `centered`, `compact` or `glass` to change the arrangement and surface treatment. Dates and states remain authored content.



[Back to index](#nav){small}

---

### Blockquote {#blockquote}

Set an attributed passage apart from the surrounding prose.

> The best note is the one another reader can follow.
>
> — Fieldnotes editorial guide

> Leave enough room for the reader to think.{pull-quote}

:::details
**View source**

````taildown
> The best note is the one another reader can follow.
>
> — Fieldnotes editorial guide

> Leave enough room for the reader to think.{pull-quote}
````
:::

Start lines with `>`. Styling attributes such as `pull-quote`, `testimonial`, `bordered` and glass treatments enhance the Markdown blockquote; blockquote is not a separate registered directive. Keep attribution visible and distinguish illustrative copy from an external quotation.



[Back to index](#nav){small}

---

### Mark / highlight {#mark}

Emphasize a short phrase without turning the whole paragraph into a callout.

Keep ==the essential observation== close to the claim it supports.

==A decision to revisit=={warning} and ==a detail worth keeping=={success} can use semantic colors.

:::details
**View source**

````taildown
Keep ==the essential observation== close to the claim it supports.

==A decision to revisit=={warning} and ==a detail worth keeping=={success} can use semantic colors.
````
:::

Use `==text==`, with optional styling attributes after the closing marker. Color should supplement the words, not carry the only meaning.



[Back to index](#nav){small}

---

### Footnotes {#footnotes}

Keep supporting detail connected to the sentence it explains.

A useful field note distinguishes an observation from its interpretation.[^reference-observation]

[^reference-observation]: Record what you saw before describing what you think it means. The return link brings you back to the sentence.

:::details
**View source**

````taildown
A useful field note distinguishes an observation from its interpretation.[^reference-observation]

[^reference-observation]: Record what you saw before describing what you think it means. The return link brings you back to the sentence.
````
:::

Use native Markdown references `[^name]` and definitions `[^name]: …`. Repeated references stay connected to their note. Hover or focus can reveal a note; the actual footnote and return links remain available. Definitions render together at the end of the document. A `:::footnotes` container is available for authored notes, but native references provide the automatic links.



[Back to index](#nav){small}

---

## Navigation {#navigation}

### Navbar {#navbar}

The navigation at the top of this page is a live navbar. Use a linked `.navbar-brand`, followed by the page destinations.

:::details
**View source**

````taildown
:::navbar
[Taildown](index.html){.navbar-brand}

[Home](index.html) [Getting Started](getting-started.html) [Syntax Guide](syntax-guide.html) [Components](components.html) [Plain English](plain-english.html) [Live Editor](editor.html)
:::
````
:::

The default navbar is fixed and reserves page space. Test long labels at narrow widths. Placement variants include `sticky`, `fixed` and `floating`.

---

### Breadcrumb {#breadcrumb}

Show where a reader is within a small hierarchy. The final item is plain text when it represents the current page.

:::breadcrumb {aria-label="Reference breadcrumb"}
[Home](index.html) / [Reference](#nav) / Components
:::

:::details
**View source**

````taildown
:::breadcrumb {aria-label="Reference breadcrumb"}
[Home](index.html) / [Reference](#nav) / Components
:::
````
:::

**Options:** `boxed`, `default`, `lg`, `md`, `separated`, `sm`.

The component supplies a navigation landmark; author the links and separators. `aria-label` distinguishes it from other navigation on the page. It does not infer a hierarchy or rewrite URLs.



[Back to index](#nav){small}

---

### Pagination {#pagination}

Offer a short set of destinations in a sequence.

:::pagination {aria-label="Reference chapters"}
[Layout](#layout) [Interaction](#interactive) [Feedback](#feedback) [Content](#content) [Data](#data)
:::

:::details
**View source**

````taildown
:::pagination {aria-label="Reference chapters"}
[Layout](#layout) [Interaction](#interactive) [Feedback](#feedback) [Content](#content) [Data](#data)
:::
````
:::

**Options:** `compact`, `default`, `lg`, `md`, `rounded`, `sm`, `spaced`.

Pagination arranges authored links; it does not split content or create pages. Use meaningful link labels and indicate the current destination when building a real multi-page sequence.



[Back to index](#nav){small}

---

### Sidebar {#sidebar}

Place supporting navigation beside a document. This example stays in normal flow so it does not obscure the reference.

:::grid {cols-2 gap-lg}
:::sidebar {sm}
#### In this guide
- [Layout](#layout)
- [Interaction](#interactive)
- [Data and media](#data)
:::
:::container {full}
#### Keep the main idea in view
Use a sidebar for a short local outline or supporting controls. The main reading column should remain useful when the layout stacks on a narrow screen.
:::
:::

:::details
**View source**

````taildown
:::grid {cols-2 gap-lg}
:::sidebar {sm}
#### In this guide
- [Layout](#layout)
- [Interaction](#interactive)
- [Data and media](#data)
:::
:::container {full}
#### Keep the main idea in view
Use a sidebar for a short local outline or supporting controls. The main reading column should remain useful when the layout stacks on a narrow screen.
:::
:::
````
:::

**Options:** `collapsible`, `dark`, `default`, `fixed`, `floating`, `lg`, `md`, `sm`, `xl`.

Sizes `sm`, `md`, `lg`, `xl` set panel width. `floating` adds margin, rounding and shadow; `fixed` positions the panel at the viewport edge and requires a layout that reserves space for it. `collapsible` supplies transition styling, not a built-in toggle or hidden state.



[Back to index](#nav){small}

---

### Avatar {#avatar}

Identify a person with readable initials or an image that you supply.

:::button-group {left}
:::avatar {circular lg}
AM
:::
:::avatar {rounded lg}
JR
:::
:::avatar {square lg}
SK
:::
:::

:::details
**View source**

````taildown
:::button-group {left}
:::avatar {circular lg}
AM
:::
:::avatar {rounded lg}
JR
:::
:::avatar {square lg}
SK
:::
:::
````
:::

**Options:** `2xl`, `circular`, `lg`, `md`, `rounded`, `sm`, `square`, `xl`, `xs`.

Choose `circular`, `rounded` or `square`, then a size from `xs` to `2xl`. Initials work without external assets. When using an image, provide meaningful alternative text and check the final crop.



[Back to index](#nav){small}

---

## Data & media {#data}

### Tree {#tree}

Make a folder structure or content hierarchy legible with nested Markdown lists. A trailing slash identifies a folder; this is a static outline, not an expandable file browser.

:::tree {vscode}
- fieldnotes/
  - observations/
    - dawn-on-the-ridge.td
    - tidal-pools.td
  - assets/
    - ridge.svg
  - index.td
:::

:::details
**View source**

```taildown
:::tree {vscode}
- fieldnotes/
  - observations/
    - dawn-on-the-ridge.td
    - tidal-pools.td
  - assets/
    - ridge.svg
  - index.td
:::
```
:::

**Variants:** `default`, `vscode`, `minimal`, `boxed`, `rounded`, `colored`, `dark`, `glass`. **Sizes:** `sm`, `md`, `lg`. Indentation creates the hierarchy; folder names and filenames remain selectable text. Use descriptive labels instead of relying on the icons alone.



[Back to index](#nav){small}

---

### Flow {#flow}

Present a short process as a connected list. Use Mermaid when the diagram needs explicitly named edges, loops, or decision branches.

:::flow {horizontal sm}
- Observe
- Record
- Publish
:::

:::details
**View source**

```taildown
:::flow {horizontal sm}
- Observe
- Record
- Publish
:::
```
:::

For a chronological account, switch the same list structure to `timeline`:

:::flow {timeline sm}
- **06:10** — Reach the ridge
- **06:35** — Record the first light
- **07:00** — Compare field sketches
:::

:::details
**View source**

```taildown
:::flow {timeline sm}
- **06:10** — Reach the ridge
- **06:35** — Record the first light
- **07:00** — Compare field sketches
:::
```
:::

**Variants:** `default` (vertical), `horizontal`, `stepped`, `branching`, `timeline`, `minimal`, `dark`, `glass`. **Sizes:** `sm`, `md`, `lg`. These are visual treatments of your list, not an executable workflow. Keep a horizontal sequence short enough to scan; its container can scroll on narrow screens.



[Back to index](#nav){small}

---

### Enhanced table {#table}

Add sorting and surface treatments to a standard Markdown table. Activate a column header with a click, Enter, or Space to change its sort order.

| Observation | Recorded | Duration | Readiness |
|-------------|----------|---------:|----------:|
| Ridge at dawn | 2026-09-08 | 35 | 100% |
| Tidal pools | 2026-09-10 | 80 | 75% |
| Woodland canopy | 2026-09-09 | 55 | 90% |
{sortable zebra hoverable}

Duration is in minutes. Try sorting **Duration** or **Recorded**; the initial order is intentionally unsorted.

:::details
**View source**

```taildown
| Observation | Recorded | Duration | Readiness |
|-------------|----------|---------:|----------:|
| Ridge at dawn | 2026-09-08 | 35 | 100% |
| Tidal pools | 2026-09-10 | 80 | 75% |
| Woodland canopy | 2026-09-09 | 55 | 90% |
{sortable zebra hoverable}
```
:::

A compact bordered table suits a small reference:

| File | Purpose |
|------|---------|
| `index.td` | Collection introduction |
| `observations/` | Individual field notes |
| `assets/` | Local photographs and diagrams |
{compact bordered sm}

:::details
**View source**

```taildown
| File | Purpose |
|------|---------|
| `index.td` | Collection introduction |
| `observations/` | Individual field notes |
| `assets/` | Local photographs and diagrams |
{compact bordered sm}
```
:::

**Variants:** `sortable`, `zebra` (alias `striped`), `bordered`, `glass`, `sticky-header`, `compact`, `hoverable`. **Sizes:** `sm`, `md` (default), `lg`. Attach the attribute block immediately after the table. Markdown's colons control alignment.

Sorting compares numbers, grouped currency, percentages, and ISO dates by value; other labels sort as text. Mixed columns group numbers, ISO dates, then text in ascending order. Use consistent units and an explicit header for every column. A sticky header needs a scrollable ancestor to demonstrate its effect; it does not paginate or filter the data.



[Back to index](#nav){small}

---

### Code diff {#diff}

Show the change itself, either as a unified patch or as two complete versions. Taildown displays these sources; it does not apply patches to files.

```diff
@@ -1,3 +1,3 @@
 title: Ridge at dawn
-status: draft
+status: published
 author: Fieldnotes
```

:::details
**View source**

````taildown
```diff
@@ -1,3 +1,3 @@
 title: Ridge at dawn
-status: draft
+status: published
 author: Fieldnotes
```
````
:::

A Before/After pair shows each version in its own column:

:::diff {side-by-side}
```before
const collection = {
  title: "Fieldnotes",
  visibility: "private"
};
```

```after
const collection = {
  title: "Fieldnotes",
  visibility: "public"
};
```
:::

:::details
**View source**

````taildown
:::diff {side-by-side}
```before
const collection = {
  title: "Fieldnotes",
  visibility: "private"
};
```

```after
const collection = {
  title: "Fieldnotes",
  visibility: "public"
};
```
:::
````
:::

**Treatments on `:::diff`:** `glass`, `elevated`, `compact`; sizes `sm`, `md`, `lg`. `split` is an alias for the `side-by-side` class. Language-name variants are registered, but the current renderer displays plain source with change colors rather than language-token highlighting.

**Structure:** a `diff` fence produces the unified view; `before` and `after` fences inside `:::diff` produce two columns. An empty side represents a complete addition or removal. Preserve leading spaces for context lines and use `@@` hunk headers for starting line numbers. `+` and `-` markers accompany the color changes, so color is not the only signal.



[Back to index](#nav){small}

---

### Image comparison {#compare-images}

Reveal a before-and-after pair without moving between images. This example uses two local illustrations of the same scene so the differences stay aligned.

:::compare-images {horizontal labels lg}
before: assets/compare-before.svg
after: assets/compare-after.svg
alt: Fieldnotes illustration before and after its visual refinement
:::

:::details
**View source**

```taildown
:::compare-images {horizontal labels lg}
before: assets/compare-before.svg
after: assets/compare-after.svg
alt: Fieldnotes illustration before and after its visual refinement
:::
```
:::

The vertical variant reveals the pair from top to bottom:

:::compare-images {vertical labels glass lg}
before: assets/compare-before.svg
after: assets/compare-after.svg
alt: The same Fieldnotes illustration compared vertically
:::

:::details
**View source**

```taildown
:::compare-images {vertical labels glass lg}
before: assets/compare-before.svg
after: assets/compare-after.svg
alt: The same Fieldnotes illustration compared vertically
:::
```
:::

**Variants:** `horizontal` (default), `vertical`, `labels`, `glass`, `rounded`, `shadow`. **Sizes:** `sm` (280px, capped at 35vh), `md` (450px / 55vh, default), `lg` (580px / 70vh), `xl` (700px / 80vh), `full` (parent height, at least 400px).

Drag the handle, or focus it and use the orientation's arrow keys. Home and End reveal the extremes. Supply `before:`, `after:`, and a meaningful `alt:` description. Two Markdown images are also accepted and preserve their separate alt texts. Use matching image dimensions and keep local assets with an exported HTML file; images are not embedded by the compiler.



[Back to index](#nav){small}

---

### Mermaid {#mermaid}

Use a Mermaid diagram for relationships that need more than a list. Keep a short prose explanation alongside the graphic.

This publishing flow returns a note to revision until it is ready:

:::mermaid {bordered compact}
flowchart TD
  accTitle: Fieldnotes publishing flow
  accDescr: A draft returns to revision until it is ready to publish.
  A[Field observation] --> B[Draft note]
  B --> C{Ready to share?}
  C -->|Revise| B
  C -->|Publish| D[Collection]
:::

:::details
**View source**

````taildown
:::mermaid {bordered compact}
flowchart TD
  accTitle: Fieldnotes publishing flow
  accDescr: A draft returns to revision until it is ready to publish.
  A[Field observation] --> B[Draft note]
  B --> C{Ready to share?}
  C -->|Revise| B
  C -->|Publish| D[Collection]
:::
````
:::

A sequence diagram emphasizes who does what: the author saves a note, then the reader opens the resulting collection.

```mermaid {compact}
sequenceDiagram
  participant Author
  participant Collection
  participant Reader
  Author->>Collection: Save a field note
  Reader->>Collection: Open the collection
  Collection-->>Reader: Show published notes
```

:::details
**View source**

````taildown
```mermaid {compact}
sequenceDiagram
  participant Author
  participant Collection
  participant Reader
  Author->>Collection: Save a field note
  Reader->>Collection: Open the collection
  Collection-->>Reader: Show published notes
```
````
:::

**Diagram families:** Mermaid also provides class, state, entity-relationship, Gantt, pie, and Git diagrams. Taildown passes diagram source to its bundled Mermaid runtime; use the syntax of the chosen family.

**Variants:** `glass`, `elevated`, `bordered`, `centered`, `compact`. **Sizes:** `sm` (400px maximum width), `md` (600px), `lg` (800px, default), `xl` (1000px), `full`. `small`, `medium`, and `large` are aliases. Put styling attributes on the opening `:::mermaid` directive or after the language name of a fenced `mermaid` block. Both attributed forms use the same component presets. Plain Mermaid fences also render diagrams.

Diagrams render to SVG in the browser and require JavaScript. The hosted editor loads its diagram asset when needed; portable exports include the runtime. Rendering is theme-aware, but a diagram still needs concise labels and a text explanation for readers who cannot interpret the graphic.



[Back to index](#nav){small}

---

### Math {#math}

Use LaTeX notation for inline expressions and display equations. Taildown converts supported expressions to native MathML at compile time; no math renderer runs in the browser.

Across $n$ visits, the mean observation time is $\bar{x}$:

$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

Here $x_i$ is the duration of visit $i$, measured in minutes. A mean summarizes the visits; it does not describe their variation.

:::details
**View source**

```taildown
Across $n$ visits, the mean observation time is $\bar{x}$:

$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

Here $x_i$ is the duration of visit $i$, measured in minutes. A mean summarizes the visits; it does not describe their variation.
```
:::

**Syntax:** single `$` delimiters for inline math; `$$` on separate lines for display math. Fractions, roots, subscripts, superscripts, Greek letters, sums, integrals, and matrices can express more involved notation. This is mathematical notation support, not a complete LaTeX document engine. Define symbols in nearby prose and check complex equations at narrow widths and in the browsers your readers use.



[Back to index](#nav){small}

---

### Video {#video}

Give a short recording its own responsive player. This silent local illustration is deliberately paused until you choose to play it.

:::video {16:9 controls loop}
![A slow animated Fieldnotes landscape](assets/fieldnotes-motion.webm)
:::

:::details
**View source**

```taildown
:::video {16:9 controls loop}
![A slow animated Fieldnotes landscape](assets/fieldnotes-motion.webm)
:::
```
:::

**Aspect ratios:** `16:9` (default), `4:3`, `21:9`, `1:1`. **Treatments:** `glass`, `subtle-glass`. **Playback options:** `autoplay`, `muted`, `loop`, `controls`; self-hosted videos always receive native controls. Prefer deliberate playback, and pair autoplay with muted audio if you use it in your own document. Browser autoplay rules still apply.

Use Markdown image syntax for a self-hosted media URL. YouTube and Vimeo URLs can instead appear as the body of `:::video {youtube}` or `:::video {vimeo}`; those embeds contact the provider and require a network connection. This page uses local media to avoid making that request for you.

**Description of this demo:** a silent landscape illustration changes slowly over time; it contains no spoken information. Provide a transcript for meaningful audio or visual content. The component does not expose a caption-track directive. Portable HTML does not embed the video bytes: distribute the media file beside it or use a reachable hosted URL.


[Back to index](#nav){small}

---

## Put the pieces together {#combinations}

A composition needs a hierarchy, not every available component. This compact project note combines a card, status badge, progress and a useful next step.

:::card {bordered padded}
### The coastal notebook
:badge[In progress]{primary}

Eight observations, one collection. Keep the source editable and give each note enough context to stand on its own.

:::progress {value="3" max="8"}
3 of 8 notes reviewed
:::

[Build your own](editor.html){button primary}
:::

:::details
**View source**

````taildown
:::card {bordered padded}
### The coastal notebook
:badge[In progress]{primary}

Eight observations, one collection. Keep the source editable and give each note enough context to stand on its own.

:::progress {value="3" max="8"}
3 of 8 notes reviewed
:::

[Build your own](editor.html){button primary}
:::
````
:::

## From example to document {#authoring}

Copy an example's source into the [editor](editor.html), then change its content and styling. Keep the `.td` source alongside your HTML export. Test your actual links, keyboard interactions and narrow layout before sharing.

Exported styles and behavior travel with inline HTML; authored images and video still need their files. The media on this page lives with the site in `assets/`. See [getting started](getting-started.html) for the local CLI and [component presets](getting-started.html#component-presets) for shared defaults.

## Small marks, useful meaning {#inline}

Use :icon[book-open] icons, :kbd[Ctrl] + :kbd[K] keyboard hints, and task lists alongside components:

- [x] Record the observation
- [ ] Add an interpretation

See the [syntax guide](syntax-guide.html) for inline syntax, links, images, code and task lists, and [plain English](plain-english.html) for the styling vocabulary.

[Back to the index](#nav){button secondary}

:::
