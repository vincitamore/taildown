/**
 * Accordion Component
 * Collapsible content panels
 */

import { defineComponent } from '../component-registry';

export const accordionComponent = defineComponent({
  name: 'accordion',
  htmlElement: 'div',
  defaultClasses: ['accordion', 'border', 'rounded-lg', 'divide-y'],
  variants: {
    default: [],
    bordered: ['border-2'],
    flush: ['border-0', 'rounded-none'],
    separated: ['gap-4', 'divide-y-0'],
  },
  sizes: {
    sm: ['text-sm'],
    md: ['text-base'],
    lg: ['text-lg'],
  },
  description: 'Collapsible content panels for FAQs and expandable sections',
  hasChildren: true,
});

