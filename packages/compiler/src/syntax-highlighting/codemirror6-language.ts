/**
 * CodeMirror6 Taildown Language Definition
 * 
 * Professional-grade syntax highlighting for Taildown's complex nested structures.
 * Designed for both editor use and Obsidian plugin compatibility.
 * 
 * Philosophy: Only content text should be unhighlighted - all syntax elements
 * (component blocks, attributes, icons, etc.) receive appropriate highlighting.
 */

import { StreamLanguage, LanguageSupport } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

/**
 * Taildown streaming parser for CodeMirror6
 * Handles complex nested structures with proper tokenization
 */
const taildownParser = {
  name: 'taildown',
  
  startState() {
    return {
      inComponent: false,
      componentStack: [],
      inCodeBlock: false,
      codeBlockFence: '',
      inAttributes: false,
      attributeDepth: 0,
    };
  },
  
  token(stream: any, state: any) {
    // Handle code blocks first (highest precedence)
    if (state.inCodeBlock) {
      if (stream.match(new RegExp(`^${state.codeBlockFence}\\s*$`))) {
        state.inCodeBlock = false;
        state.codeBlockFence = '';
        return 'processingInstruction';
      }
      stream.skipToEnd();
      return 'monospace';
    }
    
    // Check for code block start
    if (stream.sol() && stream.match(/^```|^~~~/)) {
      const fence = stream.current();
      state.inCodeBlock = true;
      state.codeBlockFence = fence;
      // Consume language identifier if present
      stream.match(/\w+/);
      return 'processingInstruction';
    }
    
    // Component blocks
    if (stream.sol() && stream.match(/^:::/)) {
      if (stream.match(/\s*$/)) {
        // Closing fence
        if (state.componentStack.length > 0) {
          state.componentStack.pop();
        }
        state.inComponent = state.componentStack.length > 0;
        return 'punctuation';
      } else {
        // Opening fence with component name
        stream.match(/\s+/);
        if (stream.match(/[a-z][a-z0-9-]*/)) {
          state.componentStack.push(stream.current());
          state.inComponent = true;
          return 'tagName';
        }
        return 'punctuation';
      }
    }
    
    // Icon syntax: :icon[name]{attributes}
    if (stream.match(/:icon/)) {
      return 'keyword';
    }
    
    // Badge syntax: :badge[text]{attributes}
    if (stream.match(/:badge/)) {
      return 'keyword';
    }
    
    if (stream.match(/\[([a-z][a-z0-9-]*)\]/)) {
      return 'function';
    }
    
    // Attribute blocks
    if (stream.match(/\{/)) {
      state.inAttributes = true;
      state.attributeDepth = 1;
      return 'brace';
    }
    
    if (state.inAttributes) {
      if (stream.match(/\{/)) {
        state.attributeDepth++;
        return 'brace';
      }
      
      if (stream.match(/\}/)) {
        state.attributeDepth--;
        if (state.attributeDepth === 0) {
          state.inAttributes = false;
        }
        return 'brace';
      }
      
      // Key-value attributes
      if (stream.match(/([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*["']([^"']+)["']/)) {
        return 'string';
      }
      
      // CSS classes
      if (stream.match(/\.[a-zA-Z0-9_-]+/)) {
        return 'className';
      }
      
      // Component variants and keywords
      if (stream.match(/\b(primary|secondary|accent|success|warning|error|info|muted|ghost|link|destructive)\b/)) {
        return 'className';
      }
      
      // Size keywords
      if (stream.match(/\b(xs|tiny|small|sm|md|base|large|lg|xl|2xl|3xl|huge|massive)\b/)) {
        return 'number';
      }
      
      // Animation keywords
      if (stream.match(/\b(fade-in|slide-up|slide-down|slide-left|slide-right|zoom-in|scale-in|hover-lift|hover-glow|hover-scale|fast|smooth|slow)\b/)) {
        return 'function';
      }
      
      // Typography keywords
      if (stream.match(/\b(bold|italic|thin|light|medium|semibold|extra-bold|black|uppercase|lowercase|capitalize|underline|strike|huge-bold|large-bold|xl-bold|bold-primary|large-muted|small-light|tight-lines|normal-lines|relaxed-lines|loose-lines)\b/)) {
        return 'emphasis';
      }
      
      // Layout keywords
      if (stream.match(/\b(center|left|right|justify|flex|grid|inline|block|padded|padded-sm|padded-lg|padded-xl|gap|gap-sm|gap-lg|gap-xl|center-x|center-y|center-both|flex-center|grid-2|grid-3|grid-4)\b/)) {
        return 'propertyName';
      }
      
      // Decoration keywords
      if (stream.match(/\b(rounded|rounded-sm|rounded-lg|rounded-full|shadow|shadow-sm|shadow-lg|shadow-xl|elevated|floating|glass|subtle-glass|light-glass|heavy-glass)\b/)) {
        return 'attributeName';
      }
      
      // Component keywords
      if (stream.match(/\b(button|badge|alert|modal|tooltip|details|callout|columns|definitions|stats|divider|steps|video|elevated|floating|outlined|interactive)\b/)) {
        return 'keyword';
      }
      
      // Skip whitespace in attributes
      if (stream.match(/\s+/)) {
        return null;
      }
      
      // Fallback for other attribute content
      stream.next();
      return 'meta';
    }
    
    // Markdown elements
    
    // Headings
    if (stream.sol() && stream.match(/^#{1,6}\s/)) {
      stream.skipToEnd();
      return 'heading';
    }
    
    // Lists
    if (stream.sol() && stream.match(/^[\s]*[-*+]\s/)) {
      return 'list';
    }
    
    if (stream.sol() && stream.match(/^[\s]*\d+\.\s/)) {
      return 'list';
    }
    
    // Task lists
    if (stream.sol() && stream.match(/^[\s]*-\s+\[[x ]\]\s/)) {
      return 'list';
    }
    
    // Blockquotes
    if (stream.sol() && stream.match(/^>\s*/)) {
      return 'quote';
    }
    
    // Horizontal rules
    if (stream.sol() && stream.match(/^(---+|===+|\*\*\*+)\s*$/)) {
      return 'contentSeparator';
    }
    
    // Tables
    if (stream.match(/\|/)) {
      return 'punctuation';
    }
    
    // Strong text
    if (stream.match(/\*\*([^*]+)\*\*/)) {
      return 'strong';
    }
    
    // Emphasis
    if (stream.match(/\*([^*]+)\*/)) {
      return 'emphasis';
    }
    
    // Inline code
    if (stream.match(/`([^`]+)`/)) {
      return 'monospace';
    }
    
    // Highlight/mark text
    if (stream.match(/==([^=]+)==(?:\{[^}]+\})?/)) {
      return 'inserted';
    }
    
    // Links
    if (stream.match(/\[([^\]]+)\]\(([^)]+)\)/)) {
      return 'link';
    }
    
    // Default: consume character and continue
    stream.next();
    return null;
  },
  
  languageData: {
    name: 'taildown',
    extensions: ['.td', '.tdown', '.taildown'],
    commentTokens: { line: '//' },
    indentOnInput: /^\s*:::$/,
    closeBrackets: { brackets: ['(', '[', '{', '"', "'"] },
    wordChars: 'a-zA-Z0-9_-',
  },
};

/**
 * Taildown language definition for CodeMirror6
 * Uses streaming parser for robust parsing of nested structures
 */
export const taildownLanguage = StreamLanguage.define(taildownParser);

/**
 * CodeMirror6 language support for Taildown
 * Includes language definition and additional editor features
 */
export function taildown(): LanguageSupport {
  return new LanguageSupport(taildownLanguage, [
    // Additional extensions can be added here
    // e.g., autocomplete, linting, etc.
  ]);
}

/**
 * Theme-aware color scheme for Taildown syntax highlighting
 * Provides professional colors that work in both light and dark themes
 */
export const taildownHighlightStyle = [
  // Component structure
  { tag: t.punctuation, color: '#6b7280' }, // Gray for fences and brackets
  { tag: t.tagName, color: '#059669', fontWeight: 'bold' }, // Green for component names
  { tag: t.meta, color: '#7c3aed' }, // Purple for attribute blocks
  { tag: t.brace, color: '#6b7280' }, // Gray for braces
  
  // Keywords and variants
  { tag: t.keyword, color: '#dc2626', fontWeight: 'bold' }, // Red for keywords
  { tag: t.className, color: '#2563eb' }, // Blue for variants
  { tag: t.number, color: '#ea580c' }, // Orange for sizes
  { tag: t.color, color: '#7c2d12' }, // Brown for colors
  { tag: t.function(t.keyword), color: '#9333ea' }, // Purple for animations
  { tag: t.emphasis, color: '#be185d' }, // Pink for typography
  { tag: t.propertyName, color: '#0891b2' }, // Cyan for layout
  { tag: t.attributeName, color: '#65a30d' }, // Lime for decorations
  
  // Attributes
  { tag: t.string, color: '#166534' }, // Dark green for strings
  { tag: t.operator, color: '#6b7280' }, // Gray for equals
  
  // Icons
  { tag: t.special(t.keyword), color: '#7c2d12', fontWeight: 'bold' }, // Brown for :icon
  { tag: t.function(t.name), color: '#1d4ed8' }, // Blue for icon names
  { tag: t.squareBracket, color: '#6b7280' }, // Gray for brackets
  
  // Markdown
  { tag: t.heading, color: '#1f2937', fontWeight: 'bold' }, // Dark gray for headings
  { tag: t.strong, fontWeight: 'bold' }, // Bold text
  { tag: t.emphasis, fontStyle: 'italic' }, // Italic text
  { tag: t.monospace, color: '#374151', backgroundColor: '#f3f4f6' }, // Code
  { tag: t.link, color: '#2563eb', textDecoration: 'underline' }, // Links
  { tag: t.link, color: '#2563eb' }, // Link text
  { tag: t.url, color: '#059669' }, // URLs
  
  // Lists and structure
  { tag: t.list, color: '#6b7280', fontWeight: 'bold' }, // List markers
  { tag: t.quote, color: '#6b7280', fontStyle: 'italic' }, // Blockquote marker
  { tag: t.contentSeparator, color: '#d1d5db' }, // Horizontal rules
  
  // Comments
  { tag: t.comment, color: '#9ca3af', fontStyle: 'italic' }, // Comments
];

/**
 * Dark theme variant of the highlight style
 */
export const taildownDarkHighlightStyle = [
  // Component structure
  { tag: t.punctuation, color: '#9ca3af' }, // Light gray for fences
  { tag: t.tagName, color: '#34d399', fontWeight: 'bold' }, // Light green for components
  { tag: t.meta, color: '#a78bfa' }, // Light purple for attributes
  { tag: t.brace, color: '#9ca3af' }, // Light gray for braces
  
  // Keywords and variants
  { tag: t.keyword, color: '#f87171', fontWeight: 'bold' }, // Light red for keywords
  { tag: t.className, color: '#60a5fa' }, // Light blue for variants
  { tag: t.number, color: '#fb923c' }, // Light orange for sizes
  { tag: t.color, color: '#a3a3a3' }, // Light gray for colors
  { tag: t.function(t.keyword), color: '#c084fc' }, // Light purple for animations
  { tag: t.emphasis, color: '#f472b6' }, // Light pink for typography
  { tag: t.propertyName, color: '#22d3ee' }, // Light cyan for layout
  { tag: t.attributeName, color: '#a3e635' }, // Light lime for decorations
  
  // Attributes
  { tag: t.string, color: '#4ade80' }, // Light green for strings
  { tag: t.operator, color: '#9ca3af' }, // Light gray for equals
  
  // Icons
  { tag: t.special(t.keyword), color: '#d97706', fontWeight: 'bold' }, // Orange for :icon
  { tag: t.function(t.name), color: '#82a0ff' }, // Blue for icon names
  { tag: t.squareBracket, color: '#9ca3af' }, // Light gray for brackets
  
  // Markdown
  { tag: t.heading, color: '#f9fafb', fontWeight: 'bold' }, // White for headings
  { tag: t.strong, fontWeight: 'bold' }, // Bold text
  { tag: t.emphasis, fontStyle: 'italic' }, // Italic text
  { tag: t.monospace, color: '#e5e7eb', backgroundColor: '#374151' }, // Code
  { tag: t.link, color: '#60a5fa', textDecoration: 'underline' }, // Links
  { tag: t.link, color: '#60a5fa' }, // Link text
  { tag: t.url, color: '#34d399' }, // URLs
  
  // Lists and structure
  { tag: t.list, color: '#9ca3af', fontWeight: 'bold' }, // List markers
  { tag: t.quote, color: '#9ca3af', fontStyle: 'italic' }, // Blockquote marker
  { tag: t.contentSeparator, color: '#4b5563' }, // Horizontal rules
  
  // Comments
  { tag: t.comment, color: '#6b7280', fontStyle: 'italic' }, // Comments
];
