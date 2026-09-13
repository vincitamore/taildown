/**
 * Progress Component
 * Progress indicator bar
 */

import { defineComponent } from '../component-registry';

export const progressComponent = defineComponent({
  name: 'progress',
  htmlElement: 'progress',
  defaultClasses: ['progress', 'w-full', 'text-primary', 'bg-muted', 'rounded-full', 'overflow-hidden'],
  variants: {
    default: [],
    striped: ['progress-striped'],
    animated: ['progress-animated'],
    indeterminate: ['progress-indeterminate'],
  },
  defaultSize: 'md',
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

