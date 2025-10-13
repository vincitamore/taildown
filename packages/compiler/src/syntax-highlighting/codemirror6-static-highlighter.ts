/**
 * CodeMirror 6 Static Syntax Highlighter
 * 
 * Uses CodeMirror 6's language packages for browser-based syntax highlighting.
 * This is used instead of Shiki in the browser bundle to keep the bundle lightweight.
 * 
 * Supports: JavaScript, TypeScript, Python, CSS, HTML, JSON, Markdown, SQL, Rust, C++, Java, PHP, XML
 */

import { HighlightStyle } from '@codemirror/language';
import { highlightTree, tags as t, classHighlighter } from '@lezer/highlight';

// Import language packages
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { php } from '@codemirror/lang-php';
import { xml } from '@codemirror/lang-xml';

/**
 * Language registry mapping language names to CodeMirror language support
 */
const languageRegistry: Record<string, any> = {
  // JavaScript family
  'javascript': javascript(),
  'js': javascript(),
  'typescript': javascript({ typescript: true }),
  'ts': javascript({ typescript: true }),
  'jsx': javascript({ jsx: true }),
  'tsx': javascript({ jsx: true, typescript: true }),
  
  // Python
  'python': python(),
  'py': python(),
  
  // Web languages
  'css': css(),
  'html': html(),
  'xml': xml(),
  'svg': xml(),
  
  // Data formats
  'json': json(),
  'json5': json(),
  
  // Markdown
  'markdown': markdown(),
  'md': markdown(),
  
  // Database
  'sql': sql(),
  
  // Systems languages
  'rust': rust(),
  'rs': rust(),
  'cpp': cpp(),
  'c++': cpp(),
  'c': cpp(),
  'java': java(),
  
  // PHP
  'php': php(),
};

/**
 * Dark theme highlight style (consistent with Taildown's default theme)
 */
const darkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#C586C0' },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: '#9CDCFE' },
  { tag: [t.function(t.variableName), t.labelName], color: '#DCDCAA' },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#4FC1FF' },
  { tag: [t.definition(t.name), t.separator], color: '#D4D4D4' },
  { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#4EC9B0' },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: '#D4D4D4' },
  { tag: [t.meta, t.comment], color: '#6A9955' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: '#3794FF', textDecoration: 'underline' },
  { tag: t.heading, fontWeight: 'bold', color: '#569CD6' },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#569CD6' },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#CE9178' },
  { tag: t.invalid, color: '#F44747' },
]);

/**
 * Highlight code using CodeMirror 6's static highlighting
 * 
 * @param code - Source code to highlight
 * @param language - Language identifier
 * @param theme - Theme parameter (ignored, always uses dark theme for consistency)
 * @returns Highlighted HTML string or null if language not supported
 */
export async function highlightWithShiki(code: string, language: string, theme?: string): Promise<string | null> {
  // Normalize language
  const normalizedLang = language.toLowerCase().trim();
  
  // Get language support
  const langSupport = languageRegistry[normalizedLang];
  if (!langSupport) {
    return null;
  }
  
  try {
    // Parse the code
    const tree = langSupport.language.parser.parse(code);
    
    // Build highlighted HTML with inline styles
    let html = '';
    let pos = 0;
    
    // Use classHighlighter with highlightTree to get CSS classes
    const tokensWithClasses: Array<{from: number, to: number, classes: string}> = [];
    
    highlightTree(tree, classHighlighter, (from: number, to: number, classes: string) => {
      tokensWithClasses.push({ from, to, classes });
    });
    
    // Build a map of CodeMirror CSS classes to inline styles
    // CodeMirror uses standard class names like 'tok-keyword', 'tok-variableName', etc.
    const cssClassToStyle = new Map<string, string>();
    
    const classNameMap: Record<string, string> = {
      'tok-keyword': 'color:#C586C0',
      'tok-name': 'color:#9CDCFE',
      'tok-variableName': 'color:#9CDCFE',
      'tok-typeName': 'color:#4EC9B0',
      'tok-className': 'color:#4EC9B0',
      'tok-propertyName': 'color:#9CDCFE',
      'tok-operator': 'color:#D4D4D4',
      'tok-string': 'color:#CE9178',
      'tok-number': 'color:#B5CEA8',
      'tok-bool': 'color:#569CD6',
      'tok-comment': 'color:#6A9955',
      'tok-function': 'color:#DCDCAA',
      'tok-meta': 'color:#6A9955',
      'tok-punctuation': 'color:#D4D4D4',
      'tok-bracket': 'color:#D4D4D4',
      'tok-definition': 'color:#D4D4D4',
    };
    
    Object.entries(classNameMap).forEach(([cls, style]) => {
      cssClassToStyle.set(cls, style);
    });
    
    // Build HTML from tokens
    for (const token of tokensWithClasses) {
      // Add any unhighlighted text before this token
      if (token.from > pos) {
        html += escapeHtml(code.slice(pos, token.from));
      }
      
      // Get the token text
      const tokenText = escapeHtml(code.slice(token.from, token.to));
      
      // Find matching inline style
      if (token.classes) {
        const classList = token.classes.split(' ');
        let matchedStyle = '';
        
        for (const cls of classList) {
          matchedStyle = cssClassToStyle.get(cls) || '';
          if (matchedStyle) break;
        }
        
        if (matchedStyle) {
          html += `<span style="${matchedStyle}">${tokenText}</span>`;
        } else {
          html += tokenText;
        }
      } else {
        html += tokenText;
      }
      
      pos = token.to;
    }
    
    // Add any remaining unhighlighted text
    if (pos < code.length) {
      html += escapeHtml(code.slice(pos));
    }
    
    // Wrap each line in a span for proper formatting (matching Shiki output)
    const lines = html.split('\n');
    const wrappedLines = lines.map(line => `<span class="line">${line || '\n'}</span>`).join('\n');
    
    return wrappedLines;
  } catch (error) {
    console.error('[CodeMirror Static] Highlighting failed:', error);
    return null;
  }
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(language: string): boolean {
  const normalizedLang = language.toLowerCase().trim();
  return normalizedLang in languageRegistry;
}

/**
 * Get list of supported languages
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(languageRegistry).sort();
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

