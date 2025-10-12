/**
 * Details/Summary Component Definition
 * Native HTML5 <details> element with beautiful Taildown styling
 * 
 * Progressive disclosure component for FAQs, collapsible content, and expandable sections.
 * Uses semantic HTML5 <details>/<summary> elements for zero JavaScript required.
 * 
 * Variants:
 * - glass: Glassmorphism effect (default)
 * - elevated: Shadow elevation
 * - bordered: Border variant
 * - subtle-glass: Minimal glass effect
 * - light-glass: Light transparency
 * - heavy-glass: Heavy transparency
 * 
 * Attributes:
 * - open: Open by default
 * 
 * Usage:
 * ```taildown
 * :::details {glass open}
 * **What is Taildown?** {bold}
 * 
 * Taildown is a markup language for creating beautiful UIs with plain English styling.
 * 
 * [Learn More](#){button primary small}
 * :::
 * 
 * :::details {subtle-glass}
 * **How do I install it?**
 * 
 * Installation is simple...
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Details component definition
 * Native HTML5 disclosure widget with modern styling
 */
export const detailsComponent: ComponentDefinition = defineComponent({
  name: 'details',
  htmlElement: 'details',
  
  // Base classes applied to all details elements
  defaultClasses: [
    'details-component',
    'rounded-lg',
    'p-4',
    'transition-all',
    'duration-200',
  ],
  
  // Default variant
  defaultVariant: 'glass',
  
  // Visual variants
  variants: {
    // Glass: Glassmorphism effect (default)
    glass: [
      'glass-effect',
      'shadow-sm',
    ],
    
    // Elevated: Medium shadow
    elevated: [
      'bg-card',
      'text-card-foreground',
      'shadow-md',
      'border',
      'border-border',
    ],
    
    // Bordered: Clear border
    bordered: [
      'bg-card',
      'text-card-foreground',
      'border-2',
      'border-border',
      'shadow-none',
    ],
    
    // Subtle Glass: Minimal transparency
    'subtle-glass': [
      'glass-effect',
      'glass-subtle',
      'shadow-sm',
    ],
    
    // Light Glass: Light transparency
    'light-glass': [
      'glass-effect',
      'glass-light',
      'shadow-md',
    ],
    
    // Heavy Glass: Heavy transparency
    'heavy-glass': [
      'glass-effect',
      'glass-heavy',
      'shadow-lg',
    ],
  },
  
  // Size variants
  sizes: {
    sm: ['p-3', 'text-sm'],
    md: ['p-4', 'text-base'],
    lg: ['p-6', 'text-lg'],
  },
  
  description: 'Progressive disclosure with native HTML5 details element',
  hasChildren: true,
});

export default detailsComponent;

