/**
 * Tree Component Definition
 * Professional directory tree and hierarchical structure visualization
 * 
 * Replaces crude ASCII diagrams with modern, mobile-optimized styling
 * Supports both directory trees and generic hierarchical structures
 * 
 * Variants:
 * - default: Clean modern tree with subtle borders
 * - minimal: Ultra-clean with minimal visual indicators
 * - boxed: Uses box drawing characters (├─└│)
 * - rounded: Soft rounded connectors
 * - colored: Color-coded by depth/type
 * 
 * Sizes:
 * - sm: Compact spacing for dense trees
 * - md: Normal spacing (default)
 * - lg: Generous spacing for presentations
 * 
 * Usage:
 * ```taildown
 * :::tree
 * - project/
 *   - src/
 *     - components/
 *       - Button.tsx
 *       - Card.tsx
 *     - utils/
 *       - helpers.ts
 *   - tests/
 *   - package.json
 * :::
 * 
 * :::tree {colored lg}
 * - Root Node
 *   - Child 1
 *     - Grandchild 1
 *     - Grandchild 2
 *   - Child 2
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Tree component definition
 * Uses unordered lists with specialized styling
 */
export const treeComponent: ComponentDefinition = defineComponent({
  name: 'tree',
  htmlElement: 'div',
  
  // Base classes for all tree visualizations
  defaultClasses: [
    'tree-container',
    'font-mono',
    'text-sm',
    'overflow-x-auto',
    'rounded-lg',
    'bg-gray-50',
    'border',
    'border-gray-200',
    'p-4',
  ],
  
  // Default variant
  defaultVariant: 'default',
  
  // Visual variants
  variants: {
    // Default: Modern clean tree with subtle visual indicators
    default: [
      'tree-default',
      'text-gray-800',
    ],
    
    // Minimal: Ultra-clean with minimal visual clutter
    minimal: [
      'tree-minimal',
      'border-none',
      'bg-transparent',
      'p-2',
    ],
    
    // Boxed: Traditional box-drawing characters
    boxed: [
      'tree-boxed',
      'bg-white',
      'border-gray-300',
    ],
    
    // Rounded: Soft rounded connectors
    rounded: [
      'tree-rounded',
      'bg-gradient-to-br',
      'from-gray-50',
      'to-gray-100',
    ],
    
    // Colored: Color-coded by depth
    colored: [
      'tree-colored',
      'bg-white',
    ],
    
    // Dark: Dark theme tree
    dark: [
      'tree-dark',
      'bg-gray-900',
      'border-gray-700',
      'text-gray-100',
    ],
    
    // Glass: Glassmorphism effect
    glass: [
      'tree-glass',
      'glass-effect',
      'glass-subtle',
      'bg-glass-subtle',
      'border-white/40',
    ],
  },
  
  // Size variants
  sizes: {
    sm: ['text-xs', 'p-3', 'leading-tight'],
    md: ['text-sm', 'p-4', 'leading-relaxed'],
    lg: ['text-base', 'p-6', 'leading-loose'],
  },
  
  description: 'Directory tree and hierarchical structure visualization',
  hasChildren: true,
});

/**
 * Export tree component as default
 */
export default treeComponent;
