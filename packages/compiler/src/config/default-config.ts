/**
 * Default Taildown Configuration
 * Phase 2: Zero-config beauty - Production-ready defaults
 * 
 * This configuration provides beautiful, professional styling out of the box.
 * Users can override any of these values in their taildown.config.js
 * 
 * Color palette inspired by:
 * - Tailwind CSS default colors
 * - Modern SaaS applications
 * - Accessible contrast ratios (WCAG AA compliant)
 */

import type { TaildownConfig } from './config-schema';

/**
 * Default Taildown configuration
 * Designed for maximum beauty with zero configuration
 */
export const DEFAULT_CONFIG: TaildownConfig = {
  theme: {
    // ========================================
    // COLORS - Professional, accessible palette
    // ========================================
    colors: {
      // Primary: Modern blue (trustworthy, professional)
      primary: {
        DEFAULT: '#82a0ff',
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#82a0ff',
        600: '#6a8eef',
        700: '#527bde',
        800: '#3b69cd',
        900: '#2356bc',
        950: '#172554',
      },

      // Secondary: Elegant purple (creative, sophisticated)
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
        950: '#3b0764',
      },

      // Accent: Vibrant pink (call-to-action, energy)
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
        950: '#500724',
      },

      // Gray: Neutral scale (text, backgrounds, borders)
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
        950: '#030712',
      },

      // Semantic colors (single values)
      success: '#10b981', // Green - positive actions
      warning: '#f59e0b', // Amber - caution
      error: '#ef4444', // Red - errors and destructive actions
      info: '#3b82f6', // Blue - informational messages
    },

    // ========================================
    // FONTS - Modern, system-based stack
    // ========================================
    fonts: {
      // Sans-serif: Clean, modern, excellent readability
      sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

      // Serif: Traditional, elegant for long-form content
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',

      // Monospace: Code and technical content
      mono: '"Fira Code", "JetBrains Mono", Menlo, Monaco, Consolas, "Courier New", monospace',
    },

    // ========================================
    // GLASSMORPHISM - Modern frosted glass effects
    // ========================================
    glass: {
      // Medium blur for subtle effect
      blur: 'md',

      // 80% opacity for good visibility with blur
      opacity: 80,

      // 20% border opacity for subtle definition
      borderOpacity: 20,
    },

    // ========================================
    // ANIMATIONS - Smooth, professional motion
    // ========================================
    animations: {
      // Normal speed: responsive but not jarring
      speed: 'normal',

      // Ease-out: Natural deceleration
      easing: 'ease-out',
    },

    // ========================================
    // DARK MODE - Automatic, smooth transitions
    // ========================================
    darkMode: {
      // Enabled by default for modern UX
      enabled: true,

      // Class-based toggle (most flexible)
      toggle: 'class',

      // 300ms transition (smooth but not slow)
      transitionSpeed: 300,
    },
  },

  // ========================================
  // COMPONENTS - Beautiful defaults for all components
  // ========================================
  components: {
    // Card: Versatile content container
    card: {
      defaultVariant: 'elevated',
      defaultClasses: [
        'p-6',
        'rounded-lg',
        'bg-white',
        'dark:bg-gray-800',
        'overflow-auto',
        'max-w-full',
      ],
      variants: {
        flat: {
          classes: ['shadow-none', 'border', 'border-gray-200', 'dark:border-gray-700'],
          description: 'Flat card with border, no shadow',
        },
        elevated: {
          classes: ['shadow-xl', 'hover:shadow-2xl', 'transition-shadow', 'duration-200'],
          description: 'Elevated card with large shadow',
        },
        glass: {
          classes: [
            'backdrop-blur-md',
            'bg-white/80',
            'dark:bg-gray-900/60',
            'border',
            'border-white/20',
            'shadow-lg',
          ],
          description: 'Glassmorphism effect with frosted background',
        },
        bordered: {
          classes: [
            'border-2',
            'border-gray-300',
            'dark:border-gray-600',
            'shadow-sm',
          ],
          description: 'Card with prominent border',
        },
        interactive: {
          classes: [
            'cursor-pointer',
            'hover:shadow-xl',
            'hover:-translate-y-1',
            'transform',
            'transition-all',
            'duration-200',
          ],
          description: 'Interactive card with hover effects',
        },
      },
    },

    // Button: Call-to-action elements
    button: {
      defaultVariant: 'primary',
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
            'focus:ring-primary-500',
          ],
          description: 'Primary action button',
        },
        secondary: {
          classes: [
            'bg-secondary-600',
            'hover:bg-secondary-700',
            'text-white',
            'shadow-md',
            'hover:shadow-lg',
            'focus:ring-secondary-500',
          ],
          description: 'Secondary action button',
        },
        outline: {
          classes: [
            'border-2',
            'border-primary-600',
            'text-primary-600',
            'hover:bg-primary-50',
            'dark:hover:bg-primary-900/20',
            'focus:ring-primary-500',
          ],
          description: 'Outlined button',
        },
        ghost: {
          classes: [
            'hover:bg-gray-100',
            'dark:hover:bg-gray-800',
            'text-gray-700',
            'dark:text-gray-300',
          ],
          description: 'Transparent button with hover',
        },
        link: {
          classes: [
            'text-primary-600',
            'hover:text-primary-700',
            'hover:underline',
            'px-0',
            'py-0',
          ],
          description: 'Link-style button',
        },
        destructive: {
          classes: [
            'bg-red-600',
            'hover:bg-red-700',
            'text-white',
            'shadow-md',
            'hover:shadow-lg',
            'focus:ring-red-500',
          ],
          description: 'Destructive action button',
        },
      },
      sizes: {
        sm: {
          classes: ['px-4', 'py-2', 'text-sm'],
          description: 'Small button',
        },
        md: {
          classes: ['px-6', 'py-3', 'text-base'],
          description: 'Medium button (default)',
        },
        lg: {
          classes: ['px-8', 'py-4', 'text-lg'],
          description: 'Large button',
        },
      },
    },

    // Grid: Responsive layout
    grid: {
      defaultClasses: [
        'grid',
        'gap-4',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
      ],
    },

    // Container: Max-width constraint
    container: {
      defaultClasses: [
        'max-w-screen-2xl',
        'mx-auto',
        'px-4',
        'sm:px-6',
        'lg:px-8',
        'xl:px-12',
      ],
    },
  },

  // ========================================
  // OUTPUT - Sensible defaults
  // ========================================
  output: {
    // Don't minify by default (better for debugging)
    minify: false,

    // Separate CSS file by default (better for caching)
    inlineStyles: false,

    // Include dark mode (enabled in theme)
    darkMode: true,

    // No source maps by default (production)
    sourceMaps: false,
  },

  // ========================================
  // PLUGINS - Empty by default (Phase 3)
  // ========================================
  plugins: [],
};

/**
 * Get default config (exported for testing and inspection)
 */
export function getDefaultConfig(): TaildownConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG)); // Deep clone
}

/**
 * Check if using default config (no customization)
 */
export function isDefaultConfig(config: TaildownConfig): boolean {
  return JSON.stringify(config) === JSON.stringify(DEFAULT_CONFIG);
}

