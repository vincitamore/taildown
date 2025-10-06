/**
 * Text Illustrations Theme System for Taildown
 * Provides professional styling for text-based illustrations like
 * file trees, flow diagrams, and ASCII art
 * 
 * Design Philosophy:
 * - Monospace fonts for perfect alignment
 * - Mobile-optimized with horizontal scroll
 * - Subtle colors and shadows for depth
 * - Glassmorphism variants for modern aesthetic
 * - Hover effects for interactive elements
 * 
 * Features:
 * - File tree visualization
 * - Flow diagram rendering
 * - ASCII art styling
 * - Syntax highlighting for different file types
 * - Unicode box-drawing characters
 */

/**
 * Generate custom CSS rules for text illustration effects
 * These are added to the generated CSS file
 * 
 * @returns CSS string with text illustration utilities
 */
export function generateTextIllustrationsCSS(): string {
  return `
/* ===================================
   TEXT ILLUSTRATIONS - CORE STYLES
   =================================== */

/* Base styles for all text illustration components */
.file-tree,
.flow-diagram,
.ascii-art {
  /* Monospace font with better readability */
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-feature-settings: 'liga' 0; /* Disable ligatures for alignment */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* Ensure proper text rendering */
  text-rendering: optimizeLegibility;
  
  /* Smooth scrolling on mobile */
  -webkit-overflow-scrolling: touch;
  
  /* Selection styling */
  user-select: text;
  
  /* Transitions for smooth effects */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===================================
   FILE TREE COMPONENT
   =================================== */

.file-tree {
  /* Line height for tree structure */
  line-height: 1.6;
  letter-spacing: 0;
}

/* File tree variants */
.file-tree-minimal {
  background: transparent;
  border: 1px solid rgb(226, 232, 240);
  padding: 1rem;
  line-height: 1.4;
}

.file-tree-detailed {
  background: linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%);
  border: 1px solid rgb(203, 213, 225);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  line-height: 1.6;
}

.file-tree-compact {
  background: rgb(248, 250, 252);
  border: 1px solid rgb(226, 232, 240);
  padding: 0.75rem;
  line-height: 1.3;
  font-size: 0.75rem;
}

.file-tree-colorful {
  background: rgb(15, 23, 42); /* slate-900 */
  color: rgb(226, 232, 240); /* slate-200 */
  border: 1px solid rgb(51, 65, 85); /* slate-700 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* File tree glass variant */
.file-tree-glass {
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px) saturate(110%);
}

/* File type color coding (when using colorful variant) */
.file-tree-colorful .file-ts,
.file-tree-colorful .file-tsx {
  color: rgb(59, 130, 246); /* blue-500 */
}

.file-tree-colorful .file-js,
.file-tree-colorful .file-jsx {
  color: rgb(234, 179, 8); /* yellow-500 */
}

.file-tree-colorful .file-json {
  color: rgb(34, 197, 94); /* green-500 */
}

.file-tree-colorful .file-css,
.file-tree-colorful .file-scss {
  color: rgb(236, 72, 153); /* pink-500 */
}

.file-tree-colorful .file-md,
.file-tree-colorful .file-txt {
  color: rgb(148, 163, 184); /* slate-400 */
}

.file-tree-colorful .directory {
  color: rgb(147, 197, 253); /* blue-300 */
  font-weight: 600;
}

/* Hover effects for file tree items */
.file-tree:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* ===================================
   FLOW DIAGRAM COMPONENT
   =================================== */

.flow-diagram {
  /* Optimal spacing for flow elements */
  line-height: 1.8;
  letter-spacing: 0.01em;
}

/* Flow diagram variants */
.flow-simple {
  background: rgb(255, 255, 255);
  border: 1px solid rgb(226, 232, 240);
  padding: 1rem;
}

.flow-detailed {
  background: linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%);
  border: 1px solid rgb(203, 213, 225);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.flow-vertical {
  /* Default orientation */
  text-align: center;
}

.flow-horizontal {
  /* Left-aligned for horizontal flows */
  text-align: left;
}

.flow-compact {
  padding: 0.75rem;
  line-height: 1.4;
  font-size: 0.75rem;
}

.flow-colorful {
  background: rgb(248, 250, 252);
  border: 1px solid rgb(203, 213, 225);
}

/* Flow diagram glass variant */
.flow-glass {
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px) saturate(110%);
}

/* Arrow and connector styling */
.flow-diagram .arrow {
  color: rgb(100, 116, 139); /* slate-500 */
  font-weight: bold;
}

.flow-diagram .box {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgb(241, 245, 249); /* slate-100 */
  border: 1px solid rgb(203, 213, 225); /* slate-300 */
  border-radius: 0.25rem;
  margin: 0.125rem;
}

/* Node color coding */
.flow-diagram .node-start {
  background: rgb(220, 252, 231); /* green-100 */
  border-color: rgb(34, 197, 94); /* green-500 */
  color: rgb(22, 101, 52); /* green-900 */
}

.flow-diagram .node-process {
  background: rgb(219, 234, 254); /* blue-100 */
  border-color: rgb(59, 130, 246); /* blue-500 */
  color: rgb(30, 58, 138); /* blue-900 */
}

.flow-diagram .node-decision {
  background: rgb(254, 249, 195); /* yellow-100 */
  border-color: rgb(234, 179, 8); /* yellow-500 */
  color: rgb(113, 63, 18); /* yellow-900 */
}

.flow-diagram .node-end {
  background: rgb(254, 226, 226); /* red-100 */
  border-color: rgb(239, 68, 68); /* red-500 */
  color: rgb(127, 29, 29); /* red-900 */
}

/* Hover effect */
.flow-diagram:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* ===================================
   ASCII ART COMPONENT
   =================================== */

.ascii-art {
  /* Tighter line height for ASCII art */
  line-height: 1.2;
  letter-spacing: 0;
}

/* ASCII art variants */
.ascii-standard {
  background: rgb(255, 255, 255);
  border: 1px solid rgb(226, 232, 240);
  padding: 1rem;
}

.ascii-modern {
  background: linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%);
  border: 1px solid rgb(203, 213, 225);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.ascii-minimal {
  background: transparent;
  border: none;
  padding: 0.75rem;
}

.ascii-colorful {
  background: rgb(15, 23, 42); /* slate-900 */
  color: rgb(148, 163, 184); /* slate-400 */
  border: 1px solid rgb(51, 65, 85); /* slate-700 */
}

.ascii-boxed {
  border: 2px solid rgb(100, 116, 139); /* slate-500 */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* ASCII art glass variant */
.ascii-glass {
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(12px) saturate(110%);
}

/* Hover effect */
.ascii-art:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* ===================================
   UNICODE BOX-DRAWING CHARACTERS
   =================================== */

/* Ensure box-drawing characters render properly */
.file-tree,
.flow-diagram,
.ascii-art {
  /* Common box-drawing characters */
  /* ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ */
  /* ═ ║ ╔ ╗ ╚ ╝ ╠ ╣ ╦ ╩ ╬ */
  /* ▁ ▂ ▃ ▄ ▅ ▆ ▇ █ */
}

/* ===================================
   MOBILE OPTIMIZATIONS
   =================================== */

@media (max-width: 640px) {
  .file-tree,
  .flow-diagram,
  .ascii-art {
    /* Slightly smaller on mobile */
    font-size: 0.8125rem; /* 13px */
    padding: 1rem;
    
    /* Ensure horizontal scroll works */
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  /* Add scroll indicator gradient on mobile */
  .file-tree::after,
  .flow-diagram::after,
  .ascii-art::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2rem;
    background: linear-gradient(to left, rgba(0, 0, 0, 0.05), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .file-tree:hover::after,
  .flow-diagram:hover::after,
  .ascii-art:hover::after {
    opacity: 1;
  }
}

/* ===================================
   DARK MODE SUPPORT
   =================================== */

@media (prefers-color-scheme: dark) {
  .file-tree:not(.file-tree-colorful),
  .flow-diagram,
  .ascii-art:not(.ascii-colorful) {
    background: rgb(15, 23, 42); /* slate-900 */
    color: rgb(226, 232, 240); /* slate-200 */
    border-color: rgb(51, 65, 85); /* slate-700 */
  }
  
  .flow-diagram .box {
    background: rgb(30, 41, 59); /* slate-800 */
    border-color: rgb(71, 85, 105); /* slate-600 */
    color: rgb(226, 232, 240); /* slate-200 */
  }
}

/* ===================================
   PRINT STYLES
   =================================== */

@media print {
  .file-tree,
  .flow-diagram,
  .ascii-art {
    /* Ensure proper printing */
    page-break-inside: avoid;
    background: white !important;
    color: black !important;
    border: 1px solid #ccc !important;
    box-shadow: none !important;
  }
}

/* ===================================
   ACCESSIBILITY
   =================================== */

/* Improve focus visibility */
.file-tree:focus-visible,
.flow-diagram:focus-visible,
.ascii-art:focus-visible {
  outline: 2px solid rgb(59, 130, 246); /* blue-500 */
  outline-offset: 2px;
}

/* Screen reader helpers */
.file-tree[aria-label]::before,
.flow-diagram[aria-label]::before,
.ascii-art[aria-label]::before {
  content: attr(aria-label);
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
`.trim();
}

/**
 * Get plain English shorthand for text illustration components
 * These can be used in Taildown syntax
 * 
 * @returns Mapping of shorthand terms to component names
 */
export function getTextIllustrationShorthands(): Record<string, string> {
  return {
    // File tree shorthands
    'tree': 'file-tree',
    'project-tree': 'file-tree',
    'directory': 'file-tree',
    
    // Flow diagram shorthands
    'diagram': 'flow',
    'flowchart': 'flow',
    'process': 'flow',
    
    // ASCII art shorthands
    'art': 'ascii-art',
    'ascii': 'ascii-art',
    'text-art': 'ascii-art',
  };
}

/**
 * Helper functions for text illustration rendering
 */

/**
 * Detect file type from filename for syntax highlighting
 * 
 * @param line - Line of text (potentially a filename)
 * @returns CSS class name for file type or null
 */
export function detectFileType(line: string): string | null {
  const fileExtensions: Record<string, string> = {
    '.ts': 'file-ts',
    '.tsx': 'file-tsx',
    '.js': 'file-js',
    '.jsx': 'file-jsx',
    '.json': 'file-json',
    '.css': 'file-css',
    '.scss': 'file-scss',
    '.md': 'file-md',
    '.txt': 'file-txt',
  };
  
  for (const [ext, className] of Object.entries(fileExtensions)) {
    if (line.trim().endsWith(ext)) {
      return className;
    }
  }
  
  // Check if it's a directory (ends with /)
  if (line.trim().endsWith('/')) {
    return 'directory';
  }
  
  return null;
}

/**
 * Detect node type in flow diagram for color coding
 * 
 * @param line - Line of text (potentially a node)
 * @returns CSS class name for node type or null
 */
export function detectNodeType(line: string): string | null {
  const trimmed = line.trim().toLowerCase();
  
  if (trimmed.includes('start') || trimmed.includes('begin')) {
    return 'node-start';
  }
  if (trimmed.includes('end') || trimmed.includes('finish')) {
    return 'node-end';
  }
  if (trimmed.includes('?') || trimmed.includes('if') || trimmed.includes('decision')) {
    return 'node-decision';
  }
  if (trimmed.includes('process') || trimmed.includes('action')) {
    return 'node-process';
  }
  
  return null;
}

/**
 * Common box-drawing characters for reference
 */
export const BOX_DRAWING_CHARS = {
  // Light lines
  horizontal: '─',
  vertical: '│',
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  leftT: '├',
  rightT: '┤',
  topT: '┬',
  bottomT: '┴',
  cross: '┼',
  
  // Heavy lines
  heavyHorizontal: '═',
  heavyVertical: '║',
  heavyTopLeft: '╔',
  heavyTopRight: '╗',
  heavyBottomLeft: '╚',
  heavyBottomRight: '╝',
  heavyLeftT: '╠',
  heavyRightT: '╣',
  heavyTopT: '╦',
  heavyBottomT: '╩',
  heavyCross: '╬',
  
  // Arrows
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→',
  arrowUpDown: '↕',
  arrowLeftRight: '↔',
  
  // Blocks
  block1: '▁',
  block2: '▂',
  block3: '▃',
  block4: '▄',
  block5: '▅',
  block6: '▆',
  block7: '▇',
  blockFull: '█',
} as const;
