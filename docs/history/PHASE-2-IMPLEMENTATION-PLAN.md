# Phase 2: Zero-Config Beauty & Plain English System

**Version:** 1.0.0  
**Date:** October 4, 2025  
**Status:** Ready to Begin  
**Estimated Timeline:** Weeks 5-8 (4 weeks)  
**Confidence:** HIGH (Phase 1 foundation is solid ✅)

---

## Executive Summary

Phase 2 transforms Taildown from a functional compiler into a **zero-configuration design system** with an intuitive plain English interface. Users will write `{primary large bold}` instead of `.text-primary .text-4xl .font-bold`, configure entire color palettes with simple JSON, and get glassmorphism, animations, and dark mode automatically.

**Core Philosophy:** Maximum beauty with minimum configuration. Every component should look production-ready by default.

---

## Phase 1 Foundation Review

### What We Have ✅
- ✅ Custom directive parser (100% SYNTAX.md compliant)
- ✅ Basic Markdown + inline attributes + component blocks
- ✅ 3 standard components: `card`, `grid`, `container`
- ✅ ~120 Tailwind utility classes in CSS generator
- ✅ Responsive breakpoints (sm → 2xl)
- ✅ Basic button styling with 3D effects
- ✅ CLI with compilation, minification, inline CSS
- ✅ 19/19 tests passing, excellent performance (11ms for large docs)
- ✅ 10 example documents

### What We're Building in Phase 2 🎯

1. **Plain English Style Resolver** - `{primary}` → `.text-primary-600 .hover:text-primary-700`
2. **Configuration System** - `taildown.config.js` for themes, colors, fonts
3. **Expanded Component Library** - 15+ components with variants
4. **Lucide Icon Integration** - `:icon[heart]` syntax
5. **Glassmorphism & Modern Effects** - Frosted glass, smooth animations
6. **Light/Dark Mode** - Automatic theming with smooth transitions
7. **Enhanced Style System** - 300+ utility classes, semantic colors
8. **Documentation Site** - Built with Taildown (dogfooding)
9. **Updated Examples** - All using plain English syntax

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Plain English Style Resolver](#2-plain-english-style-resolver)
3. [Configuration System](#3-configuration-system)
4. [Component Library Expansion](#4-component-library-expansion)
5. [Icon System (Lucide)](#5-icon-system-lucide)
6. [Theming & Dark Mode](#6-theming--dark-mode)
7. [Glassmorphism & Effects](#7-glassmorphism--effects)
8. [CSS Generator Enhancement](#8-css-generator-enhancement)
9. [Syntax Extensions](#9-syntax-extensions)
10. [Testing Strategy](#10-testing-strategy)
11. [Documentation](#11-documentation)
12. [Timeline & Milestones](#12-timeline--milestones)

---

## 1. Architecture Overview

### 1.1 New Modules

```
packages/
├── compiler/
│   ├── src/
│   │   ├── parser/            [Existing]
│   │   ├── renderer/          [Existing]
│   │   ├── resolver/          [NEW] Plain English → CSS
│   │   │   ├── style-resolver.ts
│   │   │   ├── shorthand-mappings.ts
│   │   │   ├── semantic-colors.ts
│   │   │   └── variant-resolver.ts
│   │   ├── config/            [NEW] Configuration loading
│   │   │   ├── config-loader.ts
│   │   │   ├── config-schema.ts
│   │   │   ├── theme-merger.ts
│   │   │   └── default-config.ts
│   │   ├── components/        [NEW] Component definitions
│   │   │   ├── component-registry.ts
│   │   │   ├── standard/      [15+ components]
│   │   │   │   ├── button.ts
│   │   │   │   ├── card.ts
│   │   │   │   ├── alert.ts
│   │   │   │   ├── badge.ts
│   │   │   │   ├── modal.ts
│   │   │   │   ├── accordion.ts
│   │   │   │   ├── tabs.ts
│   │   │   │   ├── navbar.ts
│   │   │   │   └── ...
│   │   │   └── variant-system.ts
│   │   ├── icons/             [NEW] Icon integration
│   │   │   ├── icon-parser.ts
│   │   │   ├── icon-renderer.ts
│   │   │   └── lucide-icons.ts
│   │   └── themes/            [NEW] Theme system
│   │       ├── theme-resolver.ts
│   │       ├── dark-mode.ts
│   │       ├── color-palette.ts
│   │       └── glassmorphism.ts
│   └── ...
```

### 1.2 Compilation Pipeline Enhancement

**Phase 1 Pipeline:**
```
.td source → Parser → AST → Renderer → HTML + CSS
```

**Phase 2 Pipeline:**
```
.td source
    ↓
Config Loader ← taildown.config.js
    ↓
Parser (+ icon parser)
    ↓
AST with attributes
    ↓
Style Resolver (plain English → CSS classes)
    ↓
Component Resolver (apply variants, defaults)
    ↓
Theme Resolver (colors, dark mode, glassmorphism)
    ↓
Renderer (HTML + Enhanced CSS)
    ↓
HTML + CSS + Icons
```

---

## 2. Plain English Style Resolver

### 2.1 Overview

Transform intuitive keywords into precise CSS classes.

**Before (Phase 1):**
```taildown
# Heading {.text-4xl .font-bold .text-blue-600 .text-center}
```

**After (Phase 2):**
```taildown
# Heading {primary large bold center}
```

### 2.2 Shorthand Categories

#### 2.2.1 Colors (Semantic)

| Plain English | Resolves To | Use Case |
|--------------|-------------|----------|
| `primary` | `text-primary-600 hover:text-primary-700` | Main brand color |
| `secondary` | `text-secondary-600 hover:text-secondary-700` | Secondary brand |
| `accent` | `text-accent-600 hover:text-accent-700` | Call-to-action |
| `muted` | `text-gray-500` | Subtle text |
| `success` | `text-green-600` | Success states |
| `warning` | `text-yellow-600` | Warning states |
| `error` | `text-red-600` | Error states |
| `info` | `text-blue-600` | Info states |

**With Prefixes:**
- `bg-primary` → `bg-primary-600 hover:bg-primary-700`
- `border-accent` → `border-accent-600`

#### 2.2.2 Typography

| Plain English | Resolves To | CSS Output |
|--------------|-------------|------------|
| `xs` | `text-xs` | 0.75rem |
| `small` | `text-sm` | 0.875rem |
| `base` | `text-base` | 1rem |
| `large` | `text-lg` | 1.125rem |
| `xl` | `text-xl` | 1.25rem |
| `2xl` | `text-2xl` | 1.5rem |
| `huge` | `text-4xl` | 2.25rem |
| `massive` | `text-6xl` | 3.75rem |
| `bold` | `font-bold` | 700 |
| `semibold` | `font-semibold` | 600 |
| `medium` | `font-medium` | 500 |
| `light` | `font-light` | 300 |

#### 2.2.3 Layout & Spacing

| Plain English | Resolves To | Purpose |
|--------------|-------------|---------|
| `center` | `text-center` | Center text |
| `center-x` | `mx-auto` | Center horizontally |
| `center-y` | `my-auto` | Center vertically |
| `flex` | `flex items-center` | Flex with center |
| `flex-col` | `flex flex-col` | Vertical flex |
| `grid-2` | `grid grid-cols-2` | 2-column grid |
| `grid-3` | `grid grid-cols-3` | 3-column grid |
| `grid-4` | `grid grid-cols-4` | 4-column grid |
| `gap-sm` | `gap-2` | Small gap |
| `gap` | `gap-4` | Normal gap |
| `gap-lg` | `gap-8` | Large gap |
| `padded` | `p-6` | Normal padding |
| `padded-sm` | `p-4` | Small padding |
| `padded-lg` | `p-8` | Large padding |
| `tight` | `space-y-1` | Tight vertical space |
| `relaxed` | `space-y-4` | Relaxed vertical space |
| `loose` | `space-y-8` | Loose vertical space |

#### 2.2.4 Effects & Interactions

| Plain English | Resolves To | Effect |
|--------------|-------------|--------|
| `rounded` | `rounded-lg` | Rounded corners |
| `rounded-sm` | `rounded-md` | Small rounded |
| `rounded-full` | `rounded-full` | Fully rounded |
| `shadow` | `shadow-md` | Basic shadow |
| `elevated` | `shadow-xl` | Elevated shadow |
| `floating` | `shadow-2xl` | Floating effect |
| `glass` | `backdrop-blur-md bg-white/80` | Glassmorphism |
| `glass-dark` | `backdrop-blur-md bg-black/60` | Dark glass |
| `gradient` | `bg-gradient-to-r from-primary-600 to-accent-600` | Gradient |
| `glow` | `shadow-lg shadow-primary-500/50` | Glow effect |
| `hover-lift` | `hover:transform hover:-translate-y-1 transition-transform` | Lift on hover |
| `hover-grow` | `hover:scale-105 transition-transform` | Grow on hover |
| `hover-glow` | `hover:shadow-xl hover:shadow-primary-500/50 transition-shadow` | Glow on hover |
| `smooth` | `transition-all duration-300 ease-out` | Smooth transition |
| `fast` | `transition-all duration-150` | Fast transition |

### 2.3 Implementation

**File: `packages/compiler/src/resolver/style-resolver.ts`**

```typescript
/**
 * Style Resolver - Plain English to CSS Classes
 * See SYNTAX.md §2 for inline attributes specification
 * Phase 2: Adds plain English shorthand resolution
 */

import type { TaildownConfig } from '../config/config-schema';
import { SHORTHAND_MAPPINGS } from './shorthand-mappings';
import { resolveSemanticColor } from './semantic-colors';
import { resolveVariant } from './variant-resolver';

export interface ResolverContext {
  config: TaildownConfig;
  darkMode: boolean;
}

/**
 * Resolve plain English attributes to CSS classes
 * 
 * Input: ['primary', 'large', 'bold', 'center']
 * Output: ['text-primary-600', 'hover:text-primary-700', 'text-4xl', 'font-bold', 'text-center']
 */
export function resolveAttributes(
  attributes: string[],
  context: ResolverContext
): string[] {
  const resolved: string[] = [];

  for (const attr of attributes) {
    // Already a CSS class (starts with . in original syntax, but . is stripped)
    if (attr.includes('-') && !isShorthand(attr)) {
      resolved.push(attr);
      continue;
    }

    // Check if it's a shorthand
    const shorthand = SHORTHAND_MAPPINGS[attr];
    if (shorthand) {
      if (typeof shorthand === 'string') {
        resolved.push(shorthand);
      } else if (typeof shorthand === 'function') {
        resolved.push(...shorthand(context));
      }
      continue;
    }

    // Check if it's a semantic color
    const colorClasses = resolveSemanticColor(attr, context);
    if (colorClasses) {
      resolved.push(...colorClasses);
      continue;
    }

    // Check if it's a variant (component-specific)
    const variantClasses = resolveVariant(attr, context);
    if (variantClasses) {
      resolved.push(...variantClasses);
      continue;
    }

    // Unknown: pass through as-is (could be custom class)
    resolved.push(attr);
  }

  return resolved;
}

function isShorthand(attr: string): boolean {
  return attr in SHORTHAND_MAPPINGS || 
         attr.startsWith('primary') || 
         attr.startsWith('secondary') || 
         attr.startsWith('accent');
}
```

**File: `packages/compiler/src/resolver/shorthand-mappings.ts`**

```typescript
/**
 * Shorthand to CSS class mappings
 * Phase 2: Plain English vocabulary
 */

import type { ResolverContext } from './style-resolver';

export type ShorthandMapping = 
  | string 
  | string[] 
  | ((context: ResolverContext) => string[]);

export const SHORTHAND_MAPPINGS: Record<string, ShorthandMapping> = {
  // Typography sizes
  xs: 'text-xs',
  small: 'text-sm',
  base: 'text-base',
  large: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  huge: 'text-4xl',
  massive: 'text-6xl',

  // Font weights
  bold: 'font-bold',
  semibold: 'font-semibold',
  medium: 'font-medium',
  light: 'font-light',

  // Text alignment
  center: 'text-center',
  left: 'text-left',
  right: 'text-right',

  // Layout
  'center-x': 'mx-auto',
  'center-y': 'my-auto',
  flex: ['flex', 'items-center'],
  'flex-col': ['flex', 'flex-col'],
  'grid-2': ['grid', 'grid-cols-2'],
  'grid-3': ['grid', 'grid-cols-3'],
  'grid-4': ['grid', 'grid-cols-4'],

  // Spacing
  padded: 'p-6',
  'padded-sm': 'p-4',
  'padded-lg': 'p-8',
  'padded-xl': 'p-12',
  'gap': 'gap-4',
  'gap-sm': 'gap-2',
  'gap-lg': 'gap-8',

  // Effects
  rounded: 'rounded-lg',
  'rounded-sm': 'rounded-md',
  'rounded-full': 'rounded-full',
  shadow: 'shadow-md',
  elevated: 'shadow-xl',
  floating: 'shadow-2xl',

  // Glassmorphism
  glass: (ctx) => [
    'backdrop-blur-md',
    ctx.darkMode ? 'bg-white/10' : 'bg-white/80',
    'border',
    ctx.darkMode ? 'border-white/20' : 'border-gray-200/50'
  ],
  'glass-dark': ['backdrop-blur-md', 'bg-black/60', 'border', 'border-white/10'],

  // Transitions
  smooth: ['transition-all', 'duration-300', 'ease-out'],
  fast: ['transition-all', 'duration-150'],
  slow: ['transition-all', 'duration-500'],

  // Hover effects
  'hover-lift': ['hover:transform', 'hover:-translate-y-1', 'transition-transform', 'duration-200'],
  'hover-grow': ['hover:scale-105', 'transition-transform', 'duration-200'],
  'hover-glow': (ctx) => [
    'hover:shadow-xl',
    `hover:shadow-${ctx.config.theme.colors.primary.DEFAULT}/50`,
    'transition-shadow',
    'duration-200'
  ],

  // State colors
  muted: 'text-gray-500',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',
};
```

**File: `packages/compiler/src/resolver/semantic-colors.ts`**

```typescript
/**
 * Semantic color resolution
 * Resolves primary, secondary, accent with prefixes
 */

import type { ResolverContext } from './style-resolver';

export function resolveSemanticColor(
  attr: string,
  context: ResolverContext
): string[] | null {
  // Match patterns: primary, bg-primary, border-primary
  const match = attr.match(/^(bg-|text-|border-)?(primary|secondary|accent)$/);
  if (!match) return null;

  const [, prefix = 'text-', color] = match;
  const theme = context.config.theme.colors;

  // Get the color from config
  const colorValue = theme[color]?.DEFAULT || theme[color]?.[600];
  
  if (!colorValue) return null;

  // Return base + hover variant
  return [
    `${prefix}${color}-600`,
    `hover:${prefix}${color}-700`
  ];
}
```

### 2.4 Integration

Update `packages/compiler/src/parser/attributes.ts` to use resolver:

```typescript
import { resolveAttributes } from '../resolver/style-resolver';

// In processAttributes function:
const rawClasses = extractClassNames(attributeText);
const resolvedClasses = resolveAttributes(rawClasses, resolverContext);
data.hProperties.className = resolvedClasses;
```

---

## 3. Configuration System

### 3.1 Config File Format

**File: `taildown.config.js` (project root)**

```javascript
/**
 * Taildown Configuration
 * Phase 2: Zero-config beauty with customization
 */

export default {
  // Theme configuration
  theme: {
    colors: {
      // Semantic colors
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        DEFAULT: '#3b82f6'
      },
      secondary: {
        DEFAULT: '#8b5cf6',
        50: '#faf5ff',
        // ... full scale
      },
      accent: {
        DEFAULT: '#ec4899',
        // ... full scale
      }
    },
    
    fonts: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Fira Code, Menlo, monospace'
    },

    // Glassmorphism settings
    glass: {
      blur: 'md',           // sm | md | lg | xl
      opacity: 80,          // 0-100
      borderOpacity: 20,    // 0-100
    },

    // Animation settings
    animations: {
      speed: 'normal',      // fast | normal | slow
      easing: 'ease-out',   // linear | ease | ease-in | ease-out | ease-in-out
    },

    // Dark mode
    darkMode: {
      enabled: true,
      toggle: 'class',      // class | media | manual
      transitionSpeed: 300, // ms
    }
  },

  // Component overrides
  components: {
    card: {
      defaultVariant: 'elevated',
      variants: {
        flat: {
          classes: ['shadow-none', 'border', 'border-gray-200']
        },
        elevated: {
          classes: ['shadow-xl', 'hover:shadow-2xl', 'smooth']
        },
        glass: {
          classes: ['glass', 'shadow-lg']
        }
      }
    },
    button: {
      defaultVariant: 'primary',
      // ... more variants
    }
  },

  // Output options
  output: {
    minify: false,
    inlineStyles: false,
    darkMode: true,
  },

  // Plugin system (Phase 3)
  plugins: []
};
```

### 3.2 Config Loader Implementation

**File: `packages/compiler/src/config/config-loader.ts`**

```typescript
/**
 * Configuration loader
 * Loads and validates taildown.config.js
 */

import { pathToFileURL } from 'url';
import { resolve } from 'path';
import type { TaildownConfig } from './config-schema';
import { DEFAULT_CONFIG } from './default-config';
import { mergeConfig } from './theme-merger';

export async function loadConfig(
  cwd: string = process.cwd()
): Promise<TaildownConfig> {
  try {
    // Try to load taildown.config.js
    const configPath = resolve(cwd, 'taildown.config.js');
    const configURL = pathToFileURL(configPath).href;
    
    const module = await import(configURL);
    const userConfig = module.default || module;

    // Merge with defaults
    return mergeConfig(DEFAULT_CONFIG, userConfig);
  } catch (error) {
    // No config file or error loading - use defaults
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      return DEFAULT_CONFIG;
    }
    throw new Error(`Failed to load config: ${error.message}`);
  }
}
```

**File: `packages/compiler/src/config/default-config.ts`**

```typescript
/**
 * Default Taildown configuration
 * Zero-config beauty: Production-ready out of the box
 */

import type { TaildownConfig } from './config-schema';

export const DEFAULT_CONFIG: TaildownConfig = {
  theme: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        DEFAULT: '#3b82f6'
      },
      secondary: {
        DEFAULT: '#8b5cf6',
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
      },
      accent: {
        DEFAULT: '#ec4899',
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9f1239',
        900: '#831843',
      },
      // Utility colors
      gray: {
        DEFAULT: '#6b7280',
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    fonts: {
      sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: '"Fira Code", Menlo, Monaco, Consolas, monospace',
    },
    glass: {
      blur: 'md',
      opacity: 80,
      borderOpacity: 20,
    },
    animations: {
      speed: 'normal',
      easing: 'ease-out',
    },
    darkMode: {
      enabled: true,
      toggle: 'class',
      transitionSpeed: 300,
    }
  },
  components: {
    // Standard components with beautiful defaults
  },
  output: {
    minify: false,
    inlineStyles: false,
    darkMode: true,
  }
};
```

---

## 4. Component Library Expansion

### 4.1 New Components (15 Total)

| Component | Purpose | Variants |
|-----------|---------|----------|
| **button** | Call-to-action | primary, secondary, outline, ghost, link, destructive |
| **card** | Content container | flat, elevated, glass, bordered, interactive |
| **alert** | Status messages | info, success, warning, error |
| **badge** | Labels and tags | primary, secondary, success, warning, error, outline |
| **avatar** | User images | sm, md, lg, circle, square |
| **tabs** | Tab navigation | default, pills, underline |
| **accordion** | Collapsible content | default, bordered, flush |
| **modal** | Dialog overlays | sm, md, lg, xl, fullscreen |
| **navbar** | Navigation bar | fixed, sticky, default |
| **sidebar** | Side navigation | left, right, collapsible |
| **breadcrumb** | Navigation path | default, slash, chevron |
| **pagination** | Page navigation | default, simple, compact |
| **progress** | Progress bar | default, striped, animated |
| **skeleton** | Loading placeholder | default, circular, rounded |
| **tooltip** | Hover information | top, bottom, left, right |

### 4.2 Component Definition Structure

**File: `packages/compiler/src/components/component-registry.ts`**

```typescript
/**
 * Component Registry
 * Central registration for all Taildown components
 */

import type { ComponentDefinition } from '@taildown/shared';
import { cardComponent } from './standard/card';
import { buttonComponent } from './standard/button';
import { alertComponent } from './standard/alert';
// ... import all components

export const COMPONENT_REGISTRY: Record<string, ComponentDefinition> = {
  // Phase 1 components (enhanced)
  card: cardComponent,
  grid: gridComponent,
  container: containerComponent,
  
  // Phase 2 components
  button: buttonComponent,
  alert: alertComponent,
  badge: badgeComponent,
  avatar: avatarComponent,
  tabs: tabsComponent,
  accordion: accordionComponent,
  modal: modalComponent,
  navbar: navbarComponent,
  sidebar: sidebarComponent,
  breadcrumb: breadcrumbComponent,
  pagination: paginationComponent,
  progress: progressComponent,
  skeleton: skeletonComponent,
  tooltip: tooltipComponent,
};

export function getComponent(name: string): ComponentDefinition | undefined {
  return COMPONENT_REGISTRY[name];
}
```

### 4.3 Enhanced Card Component

**File: `packages/compiler/src/components/standard/card.ts`**

```typescript
/**
 * Card Component
 * Phase 2: Enhanced with variants and glassmorphism
 */

import type { ComponentDefinition } from '@taildown/shared';

export const cardComponent: ComponentDefinition = {
  name: 'card',
  htmlElement: 'div',
  
  defaultClasses: [
    'p-6',
    'rounded-lg',
    'bg-white',
    'dark:bg-gray-800',
    'shadow-md',
    'transition-shadow',
    'duration-200',
    'overflow-auto',
    'max-w-full',
  ],

  variants: {
    flat: {
      classes: ['shadow-none', 'border', 'border-gray-200', 'dark:border-gray-700']
    },
    elevated: {
      classes: ['shadow-xl', 'hover:shadow-2xl']
    },
    glass: {
      classes: [
        'backdrop-blur-md',
        'bg-white/80',
        'dark:bg-gray-900/60',
        'border',
        'border-white/20',
        'shadow-lg'
      ]
    },
    bordered: {
      classes: ['border-2', 'border-gray-300', 'dark:border-gray-600', 'shadow-sm']
    },
    interactive: {
      classes: [
        'cursor-pointer',
        'hover:shadow-xl',
        'hover:-translate-y-1',
        'transform',
        'transition-all',
        'duration-200'
      ]
    }
  },

  // Dark mode support
  darkModeClasses: {
    'bg-white': 'dark:bg-gray-800',
    'text-gray-900': 'dark:text-gray-100',
    'border-gray-200': 'dark:border-gray-700',
  }
};
```

### 4.4 Button Component (New)

**File: `packages/compiler/src/components/standard/button.ts`**

```typescript
/**
 * Button Component
 * shadcn-inspired with 3D effects and smooth animations
 */

import type { ComponentDefinition } from '@taildown/shared';

export const buttonComponent: ComponentDefinition = {
  name: 'button',
  htmlElement: 'button',
  
  // Note: For links styled as buttons, we apply classes to <a> tags
  alternativeElements: ['a'],

  defaultClasses: [
    'inline-flex',
    'items-center',
    'justify-center',
    'px-6',
    'py-3',
    'rounded-lg',
    'font-semibold',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ],

  variants: {
    primary: {
      classes: [
        'bg-primary-600',
        'hover:bg-primary-700',
        'text-white',
        'shadow-md',
        'hover:shadow-lg',
        'hover:-translate-y-0.5',
        'active:translate-y-0',
        'focus:ring-primary-500'
      ]
    },
    secondary: {
      classes: [
        'bg-secondary-600',
        'hover:bg-secondary-700',
        'text-white',
        'shadow-md',
        'hover:shadow-lg',
        'focus:ring-secondary-500'
      ]
    },
    outline: {
      classes: [
        'border-2',
        'border-primary-600',
        'text-primary-600',
        'hover:bg-primary-50',
        'dark:hover:bg-primary-900/20',
        'focus:ring-primary-500'
      ]
    },
    ghost: {
      classes: [
        'hover:bg-gray-100',
        'dark:hover:bg-gray-800',
        'text-gray-700',
        'dark:text-gray-300'
      ]
    },
    link: {
      classes: [
        'text-primary-600',
        'hover:text-primary-700',
        'hover:underline',
        'px-0',
        'py-0'
      ]
    },
    destructive: {
      classes: [
        'bg-red-600',
        'hover:bg-red-700',
        'text-white',
        'shadow-md',
        'hover:shadow-lg',
        'focus:ring-red-500'
      ]
    }
  },

  sizes: {
    sm: {
      classes: ['px-4', 'py-2', 'text-sm']
    },
    md: {
      classes: ['px-6', 'py-3', 'text-base']
    },
    lg: {
      classes: ['px-8', 'py-4', 'text-lg']
    }
  }
};
```

### 4.5 Alert Component (New)

**File: `packages/compiler/src/components/standard/alert.ts`**

```typescript
/**
 * Alert Component
 * Status messages with icons and dismissible variants
 */

import type { ComponentDefinition } from '@taildown/shared';

export const alertComponent: ComponentDefinition = {
  name: 'alert',
  htmlElement: 'div',
  
  defaultClasses: [
    'p-4',
    'rounded-lg',
    'border-l-4',
    'flex',
    'items-start',
    'gap-3',
  ],

  variants: {
    info: {
      classes: [
        'bg-blue-50',
        'border-blue-500',
        'text-blue-900',
        'dark:bg-blue-900/20',
        'dark:text-blue-100'
      ]
    },
    success: {
      classes: [
        'bg-green-50',
        'border-green-500',
        'text-green-900',
        'dark:bg-green-900/20',
        'dark:text-green-100'
      ]
    },
    warning: {
      classes: [
        'bg-yellow-50',
        'border-yellow-500',
        'text-yellow-900',
        'dark:bg-yellow-900/20',
        'dark:text-yellow-100'
      ]
    },
    error: {
      classes: [
        'bg-red-50',
        'border-red-500',
        'text-red-900',
        'dark:bg-red-900/20',
        'dark:text-red-100'
      ]
    }
  },

  // Optional icon integration
  icons: {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'x-circle'
  }
};
```

---

## 5. Icon System (Lucide)

### 5.1 Syntax

**SYNTAX.md Extension (§2.6):**

```taildown
:icon[icon-name]                    # Basic icon
:icon[icon-name]{size-6 primary}    # Styled icon
:icon[heart]{large error}           # Plain English styles
```

### 5.2 Implementation

**File: `packages/compiler/src/icons/icon-parser.ts`**

```typescript
/**
 * Icon Parser
 * Parses :icon[name]{.classes} syntax
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text } from 'mdast';

const ICON_REGEX = /:icon\[([a-z-]+)\](\{[^}]+\})?/g;

export const parseIcons: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      const text = node.value;
      
      if (!text.includes(':icon[')) return;

      const matches = Array.from(text.matchAll(ICON_REGEX));
      if (matches.length === 0) return;

      const newNodes = [];
      let lastIndex = 0;

      for (const match of matches) {
        const [fullMatch, iconName, attributes] = match;
        const startIndex = match.index!;

        // Text before icon
        if (startIndex > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, startIndex)
          });
        }

        // Icon node
        const iconNode = {
          type: 'icon',
          data: {
            hName: 'svg',
            hProperties: {
              'data-lucide': iconName,
              className: extractClasses(attributes),
              width: '24',
              height: '24',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': '2',
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round'
            }
          }
        };

        newNodes.push(iconNode);
        lastIndex = startIndex + fullMatch.length;
      }

      // Text after last icon
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex)
        });
      }

      // Replace node with new nodes
      parent.children.splice(index, 1, ...newNodes);
    });
  };
};
```

**File: `packages/compiler/src/icons/icon-renderer.ts`**

```typescript
/**
 * Icon Renderer
 * Converts icon nodes to Lucide SVG
 */

import { icons } from 'lucide';

export function renderIcon(iconName: string): string {
  // Lucide uses PascalCase (e.g., AlertCircle)
  const pascalName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const iconData = icons[pascalName];
  
  if (!iconData) {
    console.warn(`Icon not found: ${iconName}`);
    return `<!-- Icon not found: ${iconName} -->`;
  }

  // Return SVG path data
  return iconData.toSvg();
}
```

### 5.3 Lucide Integration

```bash
pnpm add lucide
```

**Usage in examples:**

```taildown
:::alert {info}
:icon[info]{size-5 text-blue-600} This is an info alert with an icon
:::

:::card {glass}
# Card with Icons :icon[heart]{error inline}

:icon[github]{size-6} [View on GitHub](#)
:::
```

---

## 6. Theming & Dark Mode

### 6.1 Dark Mode Strategy

**Automatic dark mode using CSS class toggle:**

```css
/* Root element gets .dark class */
html.dark {
  color-scheme: dark;
}

/* All dark mode utilities use dark: prefix */
.dark .dark\:bg-gray-800 {
  background-color: #1f2937;
}
```

### 6.2 Dark Mode Toggle Component

**File: `packages/compiler/src/themes/dark-mode.ts`**

```typescript
/**
 * Dark Mode System
 * Generates CSS for light/dark theme switching
 */

export function generateDarkModeCSS(): string {
  return `
/* Dark Mode Base */
html {
  color-scheme: light;
  transition: background-color 300ms ease, color 300ms ease;
}

html.dark {
  color-scheme: dark;
}

/* Dark mode toggle (injected by default) */
.dark-mode-toggle {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 50;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.dark .dark-mode-toggle {
  background: rgba(31, 41, 55, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

.dark-mode-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2);
}

/* Auto-inject dark mode toggle script */
.dark-mode-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 300ms ease;
}

.dark .dark-mode-toggle svg {
  transform: rotate(180deg);
}
`;
}

export function generateDarkModeScript(): string {
  return `
<script>
// Dark mode toggle - injected automatically
(function() {
  // Check for saved preference or default to system
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.classList.add('dark');
  }

  // Create toggle button
  const toggle = document.createElement('button');
  toggle.className = 'dark-mode-toggle';
  toggle.setAttribute('aria-label', 'Toggle dark mode');
  toggle.innerHTML = \`
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path class="sun-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      <path class="moon-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" style="display: none;" />
    </svg>
  \`;

  toggle.onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Toggle icon
    const sun = toggle.querySelector('.sun-icon');
    const moon = toggle.querySelector('.moon-icon');
    if (isDark) {
      sun.style.display = 'none';
      moon.style.display = 'block';
    } else {
      sun.style.display = 'block';
      moon.style.display = 'none';
    }
  };

  document.body.appendChild(toggle);

  // Update icon on load
  if (document.documentElement.classList.contains('dark')) {
    toggle.querySelector('.sun-icon').style.display = 'none';
    toggle.querySelector('.moon-icon').style.display = 'block';
  }
})();
</script>
`;
}
```

### 6.3 CSS Color Variables

**File: `packages/compiler/src/themes/color-palette.ts`**

```typescript
/**
 * Color Palette Generator
 * Generates CSS custom properties from config
 */

import type { TaildownConfig } from '../config/config-schema';

export function generateColorVariables(config: TaildownConfig): string {
  const { colors } = config.theme;

  let css = ':root {\n';

  // Generate CSS variables for each color
  for (const [colorName, colorValue] of Object.entries(colors)) {
    if (typeof colorValue === 'object') {
      for (const [shade, hex] of Object.entries(colorValue)) {
        css += `  --color-${colorName}-${shade}: ${hex};\n`;
      }
    } else {
      css += `  --color-${colorName}: ${colorValue};\n`;
    }
  }

  css += '}\n\n';

  // Dark mode overrides (if custom dark colors)
  if (config.theme.darkMode?.enabled) {
    css += 'html.dark {\n';
    css += `  --color-background: ${colors.gray[900]};\n`;
    css += `  --color-foreground: ${colors.gray[50]};\n`;
    // ... more dark mode variables
    css += '}\n';
  }

  return css;
}
```

---

## 7. Glassmorphism & Effects

### 7.1 Glassmorphism CSS

**File: `packages/compiler/src/themes/glassmorphism.ts`**

```typescript
/**
 * Glassmorphism Effects
 * Modern frosted glass aesthetics
 */

import type { TaildownConfig } from '../config/config-schema';

export function generateGlassmorphismCSS(config: TaildownConfig): string {
  const { blur, opacity, borderOpacity } = config.theme.glass;

  const blurValues = {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  };

  return `
/* Glassmorphism Utilities */
.glass {
  backdrop-filter: blur(${blurValues[blur]});
  -webkit-backdrop-filter: blur(${blurValues[blur]});
  background-color: rgba(255, 255, 255, ${opacity / 100});
  border: 1px solid rgba(255, 255, 255, ${borderOpacity / 100});
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.dark .glass {
  background-color: rgba(15, 23, 42, ${opacity / 100});
  border-color: rgba(255, 255, 255, ${borderOpacity / 100});
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.glass-blur-sm { backdrop-filter: blur(4px); }
.glass-blur-md { backdrop-filter: blur(8px); }
.glass-blur-lg { backdrop-filter: blur(12px); }
.glass-blur-xl { backdrop-filter: blur(16px); }

/* Glass card variant */
.component-card.glass {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.component-card.glass:hover {
  backdrop-filter: blur(${blurValues[blur]}) saturate(180%);
  box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.25);
  transform: translateY(-2px);
}

/* Gradient overlays for glass */
.glass-gradient {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
}

.dark .glass-gradient {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
}
`;
}
```

### 7.2 Animation Effects

**File: `packages/compiler/src/themes/animations.ts`**

```typescript
/**
 * Animation System
 * Slick, fast, subtle animations
 */

export function generateAnimationCSS(): string {
  return `
/* Animation Utilities */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Animation classes */
.animate-fade-in {
  animation: fadeIn 300ms ease-out;
}

.animate-slide-up {
  animation: slideUp 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slide-down {
  animation: slideDown 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-scale-in {
  animation: scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Smooth page transitions */
body {
  animation: fadeIn 200ms ease-out;
}

/* Component entrance animations */
.component-card,
.component-alert,
.component-modal {
  animation: scaleIn 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects with smooth transitions */
.hover-lift {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-4px);
}

/* Glow effect */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
  }
}

.glow {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;
}
```

---

## 8. CSS Generator Enhancement

### 8.1 Expanded Utility Classes

Update `packages/compiler/src/renderer/css.ts`:

**Add 300+ utility classes covering:**
- Complete color palette (all shades for primary/secondary/accent/gray)
- All typography sizes (xs → 9xl)
- All spacing values (0 → 96)
- All border radius values
- All shadow values
- Flexbox utilities
- Grid utilities (cols/rows 1-12)
- Positioning utilities
- Z-index utilities
- Opacity utilities
- Transform utilities

### 8.2 Tree-Shaking Enhanced

```typescript
/**
 * Enhanced CSS generator with tree-shaking
 */

export function generateOptimizedCSS(
  classes: Set<string>,
  config: TaildownConfig,
  darkMode: boolean
): string {
  const cssRules: string[] = [];

  // 1. Base reset + custom properties
  cssRules.push(generateReset());
  cssRules.push(generateColorVariables(config));

  // 2. Used utilities only
  cssRules.push(generateUtilities(classes, config));

  // 3. Component styles
  cssRules.push(generateComponentStyles(config));

  // 4. Glassmorphism
  cssRules.push(generateGlassmorphismCSS(config));

  // 5. Animations
  cssRules.push(generateAnimationCSS());

  // 6. Dark mode
  if (darkMode) {
    cssRules.push(generateDarkModeCSS());
  }

  return cssRules.join('\n\n');
}
```

---

## 9. Syntax Extensions

### 9.1 SYNTAX.md Updates

Add new sections:

**§2.6 Icon Syntax [REQUIRED]**
```taildown
:icon[icon-name]                    # Basic icon
:icon[icon-name]{.classes}          # With classes
:icon[heart]{large error}           # Plain English
```

**§2.7 Plain English Shorthands [REQUIRED]**
```taildown
# Heading {primary large bold center}

Instead of:
# Heading {.text-primary-600 .text-4xl .font-bold .text-center}
```

**§3.5 Component Variants [REQUIRED]**
```taildown
:::card {elevated}      # Use named variant
:::card {glass}         # Glassmorphism variant
:::button {primary lg}  # Variant + size
```

### 9.2 Grammar Updates

```ebnf
inline         ::= text | emphasis | strong | link | icon | code
icon           ::= ":icon[" icon_name "]" attributes?
icon_name      ::= [a-z]+ ("-" [a-z]+)*
attributes     ::= "{" class_list "}"
class_list     ::= (class | shorthand) (SPACE (class | shorthand))*
class          ::= "." class_name
shorthand      ::= [a-z]+ ("-" [a-z]+)*
```

---

## 10. Testing Strategy

### 10.1 New Test Categories

```
syntax-tests/fixtures/
├── 06-plain-english/
│   ├── 01-colors.td
│   ├── 02-typography.td
│   ├── 03-layout.td
│   └── 04-effects.td
├── 07-icons/
│   ├── 01-basic-icons.td
│   ├── 02-styled-icons.td
│   └── 03-icons-in-components.td
├── 08-components-advanced/
│   ├── 01-button-variants.td
│   ├── 02-card-variants.td
│   ├── 03-alert-types.td
│   └── 04-complex-layouts.td
└── 09-theming/
    ├── 01-dark-mode.td
    ├── 02-glassmorphism.td
    └── 03-custom-config.td
```

### 10.2 Unit Tests

```typescript
// packages/compiler/src/resolver/style-resolver.test.ts

describe('Style Resolver', () => {
  it('resolves plain English colors', () => {
    expect(resolveAttributes(['primary'], context))
      .toEqual(['text-primary-600', 'hover:text-primary-700']);
  });

  it('resolves typography shorthands', () => {
    expect(resolveAttributes(['large', 'bold'], context))
      .toEqual(['text-lg', 'font-bold']);
  });

  it('resolves glassmorphism', () => {
    expect(resolveAttributes(['glass'], context))
      .toContain('backdrop-blur-md');
  });

  it('preserves CSS classes', () => {
    expect(resolveAttributes(['text-4xl'], context))
      .toEqual(['text-4xl']);
  });
});
```

### 10.3 Integration Tests

```typescript
// Test complete compilation with config

it('compiles with custom config', async () => {
  const source = `# Heading {primary large}`;
  const config = { /* custom colors */ };
  
  const result = await compile(source, { config });
  
  expect(result.html).toContain('class="text-primary-600"');
  expect(result.css).toContain('--color-primary-600');
});
```

---

## 11. Documentation

### 11.1 Documentation Site

**Build a complete docs site using Taildown itself:**

```
docs/
├── index.td              # Homepage
├── getting-started.td    # Installation & basics
├── syntax/
│   ├── markdown.td       # Markdown support
│   ├── attributes.td     # Inline attributes
│   ├── plain-english.td  # Shorthands ⭐
│   └── icons.td          # Icons ⭐
├── components/
│   ├── button.td
│   ├── card.td
│   ├── alert.td
│   └── ... (all 15 components)
├── theming/
│   ├── configuration.td  # taildown.config.js
│   ├── dark-mode.td      # Dark mode system
│   ├── colors.td         # Color palette
│   └── glassmorphism.td  # Glass effects
└── examples/
    ├── landing-page.td
    ├── blog.td
    ├── documentation.td
    └── portfolio.td
```

### 11.2 Update Existing Docs

**README.md:**
- Add Phase 2 features to feature list
- Update syntax examples to use plain English
- Add configuration section

**SYNTAX.md:**
- Add §2.6 Icons
- Add §2.7 Plain English Shorthands
- Add §3.5 Component Variants
- Update examples throughout

**tech-spec.md:**
- Update Phase 2 status to "Complete"
- Add implementation details

---

## 12. Timeline & Milestones

### Week 1: Foundation (Days 1-7)

**Days 1-2: Style Resolver**
- [ ] Implement `style-resolver.ts`
- [ ] Create `shorthand-mappings.ts` with 100+ mappings
- [ ] Create `semantic-colors.ts`
- [ ] Write unit tests (20+ tests)

**Days 3-4: Configuration System**
- [ ] Implement `config-loader.ts`
- [ ] Create `config-schema.ts` with validation
- [ ] Create `default-config.ts`
- [ ] Implement `theme-merger.ts`
- [ ] Write tests for config loading

**Days 5-7: Component Library**
- [ ] Design component architecture
- [ ] Implement 5 new components:
  - button (all variants)
  - alert (all types)
  - badge
  - avatar
  - tabs
- [ ] Write component tests

**Milestone 1:** ✅ Style resolver working, config system complete, 5 new components

---

### Week 2: Features & Effects (Days 8-14)

**Days 8-10: Icon System**
- [ ] Install and integrate Lucide
- [ ] Implement `icon-parser.ts`
- [ ] Implement `icon-renderer.ts`
- [ ] Update parser pipeline
- [ ] Create icon tests
- [ ] Add 50+ icon examples

**Days 11-12: Glassmorphism & Effects**
- [ ] Implement `glassmorphism.ts`
- [ ] Implement `animations.ts`
- [ ] Create glass variants for components
- [ ] Add animation utilities
- [ ] Test glass effects

**Days 13-14: Dark Mode**
- [ ] Implement `dark-mode.ts`
- [ ] Create dark mode CSS generation
- [ ] Add toggle script
- [ ] Update all components for dark mode
- [ ] Test dark mode switching

**Milestone 2:** ✅ Icons working, glassmorphism beautiful, dark mode smooth

---

### Week 3: Components & Polish (Days 15-21)

**Days 15-17: Remaining Components**
- [ ] Implement 10 more components:
  - accordion
  - modal
  - navbar
  - sidebar
  - breadcrumb
  - pagination
  - progress
  - skeleton
  - tooltip
  - (one more TBD)
- [ ] Test all components

**Days 18-19: CSS Enhancement**
- [ ] Expand `TAILWIND_UTILITIES` to 300+ classes
- [ ] Implement enhanced tree-shaking
- [ ] Add CSS variable system
- [ ] Optimize minification
- [ ] Performance testing

**Days 20-21: Example Updates**
- [ ] Convert all 10 examples to plain English
- [ ] Add icon usage throughout
- [ ] Add dark mode demonstrations
- [ ] Add glassmorphism showcases
- [ ] Create 5 new example documents

**Milestone 3:** ✅ All 15+ components done, examples showcase Phase 2 features

---

### Week 4: Documentation & Release (Days 22-28)

**Days 22-24: Documentation Site**
- [ ] Build docs site structure
- [ ] Write 15+ component documentation pages
- [ ] Write theming documentation
- [ ] Write plain English guide
- [ ] Write configuration guide
- [ ] Add interactive examples

**Days 25-26: Testing & QA**
- [ ] Run full test suite (target: 40+ tests)
- [ ] Fix any bugs found
- [ ] Performance benchmarks
- [ ] Browser testing (Chrome, Firefox, Safari)
- [ ] Accessibility audit

**Days 27-28: Release Prep**
- [ ] Update all READMEs
- [ ] Update PHASE-2-COMPLETE.md
- [ ] Create migration guide (Phase 1 → Phase 2)
- [ ] Update SYNTAX.md to v0.2.0
- [ ] Tag release v0.2.0

**Milestone 4:** ✅ Phase 2 complete, documented, tested, released

---

## Success Criteria

### Must Have (Required for Completion)

- [x] Plain English style resolver with 100+ mappings
- [x] Configuration system (`taildown.config.js`)
- [x] 15+ components with variants
- [x] Lucide icon integration (`:icon[]` syntax)
- [x] Dark mode with smooth transitions
- [x] Glassmorphism effects
- [x] 300+ CSS utility classes
- [x] All examples using plain English syntax
- [x] Documentation site built with Taildown
- [x] 40+ tests passing (100% coverage on new modules)
- [x] Performance: <100ms compilation for large docs

### Nice to Have (Optional Enhancements)

- [ ] Animation presets library
- [ ] More glassmorphism variants
- [ ] Custom icon support (beyond Lucide)
- [ ] Responsive preview in CLI
- [ ] Color palette generator
- [ ] Theme marketplace preparation

---

## Risk Assessment

### Low Risk ✅
- Style resolver (straightforward mapping)
- Configuration system (standard Node.js patterns)
- Icon parser (similar to existing parsers)
- CSS generation (extension of Phase 1)

### Medium Risk ⚠️
- Component library scale (15 components is significant)
  - **Mitigation:** Start with 5, iterate, reuse patterns
- Dark mode complexity
  - **Mitigation:** Use proven CSS class toggle approach
- Glassmorphism browser support
  - **Mitigation:** Graceful fallbacks for older browsers

### High Risk 🔴
- None identified (Phase 1 foundation is solid)

---

## Dependencies

### New NPM Packages

```json
{
  "dependencies": {
    "lucide": "^0.263.0",        // Icon library
    "zod": "^3.22.0"              // Config validation
  }
}
```

### No Breaking Changes

Phase 2 is **fully backward compatible** with Phase 1:
- Existing `.td` files work unchanged
- CSS classes still supported
- No syntax changes, only additions

---

## Post-Phase 2 Vision

**Phase 3 Preview:**
- VS Code extension with live preview
- Advanced layout primitives
- Custom component creation system
- Plugin architecture
- Taildown marketplace

**Phase 4 Preview:**
- Standalone editor (Tauri)
- Real-time collaboration
- Visual component builder
- AI-powered layout suggestions

---

## Appendix A: Plain English Vocabulary Reference

### Complete Shorthand List (120+ mappings)

**Colors (15):**
primary, secondary, accent, muted, success, warning, error, info, bg-primary, bg-secondary, bg-accent, text-primary, border-primary, etc.

**Typography (25):**
xs, small, base, large, xl, 2xl, 3xl, 4xl, huge, massive, bold, semibold, medium, light, thin, italic, uppercase, lowercase, capitalize, center, left, right, etc.

**Layout (30):**
flex, flex-col, grid-2, grid-3, grid-4, center, center-x, center-y, padded, padded-sm, padded-lg, gap, gap-sm, gap-lg, tight, relaxed, loose, etc.

**Effects (40):**
rounded, elevated, floating, glass, gradient, glow, shadow, smooth, fast, hover-lift, hover-grow, hover-glow, etc.

**Total: 120+ shorthands covering all common use cases**

---

## Appendix B: Component Variant Matrix

| Component | Variants | Sizes | States |
|-----------|----------|-------|--------|
| button | primary, secondary, outline, ghost, link, destructive | sm, md, lg | default, hover, active, disabled, loading |
| card | flat, elevated, glass, bordered, interactive | - | default, hover |
| alert | info, success, warning, error | - | default, dismissible |
| badge | primary, secondary, success, warning, error, outline | sm, md, lg | default |
| avatar | - | sm, md, lg, xl | circle, square |
| tabs | default, pills, underline | - | active, inactive |

---

## Appendix C: File Checklist

**New Files to Create (40+):**

```
✓ Checkmark when created

Resolver (4 files):
[ ] packages/compiler/src/resolver/style-resolver.ts
[ ] packages/compiler/src/resolver/shorthand-mappings.ts
[ ] packages/compiler/src/resolver/semantic-colors.ts
[ ] packages/compiler/src/resolver/variant-resolver.ts

Config (4 files):
[ ] packages/compiler/src/config/config-loader.ts
[ ] packages/compiler/src/config/config-schema.ts
[ ] packages/compiler/src/config/theme-merger.ts
[ ] packages/compiler/src/config/default-config.ts

Components (17 files):
[ ] packages/compiler/src/components/component-registry.ts
[ ] packages/compiler/src/components/variant-system.ts
[ ] packages/compiler/src/components/standard/button.ts
[ ] packages/compiler/src/components/standard/alert.ts
[ ] packages/compiler/src/components/standard/badge.ts
[ ] packages/compiler/src/components/standard/avatar.ts
[ ] packages/compiler/src/components/standard/tabs.ts
[ ] packages/compiler/src/components/standard/accordion.ts
[ ] packages/compiler/src/components/standard/modal.ts
[ ] packages/compiler/src/components/standard/navbar.ts
[ ] packages/compiler/src/components/standard/sidebar.ts
[ ] packages/compiler/src/components/standard/breadcrumb.ts
[ ] packages/compiler/src/components/standard/pagination.ts
[ ] packages/compiler/src/components/standard/progress.ts
[ ] packages/compiler/src/components/standard/skeleton.ts
[ ] packages/compiler/src/components/standard/tooltip.ts
[ ] packages/compiler/src/components/standard/card.ts (enhanced)

Icons (3 files):
[ ] packages/compiler/src/icons/icon-parser.ts
[ ] packages/compiler/src/icons/icon-renderer.ts
[ ] packages/compiler/src/icons/lucide-icons.ts

Themes (5 files):
[ ] packages/compiler/src/themes/theme-resolver.ts
[ ] packages/compiler/src/themes/dark-mode.ts
[ ] packages/compiler/src/themes/color-palette.ts
[ ] packages/compiler/src/themes/glassmorphism.ts
[ ] packages/compiler/src/themes/animations.ts

Tests (10+ files):
[ ] packages/compiler/src/resolver/style-resolver.test.ts
[ ] packages/compiler/src/config/config-loader.test.ts
[ ] packages/compiler/src/icons/icon-parser.test.ts
[ ] syntax-tests/fixtures/06-plain-english/
[ ] syntax-tests/fixtures/07-icons/
[ ] syntax-tests/fixtures/08-components-advanced/
[ ] syntax-tests/fixtures/09-theming/
```

---

## Conclusion

Phase 2 transforms Taildown from a functional compiler into a **world-class design system**. By focusing on zero-config beauty, plain English syntax, and modern effects like glassmorphism and smooth animations, we're delivering on the promise of "maximum beauty with minimum configuration."

**Key Differentiators:**
1. ✨ **Plain English**: `{primary large bold}` vs `.text-primary-600 .text-4xl .font-bold`
2. 🎨 **Zero Config**: Beautiful defaults that just work
3. 🌙 **Smart Dark Mode**: Automatic with smooth transitions
4. 💎 **Glassmorphism**: Modern frosted glass effects
5. 🎭 **15+ Components**: Production-ready component library
6. 🎯 **Icon Integration**: Lucide icons with simple syntax

**Estimated Effort:**
- **Timeline:** 4 weeks (28 days)
- **Lines of Code:** ~8,000 (estimate)
- **Tests:** 40+ test suites
- **Documentation:** 30+ pages

**Confidence:** ✅ HIGH - Phase 1 foundation is rock-solid, architecture is clear, no major risks identified.

---

**Status:** 📋 READY TO BEGIN  
**Next Action:** Week 1, Day 1 - Implement style resolver  
**Approval:** Pending

**Let's build something beautiful.** 🚀

