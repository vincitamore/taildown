import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it('renders missing-image errors without dropping adjacent comparison blocks', async () => {
  const source = ':::compare-images\nbefore: /one.png\n:::\n\n:::compare-images\nafter: /two.png\n:::\n\n:::compare-images\n![Old view](/old.png)\n![New view](/new.png)\n:::';
  const result = await compile(source);
  const document = new JSDOM(result.html).window.document;
  expect(document.body.textContent?.match(/requires both/g)).toHaveLength(2);
  expect(document.querySelectorAll('.image-compare')).toHaveLength(1);
  expect(document.querySelector('img[src="/old.png"]')?.getAttribute('alt')).toBe('Old view');
  expect(document.querySelector('img[src="/new.png"]')?.getAttribute('alt')).toBe('New view');
});
