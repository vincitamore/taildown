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
import { parseInlineBadges } from '../components/inline-badge-parser';
import { parseInlineMarks } from './inline-mark-parser';
import { parseKeyboard } from './kbd-parser';
import { parseStepIndicators } from './step-parser';
import { parseEnhancedTaskList } from './task-list-parser';
import { parseVideoEmbeds } from './video-parser';
import { parseTableAttributes } from './table-parser';
import { parseImageCompare } from './image-compare-parser';
import { parseDiff } from './diff-parser';
import { parseFootnoteReferences, parseFootnoteDefinitions } from './footnote-parser';
import { remarkMath } from './math-parser';
import { parseTimeline } from './timeline-parser';

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
    .use(remarkGfm) // GitHub Flavored Markdown (tables, task lists, etc.)
    .use(parseEnhancedTaskList) // Enhance GFM task lists with priorities, assignees, states (MUST run after remarkGfm)
    .use(remarkMath) // Parse LaTeX math equations ($...$ and $$...$$) - MUST run before directives
    .use(parseFootnoteReferences) // Parse [^id] references in text (MUST run before directives)
    .use(parseTableAttributes) // Parse table attributes (MUST run after remarkGfm, before extractInlineAttributes)
    .use(parseDirectives) // Custom component directive parser (:::component)
    .use(parseFootnoteDefinitions) // Parse :::footnotes container with definitions (MUST run after directives)
    .use(parseImageCompare) // Parse image comparison components (MUST run after parseDirectives)
    .use(parseDiff) // Parse code diff blocks (unified and side-by-side)
    .use(parseIcons) // Parse icon syntax (:icon[name]{classes})
    .use(parseInlineBadges) // Parse inline badge syntax :badge[text]{attrs}
    .use(parseInlineMarks) // Parse inline mark/highlight syntax ==text=={variant}
    .use(parseKeyboard) // Parse keyboard key syntax :kbd[key] and :kbd[Ctrl+C]
    .use(extractInlineAttributes, { warnings }) // Taildown inline attributes (MUST run before step/video/timeline parsers)
    .use(parseStepIndicators) // Parse step indicator components with {step} markers
    .use(parseTimeline) // Parse timeline components with milestones (MUST run after extractInlineAttributes)
    .use(parseVideoEmbeds) // Parse video embed components with URL detection
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
    .use(parseEnhancedTaskList) // Enhance GFM task lists with priorities, assignees, states
    .use(remarkMath) // Parse LaTeX math equations ($...$ and $$...$$)
    .use(parseFootnoteReferences) // Parse [^id] references
    .use(parseTableAttributes) // Parse table attributes
    .use(parseDirectives) // Custom component directive parser
    .use(parseFootnoteDefinitions) // Parse :::footnotes container
    .use(parseImageCompare) // Parse image comparison components
    .use(parseDiff) // Parse code diff blocks (unified and side-by-side)
    .use(parseIcons) // Parse icon syntax
    .use(parseInlineBadges) // Parse inline badge syntax
    .use(parseInlineMarks) // Parse inline mark/highlight syntax
    .use(parseKeyboard) // Parse keyboard key syntax
    .use(extractInlineAttributes, { warnings }) // Must run before step/video/timeline parsers
    .use(parseStepIndicators) // Parse step indicator components
    .use(parseTimeline) // Parse timeline components with milestones
    .use(parseVideoEmbeds) // Parse video embed components
    .use(processComponents, { warnings });

  const ast = processor.parse(source);
  const processedAst = await processor.run(ast as Root);

  return {
    ast: processedAst as TaildownRoot,
    warnings,
  };
}

