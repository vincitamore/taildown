import { generateMermaidScript } from './mermaid-runtime';
/**
 * HTML Renderer for Taildown
 * Generates semantic HTML5 from AST
 */

import { unified } from 'unified';
import { toHast } from 'mdast-util-to-hast';
import rehypeStringify from 'rehype-stringify';
import { minifyWhitespace } from 'hast-util-minify-whitespace';
import type { Root as HastRoot, Element, ElementContent } from 'hast';
import type { Code, Literal, Data } from 'mdast';
import type {Node} from 'unist';
import type { TaildownRoot, OpenGraphMetadata } from '@taildown/shared';
import { renderIcons } from '../icons/icon-renderer';
import { renderInlineBadges } from '../components/inline-badge-renderer';
import { rehypeCodeMirror6 } from '../syntax-highlighting/rehype-codemirror6';
import { rehypeCopyCode } from './rehype-copy-code';
import { containerDirectiveHandler, wrapWithAttachments, prepopulateRegistries, renderDiff } from './component-handlers';
import type { TaildownNodeData } from '@taildown/shared';
import { visit } from 'unist-util-visit';
import { rehypeEnhanceTables } from '../parser/table-parser';

interface MathNode extends Literal {
  type: 'math';
  mathML: string;
  data?: Data;
}

declare module 'mdast' {
  interface PhrasingContentMap { math: MathNode; }
  interface RootContentMap { math: MathNode; }
  interface Code { isDiff?: boolean; }
}

/**
 * Rehype plugin to wrap tables in a scrollable container
 * This ensures tables work properly on mobile like code blocks do
 */
function rehypeWrapTables() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table' && parent && typeof index === 'number') {
        // Create wrapper div
        const wrapper: Element = {
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
  return (tree: HastRoot) => {
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
            const getFirstText = (n: ElementContent): string => {
              if (n.type === 'text') return n.value;
              if (n.type === 'element') {
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
 * Rehype plugin to extract modals and tooltips from inline positions
 * and append them to the end of the document body for proper fixed positioning.
 * 
 * This solves the critical issue where modals wrapped in inline elements
 * cannot use position: fixed properly.
 */
function rehypePortalComponents() {
  return (tree: HastRoot) => {
    const portals: Element[] = [];
    
    // First pass: collect all portal-target elements and remove from their parents
    visit(tree, 'element', (node, index, parent) => {
      if (node.properties?.['data-portal-target'] === 'body') {
        // This element should be moved to document root
        portals.push(node);
        
        // Remove the data-portal-target attribute (it was just for processing)
        delete node.properties['data-portal-target'];
        
        // Remove from parent's children
        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1);
        }
        
        // Return SKIP to prevent visiting children (we're moving the whole subtree)
        return 'skip' as const;
      }
    });
    
    // Second pass: append portals to body (or root if no body found)
    if (portals.length > 0) {
      // Find body element
      let target: Element | HastRoot = tree;
      visit(tree, 'element', (node) => {
        if (node.tagName === 'body') {
          target = node;
          return 'skip' as const;
        }
      });
      
      // Append portals to body or root
      if (target.children && Array.isArray(target.children)) {
        target.children.push(...portals);
      }
    }
  };
}

/**
 * Walk HAST tree and wrap elements with modal/tooltip attachments
 * This processes data-modal-attach and data-tooltip-attach attributes
 */
function processAttachments(node: ElementContent): ElementContent {
  if (node.type !== 'element') return node;
  // Process children first (depth-first)
  if (node.children && Array.isArray(node.children)) {
    node.children = node.children.map(processAttachments);
  }

  // Check if this element has attachment data attributes
  if (node.type === 'element' && node.properties) {
    const modalValue = node.properties['data-modal-attach'];
    const tooltipValue = node.properties['data-tooltip-attach'];
    const modalContent = typeof modalValue === 'string' ? modalValue : undefined;
    const tooltipContent = typeof tooltipValue === 'string' ? tooltipValue : undefined;

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
export function astToHast(ast: TaildownRoot): Promise<HastRoot> {
  // Retain the asynchronous public contract, including rejection on conversion errors.
  return new Promise(resolve => {
    // Pre-pass: Populate modal/tooltip registries BEFORE converting to HAST
    // This ensures ID-referenced modals/tooltips can be looked up during conversion
    prepopulateRegistries(ast);

    // Convert MDAST to HAST using default handlers + our custom component handler
    const hast = toHast(ast, {
      allowDangerousHtml: false,
      handlers: {
        containerDirective: containerDirectiveHandler,
        // Math handler for LaTeX equations
        math: (_state, node: MathNode) => {
          // Math nodes have MathML stored in node.mathML
          return {
            type: 'element',
            tagName: node.data?.hName || 'span',
            properties: node.data?.hProperties || {},
            children: [{
              type: 'raw',
              value: node.mathML || ''
            }]
          };
        },
        // Code handler for diff blocks and explicit mermaid handling
        code: (state, node: Code) => {
          // Handle diff blocks with custom rendering
          if (node.isDiff && node.data?.hProperties?.['data-component'] === 'diff') {
            return renderDiff(state, node);
          }

          // For mermaid blocks, explicitly create the structure for client-side rendering
          if (node.lang === 'mermaid') {
            return {
              type: 'element',
              tagName: 'pre',
              properties: { className: ['code-block', 'mermaid-block'] },
              children: [
                {
                  type: 'element',
                  tagName: 'code',
                  properties: { className: ['language-mermaid'] },
                  children: [{ type: 'text', value: node.value || '' }]
                }
              ]
            };
          }

          // For all other code blocks, create standard structure
          // (will be processed by rehypeCodeMirror6 for syntax highlighting)
          return {
            type: 'element',
            tagName: 'pre',
            properties: { className: ['code-block'] },
            children: [
              {
                type: 'element',
                tagName: 'code',
                properties: { className: node.lang ? [`language-${node.lang}`] : [] },
                children: [{ type: 'text', value: node.value || '' }]
              }
            ]
          };
        }
      }
    });

    // Walk the HAST tree and process modal/tooltip attachments
    if (hast.type !== 'root') throw new Error('Document conversion must produce a root');
    hast.children = hast.children.map(child => child.type === 'element' ? processAttachments(child) : child);
    resolve(hast);
  });
}

function isHastRoot(node: Node): node is HastRoot {
  return node.type === 'root' && 'children' in node && Array.isArray(node.children);
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
  const hast = await astToHast(ast);

  if (!hast) {
    return '';
  }

  // Convert HAST to HTML string
  const processor = unified()
    .use(rehypeCopyCode) // Capture original text before highlighting replaces it with HTML
    .use(rehypeCodeMirror6) // CodeMirror6-based syntax highlighting
    .use(renderIcons) // Render icon nodes as SVG
    .use(renderInlineBadges) // Render inline badge nodes
    .use(rehypeWrapTables) // Wrap tables in scrollable container
    .use(rehypeEnhanceTables) // Add enhanced table features (sortable, zebra, glass, etc.)
    .use(rehypeMarkTreeFolders) // Mark folder items in tree components
    .use(rehypePortalComponents) // Extract modals/tooltips to document root
    .use(rehypeStringify, {
      allowDangerousHtml: true, // Allow raw HTML for syntax highlighting
      closeSelfClosing: true,
      closeEmptyElements: true,
    });

  // Run transformers (renderIcons), then stringify
  const transformedHast = await processor.run(hast);
  if (!isHastRoot(transformedHast)) throw new Error('HTML transforms must preserve the document root');
  if (minify) {
    // Operate on HTML nodes, never serialized HTML: preformatted text, raw
    // syntax highlighting, and attribute values must survive byte-for-byte.
    const codeContents: Array<{ node: Element; children: ElementContent[] }> = [];
    visit(transformedHast, 'element', (node) => {
      if (node.tagName === 'code') {
        codeContents.push({ node, children: structuredClone(node.children) });
      }
    });
    minifyWhitespace(transformedHast);
    // Inline code has normal whitespace in the HTML UA stylesheet, but its
    // source text is still meaningful when selected and copied.
    for (const { node, children } of codeContents) node.children = children;
  }
  const result = processor.stringify(transformedHast);

  return result;
}

/** Escape document metadata in both HTML text and quoted attributes. */
function escapeHTML(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
    hasMermaid?: boolean;
  } = {}
): Promise<string> {
  const bodyHTML = await renderHTML(ast, options.minify);

  const styleTag = options.inlineStyles && options.css
    ? `<style>${options.css}</style>`
    : options.css
    ? `<link rel="stylesheet" href="${escapeHTML(options.cssFilename || 'styles.css')}">`
    : '';

  const scriptTag = options.hasInteractiveComponents
    ? options.inlineScripts && options.js
      ? `<script>${options.js}</script>`
      : `<script src="${escapeHTML(options.jsFilename || 'script.js')}" defer></script>`
    : '';

  const mermaidScript = options.hasMermaid ? await generateMermaidScript() : '';

  // Generate meta description tag
  const descriptionTag = options.description
    ? `<meta name="description" content="${escapeHTML(options.description)}">`
    : '';

  // Generate Open Graph meta tags
  let ogTags = '';
  if (options.openGraph) {
    const og = options.openGraph;
    if (og.title) {
      ogTags += `\n  <meta property="og:title" content="${escapeHTML(og.title)}">`;
    }
    if (og.description) {
      ogTags += `\n  <meta property="og:description" content="${escapeHTML(og.description)}">`;
    }
    if (og.type) {
      ogTags += `\n  <meta property="og:type" content="${escapeHTML(og.type)}">`;
    }
    if (og.url) {
      ogTags += `\n  <meta property="og:url" content="${escapeHTML(og.url)}">`;
    }
    if (og.image) {
      ogTags += `\n  <meta property="og:image" content="${escapeHTML(og.image)}">`;
    }
    if (og.imageAlt) {
      ogTags += `\n  <meta property="og:image:alt" content="${escapeHTML(og.imageAlt)}">`;
    }
    if (og.siteName) {
      ogTags += `\n  <meta property="og:site_name" content="${escapeHTML(og.siteName)}">`;
    }
    // Add Twitter Card tags for better Twitter sharing
    if (og.image) {
      ogTags += `\n  <meta name="twitter:card" content="summary_large_image">`;
      ogTags += `\n  <meta name="twitter:image" content="${escapeHTML(og.image)}">`;
    }
    if (og.title) {
      ogTags += `\n  <meta name="twitter:title" content="${escapeHTML(og.title)}">`;
    }
    if (og.description) {
      ogTags += `\n  <meta name="twitter:description" content="${escapeHTML(og.description)}">`;
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(options.title || 'Taildown Document')}</title>${descriptionTag ? '\n  ' + descriptionTag : ''}${ogTags}
  ${styleTag}
  ${scriptTag}${mermaidScript}
</head>
<body>
  ${bodyHTML}
</body>
</html>`;

  if (options.minify) {
    // Only omit whitespace owned by this document wrapper. Embedded scripts
    // retain their line breaks (including those terminating // comments).
    return '<!DOCTYPE html><html lang="en"><head>' +
      '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      `<title>${escapeHTML(options.title || 'Taildown Document')}</title>` +
      descriptionTag + ogTags + styleTag + scriptTag + mermaidScript +
      `</head><body>${bodyHTML}</body></html>`;
  }

  return html;
}
