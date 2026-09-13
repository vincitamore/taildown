import {expect, it} from 'vitest';
import {EditorState} from '@codemirror/state';
import {ensureSyntaxTree} from '@codemirror/language';
import type {Tree} from '@lezer/common';
import {taildownLanguage} from '../codemirror6-language';

function tokenAt(source: string, text: string) {
  return taildownLanguage.parser.parse(source).resolveInner(source.indexOf(text) + Math.min(1, text.length - 1), 1).name;
}
it('recognizes links and task checks without mistaking their labels for icon names', () => {
  expect(tokenAt('[link](https://example.com)', 'link')).toBe('link');
  expect(tokenAt('- [x] done', '[x]')).toBe('bool');
  expect(tokenAt('- [ ] todo', '[ ]')).toBe('bool');
  expect(tokenAt('- [~] doing', '[~]')).toBe('bool');
  expect(tokenAt('- [-] cancelled', '[-]')).toBe('bool');
  expect(tokenAt('ordinary [word]', 'word')).toBe('Document');
});
it('requires complete inline directive syntax and keeps escaped directives literal', () => {
  expect(tokenAt(':iconic user@example.com :mark[text]', ':iconic')).toBe('Document');
  expect(tokenAt('user@example.com', '@example')).toBe('Document');
  expect(tokenAt('\\:icon[heart]', 'heart')).toBe('Document');
  expect(tokenAt(':kbd[Ctrl+K]', 'Ctrl')).toBe('string');
  expect(tokenAt(':badge[New item]', 'New')).toBe('string');
  expect(tokenAt(':icon[heart]', 'heart')).toBe('name.function');
});
it('recognizes whole compound attributes and quoted or unquoted values', () => {
  const source = ':::card {padded-lg rounded-full center-x large-muted bold-primary title="" href=/path gap=4}';
  expect(tokenAt(source, 'padded-lg')).toBe('propertyName');
  expect(tokenAt(source, 'rounded-full')).toBe('attributeName');
  expect(tokenAt(source, 'large-muted')).toBe('typeName');
  expect(tokenAt(source, 'bold-primary')).toBe('typeName');
  expect(tokenAt(source, 'title')).toBe('attributeName');
  expect(tokenAt(source, '""')).toBe('string');
  expect(tokenAt(source, 'href')).toBe('attributeName');
  expect(tokenAt(source, '/path')).toBe('string');
  expect(tokenAt(source, '4')).toBe('number');
  const tree = taildownLanguage.parser.parse(source);
  const padded = tree.resolveInner(source.indexOf('padded-lg') + 7);
  expect(source.slice(padded.from, padded.to)).toBe('padded-lg');
});
it('recovers from unfinished attributes at the next line and keeps quoted braces inside values', () => {
  expect(tokenAt('literal {unfinished\n# Heading\n**bold**', 'Heading')).toBe('heading');
  expect(tokenAt(':::card {title="A } B" padded}', 'padded')).toBe('propertyName');
});
it('highlights nested syntax in headings and component names in Markdown containers', () => {
  expect(tokenAt('# Heading :icon[heart] {primary}', 'heart')).toBe('name.function');
  expect(tokenAt('# Heading :icon[heart] {primary}', 'primary')).toBe('className');
  for (const source of ['  :::card', '> :::card', '- :::card', '> - :::card']) {
    expect(tokenAt(source, 'card')).toBe('tagName');
  }
});
it('covers Markdown formatting, native footnotes and actual HTML comments', () => {
  expect(tokenAt('_italic_ __bold__ ~~deleted~~', 'italic')).toBe('emphasis');
  expect(tokenAt('_italic_ __bold__ ~~deleted~~', 'bold')).toBe('strong');
  expect(tokenAt('_italic_ __bold__ ~~deleted~~', 'deleted')).toBe('strikethrough');
  const definition = '[^note]: Footnote';
  const node = taildownLanguage.parser.parse(definition).resolveInner(2);
  expect(definition.slice(node.from, node.to)).toBe('[^note]:');
  expect(tokenAt('<!-- :icon[heart]\nstill comment -->', 'heart')).toBe('comment');
});

it('does not let list or quote punctuation close an ordinary fenced code block', () => {
  const source = '```js\n- ```\n> ```\n:icon[heart]\n```\n:icon[star]';
  expect(tokenAt(source, 'heart')).toBe('monospace');
  expect(tokenAt(source, 'star')).toBe('name.function');
});

it.each(['foo_bar_baz', 'foo__bar__baz', 'α_β_γ', '你好__世界__你好', '_ leading_', '_trailing _'])(
  'keeps non-flanking underscore runs literal: %s', source => {
    expect(taildownLanguage.parser.parse(source).cursor().firstChild()).toBe(false);
  }
);
it.each(['(_word_)', '«__word__»', '😀_word_😀'])(
  'recognizes emphasis beside Unicode punctuation and symbols: %s', source => {
    expect(tokenAt(source, 'word')).toBe(source.includes('__') ? 'strong' : 'emphasis');
  }
);
it('does not let an unfinished inline comment swallow subsequent Markdown', () => {
  const source = 'Some text <!-- incomplete\n# Heading\n:icon[heart]';
  expect(tokenAt(source, 'incomplete')).toBe('Document');
  expect(tokenAt(source, 'Heading')).toBe('heading');
  expect(tokenAt(source, 'heart')).toBe('name.function');
});
it.each(['', '  ', '> ', '- '])('preserves unfinished block comments after a Markdown prefix %j', prefix => {
  expect(tokenAt(`${prefix}<!-- incomplete\n# Heading`, 'Heading')).toBe('comment');
});

it.each([
  {source: '```js\n:icon[heart]\n```\n# Heading', search: '```', insert: ''},
  {source: '<!-- comment\n-->\n# Heading', search: '-->', insert: ''},
  {source: ':::card {padded}\n# Heading', search: '}', insert: ''},
])('keeps incremental $search edits consistent with a fresh parse', ({source, search, insert}) => {
  const initial = EditorState.create({doc: source, extensions: [taildownLanguage]});
  ensureSyntaxTree(initial, source.length, 1000);
  const from = source.lastIndexOf(search);
  const edited = initial.update({changes: {from, to: from + search.length, insert}}).state;
  const text = edited.doc.toString();
  const incremental = ensureSyntaxTree(edited, text.length, 1000);
  if (!incremental) throw new Error('Incremental parser did not finish');
  const tokens = (tree: Tree) => {
    const result: Array<{name: string; from: number; to: number}> = [];
    tree.iterate({enter: node => {result.push({name: node.name, from: node.from, to: node.to});}});
    return result;
  };
  expect(tokens(incremental)).toEqual(tokens(taildownLanguage.parser.parse(text)));
});
