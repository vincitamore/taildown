/**
 * Modal Component
 * Overlay dialog for focused content
 */

import { defineComponent } from '../component-registry';

export const modalComponent = defineComponent({
  name: 'modal',
  htmlElement: 'div',
  defaultClasses: [
    'modal',
    'bg-card',
    'text-card-foreground',
    'rounded-lg',
    'shadow-xl',
    'p-6',
    'max-w-2xl',
    'mx-auto',
  ],
  variants: {
    default: [],
    centered: ['flex', 'items-center', 'justify-center'],
    'full-screen': ['max-w-full', 'h-full', 'rounded-none'],
    drawer: ['max-w-md', 'h-full', 'rounded-l-lg'],
  },
  sizes: {
    sm: ['max-w-md'],
    md: ['max-w-2xl'],
    lg: ['max-w-4xl'],
    xl: ['max-w-6xl'],
  },
  description: 'Modal dialog for focused content and interactions',
  hasChildren: true,
});

