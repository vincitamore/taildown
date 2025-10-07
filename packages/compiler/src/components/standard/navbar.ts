/**
 * Navbar Component
 * Navigation bar for site-wide navigation
 */

import { defineComponent } from '../component-registry';

export const navbarComponent = defineComponent({
  name: 'navbar',
  htmlElement: 'nav',
  defaultClasses: [
    'navbar',
    'flex',
    'items-center',
    'justify-between',
    'px-6',
    'py-4',
    'bg-card',
    'text-card-foreground',
    'border-b',
    'border-border',
  ],
  variants: {
    default: [],
    fixed: ['fixed', 'top-0', 'left-0', 'right-0', 'z-50'],
    sticky: ['sticky', 'top-0', 'z-50'],
    transparent: ['bg-transparent', 'border-0'],
    dark: ['bg-card', 'text-card-foreground', 'border-border'],
  },
  sizes: {
    sm: ['py-2', 'px-4'],
    md: ['py-4', 'px-6'],
    lg: ['py-6', 'px-8'],
  },
  description: 'Navigation bar for site-wide navigation',
  hasChildren: true,
});

