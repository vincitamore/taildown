import {afterAll,afterEach,beforeAll,expect,it} from 'vitest';
import {mkdtemp,writeFile,readFile,rm,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {dirname,join,resolve} from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';import {JSDOM} from 'jsdom';
const fixtureDirs:string[]=[];let bundleDir:string,cli:string;
beforeAll(async()=>{bundleDir=await mkdtemp(fileURLToPath(new URL('../../.tmp-cli-config-',import.meta.url)));cli=join(bundleDir,'cli.mjs');await build({entryPoints:[fileURLToPath(new URL('../cli.ts',import.meta.url))],outfile:cli,bundle:true,platform:'node',format:'esm',packages:'external'});});
afterAll(async()=>{if(dirname(bundleDir)!==fileURLToPath(new URL('../../',import.meta.url)).replace(/[\\/]$/,''))throw new Error('Unexpected bundle directory');await rm(bundleDir,{recursive:true,force:true});});
afterEach(async()=>{for(const dir of fixtureDirs.splice(0)){if(dirname(resolve(dir))!==resolve(tmpdir()))throw new Error('Unexpected fixture directory');await rm(dir,{recursive:true,force:true});}});
async function fixture(config?:string){const dir=await mkdtemp(join(tmpdir(),'taildown-cli-config-'));fixtureDirs.push(dir);await writeFile(join(dir,'input.td'),'# Configured document {primary serif}');if(config)await writeFile(join(dir,'taildown.config.cjs'),'module.exports = '+config);return dir;}
function run(cwd:string,args:string[]=[]){return spawnSync(process.execPath,[cli,'compile','input.td',...args],{cwd,encoding:'utf8'});}
it('discovers palette and font settings without changing the default inline output',async()=>{
 const dir=await fixture('{theme:{colors:{primary:{600:"#14532d"}},fonts:{serif:"Georgia, serif"}}}');const result=run(dir);expect(result.status,result.stderr).toBe(0);
 const html=await readFile(join(dir,'input.html'),'utf8');expect(html).toContain('--primary-text: #14532d;');expect(html).toContain('font-family: Georgia, serif;');expect(new JSDOM(html).window.document.querySelector('link[rel="stylesheet"]')).toBeNull();
});
it('uses configured separate output and honors explicit inline and minification overrides',async()=>{
 const dir=await fixture('{output:{inlineStyles:false,minify:true}}');expect(run(dir).status).toBe(0);expect(await readdir(dir)).toContain('input.css');
 const separate=new JSDOM(await readFile(join(dir,'input.html'),'utf8')).window.document;expect(separate.querySelector('link[rel="stylesheet"]')?.getAttribute('href')).toBe('input.css');
 const override=run(dir,['--inline','--no-minify','-o','override.html']);expect(override.status,override.stderr).toBe(0);const html=await readFile(join(dir,'override.html'),'utf8');expect(html.split('\n').length).toBeGreaterThan(10);expect(new JSDOM(html).window.document.querySelector('link[rel="stylesheet"]')).toBeNull();
});
it('loads an explicit ESM file and supports skipping a broken discovered configuration',async()=>{
 const dir=await fixture('null');await writeFile(join(dir,'settings.mjs'),'export default {output:{darkMode:false}}');
 const explicit=run(dir,['--config','settings.mjs']);expect(explicit.status,explicit.stderr).toBe(0);expect(new JSDOM(await readFile(join(dir,'input.html'),'utf8')).window.document.querySelector('script')).toBeNull();
 const skipped=run(dir,['--no-config','-o','skipped.html']);expect(skipped.status,skipped.stderr).toBe(0);
});
it.each(['{output:{minify:"false"}}','{theme:{glass:{opacity:42}}}'])('fails configuration %s before replacing an existing export',async config=>{
 const dir=await fixture(config);await writeFile(join(dir,'input.html'),'Previous export');const result=run(dir);expect(result.status).toBe(1);expect(await readFile(join(dir,'input.html'),'utf8')).toBe('Previous export');expect(await readdir(dir)).not.toContain('input.css');
});
it('rejects contradictory output flags before any output is written',async()=>{
 const dir=await fixture();const result=run(dir,['--inline','--separate']);expect(result.status).toBe(1);expect(result.stderr).toContain('either --inline or --separate');expect(await readdir(dir)).not.toContain('input.html');
});
it('preserves the configuration when an output would overwrite it',async()=>{
 const dir=await fixture('{output:{minify:true}}');const path=join(dir,'taildown.config.cjs');const original=await readFile(path,'utf8');
 const result=run(dir,['-o','taildown.config.cjs']);expect(result.status).toBe(1);expect(result.stderr).toContain('conflicts with source');expect(await readFile(path,'utf8')).toBe(original);
});
it('does not silently discard an explicit asset destination in inline mode',async()=>{
 const dir=await fixture();const result=run(dir,['--css','custom.css']);expect(result.status).toBe(1);expect(result.stderr).toContain('require separate output');expect(await readdir(dir)).not.toContain('input.html');
});
it('applies configured component variants and default sizes to the exported page', async () => {
 const dir = await fixture(JSON.stringify({components: {card: {defaultVariant: 'editorial', defaultSize: 'roomy', variants: {editorial: {classes: ['font-serif']}}, sizes: {roomy: {classes: ['p-8']}}}}}));
 await writeFile(join(dir, 'input.td'), ':::card\nA composed page\n:::');
 const result = run(dir); expect(result.status, result.stderr).toBe(0);
 const doc = new JSDOM(await readFile(join(dir, 'input.html'), 'utf8')).window.document;
 expect(doc.querySelector('.component-card')?.classList.contains('font-serif')).toBe(true);
 expect(doc.querySelector('.component-card')?.classList.contains('p-8')).toBe(true);
 expect(doc.querySelector('style')?.textContent).toContain('.font-serif');
});
