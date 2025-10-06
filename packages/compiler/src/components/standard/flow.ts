/**
 * Flow Diagram Component Definition
 * Professional hierarchical flow diagram visualization using ASCII-style connectors
 * 
 * Variants:
 * - simple: Basic arrows and boxes, minimal styling
 * - detailed: Enhanced styling with shadows and colors
 * - vertical: Top-to-bottom flow (default)
 * - horizontal: Left-to-right flow
 * - compact: Dense layout for complex diagrams
 * 
 * Features:
 * - Mobile-optimized with horizontal scroll
 * - Monospace font for alignment
 * - Arrow and box characters for flow visualization
 * - Color-coded nodes (success, warning, error, info)
 * - Glassmorphism support
 * 
 * Usage:
 * ```taildown
 * :::flow
 * Start
 *   |
 *   v
 * Process
 *   |
 *   v
 * End
 * :::
 * 
 * :::flow {detailed}
 * Enhanced flow with colors and shadows
 * :::
 * 
 * :::flow {horizontal glass}
 * Left-to-right flow with glassmorphism
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Flow diagram component definition
 * Optimized for displaying hierarchical flow diagrams and process flows
 */
export const flowComponent: ComponentDefinition = defineComponent({
  name: 'flow',
  htmlElement: 'pre',
  
  // Base classes applied to all flow diagrams
  // Mobile-first: enable horizontal scroll, prevent text wrapping
  defaultClasses: [
    'flow-diagram',
    'font-mono',
    'text-sm',
    'leading-relaxed',
    'p-6',
    'rounded-lg',
    'bg-slate-50',
    'border',
    'border-slate-200',
    'overflow-x-auto',
    'max-w-full',
    'whitespace-pre',
  ],
  
  // Default variant if none specified
  defaultVariant: 'detailed',
  
  // Visual variants
  variants: {
    // Simple: Basic styling, minimal decoration
    simple: [
      'flow-simple',
      'text-slate-700',
      'p-4',
      'bg-white',
    ],
    
    // Detailed: Enhanced styling (default)
    detailed: [
      'flow-detailed',
      'text-slate-800',
      'p-6',
      'shadow-sm',
    ],
    
    // Vertical: Top-to-bottom flow (default orientation)
    vertical: [
      'flow-vertical',
      'text-slate-800',
    ],
    
    // Horizontal: Left-to-right flow
    horizontal: [
      'flow-horizontal',
      'text-slate-800',
    ],
    
    // Compact: Dense layout for complex diagrams
    compact: [
      'flow-compact',
      'text-xs',
      'p-3',
      'leading-snug',
    ],
    
    // Colorful: Color-coded nodes
    colorful: [
      'flow-colorful',
      'text-slate-800',
      'p-6',
    ],
    
    // Glass variants for modern aesthetic
    'glass': [
      'flow-glass',
      'glass-effect',
      'glass-subtle',
      'bg-glass-subtle',
      'border-white/50',
      'shadow-md',
      'text-slate-800',
    ],
    
    'light-glass': [
      'flow-glass',
      'glass-effect',
      'glass-light',
      'bg-glass-light',
      'border-white/50',
      'shadow-lg',
      'text-slate-900',
    ],
  },
  
  // Size variants
  sizes: {
    sm: ['text-xs', 'p-3', 'max-w-sm'],
    md: ['text-sm', 'p-6', 'max-w-2xl'],
    lg: ['text-base', 'p-8', 'max-w-4xl'],
  },
  
  description: 'Professional hierarchical flow diagram using ASCII-style connectors',
  hasChildren: true,
});

/**
 * Export flow component as default
 */
export default flowComponent;
