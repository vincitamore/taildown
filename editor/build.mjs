/**
 * Editor Build Script
 * 
 * Inlines the browser bundle JavaScript into the HTML template
 * to create a single, fully self-contained HTML file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build as bundleScript } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function inlineEditorModule(template, resolveDir = __dirname) {
  const modules = [...template.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)];
  if (modules.length !== 1) throw new Error('Expected exactly one editor module script.');
  const result = await bundleScript({
    stdin: { contents: modules[0][1], resolveDir, sourcefile: 'editor.js' },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    minify: true,
  });
  // esbuild escapes HTML script delimiters in strings and comments. Keep the
  // module inline instead of retaining a second, base64-encoded copy as a
  // multi-megabyte import URL.
  return template.replace(modules[0][0], () => `<script type="module">${result.outputFiles[0].text}</script>`);
}

async function build() {
  try {
    console.log('Building standalone Taildown editor...');

    // Read the ESM browser bundle
    const bundlePath = path.join(__dirname, '../packages/compiler/dist/taildown-editor.js');
    if (!fs.existsSync(bundlePath)) {
      throw new Error('Browser bundle (ESM) not found. Run "pnpm build:browser" first.');
    }
    const bundle = fs.readFileSync(bundlePath, 'utf8');
    console.log(`✓ Loaded browser bundle (${(bundle.length / 1024).toFixed(0)}KB)`);

    // Read the HTML template
    const templatePath = path.join(__dirname, 'index.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    console.log('✓ Loaded HTML template');

    const output = await inlineEditorModule(template);

    // Ensure dist directory exists and clean it
    const distDir = path.join(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      // Clean dist directory recursively
      fs.rmSync(distDir, { recursive: true, force: true });
      console.log('✓ Cleaned dist directory');
    }
    fs.mkdirSync(distDir, { recursive: true });

    // Write the standalone file
    const outputPath = path.join(distDir, 'editor.html');
    fs.writeFileSync(outputPath, output, 'utf8');

    const hostedTemplate = template
      .replace('../packages/compiler/dist/taildown-worker-source.js', '../packages/compiler/dist/taildown-worker-hosted-source.js')
      .replace('id="offline-editor" hidden', 'id="offline-editor"');
    fs.writeFileSync(path.join(distDir, 'editor-hosted.html'), await inlineEditorModule(hostedTemplate), 'utf8');
    const {diagramFile} = JSON.parse(fs.readFileSync(path.join(__dirname, '../packages/compiler/dist/hosted-assets.json'), 'utf8'));
    fs.mkdirSync(path.join(distDir, 'assets'), {recursive:true});
    fs.copyFileSync(path.join(__dirname, '../packages/compiler/dist', diagramFile), path.join(distDir, 'assets', diagramFile));

    const outputSize = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(0);
    console.log(`✓ Standalone editor created: ${outputSize}KB`);
    console.log(`  Output: ${outputPath}`);
    console.log('');
    console.log('📦 Production build complete!');
    console.log('   Single file: editor/dist/editor.html');
    console.log('');
    console.log('To use:');
    console.log('  • Open editor/dist/editor.html in your browser');
    console.log('  • Or serve: npx serve editor/dist');
    console.log('  • Editor and compiler work offline; remote document media requires its host.');
    console.log('');
    console.log('✨ Ready to ship!');
  } catch (error) {
    console.error('✗ Build failed:', error.message);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) build();
