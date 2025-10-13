/**
 * Mermaid Bundle Extractor
 * 
 * Copies the pre-built Mermaid.js bundle from node_modules.
 * This keeps the main editor bundle lightweight while enabling
 * on-demand diagram rendering.
 */

import { copyFileSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildMermaidBundle() {
  try {
    console.log('Building Mermaid standalone bundle...');

    // Try multiple possible locations for mermaid
    const possiblePaths = [
      join(__dirname, '../../node_modules/mermaid/dist/mermaid.min.js'),
      join(__dirname, '../../node_modules/.pnpm/mermaid@11.12.0/node_modules/mermaid/dist/mermaid.min.js'),
    ];

    let mermaidSrcPath = null;
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        mermaidSrcPath = path;
        break;
      }
    }

    if (!mermaidSrcPath) {
      throw new Error(`Mermaid source not found. Tried:\n${possiblePaths.join('\n')}\n\nPlease ensure mermaid is installed.`);
    }

    const mermaidDestPath = join(__dirname, 'dist/mermaid.min.js');
    copyFileSync(mermaidSrcPath, mermaidDestPath);

    const size = (statSync(mermaidDestPath).size / 1024).toFixed(0);
    console.log('✓ Mermaid bundle copied successfully!');
    console.log(`  Source: ${mermaidSrcPath.replace(process.cwd(), '.')}`);
    console.log(`  Output: dist/mermaid.min.js (${size}KB)`);
  } catch (error) {
    console.error('Failed to build Mermaid bundle:', error.message);
    process.exit(1);
  }
}

buildMermaidBundle();

