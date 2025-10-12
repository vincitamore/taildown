/**
 * Multi-Column Layout Component Definition
 * CSS multi-column layout for magazine-style text flow
 * 
 * Native CSS columns with automatic text reflow between columns.
 * Perfect for magazine layouts, long text content, and space-efficient displays.
 * 
 * Column Counts:
 * - 2: Two columns (default)
 * - 3: Three columns
 * - 4: Four columns
 * - auto: Auto-fit based on width
 * 
 * Gap Variants:
 * - gap-sm: Small gap (1rem)
 * - gap: Default gap (2rem)
 * - gap-lg: Large gap (3rem)
 * 
 * Usage:
 * ```taildown
 * :::columns {2}
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
 * Text flows naturally between columns like a magazine.
 * 
 * Paragraphs, lists, and images all work seamlessly in 
 * multi-column layouts.
 * :::
 * 
 * :::columns {3 gap-lg}
 * Three column layout with large gap between columns 
 * for better visual separation.
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Columns component definition
 * CSS multi-column layout for magazine-style text flow
 */
export const columnsComponent: ComponentDefinition = defineComponent({
  name: 'columns',
  htmlElement: 'div',
  
  // Base classes applied to all column layouts
  defaultClasses: [
    'columns-component',
    'max-w-full',
  ],
  
  // Default to 2 columns
  defaultSize: '2',
  
  // Column count variants
  sizes: {
    '2': ['columns-2'],
    '3': ['columns-3'],
    '4': ['columns-4'],
    'auto': ['columns-auto'],
  },
  
  // Gap variants
  variants: {
    // Gap sizes
    'gap-sm': ['gap-sm'],
    'gap': ['gap'],
    'gap-lg': ['gap-lg'],
    'gap-xl': ['gap-xl'],
    
    // Optional divider line between columns
    'divider': ['column-divider'],
    
    // Balance columns for equal height
    'balanced': ['column-balanced'],
  },
  
  description: 'CSS multi-column layout for magazine-style text flow',
  hasChildren: true,
});

export default columnsComponent;

