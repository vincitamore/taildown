/**
 * Code Diff Parser for Taildown
 * 
 * Parses diff blocks in two formats:
 * 1. Unified diff format (```diff with +/- markers)
 * 2. Before/After blocks (:::diff with ```before and ```after)
 */

import type { Root, Code } from 'mdast';
import { visit } from 'unist-util-visit';
import type { ContainerDirectiveNode } from './directive-types.js';

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'info';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffBlock {
  before: string;
  after: string;
  language?: string;
  lines?: DiffLine[]; // For unified diff format
}

/**
 * Parse unified diff format (Git-style diff with +/- markers)
 */
function parseUnifiedDiff(code: string): DiffLine[] {
  const lines = code.split('\n');
  const diffLines: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;

  for (const line of lines) {
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) {
      // Diff metadata/headers
      diffLines.push({
        type: 'info',
        content: line,
      });
      
      // Parse line numbers from @@ markers
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) {
        oldLineNum = parseInt(match[1], 10);
        newLineNum = parseInt(match[2], 10);
      }
    } else if (line.startsWith('+')) {
      // Added line
      diffLines.push({
        type: 'added',
        content: line.slice(1), // Remove + marker
        newLineNumber: newLineNum++,
      });
    } else if (line.startsWith('-')) {
      // Removed line
      diffLines.push({
        type: 'removed',
        content: line.slice(1), // Remove - marker
        oldLineNumber: oldLineNum++,
      });
    } else {
      // Unchanged line (context)
      diffLines.push({
        type: 'unchanged',
        content: line.startsWith(' ') ? line.slice(1) : line,
        oldLineNumber: oldLineNum++,
        newLineNumber: newLineNum++,
      });
    }
  }

  return diffLines;
}

/**
 * Parse code blocks to find before/after pairs
 */
function extractBeforeAfter(node: ContainerDirectiveNode): DiffBlock | null {
  let beforeCode: string | null = null;
  let afterCode: string | null = null;
  let language: string | undefined;

  // Find code blocks labeled as "before" and "after"
  visit(node, 'code', (codeNode: Code) => {
    // Check if code node has meta field indicating before/after
    const meta = (codeNode as any).meta || '';
    const lang = codeNode.lang || '';

    // For code blocks, check if lang is "before" or "after" (label)
    // or if it's an actual language with before/after in meta
    if (lang === 'before' || meta.includes('before')) {
      beforeCode = codeNode.value;
      // Language might be in meta or a variant attribute
    } else if (lang === 'after' || meta.includes('after')) {
      afterCode = codeNode.value;
    } else if (!beforeCode) {
      // First code block is "before" (implicit)
      beforeCode = codeNode.value;
      // Extract language from the actual language field
      if (lang && lang !== 'before' && lang !== 'after') {
        language = lang;
      }
    } else if (beforeCode && !afterCode) {
      // Second code block is "after" (implicit)
      afterCode = codeNode.value;
      // Extract language from the actual language field
      if (lang && lang !== 'before' && lang !== 'after') {
        language = language || lang;
      }
    }
  });

  if (beforeCode && afterCode) {
    return {
      before: beforeCode,
      after: afterCode,
      language,
    };
  }

  return null;
}

/**
 * Remark plugin to parse diff blocks
 */
export function parseDiff() {
  return (tree: Root): void => {
    // Parse unified diff format (```diff code blocks)
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang === 'diff') {
        // Parse unified diff
        const lines = parseUnifiedDiff(node.value);
        
        // Store parsed diff in node data as a serializable format
        if (!node.data) {
          node.data = {};
        }
        if (!node.data.hProperties) {
          node.data.hProperties = {};
        }
        
        // Store as JSON string to ensure proper serialization
        node.data.hProperties.diffLines = JSON.stringify(lines);
        node.data.hProperties.diffFormat = 'unified';
        node.data.hProperties['data-component'] = 'diff';
        
        // Mark this code block to be handled by our custom handler
        (node as any).isDiff = true;
      }
    });

    // Parse :::diff blocks with before/after
    visit(tree, 'containerDirective', (node: ContainerDirectiveNode) => {
      if (node.name === 'diff') {
        const diffBlock = extractBeforeAfter(node);
        
        if (diffBlock) {
          // Store before/after in node data
          if (!node.data) {
            node.data = {};
          }
          if (!node.data.hProperties) {
            node.data.hProperties = {};
          }
          
          node.data.hProperties.beforeCode = diffBlock.before;
          node.data.hProperties.afterCode = diffBlock.after;
          node.data.hProperties.language = diffBlock.language;
          node.data.hProperties.diffFormat = 'side-by-side';
          node.data.hProperties.dataComponent = 'diff';
          
          // Clear children since we've extracted the data
          node.children = [];
        }
      }
    });
  };
}

