import { afterEach, expect, it, vi } from 'vitest';
import { link, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { dirname, join, parse, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { JSDOM } from 'jsdom';
import { compileCommand } from './compile';

const temporaryDirectories: string[] = [];
afterEach(async () => {
  vi.restoreAllMocks();
  for (const directory of temporaryDirectories.splice(0)) {
    if (dirname(resolve(directory)) !== resolve(tmpdir())) throw new Error('Unexpected cleanup directory');
    await rm(directory, { recursive: true, force: true });
  }
});

async function expectFailure(input: string, options: Parameters<typeof compileCommand>[1], message: string) {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('CLI exit'); });
  await expect(compileCommand(input, options)).rejects.toThrow('CLI exit');
  expect(errors.mock.calls.flat().map(String).join(' ')).toContain(message);
}

it.each(['html', 'css', 'js'])('rejects a %s destination that would overwrite the source', async target => {
  const { directory, input } = await fixture();
  const original = await readFile(input, 'utf8');
  const output = join(directory, 'result.html');
  await writeFile(output, 'previous export');
  await expectFailure(input, { separate: true, output, [target === 'html' ? 'output' : target]: input }, 'conflicts with source');
  expect(await readFile(input, 'utf8')).toBe(original);
  expect(await readFile(output, 'utf8')).toBe('previous export');
});

it('rejects colliding generated assets before replacing an existing export', async () => {
  const { directory, input } = await fixture();
  const output = join(directory, 'result.html');
  const asset = join(directory, 'shared');
  await writeFile(output, 'previous export');
  await expectFailure(input, { separate: true, output, css: asset, js: asset }, 'conflicts with another output');
  expect(await readFile(output, 'utf8')).toBe('previous export');
});

it('recognizes a hard link to the source as a conflicting destination', async () => {
  const { directory, input } = await fixture();
  const original = await readFile(input, 'utf8');
  const output = join(directory, 'alias.html');
  await link(input, output);
  await expectFailure(input, { output }, 'conflicts with source');
  expect(await readFile(input, 'utf8')).toBe(original);
});

it('rejects output paths that require another output to become a directory', async () => {
  const { directory, input } = await fixture();
  const output = join(directory, 'result.html');
  await expectFailure(input, { output, separate: true, css: join(output, 'style.css') }, 'File and directory paths conflict');
});

it('recognizes colliding new files through a directory alias', async () => {
  const { directory, input } = await fixture();
  const assets = join(directory, 'assets');
  const alias = join(directory, 'alias');
  await mkdir(assets);
  await symlink(assets, alias, process.platform === 'win32' ? 'junction' : 'dir');
  await expectFailure(input, {
    separate: true, output: join(directory, 'result.html'),
    css: join(assets, 'shared'), js: join(alias, 'shared'),
  }, 'conflicts with another output');
});

it.runIf(process.platform === 'win32')('rejects cross-volume assets before writing any export', async () => {
  const { directory, input } = await fixture();
  const output = join(directory, 'result.html');
  await writeFile(output, 'previous export');
  const otherDrive = parse(directory).root.toUpperCase().startsWith('Z:') ? 'Y:' : 'Z:';
  await expectFailure(input, { separate: true, output, css: otherDrive + '\\taildown-test.css' }, 'same filesystem volume');
  expect(await readFile(output, 'utf8')).toBe('previous export');
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
