/**
 * @taildown/compiler
 * Core compilation engine for Taildown
 */

import type { CompileOptions, CompileResult } from '@taildown/shared';
import { parseWithWarnings } from './parser';
import { renderHTMLDocument, astToHast, generateCSS, collectClassesFromHast } from './renderer';
import { generateJavaScript, hasInteractiveBehavior } from './js-generator';

/**
 * Compile Taildown source to HTML and CSS
 * Main entry point for Taildown compilation
 * 
 * @param source - Taildown source code
 * @param options - Compilation options
 * @returns Compiled HTML and CSS with metadata
 */
export async function compile(
  source: string,
  options: CompileOptions = {}
): Promise<CompileResult> {
  const startTime = performance.now();

  // Parse source to AST
  const parseResult = await parseWithWarnings(source);
  const { ast, warnings } = parseResult;

  // Count nodes for metadata
  let nodeCount = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function countNodes(node: any): void {
    nodeCount++;
    if (node.children) {
      for (const child of node.children) {
        countNodes(child);
      }
    }
  }
  countNodes(ast);

  // Track which components are used for JS generation
  const usedComponents = new Set<string>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function findComponents(node: any): void {
    // Component blocks have type 'containerDirective' from our directive parser
    if (node.type === 'containerDirective' && node.name) {
      usedComponents.add(node.name);
    }
    if (node.children) {
      for (const child of node.children) {
        findComponents(child);
      }
    }
  }
  findComponents(ast);

  // Convert MDAST to HAST first (this applies component handlers and adds Tailwind classes)
  const hast = astToHast(ast);
  
  // Scan HAST for additional interactive components (attachable modals/tooltips)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function findHastComponents(node: any): void {
    if (node && typeof node === 'object') {
      // Check for data-component attribute
      if (node.type === 'element' && node.properties?.['data-component']) {
        usedComponents.add(node.properties['data-component']);
      }
      // Recurse into children
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          findHastComponents(child);
        }
      }
    }
  }
  findHastComponents(hast);
  
  // Collect classes from HAST (includes classes added by component handlers)
  const classes = collectClassesFromHast(hast);
  
  // Check if any animation classes are used (for scroll-triggered animations)
  const animationClasses = [
    'animate-fade-in',
    'animate-slide-up',
    'animate-slide-down',
    'animate-slide-left',
    'animate-slide-right',
    'animate-scale-in',
    'animate-zoom-in',
  ];
  const hasAnimations = animationClasses.some(animClass => classes.has(animClass));
  if (hasAnimations) {
    usedComponents.add('scroll-animations');
  }
  
  // Generate CSS from collected classes
  const css = generateCSS(classes, options.minify);

  // Generate JavaScript for interactive components
  const interactiveComponents = Array.from(usedComponents).filter(hasInteractiveBehavior);
  const js = generateJavaScript(new Set(interactiveComponents));

  // Render HTML - Always create a complete HTML document
  const html = await renderHTMLDocument(ast, {
    css: css,
    js: js,
    cssFilename: options.cssFilename,
    jsFilename: options.jsFilename,
    inlineStyles: options.inlineStyles,
    inlineScripts: options.inlineScripts,
    minify: options.minify,
    hasInteractiveComponents: js.length > 0,
  });

  const endTime = performance.now();

  return {
    html,
    css,
    js,
    metadata: {
      compileTime: endTime - startTime,
      nodeCount,
      warnings,
    },
  };
}

// Re-export parser and renderer for advanced usage
export { parse, parseWithWarnings } from './parser';
export { renderHTML, renderHTMLDocument, renderCSS } from './renderer';

// Re-export JavaScript generator
export { generateJavaScript, getInteractiveComponents, hasInteractiveBehavior } from './js-generator';

// Re-export syntax highlighting
export {
  taildownLanguage,
  taildown,
  taildownHighlightStyle,
  taildownDarkHighlightStyle,
  rehypeCodeMirror6,
} from './syntax-highlighting';

// Re-export types from shared
export type {
  CompileOptions,
  CompileResult,
  CompileMetadata,
  CompilationWarning,
  TaildownRoot,
  TaildownNode,
  TaildownNodeData,
  ComponentDefinition,
  ParseResult,
} from '@taildown/shared';

