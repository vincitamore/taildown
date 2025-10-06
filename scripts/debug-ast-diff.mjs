/**
 * Debug AST differences
 */

import { parse } from '../packages/compiler/dist/index.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function normalizeAST(ast) {
  if (!ast || typeof ast !== 'object') {
    return ast;
  }

  const { position, attributes, ...rest } = ast;

  if (Array.isArray(rest.children)) {
    rest.children = rest.children.map(normalizeAST);
  }

  for (const key in rest) {
    if (typeof rest[key] === 'object' && rest[key] !== null) {
      rest[key] = normalizeAST(rest[key]);
    }
  }

  return rest;
}

const testFile = process.argv[2] || 'syntax-tests/fixtures/03-component-blocks/01-basic.td';
const astFile = testFile.replace('.td', '.ast.json');

console.log('Testing:', testFile);
console.log('='.repeat(60));

const source = readFileSync(resolve(testFile), 'utf-8');
const expectedAST = JSON.parse(readFileSync(resolve(astFile), 'utf-8'));

const actualAST = await parse(source);

const normalizedActual = normalizeAST(actualAST);
const normalizedExpected = normalizeAST(expectedAST);

console.log('\nNormalized ACTUAL AST:');
console.log(JSON.stringify(normalizedActual, null, 2));

console.log('\n' + '='.repeat(60));
console.log('\nNormalized EXPECTED AST:');
console.log(JSON.stringify(normalizedExpected, null, 2));

console.log('\n' + '='.repeat(60));
console.log('\nAre they equal?', JSON.stringify(normalizedActual) === JSON.stringify(normalizedExpected));

