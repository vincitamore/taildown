import {expect,it} from 'vitest';
import {compile} from '../index';

it('generates the slate palette through the same configurable color pipeline', async () => {
 const source = 'Slate {bg-slate-50 text-slate-900 dark:bg-slate-900/40 border-slate-200}';
 const result = await compile(source);
 expect(result.css).toContain('.text-slate-900 { color: #0f172a; }');
 expect(result.css).toContain('.border-slate-200 { border-color: #e2e8f0; }');
 expect(result.css).toContain('color-mix(in srgb, #0f172a 40%, transparent)');
 const custom = await compile(source, {theme:{colors:{slate:{900:'#123456'}}}});
 expect(custom.css).toContain('.text-slate-900 { color: #123456; }');
});

it('composes color opacity with configured colors, dark and responsive variants', async () => {
 const result = await compile('Opacity {bg-forest/25 dark:bg-forest/40 md:text-forest/80 border-forest/0}\n\nInvalid {bg-forest/101}', {theme:{colors:{forest:'#14532d'}}});
 expect(result.css).toContain('.bg-forest\\/25 { background-color: color-mix(in srgb, #14532d 25%, transparent); }');
 expect(result.css).toContain('.dark .dark\\:bg-forest\\/40 { background-color: color-mix(in srgb, #14532d 40%, transparent); }');
 expect(result.css).toContain('.md\\:text-forest\\/80 { color: color-mix(in srgb, #14532d 80%, transparent); }');
 expect(result.css).toContain('.border-forest\\/0 { border-color: color-mix(in srgb, #14532d 0%, transparent); }');
 expect(result.css).not.toContain('.bg-forest\\/101 {');
});

it('emits explicit dark utilities composed with states and breakpoints', async () => {
 const result = await compile('Theme {text-gray-900 dark:text-gray-100 dark:hover:text-primary-600 md:dark:text-primary-600 dark:md:grid-cols-3}', {theme:{colors:{primary:{600:'#234567'}}}});
 expect(result.css).toContain('.dark .dark\\:text-gray-100 { color: #f3f4f6; }');
 expect(result.css).toContain('.dark .dark\\:hover\\:text-primary-600:hover { color: #234567; }');
 expect(result.css).toContain('.dark .md\\:dark\\:text-primary-600 { color: #234567; }');
 expect(result.css).toContain('.dark .dark\\:md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }');
});

it('applies per-document colors to semantic, numbered, hover and responsive output',async()=>{
 const result=await compile('Semantic {primary}\n\nNumbered {text-primary-600}\n\nHover {hover:bg-primary-700}\n\nResponsive {md:text-primary-600}\n\nCustom {text-forest}',{inlineStyles:true,theme:{colors:{primary:{DEFAULT:'#123456',600:'#234567',700:'#345678'},forest:'#14532d'}}});
 expect(result.css).toContain('--primary: #123456;');
 expect(result.css).toContain('.text-primary-600 { color: #234567; }');
 expect(result.css).toContain('.hover\\:bg-primary-700:hover { background-color: #345678; }');
 expect(result.css).toContain('.md\\:text-primary-600 { color: #234567; }');
 expect(result.css).toContain('.text-forest { color: #14532d; }');
 expect(result.html).toContain('--primary: #123456;');
});
it('snapshots themes before awaiting compilation and isolates concurrent documents',async()=>{
 const theme={colors:{primary:{DEFAULT:'#123456',600:'#234567'}},fonts:{sans:'Georgia, serif'}};
 const first=compile('# First',{theme});theme.colors.primary.DEFAULT='#ffffff';theme.fonts.sans='monospace';
 const [a,b,normal]=await Promise.all([first,compile('# Second',{theme:{colors:{primary:{DEFAULT:'#654321'}},fonts:{sans:'Verdana, sans-serif'}}}),compile('# Default')]);
 expect(a.css).toContain('--primary: #123456;');expect(a.css).toContain('--font-sans: Georgia, serif;');
 expect(b.css).toContain('--primary: #654321;');expect(b.css).toContain('--font-sans: Verdana, sans-serif;');
 expect(normal.css).not.toContain('#123456');expect(normal.css).not.toContain('#654321');
});
it('applies body, code and explicit font families without filesystem configuration',async()=>{
 const result=await compile('Body\n\n`code`\n\nSerif {font-serif}',{theme:{fonts:{sans:'Verdana, sans-serif',mono:'Consolas, monospace',serif:'Georgia, serif'}}});
 expect(result.css).toContain('--font-sans: Verdana, sans-serif;');
 expect(result.css).toContain('--font-mono: Consolas, monospace;');
 expect(result.css).toContain('.font-serif { font-family: Georgia, serif; }');
 expect(result.css).toContain('font-family: var(--font-sans, system-ui, -apple-system, sans-serif);');
});
it('rejects malformed color values before generating CSS',async()=>{
 await expect(compile('Invalid',{theme:{colors:{primary:{DEFAULT:'not-a-color'}}}})).rejects.toThrow('Invalid theme');
});
it('snapshots a new named color scale before compilation yields', async () => {
 const forest = {DEFAULT: '#14532d', 600: '#166534'};
 const pending = compile('Forest {text-forest-600}', {theme: {colors: {forest}}});
 forest[600] = '#ffffff';
 const result = await pending;
 expect(result.css).toContain('.text-forest-600 { color: #166534; }');
});
