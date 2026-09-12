import {expect, it} from 'vitest';
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
