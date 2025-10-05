# Component Basics {huge-bold}

Taildown provides beautiful pre-styled components with natural language variants. {large}

## Card Variants

Cards are the foundation for content blocks, features, and callouts.

:::card {elevated}
### Elevated Card {large-bold}

The default elevated card provides:
- Subtle shadow for depth :icon[layers]{xs}
- Rounded corners :icon[square]{xs}
- White background :icon[palette]{xs}
- Perfect padding :icon[maximize]{xs}

Great for feature cards and content blocks!
:::

:::card {floating}
### Floating Card {large-bold}

Floating cards have a larger shadow for more prominent sections.
:::

:::card {outlined}
### Outlined Card {large-bold}

Outlined cards use a border instead of shadow for a cleaner look.
:::

## Glassmorphism Cards

Modern frosted glass effects for sophisticated UIs.

:::card {subtle-glass padded-lg}
### Subtle Glass {large-bold primary}

Minimal transparency (90%) with soft blur. :icon[sparkles]{primary}

Perfect for headers and hero sections.
:::

:::card {light-glass padded-lg}
### Light Glass {large-bold primary}

Light transparency (75%) with medium blur. :icon[star]{primary}

Ideal for feature cards and callouts.
:::

:::card {glass padded-lg}
### Medium Glass {large-bold primary}

Medium transparency (60%) - the default glass effect. :icon[zap]{warning}

Best for overlays and modals.
:::

## Buttons & Links

Buttons use the `{button variant}` syntax on links:

[Primary Action :icon[arrow-right]{xs}](#){button primary}
[Secondary Option](#){button secondary}
[Success :icon[check]{xs}](#){button success}
[Warning :icon[alert-triangle]{xs}](#){button warning}
[Danger :icon[x]{xs}](#){button destructive}

Different sizes:

[Small](#){button primary small}
[Medium (default)](#){button primary}
[Large](#){button primary large}

## Alerts

Alerts provide contextual feedback with automatic icons and colors.

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

## Badges

Status indicators and labels (currently block-level components).

:::badge {primary}
Primary
:::

:::badge {success}
Active
:::

:::badge {error}
Inactive
:::

Different sizes:

:::badge {primary small}
Small Badge
:::

:::badge {primary}
Medium Badge
:::

:::badge {primary large}
Large Badge
:::

## Real-World Example

:::card {elevated hover-lift}
### Product Feature {large-bold}

Build beautiful UIs with zero configuration. :icon[zap]{warning}

Our components are designed for maximum flexibility while maintaining professional aesthetics.

[Learn More :icon[arrow-right]{xs}](#){button primary}
[Documentation :icon[book]{xs}](#){button secondary}
:::

---

## Component Syntax Summary {large-bold}

### Basic Usage
```taildown
:::card
Content goes here
:::
```

### With Variants
```taildown
:::card {elevated rounded padded-lg}
Elevated card with extra padding
:::
```

### With Glassmorphism
```taildown
:::card {light-glass hover-lift}
Glassmorphism with hover animation
:::
```

### Button Components
```taildown
[Button Text](#){button primary large}
```

---

Next: See grid layouts and icons in example 04! :icon[arrow-right]
