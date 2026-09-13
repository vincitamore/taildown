import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { compile } from '../../index';
import { MERMAID_CONTROLLER } from '../mermaid-runtime';
import { parse } from '../../parser';

describe('Mermaid fence attributes', () => {
  it.each([false, true])('matches directive classes, attributes and source (minify=%s)', async (minify) => {
    const attributes = '{glass compact sm .diagram-example id="diagram" aria-label="A &amp; B"}';
    const source = 'graph TD\n  A[One] --> B[Two]';
    const options = {minify, inlineStyles: true, inlineScripts: false};
    const [fence, directive] = await Promise.all([
      compile('```mermaid ' + attributes + '\n' + source + '\n```', options),
      compile(':::mermaid ' + attributes + '\n' + source + '\n:::', options),
    ]);
    const fenceDom = new JSDOM(fence.html);
    const directiveDom = new JSDOM(directive.html);
    try {
      // Copy buttons have per-compilation random identifiers.
      for (const dom of [fenceDom, directiveDom]) {
        dom.window.document.querySelectorAll('[data-code-id]').forEach(button => button.removeAttribute('data-code-id'));
      }
      const wrapper = fenceDom.window.document.querySelector('#diagram')!;
      expect(wrapper?.outerHTML).toBe(directiveDom.window.document.querySelector('#diagram')?.outerHTML);
      expect(wrapper.classList.contains('glass-effect')).toBe(true);
      expect(wrapper.classList.contains('p-4')).toBe(true);
      expect(wrapper.classList.contains('max-w-[400px]')).toBe(true);
      expect(wrapper.getAttribute('aria-label')).toBe('A & B');
      expect(wrapper.querySelector('code')?.textContent).toBe(source);
      expect(fence.css).toBe(directive.css);
      expect(fence.metadata.warnings).toEqual([]);
    } finally {
      fenceDom.window.close();
      directiveDom.window.close();
    }
  });

  it('uses configured defaults, variants, sizes and custom mappings without leaking to another document', async () => {
    const source = 'graph TD\n A-->B';
    const options = {
      componentConfig: {mermaid: {
        defaultVariant: 'editorial', defaultSize: 'roomy', defaultClasses: ['border'],
        variants: {editorial: {classes: ['font-serif']}}, sizes: {roomy: {classes: ['p-8']}},
      }},
      styleMappings: {brand: 'text-primary-600'},
      inlineScripts: false,
    };
    const [fence, directive, normal] = await Promise.all([
      compile('```mermaid {brand p-2}\n' + source + '\n```', options),
      compile(':::mermaid {brand p-2}\n' + source + '\n:::', options),
      compile('```mermaid {}\n' + source + '\n```', {inlineScripts: false}),
    ]);
    const classNames = (html: string) => {
      const dom = new JSDOM(html);
      const classes = [...dom.window.document.querySelector('[data-component="mermaid"]')!.classList];
      dom.window.close();
      return classes;
    };
    expect(classNames(fence.html)).toEqual(classNames(directive.html));
    expect(classNames(fence.html)).toEqual(expect.arrayContaining(['font-serif', 'border', 'p-2', 'text-primary-600']));
    expect(classNames(fence.html)).not.toContain('p-8');
    expect(classNames(normal.html)).not.toContain('font-serif');
    expect(fence.css).toContain('.font-serif');
    expect(fence.css).toContain('.text-primary-600');
  });

  it('applies configured defaults to an empty attribute block', async () => {
    const result = await compile('```mermaid {}\ngraph TD\n A-->B\n```', {
      componentConfig: {mermaid: {
        defaultClasses: ['font-serif'], defaultSize: 'roomy', sizes: {roomy: {classes: ['p-8']}},
      }},
      inlineScripts: false,
    });
    const dom = new JSDOM(result.html);
    try {
      const wrapper = dom.window.document.querySelector('[data-component="mermaid"]');
      expect(wrapper).not.toBeNull();
      expect(wrapper?.classList.contains('p-8')).toBe(true);
      expect(wrapper?.classList.contains('font-serif')).toBe(true);
    } finally { dom.window.close(); }
  });

  it('preserves plain fences and other languages and wraps adjacent nested fences once', async () => {
    const ast = await parse('```mermaid\ngraph TD\n A-->B\n```\n\n```js {glass}\nconst a = 1\n```');
    expect(ast.children.map(node => node.type)).toEqual(['code', 'code']);
    const result = await compile('> ```mermaid {sm}\n> graph TD\n>  A-->B\n> ```\n>\n> ```mermaid {lg}\n> graph TD\n>  B-->C\n> ```', {inlineScripts: false});
    const dom = new JSDOM(result.html);
    try {
      expect(dom.window.document.querySelectorAll('blockquote > [data-component="mermaid"]')).toHaveLength(2);
      expect(dom.window.document.querySelectorAll('[data-component="mermaid"] [data-component="mermaid"]')).toHaveLength(0);
      expect([...dom.window.document.querySelectorAll('code')].map(code => code.textContent)).toEqual(['graph TD\n A-->B', 'graph TD\n B-->C']);
    } finally { dom.window.close(); }
  });

  it('retains the resolved wrapper through successful rendering, errors and theme retries', async () => {
    const result = await compile('```mermaid {compact sm id="diagram" aria-label="Workflow"}\ngraph TD\n A-->B\n```', {inlineScripts: false});
    const dom = new JSDOM(result.html, {runScripts: 'outside-only'});
    const wrapper = dom.window.document.querySelector('#diagram')!;
    const originalAttributes = wrapper.getAttributeNames().map(name => [name, wrapper.getAttribute(name)]);
    let fails = false;
    const calls: string[] = [];
    Object.assign(dom.window, {mermaid: {
      initialize() {},
      render(_id: string, source: string) {
        calls.push(source);
        if (fails) throw new Error('Test failure');
        return Promise.resolve({svg: '<svg></svg>'});
      },
    }});
    try {
      dom.window.eval(MERMAID_CONTROLLER);
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(wrapper.querySelector('svg')).not.toBeNull();
      expect(wrapper.querySelector('pre')?.hidden).toBe(true);
      fails = true;
      dom.window.document.documentElement.classList.toggle('dark');
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(wrapper.querySelector('pre')?.hidden).toBe(false);
      expect(wrapper.querySelector('[role="status"]')?.textContent).toContain('could not be rendered');
      fails = false;
      dom.window.document.documentElement.classList.toggle('dark');
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(calls).toEqual(Array(3).fill('graph TD\n A-->B'));
      expect(wrapper.querySelector('pre')?.hidden).toBe(true);
      expect(wrapper.querySelectorAll('.mermaid-container')).toHaveLength(0);
      expect(wrapper.getAttributeNames().map(name => [name, wrapper.getAttribute(name)])).toEqual(originalAttributes);
    } finally { dom.window.close(); }
  });
});

describe('Mermaid exports', () => {
  it.each([false, true])(
    'preserves directive source and embeds its runtime (minify=%s)',
    async (minify) => {
      const diagram =
        'classDiagram\n  class Animal {\n    +String name\n    +makeSound()\n  }\n  Animal <|-- Dog';
      const result = await compile(':::mermaid\n' + diagram + '\n:::', {
        inlineStyles: true,
        inlineScripts: true,
        minify,
      });
      const doc = new JSDOM(result.html).window.document;
      expect(doc.querySelector('code.language-mermaid')?.textContent).toBe(diagram);
      expect(doc.querySelectorAll('script[src]')).toHaveLength(0);
      expect(result.html).toContain('taildown-mermaid-');
      expect(result.html.length).toBeGreaterThan(2_000_000);
    }
  );

  it('omits the diagram library for ordinary documents', async () => {
    const result = await compile('# No diagrams');
    expect(result.html).not.toContain('taildown-mermaid-');
    expect(result.html.length).toBeLessThan(500_000);
  });

  it('keeps diagram source and retries rendering on theme changes', async () => {
    const dom = new JSDOM('<pre><code class="language-mermaid">graph TD\n A--&gt;B</code></pre>', {
      runScripts: 'outside-only',
    });
    const calls: string[] = [];
    let theme = '';
    Object.assign(dom.window, {
      mermaid: {
        initialize(options: { theme: string }) {
          theme = options.theme;
        },
        render(_id: string, source: string) {
          calls.push(source);
          return Promise.resolve({ svg: '<svg data-theme="' + theme + '"></svg>' });
        },
      },
    });
    dom.window.eval(MERMAID_CONTROLLER);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    dom.window.document.documentElement.classList.add('dark');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(calls).toEqual(['graph TD\n A-->B', 'graph TD\n A-->B']);
    expect(dom.window.document.querySelector('svg')?.getAttribute('data-theme')).toBe('dark');
    expect(dom.window.document.querySelector('pre')?.hidden).toBe(true);
    dom.window.close();
  });
});

it('reads a saved theme applied before deferred startup', async () => {
  const dom = new JSDOM('<pre><code class="language-mermaid">graph TD\n A--&gt;B</code></pre>', {
    runScripts: 'outside-only',
  });
  const themes: string[] = [];
  Object.assign(dom.window, {
    mermaid: {
      initialize(options: { theme: string }) {
        themes.push(options.theme);
      },
      render() {
        return Promise.resolve({ svg: '<svg></svg>' });
      },
    },
  });
  dom.window.eval(MERMAID_CONTROLLER);
  dom.window.document.documentElement.classList.add('dark');
  await new Promise((resolve) => setTimeout(resolve, 0));
  expect(themes).toEqual(['dark']);
  dom.window.close();
});
