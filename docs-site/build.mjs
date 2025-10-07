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
      openGraph: metadata.openGraph
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
  
  console.log('\n📦 Documentation site built successfully!');
  console.log(`   Open docs-site/index.html in your browser\n`);
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
