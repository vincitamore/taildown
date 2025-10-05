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
  .description('Compile Taildown file to HTML, CSS, and JavaScript')
  .argument('<input>', 'Input Taildown file (.td, .tdown, or .taildown)')
  .option('-o, --output <file>', 'Output HTML file')
  .option('--css <file>', 'Output CSS file (default: <output>.css)')
  .option('--js <file>', 'Output JavaScript file (default: <output>.js)')
  .option('--inline', 'Inline CSS in HTML output')
  .option('--minify', 'Minify HTML and CSS output')
  .option('--no-css', 'Skip CSS file generation')
  .action(compileCommand);

program.parse();

