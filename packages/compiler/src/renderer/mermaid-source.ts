import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

let source: Promise<string> | undefined;
/** Resolve relative to this package in both source and distributed builds. */
export function loadMermaidSource(): Promise<string> {
  return source ??= readFile(createRequire(import.meta.url).resolve('mermaid/dist/mermaid.min.js'), 'utf8');
}
