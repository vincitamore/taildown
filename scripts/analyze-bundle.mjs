#!/usr/bin/env node

/**
 * Bundle Content Analyzer
 * 
 * Analyzes what's actually in the bundled JavaScript to identify bloat.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function formatBytes(bytes) {
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBundle(bundlePath) {
  const report = [];
  report.push('='.repeat(80));
  report.push('TAILDOWN BROWSER BUNDLE CONTENT ANALYSIS');
  report.push('='.repeat(80));
  report.push('');
  report.push(`Analyzed: ${new Date().toISOString()}`);
  report.push(`Bundle: ${bundlePath}`);
  report.push('');
  
  const code = readFileSync(bundlePath, 'utf8');
  const totalSize = code.length;
  
  report.push(`Total bundle size: ${formatBytes(totalSize)}`);
  report.push('');
  
  // Analyze content by looking for package indicators
  const packages = [
    { name: 'Mermaid', pattern: /mermaid/gi },
    { name: 'Shiki', pattern: /shiki/gi },
    { name: 'Lucide', pattern: /lucide/gi },
    { name: 'CodeMirror', pattern: /@codemirror|codemirror/gi },
    { name: 'Unified/Remark', pattern: /unified|remark|rehype/gi },
    { name: 'Zod', pattern: /\bzod\b/gi },
    { name: 'Temml', pattern: /temml/gi },
  ];
  
  report.push('PACKAGE MENTIONS IN BUNDLE:');
  report.push('-'.repeat(80));
  
  for (const pkg of packages) {
    const matches = code.match(pkg.pattern);
    const count = matches ? matches.length : 0;
    report.push(`  ${pkg.name.padEnd(30)} ${count.toString().padStart(8)} mentions`);
  }
  
  // Look for large inline data (base64, arrays, etc)
  report.push('');
  report.push('POTENTIAL BLOAT INDICATORS:');
  report.push('-'.repeat(80));
  
  // Check for base64 data
  const base64Pattern = /["']data:[^"']{1000,}["']/g;
  const base64Matches = code.match(base64Pattern);
  if (base64Matches) {
    const totalBase64Size = base64Matches.reduce((sum, m) => sum + m.length, 0);
    report.push(`  Base64 data:        ${formatBytes(totalBase64Size)} (${base64Matches.length} chunks)`);
  }
  
  // Check for large string literals
  const largeStrings = code.match(/["'][^"']{5000,}["']/g);
  if (largeStrings) {
    const totalStringSize = largeStrings.reduce((sum, s) => sum + s.length, 0);
    report.push(`  Large strings:      ${formatBytes(totalStringSize)} (${largeStrings.length} strings)`);
  }
  
  // Check for large arrays
  const largeArrays = code.match(/\[[^\]]{10000,}\]/g);
  if (largeArrays) {
    const totalArraySize = largeArrays.reduce((sum, a) => sum + a.length, 0);
    report.push(`  Large arrays:       ${formatBytes(totalArraySize)} (${largeArrays.length} arrays)`);
  }
  
  // Check for icon data
  const iconPattern = /"(?:icon|svg)[^"]*":\s*"[^"]{100,}"/gi;
  const iconMatches = code.match(iconPattern);
  if (iconMatches) {
    const totalIconSize = iconMatches.reduce((sum, m) => sum + m.length, 0);
    report.push(`  Icon/SVG data:      ${formatBytes(totalIconSize)} (${iconMatches.length} icons)`);
  }
  
  // Check for diagram/mermaid data
  const diagramPattern = /diagram|flowchart|sequence|gantt|graph/gi;
  const diagramMatches = code.match(diagramPattern);
  if (diagramMatches) {
    report.push(`  Diagram keywords:   ${diagramMatches.length} mentions (possible Mermaid)`);
  }
  
  // Check for syntax highlighting data
  const syntaxPattern = /grammar|textmate|token|language/gi;
  const syntaxMatches = code.match(syntaxPattern);
  if (syntaxMatches) {
    report.push(`  Syntax keywords:    ${syntaxMatches.length} mentions (possible Shiki)`);
  }
  
  // Estimated breakdown by file size contribution
  report.push('');
  report.push('ESTIMATED SIZE BREAKDOWN:');
  report.push('-'.repeat(80));
  
  const estimatedBreakdown = [
    { name: 'CodeMirror (~400KB expected)', size: 400 * 1024 },
    { name: 'Unified/Remark/Rehype (~200KB)', size: 200 * 1024 },
    { name: 'Other core (~100KB)', size: 100 * 1024 },
    { name: 'BLOAT (Mermaid/Lucide/etc)', size: totalSize - 700 * 1024 }
  ];
  
  for (const item of estimatedBreakdown) {
    const percent = ((item.size / totalSize) * 100).toFixed(1);
    report.push(`  ${item.name.padEnd(40)} ${formatBytes(item.size).padStart(12)}  (${percent}%)`);
  }
  
  report.push('');
  report.push('RECOMMENDATIONS:');
  report.push('-'.repeat(80));
  
  if (totalSize > 2 * 1024 * 1024) {
    report.push('  ⚠️  Bundle is > 2MB - optimization urgently needed!');
  }
  
  const mermaidMentions = code.match(/mermaid/gi)?.length || 0;
  if (mermaidMentions > 100) {
    report.push('  🔴 Mermaid is bundled - should be external (63MB in node_modules)');
  }
  
  const lucideMentions = code.match(/lucide/gi)?.length || 0;
  if (lucideMentions > 100) {
    report.push('  🟠 Lucide icons bundled - tree-shake to only used icons');
  }
  
  const shikiMentions = code.match(/shiki/gi)?.length || 0;
  if (shikiMentions > 50) {
    report.push('  🟡 Shiki may be bundled - consider external for browser (577KB total)');
  }
  
  report.push('');
  report.push('='.repeat(80));
  
  return report.join('\n');
}

// Analyze the browser bundle
const bundlePath = resolve(__dirname, '../packages/compiler/dist/taildown-browser.js');
const outputPath = resolve(__dirname, '../bundle-analysis.log');

console.log('Analyzing bundle content...');
const report = analyzeBundle(bundlePath);

writeFileSync(outputPath, report, 'utf8');
console.log(report);
console.log('');
console.log(`Report saved to: ${outputPath}`);

