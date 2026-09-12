import {expect,it} from 'vitest';
import {JSDOM} from 'jsdom';
import {detailsBehavior} from '../details';
import {compile} from '../../../index';

it('opens details for printing and restores only panels it opened, across repeated print events', () => {
  const dom = new JSDOM('<details id="closed"><summary>Closed</summary>Content</details><details id="open" open><summary>Open</summary>Content</details>',{runScripts:'outside-only'});
  try {
    const {window}=dom;
    window.eval(detailsBehavior.code);
    const closed=window.document.querySelector<HTMLDetailsElement>('#closed')!;
    const open=window.document.querySelector<HTMLDetailsElement>('#open')!;
    for(let cycle=0;cycle<2;cycle++) {
      window.dispatchEvent(new window.Event('beforeprint'));
      window.dispatchEvent(new window.Event('beforeprint'));
      expect(closed.open).toBe(true);
      expect(open.open).toBe(true);
      window.dispatchEvent(new window.Event('afterprint'));
      expect(closed.open).toBe(false);
      expect(open.open).toBe(true);
    }
  } finally {dom.window.close();}
});

it('includes details print support in standalone exports even with dark mode disabled', async () => {
  const result=await compile(':::details\nPrintable content\n:::',{darkMode:false,inlineStyles:true,inlineScripts:true,minify:true});
  expect(result.html).toContain('beforeprint');
  expect(result.html).toContain('afterprint');
  expect(result.html).toContain('@media print');
  expect(result.html).toContain('Printable content');
});
