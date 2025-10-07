/**
 * Progress Component
 * Progress indicator bar
 */

import { defineComponent } from '../component-registry';

export const progressComponent = defineComponent({
  name: 'progress',
  htmlElement: 'div',
  defaultClasses: ['progress', 'w-full', 'bg-muted', 'rounded-full', 'overflow-hidden'],
  variants: {
    default: [],
    striped: ['bg-gradient-to-r'],
    animated: ['animate-pulse'],
    indeterminate: ['animate-pulse'],
  },
  sizes: {
    xs: ['h-1'],
    sm: ['h-2'],
    md: ['h-3'],
    lg: ['h-4'],
    xl: ['h-6'],
  },
  description: 'Progress indicator for showing completion status',
  hasChildren: true,
});

