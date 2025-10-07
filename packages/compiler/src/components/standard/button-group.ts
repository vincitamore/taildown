/**
 * Button Group Component
 * Intelligent container for multiple buttons with automatic spacing and centering
 * 
 * Features:
 * - Auto-centers buttons on desktop
 * - Full-width stack on mobile
 * - Proper gap spacing between buttons
 * - Wraps naturally when space constrained
 * 
 * Usage:
 * ```taildown
 * :::button-group
 * [Primary Action](#){button primary large}
 * [Secondary Action](#){button secondary large}
 * [Tertiary](#){button info}
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';

export const buttonGroupComponent = defineComponent({
  name: 'button-group',
  htmlElement: 'div',
  defaultClasses: ['button-group'],
  variants: {
    default: [],
    center: ['button-group-center'],
    left: ['button-group-left'],
    right: ['button-group-right'],
    stack: ['button-group-stack'],
  },
  sizes: {
    sm: ['button-group-sm'],
    md: ['button-group-md'],
    lg: ['button-group-lg'],
  },
  description: 'Intelligent container for multiple buttons with auto-spacing',
  hasChildren: true,
});

