#!/usr/bin/env node
/**
 * Taildown CLI
 * Command-line interface for Taildown compiler
 */

import { Command } from 'commander';
import { compileCommand } from './commands/compile';

const program = new Command();

program
  .name('taildown')
  .description('Taildown compiler - Markdown with Tailwind-inspired styling')
  .version('0.1.0');

// Compile command
program
  .command('compile')
  .description('Compile Taildown file to HTML (inline CSS by default)')
  .argument('<input>', 'Input Taildown file (.td, .tdown, or .taildown)')
  .option('-o, --output <file>', 'Output HTML file')
  .option('--separate', 'Generate separate CSS and JS files instead of inline')
  .option('--css <file>', 'Output CSS file (default: <output>.css, requires --separate)')
  .option('--js <file>', 'Output JavaScript file (default: <output>.js)')
  .option('--minify', 'Minify HTML and CSS output')
  .action(compileCommand);

program.parse();

