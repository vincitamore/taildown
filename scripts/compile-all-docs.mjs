/**
 * Compile all .td documentation files to HTML
 * This script finds all .td files in the workspace and compiles them to HTML
 */

import { compile } from '../packages/compiler/dist/index.js';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname, basename, extname } from 'path';

// Directories to search for .td files
const searchDirs = [
  resolve('docs'),
  resolve('examples'),
  resolve('.') // For root level files like README.td and ASSESSMENT.td
];

// Exclude patterns
const excludePatterns = [
  'node_modules',
  '.git',
  'dist',
  'syntax-tests' // Don't compile test fixtures
];

function shouldExclude(path) {
  return excludePatterns.some(pattern => path.includes(pattern));
}

function findTdFiles(dir, recursive = true) {
  const results = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      
      if (shouldExclude(fullPath)) {
        continue;
      }
      
      try {
        const stat = statSync(fullPath);
        
        if (stat.isDirectory() && recursive) {
          results.push(...findTdFiles(fullPath, recursive));
        } else if (item.endsWith('.td')) {
          results.push(fullPath);
        }
      } catch (err) {
        // Skip files that can't be accessed
        continue;
      }
    }
  } catch (err) {
    // Skip directories that can't be accessed
  }
  
  return results;
}

console.log('==========================================');
console.log('Compiling All Taildown Documentation');
console.log('==========================================\n');

// Collect all .td files
let allTdFiles = [];
for (const dir of searchDirs) {
  const recursive = dir !== resolve('.'); // Only search recursively in subdirectories
  allTdFiles.push(...findTdFiles(dir, recursive));
}

// Remove duplicates
allTdFiles = [...new Set(allTdFiles)];

console.log(`Found ${allTdFiles.length} .td files\n`);

let success = 0;
let failed = 0;
const errors = [];

for (const tdFile of allTdFiles) {
  const inputDir = dirname(tdFile);
  const inputBase = basename(tdFile, extname(tdFile));
  const outputHtml = join(inputDir, `${inputBase}.html`);
  const relativePath = tdFile.replace(resolve('.') + '/', '');
  
  try {
    process.stdout.write(`Compiling: ${relativePath}... `);
    
    const source = readFileSync(tdFile, 'utf-8');
    const result = await compile(source, {
      inlineStyles: true,
      inlineScripts: true,
      minify: false
    });
    
    writeFileSync(outputHtml, result.html, 'utf-8');
    console.log('✓');
    success++;
  } catch (error) {
    console.log('✗');
    errors.push({ file: relativePath, error: error.message });
    failed++;
  }
}

console.log('\n==========================================');
console.log(`Success: ${success}`);
console.log(`Failed:  ${failed}`);
console.log('==========================================');

if (errors.length > 0) {
  console.log('\nErrors:');
  for (const { file, error } of errors) {
    console.log(`  ${file}: ${error}`);
  }
}

console.log('');

process.exit(failed > 0 ? 1 : 0);
