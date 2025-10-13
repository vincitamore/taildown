#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, extname } from 'path';

const iconPattern = /:icon\[([^\]]+)\]/g;
const iconsUsed = new Set();

// Valid Lucide icon name pattern: lowercase letters, numbers, and hyphens only
const validIconPattern = /^[a-z0-9-]+$/;

function isValidIconName(name) {
  // Filter out test data, code snippets, invalid names
  if (!name || name.length === 0) return false;
  if (!validIconPattern.test(name)) return false;
  if (name.includes(' ')) return false;
  if (name.includes('@')) return false;
  if (name.includes(':')) return false;
  if (name.includes('_')) return false;
  if (name.includes('.')) return false;
  if (name.includes('(')) return false;
  if (name.includes(')')) return false;
  if (name.includes('<')) return false;
  if (name.includes('>')) return false;
  if (name.includes('=')) return false;
  if (name.includes('$')) return false;
  if (name.includes('"')) return false;
  if (name.startsWith('icon')) return false; // Test data like "icon-name", "iconName"
  if (name.startsWith('my-')) return false; // Test data like "my-logo"
  if (name === 'name') return false; // Variable name
  if (name.match(/^\d/)) return false; // Starts with number
  
  return true;
}

function scanFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const matches = content.matchAll(iconPattern);
    
    for (const match of matches) {
      let iconName = match[1].split('{')[0].trim(); // Extract just the icon name, remove variants
      iconName = iconName.toLowerCase(); // Normalize to lowercase
      
      if (isValidIconName(iconName)) {
        iconsUsed.add(iconName);
      }
    }
  } catch (err) {
    // Skip files that can't be read
  }
}

function scanDirectory(dirPath) {
  try {
    const entries = readdirSync(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, dist, and hidden folders
        if (entry !== 'node_modules' && entry !== 'dist' && !entry.startsWith('.')) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = extname(entry);
        // Scan source and docs files
        if (['.ts', '.tsx', '.td', '.md', '.html'].includes(ext)) {
          scanFile(fullPath);
        }
      }
    }
  } catch (err) {
    // Skip directories that can't be read
  }
}

console.log('🔍 Scanning codebase for Lucide icon usage...\n');

// Scan the entire project
scanDirectory('.');

const sortedIcons = Array.from(iconsUsed).sort();

console.log(`📊 Found ${sortedIcons.length} unique valid icons:\n`);
sortedIcons.forEach(icon => console.log(`  - ${icon}`));

// Write to file for reference
const output = {
  totalIcons: sortedIcons.length,
  icons: sortedIcons,
  timestamp: new Date().toISOString(),
};

writeFileSync('scripts/icons-used.json', JSON.stringify(output, null, 2));

console.log(`\n✅ Icon list saved to scripts/icons-used.json`);
console.log(`\n📦 Bundle impact: ${sortedIcons.length} icons × ~3KB = ~${sortedIcons.length * 3}KB (vs 18.3 MB for all icons)`);
console.log(`💾 Savings: ~${((18.3 * 1024) - (sortedIcons.length * 3)) / 1024}MB (${((1 - (sortedIcons.length * 3) / (18.3 * 1024)) * 100).toFixed(1)}% reduction)`);

