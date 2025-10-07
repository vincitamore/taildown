/**
 * Skeleton Component
 * Loading placeholder with animation
 */

import { defineComponent } from '../component-registry';

export const skeletonComponent = defineComponent({
  name: 'skeleton',
  htmlElement: 'div',
  defaultClasses: ['skeleton', 'bg-muted', 'rounded', 'animate-pulse'],
  variants: {
    default: [],
    text: ['h-4', 'w-full'],
    circle: ['rounded-full', 'w-12', 'h-12'],
    rectangle: ['h-32', 'w-full'],
  },
  sizes: {
    xs: ['h-2'],
    sm: ['h-4'],
    md: ['h-6'],
    lg: ['h-8'],
    xl: ['h-12'],
  },
  description: 'Loading placeholder with pulse animation',
  hasChildren: false,
});

