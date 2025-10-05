# Nested Components {huge-bold center}

Components can be nested to create complex layouts. {large muted center relaxed-lines}

## Card Inside Container

:::container
:::card {elevated fade-in}
### :icon[box]{primary} Centered Card {large-bold}

This card is inside a container, so it's centered on the page with consistent spacing.

Perfect for focused content sections!
:::
:::

## Multiple Cards in Container

:::container
# Featured Content {xl-bold}

Below are some featured items:

:::card {light-glass slide-up}
### :icon[star]{warning} First Feature
Description of the first feature with beautiful glass styling.
:::

:::card {light-glass slide-up}
### :icon[award]{success} Second Feature
Description of the second feature with elegant transparency.
:::

:::card {light-glass slide-up}
### :icon[trophy]{error} Third Feature
Description of the third feature with frosted glass effect.
:::
:::

## Grid Inside Container

:::container
# Product Showcase {huge-bold center primary}

:::grid
:::card {elevated interactive hover-lift}
### :icon[package]{primary} Product A
Amazing features with interactive hover.
:::

:::card {elevated interactive hover-lift}
### :icon[layers]{primary} Product B
Incredible design and smooth animations.
:::

:::card {elevated interactive hover-lift}
### :icon[box]{primary} Product C
Outstanding quality with modern UI.
:::

:::card {elevated interactive hover-lift}
### :icon[gift]{primary} Product D
Perfect solution for your needs.
:::

:::card {elevated interactive hover-lift}
### :icon[shopping-bag]{primary} Product E
Best choice with proven results.
:::

:::card {elevated interactive hover-lift}
### :icon[tag]{primary} Product F
Top rated by customers worldwide.
:::
:::
:::

## Deep Nesting with Glass Effects

:::container
:::card {heavy-glass fade-in}
### :icon[layers]{secondary lg} Outer Card {large-bold}

This is the outer card with heavy glass effect.

:::card {subtle-glass zoom-in}
#### :icon[box]{info} Inner Card {bold}

This is nested inside the outer card with subtle glass!

You can nest as deep as needed for complex layouts.
:::

Back to outer card content with beautiful depth.
:::
:::

## Complex Nested Structure

:::container
:::card {light-glass slide-up}
### :icon[grid]{primary} Parent Container {large-bold}

Content before nested grid.

:::grid
:::card {elevated}
#### :icon[check]{success} Nested A
Grid inside a card works perfectly.
:::

:::card {elevated}
#### :icon[check]{success} Nested B
Supports unlimited nesting depth.
:::

:::card {elevated}
#### :icon[check]{success} Nested C
Maintains clean hierarchy.
:::
:::

Content after nested grid.
:::
:::

---

**Note:** The closing `:::` always closes the most recently opened component. Nesting depth is unlimited and maintains proper hierarchy. {small muted center}
