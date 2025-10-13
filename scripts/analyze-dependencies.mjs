#!/usr/bin/env node

/**
 * Dependency Size Analyzer
 * 
 * Analyzes the size of dependencies in the compiler package and generates a report.
 */

import { readFileSync, statSync, readdirSync, writeFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getDirSize(dirPath) {
  let totalSize = 0;
  
  try {
    const files = readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = join(dirPath, file.name);
      
      if (file.isDirectory()) {
        totalSize += getDirSize(filePath);
      } else {
        try {
          const stats = statSync(filePath);
          totalSize += stats.size;
        } catch (err) {
          // Skip files that can't be read
        }
      }
    }
  } catch (err) {
    // Directory doesn't exist or can't be read
  }
  
  return totalSize;
}

function analyzePackage(packagePath, packageJsonPath) {
  const report = [];
  report.push('='.repeat(80));
  report.push('TAILDOWN COMPILER DEPENDENCY SIZE ANALYSIS');
  report.push('='.repeat(80));
  report.push('');
  report.push(`Analyzed: ${new Date().toISOString()}`);
  report.push('');
  
  // Read package.json
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const dependencies = pkg.dependencies || {};
  
  report.push('DECLARED DEPENDENCIES:');
  report.push('-'.repeat(80));
  
  const depSizes = [];
  let totalSize = 0;
  let totalInstalled = 0;
  
  for (const [name, version] of Object.entries(dependencies)) {
    const depPath = join(packagePath, 'node_modules', name);
    let size = 0;
    let installed = false;
    
    try {
      size = getDirSize(depPath);
      installed = size > 0;
      if (installed) {
        totalInstalled++;
        totalSize += size;
      }
    } catch (err) {
      // Not installed
    }
    
    depSizes.push({
      name,
      version,
      size,
      installed,
      sizeFormatted: formatBytes(size)
    });
  }
  
  // Sort by size (largest first)
  depSizes.sort((a, b) => b.size - a.size);
  
  // Print dependencies
  report.push('');
  report.push(`Total dependencies declared: ${Object.keys(dependencies).length}`);
  report.push(`Total dependencies installed: ${totalInstalled}`);
  report.push(`Total installed size: ${formatBytes(totalSize)}`);
  report.push('');
  report.push('BREAKDOWN (sorted by size):');
  report.push('');
  
  const maxNameLength = Math.max(...depSizes.map(d => d.name.length));
  const maxVersionLength = Math.max(...depSizes.map(d => d.version.length));
  
  for (const dep of depSizes) {
    const status = dep.installed ? '✓' : '✗';
    const name = dep.name.padEnd(maxNameLength);
    const version = dep.version.padEnd(maxVersionLength);
    const size = dep.sizeFormatted.padStart(12);
    
    report.push(`${status} ${name}  ${version}  ${size}`);
  }
  
  // Highlight large dependencies
  report.push('');
  report.push('LARGE DEPENDENCIES (> 1MB):');
  report.push('-'.repeat(80));
  
  const largeDeps = depSizes.filter(d => d.size > 1024 * 1024 && d.installed);
  if (largeDeps.length === 0) {
    report.push('None');
  } else {
    for (const dep of largeDeps) {
      const percent = ((dep.size / totalSize) * 100).toFixed(1);
      report.push(`  ${dep.name.padEnd(30)} ${dep.sizeFormatted.padStart(12)}  (${percent}% of total)`);
    }
  }
  
  // Check for Mermaid and Shiki specifically
  report.push('');
  report.push('KEY DEPENDENCIES FOR EDITOR:');
  report.push('-'.repeat(80));
  
  const keyDeps = ['mermaid', 'shiki', 'codemirror', '@codemirror/view', '@codemirror/state', 'lucide'];
  for (const depName of keyDeps) {
    const dep = depSizes.find(d => d.name === depName);
    if (dep) {
      const status = dep.installed ? 'INSTALLED' : 'NOT INSTALLED';
      report.push(`  ${dep.name.padEnd(30)} ${status.padEnd(15)} ${dep.sizeFormatted.padStart(12)}`);
    } else {
      report.push(`  ${depName.padEnd(30)} NOT IN PACKAGE.JSON`);
    }
  }
  
  // Check current bundle sizes
  report.push('');
  report.push('CURRENT BUNDLE SIZES:');
  report.push('-'.repeat(80));
  
  const bundlePaths = [
    { name: 'Browser bundle (ESM)', path: resolve(packagePath, 'dist/taildown-browser.js') },
    { name: 'Browser bundle (IIFE)', path: resolve(packagePath, 'dist/taildown-browser.iife.js') },
    { name: 'Editor HTML', path: resolve(__dirname, '../editor/dist/editor.html') }
  ];
  
  for (const bundle of bundlePaths) {
    try {
      const stats = statSync(bundle.path);
      report.push(`  ${bundle.name.padEnd(30)} ${formatBytes(stats.size).padStart(12)}`);
    } catch (err) {
      report.push(`  ${bundle.name.padEnd(30)} ${('NOT BUILT').padStart(12)}`);
    }
  }
  
  report.push('');
  report.push('='.repeat(80));
  report.push('END OF REPORT');
  report.push('='.repeat(80));
  
  return report.join('\n');
}

// Run analysis
const packagePath = resolve(__dirname, '../packages/compiler');
const packageJsonPath = join(packagePath, 'package.json');
const outputPath = resolve(__dirname, '../dependency-analysis.log');

console.log('Analyzing dependencies...');
const report = analyzePackage(packagePath, packageJsonPath);

// Write to file
writeFileSync(outputPath, report, 'utf8');

// Also print to console
console.log(report);
console.log('');
console.log(`Report saved to: ${outputPath}`);

