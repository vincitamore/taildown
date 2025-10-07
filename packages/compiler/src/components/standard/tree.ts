/**
 * Tree Component Definition
 * Professional directory tree and hierarchical structure visualization
 * 
 * Replaces crude ASCII diagrams with modern, mobile-optimized styling
 * Supports both directory trees and generic hierarchical structures
 * 
 * Variants:
 * - default: Clean modern tree with subtle borders
 * - vscode: VS Code style with chevrons (▸) and connecting lines
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
    'bg-muted',
    'border',
    'border-border',
    'p-4',
  ],
  
  // Default variant
  defaultVariant: 'default',
  
  // Visual variants
  variants: {
    // Default: Modern clean tree with subtle visual indicators
    default: [
      'tree-default',
      'text-foreground',
    ],
    
    // VS Code: Chevrons and connecting lines like VS Code's file tree
    vscode: [
      'tree-vscode',
      'bg-card',
      'border-border',
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
      'bg-card',
      'border-border',
    ],
    
    // Rounded: Soft rounded connectors
    rounded: [
      'tree-rounded',
      'bg-muted',
    ],
    
    // Colored: Color-coded by depth
    colored: [
      'tree-colored',
      'bg-card',
    ],
    
    // Dark: Dark theme tree
    dark: [
      'tree-dark',
      'bg-card',
      'border-border',
      'text-card-foreground',
    ],
    
    // Glass: Glassmorphism effect
    glass: [
      'tree-glass',
      'bg-glass',
      'border-glass',
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
