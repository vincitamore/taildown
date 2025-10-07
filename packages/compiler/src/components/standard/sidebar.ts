/**
 * Sidebar Component
 * Side navigation panel
 */

import { defineComponent } from '../component-registry';

export const sidebarComponent = defineComponent({
  name: 'sidebar',
  htmlElement: 'aside',
  defaultClasses: [
    'sidebar',
    'w-64',
    'h-full',
    'bg-card',
    'text-card-foreground',
    'border-r',
    'border-border',
    'p-4',
  ],
  variants: {
    default: [],
    fixed: ['fixed', 'left-0', 'top-0', 'bottom-0'],
    collapsible: ['transition-all'],
    dark: ['bg-card', 'text-card-foreground', 'border-border'],
    floating: ['shadow-xl', 'rounded-lg', 'm-4'],
  },
  sizes: {
    sm: ['w-48'],
    md: ['w-64'],
    lg: ['w-80'],
    xl: ['w-96'],
  },
  description: 'Side navigation panel for hierarchical navigation',
  hasChildren: true,
});

