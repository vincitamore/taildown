/**
 * Regenerate all test fixtures
 */

import { parse } from '../packages/compiler/dist/index.js';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const fixturesDir = resolve('syntax-tests/fixtures');

function findTdFiles(dir) {
  const results = [];
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push(...findTdFiles(fullPath));
    } else if (item.endsWith('.td')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

console.log('==========================================');
console.log('Regenerating All Syntax Test Fixtures');
console.log('==========================================\n');

const tdFiles = findTdFiles(fixturesDir);
console.log(`Found ${tdFiles.length} fixture files\n`);

let success = 0;
let failed = 0;

for (const tdFile of tdFiles) {
  const outputFile = tdFile.replace(/\.td$/, '.ast.json');
  const relativePath = tdFile.replace(resolve('.') + '\\', '').replace(/\\/g, '/');
  
  try {
    process.stdout.write(`Processing: ${relativePath}... `);
    const source = readFileSync(tdFile, 'utf-8');
    const ast = await parse(source);
    writeFileSync(outputFile, JSON.stringify(ast, null, 2) + '\n');
    console.log('✓');
    success++;
  } catch (error) {
    console.log('✗');
    console.error(`  Error: ${error.message}`);
    failed++;
  }
}

console.log('\n==========================================');
console.log(`Success: ${success}`);
console.log(`Failed:  ${failed}`);
console.log('==========================================\n');

process.exit(failed > 0 ? 1 : 0);

