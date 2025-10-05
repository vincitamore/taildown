/**
 * Alert Component Definition
 * Semantic alert boxes for displaying messages
 * 
 * Variants:
 * - info: Informational messages (blue)
 * - success: Success messages (green)
 * - warning: Warning messages (amber)
 * - error: Error messages (red)
 * 
 * Usage:
 * ```taildown
 * :::alert {info}
 * This is an informational message.
 * :::
 * 
 * :::alert {success}
 * Operation completed successfully!
 * :::
 * 
 * :::alert {error}
 * An error occurred. Please try again.
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

export const alertComponent: ComponentDefinition = defineComponent({
  name: 'alert',
  htmlElement: 'div',
  
  defaultClasses: [
    'p-4',
    'rounded-lg',
    'border',
    'flex',
    'items-start',
    'gap-3',
  ],
  
  defaultVariant: 'info',
  
  variants: {
    info: [
      'bg-blue-50',
      'border-blue-200',
      'text-blue-800',
    ],
    success: [
      'bg-green-50',
      'border-green-200',
      'text-green-800',
    ],
    warning: [
      'bg-amber-50',
      'border-amber-200',
      'text-amber-800',
    ],
    error: [
      'bg-red-50',
      'border-red-200',
      'text-red-800',
    ],
  },
  
  sizes: {
    sm: ['p-3', 'text-sm'],
    md: ['p-4', 'text-base'],
    lg: ['p-5', 'text-lg'],
  },
  
  description: 'Semantic alert boxes for messages',
  hasChildren: true,
});

export default alertComponent;

