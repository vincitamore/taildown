import {unified} from 'unified';
import remarkParse from 'remark-parse';
import {visit} from 'unist-util-visit';

const markdown = unified().use(remarkParse);

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
