import { decodeString } from 'micromark-util-decode-string';
import { textSlicePosition } from './text-position';
/**
 * Directive Scanner - Phase 1 of Custom Directive Parser
 * Scans MDAST for ::: markers and builds flat list
 * See CUSTOM-DIRECTIVE-PARSER-PLAN.md for algorithm details
 */

import type { Content, Paragraph } from 'mdast';
import type { ComponentMarker, ScanItem } from './directive-types';
import { COMPONENT_NAME_REGEX, CLASS_NAME_REGEX } from '@taildown/shared';

/**
 * Regular expression to match component fence markers
 * See SYNTAX.md §3.2.1 - Fence Markers
 * See SYNTAX.md §3.2.3 - Attributes on Components
 * 
 * Pattern: :::component-name {.class1 .class2} or :::component-name{id="value"}
 * - Must start at beginning of line
 * - Three colons followed by optional name and attributes
 * - Horizontal whitespace before the attribute block is optional
 * - Attributes can be classes (.class) or key-value pairs (key="value")
 */
const FENCE_OPEN_REGEX = /^:::([a-z][a-z0-9-]*)(?:[\t ]*\{([^}]*)\})?$/;
const FENCE_CLOSE_REGEX = /^:::$/;

/**
 * Extract markers and content from a paragraph that may contain fences
 * remark-parse combines consecutive non-blank lines into one paragraph,
 * so we need to split fence markers from regular content.
 * 
 * Returns an interleaved array of markers and content in document order
 */
function extractMarkersFromParagraph(node: Paragraph, source?: string, sourceIndex?: {lines: string[]; offsets: number[]}): Array<{
  type: 'marker' | 'content';
  marker?: ComponentMarker;
  contentNode?: Paragraph;
}> {
  if (!node.position) return [];
  const items: ReturnType<typeof extractMarkersFromParagraph> = [];
  let children: Paragraph['children'] = [];
  let foundMarker = false;
  const sourceLines = sourceIndex?.lines;
  const offsets = sourceIndex?.offsets ?? [];
  const flush = () => {
    // Newlines bordering a block fence separate blocks, not inline content.
    const first = children[0];
    const last = children[children.length - 1];
    if (first?.type === 'text') {
      const trimmed = first.value.replace(/^\r?\n/, '');
      first.position = textSlicePosition(first, first.value.length - trimmed.length, first.value.length, source);
      first.value = trimmed;
    }
    if (last?.type === 'text') {
      const trimmed = last.value.replace(/\r?\n$/, '');
      last.position = textSlicePosition(last, 0, trimmed.length, source);
      last.value = trimmed;
    }
    children = children.filter(child => child.type !== 'text' || child.value.length > 0);
    for (const child of children) if (child.type === 'text') child.value = child.value.replace(/\r\n/g, '\n');
    if (children.some(child => child.type !== 'text' || child.value.trim())) {
      items.push({type: 'content', contentNode: {
        type: 'paragraph', children,
        position: {start: children[0]?.position?.start ?? node.position!.start, end: children[children.length - 1]?.position?.end ?? node.position!.end},
      }});
    }
    children = [];
  };
  node.children.forEach((child, childIndex) => {
    if (child.type !== 'text' || !child.position) {
      children.push(child.type === 'text' ? {...child} : child);
      return;
    }
    const lines = child.value.split('\n');
    const starts: number[] = [];
    let cursor = 0;
    for (const line of lines) { starts.push(cursor); cursor += line.length + 1; }
    let content = '';
    let startIndex = 0;

    const flushText = () => {
      if (content) {
        const position = textSlicePosition(child, starts[startIndex]!, starts[startIndex]! + content.length, source);
        if (position && sourceLines) {
          for (const point of [position.start, position.end]) {
            const offset = offsets[point.line - 1];
            if (offset !== undefined) point.offset = offset + point.column - 1;
          }
        }
        children.push({...child, value: content, position});
      }
      content = '';
    };
    lines.forEach((line, index) => {
      const mappedStart = textSlicePosition(child, starts[index]!, starts[index]!, source)?.start;
      const lineNumber = mappedStart?.line ?? child.position!.start.line + index;
      const previous = node.children[childIndex - 1];
      const next = node.children[childIndex + 1];
      const sharedLine = (index === 0 && previous?.position?.end.line === lineNumber && previous.position.end.column > 1)
        || (index === lines.length - 1 && next?.position?.start.line === lineNumber);
      const rawLine = sourceLines?.[lineNumber - 1]?.slice((mappedStart?.column ?? 1) - 1);
      const literalFence = rawLine === undefined || (rawLine.trimStart().startsWith(':::') && decodeString(rawLine.trim()) === line.trim());
      const marker = sharedLine || !literalFence ? null : parseFenceLine(line.trim(), lineNumber);
      if (marker) {
        flushText();
        flush();
        foundMarker = true;
        items.push({type: 'marker', marker});
      } else {
        if (!content) startIndex = index;

        content += line + (index < lines.length - 1 ? '\n' : '');
      }
    });
    flushText();
  });
  flush();
  return foundMarker ? items : [{type: 'content', contentNode: {
    ...node,
    children: node.children.map(child => child.type === 'text' ? {...child, value: child.value.replace(/\r\n/g, '\n')} : child),
  }}];
}

function parseFenceLine(line: string, lineNumber: number): ComponentMarker | null {
  if (line === ':::') {
    return {
      type: 'close',
      position: {
        start: { line: lineNumber, column: 1, offset: 0 },
        end: { line: lineNumber, column: 4, offset: 0 },
      },
      lineNumber,
      originalText: line,
    };
  }
  
  const openMatch = line.match(FENCE_OPEN_REGEX);
  if (openMatch) {
    const name = openMatch[1];
    const attributesStr = openMatch[2];
    
    if (!name || !COMPONENT_NAME_REGEX.test(name)) {
      return null;
    }
    
    // Extract attributes - both key-value pairs and classes/variants
    const classes: string[] = [];
    const attributes: Record<string, string | null | undefined> = {};
    
    if (attributesStr) {
      const trimmed = attributesStr.trim();
      
      // First, extract all key="value" pairs
      const kvRegex = /(?:^|\s)([\w-]+)=(?:"([^"]*)"|'([^']*)')/g;
      let cleanedStr = trimmed;
      let match;
      
      while ((match = kvRegex.exec(trimmed)) !== null) {
        const key = match[1];
        const value = match[2] ?? match[3];
        if (key !== undefined) attributes[key] = value;
        // Remove this kv pair from the string
        cleanedStr = cleanedStr.replace(match[0], ' ');
      }
      
      // Then extract classes and variants from remaining tokens
      const tokens = cleanedStr.trim().split(/\s+/).filter(t => t.length > 0);
      
      for (const token of tokens) {
        if (CLASS_NAME_REGEX.test(token)) {
          // Direct CSS class (starts with .) - strip the dot and add as-is
          classes.push(token.substring(1));
        } else if (token && !token.includes('=')) {
          // Everything else (variants, sizes, plain English) - pass as raw token
          // Component parser will resolve these based on context
          classes.push(token);
        }
      }
    }
    
    return {
      type: 'open',
      name,
      classes: classes.length > 0 ? classes : undefined,
      attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      position: {
        start: { line: lineNumber, column: 1, offset: 0 },
        end: { line: lineNumber, column: line.length + 1, offset: 0 },
      },
      lineNumber,
      originalText: line,
    };
  }
  
  return null;
}

/**
 * Check if content should be scanned for markers
 * Skip code blocks and inline code per SYNTAX.md §3.5.4
 */
function shouldScanNode(node: Content): boolean {
  // Never scan inside code blocks - Edge Case 3.5.4
  if (node.type === 'code' || node.type === 'inlineCode') {
    return false;
  }
  
  // Don't scan inside HTML blocks
  if (node.type === 'html') {
    return false;
  }

  return true;
}

/**
 * Scan MDAST children for component fence markers
 * See CUSTOM-DIRECTIVE-PARSER-PLAN.md - Phase 1: Flatten and Mark
 * 
 * @param nodes - Array of MDAST content nodes
 * @returns Object containing markers and content in document order
 */
export function scanForMarkers(nodes: Content[], source?: string): {
  markers: ComponentMarker[];
  content: Content[];
  items: ScanItem[];
} {
  const markers: ComponentMarker[] = [];
  const content: Content[] = [];
  const items: ScanItem[] = [];
  // Index the source once per scan, rather than once per paragraph.
  const lines = source?.split('\n');
  const offsets: number[] = [];
  let offset = 0;
  for (const line of lines ?? []) { offsets.push(offset); offset += line.length + 1; }
  const sourceIndex = lines ? {lines, offsets} : undefined;

  for (const node of nodes) {
    // Skip nodes that shouldn't be scanned
    if (!shouldScanNode(node)) {
      content.push(node);
      if (node.position) {
        items.push({ type: 'content', node, position: node.position });
      }
      continue;
    }

    // Check if this paragraph contains fence markers
    if (node.type === 'paragraph') {
      const extractedItems = extractMarkersFromParagraph(node, source, sourceIndex);
      
      if (extractedItems.length > 0) {
        // Add markers and content in their original order (interleaved)
        for (const extracted of extractedItems) {
          if (extracted.type === 'marker' && extracted.marker) {
            markers.push(extracted.marker);
            items.push({ type: 'marker', marker: extracted.marker });
          } else if (extracted.type === 'content' && extracted.contentNode) {
            content.push(extracted.contentNode);
            items.push({ type: 'content', node: extracted.contentNode, position: node.position });
          }
        }
        continue;
      }
    }

    // Regular content node
    content.push(node);
    if (node.position) {
      items.push({ type: 'content', node, position: node.position });
    }
  }

  return { markers, content, items };
}

/**
 * Parse component name and attributes from a fence marker line
 * See SYNTAX.md §3.2.2 - Component Names and §3.2.3 - Attributes
 * 
 * @param text - The fence marker text (e.g., ":::card {.shadow-lg}")
 * @returns Parsed marker or null if invalid
 */
export function parseComponentMarker(text: string): Pick<ComponentMarker, 'type' | 'name' | 'classes' | 'originalText'> | null {
  const trimmed = text.trim();

  // Close marker
  if (FENCE_CLOSE_REGEX.test(trimmed)) {
    return {
      type: 'close',
      originalText: trimmed,
    };
  }

  // Open marker
  const match = trimmed.match(FENCE_OPEN_REGEX);
  if (match) {
    const name = match[1];
    const attributesStr = match[2];

    if (!name || !COMPONENT_NAME_REGEX.test(name)) {
      return null;
    }

    // Extract attributes as raw tokens for component system to resolve
    // The component parser will determine if they're variants, sizes, or plain English
    const classes: string[] = [];
    if (attributesStr) {
      const tokens = attributesStr.trim().split(/\s+/).filter(t => t.length > 0);
      
      for (const token of tokens) {
        if (CLASS_NAME_REGEX.test(token)) {
          // Direct CSS class (starts with .) - strip the dot and add as-is
          classes.push(token.substring(1));
        } else {
          // Everything else (variants, sizes, plain English) - pass as raw token
          // Component parser will resolve these based on context
          classes.push(token);
        }
      }
    }

    return {
      type: 'open',
      name,
      classes: classes.length > 0 ? classes : undefined,
      originalText: trimmed,
    };
  }

  return null;
}

/**
 * Validate a component name
 * See SYNTAX.md §3.2.2 - Component Names
 * 
 * Must match: [a-z][a-z0-9-]*
 * - Start with lowercase letter
 * - Contain only lowercase letters, digits, and hyphens
 * - Not start or end with hyphen
 * - Not contain consecutive hyphens
 */
export function isValidComponentName(name: string): boolean {
  if (!COMPONENT_NAME_REGEX.test(name)) {
    return false;
  }

  // Additional validation: no consecutive hyphens
  if (name.includes('--')) {
    return false;
  }

  // No leading or trailing hyphens
  if (name.startsWith('-') || name.endsWith('-')) {
    return false;
  }

  return true;
}

/**
 * Extract CSS classes from a fence attribute block
 * See SYNTAX.md §3.2.3 - Attributes on Components
 * 
 * @param attributeBlock - The content inside {} without the braces
 * @returns Array of class names (without the leading dot)
 */
export function extractFenceAttributes(attributeBlock: string): string[] {
  const classes: string[] = [];
  const tokens = attributeBlock.trim().split(/\s+/);

  for (const token of tokens) {
    if (CLASS_NAME_REGEX.test(token)) {
      classes.push(token.substring(1));
    }
  }

  return classes;
}
