import {existsSync, readdirSync, realpathSync, rmSync} from 'node:fs';
import {dirname, join, relative, resolve, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = realpathSync(fileURLToPath(new URL('..', import.meta.url)));
const inside = path => {
  const rel = relative(root, path);
  return rel !== '..' && !rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && !isAbsolute(rel);
};
try {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== '--package')) {
    throw new Error('Usage: node scripts/clean.mjs [--package]');
  }
  const packages = readdirSync(join(root, 'packages'), {withFileTypes: true})
    .filter(entry => entry.isDirectory() && existsSync(join(root, 'packages', entry.name, 'package.json')))
    .map(entry => join(root, 'packages', entry.name));
  const cwd = realpathSync(process.cwd());
  if (args.length && !packages.some(path => realpathSync(path) === cwd)) {
    throw new Error('--package must run from a package directory');
  }
  const targets = args.length ? [join(cwd, 'dist')] : [
    ...packages.flatMap(path => [join(path, 'dist'), join(path, 'node_modules')]),
    ...['editor', 'docs-site', 'examples'].map(path => join(root, path, 'dist')),
    join(root, 'coverage'), join(root, 'node_modules'),
  ];
  // Validate every existing ancestor before removing anything. A linked final
  // target is unlinked by rmSync; an ancestor must stay inside this checkout.
  for (const target of targets) {
    let parent = dirname(target);
    while (!existsSync(parent)) parent = dirname(parent);
    if (!inside(resolve(target)) || !inside(realpathSync(parent))) {
      throw new Error(`Cleanup target leaves the repository: ${target}`);
    }
  }
  for (const target of targets) rmSync(target, {recursive: true, force: true});
  console.log(args.length ? 'Package build output removed.' : 'Build output and installed dependencies removed. Run pnpm install before rebuilding.');
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
