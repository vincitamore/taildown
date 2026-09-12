import {expect,it} from 'vitest';
import {compile} from '../index';

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
