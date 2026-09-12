/**
 * Compile command implementation
 */

import { mkdir, readFile, realpath, stat, writeFile } from 'fs/promises';
import { resolve, basename, extname, dirname, join, relative, sep, isAbsolute } from 'path';
import { compile } from '@taildown/compiler';
import type { CompileOptions } from '@taildown/shared';

interface CompileCommandOptions {
  output?: string;
  css?: string;
  js?: string;
  separate?: boolean;
  minify?: boolean;
}

// Resolve existing ancestors as well as files, so symlinked directories cannot
// disguise two destinations that refer to the same file.
async function canonicalPath(file: string): Promise<string> {
  try {
    return await realpath(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    const parent = dirname(file);
    if (parent === file) throw error;
    return join(await canonicalPath(parent), basename(file));
  }
}

async function validateDestinations(input: string, outputs: string[]): Promise<void> {
  const files = await Promise.all([input, ...outputs].map(async file => {
    const canonical = await canonicalPath(file);
    const info = await stat(file).catch(error => {
      if (error.code !== 'ENOENT') throw error;
      return null;
    });
    if (info && !info.isFile()) throw new Error(`Output must be a file: ${file}`);
    return { file, key: process.platform === 'win32' ? canonical.toLowerCase() : canonical, info };
  }));
  for (const [i, a] of files.entries()) {
    for (const [j, b] of files.slice(0, i).entries()) {
      const sameInode = a.info && b.info && a.info.ino !== 0 && a.info.dev === b.info.dev && a.info.ino === b.info.ino;
      if (a.key === b.key || sameInode) {
        throw new Error(`Output path conflicts with ${j === 0 ? 'source' : 'another output'}: ${a.file}`);
      }
      if (a.key.startsWith(b.key + sep) || b.key.startsWith(a.key + sep)) {
        throw new Error(`File and directory paths conflict: ${a.file} and ${b.file}`);
      }
    }
  }
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
    const assetURL = (file: string) => {
      const assetPath = relative(outputDir, file);
      if (isAbsolute(assetPath)) throw new Error('Separate assets must be on the same filesystem volume as the HTML output');
      return assetPath.split(sep).map(encodeURIComponent).join('/');
    };

    // Compile - inline by default, separate only if --separate flag is used
    const shouldInline = !options.separate;
    const compileOptions: CompileOptions = {
      inlineStyles: shouldInline,
      inlineScripts: shouldInline,
      minify: options.minify,
      cssFilename: shouldInline ? undefined : assetURL(outputCss),
      jsFilename: shouldInline ? undefined : assetURL(outputJs),
    };

    const result = await compile(source, compileOptions);

    // Validate the complete write set before touching any destination.
    await validateDestinations(inputPath, [outputHtml, ...(options.separate
      ? [outputCss, ...(result.js ? [outputJs] : [])] : [])]);

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

