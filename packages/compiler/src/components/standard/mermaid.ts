import type { ComponentDefinition } from '../component-registry';

/**
 * Mermaid Diagram Component
 *
 * Renders Mermaid diagrams from code blocks:
 * ```mermaid
 * flowchart TD
 *   A[Start] --> B[Process]
 * ```
 *
 * Features:
 * - Client-side SVG rendering with the exported Mermaid runtime
 * - All diagram types supported (flowchart, sequence, class, state, gantt, pie, git, etc.)
 * - Responsive SVG output
 * - Theme-aware (light/dark)
 * - Glass/elevated styling options
 *
 * Variants:
 * - {glass} - Glassmorphism container with backdrop blur
 * - {elevated} - Elevated shadow effect
 * - {centered} - Center-align the diagram
 * - {compact} - Reduced padding
 * - {bordered} - Add border
 *
 * Size modifiers:
 * - {sm} - Small size (max-width: 400px)
 * - {md} - Medium size (max-width: 600px)
 * - {lg} - Large size (max-width: 800px)
 * - {xl} - Extra large size (max-width: 1000px)
 * - {full} - Full width
 *
 * @example
 * ```mermaid {glass}
 * graph LR
 *   A --> B
 * ```
 */
export const mermaidComponent: ComponentDefinition = {
  name: 'mermaid',
  displayName: 'Mermaid Diagram',
  category: 'content',

  // Default classes applied to all mermaid diagrams
  defaultClasses: [
    'mermaid-container',
    'rounded-lg',
    'overflow-hidden',
    'my-6',
  ],

  // Component variants
  variants: {
    // Visual variants
    glass: ['glass-effect', 'glass-subtle'],
    elevated: ['shadow-xl'],
    bordered: ['border-2', 'border-border'],
    centered: ['mx-auto'],
    compact: ['p-4'],

  },
  htmlElement: 'div',
  defaultSize: 'lg',
  sizes: {
    sm: ['max-w-[400px]'],
    md: ['max-w-[600px]'],
    lg: ['max-w-[800px]'],
    xl: ['max-w-[1000px]'],
    full: ['w-full'],
    small: ['max-w-[400px]'],
    medium: ['max-w-[600px]'],
    large: ['max-w-[800px]'],
  },
  description: 'Renders diagrams using Mermaid syntax',
  hasChildren: true,
};