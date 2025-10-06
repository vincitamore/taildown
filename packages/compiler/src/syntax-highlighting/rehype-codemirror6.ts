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
 * Highlight a single line of Taildown code using regex patterns
 */
function highlightLine(line: string): string {
  if (!line.trim()) {
    return escapeHtml(line);
  }

  let result = line;
  const tokens: Array<{ start: number; end: number; type: string }> = [];

  // Component blocks - :::component {attributes}
  const componentMatch = result.match(/^(:::)([a-z][a-z0-9-]*)(\s*)(\{[^}]*\})?/);
  if (componentMatch && componentMatch[2]) {
    let pos = 0;
    tokens.push({ start: pos, end: pos + 3, type: 'punctuation' }); // :::
    pos += 3;
    tokens.push({ start: pos, end: pos + componentMatch[2].length, type: 'tagName' }); // component name
    pos += componentMatch[2].length;
    if (componentMatch[4] && componentMatch[3]) { // attributes
      pos += componentMatch[3].length; // whitespace
      tokens.push({ start: pos, end: pos + componentMatch[4].length, type: 'attributes' });
    }
  }
  // Component closing
  else if (result.match(/^:::$/)) {
    tokens.push({ start: 0, end: 3, type: 'punctuation' });
  }
  // For all other lines, process various patterns
  else {
    // Process icons FIRST (highest priority for inline elements)
    const iconRegex = /:icon\[([a-z][a-z0-9-]*)\](\{[^}]*\})?/g;
    let iconMatch: RegExpExecArray | null;
    while ((iconMatch = iconRegex.exec(result)) !== null) {
      const start = iconMatch.index;
      const iconName = iconMatch[1];
      if (iconName) {
        tokens.push({ start, end: start + 5, type: 'keyword' }); // :icon
        tokens.push({ start: start + 5, end: start + 6, type: 'punctuation' }); // [
        tokens.push({ start: start + 6, end: start + 6 + iconName.length, type: 'function' }); // name
        tokens.push({ start: start + 6 + iconName.length, end: start + 7 + iconName.length, type: 'punctuation' }); // ]
        if (iconMatch[2]) {
          tokens.push({ start: start + 7 + iconName.length, end: start + 7 + iconName.length + iconMatch[2].length, type: 'attributes' });
        }
      }
    }

    // Process standalone attribute blocks (not part of icons or components)
    const attrRegex = /\{([^}]*)\}/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(result)) !== null) {
      // Skip if already processed as part of icon or component
      const isAlreadyProcessed = tokens.some(token => 
        token.type === 'attributes' && 
        attrMatch!.index >= token.start && 
        attrMatch!.index < token.end
      );
      if (!isAlreadyProcessed) {
        tokens.push({ start: attrMatch.index, end: attrMatch.index + attrMatch[0].length, type: 'attributes' });
      }
    }

    // Headings with full markdown support - but don't capture the full text
    const headingMatch = result.match(/^(#{1,6})\s/);
    if (headingMatch && headingMatch[1]) {
      tokens.push({ start: 0, end: headingMatch[0].length, type: 'heading-marker' });
    }

    // Code blocks (fenced)
    const codeBlockMatch = result.match(/^(```|~~~)(\w+)?/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      tokens.push({ start: 0, end: codeBlockMatch[1].length, type: 'code-fence' });
      if (codeBlockMatch[2]) {
        tokens.push({ start: codeBlockMatch[1].length, end: codeBlockMatch[0].length, type: 'code-language' });
      }
    }

    // Horizontal rules
    const hrMatch = result.match(/^(\s*)(---+|===+|\*\*\*+)(\s*)$/);
    if (hrMatch) {
      tokens.push({ start: 0, end: result.length, type: 'horizontal-rule' });
    }

    // Tables
    const tableMatch = result.match(/^\s*\|/);
    if (tableMatch) {
      const pipeRegex = /\|/g;
      let pipeMatch: RegExpExecArray | null;
      while ((pipeMatch = pipeRegex.exec(result)) !== null) {
        tokens.push({ start: pipeMatch.index, end: pipeMatch.index + 1, type: 'table-delimiter' });
      }
    }

    // Strong text (bold)
    const strongRegex = /\*\*([^*]+?)\*\*/g;
    let strongMatch: RegExpExecArray | null;
    while ((strongMatch = strongRegex.exec(result)) !== null) {
      tokens.push({ start: strongMatch.index, end: strongMatch.index + 2, type: 'strong-marker' });
      tokens.push({ start: strongMatch.index + 2, end: strongMatch.index + strongMatch[0].length - 2, type: 'strong-text' });
      tokens.push({ start: strongMatch.index + strongMatch[0].length - 2, end: strongMatch.index + strongMatch[0].length, type: 'strong-marker' });
    }

    // Emphasis (italic)
    const emphasisRegex = /(?<!\*)\*([^*]+?)\*(?!\*)/g;
    let emphasisMatch: RegExpExecArray | null;
    while ((emphasisMatch = emphasisRegex.exec(result)) !== null) {
      // Skip if part of strong text
      const isPartOfStrong = tokens.some(token => 
        (token.type === 'strong-marker' || token.type === 'strong-text') && 
        emphasisMatch!.index >= token.start && 
        emphasisMatch!.index < token.end
      );
      if (!isPartOfStrong) {
        tokens.push({ start: emphasisMatch.index, end: emphasisMatch.index + 1, type: 'emphasis-marker' });
        tokens.push({ start: emphasisMatch.index + 1, end: emphasisMatch.index + emphasisMatch[0].length - 1, type: 'emphasis-text' });
        tokens.push({ start: emphasisMatch.index + emphasisMatch[0].length - 1, end: emphasisMatch.index + emphasisMatch[0].length, type: 'emphasis-marker' });
      }
    }

    // Strikethrough
    const strikeRegex = /~~([^~]+?)~~/g;
    let strikeMatch: RegExpExecArray | null;
    while ((strikeMatch = strikeRegex.exec(result)) !== null) {
      tokens.push({ start: strikeMatch.index, end: strikeMatch.index + 2, type: 'strike-marker' });
      tokens.push({ start: strikeMatch.index + 2, end: strikeMatch.index + strikeMatch[0].length - 2, type: 'strike-text' });
      tokens.push({ start: strikeMatch.index + strikeMatch[0].length - 2, end: strikeMatch.index + strikeMatch[0].length, type: 'strike-marker' });
    }

    // Inline code
    const codeRegex = /`([^`]+?)`/g;
    let codeMatch: RegExpExecArray | null;
    while ((codeMatch = codeRegex.exec(result)) !== null) {
      tokens.push({ start: codeMatch.index, end: codeMatch.index + 1, type: 'code-marker' });
      tokens.push({ start: codeMatch.index + 1, end: codeMatch.index + codeMatch[0].length - 1, type: 'code-text' });
      tokens.push({ start: codeMatch.index + codeMatch[0].length - 1, end: codeMatch.index + codeMatch[0].length, type: 'code-marker' });
    }

    // Links with detailed parsing - handle full link including attributes
    const linkWithAttrsRegex = /\[([^\]]+?)\]\(([^)]+?)\)(\{[^}]*\})?/g;
    let linkMatch: RegExpExecArray | null;
    while ((linkMatch = linkWithAttrsRegex.exec(result)) !== null) {
      const linkText = linkMatch[1] || '';
      const linkUrl = linkMatch[2] || '';
      const linkAttrs = linkMatch[3] || '';
      
      tokens.push({ start: linkMatch.index, end: linkMatch.index + 1, type: 'link-bracket' }); // [
      tokens.push({ start: linkMatch.index + 1, end: linkMatch.index + 1 + linkText.length, type: 'link-text' });
      tokens.push({ start: linkMatch.index + 1 + linkText.length, end: linkMatch.index + 1 + linkText.length + 2, type: 'link-bracket' }); // ](
      tokens.push({ start: linkMatch.index + 1 + linkText.length + 2, end: linkMatch.index + 1 + linkText.length + 2 + linkUrl.length, type: 'link-url' });
      tokens.push({ start: linkMatch.index + 1 + linkText.length + 2 + linkUrl.length, end: linkMatch.index + 1 + linkText.length + 2 + linkUrl.length + 1, type: 'link-bracket' }); // )
      
      if (linkAttrs) {
        tokens.push({ start: linkMatch.index + linkMatch[0].length - linkAttrs.length, end: linkMatch.index + linkMatch[0].length, type: 'attributes' });
      }
    }

    // Images
    const imageRegex = /!\[([^\]]*?)\]\(([^)]+?)\)/g;
    let imageMatch: RegExpExecArray | null;
    while ((imageMatch = imageRegex.exec(result)) !== null) {
      const altText = imageMatch[1] || '';
      const imageUrl = imageMatch[2] || '';
      
      tokens.push({ start: imageMatch.index, end: imageMatch.index + 2, type: 'image-marker' }); // ![
      tokens.push({ start: imageMatch.index + 2, end: imageMatch.index + 2 + altText.length, type: 'image-alt' });
      tokens.push({ start: imageMatch.index + 2 + altText.length, end: imageMatch.index + 2 + altText.length + 2, type: 'image-marker' }); // ](
      tokens.push({ start: imageMatch.index + 2 + altText.length + 2, end: imageMatch.index + 2 + altText.length + 2 + imageUrl.length, type: 'image-url' });
      tokens.push({ start: imageMatch.index + imageMatch[0].length - 1, end: imageMatch.index + imageMatch[0].length, type: 'image-marker' }); // )
    }

    // List markers with better detection
    const unorderedListMatch = result.match(/^(\s*)([-*+])\s/);
    if (unorderedListMatch && unorderedListMatch[1] && unorderedListMatch[2]) {
      const start = unorderedListMatch[1].length;
      tokens.push({ start, end: start + unorderedListMatch[2].length, type: 'list-marker' });
    }

    const orderedListMatch = result.match(/^(\s*)(\d+\.)\s/);
    if (orderedListMatch && orderedListMatch[1] && orderedListMatch[2]) {
      const start = orderedListMatch[1].length;
      tokens.push({ start, end: start + orderedListMatch[2].length, type: 'list-marker' });
    }

    // Task list items
    const taskListMatch = result.match(/^(\s*)([-*+])\s+(\[[ xX]\])\s/);
    if (taskListMatch && taskListMatch[1] && taskListMatch[2] && taskListMatch[3]) {
      const start = taskListMatch[1].length;
      tokens.push({ start, end: start + taskListMatch[2].length, type: 'list-marker' });
      const checkboxStart = start + taskListMatch[2].length + 1; // +1 for space
      tokens.push({ start: checkboxStart, end: checkboxStart + taskListMatch[3].length, type: 'task-checkbox' });
    }

    // Blockquotes with nested support
    const quoteMatch = result.match(/^(>\s*)+/);
    if (quoteMatch) {
      tokens.push({ start: 0, end: quoteMatch[0].length, type: 'quote-marker' });
    }

    // Escape sequences
    const escapeRegex = /\\([\\`*_{}[\]()#+\-.!])/g;
    let escapeMatch: RegExpExecArray | null;
    while ((escapeMatch = escapeRegex.exec(result)) !== null) {
      tokens.push({ start: escapeMatch.index, end: escapeMatch.index + escapeMatch[0].length, type: 'escape-sequence' });
    }
  }

  // Sort tokens by start position and remove overlaps
  tokens.sort((a, b) => a.start - b.start);
  
  // Remove overlapping tokens (keep first one)
  const cleanTokens: Array<{ start: number; end: number; type: string }> = [];
  for (const token of tokens) {
    const hasOverlap = cleanTokens.some(existing => 
      (token.start >= existing.start && token.start < existing.end) ||
      (token.end > existing.start && token.end <= existing.end) ||
      (token.start <= existing.start && token.end >= existing.end)
    );
    if (!hasOverlap) {
      cleanTokens.push(token);
    }
  }

  // Build highlighted HTML
  let html = '';
  let lastEnd = 0;

  for (const token of cleanTokens) {
    // Add unhighlighted text before token
    if (token.start > lastEnd) {
      html += escapeHtml(result.slice(lastEnd, token.start));
    }

    // Add highlighted token
    const tokenText = result.slice(token.start, token.end);
    if (token.type === 'attributes') {
      html += highlightAttributes(tokenText);
    } else {
      const className = getTokenClassName(token.type);
      html += className 
        ? `<span class="${className}">${escapeHtml(tokenText)}</span>`
        : escapeHtml(tokenText);
    }

    lastEnd = token.end;
  }

  // Add remaining unhighlighted text
  if (lastEnd < result.length) {
    html += escapeHtml(result.slice(lastEnd));
  }

  return html;
}

/**
 * Highlight content inside attribute blocks
 */
function highlightAttributes(attrBlock: string): string {
  const content = attrBlock.slice(1, -1); // Remove { }
  if (!content.trim()) {
    return `<span class="token punctuation">{</span><span class="token punctuation">}</span>`;
  }

  let html = '<span class="token punctuation">{</span>';
  
  // Split by whitespace but preserve the original spacing
  const parts = content.split(/(\s+)/);
  
  for (const part of parts) {
    if (!part.trim()) {
      html += part; // Preserve whitespace
      continue;
    }

    // CSS classes
    if (part.startsWith('.')) {
      html += `<span class="token class-name">${escapeHtml(part)}</span>`;
    }
    // Key-value pairs
    else if (part.includes('=')) {
      const [key, ...valueParts] = part.split('=');
      const value = valueParts.join('=');
      html += `<span class="token attr-name">${escapeHtml(key || '')}</span>=<span class="token string">${escapeHtml(value || '')}</span>`;
    }
    // Component variants
    else if (/^(primary|secondary|accent|success|warning|error|info|muted|ghost|link|destructive)$/.test(part)) {
      html += `<span class="token class-name">${escapeHtml(part)}</span>`;
    }
    // Size keywords
    else if (/^(xs|tiny|small|sm|md|base|large|lg|xl|2xl|3xl|huge|massive)$/.test(part)) {
      html += `<span class="token number">${escapeHtml(part)}</span>`;
    }
    // Typography keywords (comprehensive list including compound variants)
    else if (/^(bold|italic|thin|light|medium|semibold|extra-bold|black|uppercase|lowercase|capitalize|underline|strike|huge-bold|large-bold|xl-bold|massive-bold|bold-primary|large-muted|small-light|xl-muted|huge-muted|tight-lines|normal-lines|relaxed-lines|loose-lines|massive|huge|xl|2xl|3xl)$/.test(part)) {
      html += `<span class="token emphasis">${escapeHtml(part)}</span>`;
    }
    // Animation and interaction keywords (comprehensive list)
    else if (/^(fade-in|slide-up|slide-down|slide-left|slide-right|zoom-in|scale-in|hover-lift|hover-glow|hover-scale|hover-grow|interactive|fast|smooth|slow)$/.test(part)) {
      html += `<span class="token function">${escapeHtml(part)}</span>`;
    }
    // Layout keywords (comprehensive list)
    else if (/^(center|left|right|justify|flex|grid|inline|block|padded|padded-sm|padded-lg|padded-xl|gap|gap-sm|gap-lg|gap-xl|center-x|center-y|center-both|flex-center|grid-2|grid-3|grid-4)$/.test(part)) {
      html += `<span class="token property">${escapeHtml(part)}</span>`;
    }
    // Decoration keywords (comprehensive list with all glass variants)
    else if (/^(rounded|rounded-sm|rounded-lg|rounded-full|shadow|shadow-sm|shadow-lg|shadow-xl|elevated|floating|glass|subtle-glass|light-glass|heavy-glass|outlined|bordered)$/.test(part)) {
      html += `<span class="token attr-name">${escapeHtml(part)}</span>`;
    }
    // Component keywords
    else if (/^(button|badge|alert|modal|tooltip|elevated|floating|outlined|interactive)$/.test(part)) {
      html += `<span class="token keyword">${escapeHtml(part)}</span>`;
    }
    // Default
    else {
      html += escapeHtml(part);
    }
  }
  
  html += '<span class="token punctuation">}</span>';
  return html;
}

/**
 * Map token types to CSS class names
 */
function getTokenClassName(tokenType: string): string | null {
  const classMap: Record<string, string> = {
    // Taildown-specific tokens
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
    
    // Markdown heading tokens
    'heading-marker': 'token title punctuation',
    'heading-text': 'token title',
    
    // Markdown code tokens
    'code-fence': 'token punctuation',
    'code-language': 'token language-tag',
    'code-marker': 'token punctuation',
    'code-text': 'token code',
    
    // Markdown text formatting tokens
    'strong-marker': 'token punctuation',
    'strong-text': 'token bold',
    'emphasis-marker': 'token punctuation',
    'emphasis-text': 'token italic',
    'strike-marker': 'token punctuation',
    'strike-text': 'token deleted',
    
    // Markdown link tokens
    'link-bracket': 'token punctuation',
    'link-text': 'token string',
    'link-url': 'token url',
    
    // Markdown image tokens
    'image-marker': 'token punctuation',
    'image-alt': 'token string',
    'image-url': 'token url',
    
    // Markdown list tokens
    'list-marker': 'token punctuation',
    'task-checkbox': 'token boolean',
    
    // Markdown structure tokens
    'quote-marker': 'token punctuation',
    'table-delimiter': 'token punctuation',
    'horizontal-rule': 'token hr',
    'escape-sequence': 'token escape',
    
    // Legacy tokens for backward compatibility
    'heading': 'token title',
    'strong': 'token bold',
    'monospace': 'token code',
    'linkText': 'token string',
    'url': 'token url',
    'list': 'token punctuation',
    'quote': 'token punctuation',
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