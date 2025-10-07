/**
 * Carousel Component
 * Image/content carousel with slide controls
 */

import { defineComponent } from '../component-registry';

export const carouselComponent = defineComponent({
  name: 'carousel',
  htmlElement: 'div',
  defaultClasses: [
    'carousel',
    'relative',
    'overflow-hidden',
    'rounded-lg',
    'bg-muted',
  ],
  variants: {
    default: [],
    fade: ['transition-opacity'],
    slide: ['flex', 'transition-transform'],
    autoplay: [],
    indicators: ['pb-12'],
  },
  sizes: {
    sm: ['h-64'],
    md: ['h-96'],
    lg: ['h-[32rem]'],
    xl: ['h-[40rem]'],
    full: ['h-screen'],
  },
  description: 'Image and content carousel with navigation controls',
  hasChildren: true,
});

