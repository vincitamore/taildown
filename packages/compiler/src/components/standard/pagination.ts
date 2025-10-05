/**
 * Pagination Component
 * Page navigation controls
 */

import { defineComponent } from '../component-registry';

export const paginationComponent = defineComponent({
  name: 'pagination',
  htmlElement: 'nav',
  defaultClasses: ['pagination', 'flex', 'items-center', 'justify-center', 'gap-2'],
  variants: {
    default: [],
    compact: ['gap-1'],
    spaced: ['gap-4'],
    rounded: ['gap-2'],
  },
  sizes: {
    sm: ['text-sm'],
    md: ['text-base'],
    lg: ['text-lg'],
  },
  description: 'Page navigation controls for multi-page content',
  hasChildren: true,
});

