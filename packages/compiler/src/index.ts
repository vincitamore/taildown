/**
 * @taildown/compiler
 * Core compilation engine for Taildown
 */

import type { CompileOptions, CompileResult } from '@taildown/shared';
import {visit} from 'unist-util-visit';
import { parseWithWarnings } from './parser';
import { renderHTMLDocument, astToHast, generateCSS, collectClassesFromHast } from './renderer';
import { generateJavaScript, hasInteractiveBehavior } from './js-generator';
import {getDefaultConfig} from './config/default-config';
import {mergeConfig} from './config/theme-merger';
import {validateConfig} from './config/config-schema';
export {isCodePosition} from './authoring-context';

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
  // Parsing awaits registry initialization after snapshotting caller options.
  const startTime = performance.now();
  const config = mergeConfig(getDefaultConfig(), {theme: options.theme});
  const validation = validateConfig(config);
  if (!validation.valid) throw new Error(`Invalid theme: ${validation.errors.join('; ')}`);

  // Parse the authored source directly. Compact component attributes are valid,
  // and rewriting source here would also alter literal code and source offsets.
  const parseResult = await parseWithWarnings(source, {styleMappings: options.styleMappings, components: options.components, componentConfig: options.componentConfig});
  const { ast, warnings } = parseResult;

  // Collect source metadata and components in one typed MDAST traversal.
  let nodeCount = 0;
  let hasMermaid = false;
  const usedComponents = new Set<string>();
  visit(ast, node => {
    nodeCount++;
    if (node.type === 'containerDirective') {
      usedComponents.add(node.name);
      if (node.name === 'mermaid') hasMermaid = true;
    } else if (node.type === 'code' && node.lang === 'mermaid') {
      hasMermaid = true;
    }
  });

  // Rendering can introduce attachments, code blocks and sortable tables.
  const hast = await astToHast(ast);
  visit(hast, 'element', node => {
    const component = node.properties['data-component'];
    if (typeof component === 'string' && component) usedComponents.add(component);
    if (node.tagName === 'section' && ('dataFootnotes' in node.properties || 'data-footnotes' in node.properties)) usedComponents.add('footnotes');
    if (node.tagName === 'pre' && node.children.some(child =>
      child.type === 'element' && child.tagName === 'code')) {
      usedComponents.add('copy-code');
    }
    if (node.tagName === 'table') {
      const className = node.properties.className;
      const tableClasses = typeof className === 'string' ? className.split(/\s+/) : Array.isArray(className) ? className : [];
      if (node.properties.dataSortable === 'true' || tableClasses?.includes('table-sortable')) {
        usedComponents.add('table');
      }
    }
  });
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
  const css = generateCSS(classes, options.minify, config);

  // Generate JavaScript for interactive components
  const interactiveComponents = Array.from(usedComponents).filter(hasInteractiveBehavior);
  const js = generateJavaScript(new Set(interactiveComponents), options.darkMode !== false);

  // Render HTML - Always create a complete HTML document
  const html = await renderHTMLDocument(ast, {
    title: options.title,
    description: options.description,
    openGraph: options.openGraph,
    css: css,
    js: js,
    hasMermaid: hasMermaid,
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
export type {ParseOptions} from './parser';
export {getAuthoringReference} from './authoring-reference';
export type { ContainerDirectiveNode } from './parser/directive-types';
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

// Re-export component registry for MCP and advanced usage
export {
  registry,
  registerStandardComponents,
  defineComponent,
} from './components/component-registry';

// Re-export style resolver for MCP and advanced usage
export {
  SHORTHAND_MAPPINGS,
  getAllShorthands,
  getShorthandsByCategory,
  hasShorthand,
  getShorthand,
} from './resolver/shorthand-mappings';
