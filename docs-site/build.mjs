#!/usr/bin/env node
/**
 * Documentation Site Build Script
 * Compiles all .td files in docs-site to HTML
 */

import { createRequire } from 'node:module';
import { promises as fs } from 'fs';
import { join, basename, dirname, relative } from 'path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = __dirname;
const OUTPUT_DIR = join(DOCS_DIR, 'dist');
const PROJECT_DIR = dirname(DOCS_DIR);
let compile;

async function loadCompiler() {
  const require = createRequire(import.meta.url);
  const packagePath = require.resolve('tsup/package.json');
  const packageInfo = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  const cliPath = join(dirname(packagePath), packageInfo.bin.tsup);
  for (const name of ['shared', 'compiler']) {
    execFileSync(process.execPath, [cliPath], {cwd: join(PROJECT_DIR, 'packages', name), stdio: 'inherit'});
  }
  // Import only after building: an eager import caches the previous compiler.
  return (await import('../packages/compiler/dist/index.js')).compile;
}
const escapeHtml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// Base URL for the documentation site (update this when deployed)
const BASE_URL = 'https://www.taildown.dev';

// Page metadata configuration
const PAGE_METADATA = {
  'index.td': {
    title: 'Taildown - Markdown that becomes a website.',
    description: 'Create interactive documents with Markdown, plain-English styling, and composable components. Start in the browser and export a page you can keep.',
    openGraph: {
      title: 'Taildown - Markdown that becomes a website.',
      description: 'Create interactive documents with Markdown, plain-English styling, and composable components. Start in the browser and export a page you can keep.',
      type: 'website',
      url: `${BASE_URL}/`,
      image: `${BASE_URL}/1759672632566.jpg`,
      imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
      siteName: 'Taildown'
    }
  },
  'getting-started.td': {
    title: 'Getting Started - Taildown',
    description: 'Learn how to install and use Taildown. Create beautiful web pages with plain English styling and zero configuration.',
    openGraph: {
      title: 'Getting Started - Taildown',
      description: 'Learn how to install and use Taildown. Create beautiful web pages with plain English styling and zero configuration.',
      type: 'article',
      url: `${BASE_URL}/getting-started.html`,
      image: `${BASE_URL}/1759672632566.jpg`,
      imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
      siteName: 'Taildown'
    }
  },
  'syntax-guide.td': {
    title: 'Syntax Guide - Taildown',
    description: 'Complete syntax reference for Taildown. Learn all features including components, plain English styling, and interactive elements.',
    openGraph: {
      title: 'Syntax Guide - Taildown',
      description: 'Complete syntax reference for Taildown. Learn all features including components, plain English styling, and interactive elements.',
      type: 'article',
      url: `${BASE_URL}/syntax-guide.html`,
      image: `${BASE_URL}/1759672632566.jpg`,
      imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
      siteName: 'Taildown'
    }
  },
  'components.td': {
    title: 'Components - Taildown',
    description: 'Explore Taildown\'s 18+ built-in components including cards, tabs, accordions, modals, carousels, and more.',
    openGraph: {
      title: 'Components - Taildown',
      description: 'Explore Taildown\'s 18+ built-in components including cards, tabs, accordions, modals, carousels, and more.',
      type: 'article',
      url: `${BASE_URL}/components.html`,
      image: `${BASE_URL}/1759672632566.jpg`,
      imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
      siteName: 'Taildown'
    }
  },
  'plain-english.td': {
    title: 'Plain English Styling - Taildown',
    description: 'Natural language styling reference for Taildown. Use {huge-bold primary center} instead of cryptic CSS classes.',
    openGraph: {
      title: 'Plain English Styling - Taildown',
      description: 'Natural language styling reference for Taildown. Use {huge-bold primary center} instead of cryptic CSS classes.',
      type: 'article',
      url: `${BASE_URL}/plain-english.html`,
      image: `${BASE_URL}/1759672632566.jpg`,
      imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
      siteName: 'Taildown'
    }
  },
  'vercel-deployment.td': {
    title: 'Vercel Deployment - Taildown',
    description: 'Learn how to deploy your Taildown documentation site to Vercel with automatic SSL and CDN.',
    openGraph: {
      title: 'Vercel Deployment - Taildown',
      description: 'Learn how to deploy your Taildown documentation site to Vercel with automatic SSL and CDN.',
      type: 'article',
      url: `${BASE_URL}/vercel-deployment.html`,
      image: `${BASE_URL}/1759672632566.jpg`,
      imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
      siteName: 'Taildown'
    }
  }
};

// Static HTML page metadata configuration (for files not generated from .td)
const PAGE_METADATA_STATIC = {
  'editor.html': {
    title: 'Taildown Live Editor',
    description: 'Live Taildown editor: write in plain English and instantly preview beautiful, interactive pages.',
    openGraph: {
      title: 'Taildown Live Editor',
      description: 'Live Taildown editor: write in plain English and instantly preview beautiful, interactive pages.',
      type: 'website',
      url: `${BASE_URL}/editor.html`,
      image: `${BASE_URL}/1759672632566.jpg`,
      imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
      siteName: 'Taildown'
    }
  }
};

async function findTdFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    
    if (item.isDirectory()) {
      // Skip node_modules and hidden directories
      if (item.name.startsWith('.') || ['node_modules', 'dist'].includes(item.name)) {
        continue;
      }
      files.push(...await findTdFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.td')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function compileTdFile(filePath) {
  const fileName = basename(filePath);
  console.log(`Compiling: ${fileName}`);
  
  try {
    // Read source file
    const source = await fs.readFile(filePath, 'utf-8');
    
    // Get metadata for this page
    const metadata = PAGE_METADATA[fileName] || {
      title: 'Taildown Document',
      description: 'A beautiful document created with Taildown',
      openGraph: {
        title: 'Taildown Document',
        description: 'A beautiful document created with Taildown',
        type: 'website',
        url: `${BASE_URL}/${fileName.replace(/\.td$/, '')}`,
        image: `${BASE_URL}/1759672632566.jpg`,
        imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
        siteName: 'Taildown'
      }
    };
    
    // Compile with dark mode enabled and Open Graph metadata
    const result = await compile(source, {
      autoFix: false,          // Build the authored source without silent corrections
      inlineStyles: true,      // Embed CSS in HTML
      inlineScripts: true,     // Embed JS in HTML (for dark mode)
      minify: true,            // Compact markup while preserving code whitespace
      darkMode: true,          // Enable dark mode
      title: metadata.title,
      description: metadata.description,
      openGraph: metadata.openGraph,
      favicon: {
        basePath: '/favicon/',
        ico: 'favicon.ico',
        png16: 'favicon-16x16.png',
        png32: 'favicon-32x32.png',
        appleTouchIcon: 'apple-touch-icon.png',
        android192: 'android-chrome-192x192.png',
        android512: 'android-chrome-512x512.png',
        webManifest: 'site.webmanifest',
        themeColor: '#3b82f6'  // Taildown brand blue
      }
    });
    
    // Write HTML output
    const htmlPath = join(OUTPUT_DIR, relative(DOCS_DIR, filePath).replace(/\.td$/, '.html'));
    await fs.mkdir(dirname(htmlPath), {recursive: true});
    if (result.metadata.warnings.length) {
      throw new Error(result.metadata.warnings.map(warning => `Line ${warning.line ?? '?'}: ${warning.message}`).join('\n'));
    }
    await fs.writeFile(htmlPath, result.html);
    
    console.log(`  ✓ Created: ${basename(htmlPath)}`);
    
    return { success: true, file: fileName };
  } catch (error) {
    console.error(`  ✗ Error compiling ${fileName}:`, error.message);
    return { success: false, file: fileName, error: error.message };
  }
}

/**
 * Inject or update metadata tags in a static HTML file
 */
async function updateStaticHtml(filePath, metadata) {
  try {
    const originalHtml = await fs.readFile(filePath, 'utf-8');
    const headStart = originalHtml.indexOf('<head');
    const headEnd = originalHtml.indexOf('</head>', headStart);
    if (headStart < 0 || headEnd < 0) {
      throw new Error('Missing HTML head');
    }
    // The editor embeds the compiler, including HTML templates. Only mutate
    // the real document head; never replace metadata strings inside its runtime.
    let html = originalHtml.slice(headStart, headEnd + 7);

    // Replace <title>
    const safeTitle = escapeHtml(metadata.title ?? 'Taildown');
    if (/<title>[\s\S]*?<\/title>/.test(html)) {
      html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`);
    } else {
      html = html.replace(/<head(\b[^>]*)?>/, (m) => `${m}\n  <title>${safeTitle}<\/title>`);
    }

    // Remove existing description/OG/Twitter tags we manage
    html = html
      .replace(/\n?\s*<meta name="description"[^>]*>\s*/g, '')
      .replace(/\n?\s*<meta property="og:[^"]+"[^>]*>\s*/g, '')
      .replace(/\n?\s*<meta name="twitter:[^"]+"[^>]*>\s*/g, '');

    const og = metadata.openGraph || {};
    const description = metadata.description || og.description || '';

    const tags = [];
    if (description) tags.push(`  <meta name="description" content="${escapeHtml(description)}">`);
    if (og.title) tags.push(`  <meta property="og:title" content="${escapeHtml(og.title)}">`);
    if (og.description) tags.push(`  <meta property="og:description" content="${escapeHtml(og.description)}">`);
    if (og.type) tags.push(`  <meta property="og:type" content="${escapeHtml(og.type)}">`);
    if (og.url) tags.push(`  <meta property="og:url" content="${escapeHtml(og.url)}">`);
    if (og.image) tags.push(`  <meta property="og:image" content="${escapeHtml(og.image)}">`);
    if (og.imageAlt) tags.push(`  <meta property="og:image:alt" content="${escapeHtml(og.imageAlt)}">`);
    if (og.siteName) tags.push(`  <meta property="og:site_name" content="${escapeHtml(og.siteName)}">`);

    if (og.image) tags.push(`  <meta name="twitter:card" content="summary_large_image">`);
    if (og.image) tags.push(`  <meta name="twitter:image" content="${escapeHtml(og.image)}">`);
    if (og.title) tags.push(`  <meta name="twitter:title" content="${escapeHtml(og.title)}">`);
    if (og.description) tags.push(`  <meta name="twitter:description" content="${escapeHtml(og.description)}">`);

    if (tags.length > 0) {
      // Insert after <title> if present, else right after <head>
      if (/<title>[\s\S]*?<\/title>/.test(html)) {
        html = html.replace(/<title>[\s\S]*?<\/title>/, (m) => `${m}\n${tags.join('\n')}`);
      } else {
        html = html.replace(/<head(\b[^>]*)?>/, (m) => `${m}\n${tags.join('\n')}`);
      }
    }

    await fs.writeFile(filePath, originalHtml.slice(0, headStart) + html + originalHtml.slice(headEnd + 7), 'utf-8');
    console.log(`  ✓ Updated metadata: ${basename(filePath)}`);
  } catch (err) {
    throw new Error(`Metadata update failed for ${basename(filePath)}`, {cause: err});
  }
}

async function main() {
  console.log('🚀 Building Taildown Documentation Site\n');
  if (dirname(OUTPUT_DIR) !== DOCS_DIR || basename(OUTPUT_DIR) !== 'dist') throw new Error('Invalid output directory');
  await fs.rm(OUTPUT_DIR, {recursive: true, force: true});
  await fs.mkdir(OUTPUT_DIR, {recursive: true});
  compile = await loadCompiler();
  execFileSync(process.execPath, ['build-browser.mjs'], {cwd: join(PROJECT_DIR, 'packages/compiler'), stdio: 'inherit'});
  execFileSync(process.execPath, ['editor/build.mjs'], {cwd: PROJECT_DIR, stdio: 'inherit'});
  await fs.copyFile(join(PROJECT_DIR, 'editor/dist/editor-hosted.html'), join(OUTPUT_DIR, 'editor.html'));
  await fs.copyFile(join(PROJECT_DIR, 'editor/dist/editor.html'), join(OUTPUT_DIR, 'offline-editor.html'));
  await fs.cp(join(PROJECT_DIR, 'editor/dist/assets'), join(OUTPUT_DIR, 'assets'), {recursive:true});
  for (const asset of ['1759672632566.jpg', 'dynamic_regularization.png', 'grid_transformation.png', 'scale_correspondence.png', 'scale_shape_decomposition.png', 'favicon']) {
    await fs.cp(join(DOCS_DIR, asset), join(OUTPUT_DIR, asset), {recursive: true});
  }
  console.log('📁 Searching for .td files...\n');
  
  const tdFiles = await findTdFiles(DOCS_DIR);
  
  if (tdFiles.length === 0) {
    throw new Error('No .td files found');
  }
  
  console.log(`Found ${tdFiles.length} file(s) to compile:\n`);
  
  const results = [];
  for (const file of tdFiles.sort()) results.push(await compileTdFile(file));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully compiled: ${successful} file(s)`);
  if (failed > 0) {
    console.log(`❌ Failed to compile: ${failed} file(s)`);
  }
  console.log('='.repeat(50));
  
  if (failed > 0) throw new Error(`Failed to compile ${failed} documentation pages`);

  // Update metadata for the freshly built editor.
  for (const [staticName, meta] of Object.entries(PAGE_METADATA_STATIC)) {
    await updateStaticHtml(join(OUTPUT_DIR, staticName), meta);
  }

  console.log('\n📦 Documentation site built successfully!');
  console.log(`   Open docs-site/dist/index.html in your browser\n`);
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});

