import type { Text } from 'mdast';
import type { Position } from 'unist';
import { decodeString } from 'micromark-util-decode-string';

/** Map decoded Markdown text boundaries back to the original source. */
export function textSlicePosition(node: Text, start: number, end: number, source?: string): Position | undefined {
  if (!node.position) return undefined;
  const origin = node.position.start;
  if (source !== undefined && origin.offset !== undefined && node.position.end.offset !== undefined) {
    const raw = source.slice(origin.offset, node.position.end.offset);
    const offsets = [origin.offset];
    let decoded = '';
    const tokens = /\\[!-/:-@\[-`{-~]|&(?:#[xX][\da-fA-F]+|#\d+|[a-zA-Z][a-zA-Z\d]*);|\r\n|[\s\S]/g;
    for (const match of raw.matchAll(tokens)) {
      const value = match[0] === '\r\n' && !node.value.includes('\r') ? '\n' : decodeString(match[0]);
      decoded += value;
      for (let i = 0; i < value.length; i++) offsets.push(origin.offset + match.index! + match[0].length);
    }
    if (decoded === node.value) {
      const point = (index: number) => {
        const offset = offsets[index]!;
        const before = raw.slice(0, offset - origin.offset!);
        const lineStart = before.lastIndexOf('\n');
        return {
          line: origin.line + before.split('\n').length - 1,
          column: lineStart < 0 ? origin.column + before.length : before.length - lineStart,
          offset,
        };
      };
      return {start: point(start), end: point(end)};
    }
  }
  // Without raw source, preserve known endpoints and avoid inventing byte offsets.
  const point = (index: number) => {
    if (index === 0) return {...node.position!.start};
    if (index === node.value.length) return {...node.position!.end};
    const lines = node.value.slice(0, index).split(/\r?\n/);
    return {line: origin.line + lines.length - 1, column: lines.length === 1 ? origin.column + index : lines[lines.length - 1]!.length + 1};
  };
  return {start: point(start), end: point(end)};
}
