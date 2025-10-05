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
    'inline-flex',
    'items-center',
    'px-3',
    'py-1',
    'rounded-full',
    'font-medium',
    'text-sm',
  ],
  
  defaultVariant: 'default',
  
  variants: {
    default: [
      'bg-gray-100',
      'text-gray-700',
    ],
    primary: [
      'bg-blue-100',
      'text-blue-700',
    ],
    success: [
      'bg-green-100',
      'text-green-700',
    ],
    warning: [
      'bg-amber-100',
      'text-amber-700',
    ],
    error: [
      'bg-red-100',
      'text-red-700',
    ],
    info: [
      'bg-sky-100',
      'text-sky-700',
    ],
  },
  
  sizes: {
    sm: ['px-2', 'py-0.5', 'text-xs'],
    md: ['px-3', 'py-1', 'text-sm'],
    lg: ['px-4', 'py-1.5', 'text-base'],
  },
  
  description: 'Small labels for tags and status',
  hasChildren: true,
});

export default badgeComponent;

