import { runInNewContext } from 'node:vm';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { expect, it } from 'vitest';
import { inlineEditorModule } from '../build.mjs';

it('inlines dependencies and preserves HTML-sensitive document source without extra script elements', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'taildown-editor-'));
  try {
    const documentSource = "<!-- <script> --> </ScRiPt><p>$& $` $' 🦊</p>";
    writeFileSync(
      join(dir, 'compiler.js'),
      `export const value = ${JSON.stringify(documentSource)};`
    );
    const output: unknown = await inlineEditorModule(
      '<html><body><script type="module">import {value} from "./compiler.js"; globalThis.result = value;</script><footer>Intact</footer></body></html>',
      dir
    );
    if (typeof output !== 'string') throw new Error('Expected bundled HTML');
    const dom = new JSDOM(output);
    expect(dom.window.document.querySelectorAll('script')).toHaveLength(1);
    expect(dom.window.document.querySelector('footer')?.textContent).toBe('Intact');
    const script = dom.window.document.querySelector('script')?.textContent;
    if (!script) throw new Error('Missing bundled script');
    const target = {};
    // Keep bundled locals private, as they are inside the browser module script.
    runInNewContext(`(() => {${script}\n})()`, target);
    expect(target).toEqual({ result: documentSource });
    expect(script).not.toContain('data:text/javascript');
    expect(script).not.toContain('import ');
    dom.window.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

it('fails a malformed template instead of shipping an unbundled editor', async () => {
  await expect(inlineEditorModule('<p>No module</p>')).rejects.toThrow('exactly one');
  await expect(
    inlineEditorModule('<script type="module"></script><script type="module"></script>')
  ).rejects.toThrow('exactly one');
});
