/**
 * HTML Renderer for Taildown
 * Generates semantic HTML5 from AST
 */

import { unified } from 'unified';
import { toHast } from 'mdast-util-to-hast';
import type { State } from 'mdast-util-to-hast';
import rehypeStringify from 'rehype-stringify';
import rehypePrism from 'rehype-prism-plus';
import type { Root } from 'mdast';
import type { TaildownRoot } from '@taildown/shared';
import { renderIcons } from '../icons/icon-renderer';
import { rehypeRegisterTaildown } from '../prism/register-language-plugin';
import { containerDirectiveHandler, wrapWithAttachments } from './component-handlers';
import type { TaildownNodeData } from '@taildown/shared';

/**
 * Walk HAST tree and wrap elements with modal/tooltip attachments
 * This processes data-modal-attach and data-tooltip-attach attributes
 */
function processAttachments(node: any): any {
  if (!node || typeof node !== 'object') {
    return node;
  }

  // Process children first (depth-first)
  if (node.children && Array.isArray(node.children)) {
    node.children = node.children.map((child: any) => processAttachments(child));
  }

  // Check if this element has attachment data attributes
  if (node.type === 'element' && node.properties) {
    const modalContent = node.properties['data-modal-attach'];
    const tooltipContent = node.properties['data-tooltip-attach'];

    if (modalContent || tooltipContent) {
      // Remove the data attributes (they're only for processing)
      delete node.properties['data-modal-attach'];
      delete node.properties['data-tooltip-attach'];

      // Create TaildownNodeData-like object for wrapping
      const attachmentData: TaildownNodeData = {
        modal: modalContent,
        tooltip: tooltipContent
      };

      // Wrap the element
      return wrapWithAttachments(node, attachmentData);
    }
  }

  return node;
}

/**
 * Convert MDAST to HAST (HTML AST) with component handlers
 * 
 * @param ast - Taildown AST
 * @returns HAST tree
 */
export function astToHast(ast: TaildownRoot): any {
  // First, convert MDAST to HAST using default handlers + our custom component handler
  const hast = toHast(ast as Root, { 
    allowDangerousHtml: false,
    handlers: {
      // @ts-expect-error - containerDirective is our custom node type
      containerDirective: containerDirectiveHandler
    }
  });
  
  // Then, walk the HAST tree and process modal/tooltip attachments
  const processedHast = processAttachments(hast);
  
  return processedHast;
}

/**
 * Render AST to HTML
 * 
 * @param ast - Taildown AST
 * @param minify - Whether to minify HTML
 * @returns Generated HTML string
 */
export async function renderHTML(ast: TaildownRoot, minify: boolean = false): Promise<string> {
  // Convert MDAST to HAST (HTML AST)
  // Use custom handlers for interactive components
  const hast = astToHast(ast);

  if (!hast) {
    return '';
  }

  // Convert HAST to HTML string
  const processor = unified()
    .use(rehypeRegisterTaildown) // Register Taildown language BEFORE rehype-prism
    .use(rehypePrism, { ignoreMissing: true, showLineNumbers: false }) // Syntax highlighting
    .use(renderIcons) // Render icon nodes as SVG
    .use(rehypeStringify, {
      allowDangerousHtml: false,
      closeSelfClosing: true,
      closeEmptyElements: true,
    });

  // Run transformers (renderIcons), then stringify
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  const transformedHast = await processor.run(hast as any);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  const result = processor.stringify(transformedHast as any);

  if (minify) {
    // Basic minification: remove extra whitespace
    return result
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return result as string;
}

/**
 * Render AST to complete HTML document
 * 
 * @param ast - Taildown AST
 * @param options - Rendering options
 * @returns Complete HTML document
 */
export async function renderHTMLDocument(
  ast: TaildownRoot,
  options: {
    title?: string;
    css?: string;
    cssFilename?: string;
    jsFilename?: string;
    inlineStyles?: boolean;
    minify?: boolean;
    hasInteractiveComponents?: boolean;
  } = {}
): Promise<string> {
  const bodyHTML = await renderHTML(ast, options.minify);

  const styleTag = options.inlineStyles && options.css
    ? `<style>${options.css}</style>`
    : options.css
    ? `<link rel="stylesheet" href="${options.cssFilename || 'styles.css'}">`
    : '';

  const scriptTag = options.hasInteractiveComponents
    ? `<script src="${options.jsFilename || 'script.js'}" defer></script>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title || 'Taildown Document'}</title>
  ${styleTag}
  ${scriptTag}
</head>
<body>
  ${bodyHTML}
</body>
</html>`;

  if (options.minify) {
    return html.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
  }

  return html;
}

