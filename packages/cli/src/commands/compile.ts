/**
 * Compile command implementation
 */

import { readFile, writeFile } from 'fs/promises';
import { resolve, basename, extname, dirname, join } from 'path';
import { compile } from '@taildown/compiler';
import type { CompileOptions } from '@taildown/shared';

interface CompileCommandOptions {
  output?: string;
  css?: string;
  js?: string;
  inline?: boolean;
  minify?: boolean;
  noCss?: boolean;
}

export async function compileCommand(
  input: string,
  options: CompileCommandOptions
): Promise<void> {
  try {
    // Read input file
    const inputPath = resolve(input);
    const source = await readFile(inputPath, 'utf-8');

    console.log(`Compiling ${input}...`);

    // Get input file directory and base name
    const inputDir = dirname(inputPath);
    const inputBase = basename(input, extname(input));
    
    // Determine output paths (default to same directory as input)
    const outputHtml = options.output || join(inputDir, `${inputBase}.html`);
    const outputCss = options.css || join(inputDir, `${inputBase}.css`);
    const outputJs = options.js || join(inputDir, `${inputBase}.js`);

    // Compile
    const compileOptions: CompileOptions = {
      inlineStyles: options.inline,
      minify: options.minify,
      cssFilename: basename(outputCss), // Pass CSS filename for <link> tag
      jsFilename: basename(outputJs), // Pass JS filename for <script> tag
    };

    const result = await compile(source, compileOptions);

    // Write HTML
    const htmlPath = resolve(outputHtml);
    await writeFile(htmlPath, result.html, 'utf-8');
    console.log(`✓ HTML written to ${outputHtml}`);

    // Write CSS (unless --no-css or --inline)
    if (!options.noCss && !options.inline) {
      const cssPath = resolve(outputCss);
      await writeFile(cssPath, result.css, 'utf-8');
      console.log(`✓ CSS written to ${outputCss}`);
    }

    // Write JavaScript (only if there are interactive components)
    if (result.js && result.js.length > 0) {
      const jsPath = resolve(outputJs);
      await writeFile(jsPath, result.js, 'utf-8');
      console.log(`✓ JavaScript written to ${outputJs}`);
    }

    // Display metadata
    console.log(`\nCompilation completed in ${result.metadata.compileTime.toFixed(2)}ms`);
    console.log(`Processed ${result.metadata.nodeCount} nodes`);

    if (result.metadata.warnings.length > 0) {
      console.warn(`\n⚠ ${result.metadata.warnings.length} warning(s):`);
      for (const warning of result.metadata.warnings) {
        console.warn(`  - ${warning.message}`);
      }
    }
  } catch (error) {
    console.error('Error compiling file:', error);
    process.exit(1);
  }
}

