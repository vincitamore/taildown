/**
 * Tabs Component
 * Tabbed content interface with multiple panels
 */

import { defineComponent } from '../component-registry';

export const tabsComponent = defineComponent({
  name: 'tabs',
  htmlElement: 'div',
  defaultClasses: ['tabs', 'border-b', 'border-border'],
  variants: {
    default: [],
    boxed: ['border', 'rounded-lg', 'p-4'],
    pills: ['gap-2'],
    underline: ['border-b-2'],
  },
  sizes: {
    sm: ['text-sm'],
    md: ['text-base'],
    lg: ['text-lg'],
  },
  description: 'Tabbed content interface for organizing information',
  hasChildren: true,
});

