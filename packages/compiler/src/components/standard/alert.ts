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
    'alert',
  ],
  
  defaultVariant: 'info',
  
  variants: {
    info: ['alert-info'],
    success: ['alert-success'],
    warning: ['alert-warning'],
    error: ['alert-error'],
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

