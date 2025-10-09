#!/usr/bin/env node
/**
 * Taildown HTML Debugging Utility
 * Provides tools for analyzing compiled HTML output
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

/**
 * Check tooltip spacing issues with detailed character analysis
 */
async function checkTooltipSpacing(htmlPath) {
  section('Tooltip Spacing Analysis');
  
  const html = await fs.readFile(htmlPath, 'utf-8');
  
  // Find all tooltip wrappers with their complete structure
  const tooltipPattern = /<span class="tooltip-wrapper"[^>]*>(.*?)<\/span>/gs;
  const allTooltips = [...html.matchAll(tooltipPattern)];
  
  log(`Found ${allTooltips.length} tooltip wrapper(s) total`, 'cyan');
  
  let issuesFound = 0;
  
  allTooltips.forEach((match, i) => {
    const wrapperStart = match.index;
    const wrapperEnd = wrapperStart + match[0].length;
    
    // Get 100 chars before and after for context
    const contextBefore = html.substring(Math.max(0, wrapperStart - 100), wrapperStart);
    const contextAfter = html.substring(wrapperEnd, Math.min(html.length, wrapperEnd + 100));
    
    // Analyze what comes immediately after the closing </span>
    const nextChars = contextAfter.substring(0, 10);
    const firstNonWhitespace = nextChars.match(/\S/);
    const firstChar = firstNonWhitespace ? firstNonWhitespace[0] : null;
    
    // Check if there's a space immediately after </span>
    const hasSpace = /^\s/.test(contextAfter);
    
    if (!hasSpace && firstChar && firstChar !== '<') {
      issuesFound++;
      log(`\n  ✗ Issue ${issuesFound}: Tooltip ${i + 1} - Missing space before "${firstChar}"`, 'red');
      
      // Show the exact characters after </span>
      log(`    Next 10 chars after </span>: "${nextChars}"`, 'yellow');
      log(`    Char codes: [${[...nextChars.substring(0, 5)].map(c => c.charCodeAt(0)).join(', ')}]`, 'yellow');
      
      // Show visual context
      const beforeText = contextBefore.substring(Math.max(0, contextBefore.length - 40));
      const afterText = contextAfter.substring(0, 40);
      log(`    Context: ...${beforeText}[</span>]${afterText}...`, 'cyan');
      
      // Extract and show the trigger text
      const triggerMatch = match[1].match(/>([^<]+)</);
      if (triggerMatch) {
        log(`    Trigger text: "${triggerMatch[1]}"`, 'magenta');
      }
    }
  });
  
  if (issuesFound === 0) {
    log('\n✓ All tooltips have proper spacing', 'green');
    return true;
  } else {
    log(`\n✗ Total issues found: ${issuesFound}`, 'red');
    log(`  Recommendation: Check attribute extraction in parser/attributes.ts`, 'yellow');
    return false;
  }
}

/**
 * Check modal rendering
 */
async function checkModalRendering(htmlPath) {
  section('Modal Rendering Analysis');
  
  const html = await fs.readFile(htmlPath, 'utf-8');
  
  // Check for unparsed modal attributes (plain text)
  const unparsedModalPattern = /\{[^}]*modal=["'][^"']+["'][^}]*\}/g;
  const unparsed = [...html.matchAll(unparsedModalPattern)];
  
  if (unparsed.length > 0) {
    log(`✗ Found ${unparsed.length} unparsed modal attribute(s)`, 'red');
    unparsed.forEach((match, i) => {
      log(`\n  Unparsed ${i + 1}: ${match[0]}`, 'yellow');
      const context = html.substring(match.index - 100, match.index + 100);
      log(`    Context: ...${context}...`, 'cyan');
    });
  } else {
    log('✓ No unparsed modal attributes', 'green');
  }
  
  // Check for proper modal structure
  const modalTriggers = html.match(/data-modal-trigger="[^"]+"/g) || [];
  const modalBackdrops = html.match(/class="[^"]*modal-backdrop[^"]*"/g) || [];
  
  log(`\n  Modal triggers found: ${modalTriggers.length}`, 'cyan');
  log(`  Modal backdrops found: ${modalBackdrops.length}`, 'cyan');
  
  // Check for duplicate modal IDs
  const modalIds = [...html.matchAll(/id="(modal-[^"]+)"/g)].map(m => m[1]);
  const duplicates = modalIds.filter((id, i) => modalIds.indexOf(id) !== i);
  
  if (duplicates.length > 0) {
    log(`\n✗ Found duplicate modal IDs: ${[...new Set(duplicates)].join(', ')}`, 'red');
  } else {
    log(`✓ No duplicate modal IDs`, 'green');
  }
}

/**
 * Extract and display specific patterns
 */
async function extractPattern(htmlPath, pattern, description) {
  section(`Extract: ${description}`);
  
  const html = await fs.readFile(htmlPath, 'utf-8');
  const regex = new RegExp(pattern, 'g');
  const matches = [...html.matchAll(regex)];
  
  if (matches.length === 0) {
    log('No matches found', 'yellow');
    return;
  }
  
  log(`Found ${matches.length} match(es):`, 'green');
  matches.forEach((match, i) => {
    log(`\n  Match ${i + 1}:`, 'cyan');
    log(`    ${match[0]}`, 'bright');
  });
}

/**
 * Compare source and output with intelligent parsing
 */
async function compareSourceOutput(sourcePath, htmlPath, searchTerm) {
  section(`Compare: "${searchTerm}"`);
  
  const source = await fs.readFile(sourcePath, 'utf-8');
  const html = await fs.readFile(htmlPath, 'utf-8');
  
  // Find in source with full line context
  const sourceLines = source.split('\n');
  const sourceMatches = sourceLines
    .map((line, i) => ({ line: i + 1, content: line, trimmed: line.trim() }))
    .filter(({ content }) => content.includes(searchTerm));
  
  if (sourceMatches.length === 0) {
    log('Not found in source', 'yellow');
    return;
  }
  
  log(`Source (.td file): ${sourceMatches.length} occurrence(s)`, 'cyan');
  sourceMatches.forEach(({ line, trimmed }) => {
    log(`  Line ${line}: ${trimmed}`, 'bright');
    
    // Analyze the source line for special syntax
    const hasTooltip = /\{tooltip=/.test(trimmed);
    const hasModal = /\{modal=/.test(trimmed);
    const hasButton = /\{button/.test(trimmed);
    
    if (hasTooltip || hasModal || hasButton) {
      const indicators = [];
      if (hasTooltip) indicators.push('tooltip');
      if (hasModal) indicators.push('modal');
      if (hasButton) indicators.push('button');
      log(`    → Contains: ${indicators.join(', ')}`, 'magenta');
    }
  });
  
  // Find in HTML with structure analysis
  const htmlPattern = new RegExp(`.{0,150}${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.{0,150}`, 'g');
  const htmlMatches = [...html.matchAll(htmlPattern)];
  
  log(`\nCompiled HTML: ${htmlMatches.length} occurrence(s)`, 'cyan');
  if (htmlMatches.length === 0) {
    log('  Not found in HTML output', 'red');
  } else {
    htmlMatches.forEach((match, i) => {
      const snippet = match[0];
      log(`\n  Match ${i + 1}:`, 'bright');
      
      // Analyze HTML structure
      const hasModalTrigger = /data-modal-trigger/.test(snippet);
      const hasTooltipWrapper = /tooltip-wrapper/.test(snippet);
      const hasDataComponent = /data-component="(modal|tooltip)"/.test(snippet);
      
      const structureInfo = [];
      if (hasModalTrigger) structureInfo.push('modal trigger');
      if (hasTooltipWrapper) structureInfo.push('tooltip wrapper');
      if (hasDataComponent) {
        const comp = snippet.match(/data-component="(modal|tooltip)"/)?.[1];
        if (comp) structureInfo.push(`${comp} component`);
      }
      
      if (structureInfo.length > 0) {
        log(`    Structure: ${structureInfo.join(', ')}`, 'magenta');
      }
      
      // Pretty print HTML snippet
      const truncated = snippet.length > 200 ? snippet.substring(0, 200) + '...' : snippet;
      log(`    HTML: ...${truncated}...`, 'cyan');
      
      // Check for spacing issues in this snippet
      if (hasTooltipWrapper) {
        const afterSpan = snippet.match(/<\/span>(\S)/);
        if (afterSpan) {
          log(`    ⚠ Warning: No space after </span> before "${afterSpan[1]}"`, 'yellow');
        }
      }
    });
  }
}

/**
 * Check component structure
 */
async function checkComponentStructure(htmlPath) {
  section('Component Structure Overview');
  
  const html = await fs.readFile(htmlPath, 'utf-8');
  
  const components = {
    'Modals': html.match(/data-component="modal"/g)?.length || 0,
    'Tooltips': html.match(/data-component="tooltip"/g)?.length || 0,
    'Tabs': html.match(/data-component="tabs"/g)?.length || 0,
    'Accordions': html.match(/data-component="accordion"/g)?.length || 0,
    'Carousels': html.match(/data-component="carousel"/g)?.length || 0,
    'Cards': html.match(/data-component="card"/g)?.length || 0,
  };
  
  Object.entries(components).forEach(([name, count]) => {
    const color = count > 0 ? 'green' : 'yellow';
    log(`  ${name}: ${count}`, color);
  });
}

/**
 * Analyze specific HTML snippet
 */
async function analyzeSnippet(htmlPath, lineNumber) {
  section(`Analyze HTML around line ${lineNumber}`);
  
  const html = await fs.readFile(htmlPath, 'utf-8');
  const lines = html.split('\n');
  
  if (lineNumber > lines.length) {
    log('Line number exceeds file length', 'red');
    return;
  }
  
  const start = Math.max(0, lineNumber - 5);
  const end = Math.min(lines.length, lineNumber + 5);
  
  for (let i = start; i < end; i++) {
    const prefix = i === lineNumber - 1 ? '→ ' : '  ';
    const color = i === lineNumber - 1 ? 'yellow' : 'reset';
    log(`${prefix}${i + 1}: ${lines[i]}`, color);
  }
}

/**
 * Find unparsed inline attributes with detailed analysis
 */
async function findInlineAttributes(htmlPath) {
  section('Find Unparsed Inline Attributes');
  
  const html = await fs.readFile(htmlPath, 'utf-8');
  
  // Look for patterns like {button modal="..."} appearing as plain text in content
  // This regex finds text nodes containing curly braces
  const pattern = />([^<]*\{[^}]+\}[^<]*)</g;
  const matches = [...html.matchAll(pattern)];
  
  const unparsed = matches.filter(m => {
    const text = m[1]; // The captured text content
    // Filter out actual HTML attributes and CSS
    return !m[0].includes(' class=') && 
           !m[0].includes(' style=') && 
           !m[0].includes('data-') &&
           (text.includes('modal=') || text.includes('tooltip=') || text.includes('button'));
  });
  
  if (unparsed.length === 0) {
    log('✓ No unparsed inline attributes found', 'green');
    return;
  }
  
  log(`✗ Found ${unparsed.length} potential unparsed attribute(s)`, 'red');
  unparsed.forEach((match, i) => {
    const fullMatch = match[0];
    const textContent = match[1];
    
    log(`\n  Issue ${i + 1}:`, 'yellow');
    log(`    Text content: ${textContent.trim()}`, 'red');
    log(`    Full HTML: ${fullMatch}`, 'cyan');
    
    // Identify what kind of attribute it is
    if (textContent.includes('modal=')) {
      log(`    → Type: Modal attribute (inline content may contain problematic syntax)`, 'magenta');
      
      // Check for bold/italic markers that might break parsing
      const hasBold = /\*\*/.test(textContent);
      const hasItalic = /\*[^*]/.test(textContent);
      if (hasBold || hasItalic) {
        log(`    ⚠ Contains markdown formatting (** or *) which may break parser`, 'yellow');
      }
    }
    
    if (textContent.includes('tooltip=')) {
      log(`    → Type: Tooltip attribute`, 'magenta');
    }
    
    if (textContent.includes('button')) {
      log(`    → Type: Button attribute`, 'magenta');
    }
    
    // Get line context
    const lines = html.substring(0, match.index).split('\n');
    const lineNumber = lines.length;
    log(`    Location: Line ~${lineNumber}`, 'cyan');
  });
  
  log(`\n  Recommendation: Check these in source .td file and verify syntax`, 'yellow');
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';
  const htmlFile = args[1] || 'docs-site/components.html';
  const sourceFile = htmlFile.replace('.html', '.td');
  
  log('\n🔍 Taildown HTML Debugger\n', 'bright');
  
  if (!existsSync(htmlFile)) {
    log(`Error: HTML file not found: ${htmlFile}`, 'red');
    process.exit(1);
  }
  
  try {
    switch (command) {
      case 'tooltips':
        await checkTooltipSpacing(htmlFile);
        break;
        
      case 'modals':
        await checkModalRendering(htmlFile);
        break;
        
      case 'structure':
        await checkComponentStructure(htmlFile);
        break;
        
      case 'compare':
        if (!args[2]) {
          log('Usage: debug-html.mjs compare <htmlFile> <searchTerm>', 'red');
          process.exit(1);
        }
        await compareSourceOutput(sourceFile, htmlFile, args[2]);
        break;
        
      case 'extract':
        if (!args[2]) {
          log('Usage: debug-html.mjs extract <htmlFile> <pattern> [description]', 'red');
          process.exit(1);
        }
        await extractPattern(htmlFile, args[2], args[3] || 'Custom pattern');
        break;
        
      case 'line':
        if (!args[2]) {
          log('Usage: debug-html.mjs line <htmlFile> <lineNumber>', 'red');
          process.exit(1);
        }
        await analyzeSnippet(htmlFile, parseInt(args[2]));
        break;
        
      case 'attributes':
        await findInlineAttributes(htmlFile);
        break;
        
      case 'all':
      default:
        await checkComponentStructure(htmlFile);
        await checkTooltipSpacing(htmlFile);
        await checkModalRendering(htmlFile);
        await findInlineAttributes(htmlFile);
        break;
    }
    
    log('\n✓ Analysis complete\n', 'green');
    
  } catch (error) {
    log(`\n✗ Error: ${error.message}\n`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Show usage if --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Taildown HTML Debugger

Usage:
  node scripts/debug-html.mjs [command] [htmlFile] [args...]

Commands:
  all              Run all checks (default)
  tooltips         Check tooltip spacing issues
  modals           Check modal rendering
  structure        Show component structure overview
  attributes       Find unparsed inline attributes
  compare <term>   Compare source .td with compiled HTML for a term
  extract <regex>  Extract matches for a regex pattern
  line <number>    Analyze HTML around a specific line number

Examples:
  node scripts/debug-html.mjs
  node scripts/debug-html.mjs tooltips docs-site/components.html
  node scripts/debug-html.mjs compare docs-site/components.html "Hover over"
  node scripts/debug-html.mjs extract docs-site/components.html "data-modal-trigger"
  node scripts/debug-html.mjs line docs-site/components.html 5229
`);
  process.exit(0);
}

main();

