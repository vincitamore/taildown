/**
 * Tooltip Component
 * Contextual information on hover
 */

import { defineComponent } from '../component-registry';

export const tooltipComponent = defineComponent({
  name: 'tooltip',
  htmlElement: 'span',
  defaultClasses: [
    'tooltip',
    'inline-block',
    'px-3',
    'py-2',
    'text-sm',
    'text-white',
    'bg-gray-900',
    'rounded',
    'shadow-lg',
  ],
  variants: {
    default: [],
    light: ['bg-white', 'text-gray-900', 'border', 'border-gray-200'],
    success: ['bg-green-600'],
    warning: ['bg-yellow-600'],
    error: ['bg-red-600'],
  },
  sizes: {
    sm: ['px-2', 'py-1', 'text-xs'],
    md: ['px-3', 'py-2', 'text-sm'],
    lg: ['px-4', 'py-3', 'text-base'],
  },
  description: 'Contextual information displayed on hover',
  hasChildren: true,
});

