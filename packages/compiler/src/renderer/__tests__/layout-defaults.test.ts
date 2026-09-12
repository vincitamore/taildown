import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it('preserves a nested grid as a grid instead of replacing its layout with flex', async () => {
  const result = await compile(':::grid{cols-2}\n:::grid{cols-2}\n:::card\nOne\n:::\n:::card\nTwo\n:::\n:::\n:::card\nSibling\n:::\n:::', {inlineStyles:true});
  const dom = new JSDOM(result.html);
  try {
    const nested = dom.window.document.querySelector('.component-grid > .component-grid')!;
    expect(nested).not.toBeNull();
    expect(dom.window.getComputedStyle(nested).display).toBe('grid');
    expect(dom.window.getComputedStyle(nested).marginBottom).toBe('0px');
  } finally {dom.window.close();}
});
