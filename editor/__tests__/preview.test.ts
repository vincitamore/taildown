// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { EditorState, EditorView } from '../../packages/compiler/src/editor-bundle';
import { createPreviewController, type PreviewResult } from '../preview';
const editors: EditorView[] = [];
afterEach(() => {
  for (const editor of editors) editor.destroy();
  editors.length = 0;
  vi.clearAllTimers();
  vi.useRealTimers();
  document.body.replaceChildren();
  vi.restoreAllMocks();
});
function harness() {
  vi.useFakeTimers();
  const notices = document.createElement('details');
  notices.id = 'diagnostics';
  notices.hidden = true;
  notices.innerHTML = '<summary></summary><ul></ul>';
  const frame = document.createElement('iframe');
  frame.srcdoc = 'initial';
  document.body.append(notices, frame);
  const status = document.createElement('div');
  const editor = new EditorView({
    state: EditorState.create({ doc: 'First\nSecond\nThird' }),
    parent: document.body,
  });
  editors.push(editor);
  const storage = { save: vi.fn() };
  const pending: Array<{ resolve(value: PreviewResult): void; reject(error: Error): void }> = [];
  const compile = vi.fn(
    () => new Promise<PreviewResult>((resolve, reject) => pending.push({ resolve, reject }))
  );
  const controller = createPreviewController({
    compile,
    previewFrame: frame,
    statusBar: status,
    document,
    diagnostics: notices,
    getEditor: () => editor,
    getDesignOptions: () => ({}),
    getFilename: () => 'draft.td',
    draftStore: storage,
  });
  return { pending, frame, status, controller, notices, editor, storage, compile };
}
const result = (html: string): PreviewResult => ({ html, metadata: { warnings: [] } });
it('does not publish a slower previous compile after a newer one', async () => {
  const h = harness();
  const first = h.controller.updatePreview('old');
  const second = h.controller.updatePreview('new');
  h.pending[1]!.resolve(result('new'));
  await second;
  h.pending[0]!.resolve(result('old'));
  await first;
  expect(h.frame.srcdoc).toBe('new');
});

it('invalidates old results during the typing debounce', async () => {
  const h = harness();
  const first = h.controller.updatePreview('old');
  h.controller.scheduleUpdate();
  h.pending[0]!.resolve(result('old'));
  await first;
  expect(h.frame.srcdoc).toBe('initial');
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
});

it('hides notices that belong to the previous document when editing begins', () => {
  const h = harness();
  const notices = h.notices;
  notices.hidden = false;
  h.controller.scheduleUpdate();
  expect(notices.hidden).toBe(true);
});

it('debounces compilation and autosaves the latest editor content', async () => {
  const h = harness();
  h.controller.scheduleUpdate();
  await vi.advanceTimersByTimeAsync(700);
  h.editor.dispatch({ changes: { from: 0, to: h.editor.state.doc.length, insert: 'Latest' } });
  h.controller.scheduleUpdate();
  await vi.advanceTimersByTimeAsync(999);
  expect(h.compile).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1);
  expect(h.compile).toHaveBeenCalledWith('Latest', {
    inlineStyles: true,
    inlineScripts: true,
    darkMode: true,
  });
  expect(h.storage.save).toHaveBeenCalledWith('Latest', 'draft.td');
  h.pending[0]?.resolve(result('Latest'));
  await Promise.resolve();
});
it('renders warning text literally and focuses clamped source locations', async () => {
  const h = harness();
  const focus = vi.spyOn(h.editor, 'focus');
  const pending = h.controller.updatePreview('source');
  h.pending[0]?.resolve({
    html: 'preview',
    metadata: {
      warnings: [
        { type: 'validation', message: '<img src=x>', line: 99, column: 999 },
        { type: 'parse', message: 'No location', line: 0 },
      ],
    },
  });
  await pending;
  expect(h.notices.hidden).toBe(false);
  expect(h.notices.querySelector('summary')?.textContent).toBe('2 compilation notices');
  expect(h.notices.querySelector('img')).toBeNull();
  expect(h.notices.textContent).toContain('<img src=x>');
  h.notices.querySelector('button')?.click();
  expect(h.editor.state.selection.main.head).toBe(h.editor.state.doc.length);
  expect(focus).toHaveBeenCalledOnce();
  expect(h.notices.querySelectorAll('button')).toHaveLength(1);
});
it('reports the current failure and recovers on the next successful compile', async () => {
  const h = harness();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  h.notices.hidden = false;
  const failure = h.controller.updatePreview('broken');
  h.pending[0]?.reject(new Error('Current failure'));
  await failure;
  expect(h.status.textContent).toContain('Error: Current failure');
  expect(h.status.className).toBe('error');
  expect(h.notices.hidden).toBe(true);
  expect(h.frame.srcdoc).toBe('initial');
  const recovery = h.controller.updatePreview('fixed');
  h.pending[1]?.resolve(result('fixed'));
  await recovery;
  expect(h.frame.srcdoc).toBe('fixed');
  expect(h.status.className).toBe('success');
});
it('restores iframe scroll only for the latest accepted preview', async () => {
  const h = harness();
  const doc = h.frame.contentDocument;
  if (!doc) throw new Error('Missing iframe document');
  doc.documentElement.scrollTop = 90;
  doc.documentElement.scrollLeft = 12;
  const first = h.controller.updatePreview('first');
  h.pending[0]?.resolve(result('first'));
  await first;
  doc.documentElement.scrollTop = 180;
  doc.documentElement.scrollLeft = 24;
  const second = h.controller.updatePreview('second');
  h.pending[1]?.resolve(result('second'));
  await second;
  doc.documentElement.scrollTop = 0;
  doc.documentElement.scrollLeft = 0;
  h.frame.dispatchEvent(new Event('load'));
  expect(doc.documentElement.scrollTop).toBe(180);
  expect(doc.documentElement.scrollLeft).toBe(24);
  expect(doc.body.scrollTop).toBe(180);
});
it('continues compiling when the iframe document cannot be accessed', async () => {
  const h = harness();
  vi.spyOn(h.frame, 'contentDocument', 'get').mockImplementation(() => {
    throw new Error('Access denied');
  });
  const pending = h.controller.updatePreview('source');
  h.pending[0]?.resolve(result('preview'));
  await pending;
  h.frame.dispatchEvent(new Event('load'));
  expect(h.frame.srcdoc).toBe('preview');
  expect(h.status.className).toBe('success');
});

it('keeps fragment clicks in the preview without rewriting authored links', async () => {
  const h = harness();
  const pending = h.controller.updatePreview('source');
  h.pending[0]!.resolve(result('preview'));
  await pending;
  const doc = h.frame.contentDocument!;
  doc.body.innerHTML = '<a href="#section"><span>Jump</span></a><h2 id="section">Section</h2>';
  h.frame.dispatchEvent(new Event('load'));
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
  doc.querySelector('span')!.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  expect(doc.defaultView!.location.hash).toBe('#section');
  expect(doc.querySelector('a')!.getAttribute('href')).toBe('#section');
});

it('leaves handled, modified, download and other-target links alone', async () => {
  const h = harness();
  const pending = h.controller.updatePreview('source');
  h.pending[0]!.resolve(result('preview'));
  await pending;
  const doc = h.frame.contentDocument!;
  h.frame.dispatchEvent(new Event('load'));
  for (const attributes of [
    'href="https://example.com"',
    'href="#section" target="_blank"',
    'href="#section" download',
  ]) {
    doc.body.innerHTML = '<a ' + attributes + '>Link</a>';
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    doc.querySelector('a')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  }
  doc.body.innerHTML = '<a href="#section">Link</a>';
  const modified = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
  doc.querySelector('a')!.dispatchEvent(modified);
  expect(modified.defaultPrevented).toBe(false);
  const handled = new MouseEvent('click', { bubbles: true, cancelable: true });
  handled.preventDefault();
  doc.querySelector('a')!.dispatchEvent(handled);
  expect(doc.defaultView!.location.hash).toBe('');
});
