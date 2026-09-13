#!/usr/bin/env node
import {readFile, writeFile, readdir, lstat} from 'node:fs/promises';
import {resolve, extname, dirname, basename, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const extensions = new Set(['.td', '.tdown', '.taildown']);
const root = fileURLToPath(new URL('../syntax-tests/fixtures/', import.meta.url));
async function inputsIn(directory) {
  const inputs = [];
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) inputs.push(...await inputsIn(path));
    else if (entry.isFile() && extensions.has(extname(path))) inputs.push(path);
  }
  return inputs.sort();
}

try {
  const args = process.argv.slice(2);
  if (args.length !== 1 || args[0] === '--help') {
    console.log('Usage: node scripts/generate-fixtures.mjs <input.td|input.tdown|input.taildown|--all>');
    if (args[0] !== '--help' || args.length !== 1) process.exitCode = 1;
  } else {
    const inputs = args[0] === '--all' ? await inputsIn(root) : [resolve(args[0])];
    const outputs = new Set();
    const jobs = [];
    // Validate every destination before writing any expectation.
    for (const input of inputs) {
      const extension = extname(input);
      if (!extensions.has(extension)) throw new Error('Input must end in .td, .tdown, or .taildown');
      if (!(await lstat(input)).isFile()) throw new Error('Input must be a regular file: ' + input);
      const output = join(dirname(input), basename(input, extension) + '.ast.json');
      if (output === input || outputs.has(output)) throw new Error('Conflicting fixture output: ' + output);
      outputs.add(output);
      try {
        if (!(await lstat(output)).isFile()) throw new Error('Output must be a regular file: ' + output);
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
      jobs.push({input, output});
    }
    const {parse} = await import('../packages/compiler/dist/index.js');
    for (const {input, output} of jobs) {
      const ast = await parse(await readFile(input, 'utf8'));
      await writeFile(output, JSON.stringify(ast, null, 2) + '\n');
      console.log(output);
    }
    console.log('Generated ' + jobs.length + ' expectations. Review each diff against SYNTAX.md before accepting it.');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
