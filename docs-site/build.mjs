#!/usr/bin/env node
/**
 * Documentation Site Build Script
 * Compiles all .td files in docs-site to HTML
 */

import { compile } from '../packages/compiler/dist/index.js';
import { promises as fs } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = __dirname;

async function findTdFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    
    if (item.isDirectory()) {
      // Skip node_modules and hidden directories
      if (item.name.startsWith('.') || item.name === 'node_modules') {
        continue;
      }
      files.push(...await findTdFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.td')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function compileTdFile(filePath) {
  console.log(`Compiling: ${basename(filePath)}`);
  
  try {
    // Read source file
    const source = await fs.readFile(filePath, 'utf-8');
    
    // Compile with dark mode enabled
    const result = await compile(source, {
      inlineStyles: true,      // Embed CSS in HTML
      inlineScripts: true,     // Embed JS in HTML (for dark mode)
      minify: false,           // Keep readable for debugging
      darkMode: true,          // Enable dark mode
    });
    
    // Write HTML output
    const htmlPath = filePath.replace('.td', '.html');
    await fs.writeFile(htmlPath, result.html);
    
    console.log(`  ✓ Created: ${basename(htmlPath)}`);
    
    return { success: true, file: basename(filePath) };
  } catch (error) {
    console.error(`  ✗ Error compiling ${basename(filePath)}:`, error.message);
    return { success: false, file: basename(filePath), error: error.message };
  }
}

async function main() {
  console.log('🚀 Building Taildown Documentation Site\n');
  console.log('📁 Searching for .td files...\n');
  
  const tdFiles = await findTdFiles(DOCS_DIR);
  
  if (tdFiles.length === 0) {
    console.log('No .td files found!');
    return;
  }
  
  console.log(`Found ${tdFiles.length} file(s) to compile:\n`);
  
  const results = await Promise.all(tdFiles.map(compileTdFile));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully compiled: ${successful} file(s)`);
  if (failed > 0) {
    console.log(`❌ Failed to compile: ${failed} file(s)`);
  }
  console.log('='.repeat(50));
  
  console.log('\n📦 Documentation site built successfully!');
  console.log(`   Open docs-site/index.html in your browser\n`);
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
