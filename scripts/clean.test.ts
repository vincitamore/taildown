import {afterEach, expect, it} from 'vitest';
import {mkdtempSync, mkdirSync, writeFileSync, copyFileSync, existsSync, readFileSync, rmSync, symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const created: string[] = [];
function fixture() {
  const base = mkdtempSync(join(tmpdir(), 'taildown clean '));
  created.push(base);
  const root = join(base, 'checkout');
  mkdirSync(join(root, 'scripts'), {recursive: true});
  copyFileSync(fileURLToPath(new URL('./clean.mjs', import.meta.url)), join(root, 'scripts/clean.mjs'));
  for (const path of ['packages/compiler/dist', 'packages/compiler/node_modules', 'editor/dist', 'docs-site/dist', 'examples/dist', 'node_modules', 'coverage']) {
    mkdirSync(join(root, path), {recursive: true});
    writeFileSync(join(root, path, 'generated.txt'), 'generated');
  }
  writeFileSync(join(root, 'packages/compiler/package.json'), '{}');
  writeFileSync(join(root, 'examples/source.td'), '# Keep me');
  return {base, root, run: (args: string[] = [], cwd = root) => spawnSync(process.execPath, [join(root, 'scripts/clean.mjs'), ...args], {cwd, encoding: 'utf8'})};
}
afterEach(() => created.splice(0).forEach(path => rmSync(path, {recursive: true, force: true})));
it('cleans all generated distributions and dependencies while preserving source, and can repeat', () => {
  const {root, run} = fixture();
  expect(run().status).toBe(0);
  for (const path of ['packages/compiler/dist', 'packages/compiler/node_modules', 'editor/dist', 'docs-site/dist', 'examples/dist', 'node_modules', 'coverage']) expect(existsSync(join(root, path))).toBe(false);
  expect(readFileSync(join(root, 'examples/source.td'), 'utf8')).toBe('# Keep me');
  expect(run().status).toBe(0);
});
it('package cleanup removes only that package build output', () => {
  const {root, run} = fixture();
  expect(run(['--package'], join(root, 'packages/compiler')).status).toBe(0);
  expect(existsSync(join(root, 'packages/compiler/dist'))).toBe(false);
  expect(existsSync(join(root, 'packages/compiler/node_modules'))).toBe(true);
  expect(existsSync(join(root, 'editor/dist'))).toBe(true);
});
it('rejects invalid arguments and package locations before changing files', () => {
  const {root, run} = fixture();
  expect(run(['--package']).status).toBe(1);
  expect(run(['../']).status).toBe(1);
  expect(existsSync(join(root, 'packages/compiler/dist/generated.txt'))).toBe(true);
});
it('rejects an external ancestor before removing any earlier target', () => {
  const {base, root, run} = fixture();
  const outside = join(base, 'outside');
  mkdirSync(join(outside, 'dist'), {recursive: true});
  writeFileSync(join(outside, 'dist/keep.txt'), 'keep');
  rmSync(join(root, 'editor'), {recursive: true});
  symlinkSync(outside, join(root, 'editor'), 'junction');
  const result = run();
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('leaves the repository');
  expect(existsSync(join(root, 'packages/compiler/dist/generated.txt'))).toBe(true);
  expect(readFileSync(join(outside, 'dist/keep.txt'), 'utf8')).toBe('keep');
});
it('unlinks a final build-directory junction without deleting its external contents', () => {
  const {base, root, run} = fixture();
  const outside = join(base, 'external-build');
  mkdirSync(outside);
  writeFileSync(join(outside, 'keep.txt'), 'keep');
  rmSync(join(root, 'packages/compiler/dist'), {recursive: true});
  symlinkSync(outside, join(root, 'packages/compiler/dist'), 'junction');
  expect(run(['--package'], join(root, 'packages/compiler')).status).toBe(0);
  expect(existsSync(join(root, 'packages/compiler/dist'))).toBe(false);
  expect(readFileSync(join(outside, 'keep.txt'), 'utf8')).toBe('keep');
});
