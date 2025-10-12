/**
 * Enhanced Table Component Definition
 * Extended markdown tables with sorting, filtering, sticky headers, and responsive layouts
 * 
 * Enhances standard GFM tables with:
 * - Sortable columns (optional JavaScript ~1KB)
 * - Zebra striping for better readability
 * - Sticky headers for long tables
 * - Responsive mobile card layout
 * - Glass effect variants
 * 
 * Variants:
 * - sortable: Clickable headers to sort (requires JS)
 * - zebra: Alternating row colors
 * - bordered: Cell borders
 * - glass: Glassmorphism effect
 * - sticky-header: Header stays on scroll
 * - compact: Tighter spacing
 * - hoverable: Row hover effects
 * 
 * Sizes:
 * - sm: Smaller text and padding
 * - md: Standard size (default)
 * - lg: Larger text and padding
 * 
 * Usage:
 * ```taildown
 * | Name | Role | Status |
 * |------|------|--------|
 * | Alice | Dev | Active |
 * | Bob | Designer | Away |
 * {sortable zebra}
 * 
 * | Metric | Value | Change |
 * |--------|------:|-------:|
 * | Users | 1,250 | +15% |
 * | Revenue | $45k | +8% |
 * {glass sticky-header}
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Enhanced table component definition
 * Extends GFM markdown tables with professional features
 */
export const tableEnhancedComponent: ComponentDefinition = defineComponent({
  name: 'table',
  htmlElement: 'table',
  
  // Base classes applied to all enhanced tables
  defaultClasses: [
    'table-enhanced',
    'w-full',
    'border-collapse',
  ],
  
  // Default size
  defaultSize: 'md',
  
  // Feature variants
  variants: {
    // Sortable: Clickable column headers for sorting (requires JS)
    sortable: [
      'table-sortable',
    ],
    
    // Zebra: Alternating row colors for readability
    zebra: [
      'table-zebra',
    ],
    
    // Bordered: Full cell borders
    bordered: [
      'table-bordered',
    ],
    
    // Glass: Glassmorphism effect
    glass: [
      'glass-effect',
      'table-glass',
    ],
    
    // Sticky Header: Header stays visible on scroll
    'sticky-header': [
      'table-sticky-header',
    ],
    
    // Compact: Tighter spacing
    compact: [
      'table-compact',
    ],
    
    // Hoverable: Row hover effects
    hoverable: [
      'table-hoverable',
    ],
    
    // Striped variant (alias for zebra)
    striped: [
      'table-zebra',
    ],
  },
  
  // Size variants
  sizes: {
    sm: ['table-sm', 'text-sm'],
    md: ['table-md', 'text-base'],
    lg: ['table-lg', 'text-lg'],
  },
  
  description: 'Enhanced markdown tables with sorting, filtering, and responsive layouts',
  hasChildren: true,
});

export default tableEnhancedComponent;

