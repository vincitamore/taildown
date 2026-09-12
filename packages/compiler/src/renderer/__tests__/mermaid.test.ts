import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { compile } from '../../index';
import { MERMAID_CONTROLLER } from '../mermaid-runtime';

describe('Mermaid exports', () => {
  it.each([false, true])('preserves directive source and embeds its runtime (minify=%s)', async minify => {
    const diagram = 'classDiagram\n  class Animal {\n    +String name\n    +makeSound()\n  }\n  Animal <|-- Dog';
    const result = await compile(':::mermaid\n' + diagram + '\n:::', { inlineStyles: true, inlineScripts: true, minify });
    const doc = new JSDOM(result.html).window.document;
    expect(doc.querySelector('code.language-mermaid')?.textContent).toBe(diagram);
    expect(doc.querySelectorAll('script[src]')).toHaveLength(0);
    expect(result.html).toContain('taildown-mermaid-');
    expect(result.html.length).toBeGreaterThan(2_000_000);
  });

  it('omits the diagram library for ordinary documents', async () => {
    const result = await compile('# No diagrams');
    expect(result.html).not.toContain('taildown-mermaid-');
    expect(result.html.length).toBeLessThan(500_000);
  });

  it('keeps diagram source and retries rendering on theme changes', async () => {
    const dom = new JSDOM('<pre><code class="language-mermaid">graph TD\n A--&gt;B</code></pre>', { runScripts: 'outside-only' });
    const calls: string[] = [];
    let theme = '';
    Object.assign(dom.window, {mermaid: {
      initialize(options: {theme: string}) { theme = options.theme; },
      async render(_id: string, source: string) { calls.push(source); return {svg: '<svg data-theme="' + theme + '"></svg>'}; }
    }});
    dom.window.eval(MERMAID_CONTROLLER);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));
    dom.window.document.documentElement.classList.add('dark');
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(calls).toEqual(['graph TD\n A-->B', 'graph TD\n A-->B']);
    expect(dom.window.document.querySelector('svg')?.getAttribute('data-theme')).toBe('dark');
    expect(dom.window.document.querySelector('pre')?.hidden).toBe(true);
    dom.window.close();
  });
});

it('reads a saved theme applied before deferred startup', async () => {
  const dom = new JSDOM('<pre><code class="language-mermaid">graph TD\n A--&gt;B</code></pre>', { runScripts: 'outside-only' });
  const themes: string[] = [];
  Object.assign(dom.window, { mermaid: {
    initialize(options: {theme: string}) { themes.push(options.theme); },
    async render() { return { svg: '<svg></svg>' }; }
  }});
  dom.window.eval(MERMAID_CONTROLLER);
  dom.window.document.documentElement.classList.add('dark');
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(themes).toEqual(['dark']);
  dom.window.close();
});
