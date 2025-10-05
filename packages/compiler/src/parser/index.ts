/**
 * Taildown Parser
 * See SYNTAX.md for specification details
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root } from 'mdast';
import type { ParseResult, TaildownRoot, CompilationWarning } from '@taildown/shared';
import { extractInlineAttributes } from './attributes';
import { processComponents } from './components';
import { parseDirectives } from './directive-parser';
import { parseIcons } from '../icons/icon-parser';

/**
 * Parse Taildown source to AST
 * See SYNTAX.md §1.1 for document structure
 * 
 * @param source - Taildown source code
 * @returns Parsed AST with Taildown extensions
 */
export async function parse(source: string): Promise<TaildownRoot> {
  const warnings: CompilationWarning[] = [];

  // Create unified processor with Taildown plugins
  // See SYNTAX.md §7.1 for parsing precedence
  const processor = unified()
    .use(remarkParse) // Base CommonMark parsing
    .use(remarkGfm) // GitHub Flavored Markdown (tables, etc.)
    .use(parseDirectives) // Custom component directive parser (:::component)
    .use(parseIcons) // Parse icon syntax (:icon[name]{classes})
    .use(extractInlineAttributes, { warnings }) // Taildown inline attributes
    .use(processComponents, { warnings }); // Taildown component processing

  // Parse to AST
  const ast = processor.parse(source);
  const processedAst = await processor.run(ast as Root);

  return processedAst as TaildownRoot;
}

/**
 * Parse with detailed result including warnings
 * 
 * @param source - Taildown source code
 * @returns Parse result with AST and warnings
 */
export async function parseWithWarnings(source: string): Promise<ParseResult> {
  const warnings: CompilationWarning[] = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(parseDirectives) // Custom component directive parser
    .use(parseIcons) // Parse icon syntax
    .use(extractInlineAttributes, { warnings })
    .use(processComponents, { warnings });

  const ast = processor.parse(source);
  const processedAst = await processor.run(ast as Root);

  return {
    ast: processedAst as TaildownRoot,
    warnings,
  };
}

