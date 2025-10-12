/**
 * Stats/Metrics Component Definition
 * Large, prominent statistics display for landing pages and dashboards
 * 
 * Perfect for displaying key metrics, social proof, and important numbers.
 * Numbers displayed prominently with labels and optional icons.
 * 
 * Column Counts:
 * - 2: Two stats
 * - 3: Three stats (default)
 * - 4: Four stats
 * 
 * Color Variants:
 * - primary: Blue themed
 * - success: Green themed
 * - warning: Amber themed
 * - info: Sky blue themed
 * 
 * Usage:
 * ```taildown
 * :::stats {3}
 * ### 10,000+ {stat}
 * :icon[users]{primary huge}
 * Active Users
 * 
 * ### 99.9% {stat}
 * :icon[check-circle]{success huge}
 * Uptime
 * 
 * ### < 50ms {stat}
 * :icon[zap]{warning huge}
 * Response Time
 * :::
 * 
 * :::stats {4 glass}
 * **1M+** {stat primary}
 * Downloads
 * 
 * **150** {stat success}
 * Contributors
 * 
 * **5★** {stat warning}
 * Rating
 * 
 * **24/7** {stat info}
 * Support
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Stats component definition
 * Grid layout for prominent statistics display
 */
export const statsComponent: ComponentDefinition = defineComponent({
  name: 'stats',
  htmlElement: 'div',
  
  // Base classes applied to all stats grids
  defaultClasses: [
    'stats-component',
    'grid',
    'gap-6',
    'max-w-full',
  ],
  
  // Default to 3 columns
  defaultSize: '3',
  
  // Column count variants
  sizes: {
    '2': ['stats-cols-2'],
    '3': ['stats-cols-3'],
    '4': ['stats-cols-4'],
  },
  
  // Visual variants
  variants: {
    // Glass variants
    glass: ['stats-glass'],
    'subtle-glass': ['stats-glass'],
    'light-glass': ['stats-glass'],
    'heavy-glass': ['stats-glass'],
    
    // Elevated variant
    elevated: ['stats-elevated'],
    
    // Bordered variant
    bordered: ['stats-bordered'],
    
    // Compact spacing
    compact: ['gap-4'],
  },
  
  description: 'Large statistics display for landing pages and dashboards',
  hasChildren: true,
});

export default statsComponent;

