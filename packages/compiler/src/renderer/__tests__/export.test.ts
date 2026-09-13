import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { JSDOM } from 'jsdom';
import { compile } from '../../index';

const options = { inlineStyles: true, inlineScripts: true, darkMode: false, autoFix: false };

describe('document export', () => {
  it.each(['python', 'html', 'taildown', 'unknown-language', ''])('copies original code rather than highlighted entities: %s', async language => {
    const source = '<tag title="café Ω"> &amp; &#x3C; & "a  b"\n    second line';
    for (const minify of [false, true]) {
      const result = await compile('```' + language + '\n' + source + '\n```', {...options, minify});
      const dom = new JSDOM(result.html);
      try {
        expect(dom.window.document.querySelector('.code-copy-btn')?.getAttribute('data-code-text')).toBe(source);
      } finally { dom.window.close(); }
    }
  });
  it('preserves code layout and clipboard text when minifying', async () => {
    const source = '```python\ndef greet():\n    # Keep this comment on its own line\n    return "a  b"\n```';
    const ordinary = await compile(source, options);
    const compact = await compile(source, { ...options, minify: true });
    const code = (html: string) => html.match(/<code[^>]*>([\s\S]*?)<\/code>/)?.[1];
    const clipboard = (html: string) => html.match(/data-code-text="([\s\S]*?)" aria-label/)?.[1];
    expect(code(compact.html)).toBe(code(ordinary.html));
    expect(clipboard(compact.html)).toBe(clipboard(ordinary.html));
    expect(clipboard(compact.html)).toContain('\n    return');
    expect(compact.html.length).toBeLessThan(ordinary.html.length);
  });

  it.each([false, true])('initializes the exported runtime with minify=%s', async (minify) => {
    const result = await compile(':::tabs\n## One\nFirst\n## Two\nSecond\n:::', { ...options, minify });
    const script = result.html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeTruthy();
    const events: string[] = [];
    runInNewContext(script!, {
      console: { log() {} },
      document: {
        readyState: 'loading',
        addEventListener(event: string) { events.push(event); },
      },
    });
    // A syntactically valid comment is not an initialized runtime.
    expect(events).toContain('DOMContentLoaded');
  });

  it('retains the separating space between inline elements', async () => {
    const result = await compile('**Hello** *world*', { ...options, minify: true });
    expect(result.html).toContain('<strong>Hello</strong> <em>world</em>');
  });

  it('preserves repeated and boundary spaces inside inline code', async () => {
    const source = 'Before `  a  b  ` after';
    const ordinary = await compile(source, options);
    const compact = await compile(source, { ...options, minify: true });
    expect(compact.html.match(/<code>[\s\S]*?<\/code>/)?.[0])
      .toBe(ordinary.html.match(/<code>[\s\S]*?<\/code>/)?.[0]);
    expect(compact.html).toContain('<code> a  b </code>');
  });

  it('escapes separate asset filenames without changing their decoded values', async () => {
    const result = await compile('```text\nhello\n```', {
      ...options, inlineStyles: false, inlineScripts: false,
      cssFilename: 'a"b&c.css', jsFilename: 'a"b&c.js',
    });
    expect(result.html).toContain('href="a&quot;b&amp;c.css"');
    expect(result.html).toContain('src="a&quot;b&amp;c.js"');
  });

  it.each([false, true])('escapes metadata without interpreting it as markup (minify=%s)', async (minify) => {
    const result = await compile('# Hello', {
      ...options, minify,
      title: '</title><script>bad()</script>',
      description: 'A "quoted" description & more',
      openGraph: { title: '"><img src=x onerror=bad()>' },
    });
    expect(result.html).toContain('&lt;/title&gt;&lt;script&gt;bad()&lt;/script&gt;');
    expect(result.html).toContain('A &quot;quoted&quot; description &amp; more');
    expect(result.html).not.toContain('<img src=x');
  });
});
