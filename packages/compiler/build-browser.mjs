/**
 * Browser Bundle Build Script
 * 
 * Bundles the Taildown compiler for browser use with esbuild.
 * Creates a standalone ESM module with all dependencies bundled.
 */

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildBrowserBundle() {
  try {
    console.log('Building Taildown browser bundle...');
    
    // Build ESM version for development
    await build({
      entryPoints: [join(__dirname, 'src/browser-bundle.ts')],
      bundle: true,
      format: 'esm',
      outfile: join(__dirname, 'dist/taildown-browser.js'),
      platform: 'browser',
      target: 'es2022', // Support top-level await
      minify: true,
      sourcemap: false,
      treeShaking: true,
      external: [],
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      loader: {
        '.node': 'empty',
      },
    });

    // Build IIFE version for standalone editor (with global exports)
    await build({
      entryPoints: [join(__dirname, 'src/browser-bundle.ts')],
      bundle: true,
      format: 'iife',
      globalName: 'Taildown',
      outfile: join(__dirname, 'dist/taildown-browser.iife.js'),
      platform: 'browser',
      target: 'es2022',
      minify: true,
      sourcemap: false,
      treeShaking: true,
      external: [],
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      loader: {
        '.node': 'empty',
      },
    });
    
    console.log('✓ Browser bundles built successfully!');
    console.log('  ESM: dist/taildown-browser.js');
    console.log('  IIFE: dist/taildown-browser.iife.js');
  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }
}

buildBrowserBundle();

