#!/usr/bin/env node
/**
 * Documentation Site Build Script
 * Compiles all .td files in docs-site to HTML
 */

import { compile } from '../packages/compiler/dist/index.js';
import { promises as fs } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = __dirname;

// Base URL for the documentation site (update this when deployed)
const BASE_URL = 'https://taildown.dev';

// Page metadata configuration
const PAGE_METADATA = {
  'index.td': {
    title: 'Taildown - Write markdown. Get magic.',
    description: 'The markup language that transforms plain English into stunning, interactive web pages - zero configuration required.',
    openGraph: {
      title: 'Taildown - Write markdown. Get magic.',
      description: 'The markup language that transforms plain English into stunning, interactive web pages - zero configuration required.',
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
      if (item.name.startsWith('.') || item.name === 'node_modules') {
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
        url: BASE_URL,
        image: `${BASE_URL}/1759672632566.jpg`,
        imageAlt: 'Taildown - Modern markup language with glassmorphism and dark mode',
        siteName: 'Taildown'
      }
    };
    
    // Compile with dark mode enabled and Open Graph metadata
    const result = await compile(source, {
      inlineStyles: true,      // Embed CSS in HTML
      inlineScripts: true,     // Embed JS in HTML (for dark mode)
      minify: false,           // Keep readable for debugging
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
    const htmlPath = filePath.replace('.td', '.html');
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
    let html = await fs.readFile(filePath, 'utf-8');

    // Ensure <head> exists
    if (!html.includes('<head')) {
      return; // skip files without a standard head
    }

    // Replace <title>
    const safeTitle = metadata.title ?? 'Taildown';
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
    if (description) tags.push(`  <meta name="description" content="${description}">`);
    if (og.title) tags.push(`  <meta property="og:title" content="${og.title}">`);
    if (og.description) tags.push(`  <meta property="og:description" content="${og.description}">`);
    if (og.type) tags.push(`  <meta property="og:type" content="${og.type}">`);
    if (og.url) tags.push(`  <meta property="og:url" content="${og.url}">`);
    if (og.image) tags.push(`  <meta property="og:image" content="${og.image}">`);
    if (og.imageAlt) tags.push(`  <meta property="og:image:alt" content="${og.imageAlt}">`);
    if (og.siteName) tags.push(`  <meta property="og:site_name" content="${og.siteName}">`);

    if (og.image) tags.push(`  <meta name="twitter:card" content="summary_large_image">`);
    if (og.image) tags.push(`  <meta name="twitter:image" content="${og.image}">`);
    if (og.title) tags.push(`  <meta name="twitter:title" content="${og.title}">`);
    if (og.description) tags.push(`  <meta name="twitter:description" content="${og.description}">`);

    if (tags.length > 0) {
      // Insert after <title> if present, else right after <head>
      if (/<title>[\s\S]*?<\/title>/.test(html)) {
        html = html.replace(/<title>[\s\S]*?<\/title>/, (m) => `${m}\n${tags.join('\n')}`);
      } else {
        html = html.replace(/<head(\b[^>]*)?>/, (m) => `${m}\n${tags.join('\n')}`);
      }
    }

    await fs.writeFile(filePath, html, 'utf-8');
    console.log(`  ✓ Updated metadata: ${basename(filePath)}`);
  } catch (err) {
    // Non-fatal: just report and continue
    console.warn(`  ⚠︎ Skipped metadata update for ${basename(filePath)}: ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Building Taildown Documentation Site\n');
  console.log('📁 Searching for .td files...\n');
  
  const tdFiles = await findTdFiles(DOCS_DIR);
  
  if (tdFiles.length === 0) {
    console.log('No .td files found!');
    return;
  }
  
  console.log(`Found ${tdFiles.length} file(s) to compile:\n`);
  
  const results = await Promise.all(tdFiles.map(compileTdFile));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully compiled: ${successful} file(s)`);
  if (failed > 0) {
    console.log(`❌ Failed to compile: ${failed} file(s)`);
  }
  console.log('='.repeat(50));
  
  // Update metadata for static HTML files (e.g., editor.html)
  for (const [staticName, meta] of Object.entries(PAGE_METADATA_STATIC)) {
    await updateStaticHtml(join(DOCS_DIR, staticName), meta);
  }

  console.log('\n📦 Documentation site built successfully!');
  console.log(`   Open docs-site/index.html in your browser\n`);
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
