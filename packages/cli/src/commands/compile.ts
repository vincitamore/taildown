/**
 * Compile command implementation
 */

import { mkdir, readFile, writeFile } from 'fs/promises';
import { resolve, basename, extname, dirname, join, relative, sep } from 'path';
import { compile } from '@taildown/compiler';
import type { CompileOptions } from '@taildown/shared';

interface CompileCommandOptions {
  output?: string;
  css?: string;
  js?: string;
  separate?: boolean;
  minify?: boolean;
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
    const outputHtml = resolve(options.output || join(inputDir, `${inputBase}.html`));
    const outputDir = dirname(outputHtml);
    const outputBase = basename(outputHtml, extname(outputHtml));
    const outputCss = resolve(options.css || join(outputDir, `${outputBase}.css`));
    const outputJs = resolve(options.js || join(outputDir, `${outputBase}.js`));
    const assetURL = (file: string) => relative(outputDir, file).split(sep).map(encodeURIComponent).join('/');

    // Compile - inline by default, separate only if --separate flag is used
    const shouldInline = !options.separate;
    const compileOptions: CompileOptions = {
      inlineStyles: shouldInline,
      inlineScripts: shouldInline,
      minify: options.minify,
      cssFilename: assetURL(outputCss),
      jsFilename: assetURL(outputJs),
    };

    const result = await compile(source, compileOptions);

    // Write HTML
    const htmlPath = resolve(outputHtml);
    await mkdir(dirname(htmlPath), { recursive: true });
    await writeFile(htmlPath, result.html, 'utf-8');
    console.log(`✓ HTML written to ${outputHtml}`);

    // Write CSS only if --separate flag is used
    if (options.separate) {
      const cssPath = resolve(outputCss);
      await mkdir(dirname(cssPath), { recursive: true });
      await writeFile(cssPath, result.css, 'utf-8');
      console.log(`✓ CSS written to ${outputCss}`);
      
      // Write JavaScript separately too (only if there are interactive components)
      if (result.js && result.js.length > 0) {
        const jsPath = resolve(outputJs);
        await mkdir(dirname(jsPath), { recursive: true });
        await writeFile(jsPath, result.js, 'utf-8');
        console.log(`✓ JavaScript written to ${outputJs}`);
      }
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

