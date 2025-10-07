/**
 * Navbar Component
 * Modern navigation bar with glassmorphism for site-wide navigation
 */

import { defineComponent } from '../component-registry';

export const navbarComponent = defineComponent({
  name: 'navbar',
  htmlElement: 'nav',
  defaultClasses: ['navbar'],
  variants: {
    default: [],
    glass: ['navbar-glass'],
    minimal: ['navbar-minimal'],
    solid: ['navbar-solid'],
    floating: ['navbar-floating'],
    sticky: ['navbar-sticky'],
    fixed: ['navbar-fixed'],
  },
  sizes: {
    sm: ['navbar-sm'],
    md: ['navbar-md'],
    lg: ['navbar-lg'],
  },
  description: 'Modern navigation bar with glassmorphism for site-wide navigation',
  hasChildren: true,
});

