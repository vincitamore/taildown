#!/usr/bin/env node
import {readFile, readdir, mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join, basename} from 'node:path';
import {compile} from '../packages/compiler/dist/index.js';
const root = fileURLToPath(new URL('../examples/', import.meta.url));
const output = join(root, 'dist');
await mkdir(output, {recursive:true});
let failed = false;
for (const entry of (await readdir(root, {withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
  if (!entry.isFile() || !entry.name.endsWith('.td')) continue;
  try {
    const result = await compile(await readFile(join(root, entry.name), 'utf8'), {inlineStyles:true,inlineScripts:true,title:basename(entry.name,'.td')});
    if (result.metadata.warnings.length) {
      failed = true;
      console.error(entry.name + ': ' + JSON.stringify(result.metadata.warnings));
    }
    await writeFile(join(output, basename(entry.name,'.td') + '.html'), result.html);
    console.log(entry.name);
  } catch (error) {
    failed = true;
    console.error(entry.name + ': ' + error.message);
  }
}
process.exitCode = failed ? 1 : 0;
