/**
 * Step Indicator Component Definition
 * Visual progress indicator for multi-step processes, tutorials, and onboarding
 * 
 * Perfect for installation guides, tutorials, multi-step forms documentation.
 * Shows step numbers, current progress, and completion states.
 * 
 * Layouts:
 * - vertical: Stacked steps (default)
 * - horizontal: Side-by-side steps
 * - compact: Minimal spacing
 * 
 * States:
 * - current: Highlighted current step
 * - completed: Checkmark and different color
 * - default: Future/pending step
 * 
 * Usage:
 * ```taildown
 * :::steps {numbered}
 * ### Install Dependencies {step}
 * Run `pnpm install` to install.
 * 
 * ### Configure {step current}
 * Create config file.
 * 
 * ### Deploy {step}
 * Push to production.
 * :::
 * 
 * :::steps {horizontal glass}
 * **Step 1:** Setup
 * **Step 2:** Build
 * **Step 3:** Deploy
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Steps component definition
 * Visual progress indicator for multi-step processes
 */
export const stepsComponent: ComponentDefinition = defineComponent({
  name: 'steps',
  htmlElement: 'div',
  
  // Base classes applied to all step indicators
  defaultClasses: [
    'steps-component',
    'max-w-full',
  ],
  
  // Default variant for layout
  defaultVariant: 'vertical',
  
  // Layout and style variants
  variants: {
    // Layouts
    vertical: ['steps-vertical'],
    horizontal: ['steps-horizontal'],
    compact: ['steps-compact'],
    
    // Styling options
    numbered: ['steps-numbered'],
    icons: ['steps-icons'],
    connected: ['steps-connected'],
    
    // Glass variants
    glass: ['steps-glass'],
    'subtle-glass': ['steps-glass'],
    
    // Other visual variants
    elevated: ['steps-elevated'],
    bordered: ['steps-bordered'],
  },
  
  // Size variants
  sizes: {
    sm: ['text-sm'],
    md: ['text-base'],
    lg: ['text-lg'],
  },
  
  description: 'Visual progress indicator for multi-step processes',
  hasChildren: true,
});

export default stepsComponent;

