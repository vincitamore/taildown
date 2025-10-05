/**
 * Variant Resolver
 * Phase 2: Resolves component-specific variants
 * 
 * Handles component variants like:
 * - button: primary, secondary, outline, ghost, link, destructive
 * - card: flat, elevated, glass, bordered, interactive
 * - alert: info, success, warning, error
 * 
 * Variants are resolved based on component context passed in ResolverContext
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md §4 for component variant specifications
 */

import type { ResolverContext } from './style-resolver';

/**
 * Component variant mappings
 * These map variant names to CSS classes for specific components
 * 
 * Note: Full variant definitions are in component files
 * This is a simplified resolver for inline variant resolution
 */
const COMPONENT_VARIANTS: Record<string, Record<string, string[]>> = {
  // Button variants
  button: {
    // Sizes
    sm: ['px-4', 'py-2', 'text-sm'],
    md: ['px-6', 'py-3', 'text-base'],
    lg: ['px-8', 'py-4', 'text-lg'],
    
    // Styles (simplified - full definitions in button component)
    primary: ['bg-primary-600', 'text-white', 'hover:bg-primary-700'],
    secondary: ['bg-secondary-600', 'text-white', 'hover:bg-secondary-700'],
    outline: ['border-2', 'border-primary-600', 'text-primary-600', 'hover:bg-primary-50'],
    ghost: ['hover:bg-gray-100', 'text-gray-700'],
    link: ['text-primary-600', 'hover:text-primary-700', 'hover:underline'],
    destructive: ['bg-red-600', 'text-white', 'hover:bg-red-700'],
  },

  // Card variants
  card: {
    flat: ['shadow-none', 'border', 'border-gray-200'],
    elevated: ['shadow-xl', 'hover:shadow-2xl'],
    glass: ['backdrop-blur-md', 'bg-white/80', 'border', 'border-white/20'],
    bordered: ['border-2', 'border-gray-300', 'shadow-sm'],
    interactive: ['cursor-pointer', 'hover:shadow-xl', 'hover:-translate-y-1'],
  },

  // Alert variants
  alert: {
    info: ['bg-blue-50', 'border-blue-500', 'text-blue-900'],
    success: ['bg-green-50', 'border-green-500', 'text-green-900'],
    warning: ['bg-yellow-50', 'border-yellow-500', 'text-yellow-900'],
    error: ['bg-red-50', 'border-red-500', 'text-red-900'],
  },

  // Badge variants
  badge: {
    primary: ['bg-primary-100', 'text-primary-800'],
    secondary: ['bg-secondary-100', 'text-secondary-800'],
    success: ['bg-green-100', 'text-green-800'],
    warning: ['bg-yellow-100', 'text-yellow-800'],
    error: ['bg-red-100', 'text-red-800'],
    outline: ['border', 'border-gray-300', 'text-gray-700'],
    
    // Sizes
    sm: ['px-2', 'py-0.5', 'text-xs'],
    md: ['px-3', 'py-1', 'text-sm'],
    lg: ['px-4', 'py-1.5', 'text-base'],
  },

  // Avatar variants
  avatar: {
    sm: ['w-8', 'h-8'],
    md: ['w-12', 'h-12'],
    lg: ['w-16', 'h-16'],
    xl: ['w-24', 'h-24'],
    circle: ['rounded-full'],
    square: ['rounded-lg'],
  },

  // Grid variants (responsive columns)
  grid: {
    'cols-2': ['grid-cols-2'],
    'cols-3': ['grid-cols-3'],
    'cols-4': ['grid-cols-4'],
    responsive: ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3'],
  },

  // Container variants
  container: {
    narrow: ['max-w-2xl'],
    normal: ['max-w-6xl'],
    wide: ['max-w-screen-2xl'],
    full: ['max-w-full'],
  },
};

/**
 * Resolve component-specific variants
 * 
 * @param variant - Variant name to resolve
 * @param context - Resolver context with component name
 * @returns Array of CSS classes, or null if not a valid variant
 * 
 * @example
 * resolveVariant('primary', { component: 'button', ... })
 * // => ['bg-primary-600', 'text-white', 'hover:bg-primary-700']
 * 
 * @example
 * resolveVariant('elevated', { component: 'card', ... })
 * // => ['shadow-xl', 'hover:shadow-2xl']
 */
export function resolveVariant(
  variant: string,
  context: ResolverContext
): string[] | null {
  // No component context - can't resolve variants
  if (!context.component) {
    return null;
  }

  // Get variants for this component
  const componentVariants = COMPONENT_VARIANTS[context.component];
  
  if (!componentVariants) {
    return null;
  }

  // Get the variant classes
  const variantClasses = componentVariants[variant];
  
  if (!variantClasses) {
    return null;
  }

  // Apply dark mode transformations if needed
  if (context.darkMode && context.config.theme?.darkMode?.enabled) {
    return applyDarkModeToVariant(variantClasses, variant, context.component);
  }

  return variantClasses;
}

/**
 * Apply dark mode transformations to variant classes
 */
function applyDarkModeToVariant(
  classes: string[],
  variant: string,
  component: string
): string[] {
  const result = [...classes];

  // Add dark mode variants based on component type
  if (component === 'card') {
    if (variant === 'flat' || variant === 'bordered') {
      result.push('dark:border-gray-700', 'dark:bg-gray-800');
    } else if (variant === 'glass') {
      result.push('dark:bg-gray-900/60', 'dark:border-white/20');
    }
  }

  if (component === 'alert') {
    // Dark mode for alerts
    if (variant === 'info') {
      result.push('dark:bg-blue-900/20', 'dark:text-blue-100');
    } else if (variant === 'success') {
      result.push('dark:bg-green-900/20', 'dark:text-green-100');
    } else if (variant === 'warning') {
      result.push('dark:bg-yellow-900/20', 'dark:text-yellow-100');
    } else if (variant === 'error') {
      result.push('dark:bg-red-900/20', 'dark:text-red-100');
    }
  }

  return result;
}

/**
 * Check if a string is a valid variant for a component
 * 
 * @param variant - Variant name to check
 * @param component - Component name
 * @returns true if valid variant
 */
export function isValidVariant(variant: string, component: string): boolean {
  const componentVariants = COMPONENT_VARIANTS[component];
  return componentVariants ? variant in componentVariants : false;
}

/**
 * Get all variants for a component
 * Useful for autocomplete and documentation
 * 
 * @param component - Component name
 * @returns Array of variant names
 */
export function getComponentVariants(component: string): string[] {
  const componentVariants = COMPONENT_VARIANTS[component];
  return componentVariants ? Object.keys(componentVariants) : [];
}

/**
 * Get all components that have variants
 */
export function getComponentsWithVariants(): string[] {
  return Object.keys(COMPONENT_VARIANTS);
}

/**
 * Register a custom variant for a component
 * Allows extending variants at runtime
 * 
 * @param component - Component name
 * @param variant - Variant name
 * @param classes - CSS classes for the variant
 */
export function registerVariant(
  component: string,
  variant: string,
  classes: string[]
): void {
  if (!COMPONENT_VARIANTS[component]) {
    COMPONENT_VARIANTS[component] = {};
  }
  
  COMPONENT_VARIANTS[component][variant] = classes;
}

/**
 * Get variant classes (for inspection/debugging)
 * 
 * @param component - Component name
 * @param variant - Variant name
 * @returns CSS classes or undefined
 */
export function getVariantClasses(
  component: string,
  variant: string
): string[] | undefined {
  return COMPONENT_VARIANTS[component]?.[variant];
}

