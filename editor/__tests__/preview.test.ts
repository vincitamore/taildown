import { readFileSync } from 'node:fs';
import { JSDOM } from '../../packages/compiler/node_modules/jsdom';
import { expect, it, vi } from 'vitest';

// Exercise the functions shipped in the standalone template with controlled compile timing.
const template = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = template.slice(template.indexOf('    let previewRevision = 0;'), template.indexOf('    // New document'));
function harness() {
  const dom = new JSDOM('<details id="diagnostics" hidden><summary></summary><ul></ul></details>');
  const pending: Array<{resolve: (value: unknown) => void; reject: (error: Error) => void}> = [];
  const compile = () => new Promise((resolve, reject) => pending.push({resolve, reject}));
  const frame = {srcdoc: 'initial', addEventListener: vi.fn()};
  const status = {textContent: '', className: ''};
  const create = new Function('compile', 'previewFrame', 'statusBar', 'document', 'setTimeout', 'clearTimeout', 'const designSettings = {options:{}}; let updateTimeout = null;\n' + source + '\nreturn {updatePreview, scheduleUpdate};');
  const controller = create(compile, frame, status, dom.window.document, vi.fn(), vi.fn());
  return {dom, pending, frame, status, controller};
}
const result = (html: string) => ({html, metadata: {warnings: []}});

it('does not publish a slower previous compile after a newer one', async () => {
  const h = harness();
  const first = h.controller.updatePreview('old');
  const second = h.controller.updatePreview('new');
  h.pending[1]!.resolve(result('new'));
  await second;
  h.pending[0]!.resolve(result('old'));
  await first;
  expect(h.frame.srcdoc).toBe('new');
  h.dom.window.close();
});

it('invalidates old results during the typing debounce', async () => {
  const h = harness();
  const first = h.controller.updatePreview('old');
  h.controller.scheduleUpdate();
  h.pending[0]!.resolve(result('old'));
  await first;
  expect(h.frame.srcdoc).toBe('initial');
  h.dom.window.close();
});

it('does not replace current status with a stale error', async () => {
  const h = harness();
  const first = h.controller.updatePreview('old');
  const second = h.controller.updatePreview('new');
  h.pending[1]!.resolve(result('new'));
  await second;
  h.pending[0]!.reject(new Error('old failure'));
  await first;
  expect(h.status.className).toBe('success');
  h.dom.window.close();
});

it('hides notices that belong to the previous document when editing begins', () => {
  const h = harness();
  const notices = h.dom.window.document.getElementById('diagnostics')!;
  notices.hidden = false;
  h.controller.scheduleUpdate();
  expect(notices.hidden).toBe(true);
  h.dom.window.close();
});
