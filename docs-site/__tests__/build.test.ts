import { join, resolve } from 'node:path';
import { expect, it, vi } from 'vitest';
import { createDocsBuilder, loadCompiler as buildCompiler } from '../build.mjs';
import type { CompileOptions } from '../../packages/shared/src/types';
interface PageResult {
  html: string;
  metadata: { warnings: { line?: number; message: string }[] };
}
type Compiler = (source: string, options: CompileOptions) => Promise<PageResult>;
interface Entry {
  name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}
const PROJECT_DIR = resolve('project');
function harness(
  compile = vi
    .fn<[string, CompileOptions], Promise<PageResult>>()
    .mockResolvedValue({ html: '<html></html>', metadata: { warnings: [] } }),
  outputDir = join(PROJECT_DIR, 'docs-site/dist')
) {
  const fs = {
    rm: vi
      .fn<[string, { recursive: boolean; force: boolean }], Promise<void>>()
      .mockResolvedValue(),
    mkdir: vi.fn<[string, { recursive: boolean }], Promise<void>>().mockResolvedValue(),
    cp: vi.fn<[string, string, { recursive: boolean }], Promise<void>>().mockResolvedValue(),
    copyFile: vi.fn<[string, string], Promise<void>>().mockResolvedValue(),
    writeFile: vi.fn<[string, string, 'utf-8'?], Promise<void>>().mockResolvedValue(),
    readdir: vi
      .fn<[string, { withFileTypes: true }], Promise<Entry[]>>()
      .mockResolvedValue([{ name: 'index.td', isDirectory: () => false, isFile: () => true }]),
    readFile: vi
      .fn<[string, 'utf8' | 'utf-8'], Promise<string>>()
      .mockResolvedValue('<html><head><title>Editor</title></head></html>'),
  };
  const execFileSync = vi.fn<[string, string[], { cwd: string; stdio: 'inherit' }], void>();
  const loadCompiler = vi.fn<[], Promise<Compiler>>().mockResolvedValue(compile);
  const { main } = createDocsBuilder({
    fs,
    run: execFileSync,
    compilerLoader: loadCompiler,
    docsDir: join(PROJECT_DIR, 'docs-site'),
    outputDir,
    projectDir: PROJECT_DIR,
    pageMetadata: {},
    staticMetadata: { 'editor.html': { title: 'A & B', description: '"quoted"' } },
    logger: { log: vi.fn(), error: vi.fn() },
  });
  return { main, fs, execFileSync, loadCompiler };
}
it.each([
  vi
    .fn<[string, CompileOptions], Promise<PageResult>>()
    .mockRejectedValue(new Error('Compiler failed')),
  vi.fn<[string, CompileOptions], Promise<PageResult>>().mockResolvedValue({
    html: '',
    metadata: { warnings: [{ line: 3, message: 'Unclosed card' }] },
  }),
])('fails the release when a page fails or needs correction', async (compile) => {
  const { main, fs } = harness(compile);
  await expect(main()).rejects.toThrow('Failed to compile 1 documentation pages');
  expect(fs.writeFile).not.toHaveBeenCalled();
});

it('requires the newly built editor instead of falling back to checked-in HTML', async () => {
  const { main, fs } = harness();
  fs.copyFile.mockRejectedValue(new Error('Fresh editor missing'));
  await expect(main()).rejects.toThrow('Fresh editor missing');
});

it('builds fresh runtime assets and writes only to the deployment output', async () => {
  const { main, fs, execFileSync, loadCompiler } = harness();
  await main();
  expect(loadCompiler.mock.invocationCallOrder[0]).toBeLessThan(
    execFileSync.mock.invocationCallOrder[0]!
  );
  expect(execFileSync.mock.calls.map((call) => call[1])).toEqual([
    ['build-browser.mjs'],
    ['editor/build.mjs'],
  ]);
  expect(fs.copyFile).toHaveBeenCalledWith(
    join(PROJECT_DIR, 'editor/dist/editor-hosted.html'),
    join(PROJECT_DIR, 'docs-site/dist/editor.html')
  );
  expect(fs.copyFile).toHaveBeenCalledWith(
    join(PROJECT_DIR, 'editor/dist/editor.html'),
    join(PROJECT_DIR, 'docs-site/dist/offline-editor.html')
  );
  expect(fs.cp).toHaveBeenCalledWith(
    join(PROJECT_DIR, 'editor/dist/assets'),
    join(PROJECT_DIR, 'docs-site/dist/assets'),
    { recursive: true }
  );
  expect(
    fs.writeFile.mock.calls.every(([path]) =>
      String(path).startsWith(join(PROJECT_DIR, 'docs-site', 'dist'))
    )
  ).toBe(true);
  expect(fs.writeFile.mock.calls[1]?.[1]).toContain('A &amp; B');
  expect(fs.writeFile.mock.calls[1]?.[1]).toContain('&quot;quoted&quot;');
});

it('stops before building or publishing runtime assets when the current compiler cannot build', async () => {
  const { main, fs, execFileSync, loadCompiler } = harness();
  loadCompiler.mockRejectedValue(new Error('Compiler build failed'));
  await expect(main()).rejects.toThrow('Compiler build failed');
  expect(execFileSync).not.toHaveBeenCalled();
  expect(fs.copyFile).not.toHaveBeenCalled();
});

it('preserves compiler metadata templates embedded outside the document head', async () => {
  const { main, fs } = harness();
  const runtime =
    '<script>const template = `<title>Export title</title><meta name="description" content="Export description">`;</script>';
  fs.readFile.mockResolvedValue(
    '<html><head><title>Editor</title></head><body>' + runtime + '</body></html>'
  );
  await main();
  expect(fs.writeFile.mock.calls[1]?.[1]).toContain(runtime);
});

it('builds shared and compiler packages before importing the newly built compiler', async () => {
  const run = vi.fn<[string, string[], { cwd: string; stdio: 'inherit' }], void>();
  const compile: Compiler = () => Promise.resolve({ html: 'fresh', metadata: { warnings: [] } });
  const importCompiler = vi.fn<[string], Promise<{ compile: Compiler }>>(() => {
    expect(run).toHaveBeenCalledTimes(2);
    return Promise.resolve({ compile });
  });
  const loaded = await buildCompiler({
    fs: { readFile: () => Promise.resolve('{"bin":{"tsup":"dist/cli.js"}}') },
    run,
    projectDir: PROJECT_DIR,
    resolvePackage: () => join(PROJECT_DIR, 'node_modules/tsup/package.json'),
    importCompiler,
  });
  expect(loaded).toBe(compile);
  expect(run.mock.calls.map(([, args, options]) => ({ args, cwd: options.cwd }))).toEqual(
    ['shared', 'compiler'].map((name) => ({
      args: [join(PROJECT_DIR, 'node_modules/tsup/dist/cli.js')],
      cwd: join(PROJECT_DIR, 'packages', name),
    }))
  );
  expect(importCompiler.mock.calls[0]?.[0]).toMatch(/packages\/compiler\/dist\/index.js$/);
});
it('does not import compiler output after a package build fails', async () => {
  const importCompiler = vi.fn();
  await expect(
    buildCompiler({
      fs: { readFile: () => Promise.resolve('{"bin":{"tsup":"dist/cli.js"}}') },
      run: () => {
        throw new Error('Build failed');
      },
      resolvePackage: () => join(PROJECT_DIR, 'node_modules/tsup/package.json'),
      importCompiler,
    })
  ).rejects.toThrow('Build failed');
  expect(importCompiler).not.toHaveBeenCalled();
});
it('rejects output directories outside docs dist before touching files', async () => {
  const h = harness(undefined, join(PROJECT_DIR, 'other/dist'));
  await expect(h.main()).rejects.toThrow('Invalid output directory');
  expect(h.fs.rm).not.toHaveBeenCalled();
  expect(h.loadCompiler).not.toHaveBeenCalled();
});
