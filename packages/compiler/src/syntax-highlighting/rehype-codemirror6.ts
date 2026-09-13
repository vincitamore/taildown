/**
 * Rehype plugin for syntax highlighting
 * 
 * Uses the editor tokenizer for Taildown and the configured highlighter for other languages.
 * This hybrid approach provides:
 * - Custom Taildown highlighting optimized for our syntax
 * - Zero runtime JavaScript (all highlighting at compile time)
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Element } from 'hast';
import { highlightWithShiki } from './shiki-highlighter.js';
import {highlightTree, tagHighlighter, tags as t} from '@lezer/highlight';
import {taildownLanguage} from './codemirror6-language';
import {taildownDarkHighlightStyle} from './taildown-highlight-style';

/**
 * Interface for highlighting a code block
 */
interface HighlightResult {
  html: string;
  classes: string[];
}

/**
 * Highlight code using Taildown (CodeMirror) or Shiki
 * 
 * Strategy:
 * 1. Taildown files → Use custom CodeMirror-based highlighting
 * 2. Other languages → Use Shiki (VS Code quality)
 * 3. Fallback → Plain escaped HTML
 */
async function highlightCode(code: string, language: string): Promise<HighlightResult> {
  if (['taildown', 'td', 'tdown'].includes(language.trim().toLowerCase())) {
    return {html: highlightTaildown(code), classes: ['code-highlight', 'language-taildown']};
  }

  // Try Shiki for all other languages
  if (language) {
    const shikiHtml = await highlightWithShiki(code, language, 'dark-plus');
    
    if (shikiHtml) {
      // Shiki returns a complete <pre><code> structure, extract just the inner HTML
      const codeMatch = shikiHtml.match(/<code[^>]*>([\s\S]*)<\/code>/);
      const innerHtml: string = (codeMatch && codeMatch[1]) ? codeMatch[1] : shikiHtml;
      
      return {
        html: innerHtml,
        classes: ['code-highlight', `language-${language}`, 'shiki'],
      };
    }
  }
  
  // Fallback to plain escaped HTML if Shiki doesn't support the language
  return {
    html: escapeHtml(code),
    classes: ['code-highlight', language ? `language-${language}` : ''],
  };
}

// Stable semantic classes keep exported examples inspectable; their colors come
// from the same canonical dark theme as the editor, rather than a second palette.
const semanticHighlighter = tagHighlighter([
  {tag: t.tagName, class: 'tag'}, {tag: t.keyword, class: 'keyword'},
  {tag: t.function(t.name), class: 'function'}, {tag: t.function(t.keyword), class: 'function'},
  {tag: t.typeName, class: 'type-name'}, {tag: t.className, class: 'class-name'}, {tag: t.attributeName, class: 'attr-name'},
  {tag: t.propertyName, class: 'property'}, {tag: t.string, class: 'string'},
  {tag: t.number, class: 'number'}, {tag: t.bool, class: 'boolean'},
  {tag: t.color, class: 'color'}, {tag: t.operator, class: 'operator'},
  {tag: t.punctuation, class: 'punctuation'}, {tag: t.meta, class: 'meta'},
  {tag: t.heading, class: 'title'}, {tag: t.strong, class: 'bold'},
  {tag: t.emphasis, class: 'italic'}, {tag: t.strikethrough, class: 'deleted'},
  {tag: t.inserted, class: 'inserted'}, {tag: t.monospace, class: 'code'},
  {tag: t.link, class: 'url'}, {tag: t.list, class: 'punctuation'},
  {tag: t.quote, class: 'quote'}, {tag: t.contentSeparator, class: 'hr'},
  {tag: t.escape, class: 'escape'}, {tag: t.comment, class: 'comment'},
]);
const paletteHighlighter = tagHighlighter(taildownDarkHighlightStyle.map((rule, index) => ({tag: rule.tag, class: `palette-${index}`})));
const paletteStyles = taildownDarkHighlightStyle.map(rule => {
  const properties = [
    ['color', rule.color], ['background-color', rule.backgroundColor],
    ['font-weight', rule.fontWeight], ['font-style', rule.fontStyle],
    ['text-decoration', rule.textDecoration],
  ];
  return properties.filter(([, value]) => typeof value === 'string' || typeof value === 'number')
    .map(([property, value]) => `${property}:${String(value)}`).join(';');
});

function highlightTaildown(code: string): string {
  // HTML normalizes CRLF to LF. Normalize before spans split the pair, or a
  // token ending in CR becomes an extra line break beside the emitted LF.
  code = code.replace(/\r\n?/g, '\n');
  let html = '<span class="code-line">';
  let position = 0;
  const append = (text: string, classes = '', style = '') => {
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      if (index > 0) html += '\n</span><span class="code-line">';
      const escaped = escapeHtml(line);
      if (line) html += classes || style
        ? `<span class="token ${escapeHtml(classes)}"${style ? ` style="${escapeHtml(style)}"` : ''}>${escaped}</span>`
        : escaped;
    });
  };
  highlightTree(taildownLanguage.parser.parse(code), {
    style(tags) {
      return [semanticHighlighter.style(tags), paletteHighlighter.style(tags)].filter(Boolean).join(' ') || null;
    },
  }, (from, to, classes) => {
    append(code.slice(position, from));
    const names = classes.split(' ');
    const style = names.filter(name => name.startsWith('palette-'))
      .map(name => paletteStyles[Number(name.slice(8))] ?? '').filter(Boolean).join(';');
    append(code.slice(from, to), names.filter(name => !name.startsWith('palette-')).join(' '), style);
    position = to;
  });
  append(code.slice(position));
  return html + '</span>';
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
 * Rehype plugin for syntax highlighting
 * Supports both synchronous (Taildown) and asynchronous (Shiki) highlighting
 */
export const rehypeCodeMirror6: Plugin<[], Root> = () => {
  return async (tree) => {
    // Collect all code nodes that need highlighting
    const codeNodesToHighlight: Array<{
      node: Element;
      language: string;
      code: string;
      classes: string[];
    }> = [];
    
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'code' && node.properties?.className) {
        const classes = Array.isArray(node.properties.className) 
          ? node.properties.className.filter((value): value is string => typeof value === 'string') 
          : typeof node.properties.className === 'string' ? node.properties.className.split(/\s+/) : [];
        
        // Find language class
        const languageClass = classes.find((cls: string) => cls.startsWith('language-'));
        if (languageClass) {
          const language = languageClass.replace('language-', '');
          
          // Get text content
          const textNode = node.children.find((child) => child.type === 'text');
          if (textNode && 'value' in textNode) {
            const code = textNode.value;
            codeNodesToHighlight.push({ node, language, code, classes });
          }
        }
      }
    });
    
    // Highlight all code blocks (potentially in parallel for performance)
    await Promise.all(
      codeNodesToHighlight.map(async ({ node, language, code, classes }) => {
        const result = await highlightCode(code, language);
        
        // Replace content with highlighted HTML
        node.children = [{
          type: 'raw',
          value: result.html,
        }];
        
        // Add highlighting classes
        if (node.properties) {
          node.properties.className = [...classes, ...result.classes];
        }
      })
    );
  };
};
