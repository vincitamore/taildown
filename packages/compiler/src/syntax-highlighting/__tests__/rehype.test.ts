import { expect, it } from 'vitest';
import { unified } from 'unified';
import type { Root, Element } from 'hast';
import { rehypeCodeMirror6 } from '../rehype-codemirror6';

it.each(['sample language-td', ['sample', 'language-td', 7]])(
  'highlights Taildown using normalized HAST class properties: %s',
  async className => {
    const code: Element = {
      type: 'element', tagName: 'code', properties: { className },
      children: [{ type: 'text', value: '# Heading <safe>' }],
    };
    const root: Root = { type: 'root', children: [code] };
    await unified().use(rehypeCodeMirror6).run(root);
    expect(code.properties.className).toContain('sample');
    expect(code.properties.className).toContain('code-highlight');
    const content = code.children[0];
    expect(content?.type).toBe('raw');
    if (content?.type !== 'raw') throw new Error('Expected highlighted HTML');
    expect(content.value).toContain('&lt;safe&gt;');
    expect(content.value).not.toContain('<safe>');
  }
);
