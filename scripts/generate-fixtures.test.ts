import {afterEach, expect, it} from 'vitest';
import {mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const script = fileURLToPath(new URL('./generate-fixtures.mjs', import.meta.url));
const directories: string[] = [];
function fixture(name: string) {
  const dir = mkdtempSync(join(tmpdir(), 'taildown-fixture-'));
  directories.push(dir);
  const input = join(dir, name);
  writeFileSync(input, '# Preserve this source\n');
  return input;
}
afterEach(()=>directories.splice(0).forEach(dir=>rmSync(dir,{recursive:true,force:true})));
it.each(['notes.txt','notes.ast.json','notes'])('rejects %s without changing its contents', name=>{
  const input=fixture(name), before=readFileSync(input);
  const result=spawnSync(process.execPath,[script,input],{encoding:'utf8'});
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Input must end');
  expect(readFileSync(input)).toEqual(before);
});
it.each(['.td','.tdown','.taildown'])('writes a separate AST for a quoted path with %s', extension=>{
  const input=fixture("writer's notes " + extension), before=readFileSync(input);
  const result=spawnSync(process.execPath,[script,input],{encoding:'utf8'});
  expect(result.status,result.stderr).toBe(0);
  expect(readFileSync(input)).toEqual(before);
  const output=input.slice(0,-extension.length)+'.ast.json';
  expect(existsSync(output)).toBe(true);
  expect((JSON.parse(readFileSync(output,'utf8')) as {type: string}).type).toBe('root');
});
