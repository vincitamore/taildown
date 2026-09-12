import {mkdtemp,writeFile,unlink,rmdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {afterAll,afterEach,beforeAll,expect,it} from 'vitest';
const files:string[]=[];const dirs:string[]=[];
let bundleDir:string,bundle:string;
beforeAll(async()=>{
 bundleDir=await mkdtemp(join(tmpdir(),'taildown-loader-'));bundle=join(bundleDir,'loader.mjs');
 await build({entryPoints:[fileURLToPath(new URL('../config-loader.ts',import.meta.url))],outfile:bundle,bundle:true,platform:'node',format:'esm'});
});
afterAll(async()=>{await unlink(bundle);await rmdir(bundleDir);});
afterEach(async()=>{for(const file of files.splice(0))await unlink(file);for(const dir of dirs.splice(0))await rmdir(dir);});
async function fixture(name:string,source:string){const dir=await mkdtemp(join(tmpdir(),'taildown-config-'));dirs.push(dir);const file=join(dir,name);await writeFile(file,source);files.push(file);return {dir,file};}
function run(code:string){
 const script=`import * as api from ${JSON.stringify(pathToFileURL(bundle).href)};try{const value=await (async()=>{${code}})();console.log(JSON.stringify({value}));}catch(error){console.log(JSON.stringify({error:error.message}));}`;
 const result=JSON.parse(execFileSync(process.execPath,['--input-type=module','-'],{input:script,encoding:'utf8'}));
 if(result.error)throw new Error(result.error);return result.value;
}
const load=(options:object)=>run(`return await api.loadConfig(${JSON.stringify(options)});`);
it.each(['mjs','cjs'])('loads partial %s settings relative to cwd and preserves inherited defaults',async ext=>{
 const {dir}=await fixture('settings.'+ext,(ext==='cjs'?'module.exports = ':'export default ')+'{theme:{colors:{primary:{DEFAULT:"#123456"}}},output:{minify:true}}');
 const result=load({cwd:dir,configPath:'settings.'+ext,throwOnError:true});
 expect(result.warnings).toEqual([]);expect(result.hasUserConfig).toBe(true);
 expect(result.config.theme.colors.primary.DEFAULT).toBe('#123456');expect(result.config.theme.fonts.sans).toBeTruthy();expect(result.config.output.minify).toBe(true);
});
it('discovers a partial config without treating it as an invalid complete theme',async()=>{
 const {dir}=await fixture('taildown.config.mjs','export default {theme:{glass:{opacity:42}}};');
 const result=load({cwd:dir,throwOnError:true});expect(result.config.theme.glass.opacity).toBe(42);expect(result.warnings).toEqual([]);
});
it('rejects invalid merged settings or falls back with an explicit diagnostic',async()=>{
 const {file}=await fixture('bad.mjs','export default {theme:{glass:{opacity:140}}};');
 expect(()=>load({configPath:file,throwOnError:true})).toThrow('Glass opacity');
 const fallback=load({configPath:file});expect(fallback.hasUserConfig).toBe(false);expect(fallback.warnings.join(' ')).toContain('Glass opacity');expect(fallback.config.theme.glass.opacity).not.toBe(140);
});
it('returns isolated defaults on both missing and failed loads',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'taildown-config-'));dirs.push(dir);
 const result=run(`const options=${JSON.stringify({cwd:dir})};const first=await api.loadConfig(options);const original=first.config.theme.colors.primary.DEFAULT;first.config.theme.colors.primary.DEFAULT='#000000';const second=await api.loadConfig(options);const failed=await api.loadConfig(${JSON.stringify({configPath:join(dir,'missing.mjs')})});failed.config.theme.colors.primary.DEFAULT='#ffffff';return {original,second:second.config.theme.colors.primary.DEFAULT,third:(await api.loadConfig(options)).config.theme.colors.primary.DEFAULT};`);
 expect(result.second).toBe(result.original);expect(result.third).toBe(result.original);
});
it.each(['null','[]','42'])('rejects a non-object module export (%s)',async value=>{
 const {file}=await fixture('bad.mjs','export default '+value+';');expect(()=>run(`return await api.loadConfigFile(${JSON.stringify(file)});`)).toThrow('configuration object');
});
it('validates programmatic partial configuration after merging',()=>{
 expect(run('return api.createConfig({theme:{glass:{opacity:42}}}).theme.glass.opacity;')).toBe(42);
 expect(()=>run('return api.createConfig({theme:{glass:{opacity:140}}});')).toThrow('Glass opacity');
});
