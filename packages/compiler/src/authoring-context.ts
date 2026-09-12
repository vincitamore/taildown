import {unified} from 'unified';
import remarkParse from 'remark-parse';
import {visit} from 'unist-util-visit';

const markdown = unified().use(remarkParse);

/** Exact literal inline-code ranges, including spans crossing source lines. */
export function inlineCodeRanges(source: string): Array<{from: number; to: number}> {
  const ranges: Array<{from: number; to: number}> = [];
  visit(markdown.parse(source), 'inlineCode', node => {
    const from = node.position?.start.offset;
    const to = node.position?.end.offset;
    if (from !== undefined && to !== undefined) ranges.push({from, to});
  });
  return ranges;
}

/** Whether inserting text at this cursor would be part of literal Markdown code. */
export function isCodePosition(source: string, position: number): boolean {
  // A character makes empty lines and the end of an unfinished block observable.
  const tree = markdown.parse(source.slice(0, position) + '/' + source.slice(position));
  let code = false;
  visit(tree, node => {
    if (node.type !== 'code' && node.type !== 'inlineCode') return;
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start !== undefined && end !== undefined && start <= position && position < end) code = true;
  });
  return code;
}
