import type {Plugin} from 'unified';
import type {Root, RootContent, Table} from 'mdast';
import type {Node, Parent} from 'unist';
import {visit} from 'unist-util-visit';
import {parseComponentMarker} from './directive-scanner';

/** GFM permits unpiped body rows, including lines that are Taildown fences.
 * Return the suffix to Markdown parsing before any Taildown transforms run.
 */
export const restoreTableFenceBoundaries: Plugin<[], Root> = function () {
  const processor = this;
  return (tree, file) => {
    const source = String(file);
    const definitions: string[] = [];
    visit(tree, node => {
      if ((node.type === 'definition' || node.type === 'footnoteDefinition') && node.position) {
        definitions.push(source.slice(node.position.start.offset, node.position.end.offset));
      }
    });
    const walk = (parent: Parent) => {
      for (let index = 0; index < parent.children.length; index++) {
        const node = parent.children[index]!;
        if (node.type === 'table') {
          const table = node as Table;
          const rawRow = (row: Node) => source.slice(row.position!.start.offset, row.position!.end.offset);
          const boundary = table.children.findIndex((row, i) => i > 0 && row.position && parseComponentMarker(rawRow(row)) !== null);
          if (boundary !== -1) {
            const rows = table.children.slice(boundary);
            const suffix = rows.map(rawRow).join('\n');
            // Markdown only recognizes reference links when their definitions
            // are in the parse context. Keep those labels visible to reparsing.
            const fragment = processor.parse(suffix + '\n\n' + definitions.join('\n\n')) as Root;
            fragment.children = fragment.children.filter(child => child.position!.start.offset! < suffix.length);
            visit(fragment, child => {
              if (!child.position) return;
              for (const point of [child.position.start, child.position.end]) {
                const origin = rows[point.line - 1]?.position?.start;
                if (!origin) continue;
                point.offset = origin.offset! + point.column - 1;
                point.column += origin.column - 1;
                point.line = origin.line;
              }
            });
            table.children = table.children.slice(0, boundary);
            table.position!.end = {...table.children[table.children.length - 1]!.position!.end};
            if (boundary === 1) {
              // The delimiter row has no AST child, but belongs to the table span.
              const newline = source.lastIndexOf('\n', rows[0]!.position!.start.offset! - 1);
              const end = source[newline - 1] === '\r' ? newline - 1 : newline;
              table.position!.end = {line: rows[0]!.position!.start.line - 1,
                column: end - source.lastIndexOf('\n', end - 1), offset: end};
            }
            parent.children.splice(index + 1, 0, ...fragment.children as RootContent[]);
          }
        }
        if ('children' in node) walk(node as Parent);
      }
    };
    walk(tree);
  };
};
