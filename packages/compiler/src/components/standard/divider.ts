/**
 * Divider/Separator Component Definition
 * Enhanced horizontal rules with text, icons, and decorative styles
 * 
 * More expressive than markdown `---` with customizable styling.
 * Perfect for visual section breaks and branded styling.
 * 
 * Variants:
 * - text: Text in center
 * - icon: Icon in center
 * - gradient: Gradient line
 * - dots: Dotted/dashed style
 * - thick: Thicker line
 * - wavy: Wavy decorative line
 * - dashed: Dashed line
 * - double: Double line
 * 
 * Colors:
 * - primary: Brand color
 * - accent: Accent color
 * - muted: Subtle gray
 * 
 * Usage:
 * ```taildown
 * :::divider
 * Simple divider
 * :::
 * 
 * :::divider {icon}
 * :icon[star]{warning}
 * :::
 * 
 * :::divider {text}
 * Section Break
 * :::
 * 
 * :::divider {gradient primary}
 * Gradient divider
 * :::
 * 
 * :::divider {dots}
 * Dotted decorative line
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Divider component definition
 * Enhanced horizontal rules with decorative options
 */
export const dividerComponent: ComponentDefinition = defineComponent({
  name: 'divider',
  htmlElement: 'div',
  
  // Base classes
  defaultClasses: [
    'divider-component',
    'my-6',
  ],
  
  // Default variant
  defaultVariant: 'solid',
  
  // Style variants
  variants: {
    // Basic styles
    solid: ['divider-solid'],
    text: ['divider-text'],
    icon: ['divider-icon'],
    
    // Line styles
    gradient: ['divider-gradient'],
    dots: ['divider-dots'],
    dashed: ['divider-dashed'],
    double: ['divider-double'],
    wavy: ['divider-wavy'],
    thick: ['divider-thick'],
    
    // Colors
    primary: ['divider-primary'],
    accent: ['divider-accent'],
    muted: ['divider-muted'],
    success: ['divider-success'],
    warning: ['divider-warning'],
    error: ['divider-error'],
  },
  
  description: 'Enhanced horizontal rules with decorative options',
  hasChildren: true,
});

export default dividerComponent;

