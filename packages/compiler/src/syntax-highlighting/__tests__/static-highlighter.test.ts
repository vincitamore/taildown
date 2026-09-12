import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { highlightWithShiki, isLanguageSupported } from '../codemirror6-static-highlighter';
it.each(['constructor', '__proto__', 'toString'])(
  'does not treat inherited object member %s as a language',
  async (language) => {
    expect(isLanguageSupported(language)).toBe(false);
    expect(await highlightWithShiki('const x = 1;', language)).toBeNull();
  }
);
it('normalizes a registered language and preserves HTML-sensitive source', async () => {
  const source = 'const tag = "<div> & value";';
  expect(isLanguageSupported(' TS ')).toBe(true);
  const html = await highlightWithShiki(source, ' TS ');
  expect(html).not.toBeNull();
  const dom = new JSDOM(html ?? '');
  try {
    expect(dom.window.document.body.textContent).toBe(source);
    expect(dom.window.document.querySelector('span[style]')).not.toBeNull();
  } finally {
    dom.window.close();
  }
});
