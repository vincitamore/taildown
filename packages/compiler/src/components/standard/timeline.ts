/**
 * Timeline Component
 * 
 * Vertical timeline with milestones, states, and alternating layouts
 * 
 * Variants:
 * - vertical: Standard vertical timeline (left-aligned)
 * - centered: Alternating left/right layout
 * - compact: Reduced spacing and sizing
 * 
 * States:
 * - completed: Checkmark icon, muted colors
 * - current: Highlighted, primary colors
 * - pending: Default state
 */

import { defineComponent } from '../component-registry';

export const timelineComponent = defineComponent({
  name: 'timeline',
  htmlElement: 'div',
  defaultClasses: ['timeline-container', 'relative'],
  defaultVariant: 'vertical',
  variants: {
    vertical: ['timeline-vertical'],
    centered: ['timeline-centered'],
    compact: ['timeline-compact'],
    glass: ['timeline-glass'],
  },
  sizes: {},
  description: 'Vertical timeline with milestones and states',
  hasChildren: true,
});

