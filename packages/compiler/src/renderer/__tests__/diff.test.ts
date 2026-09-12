import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it.each([
  ['before', '', 'after', 'added'],
  ['before', 'removed', 'after', ''],
  ['js', '', 'js', 'added'],
  ['js', 'removed', 'js', ''],
])('renders empty sides in a diff: %s / %s / %s / %s', async (first, before, second, after) => {
  const source = `:::diff\n\`\`\`${first}\n${before}\n\`\`\`\n\n\`\`\`${second}\n${after}\n\`\`\`\n:::`;
  const result = await compile(source);
  const dom = new JSDOM(result.html);
  try {
    const block = dom.window.document.querySelector('.diff-side-by-side');
    expect(block).not.toBeNull();
    expect([...block!.querySelectorAll('code')].map(node => node.textContent)).toEqual([before, after]);
  } finally { dom.window.close(); }
});

it('preserves old and new number columns for every unified diff row', async () => {
  const result = await compile('```diff\n@@ -4,2 +9,2 @@\n-removed\n+added\n unchanged\n```');
  const document = new JSDOM(result.html).window.document;
  const rows = [...document.querySelectorAll('.diff-line')];
  expect(rows.map(row => [...row.querySelectorAll('.diff-line-number')].map(n => n.textContent)))
    .toEqual([['', ''], ['4', ''], ['', '9'], ['5', '10']]);
  expect(rows.map(row => row.querySelector('.diff-line-content')?.textContent))
    .toEqual(['@@ -4,2 +9,2 @@', 'removed', 'added', 'unchanged']);
});

it('copies the original diff with markers and line breaks instead of rendered numbers', async () => {
  const source = '@@ -4,2 +9,2 @@\n-removed <tag>\n+added & kept\n unchanged';
  const result = await compile('```diff\n' + source + '\n```', {minify: true});
  const document = new JSDOM(result.html).window.document;
  expect(document.querySelector('.code-copy-btn')?.getAttribute('data-code-text')).toBe(source);
});
