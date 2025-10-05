/**
 * Directive Scanner - Phase 1 of Custom Directive Parser
 * Scans MDAST for ::: markers and builds flat list
 * See CUSTOM-DIRECTIVE-PARSER-PLAN.md for algorithm details
 */

import type { Content, Paragraph, Text, Root, Code } from 'mdast';
import type { ComponentMarker, ScanItem } from './directive-types';
import { COMPONENT_NAME_REGEX, CLASS_NAME_REGEX } from '@taildown/shared';

/**
 * Regular expression to match component fence markers
 * See SYNTAX.md §3.2.1 - Fence Markers
 * 
 * Pattern: :::component-name {.class1 .class2} or :::component-name{id="value"}
 * - Must start at beginning of line
 * - Three colons followed by optional name and attributes
 * - Attributes can be classes (.class) or key-value pairs (key="value")
 */
const FENCE_OPEN_REGEX = /^:::([a-z][a-z0-9-]*)(?:\{([^}]+)\})?$/;
const FENCE_CLOSE_REGEX = /^:::$/;

/**
 * Extract markers and content from a paragraph that may contain fences
 * remark-parse combines consecutive non-blank lines into one paragraph,
 * so we need to split fence markers from regular content.
 * 
 * Returns an interleaved array of markers and content in document order
 */
function extractMarkersFromParagraph(node: Paragraph): Array<{
  type: 'marker' | 'content';
  marker?: ComponentMarker;
  contentNode?: Paragraph;
}> {
  const items: Array<{
    type: 'marker' | 'content';
    marker?: ComponentMarker;
    contentNode?: Paragraph;
  }> = [];

  if (!node.position) {
    return items;
  }

  // Check if this paragraph contains fence markers
  // For simple paragraphs with single text node, process line by line
  if (node.children.length === 1 && node.children[0]?.type === 'text') {
    const textNode = node.children[0] as Text;
    const lines = textNode.value.split(/\r?\n/);
    
    // Check if the FIRST line is a fence (no blank line before it)
    const firstLine = lines[0]?.trim();
    if (firstLine && (firstLine === ':::' || FENCE_OPEN_REGEX.test(firstLine))) {
      // The paragraph STARTS with a fence - just return the markers, no content
      return processLinesForMarkers(lines, node.position.start.line);
    }
    
    return processLinesForMarkers(lines, node.position.start.line);
  }

  // For paragraphs with multiple children (formatted text), check for fences
  // This handles cases like:
  // - ** Alex Turner**, *Tech Lead*\n:::
  // - [LinkedIn](#)  [Dribbble](#)\n:::
  // - [Add to Cart](#){...}\n:::\n:::  (multiple fences)
  // - :::breadcrumb {boxed}\n[Home](#) > Components\n::: (opening and closing fences with links)
  
  // First, check if the FIRST text node contains an opening fence
  let hasOpeningFence = false;
  let firstTextIndex = -1;
  
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (child && child.type === 'text') {
      firstTextIndex = i;
      const textValue = (child as Text).value;
      const firstLine = textValue.split(/\r?\n/)[0]?.trim();
      if (firstLine && FENCE_OPEN_REGEX.test(firstLine)) {
        hasOpeningFence = true;
      }
      break; // Stop after first text node
    }
  }
  
  // Then check if ANY text node (starting from end) contains fence markers
  let foundFence = false;
  let fenceChildIndex = -1;
  
  for (let i = node.children.length - 1; i >= 0; i--) {
    const child = node.children[i];
    if (child && child.type === 'text') {
      const textValue = (child as Text).value;
      // Check if this text contains ANY fence markers
      if (textValue.includes(':::')) {
        foundFence = true;
        fenceChildIndex = i;
        break;
      }
    }
  }
  
  // Special case: Opening fence in first text node AND closing fence in last text node
  // This handles: :::component {attrs}\n[links and content]\n:::
  if (hasOpeningFence && foundFence && firstTextIndex === 0 && fenceChildIndex === node.children.length - 1) {
    // Extract opening fence from first text node
    const firstText = node.children[0] as Text;
    const firstLines = firstText.value.split(/\r?\n/);
    const openingLine = firstLines[0]?.trim();
    
    if (openingLine && FENCE_OPEN_REGEX.test(openingLine)) {
      // Extract closing fence from last text node
      const lastText = node.children[fenceChildIndex] as Text;
      const lastLines = lastText.value.split(/\r?\n/);
      const closingLine = lastLines[lastLines.length - 1]?.trim();
      
      if (closingLine && FENCE_CLOSE_REGEX.test(closingLine)) {
        // Parse opening marker
        const openMarker = parseFenceLine(openingLine, node.position.start.line);
        
        // Parse closing marker (need to calculate line number)
        const closingLineNumber = node.position.start.line + firstLines.length - 1 + (node.children.length > 2 ? 1 : 0) + lastLines.length - 1;
        const closeMarker = parseFenceLine(closingLine, closingLineNumber);
        
        if (openMarker && closeMarker) {
          // Build content from all children except the fence lines
          const contentChildren: (Text | any)[] = [];
          
          // Add remaining text from first node (after opening fence)
          if (firstLines.length > 1) {
            const remainingFirst = firstLines.slice(1).join('\n');
            if (remainingFirst.trim()) {
              contentChildren.push({ type: 'text', value: remainingFirst } as Text);
            }
          }
          
          // Add all middle children (links, etc.)
          for (let i = 1; i < fenceChildIndex; i++) {
            contentChildren.push(node.children[i]);
          }
          
          // Add text from last node (before closing fence)
          if (lastLines.length > 1) {
            const remainingLast = lastLines.slice(0, -1).join('\n');
            if (remainingLast.trim()) {
              contentChildren.push({ type: 'text', value: remainingLast } as Text);
            }
          }
          
          // Return opening marker, content paragraph, closing marker
          const result = [];
          result.push({ type: 'marker', marker: openMarker });
          
          if (contentChildren.length > 0) {
            result.push({
              type: 'content',
              contentNode: {
                type: 'paragraph',
                children: contentChildren,
              } as Paragraph,
            });
          }
          
          result.push({ type: 'marker', marker: closeMarker });
          return result;
        }
      }
    }
  }
  
  // Original logic: fences at the end only
  if (foundFence && fenceChildIndex >= 0) {
    const fenceChild = node.children[fenceChildIndex] as Text;
    const lines = fenceChild.value.split(/\r?\n/);
    
    // Process all lines to extract content and markers
    const result = processLinesForMarkers(lines, node.position.start.line);
    
    if (result.length > 0) {
      // We found markers - need to clean the paragraph
      const modifiedChildren = [...node.children];
      
      // Check if there's any content before the first marker
      const firstItem = result[0];
      if (firstItem && firstItem.type === 'content' && firstItem.contentNode) {
        // Replace the text node with the cleaned content
        const contentText = (firstItem.contentNode.children[0] as Text)?.value;
        if (contentText && contentText.trim()) {
          modifiedChildren[fenceChildIndex] = {
            ...fenceChild,
            value: contentText,
          } as Text;
          // Add the modified paragraph to items
          items.push({
            type: 'content',
            contentNode: {
              type: 'paragraph',
              children: modifiedChildren,
            } as Paragraph,
          });
          // Add remaining markers
          for (let i = 1; i < result.length; i++) {
            items.push(result[i]!);
          }
        } else {
          // No content, remove the text node
          modifiedChildren.splice(fenceChildIndex, 1);
          if (modifiedChildren.length > 0) {
            items.push({
              type: 'content',
              contentNode: {
                type: 'paragraph',
                children: modifiedChildren,
              } as Paragraph,
            });
          }
          // Add all markers
          items.push(...result.filter(r => r.type === 'marker'));
        }
      } else {
        // No content before markers - just remove the text node if it only has fences
        modifiedChildren.splice(fenceChildIndex, 1);
        if (modifiedChildren.length > 0) {
          items.push({
            type: 'content',
            contentNode: {
              type: 'paragraph',
              children: modifiedChildren,
            } as Paragraph,
          });
        }
        // Add all markers
        items.push(...result);
      }
      
      return items;
    }
  }

  return items;
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

function processLinesForMarkers(lines: string[], startLineNumber: number): Array<{
  type: 'marker' | 'content';
  marker?: ComponentMarker;
  contentNode?: Paragraph;
}> {
  const items: Array<{
    type: 'marker' | 'content';
    marker?: ComponentMarker;
    contentNode?: Paragraph;
  }> = [];

  // Process lines and create interleaved markers and content
  let lineNumber = startLineNumber;
  let accumulatedContent: string[] = [];

  const flushContent = () => {
    if (accumulatedContent.length > 0) {
      const contentText = accumulatedContent.join('\n').trim();
      if (contentText) {
        items.push({
          type: 'content',
          contentNode: {
            type: 'paragraph',
            children: [{ type: 'text', value: contentText }],
          },
        });
      }
      accumulatedContent = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for close fence :::
    if (FENCE_CLOSE_REGEX.test(trimmed)) {
      flushContent(); // Flush any accumulated content before the marker
      items.push({
        type: 'marker',
        marker: {
          type: 'close',
          position: {
            start: { line: lineNumber, column: 1, offset: 0 },
            end: { line: lineNumber, column: trimmed.length + 1, offset: 0 },
          },
          lineNumber,
          originalText: trimmed,
        },
      });
      lineNumber++;
      continue;
    }

    // Check for open fence :::component-name
    const openMatch = trimmed.match(FENCE_OPEN_REGEX);
    if (openMatch) {
      const name = openMatch[1];
      const attributesStr = openMatch[2];
      
      // Validate component name
      if (!name || !COMPONENT_NAME_REGEX.test(name)) {
        // Invalid fence, treat as content
        accumulatedContent.push(line);
        lineNumber++;
        continue;
      }

      // Extract attributes from the fence line
      // Supports: {.class1 variant1 id="value" key="value"}
      const classes: string[] = [];
      const attributes: Record<string, string | null | undefined> = {};
      
      if (attributesStr) {
        // Strategy: Parse character by character to handle key="value" pairs
        let i = 0;
        while (i < attributesStr.length) {
          // Skip whitespace
          while (i < attributesStr.length && /\s/.test(attributesStr[i]!)) {
            i++;
          }
          
          if (i >= attributesStr.length) break;
          
          // Check if this is a key-value pair (key="value" or key='value')
          const kvMatch = attributesStr.substring(i).match(/^(\w+)=["']([^"']*)["']/);
          if (kvMatch) {
            attributes[kvMatch[1]!] = kvMatch[2];
            i += kvMatch[0].length;
            continue;
          }
          
          // Otherwise, extract as a class/variant token
          const tokenMatch = attributesStr.substring(i).match(/^([^\s]+)/);
          if (tokenMatch) {
            const token = tokenMatch[1]!;
            if (CLASS_NAME_REGEX.test(token)) {
              // CSS class with dot - strip the dot
              classes.push(token.substring(1));
            } else {
              // Plain English / variant
              classes.push(token);
            }
            i += token.length;
          } else {
            i++;
          }
        }
      }

      flushContent(); // Flush any accumulated content before the marker
      
      items.push({
        type: 'marker',
        marker: {
          type: 'open',
          name,
          classes: classes.length > 0 ? classes : undefined,
          attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
          position: {
            start: { line: lineNumber, column: 1, offset: 0 },
            end: { line: lineNumber, column: trimmed.length + 1, offset: 0 },
          },
          lineNumber,
          originalText: trimmed,
        },
      });
      lineNumber++;
      continue;
    }

    // Regular content line
    accumulatedContent.push(line);
    lineNumber++;
  }

  // Flush any remaining content
  flushContent();

  return items;
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
export function scanForMarkers(nodes: Content[]): {
  markers: ComponentMarker[];
  content: Content[];
  items: ScanItem[];
} {
  const markers: ComponentMarker[] = [];
  const content: Content[] = [];
  const items: ScanItem[] = [];

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
      const extractedItems = extractMarkersFromParagraph(node);
      
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

    // Handle list nodes - recursively scan list items for fence markers
    // This handles cases like: "5. Item\n:::" where the fence is inside the list item
    if (node.type === 'list' && 'children' in node) {
      const listNode = node as any; // List type
      const cleanedListItems: any[] = [];
      const listMarkers: ComponentMarker[] = [];
      const listMarkerItems: ScanItem[] = [];
      let foundMarkersInList = false;
      
      for (const listItem of listNode.children) {
        if (listItem.type === 'listItem' && 'children' in listItem) {
          // Scan the list item's children for markers
          const itemResults = scanForMarkers(listItem.children as Content[]);
          
          if (itemResults.markers.length > 0) {
            // Found markers in this list item
            foundMarkersInList = true;
            
            // Add the list item's content (without markers)
            if (itemResults.content.length > 0) {
              cleanedListItems.push({
                ...listItem,
                children: itemResults.content,
              });
            }
            
            // Collect markers to add AFTER the list content
            listMarkers.push(...itemResults.markers);
            itemResults.items.forEach(item => {
              if (item.type === 'marker') {
                listMarkerItems.push(item);
              }
            });
          } else {
            // No markers in this list item, keep it as-is
            cleanedListItems.push(listItem);
          }
        } else {
          cleanedListItems.push(listItem);
        }
      }
      
      if (foundMarkersInList) {
        // Add the cleaned list (without fence markers) to content FIRST
        if (cleanedListItems.length > 0) {
          const cleanedList = {
            ...listNode,
            children: cleanedListItems,
          };
          content.push(cleanedList);
          if (node.position) {
            items.push({ type: 'content', node: cleanedList, position: node.position });
          }
        }
        
        // NOW add the markers AFTER the list content
        markers.push(...listMarkers);
        items.push(...listMarkerItems);
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

