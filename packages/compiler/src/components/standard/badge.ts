/**
 * Badge Component Definition
 * Small labels for tags, status indicators, counts
 * 
 * Variants:
 * - default: Gray badge
 * - primary: Blue badge
 * - success: Green badge
 * - warning: Amber badge
 * - error: Red badge
 * - info: Light blue badge
 * 
 * Usage:
 * ```taildown
 * :::badge {primary}
 * New
 * :::
 * 
 * :::badge {success sm}
 * Active
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

export const badgeComponent: ComponentDefinition = defineComponent({
  name: 'badge',
  htmlElement: 'span',
  
  defaultClasses: [
    'badge',
  ],
  
  defaultVariant: 'default',
  
  variants: {
    default: ['badge-default'],
    primary: ['badge-primary'],
    secondary: ['badge-secondary'],
    success: ['badge-success'],
    warning: ['badge-warning'],
    error: ['badge-error'],
    info: ['badge-info'],
    muted: ['badge-muted'],
  },
  
  sizes: {
    sm: ['badge-sm'],
    md: [], // Default, no modifier
    lg: ['badge-lg'],
  },
  
  description: 'Small labels for tags and status',
  hasChildren: true,
});

export default badgeComponent;

