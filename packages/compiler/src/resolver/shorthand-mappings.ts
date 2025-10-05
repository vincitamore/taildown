/**
 * Shorthand to CSS Class Mappings
 * Phase 2: Plain English vocabulary (120+ mappings)
 * 
 * See PLAIN-ENGLISH-REFERENCE.md for complete documentation
 * See SYNTAX.md §2.7 for specification
 * 
 * Mapping types:
 * - string: Simple 1-to-1 mapping (e.g., 'bold' => 'font-bold')
 * - string[]: One shorthand maps to multiple classes (e.g., 'flex' => ['flex', 'items-center'])
 * - function: Context-dependent mapping (e.g., 'glass' varies by dark mode)
 */

import type { ResolverContext } from './style-resolver';

/**
 * Shorthand mapping can be:
 * - A single CSS class string
 * - An array of CSS classes
 * - A function that returns CSS classes based on context (theme, dark mode, etc.)
 */
export type ShorthandMapping =
  | string
  | string[]
  | ((context: ResolverContext) => string[]);

/**
 * Complete shorthand mappings for Taildown
 * Organized by category for maintainability
 */
export const SHORTHAND_MAPPINGS: Record<string, ShorthandMapping> = {
  // ========================================
  // TYPOGRAPHY - Sizes
  // ========================================
  xs: 'text-xs',
  small: 'text-sm',
  base: 'text-base',
  large: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  huge: 'text-4xl', // Alias for 4xl
  massive: 'text-6xl', // Alias for 6xl

  // ========================================
  // TYPOGRAPHY - Weights
  // ========================================
  thin: 'font-thin',
  'extra-light': 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  'extra-bold': 'font-extrabold',
  black: 'font-black',

  // ========================================
  // TYPOGRAPHY - Alignment
  // ========================================
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',

  // ========================================
  // TYPOGRAPHY - Style
  // ========================================
  italic: 'italic',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',

  // ========================================
  // TYPOGRAPHY - Line Height
  // Plain English: "tight lines" not "leading tight"
  // ========================================
  'tight-lines': 'leading-tight',
  'normal-lines': 'leading-normal',
  'relaxed-lines': 'leading-relaxed',
  'loose-lines': 'leading-loose',

  // ========================================
  // LAYOUT - Flex
  // ========================================
  flex: ['flex', 'items-center'],
  'flex-col': ['flex', 'flex-col'],
  'flex-row': ['flex', 'flex-row'],
  'flex-wrap': ['flex', 'flex-wrap'],
  'flex-center': ['flex', 'items-center', 'justify-center'],

  // ========================================
  // LAYOUT - Grid
  // ========================================
  'grid-1': ['grid', 'grid-cols-1'],
  'grid-2': ['grid', 'grid-cols-2'],
  'grid-3': ['grid', 'grid-cols-3'],
  'grid-4': ['grid', 'grid-cols-4'],
  'grid-5': ['grid', 'grid-cols-5'],
  'grid-6': ['grid', 'grid-cols-6'],

  // ========================================
  // LAYOUT - Centering
  // ========================================
  'center-x': 'mx-auto',
  'center-y': 'my-auto',
  'center-both': ['mx-auto', 'my-auto'],

  // ========================================
  // SPACING - Padding
  // ========================================
  'padded-xs': 'p-2',
  'padded-sm': 'p-4',
  padded: 'p-6',
  'padded-lg': 'p-8',
  'padded-xl': 'p-12',
  'padded-2xl': 'p-16',

  // Directional padding
  'px-sm': 'px-4',
  px: 'px-6',
  'px-lg': 'px-8',
  'py-sm': 'py-4',
  py: 'py-6',
  'py-lg': 'py-8',

  // ========================================
  // SPACING - Margin
  // ========================================
  'm-sm': 'm-4',
  m: 'm-6',
  'm-lg': 'm-8',
  'mx-sm': 'mx-4',
  mx: 'mx-6',
  'mx-lg': 'mx-8',
  'my-sm': 'my-4',
  my: 'my-6',
  'my-lg': 'my-8',

  // ========================================
  // SPACING - Gap
  // ========================================
  'gap-xs': 'gap-1',
  'gap-sm': 'gap-2',
  gap: 'gap-4',
  'gap-lg': 'gap-8',
  'gap-xl': 'gap-12',

  // ========================================
  // SPACING - Vertical Spacing
  // ========================================
  tight: 'space-y-1',
  // Note: 'normal' reserved for font-normal, spacing uses default gap values
  relaxed: 'space-y-4',
  loose: 'space-y-8',

  // ========================================
  // BORDER RADIUS
  // ========================================
  'rounded-none': 'rounded-none',
  'rounded-sm': 'rounded-md',
  rounded: 'rounded-lg',
  'rounded-lg': 'rounded-lg',
  'rounded-xl': 'rounded-xl',
  'rounded-2xl': 'rounded-2xl',
  'rounded-full': 'rounded-full',

  // ========================================
  // SHADOWS
  // ========================================
  shadow: 'shadow-md',
  'shadow-sm': 'shadow-sm',
  'shadow-lg': 'shadow-lg',
  elevated: 'shadow-xl',
  floating: 'shadow-2xl',
  
  // ========================================
  // GLASSMORPHISM EFFECTS (Phase 2)
  // Using plain English naming: "subtle-glass" not "glass-subtle"
  // ========================================
  glass: ['glass-effect', 'glass-medium', 'bg-glass-medium', 'border-white/50', 'shadow-lg', 'hover-lift', 'transition-smooth'],
  'subtle-glass': ['glass-effect', 'glass-subtle', 'bg-glass-subtle', 'border-white/40', 'shadow-sm'],
  'light-glass': ['glass-effect', 'glass-light', 'bg-glass-light', 'border-white/50', 'shadow-md'],
  'heavy-glass': ['glass-effect', 'glass-heavy', 'bg-glass-heavy', 'border-white/60', 'shadow-xl'],
  
  // ========================================
  // ANIMATIONS (Phase 2)
  // ========================================
  animated: ['animate-fade-in', 'hover-lift', 'transition-smooth'],
  'fade-in': 'animate-fade-in',
  'slide-up': 'animate-slide-up',
  'slide-down': 'animate-slide-down',
  'zoom-in': 'animate-zoom-in',
  'hover-scale': 'hover-scale',

  // ========================================
  // GRADIENTS
  // ========================================
  gradient: (ctx) => [
    'bg-gradient-to-r',
    `from-${ctx.config.theme?.colors?.primary?.DEFAULT || 'blue-600'}`,
    `to-${ctx.config.theme?.colors?.accent?.DEFAULT || 'purple-600'}`,
  ],
  'gradient-vertical': 'bg-gradient-to-b',
  'gradient-diagonal': 'bg-gradient-to-br',

  // ========================================
  // SPECIAL EFFECTS
  // ========================================
  glow: (ctx) => [
    'shadow-lg',
    `shadow-${ctx.config.theme?.colors?.primary?.DEFAULT || 'blue-500'}/50`,
  ],
  blur: 'blur',
  'blur-sm': 'blur-sm',
  'blur-lg': 'blur-lg',

  // ========================================
  // TRANSITIONS - Speed
  // ========================================
  instant: ['transition-none'],
  fast: ['transition-all', 'duration-150'],
  smooth: ['transition-all', 'duration-300', 'ease-out'],
  slow: ['transition-all', 'duration-500'],

  // ========================================
  // TRANSITIONS - Easing
  // ========================================
  'ease-linear': 'ease-linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',

  // ========================================
  // HOVER EFFECTS
  // ========================================
  'hover-lift': [
    'hover:transform',
    'hover:-translate-y-1',
    'transition-transform',
    'duration-200',
  ],
  'hover-grow': ['hover:scale-105', 'transition-transform', 'duration-200'],
  'hover-shrink': ['hover:scale-95', 'transition-transform', 'duration-200'],
  'hover-glow': (ctx) => [
    'hover:shadow-xl',
    `hover:shadow-${ctx.config.theme?.colors?.primary?.DEFAULT || 'blue-500'}/50`,
    'transition-shadow',
    'duration-200',
  ],
  'hover-fade': ['hover:opacity-80', 'transition-opacity', 'duration-200'],
  'hover-brighten': ['hover:brightness-110', 'transition-all', 'duration-200'],

  // ========================================
  // OPACITY
  // ========================================
  'opacity-0': 'opacity-0',
  'opacity-50': 'opacity-50',
  'opacity-75': 'opacity-75',
  'opacity-100': 'opacity-100',

  // ========================================
  // DISPLAY
  // ========================================
  block: 'block',
  inline: 'inline',
  'inline-block': 'inline-block',
  hidden: 'hidden',
  visible: 'visible',

  // ========================================
  // POSITION
  // ========================================
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',

  // ========================================
  // WIDTH & HEIGHT
  // ========================================
  'w-full': 'w-full',
  'w-screen': 'w-screen',
  'h-full': 'h-full',
  'h-screen': 'h-screen',
  'min-w-full': 'min-w-full',
  'min-h-full': 'min-h-full',
  'max-w-full': 'max-w-full',
  'max-h-full': 'max-h-full',

  // ========================================
  // OVERFLOW
  // ========================================
  'overflow-auto': 'overflow-auto',
  'overflow-hidden': 'overflow-hidden',
  'overflow-scroll': 'overflow-scroll',
  'overflow-visible': 'overflow-visible',

  // ========================================
  // CURSOR
  // ========================================
  pointer: 'cursor-pointer',
  'not-allowed': 'cursor-not-allowed',
  wait: 'cursor-wait',

  // ========================================
  // Z-INDEX
  // ========================================
  'z-0': 'z-0',
  'z-10': 'z-10',
  'z-20': 'z-20',
  'z-30': 'z-30',
  'z-40': 'z-40',
  'z-50': 'z-50',

  // ========================================
  // STATE COLORS (Semantic)
  // ========================================
  muted: 'text-gray-500',
  'dark:muted': 'dark:text-gray-400',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600',

  // ========================================
  // NATURAL COMBINATIONS (Phase 2+)
  // Plain English compound descriptors
  // ========================================
  
  // Size + Weight combinations
  'large-bold': ['text-lg', 'font-bold'],
  'huge-bold': ['text-4xl', 'font-bold'],
  'small-bold': ['text-sm', 'font-bold'],
  'small-light': ['text-sm', 'font-light'],
  'large-light': ['text-lg', 'font-light'],
  
  // Size + Color combinations
  'large-muted': ['text-lg', 'text-gray-500'],
  'small-muted': ['text-sm', 'text-gray-500'],
  'large-primary': ['text-lg', 'text-blue-600'],
  'large-success': ['text-lg', 'text-green-600'],
  'large-warning': ['text-lg', 'text-yellow-600'],
  'large-error': ['text-lg', 'text-red-600'],
  
  // Background + Text semantic pairs
  'primary-bg': ['bg-blue-600', 'text-white'],
  'secondary-bg': ['bg-gray-600', 'text-white'],
  'success-bg': ['bg-green-600', 'text-white'],
  'warning-bg': ['bg-yellow-600', 'text-white'],
  'error-bg': ['bg-red-600', 'text-white'],
  'info-bg': ['bg-blue-600', 'text-white'],
  'muted-bg': ['bg-gray-100', 'text-gray-700'],
  
  // Common natural phrases
  'bold-primary': ['font-bold', 'text-blue-600'],
  'bold-muted': ['font-bold', 'text-gray-500'],
  'italic-muted': ['italic', 'text-gray-500'],
};

/**
 * Get all shorthand names
 * Useful for autocomplete and documentation
 */
export function getAllShorthands(): string[] {
  return Object.keys(SHORTHAND_MAPPINGS);
}

/**
 * Get shorthands by category
 * Useful for documentation generation
 */
export function getShorthandsByCategory(): Record<string, string[]> {
  return {
    typography: [
      'xs',
      'small',
      'base',
      'large',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
      'huge',
      'massive',
      'thin',
      'light',
      'normal',
      'medium',
      'semibold',
      'bold',
      'black',
    ],
    alignment: ['left', 'center', 'right', 'justify', 'center-x', 'center-y'],
    layout: [
      'flex',
      'flex-col',
      'flex-center',
      'grid-2',
      'grid-3',
      'grid-4',
      'grid-5',
      'grid-6',
    ],
    spacing: [
      'padded',
      'padded-sm',
      'padded-lg',
      'gap',
      'gap-sm',
      'gap-lg',
      'tight',
      'relaxed',
      'loose',
    ],
    effects: [
      'rounded',
      'shadow',
      'elevated',
      'floating',
      'glass',
      'gradient',
      'glow',
    ],
    interactions: [
      'smooth',
      'fast',
      'slow',
      'hover-lift',
      'hover-grow',
      'hover-glow',
      'pointer',
    ],
    colors: ['muted', 'success', 'warning', 'error', 'info'],
  };
}

/**
 * Check if a shorthand exists
 */
export function hasShorthand(name: string): boolean {
  return name in SHORTHAND_MAPPINGS;
}

/**
 * Get shorthand mapping (for inspection/debugging)
 */
export function getShorthand(name: string): ShorthandMapping | undefined {
  return SHORTHAND_MAPPINGS[name];
}

