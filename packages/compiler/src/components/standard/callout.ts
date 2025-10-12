/**
 * Callout/Admonition Component Definition
 * Highlighted callout boxes for notes, tips, warnings, and alerts
 * 
 * Essential for documentation and technical writing.
 * Semantic alert boxes with color-coded types and icons.
 * 
 * Types:
 * - note: Blue, informational (default)
 * - tip: Green, helpful advice
 * - warning: Yellow/orange, caution
 * - danger: Red, critical alert
 * - success: Green, positive
 * - info: Blue, neutral
 * 
 * Visual Variants:
 * - glass: Glassmorphism effect
 * - elevated: Shadow elevation
 * - bordered: Clear borders
 * 
 * Usage:
 * ```taildown
 * :::callout {note}
 * :icon[info]{primary} **Note:**
 * This is additional context.
 * :::
 * 
 * :::callout {tip glass}
 * :icon[lightbulb]{warning} **Pro Tip:**
 * Use glassmorphism for modern look.
 * :::
 * 
 * :::callout {warning}
 * :icon[alert-triangle]{warning} **Warning:**
 * This action cannot be undone.
 * :::
 * 
 * :::callout {danger elevated}
 * :icon[alert-octagon]{error} **Danger:**
 * This will delete all data!
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Callout component definition
 * Semantic alert/admonition boxes with type-based styling
 */
export const calloutComponent: ComponentDefinition = defineComponent({
  name: 'callout',
  htmlElement: 'div',
  
  // Base classes applied to all callouts
  defaultClasses: [
    'callout-component',
    'rounded-lg',
    'p-4',
    'border-l-4',
    'flex',
    'gap-3',
    'items-start',
  ],
  
  // Default type
  defaultVariant: 'note',
  
  // Type-based variants with semantic colors
  variants: {
    // Note: Blue, informational (default)
    note: [
      'callout-note',
      'bg-blue-50',
      'border-blue-500',
      'text-blue-900',
    ],
    
    // Info: Light blue, neutral information
    info: [
      'callout-info',
      'bg-sky-50',
      'border-sky-500',
      'text-sky-900',
    ],
    
    // Tip: Green, helpful advice
    tip: [
      'callout-tip',
      'bg-green-50',
      'border-green-500',
      'text-green-900',
    ],
    
    // Success: Green, positive
    success: [
      'callout-success',
      'bg-emerald-50',
      'border-emerald-500',
      'text-emerald-900',
    ],
    
    // Warning: Yellow/orange, caution
    warning: [
      'callout-warning',
      'bg-amber-50',
      'border-amber-500',
      'text-amber-900',
    ],
    
    // Danger: Red, critical alert
    danger: [
      'callout-danger',
      'bg-red-50',
      'border-red-500',
      'text-red-900',
    ],
    
    // Error: Red, error messages
    error: [
      'callout-error',
      'bg-rose-50',
      'border-rose-500',
      'text-rose-900',
    ],
    
    // Glass variant: Glassmorphism effect
    glass: [
      'glass-effect',
      'shadow-sm',
    ],
    
    // Elevated: Shadow elevation
    elevated: [
      'shadow-lg',
    ],
    
    // Bordered: Clear borders all around
    bordered: [
      'border',
      'border-border',
    ],
  },
  
  // Size variants
  sizes: {
    sm: ['p-3', 'text-sm'],
    md: ['p-4', 'text-base'],
    lg: ['p-5', 'text-lg'],
  },
  
  description: 'Semantic callout boxes for notes, tips, warnings, and alerts',
  hasChildren: true,
});

export default calloutComponent;

