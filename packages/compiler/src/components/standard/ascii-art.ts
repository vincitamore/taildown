/**
 * ASCII Art Component Definition
 * Professional ASCII art and text-based illustration styling
 * 
 * Variants:
 * - standard: Classic ASCII art styling
 * - modern: Enhanced with subtle shadows and colors
 * - minimal: Clean, no decorations
 * - colorful: Syntax-highlighted ASCII
 * - boxed: Framed with border
 * 
 * Features:
 * - Mobile-optimized with horizontal scroll
 * - Monospace font for perfect alignment
 * - Preserves all whitespace and formatting
 * - Optional color highlighting
 * - Glassmorphism support
 * 
 * Usage:
 * ```taildown
 * :::ascii-art
 *     ___
 *    /   \
 *   |  o  |
 *    \___/
 * :::
 * 
 * :::ascii-art {modern}
 * Enhanced ASCII art with modern styling
 * :::
 * 
 * :::ascii-art {colorful glass}
 * Colorful ASCII with glassmorphism
 * :::
 * ```
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * ASCII art component definition
 * Optimized for displaying text-based illustrations and ASCII art
 */
export const asciiArtComponent: ComponentDefinition = defineComponent({
  name: 'ascii-art',
  htmlElement: 'pre',
  
  // Base classes applied to all ASCII art
  // Mobile-first: enable horizontal scroll, preserve formatting
  defaultClasses: [
    'ascii-art',
    'font-mono',
    'text-sm',
    'leading-tight',
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
  defaultVariant: 'modern',
  
  // Visual variants
  variants: {
    // Standard: Classic ASCII art styling
    standard: [
      'ascii-standard',
      'text-slate-700',
      'bg-white',
      'p-4',
    ],
    
    // Modern: Enhanced with subtle effects (default)
    modern: [
      'ascii-modern',
      'text-slate-800',
      'p-6',
      'shadow-sm',
    ],
    
    // Minimal: Clean, no decorations
    minimal: [
      'ascii-minimal',
      'text-slate-700',
      'p-3',
      'bg-transparent',
      'border-0',
    ],
    
    // Colorful: Syntax-highlighted ASCII
    colorful: [
      'ascii-colorful',
      'text-slate-800',
      'p-6',
    ],
    
    // Boxed: Framed with prominent border
    boxed: [
      'ascii-boxed',
      'text-slate-800',
      'p-6',
      'border-2',
      'border-slate-300',
      'shadow-md',
    ],
    
    // Glass variants for modern aesthetic
    'glass': [
      'ascii-glass',
      'glass-effect',
      'glass-subtle',
      'bg-glass-subtle',
      'border-white/50',
      'shadow-md',
      'text-slate-800',
    ],
    
    'light-glass': [
      'ascii-glass',
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
    sm: ['text-xs', 'p-3'],
    md: ['text-sm', 'p-6'],
    lg: ['text-base', 'p-8'],
  },
  
  description: 'Professional ASCII art and text-based illustration styling',
  hasChildren: true,
});

/**
 * Export ASCII art component as default
 */
export default asciiArtComponent;
