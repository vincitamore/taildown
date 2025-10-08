/**
 * HTML Renderer for Taildown
 * Generates semantic HTML5 from AST
 */

import { unified } from 'unified';
import { toHast } from 'mdast-util-to-hast';
import type { State } from 'mdast-util-to-hast';
import rehypeStringify from 'rehype-stringify';
import type { Root } from 'mdast';
import type { TaildownRoot, OpenGraphMetadata } from '@taildown/shared';
import { renderIcons } from '../icons/icon-renderer';
import { renderInlineBadges } from '../components/inline-badge-renderer';
import { rehypeCodeMirror6 } from '../syntax-highlighting/rehype-codemirror6';
import { rehypeCopyCode } from './rehype-copy-code';
import { containerDirectiveHandler, wrapWithAttachments, prepopulateRegistries } from './component-handlers';
import type { TaildownNodeData } from '@taildown/shared';
import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to wrap tables in a scrollable container
 * This ensures tables work properly on mobile like code blocks do
 */
function rehypeWrapTables() {
  return (tree: any) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table' && parent && typeof index === 'number') {
        // Create wrapper div
        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-wrapper']
          },
          children: [node]
        };
        
        // Replace table with wrapper
        parent.children[index] = wrapper;
      }
    });
  };
}

/**
 * Rehype plugin to mark folder items in tree components
 * Adds data-tree-folder attribute to list items whose text ends with /
 */
function rehypeMarkTreeFolders() {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      // Find tree-container divs
      if (node.tagName === 'div' && 
          node.properties?.className && 
          Array.isArray(node.properties.className) &&
          node.properties.className.includes('tree-container')) {
        // Walk all list items within this tree
        visit(node, 'element', (liNode) => {
          if (liNode.tagName === 'li') {
            // Get text content of the list item (first text node)
            const getFirstText = (n: any): string => {
              if (n.type === 'text') return n.value;
              if (n.children && Array.isArray(n.children)) {
                for (const child of n.children) {
                  if (child.type === 'text') return child.value;
                  const text = getFirstText(child);
                  if (text) return text;
                }
              }
              return '';
            };
            
            const text = getFirstText(liNode);
            if (text && text.trim().endsWith('/')) {
              // Mark this as a folder
              liNode.properties = liNode.properties || {};
              liNode.properties['data-tree-folder'] = 'true';
            }
          }
        });
      }
    });
  };
}

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
  // Pre-pass: Populate modal/tooltip registries BEFORE converting to HAST
  // This ensures ID-referenced modals/tooltips can be looked up during conversion
  prepopulateRegistries(ast as Root);
  
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
    .use(rehypeCodeMirror6) // CodeMirror6-based syntax highlighting
    .use(rehypeCopyCode) // Add copy buttons to code blocks
    .use(renderIcons) // Render icon nodes as SVG
    .use(renderInlineBadges) // Render inline badge nodes
    .use(rehypeWrapTables) // Wrap tables in scrollable container
    .use(rehypeMarkTreeFolders) // Mark folder items in tree components
    .use(rehypeStringify, {
      allowDangerousHtml: true, // Allow raw HTML for syntax highlighting
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
    description?: string;
    openGraph?: OpenGraphMetadata;
    css?: string;
    js?: string;
    cssFilename?: string;
    jsFilename?: string;
    inlineStyles?: boolean;
    inlineScripts?: boolean;
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
    ? options.inlineScripts && options.js
      ? `<script>${options.js}</script>`
      : `<script src="${options.jsFilename || 'script.js'}" defer></script>`
    : '';

  // Generate meta description tag
  const descriptionTag = options.description
    ? `<meta name="description" content="${options.description}">`
    : '';

  // Generate Open Graph meta tags
  let ogTags = '';
  if (options.openGraph) {
    const og = options.openGraph;
    if (og.title) {
      ogTags += `\n  <meta property="og:title" content="${og.title}">`;
    }
    if (og.description) {
      ogTags += `\n  <meta property="og:description" content="${og.description}">`;
    }
    if (og.type) {
      ogTags += `\n  <meta property="og:type" content="${og.type}">`;
    }
    if (og.url) {
      ogTags += `\n  <meta property="og:url" content="${og.url}">`;
    }
    if (og.image) {
      ogTags += `\n  <meta property="og:image" content="${og.image}">`;
    }
    if (og.imageAlt) {
      ogTags += `\n  <meta property="og:image:alt" content="${og.imageAlt}">`;
    }
    if (og.siteName) {
      ogTags += `\n  <meta property="og:site_name" content="${og.siteName}">`;
    }
    // Add Twitter Card tags for better Twitter sharing
    if (og.image) {
      ogTags += `\n  <meta name="twitter:card" content="summary_large_image">`;
      ogTags += `\n  <meta name="twitter:image" content="${og.image}">`;
    }
    if (og.title) {
      ogTags += `\n  <meta name="twitter:title" content="${og.title}">`;
    }
    if (og.description) {
      ogTags += `\n  <meta name="twitter:description" content="${og.description}">`;
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title || 'Taildown Document'}</title>${descriptionTag ? '\n  ' + descriptionTag : ''}${ogTags}
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

