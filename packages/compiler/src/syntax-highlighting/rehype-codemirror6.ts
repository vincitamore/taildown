/**
 * Rehype plugin for CodeMirror6-based syntax highlighting
 * 
 * Replaces rehype-prism-plus with a CodeMirror6-based solution
 * that provides better control over Taildown syntax highlighting.
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

/**
 * Interface for highlighting a code block
 */
interface HighlightResult {
  html: string;
  classes: string[];
}

/**
 * HAST Element interface
 */
interface Element {
  type: 'element';
  tagName: string;
  properties?: Record<string, any>;
  children: Array<Element | TextNode | RawNode>;
}

interface TextNode {
  type: 'text';
  value: string;
}

interface RawNode {
  type: 'raw';
  value: string;
}

/**
 * Highlight code using CodeMirror6 language definition
 * This simulates the tokenization process to generate highlighted HTML
 */
function highlightCode(code: string, language: string): HighlightResult {
  if (language !== 'taildown' && language !== 'td') {
    // For non-Taildown languages, return with basic styling
    return {
      html: escapeHtml(code),
      classes: ['code-highlight'],
    };
  }

  // Use our streaming parser to tokenize the code
  const lines = code.split('\n');
  const highlightedLines: string[] = [];
  
  for (const line of lines) {
    const highlightedLine = highlightLine(line);
    highlightedLines.push(`<span class="code-line">${highlightedLine}</span>`);
  }

  return {
    html: highlightedLines.join('\n'),
    classes: ['code-highlight', 'language-taildown'],
  };
}

/**
 * Highlight a single line of Taildown code
 */
function highlightLine(line: string): string {
  if (!line.trim()) {
    return '';
  }

  // Create a simple stream-like interface for our parser
  let pos = 0;
  const tokens: Array<{ type: string; text: string }> = [];
  
  // Initialize parser state
  const state = {
    inComponent: false,
    componentStack: [],
    inCodeBlock: false,
    codeBlockFence: '',
    inAttributes: false,
    attributeDepth: 0,
  };

  // Simple stream interface
  const stream = {
    pos,
    string: line,
    
    sol() {
      return this.pos === 0;
    },
    
    match(pattern: RegExp | string): string | null {
      const regex = typeof pattern === 'string' ? new RegExp('^' + escapeRegex(pattern)) : pattern;
      const match = this.string.slice(this.pos).match(regex);
      if (match) {
        this.pos += match[0].length;
        return match[0];
      }
      return null;
    },
    
    current(): string {
      return this.string.slice(pos, this.pos);
    },
    
    next(): string {
      if (this.pos < this.string.length) {
        return this.string[this.pos++] || '';
      }
      return '';
    },
    
    skipToEnd(): void {
      this.pos = this.string.length;
    },
  };

  // Tokenize the line
  while (stream.pos < line.length) {
    const startPos = stream.pos;
    
    // Component blocks
    if (stream.sol() && stream.match(/^:::/)) {
      if (stream.match(/\s*$/)) {
        tokens.push({ type: 'punctuation', text: stream.current() });
        continue;
      } else {
        tokens.push({ type: 'punctuation', text: ':::' });
        stream.match(/\s+/);
        if (stream.match(/[a-z][a-z0-9-]*/)) {
          tokens.push({ type: 'tagName', text: stream.current() });
        }
        continue;
      }
    }
    
    // Icon syntax
    if (stream.match(/:icon/)) {
      tokens.push({ type: 'keyword', text: stream.current() });
      continue;
    }
    
    if (stream.match(/\[([a-z][a-z0-9-]*)\]/)) {
      const iconName = stream.current();
      tokens.push({ type: 'squareBracket', text: '[' });
      tokens.push({ type: 'function', text: iconName.slice(1, -1) });
      tokens.push({ type: 'squareBracket', text: ']' });
      continue;
    }
    
    // Attribute blocks
    if (stream.match(/\{/)) {
      tokens.push({ type: 'brace', text: stream.current() });
      state.inAttributes = true;
      state.attributeDepth = 1;
      continue;
    }
    
    if (state.inAttributes && stream.match(/\}/)) {
      tokens.push({ type: 'brace', text: stream.current() });
      state.attributeDepth--;
      if (state.attributeDepth === 0) {
        state.inAttributes = false;
      }
      continue;
    }
    
    if (state.inAttributes) {
      // CSS classes
      if (stream.match(/\.[a-zA-Z0-9_-]+/)) {
        tokens.push({ type: 'className', text: stream.current() });
        continue;
      }
      
      // Component variants
      if (stream.match(/\b(primary|secondary|accent|success|warning|error|info|muted|ghost|link|destructive)\b/)) {
        tokens.push({ type: 'className', text: stream.current() });
        continue;
      }
      
      // Size keywords
      if (stream.match(/\b(xs|tiny|small|sm|md|base|large|lg|xl|2xl|3xl|huge|massive)\b/)) {
        tokens.push({ type: 'number', text: stream.current() });
        continue;
      }
      
      // Animation keywords
      if (stream.match(/\b(fade-in|slide-up|slide-down|zoom-in|hover-lift|hover-glow|hover-scale)\b/)) {
        tokens.push({ type: 'function', text: stream.current() });
        continue;
      }
      
      // Typography keywords
      if (stream.match(/\b(bold|italic|huge-bold|large-bold|xl-bold|bold-primary|large-muted|small-light|tight-lines|relaxed-lines)\b/)) {
        tokens.push({ type: 'emphasis', text: stream.current() });
        continue;
      }
      
      // Layout keywords
      if (stream.match(/\b(center|left|right|padded|gap|flex|grid|center-x|center-y)\b/)) {
        tokens.push({ type: 'propertyName', text: stream.current() });
        continue;
      }
      
      // Decoration keywords
      if (stream.match(/\b(rounded|shadow|elevated|floating|glass|subtle-glass|light-glass|heavy-glass)\b/)) {
        tokens.push({ type: 'attributeName', text: stream.current() });
        continue;
      }
      
      // Component keywords
      if (stream.match(/\b(button|badge|alert|modal|tooltip)\b/)) {
        tokens.push({ type: 'keyword', text: stream.current() });
        continue;
      }
      
      // Key-value attributes
      if (stream.match(/([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*["']([^"']+)["']/)) {
        tokens.push({ type: 'string', text: stream.current() });
        continue;
      }
    }
    
    // Headings
    if (stream.sol() && stream.match(/^#{1,6}\s/)) {
      tokens.push({ type: 'heading', text: stream.current() });
      stream.skipToEnd();
      tokens.push({ type: 'heading', text: stream.current() });
      continue;
    }
    
    // Strong text
    if (stream.match(/\*\*([^*]+)\*\*/)) {
      const match = stream.current();
      tokens.push({ type: 'strong', text: '**' });
      tokens.push({ type: 'strong', text: match.slice(2, -2) });
      tokens.push({ type: 'strong', text: '**' });
      continue;
    }
    
    // Emphasis
    if (stream.match(/\*([^*]+)\*/)) {
      const match = stream.current();
      tokens.push({ type: 'emphasis', text: '*' });
      tokens.push({ type: 'emphasis', text: match.slice(1, -1) });
      tokens.push({ type: 'emphasis', text: '*' });
      continue;
    }
    
    // Inline code
    if (stream.match(/`([^`]+)`/)) {
      tokens.push({ type: 'monospace', text: stream.current() });
      continue;
    }
    
    // Links
    if (stream.match(/\[([^\]]+)\]\(([^)]+)\)/)) {
      const match = stream.current();
        const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          tokens.push({ type: 'punctuation', text: '[' });
          tokens.push({ type: 'linkText', text: linkMatch[1] || '' });
          tokens.push({ type: 'punctuation', text: '](' });
          tokens.push({ type: 'url', text: linkMatch[2] || '' });
          tokens.push({ type: 'punctuation', text: ')' });
        }
      continue;
    }
    
    // Lists
    if (stream.sol() && stream.match(/^[\s]*[-*+]\s/)) {
      tokens.push({ type: 'list', text: stream.current() });
      continue;
    }
    
    if (stream.sol() && stream.match(/^[\s]*\d+\.\s/)) {
      tokens.push({ type: 'list', text: stream.current() });
      continue;
    }
    
    // Blockquotes
    if (stream.sol() && stream.match(/^>\s*/)) {
      tokens.push({ type: 'quote', text: stream.current() });
      continue;
    }
    
    // Default: consume one character
    if (stream.pos === startPos) {
      stream.next();
    }
  }

  // Convert tokens to HTML
  return tokens.map(token => {
    const className = getTokenClassName(token.type);
    const escapedText = escapeHtml(token.text);
    return className ? `<span class="${className}">${escapedText}</span>` : escapedText;
  }).join('');
}

/**
 * Map token types to CSS class names
 */
function getTokenClassName(tokenType: string): string | null {
  const classMap: Record<string, string> = {
    'punctuation': 'token punctuation',
    'tagName': 'token tag',
    'keyword': 'token keyword',
    'className': 'token class-name',
    'number': 'token number',
    'function': 'token function',
    'emphasis': 'token emphasis',
    'propertyName': 'token property',
    'attributeName': 'token attr-name',
    'string': 'token string',
    'brace': 'token punctuation',
    'squareBracket': 'token punctuation',
    'heading': 'token title',
    'strong': 'token bold',
    'monospace': 'token code',
    'linkText': 'token url',
    'url': 'token url',
    'list': 'token list',
    'quote': 'token blockquote',
  };
  
  return classMap[tokenType] || null;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape regex special characters
 */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rehype plugin for CodeMirror6-based syntax highlighting
 */
export const rehypeCodeMirror6: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'code' && node.properties?.className) {
        const classes = Array.isArray(node.properties.className) 
          ? node.properties.className 
          : [node.properties.className];
        
        // Find language class
        const languageClass = classes.find((cls: string) => cls.startsWith('language-'));
        if (languageClass) {
          const language = languageClass.replace('language-', '');
          
          // Get text content
          const textNode = node.children.find((child: any) => child.type === 'text');
          if (textNode && 'value' in textNode) {
            const code = textNode.value as string;
            
            // Highlight the code
            const result = highlightCode(code, language);
            
            // Replace content with highlighted HTML
            node.children = [{
              type: 'raw',
              value: result.html,
            }];
            
            // Add highlighting classes
            node.properties.className = [...classes, ...result.classes];
          }
        }
      }
    });
  };
};