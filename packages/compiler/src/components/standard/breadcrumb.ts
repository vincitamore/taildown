/**
 * Breadcrumb Component
 * Hierarchical navigation trail
 */

import { defineComponent } from '../component-registry';

export const breadcrumbComponent = defineComponent({
  name: 'breadcrumb',
  htmlElement: 'nav',
  defaultClasses: ['breadcrumb', 'flex', 'items-center', 'gap-2', 'text-sm', 'text-muted-foreground'],
  variants: {
    default: [],
    separated: ['gap-3'],
    boxed: ['border', 'rounded-lg', 'p-3', 'bg-muted'],
  },
  sizes: {
    sm: ['text-xs'],
    md: ['text-sm'],
    lg: ['text-base'],
  },
  description: 'Hierarchical navigation trail showing current location',
  hasChildren: true,
});

