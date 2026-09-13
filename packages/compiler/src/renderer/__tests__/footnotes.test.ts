import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { compile } from '../../index';

it.each([
  'Literal \\[^a].',
  'Literal \\[^a].\n\n[^a]: Definition.',
  'Literal [^missing].',
  'Literal &#91;^a].',
])('preserves literal or undefined footnote references: %s', async source => {
  const result = await compile(source);
  const dom = new JSDOM(result.html);
  try {
    expect(dom.window.document.querySelector('p')?.textContent).toMatch(/Literal \[\^(a|missing)\]\./);
    expect(dom.window.document.querySelector('a')).toBeNull();
  } finally { dom.window.close(); }
});

it('preserves formatted definitions in legacy footnotes containers', async () => {
  const result = await compile('Reference[^a].\n\n:::footnotes\n[^a]: **Formatted** definition.\n:::');
  const dom = new JSDOM(result.html);
  try {
    expect(dom.window.document.querySelector('section[data-footnotes] strong')?.textContent).toBe('Formatted');
    expect(dom.window.document.querySelectorAll('a[data-footnote-ref]')).toHaveLength(1);
  } finally { dom.window.close(); }
});

it('keeps native formatted notes and distinct return links for repeated references', async () => {
  const result = await compile('First[^a] and second[^a].\n\n[^a]: **Bold** and [link](https://example.com).');
  const dom = new JSDOM(result.html);
  try {
    const document = dom.window.document;
    expect(document.querySelectorAll('a[data-footnote-ref]')).toHaveLength(2);
    expect(document.querySelector('section[data-footnotes] strong')?.textContent).toBe('Bold');
    expect(document.querySelectorAll('a[data-footnote-backref]')).toHaveLength(2);
    for (const link of document.querySelectorAll('a[href^="#"]')) {
      expect(document.getElementById(decodeURIComponent(link.getAttribute('href')!.slice(1)))).not.toBeNull();
    }
  } finally { dom.window.close(); }
});
