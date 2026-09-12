import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it('preserves old and new number columns for every unified diff row', async () => {
  const result = await compile('```diff\n@@ -4,2 +9,2 @@\n-removed\n+added\n unchanged\n```');
  const document = new JSDOM(result.html).window.document;
  const rows = [...document.querySelectorAll('.diff-line')];
  expect(rows.map(row => [...row.querySelectorAll('.diff-line-number')].map(n => n.textContent)))
    .toEqual([['', ''], ['4', ''], ['', '9'], ['5', '10']]);
  expect(rows.map(row => row.querySelector('.diff-line-content')?.textContent))
    .toEqual(['@@ -4,2 +9,2 @@', 'removed', 'added', 'unchanged']);
});
