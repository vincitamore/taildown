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
  .option('--inline', 'Embed CSS and JS, overriding configuration')
  .option('--config <file>', 'Load a configuration file (default: discover in current directory)')
  .option('--no-config', 'Skip configuration file discovery')
  .option('--css <file>', 'Output CSS file (default: <output>.css, requires separate output)')
  .option('--js <file>', 'Output JavaScript file (default: <output>.js, requires separate output)')
  .option('--minify', 'Minify HTML and CSS output')
  .option('--no-minify', 'Disable minification, overriding configuration')
  .action(compileCommand);

program.parse();

