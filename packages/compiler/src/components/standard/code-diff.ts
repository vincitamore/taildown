import { defineComponent } from '../component-registry.js';
import type { ComponentDefinition } from '../component-registry.js';

/**
 * Code Diff Component
 * 
 * Displays code differences in side-by-side or unified format with syntax highlighting.
 * Perfect for showing before/after changes, reviewing pull requests, or documenting refactoring.
 * 
 * Syntax:
 * ```diff
 * - Old line removed
 * + New line added
 *   Unchanged line
 * ```
 * 
 * Or with explicit before/after blocks:
 * :::diff {side-by-side}
 * ```before
 * old code
 * ```
 * 
 * ```after
 * new code
 * ```
 * :::
 */
export const codeDiffComponent: ComponentDefinition = defineComponent({
  name: 'diff',
  htmlElement: 'div',
  
  defaultClasses: [
    'code-diff',
    'relative',
    'overflow-hidden',
    'rounded-lg',
    'border',
    'border-slate-200',
    'dark:border-slate-700',
  ],
  
  defaultVariant: 'unified',
  
  // Diff variants
  variants: {
    // Layout variants
    unified: ['diff-unified'],
    'side-by-side': ['diff-side-by-side'],
    split: ['diff-side-by-side'], // Alias
    
    // Visual variants
    glass: ['glass-effect', 'glass-subtle'],
    elevated: ['shadow-xl'],
    compact: ['diff-compact'],
    
    // Syntax highlighting language hints
    javascript: ['language-javascript'],
    typescript: ['language-typescript'],
    python: ['language-python'],
    css: ['language-css'],
    html: ['language-html'],
    jsx: ['language-jsx'],
    tsx: ['language-tsx'],
    json: ['language-json'],
    markdown: ['language-markdown'],
    bash: ['language-bash'],
    shell: ['language-shell'],
  },
  
  // Size modifiers
  sizes: {
    sm: ['diff-sm', 'text-xs'],
    md: ['diff-md', 'text-sm'],
    lg: ['diff-lg', 'text-base'],
  },
  
  description: 'Code differences with side-by-side or unified view, syntax highlighting, and line numbers',
  hasChildren: true,
});

