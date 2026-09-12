import {afterEach, expect, it} from 'vitest';
import {mkdtempSync,writeFileSync,readFileSync,rmSync,linkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {resolveCompileOutput} from '../src/file-output.js';
const directories: string[]=[];
function input(name: string) {const dir=mkdtempSync(join(tmpdir(),'taildown-mcp-'));directories.push(dir);const path=join(dir,name);writeFileSync(path,'# Original');return path;}
afterEach(()=>directories.splice(0).forEach(dir=>rmSync(dir,{recursive:true,force:true})));
it('rejects unsupported extensions before any write can replace source',()=>{
  const path=input('notes.txt');expect(()=>resolveCompileOutput(path)).toThrow('Input must');expect(readFileSync(path,'utf8')).toBe('# Original');
});
it.each(['.td','.tdown','.taildown','.TD'])('derives a separate output for %s',extension=>{
  const path=input("author's notes"+extension);expect(resolveCompileOutput(path)).toBe(path.slice(0,-extension.length)+'.html');
});
it('rejects both explicit same-source paths and hard-link aliases',()=>{
  const path=input('notes.td');expect(()=>resolveCompileOutput(path,path)).toThrow('conflicts');
  const alias=join(path,'..','alias.html');linkSync(path,alias);expect(()=>resolveCompileOutput(path,alias)).toThrow('conflicts');
});
