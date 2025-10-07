/**
 * Flow Component Definition
 * Professional flow diagram and process visualization
 * 
 * Replaces crude ASCII flow diagrams with modern, mobile-optimized styling
 * Supports hierarchical flows, decision trees, and process diagrams
 * 
 * Variants:
 * - default: Clean vertical flow with arrows
 * - horizontal: Left-to-right flow
 * - stepped: Step-by-step process with numbering
 * - branching: Decision tree with branches
 * - timeline: Timeline-style flow
 * - minimal: Ultra-clean minimal styling
 * 
 * Sizes:
 * - sm: Compact spacing
 * - md: Normal spacing (default)
 * - lg: Generous spacing for presentations
 * 
 * Usage:
 * ```taildown
 * :::flow
 * - Start
 *   - Process 1
 *     - Subprocess A
 *     - Subprocess B
 *   - Process 2
 *   - End
 * :::
 * 
 * :::flow {horizontal lg}
 * - Input
 * - Transform
 * - Output
 * :::
 * 
 * :::flow {stepped}
 * - Initialize
 * - Process Data
 * - Validate
 * - Save Results
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Flow component definition
 * Uses unordered lists with specialized flow styling
 */
export const flowComponent: ComponentDefinition = defineComponent({
  name: 'flow',
  htmlElement: 'div',
  
  // Base classes for all flow diagrams
  defaultClasses: [
    'flow-container',
    'overflow-x-auto',
    'rounded-lg',
    'bg-muted',
    'border',
    'border-border',
    'p-6',
  ],
  
  // Default variant
  defaultVariant: 'default',
  
  // Visual variants
  variants: {
    // Default: Vertical flow with connecting lines
    default: [
      'flow-vertical',
      'text-foreground',
    ],
    
    // Horizontal: Left-to-right flow
    horizontal: [
      'flow-horizontal',
      'text-foreground',
    ],
    
    // Stepped: Step-by-step with numbers
    stepped: [
      'flow-stepped',
      'bg-card',
      'text-card-foreground',
    ],
    
    // Branching: Decision tree style
    branching: [
      'flow-branching',
      'bg-muted',
    ],
    
    // Timeline: Timeline-style presentation
    timeline: [
      'flow-timeline',
      'bg-card',
      'border-l-4',
      'border-primary',
    ],
    
    // Minimal: Clean minimal styling
    minimal: [
      'flow-minimal',
      'border-none',
      'bg-transparent',
      'p-2',
    ],
    
    // Dark: Dark theme
    dark: [
      'flow-dark',
      'bg-card',
      'border-border',
      'text-card-foreground',
    ],
    
    // Glass: Glassmorphism effect
    glass: [
      'flow-glass',
      'bg-glass',
      'border-glass',
    ],
  },
  
  // Size variants
  sizes: {
    sm: ['p-4', 'text-sm', 'gap-2'],
    md: ['p-6', 'text-base', 'gap-4'],
    lg: ['p-8', 'text-lg', 'gap-6'],
  },
  
  description: 'Flow diagram and process visualization',
  hasChildren: true,
});

/**
 * Export flow component as default
 */
export default flowComponent;
