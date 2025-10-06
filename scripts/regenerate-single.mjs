/**
 * Regenerate a single test fixture
 * Usage: node scripts/regenerate-single.mjs path/to/fixture.td
 */

import { parse } from '../packages/compiler/dist/index.js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node regenerate-single.mjs path/to/fixture.td');
  process.exit(1);
}

const filePath = resolve(args[0]);
const outputPath = filePath.replace(/\.td$/, '.ast.json');

console.log(`Reading: ${filePath}`);
const source = readFileSync(filePath, 'utf-8');

console.log(`Parsing...`);
const ast = await parse(source);

console.log(`Writing: ${outputPath}`);
writeFileSync(outputPath, JSON.stringify(ast, null, 2) + '\n');

console.log('✓ Done!');

