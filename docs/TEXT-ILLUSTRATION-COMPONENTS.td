# Text-Based Illustration Components {huge-bold center primary}

Modern professional components for directory trees and flow diagrams. {large muted center}

---

## Overview {large-bold}

Taildown now includes two specialized components for text-based illustrations:

- **Tree Component** - Directory structures and hierarchical visualizations
- **Flow Component** - Process flows and decision diagrams

These components replace crude ASCII diagrams with professional, mobile-optimized styling that matches our modern UI/UX standards.

---

## Design Philosophy {large-bold}

:::alert {info}
:icon[info]{primary} These components follow Taildown's core principles:

- Plain English syntax for variants
- Mobile-first responsive design
- Professional glassmorphism effects
- Zero configuration required
- Fully accessible HTML output
:::

### Key Features

- **Mobile Optimized** - Responsive layouts adapt from phone to desktop
- **Professional Styling** - Modern visual design with subtle animations
- **Multiple Variants** - Different styles for different use cases
- **Semantic HTML** - Uses proper list markup for accessibility
- **CSS-Only** - No JavaScript required for basic functionality

---

## Tree Component {large-bold}

### Basic Usage

```taildown
:::tree
- project/
  - src/
    - components/
    - utils/
  - tests/
  - package.json
:::
```

### Variants

#### VS Code Variant

VS Code style with chevrons and connecting lines, perfect for developers.

```taildown
:::tree {vscode}
- project/
  - src/
    - components/
    - utils/
  - package.json
:::
```

#### Default Variant

Clean modern tree with subtle borders and connectors.

```taildown
:::tree
- root/
  - folder1/
  - folder2/
:::
```

#### Minimal Variant

Ultra-clean with no visual clutter, perfect for dense documentation.

```taildown
:::tree {minimal}
- app/
  - components/
  - pages/
:::
```

#### Colored Variant

Color-coded by depth for better visual hierarchy.

```taildown
:::tree {colored}
- monorepo/
  - packages/
    - ui/
    - utils/
  - apps/
    - web/
    - mobile/
:::
```

#### Rounded Variant

Soft rounded connectors with blue accents.

```taildown
:::tree {rounded}
- website/
  - public/
  - src/
:::
```

#### Glass Variant

Modern glassmorphism effect.

```taildown
:::tree {glass}
- design-system/
  - tokens/
  - components/
:::
```

#### Dark Variant

Dark theme optimized styling.

```taildown
:::tree {dark}
- project/
  - src/
  - dist/
:::
```

### Size Variants

```taildown
Small:  :::tree {sm}
Medium: :::tree {md}
Large:  :::tree {lg}
```

---

## Flow Component {large-bold}

### Basic Usage

```taildown
:::flow
- Start
- Process
- Validate
- Complete
:::
```

### Variants

#### Default (Vertical Flow)

Vertical flow with connecting arrows.

```taildown
:::flow
- Initialize
- Load Data
- Process
- Save Results
:::
```

#### Horizontal Flow

Left-to-right process flow.

```taildown
:::flow {horizontal}
- Input
- Transform
- Output
:::
```

#### Stepped Flow

Step-by-step with automatic numbering.

```taildown
:::flow {stepped}
- Create Account
- Verify Email
- Set Password
- Complete Setup
:::
```

#### Branching Flow

Decision tree with nested branches.

```taildown
:::flow {branching}
- Request
  - Validate
    - Valid
      - Process
    - Invalid
      - Reject
:::
```

#### Timeline Flow

Timeline-style presentation.

```taildown
:::flow {timeline}
- Planning
- Development
- Testing
- Deployment
:::
```

#### Minimal Flow

Clean minimal styling.

```taildown
:::flow {minimal}
- Step 1
- Step 2
- Step 3
:::
```

#### Glass Flow

Glassmorphism effect.

```taildown
:::flow {glass}
- Start
- Process
- End
:::
```

#### Dark Flow

Dark theme optimized.

```taildown
:::flow {dark}
- Input
- Process
- Output
:::
```

---

## Real-World Examples {large-bold}

### Monorepo Structure

:::tree {colored lg}
- monorepo/
  - apps/
    - web/
      - src/
        - app/
        - components/
      - public/
    - mobile/
      - src/
        - screens/
  - packages/
    - ui/
      - src/
    - utils/
      - src/
  - tools/
  - pnpm-workspace.yaml
:::

### API Request Pipeline

:::flow {stepped}
- Client Request
- API Gateway
- Authentication
- Route Handler
- Service Layer
- Database Query
- Response Formatting
- Client Response
:::

### CI/CD Pipeline

:::flow {branching}
- Code Push
  - Linter
    - Pass
      - Tests
        - Pass
          - Build
        - Fail
          - Block
    - Fail
      - Reject
:::

---

## Mobile Optimization {large-bold}

All components are fully responsive:

- **Phone** - Compact spacing, reduced font sizes
- **Tablet** - Balanced layout with comfortable spacing
- **Desktop** - Full spacing and visual effects

Horizontal flows automatically convert to vertical on mobile devices.

---

## Accessibility {large-bold}

Both components generate semantic HTML:

- Proper `ul` and `li` elements
- Logical document structure
- Screen reader friendly
- Keyboard navigable (for interactive variants)

---

## CSS Classes Reference {large-bold}

### Tree Component Classes

- `.tree-container` - Main container
- `.tree-default` - Default variant
- `.tree-minimal` - Minimal variant
- `.tree-colored` - Colored variant
- `.tree-rounded` - Rounded variant
- `.tree-glass` - Glass variant
- `.tree-dark` - Dark variant

### Flow Component Classes

- `.flow-container` - Main container
- `.flow-vertical` - Vertical flow (default)
- `.flow-horizontal` - Horizontal flow
- `.flow-stepped` - Stepped with numbers
- `.flow-branching` - Decision tree
- `.flow-timeline` - Timeline style
- `.flow-minimal` - Minimal variant
- `.flow-glass` - Glass variant
- `.flow-dark` - Dark variant

---

## Browser Support {large-bold}

Fully supported in all modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses CSS features:
- CSS Grid
- Flexbox
- CSS Custom Properties
- Pseudo-elements
- Backdrop filters (for glass variants)

---

## Best Practices {large-bold}

### Tree Components

:icon[check]{success} **Do:**
- Use for directory structures
- Use for hierarchical data
- Keep nesting reasonable (max 4-5 levels)
- Use descriptive file/folder names

:icon[x]{error} **Don't:**
- Use for non-hierarchical data
- Create overly deep nesting (hard to read)
- Mix with other content types

### Flow Components

:icon[check]{success} **Do:**
- Use for sequential processes
- Use for decision trees
- Keep steps concise and clear
- Use appropriate variant for context

:icon[x]{error} **Don't:**
- Use for complex multi-dimensional flows
- Create circular flows (use branching instead)
- Overload with too many steps

---

## Performance {large-bold}

Both components are highly optimized:

- **Zero JavaScript** - Pure CSS rendering
- **Tree-Shaken CSS** - Only used classes included
- **Minimal DOM** - Efficient HTML structure
- **Hardware Accelerated** - CSS transforms for animations

---

## Future Enhancements {large-bold}

Planned features for future versions:

- Interactive tree collapse/expand
- Searchable trees
- Flow diagram export to image
- Custom icons per node
- Drag-and-drop reordering
- Connection line customization

---

## Examples in This Repository {large-bold}

See complete examples:

- `examples/11-text-illustrations.td` - Comprehensive showcase
- `test-files/test-tree-flow.td` - Quick test file

---

## Component Implementation {large-bold}

### File Locations

- Component Definitions:
  - `packages/compiler/src/components/standard/tree.ts`
  - `packages/compiler/src/components/standard/flow.ts`
  
- CSS Styling:
  - `packages/compiler/src/renderer/css.ts` (lines 1457-1810)
  
- Component Registry:
  - `packages/compiler/src/components/component-registry.ts`

### Technical Details

Both components:
- Use `div` as container element
- Apply variant classes automatically
- Support all size modifiers
- Work with standard markdown lists
- Generate semantic HTML

---

## Changelog {large-bold}

### Version 0.1.0 (2025-10-06)

:icon[plus]{success} **Added:**
- Tree component with 7 variants
- Flow component with 8 variants
- Responsive mobile layouts
- Glassmorphism effects
- Dark theme support
- Comprehensive documentation
- Real-world examples

---

Built with Taildown :icon[heart]{error} {center muted}
