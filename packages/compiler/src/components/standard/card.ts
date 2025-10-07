/**
 * Card Component Definition
 * Flexible container component with multiple variants
 * 
 * Variants:
 * - flat: No shadow, minimal styling
 * - elevated: Medium shadow (default)
 * - floating: Large shadow, appears to float
 * - outlined: Border instead of shadow
 * - bordered: Subtle border with shadow
 * - interactive: Hover effects for clickable cards
 * - glass: Glassmorphism effect (requires backdrop)
 * 
 * Sizes:
 * - sm: Compact padding and text
 * - md: Normal padding (default)
 * - lg: Generous padding and larger text
 * 
 * Usage:
 * ```taildown
 * :::card {elevated}
 * Card content here
 * :::
 * 
 * :::card {floating lg}
 * Large card with dramatic shadow
 * :::
 * 
 * :::card {interactive}
 * Clickable card with hover effect
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Card component definition
 * Central definition for all card styling and behavior
 */
export const cardComponent: ComponentDefinition = defineComponent({
  name: 'card',
  htmlElement: 'div',
  
  // Base classes applied to all cards
  // Mobile-first: prevent horizontal scroll, allow natural wrapping
  defaultClasses: [
    'rounded-lg',
    'p-6',
    'max-w-full',
    'overflow-x-hidden', // Prevent horizontal scroll on mobile
    'break-words',       // Break long words to prevent overflow
  ],
  
  // Default variant if none specified
  defaultVariant: 'subtle-glass',
  
  // Visual variants
  variants: {
    // Flat: Minimal styling, no shadow
    flat: [
      'bg-card',
      'text-card-foreground',
      'shadow-none',
      'border',
      'border-border',
    ],
    
    // Elevated: Medium shadow (default)
    elevated: [
      'bg-card',
      'text-card-foreground',
      'shadow-md',
    ],
    
    // Floating: Large shadow, dramatic depth
    floating: [
      'bg-card',
      'text-card-foreground',
      'shadow-xl',
    ],
    
    // Outlined: Border instead of shadow
    outlined: [
      'bg-card',
      'text-card-foreground',
      'shadow-none',
      'border-2',
      'border-border',
    ],
    
    // Bordered: Subtle border with shadow
    bordered: [
      'bg-card',
      'text-card-foreground',
      'shadow-md',
      'border',
      'border-border',
    ],
    
    // Interactive: Hover effects for clickable cards
    interactive: [
      'bg-card',
      'text-card-foreground',
      'shadow-md',
      'transition-all',
      'duration-300',
      'cursor-pointer',
      // These will be added to CSS utilities:
      // hover:shadow-xl
      // hover:-translate-y-1
    ],
    
    // Glass Variants: Glassmorphism effects with varying intensity levels
    // NO bg-white in these - transparency is required to show the background!
    // Using plain English naming: "subtle-glass" not "glass-subtle"
    // Note: Glass CSS handles borders via gradients, no need for border classes
    
    // Subtle Glass: Minimal transparency, mostly opaque (90%)
    'subtle-glass': [
      'glass-effect',
      'glass-subtle',
      'shadow-sm',
    ],
    
    // Light Glass: Light transparency (75%)
    'light-glass': [
      'glass-effect',
      'glass-light',
      'shadow-md',
    ],
    
    // Medium Glass: Medium transparency (60%) - default glass effect
    glass: [
      'glass-effect',
      'glass-medium',
      'shadow-lg',
      'hover-lift',
      'transition-smooth',
    ],
    
    // Heavy Glass: Heavy transparency, very see-through (40%)
    'heavy-glass': [
      'glass-effect',
      'glass-heavy',
      'shadow-xl',
    ],
  },
  
  // Size variants
  sizes: {
    sm: ['p-4', 'text-sm'],
    md: ['p-6', 'text-base'],
    lg: ['p-8', 'text-lg'],
    xl: ['p-10', 'text-xl'],
  },
  
  description: 'Flexible container for grouping related content',
  hasChildren: true,
});

/**
 * Register card component with the registry
 * Call this during initialization
 */
export function registerCardComponent() {
  const { registry } = require('../component-registry');
  registry.register(cardComponent);
}

/**
 * Get card classes for a specific variant and size
 * Helper function for testing and direct usage
 * 
 * @param variant - Card variant name
 * @param size - Card size
 * @returns Array of CSS classes
 */
export function getCardClasses(
  variant?: string,
  size?: string
): string[] {
  const classes = [...cardComponent.defaultClasses];
  
  // Add variant classes
  const variantName = variant || cardComponent.defaultVariant;
  if (variantName && cardComponent.variants[variantName]) {
    classes.push(...cardComponent.variants[variantName]);
  }
  
  // Add size classes
  if (size && cardComponent.sizes[size]) {
    classes.push(...cardComponent.sizes[size]);
  }
  
  return classes;
}

/**
 * Card variant documentation
 * Used for documentation generation and IDE hints
 */
export const cardVariants = {
  flat: {
    name: 'Flat',
    description: 'Minimal styling with no shadow, suitable for dense layouts',
    example: ':::card {flat}\nContent\n:::',
  },
  elevated: {
    name: 'Elevated',
    description: 'Medium shadow creating subtle depth',
    example: ':::card {elevated}\nContent\n:::',
  },
  floating: {
    name: 'Floating',
    description: 'Large shadow creating dramatic floating effect',
    example: ':::card {floating}\nContent\n:::',
  },
  outlined: {
    name: 'Outlined',
    description: 'Border instead of shadow for cleaner appearance',
    example: ':::card {outlined}\nContent\n:::',
  },
  bordered: {
    name: 'Bordered',
    description: 'Subtle border combined with shadow',
    example: ':::card {bordered}\nContent\n:::',
  },
  interactive: {
    name: 'Interactive',
    description: 'Hover effects for clickable cards, animated on hover',
    example: ':::card {interactive}\nClickable content\n:::',
  },
  glass: {
    name: 'Glass',
    description: 'Glassmorphism effect with blur and transparency',
    example: ':::card {glass}\nModern frosted glass effect\n:::',
  },
};

/**
 * Card size documentation
 */
export const cardSizes = {
  sm: {
    name: 'Small',
    description: 'Compact padding for dense layouts',
    padding: '1rem (p-4)',
    fontSize: '0.875rem (text-sm)',
  },
  md: {
    name: 'Medium',
    description: 'Default size with comfortable spacing',
    padding: '1.5rem (p-6)',
    fontSize: '1rem (text-base)',
  },
  lg: {
    name: 'Large',
    description: 'Generous padding for important content',
    padding: '2rem (p-8)',
    fontSize: '1.125rem (text-lg)',
  },
  xl: {
    name: 'Extra Large',
    description: 'Maximum padding for hero sections',
    padding: '2.5rem (p-10)',
    fontSize: '1.25rem (text-xl)',
  },
};

/**
 * Export card component as default
 */
export default cardComponent;

