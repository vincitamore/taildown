#!/usr/bin/env node
import { statSync } from 'fs';
import { resolve } from 'path';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node check-file-size.mjs <file-path>');
  process.exit(1);
}

try {
  const stats = statSync(resolve(filePath));
  const sizeKB = stats.size / 1024;
  const sizeMB = sizeKB / 1024;
  
  console.log(`File: ${filePath}`);
  console.log(`Size: ${stats.size.toLocaleString()} bytes`);
  console.log(`      ${sizeKB.toFixed(2)} KB`);
  console.log(`      ${sizeMB.toFixed(2)} MB`);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}

