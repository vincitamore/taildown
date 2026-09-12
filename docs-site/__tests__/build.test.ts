import {readFileSync} from 'node:fs';
import {basename, dirname, join, relative} from 'node:path';
import {expect, it, vi} from 'vitest';

const source = readFileSync(new URL('../build.mjs', import.meta.url), 'utf8');
const functions = source.slice(source.indexOf('async function findTdFiles'), source.indexOf('main().catch'));
function harness(compile = vi.fn().mockResolvedValue({html: '<html></html>', metadata: {warnings: []}})) {
  const fs = {
    rm: vi.fn(), mkdir: vi.fn(), cp: vi.fn(), copyFile: vi.fn(), writeFile: vi.fn(),
    readdir: vi.fn().mockResolvedValue([{name: 'index.td', isDirectory: () => false, isFile: () => true}]),
    readFile: vi.fn().mockResolvedValue('<html><head><title>Editor</title></head></html>'),
  };
  const execFileSync = vi.fn();
  const loadCompiler = vi.fn().mockResolvedValue(compile);
  const context = {fs, compile, loadCompiler, execFileSync, basename, dirname, join, relative, process,
    DOCS_DIR: join('project', 'docs-site'), OUTPUT_DIR: join('project', 'docs-site', 'dist'), PROJECT_DIR: 'project',
    PAGE_METADATA: {}, PAGE_METADATA_STATIC: {'editor.html': {title: 'A & B', description: '"quoted"'}},
    BASE_URL: 'https://www.taildown.dev', console: {log: vi.fn(), error: vi.fn()},
  };
  const escape = source.split(/\r?\n/).find(line => line.startsWith('const escapeHtml'))!;
  const main = new Function(...Object.keys(context), escape + '\n' + functions + '\nreturn main;')(...Object.values(context));
  return {main, fs, execFileSync, loadCompiler};
}

it.each([
  vi.fn().mockRejectedValue(new Error('Compiler failed')),
  vi.fn().mockResolvedValue({html: '', metadata: {warnings: [{line: 3, message: 'Unclosed card'}]}}),
])('fails the release when a page fails or needs correction', async compile => {
  const {main, fs} = harness(compile);
  await expect(main()).rejects.toThrow('Failed to compile 1 documentation pages');
  expect(fs.writeFile).not.toHaveBeenCalled();
});

it('requires the newly built editor instead of falling back to checked-in HTML', async () => {
  const {main, fs} = harness();
  fs.copyFile.mockRejectedValue(new Error('Fresh editor missing'));
  await expect(main()).rejects.toThrow('Fresh editor missing');
});

it('builds fresh runtime assets and writes only to the deployment output', async () => {
  const {main, fs, execFileSync, loadCompiler} = harness();
  await main();
  expect(loadCompiler.mock.invocationCallOrder[0]).toBeLessThan(execFileSync.mock.invocationCallOrder[0]!);
  expect(execFileSync.mock.calls.map(call => call[1])).toEqual([['build-browser.mjs'], ['editor/build.mjs']]);
  expect(fs.copyFile).toHaveBeenCalledWith(join('project', 'editor/dist/editor-hosted.html'), join('project', 'docs-site/dist/editor.html'));
  expect(fs.copyFile).toHaveBeenCalledWith(join('project', 'editor/dist/editor.html'), join('project', 'docs-site/dist/offline-editor.html'));
  expect(fs.cp).toHaveBeenCalledWith(join('project', 'editor/dist/assets'), join('project', 'docs-site/dist/assets'), {recursive:true});
  expect(fs.writeFile.mock.calls.every(([path]) => String(path).startsWith(join('project', 'docs-site', 'dist')))).toBe(true);
  expect(fs.writeFile.mock.calls[1]?.[1]).toContain('A &amp; B');
  expect(fs.writeFile.mock.calls[1]?.[1]).toContain('&quot;quoted&quot;');
});

it('stops before building or publishing runtime assets when the current compiler cannot build', async () => {
  const {main, fs, execFileSync, loadCompiler} = harness();
  loadCompiler.mockRejectedValue(new Error('Compiler build failed'));
  await expect(main()).rejects.toThrow('Compiler build failed');
  expect(execFileSync).not.toHaveBeenCalled();
  expect(fs.copyFile).not.toHaveBeenCalled();
});

it('preserves compiler metadata templates embedded outside the document head', async () => {
  const {main, fs} = harness();
  const runtime = '<script>const template = `<title>Export title</title><meta name="description" content="Export description">`;</script>';
  fs.readFile.mockResolvedValue('<html><head><title>Editor</title></head><body>' + runtime + '</body></html>');
  await main();
  expect(fs.writeFile.mock.calls[1]?.[1]).toContain(runtime);
});
