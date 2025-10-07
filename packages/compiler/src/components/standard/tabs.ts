/**
 * Tabs Component
 * Tabbed content interface with multiple panels
 */

import { defineComponent } from '../component-registry';

export const tabsComponent = defineComponent({
  name: 'tabs',
  htmlElement: 'div',
  defaultClasses: ['tabs'],
  variants: {
    default: [],
    glass: ['tabs-glass'],
    boxed: ['tabs-boxed'],
    pills: ['tabs-pills'],
    minimal: ['tabs-minimal'],
  },
  sizes: {
    sm: ['tabs-sm'],
    md: ['tabs-md'],
    lg: ['tabs-lg'],
  },
  description: 'Tabbed content interface for organizing information',
  hasChildren: true,
});

