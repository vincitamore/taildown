/**
 * Taildown Parser
 * See SYNTAX.md for specification details
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
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
import { remarkMath } from './math-parser';
import { parseTimeline } from './timeline-parser';
import { registryInitialized } from '../components/component-registry';
import { recognizeFenceBlocks } from './fence-blocks';
import {getDefaultConfig} from '../config/default-config';
import type {ComponentDefinition} from '@taildown/shared';
import {prepareCustomComponents, snapshotCustomComponents} from '../components/custom-components';
import {snapshotComponentConfig, configureComponents} from '../components/component-config';
import {snapshotStyleMappings} from '../resolver/style-resolver';

export interface ParseOptions {
  styleMappings?: Record<string, string>;
  components?: Record<string, ComponentDefinition>;
  componentConfig?: import('@taildown/shared').ComponentsConfig;
}

/**
 * Parse Taildown source to AST
 * See SYNTAX.md §1.1 for document structure
 * 
 * @param source - Taildown source code
 * @returns Parsed AST with Taildown extensions
 */
export async function parse(source: string, options: ParseOptions = {}): Promise<TaildownRoot> {
  return (await parseWithWarnings(source, options)).ast;
}

/**
 * Parse with detailed result including warnings
 * 
 * @param source - Taildown source code
 * @returns Parse result with AST and warnings
 */
export async function parseWithWarnings(source: string, options: ParseOptions = {}): Promise<ParseResult> {
  const styleMappings = snapshotStyleMappings(options.styleMappings);
  const componentConfig = snapshotComponentConfig(options.componentConfig);
  const componentDefinitions = snapshotCustomComponents(options.components);
  await registryInitialized;
  const warnings: CompilationWarning[] = [];
  const components = configureComponents(prepareCustomComponents(componentDefinitions), componentConfig);
  const resolverContext = {config: getDefaultConfig(), darkMode: false, styleMappings, components};

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(recognizeFenceBlocks)
    .use(parseEnhancedTaskList) // Enhance GFM task lists with priorities, assignees, states
    .use(remarkMath) // Parse LaTeX math equations ($...$ and $$...$$)
    .use(parseTableAttributes, {styleMappings}) // Parse table attributes
    .use(parseDirectives, { warnings }) // Custom component directive parser
    .use(parseImageCompare) // Parse image comparison components
    .use(parseDiff) // Parse code diff blocks (unified and side-by-side)
    .use(parseIcons, { warnings, resolverContext }) // Parse icon syntax
    .use(parseInlineBadges, {styleMappings}) // Parse inline badge syntax
    .use(parseInlineMarks, {styleMappings}) // Parse inline mark/highlight syntax
    .use(parseKeyboard) // Parse keyboard key syntax
    .use(extractInlineAttributes, { warnings, resolverContext }) // Must run before step/video/timeline parsers
    .use(parseStepIndicators) // Parse step indicator components
    .use(parseTimeline) // Parse timeline components with milestones
    .use(parseVideoEmbeds) // Parse video embed components
    .use(processComponents, { warnings, styleMappings, components });

  const ast = processor.parse(source);
  const processedAst = await processor.run(ast, { value: source });

  return {
    ast: processedAst as TaildownRoot,
    warnings,
  };
}
