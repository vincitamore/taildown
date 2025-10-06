# Scroll-Triggered Animations {huge-bold center primary}

Experience the magic of zero-config scroll animations.
{large center muted}

---

:::card {glass padded-lg slide-up}
## Fade In Effect {large-bold}

This card uses the **fade-in** animation. It elegantly appears as you scroll it into view.

Features:
- Zero configuration required
- Automatic scroll detection
- Respects reduced motion preferences
- Professional timing and easing
:::

:::card {glass padded-lg fade-in}
## Slide Up Animation {large-bold}

Cards can slide up from below with a smooth entrance animation.

This creates a sense of depth and motion that feels natural and professional.
:::

:::card {glass padded-lg slide-down}
## Slide Down {large-bold primary}

Elements can also slide down from above, creating variety in your page animations.

Mix and match different animation types for visual interest.
:::

:::grid
:::card {padded zoom-in}
### Zoom In {bold}

This card zooms in when scrolled into view, creating an engaging entrance effect.
:::

:::card {padded slide-right}
### Slide Right {bold}

Scale animations provide subtle growth effects that feel organic.
:::

:::card {padded slide-left}
### Slide Left {bold}

Elements can slide in from the right, perfect for side-by-side layouts.
:::
:::

## How It Works {huge-bold center}

The scroll animation system uses the **Intersection Observer API** - a modern, performant web standard that efficiently detects when elements enter the viewport.

:::card {glass-dark padded-lg slide-up}
### Key Features {large-bold}

1. **Zero Configuration**: Just add animation classes - no JavaScript setup needed
2. **Automatic Detection**: The compiler detects animation classes and includes the behavior
3. **Performance First**: Uses Intersection Observer for efficient scroll tracking
4. **Accessibility**: Respects `prefers-reduced-motion` system preference
5. **Progressive Enhancement**: Content remains visible if JavaScript fails
6. **Staggered Timing**: Multiple elements animate with slight delays for polish
:::

:::card {padded-xl fade-in}
### Available Animations {large-bold center}

| Animation Class | Effect | Best For |
|----------------|--------|----------|
| `fade-in` | Gentle opacity fade | Subtle entrances |
| `slide-up` | Slide from below | Cards, content blocks |
| `slide-down` | Slide from above | Headers, alerts |
| `slide-left` | Slide from right | Horizontal layouts |
| `slide-right` | Slide from left | Horizontal layouts |
| `scale-in` | Grow from center | Emphasis, callouts |
| `zoom-in` | Dramatic zoom | Hero elements |
:::

## Usage Example {huge-bold center primary}

Simply add animation classes to any element using Taildown's plain English syntax:

```taildown
:::card {glass padded slide-up}
## My Animated Card

This card will slide up when scrolled into view!
:::
```

:::alert{success slide-down}
**Professional UX Standards**

These animations follow industry best practices:
- Duration: 4.5 seconds for elegant, noticeable effects
- Easing: Smooth cubic-bezier curves for organic motion  
- Threshold: Triggers at 15% visibility for early engagement
- Stagger: 75ms delay between multiple elements
- Accessibility: Instant visibility for reduced-motion users
:::

:::card {glass-dark padded-xl zoom-in}
## The Taildown Philosophy {huge-bold center}

Beautiful animations should be:
- **Effortless** - No configuration or JavaScript knowledge required
- **Professional** - Following modern UX best practices
- **Performant** - Using cutting-edge web APIs
- **Accessible** - Respecting user preferences
- **Graceful** - Degrading elegantly without JavaScript

That's the Taildown way. {large center muted}
:::

