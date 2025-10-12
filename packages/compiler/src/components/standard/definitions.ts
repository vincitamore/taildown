/**
 * Definition List Component Definition
 * Semantic <dl> element for term-definition pairs
 * 
 * Perfect for glossaries, API parameters, metadata, and key-value documentation.
 * Uses semantic HTML with beautiful Taildown styling.
 * 
 * Layouts:
 * - vertical: Stacked (default)
 * - horizontal: Side-by-side grid layout
 * - compact: Tighter spacing
 * 
 * Usage:
 * ```taildown
 * :::definitions {glass}
 * **API Key** {term}
 * : A unique identifier for authentication
 * 
 * **Base URL** {term}
 * : https://api.example.com/v1
 * 
 * **Rate Limit** {term}
 * : 1000 requests per hour per key
 * :::
 * 
 * :::definitions {horizontal}
 * **Name:** John Doe
 * **Email:** john@example.com
 * **Role:** Developer
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Definitions component definition
 * Semantic definition list for term-definition pairs
 */
export const definitionsComponent: ComponentDefinition = defineComponent({
  name: 'definitions',
  htmlElement: 'dl',
  
  // Base classes applied to all definition lists
  defaultClasses: [
    'definitions-component',
    'max-w-full',
  ],
  
  // Default variant
  defaultVariant: 'vertical',
  
  // Layout variants
  variants: {
    // Vertical: Stacked layout (default)
    vertical: ['definitions-vertical'],
    
    // Horizontal: Side-by-side grid layout
    horizontal: ['definitions-horizontal'],
    
    // Compact: Tighter spacing
    compact: ['definitions-compact'],
    
    // Glass variants
    glass: ['glass-effect', 'shadow-sm', 'rounded-lg', 'p-4'],
    'subtle-glass': ['glass-effect', 'glass-subtle', 'shadow-sm', 'rounded-lg', 'p-4'],
    'light-glass': ['glass-effect', 'glass-light', 'shadow-md', 'rounded-lg', 'p-4'],
    'heavy-glass': ['glass-effect', 'glass-heavy', 'shadow-lg', 'rounded-lg', 'p-4'],
    
    // Elevated variant
    elevated: ['bg-card', 'shadow-md', 'rounded-lg', 'p-4', 'border', 'border-border'],
    
    // Bordered variant
    bordered: ['border-2', 'border-border', 'rounded-lg', 'p-4'],
  },
  
  // Size variants
  sizes: {
    sm: ['text-sm'],
    md: ['text-base'],
    lg: ['text-lg'],
  },
  
  description: 'Semantic definition list for term-definition pairs',
  hasChildren: true,
});

export default definitionsComponent;

