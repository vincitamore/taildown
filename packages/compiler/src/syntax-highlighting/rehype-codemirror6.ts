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
    highlightedLines.push(`<span class="code-line">${highlightedLine}\n</span>`);
  }

  return {
    html: highlightedLines.join(''),
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
    if (componentMatch[4]) { // attributes (whitespace is optional)
      if (componentMatch[3]) {
        pos += componentMatch[3].length; // whitespace if present
      }
      tokens.push({ start: pos, end: pos + componentMatch[4].length, type: 'attributes' });
    }
  }
  // Component closing - matches ::: at start of line (may have trailing whitespace)
  else if (result.match(/^:::\s*$/)) {
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

    // Link structural punctuation - simpler approach that works with nested brackets
    // Match the distinctive "](" pattern that marks link middle
    const linkMiddleRegex = /\]\(/g;
    let linkMiddleMatch: RegExpExecArray | null;
    while ((linkMiddleMatch = linkMiddleRegex.exec(result)) !== null) {
      tokens.push({ start: linkMiddleMatch.index, end: linkMiddleMatch.index + 2, type: 'link-bracket' }); // ](
      
      // Look backwards for the opening [
      let openBracketPos = linkMiddleMatch.index - 1;
      let bracketDepth = 0;
      while (openBracketPos >= 0) {
        if (result[openBracketPos] === ']') {
          bracketDepth++;
        } else if (result[openBracketPos] === '[') {
          if (bracketDepth === 0) {
            tokens.push({ start: openBracketPos, end: openBracketPos + 1, type: 'link-bracket' }); // [
            break;
          }
          bracketDepth--;
        }
        openBracketPos--;
      }
      
      // Look forwards for the closing )
      let closeParenPos = linkMiddleMatch.index + 2;
      let parenDepth = 0;
      while (closeParenPos < result.length) {
        if (result[closeParenPos] === '(') {
          parenDepth++;
        } else if (result[closeParenPos] === ')') {
          if (parenDepth === 0) {
            tokens.push({ start: closeParenPos, end: closeParenPos + 1, type: 'link-bracket' }); // )
            break;
          }
          parenDepth--;
        }
        closeParenPos++;
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
  let pos = 0;
  
  // Parse tokens: key="value" pairs, CSS classes, or keywords
  while (pos < content.length) {
    // Skip whitespace
    const wsMatch = content.slice(pos).match(/^\s+/);
    if (wsMatch) {
      html += wsMatch[0];
      pos += wsMatch[0].length;
      continue;
    }
    
    // Try to match key="value" or key='value'
    const kvMatch = content.slice(pos).match(/^([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*["']([^"']*)["']/);
    if (kvMatch && kvMatch[1] && kvMatch[2] !== undefined) {
      html += `<span class="token attr-name">${escapeHtml(kvMatch[1])}</span>=<span class="token string">&quot;${escapeHtml(kvMatch[2])}&quot;</span>`;
      pos += kvMatch[0].length;
      continue;
    }
    
    // Try to match a word token
    const wordMatch = content.slice(pos).match(/^(\S+)/);
    if (wordMatch && wordMatch[1]) {
      const word = wordMatch[1];
      
      // CSS classes
      if (word.startsWith('.')) {
        html += `<span class="token class-name">${escapeHtml(word)}</span>`;
      }
      // Component variants
      else if (/^(primary|secondary|accent|success|warning|error|info|muted|ghost|link|destructive)$/.test(word)) {
        html += `<span class="token class-name">${escapeHtml(word)}</span>`;
      }
      // Size keywords
      else if (/^(xs|tiny|small|sm|md|base|large|lg|xl|2xl|3xl|huge|massive)$/.test(word)) {
        html += `<span class="token number">${escapeHtml(word)}</span>`;
      }
      // Typography keywords
      else if (/^(bold|italic|thin|light|medium|semibold|extra-bold|black|uppercase|lowercase|capitalize|underline|strike|huge-bold|large-bold|xl-bold|massive-bold|bold-primary|large-muted|small-light|xl-muted|huge-muted|tight-lines|normal-lines|relaxed-lines|loose-lines|massive|huge|xl|2xl|3xl)$/.test(word)) {
        html += `<span class="token emphasis">${escapeHtml(word)}</span>`;
      }
      // Animation and interaction keywords
      else if (/^(fade-in|slide-up|slide-down|slide-left|slide-right|zoom-in|scale-in|hover-lift|hover-glow|hover-scale|hover-grow|interactive|fast|smooth|slow|auto-play)$/.test(word)) {
        html += `<span class="token function">${escapeHtml(word)}</span>`;
      }
      // Layout keywords
      else if (/^(center|left|right|justify|flex|grid|inline|block|padded|padded-sm|padded-lg|padded-xl|gap|gap-sm|gap-lg|gap-xl|center-x|center-y|center-both|flex-center|grid-2|grid-3|grid-4)$/.test(word)) {
        html += `<span class="token property">${escapeHtml(word)}</span>`;
      }
      // Decoration keywords
      else if (/^(rounded|rounded-sm|rounded-lg|rounded-full|shadow|shadow-sm|shadow-lg|shadow-xl|elevated|floating|glass|subtle-glass|light-glass|heavy-glass|outlined|bordered)$/.test(word)) {
        html += `<span class="token attr-name">${escapeHtml(word)}</span>`;
      }
      // Component keywords
      else if (/^(button|badge|alert|modal|tooltip|elevated|floating|outlined|interactive)$/.test(word)) {
        html += `<span class="token keyword">${escapeHtml(word)}</span>`;
      }
      // Default - leave unhighlighted
      else {
        html += escapeHtml(word);
      }
      
      pos += word.length;
      continue;
    }
    
    // Fallback - shouldn't happen but just in case
    const char = content[pos];
    if (char !== undefined) {
      html += escapeHtml(char);
    }
    pos++;
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
