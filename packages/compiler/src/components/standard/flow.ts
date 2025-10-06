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
    'bg-gray-50',
    'border',
    'border-gray-200',
    'p-6',
  ],
  
  // Default variant
  defaultVariant: 'default',
  
  // Visual variants
  variants: {
    // Default: Vertical flow with connecting lines
    default: [
      'flow-vertical',
      'text-gray-800',
    ],
    
    // Horizontal: Left-to-right flow
    horizontal: [
      'flow-horizontal',
      'text-gray-800',
    ],
    
    // Stepped: Step-by-step with numbers
    stepped: [
      'flow-stepped',
      'bg-white',
      'text-gray-900',
    ],
    
    // Branching: Decision tree style
    branching: [
      'flow-branching',
      'bg-gradient-to-br',
      'from-blue-50',
      'to-purple-50',
    ],
    
    // Timeline: Timeline-style presentation
    timeline: [
      'flow-timeline',
      'bg-white',
      'border-l-4',
      'border-blue-500',
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
      'bg-gray-900',
      'border-gray-700',
      'text-gray-100',
    ],
    
    // Glass: Glassmorphism effect
    glass: [
      'flow-glass',
      'glass-effect',
      'glass-light',
      'bg-glass-light',
      'border-white/50',
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
