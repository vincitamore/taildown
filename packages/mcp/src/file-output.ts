import {realpathSync, statSync} from 'node:fs';
import {basename, dirname, extname, join, resolve} from 'node:path';

/** Resolve a document output without allowing it to replace its source. */
export function resolveCompileOutput(inputPath: string, outputPath?: string): string {
  if (typeof inputPath !== 'string' || !inputPath.trim()) throw new Error('inputPath must be a nonempty string');
  if (outputPath !== undefined && (typeof outputPath !== 'string' || !outputPath.trim())) throw new Error('outputPath must be a nonempty string');
  const input = resolve(inputPath);
  const extension = extname(input);
  if (!/^\.(td|tdown|taildown)$/i.test(extension)) throw new Error('Input must be a .td, .tdown, or .taildown document');
  const inputInfo = statSync(input);
  if (!inputInfo.isFile()) throw new Error('Input must be a regular file');
  const output = resolve(outputPath ?? join(dirname(input), basename(input, extension) + '.html'));
  const key = (path: string) => process.platform === 'win32' ? path.toLowerCase() : path;
  if (key(output) === key(input)) throw new Error('Output path conflicts with source');
  try {
    const outputInfo = statSync(output);
    if (!outputInfo.isFile()) throw new Error('Output must be a regular file');
    if (key(realpathSync(output)) === key(realpathSync(input)) ||
      (inputInfo.ino !== 0 && inputInfo.ino === outputInfo.ino && inputInfo.dev === outputInfo.dev)) {
      throw new Error('Output path conflicts with source');
    }
  } catch (error) {
    if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
  }
  return output;
}
