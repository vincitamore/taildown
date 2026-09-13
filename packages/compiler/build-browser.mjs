/**
 * Browser Bundle Build Script
 * 
 * Bundles the Taildown compiler for browser use with esbuild.
 * Creates a standalone ESM module with all dependencies bundled.
 */

import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'node:fs';
import {createHash} from 'node:crypto';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Browser exports carry the runtime as text so saved diagrams need no server.
const mermaidSourcePlugin = {
  name: 'mermaid-source',
  setup(build) {
    build.onResolve({ filter: /mermaid-source$/ }, () => ({ path: 'mermaid-source', namespace: 'mermaid-text' }));
    build.onLoad({ filter: /.*/, namespace: 'mermaid-text' }, () => {
      const source = readFileSync(createRequire(import.meta.url).resolve('mermaid/dist/mermaid.min.js'), 'utf8');
      return { contents: `export async function loadMermaidSource() { return ${JSON.stringify(source)}; }`, loader: 'js' };
    });
  },
};

// Plugin to replace shiki-highlighter with CodeMirror static highlighter for browser
const shikiReplacementPlugin = {
  name: 'shiki-replacement',
  setup(build) {
    build.onResolve({ filter: /shiki-highlighter/ }, args => {
      return { 
        path: join(__dirname, 'src/syntax-highlighting/codemirror6-static-highlighter.ts'),
        namespace: 'file'
      };
    });
  },
};

const workerDecoderPlugin = {
  name: 'worker-entity-decoder',
  setup(build) {
    build.onResolve({filter: /^decode-named-character-reference$/}, args => ({
      path: createRequire(join(args.resolveDir, 'resolve.cjs')).resolve('decode-named-character-reference'),
      namespace: 'worker-decoder',
    }));
    build.onLoad({filter: /.*/, namespace: 'worker-decoder'}, args => ({
      contents: readFileSync(args.path, 'utf8'), loader: 'js', resolveDir: dirname(args.path),
    }));
  },
};

async function buildBrowserBundle() {
  try {
    console.log('Building Taildown browser bundle...');
    await build({entryPoints:[join(__dirname,'src/editor-bundle.ts')],bundle:true,format:'esm',
      outfile:join(__dirname,'dist/taildown-editor.js'),platform:'browser',target:'es2022',minify:true,
      treeShaking:true,define:{'process.env.NODE_ENV':'"production"'}});
    
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
    plugins: [shikiReplacementPlugin, mermaidSourcePlugin], // Replace shiki-highlighter with CodeMirror static highlighter
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
    plugins: [shikiReplacementPlugin, mermaidSourcePlugin], // Replace shiki-highlighter with CodeMirror static highlighter
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      loader: {
        '.node': 'empty',
      },
    });
    
    const diagramSource = readFileSync(createRequire(import.meta.url).resolve('mermaid/dist/mermaid.min.js'), 'utf8');
    const diagramFile = `mermaid-${createHash('sha256').update(diagramSource).digest('hex').slice(0, 16)}.txt`;
    writeFileSync(join(__dirname, 'dist', diagramFile), diagramSource);
    writeFileSync(join(__dirname, 'dist/hosted-assets.json'), JSON.stringify({diagramFile}));
    const hostedSourcePlugin = {
      name: 'hosted-mermaid-source',
      setup(build) {
        build.onResolve({filter: /^taildown-hosted-runtime-loader$/}, () => ({path:join(__dirname,'src/renderer/hosted-runtime-loader.ts'),namespace:'file'}));
        build.onResolve({filter: /mermaid-source$/}, () => ({path:'mermaid-source',namespace:'hosted-mermaid'}));
        build.onLoad({filter: /.*/,namespace:'hosted-mermaid'}, () => ({loader:'js',contents:`
          import {createRuntimeLoader} from 'taildown-hosted-runtime-loader';
          let loader;
          export const loadMermaidSource = () => (loader ??= createRuntimeLoader(new URL(${JSON.stringify(`assets/${diagramFile}`)}, globalThis.__taildownAssetBase ?? document.baseURI), ${diagramSource.length}))();
        `}));
      },
    };
    await build({entryPoints:[join(__dirname,'src/browser-bundle.ts')],bundle:true,format:'esm',
      outfile:join(__dirname,'dist/taildown-browser-hosted.js'),platform:'browser',target:'es2022',minify:true,
      treeShaking:true,plugins:[shikiReplacementPlugin,hostedSourcePlugin],
      define:{'process.env.NODE_ENV':'"production"'},loader:{'.node':'empty'}});
    for (const [name, runtimePlugin] of [['taildown-worker-source.js', mermaidSourcePlugin], ['taildown-worker-hosted-source.js', hostedSourcePlugin]]) {
      const result = await build({entryPoints:[join(__dirname,'src/worker-entry.ts')],bundle:true,format:'iife',globalName:'TaildownCompiler',
        write:false,platform:'browser',target:'es2022',minify:true,treeShaking:true,
        plugins:[workerDecoderPlugin,shikiReplacementPlugin,runtimePlugin],
        define:{'process.env.NODE_ENV':'"production"'},loader:{'.node':'empty'}});
      writeFileSync(join(__dirname,'dist',name), `export default ${JSON.stringify(result.outputFiles[0].text)};`);
    }
    console.log('✓ Browser bundles built successfully!');
    console.log('  ESM: dist/taildown-browser.js');
    console.log('  IIFE: dist/taildown-browser.iife.js');
  } catch (error) {
    console.error('✗ Build failed:', error);
    process.exit(1);
  }
}

buildBrowserBundle();
