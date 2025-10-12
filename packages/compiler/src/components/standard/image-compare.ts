/**
 * Image Comparison Slider Component Definition
 * Before/after image comparison with draggable slider
 * 
 * Provides an interactive way to compare two images side-by-side with a
 * draggable slider. Supports both horizontal and vertical orientations,
 * touch/mouse interaction, keyboard navigation, and glass effect styling.
 * 
 * Variants:
 * - horizontal: Left/right comparison (default)
 * - vertical: Top/bottom comparison
 * - glass: Glassmorphism effect on handle
 * - labels: Show "Before" and "After" labels
 * 
 * Sizes:
 * - sm: 300px height
 * - md: 400px height (default)
 * - lg: 500px height
 * - xl: 600px height
 * 
 * Usage:
 * ```taildown
 * :::compare-images {horizontal labels}
 * before: /images/before.jpg
 * after: /images/after.jpg
 * alt: Website redesign comparison
 * :::
 * 
 * :::compare-images {vertical glass}
 * before: /images/old-design.png
 * after: /images/new-design.png
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Image comparison slider component definition
 * Interactive before/after image comparison
 */
export const imageCompareComponent: ComponentDefinition = defineComponent({
  name: 'compare-images',
  htmlElement: 'div',
  
  // Base classes applied to all image comparison components
  defaultClasses: [
    'image-compare',
    'relative',
    'overflow-hidden',
    'select-none',
    'rounded-xl', // Zero-config beauty: rounded corners by default
    'shadow-lg', // Zero-config beauty: subtle shadow
  ],
  
  // Default variant and size
  defaultVariant: 'horizontal',
  defaultSize: 'md',
  
  // Orientation and styling variants
  variants: {
    // Horizontal: Left/right comparison (default)
    horizontal: [
      'image-compare-horizontal',
    ],
    
    // Vertical: Top/bottom comparison
    vertical: [
      'image-compare-vertical',
    ],
    
    // Glass: Glassmorphism effect on slider handle
    glass: [
      'image-compare-glass',
    ],
    
    // Labels: Show "Before" and "After" text labels
    labels: [
      'image-compare-labels',
    ],
    
    // Rounded: Rounded corners on container
    rounded: [
      'rounded-lg',
    ],
    
    // Shadow: Add shadow to container
    shadow: [
      'shadow-lg',
    ],
  },
  
  // Size variants (height of comparison area - viewport-relative for better UX)
  sizes: {
    sm: ['h-[280px]', 'max-h-[35vh]'], // Small: 280px max or 35% viewport
    md: ['h-[450px]', 'max-h-[55vh]'], // Medium: 450px or 55% viewport (default)
    lg: ['h-[580px]', 'max-h-[70vh]'], // Large: 580px or 70% viewport
    xl: ['h-[700px]', 'max-h-[80vh]'], // Extra Large: 700px or 80% viewport
    full: ['h-full', 'min-h-[400px]'], // Full height with minimum
  },
  
  description: 'Interactive before/after image comparison with draggable slider',
  hasChildren: true,
  
  // Required attributes for the component
  requiredAttributes: ['before', 'after'],
});

export default imageCompareComponent;

