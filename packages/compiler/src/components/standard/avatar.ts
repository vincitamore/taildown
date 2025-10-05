/**
 * Avatar Component Definition  
 * User profile images or placeholder initials
 * 
 * Variants:
 * - circular: Round avatar (default)
 * - square: Square with slight rounding
 * - rounded: Square with more rounding
 * 
 * Usage:
 * ```taildown
 * :::avatar {circular sm}
 * JD
 * :::
 * 
 * :::avatar {square lg}
 * AB
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

export const avatarComponent: ComponentDefinition = defineComponent({
  name: 'avatar',
  htmlElement: 'div',
  
  defaultClasses: [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'text-white',
    'bg-gray-400',
    'w-10',
    'h-10',
  ],
  
  defaultVariant: 'circular',
  
  variants: {
    circular: [
      'rounded-full',
    ],
    square: [
      'rounded-md',
    ],
    rounded: [
      'rounded-lg',
    ],
  },
  
  sizes: {
    xs: ['w-6', 'h-6', 'text-xs'],
    sm: ['w-8', 'h-8', 'text-sm'],
    md: ['w-10', 'h-10', 'text-base'],
    lg: ['w-12', 'h-12', 'text-lg'],
    xl: ['w-16', 'h-16', 'text-xl'],
    '2xl': ['w-20', 'h-20', 'text-2xl'],
  },
  
  description: 'User profile images or initials',
  hasChildren: true,
});

export default avatarComponent;

