#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const files = process.argv.slice(2);
const targets = files.length ? files : ['editor/dist/editor.html', 'editor/dist/editor-hosted.html'];
for (const file of targets) {
  try {
    const bytes = await readFile(files.length ? file : fileURLToPath(new URL('../' + file, import.meta.url)));
    console.log(JSON.stringify({file,bytes:bytes.length,gzipBytes:gzipSync(bytes).length}));
  } catch (error) {
    console.error(file + ': ' + error.message);
    process.exitCode = 1;
  }
}
