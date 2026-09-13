import {readFile, writeFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
export async function buildPwa(outputDir) {
  const diagrams = (await readdir(resolve(outputDir, 'assets'))).filter(name => /^mermaid-[a-f0-9]+\.txt$/.test(name));
  if (!diagrams.length) throw new Error('Offline editor requires its diagram runtime');
  const assets = ['/editor', '/offline-editor', '/favicon/site.webmanifest', '/favicon/android-chrome-192x192.png', '/favicon/android-chrome-512x512.png', ...diagrams.map(name => '/assets/' + name)];
  const hash = createHash('sha256');
  for (const asset of assets) {
    const path = /^\/(editor|offline-editor)$/.test(asset) ? asset + '.html' : asset;
    hash.update(asset).update(await readFile(resolve(outputDir, '.' + path)));
  }
  const template = await readFile(resolve(here, 'service-worker.js'), 'utf8');
  hash.update(template);
  const app = {version: hash.digest('hex').slice(0, 20), assets};
  await writeFile(resolve(outputDir, 'editor-sw.js'), template.replace('__TAILDOWN_PWA__', JSON.stringify(app)));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildPwa(resolve(process.argv[2]));
}
