/**
 * File Tree Component Definition
 * Professional file/directory tree visualization for project structures
 * 
 * Variants:
 * - minimal: Clean lines, no icons, compact spacing
 * - detailed: Icons for file types, expanded spacing
 * - compact: Dense layout for large trees
 * - colorful: Syntax-highlighted file types
 * 
 * Features:
 * - Mobile-optimized with horizontal scroll
 * - Monospace font for alignment
 * - Subtle hover effects on items
 * - Icon integration for file types
 * - Glassmorphism support
 * 
 * Usage:
 * ```taildown
 * :::file-tree
 * project/
 *   src/
 *     index.ts
 *     utils.ts
 *   package.json
 * :::
 * 
 * :::file-tree {detailed}
 * With icons and expanded spacing
 * :::
 * 
 * :::file-tree {compact glass}
 * Dense layout with glassmorphism
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * File tree component definition
 * Optimized for displaying directory structures and file hierarchies
 */
export const fileTreeComponent: ComponentDefinition = defineComponent({
  name: 'file-tree',
  htmlElement: 'pre',
  
  // Base classes applied to all file trees
  // Mobile-first: enable horizontal scroll, prevent text wrapping
  defaultClasses: [
    'file-tree',
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
    // Minimal: Clean lines, no icons, compact
    minimal: [
      'file-tree-minimal',
      'text-slate-700',
      'p-4',
      'leading-tight',
    ],
    
    // Detailed: Icons, expanded spacing (default)
    detailed: [
      'file-tree-detailed',
      'text-slate-800',
      'p-6',
      'leading-relaxed',
    ],
    
    // Compact: Dense layout for large trees
    compact: [
      'file-tree-compact',
      'text-xs',
      'p-3',
      'leading-snug',
    ],
    
    // Colorful: Syntax-highlighted file types
    colorful: [
      'file-tree-colorful',
      'text-slate-800',
      'p-6',
      'leading-relaxed',
    ],
    
    // Glass variants for modern aesthetic
    'glass': [
      'file-tree-glass',
      'glass-effect',
      'glass-subtle',
      'bg-glass-subtle',
      'border-white/50',
      'shadow-md',
      'text-slate-800',
    ],
    
    'light-glass': [
      'file-tree-glass',
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
  
  description: 'Professional file/directory tree visualization for project structures',
  hasChildren: true,
});

/**
 * Export file tree component as default
 */
export default fileTreeComponent;
