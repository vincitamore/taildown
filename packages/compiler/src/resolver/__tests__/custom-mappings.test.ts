import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it('applies a per-document mapping across styled prose, components, icons, badges, marks and tables', async () => {
  const source = '# Title {brand}\n\n:::card{brand}\nContent\n:::\n\n:icon[star]{brand} :badge[Ready]{brand} ==Marked=={brand}\n\n| A |\n|---|\n| B |\n{brand}';
  const result=await compile(source,{styleMappings:{brand:'text-sm font-bold'},inlineStyles:true});
  const dom=new JSDOM(result.html);
  try {
    for(const selector of ['h1','.component-card','svg[data-icon]','[data-component="badge"]','mark','table']) {
      const node=dom.window.document.querySelector(selector)!;
      expect(node,selector).not.toBeNull();
      expect(node.classList.contains('text-sm'),selector).toBe(true);
      expect(node.classList.contains('font-bold'),selector).toBe(true);
      expect(node.classList.contains('brand'),selector).toBe(false);
    }
  } finally {dom.window.close();}
});

it('isolates concurrent mappings and permits explicit built-in overrides without changing literal code', async () => {
  const source='# Title {large}\n\n`{large}`';
  const [small,huge,normal]=await Promise.all([
    compile(source,{styleMappings:{large:'text-sm'}}),
    compile(source,{styleMappings:{large:'text-6xl'}}),
    compile(source),
  ]);
  expect(small.html).toContain('<h1 class="text-sm">Title</h1>');
  expect(huge.html).toContain('<h1 class="text-6xl">Title</h1>');
  expect(normal.html).toContain('<h1 class="text-lg">Title</h1>');
  expect(small.html).toContain('{large}</code>');
});
