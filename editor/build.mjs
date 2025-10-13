/**
 * Editor Build Script
 * 
 * Inlines the browser bundle JavaScript into the HTML template
 * to create a single, fully self-contained HTML file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
  try {
    console.log('Building standalone Taildown editor...');

    // Read the ESM browser bundle
    const bundlePath = path.join(__dirname, '../packages/compiler/dist/taildown-browser.js');
    if (!fs.existsSync(bundlePath)) {
      throw new Error('Browser bundle (ESM) not found. Run "pnpm build:browser" first.');
    }
    const bundle = fs.readFileSync(bundlePath, 'utf8');
    console.log(`✓ Loaded browser bundle (${(bundle.length / 1024).toFixed(0)}KB)`);

    // Read the HTML template
    const templatePath = path.join(__dirname, 'index.html');
    const template = fs.readFileSync(templatePath, 'utf8');
    console.log('✓ Loaded HTML template');

    // Create a data URL from the bundle for inlining
    // Base64 encoding ensures no escaping issues
    const bundleBase64 = Buffer.from(bundle, 'utf8').toString('base64');
    const dataUrl = `data:text/javascript;base64,${bundleBase64}`;
    
    // Replace the import statement with the data URL
    const output = template.replace(
      /import \* as Taildown from ['"][^'"]+taildown-browser\.js['"];/,
      `import * as Taildown from '${dataUrl}';`
    );

    // Ensure dist directory exists and clean it
    const distDir = path.join(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
      // Clean dist directory recursively
      fs.rmSync(distDir, { recursive: true, force: true });
      console.log('✓ Cleaned dist directory');
    }
    fs.mkdirSync(distDir, { recursive: true });

    // Create lib subdirectory for external dependencies
    const libDir = path.join(distDir, 'lib');
    fs.mkdirSync(libDir, { recursive: true });

    // Copy Mermaid bundle to lib/
    const mermaidSrc = path.join(__dirname, '../packages/compiler/dist/mermaid.min.js');
    const mermaidDest = path.join(libDir, 'mermaid.min.js');
    if (fs.existsSync(mermaidSrc)) {
      fs.copyFileSync(mermaidSrc, mermaidDest);
      const mermaidSize = (fs.statSync(mermaidDest).size / 1024).toFixed(0);
      console.log(`✓ Copied Mermaid bundle: ${mermaidSize}KB`);
    } else {
      console.warn('⚠ Mermaid bundle not found - diagrams will not render');
    }

    // Write the standalone file
    const outputPath = path.join(distDir, 'editor.html');
    fs.writeFileSync(outputPath, output, 'utf8');

    const outputSize = (output.length / 1024).toFixed(0);
    console.log(`✓ Standalone editor created: ${outputSize}KB`);
    console.log(`  Output: ${outputPath}`);
    console.log('');
    console.log('📦 Production build complete!');
    console.log('   Single file: editor/dist/editor.html');
    console.log('');
    console.log('To use:');
    console.log('  • Open editor/dist/editor.html in your browser');
    console.log('  • Or serve: npx serve editor/dist');
    console.log('  • Works 100% offline, no dependencies!');
    console.log('');
    console.log('✨ Ready to ship!');
  } catch (error) {
    console.error('✗ Build failed:', error.message);
    process.exit(1);
  }
}

build();

