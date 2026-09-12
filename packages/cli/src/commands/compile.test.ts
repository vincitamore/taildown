import { afterEach, expect, it } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { JSDOM } from 'jsdom';
import { compileCommand } from './compile';

const temporaryDirectories: string[] = [];
afterEach(async () => {
  for (const directory of temporaryDirectories.splice(0)) {
    if (dirname(resolve(directory)) !== resolve(tmpdir())) throw new Error('Unexpected cleanup directory');
    await rm(directory, { recursive: true, force: true });
  }
});

async function fixture() {
  const directory = await mkdtemp(join(tmpdir(), 'taildown-cli-'));
  temporaryDirectories.push(directory);
  const input = join(directory, 'source.td');
  await writeFile(input, ':::tabs\n## One\nFirst\n## Two\nSecond\n:::');
  return { directory, input };
}

it('creates nested output directories and keeps default assets beside the HTML', async () => {
  const { directory, input } = await fixture();
  const output = join(directory, 'new', 'site', 'index.html');
  await compileCommand(input, { output, separate: true });
  const document = new JSDOM(await readFile(output, 'utf8')).window.document;
  expect(document.querySelector('link[rel="stylesheet"]')?.getAttribute('href')).toBe('index.css');
  expect(document.querySelector('script[src]')?.getAttribute('src')).toBe('index.js');
  expect((await readFile(join(dirname(output), 'index.css'), 'utf8')).length).toBeGreaterThan(0);
  expect((await readFile(join(dirname(output), 'index.js'), 'utf8')).length).toBeGreaterThan(0);
});

it('links custom asset locations relative to the HTML with URL-safe filenames', async () => {
  const { directory, input } = await fixture();
  const output = join(directory, 'pages', 'index.html');
  const css = join(directory, 'assets', 'my style#1.css');
  const js = join(directory, 'scripts', 'app 1.js');
  await compileCommand(input, { output, css, js, separate: true });
  const document = new JSDOM(await readFile(output, 'utf8')).window.document;
  expect(document.querySelector('link[rel="stylesheet"]')?.getAttribute('href')).toBe('../assets/my%20style%231.css');
  expect(document.querySelector('script[src]')?.getAttribute('src')).toBe('../scripts/app%201.js');
  expect((await readFile(css, 'utf8')).length).toBeGreaterThan(0);
  expect((await readFile(js, 'utf8')).length).toBeGreaterThan(0);
});

it('creates an inline export in a new directory without external asset references', async () => {
  const { directory, input } = await fixture();
  const output = join(directory, 'inline', 'document.html');
  await compileCommand(input, { output });
  const document = new JSDOM(await readFile(output, 'utf8')).window.document;
  expect(document.querySelector('link[rel="stylesheet"], script[src]')).toBeNull();
  expect(document.querySelector('style')?.textContent).toBeTruthy();
  expect(document.querySelector('script')?.textContent).toBeTruthy();
});
