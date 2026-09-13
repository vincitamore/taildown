// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import {
  EditorState,
  EditorView,
  type CompileOptions,
} from '../../packages/compiler/src/editor-bundle';
import {
  createFileOperations,
  type FilePickers,
  type FileState,
  type ReadableFile,
  type WritableFileHandle,
} from '../files';
const editors: EditorView[] = [];
afterEach(() => {
  for (const editor of editors) editor.destroy();
  editors.length = 0;
});
function harness(filename = 'draft.td', window: FilePickers = {}) {
  const editor = new EditorView({ state: EditorState.create({ doc: 'Original' }) });
  editors.push(editor);
  const status = document.createElement('div'),
    display = document.createElement('span');
  display.textContent = filename;
  const downloads: HTMLAnchorElement[] = [],
    inputs: HTMLInputElement[] = [],
    blobs: Blob[] = [];
  const createElement: Document['createElement'] = (
    tag: string,
    options?: ElementCreationOptions
  ) => {
    const element = document.createElement(tag, options);
    if (element instanceof HTMLAnchorElement) {
      downloads.push(element);
      element.click = vi.fn();
    }
    if (element instanceof HTMLInputElement) {
      inputs.push(element);
      element.click = vi.fn();
    }
    return element;
  };
  const storage = { save: vi.fn() };
  let finish!: (value: { html: string }) => void;
  const compile = vi.fn(
    () =>
      new Promise<{ html: string }>((resolve) => {
        finish = resolve;
      })
  );
  const state: FileState = { filename, handle: null, documentVersion: 0 };
  const revokeObjectURL = vi.fn();
  const confirm = vi.fn(() => true);
  const getDesignOptions = vi.fn<[], CompileOptions>(() => ({}));
  const api = createFileOperations({
    state,
    getEditor: () => editor,
    window,
    document: { createElement },
    statusBar: status,
    filenameDisplay: display,
    draftStore: storage,
    compile,
    getDesignOptions,
    URL: {
      createObjectURL: (blob) => {
        if (blob instanceof Blob) blobs.push(blob);
        return 'blob:fixture';
      },
      revokeObjectURL,
    },
    confirm,
    DEFAULT_TEMPLATE: 'Welcome',
  });
  return {
    api: {
      ...api,
      setHandle: (handle: WritableFileHandle) => {
        state.handle = handle;
      },
    },
    editor,
    status,
    display,
    storage,
    downloads,
    inputs,
    blobs,
    compile,
    revokeObjectURL,
    confirm,
    getDesignOptions,
    complete: () => finish({ html: '<!DOCTYPE html><p>Export</p>' }),
    edit: (text: string) =>
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: text } }),
    selectFile: async (file: ReadableFile) => {
      const input = inputs.at(-1);
      if (!input) throw new Error('No file input');
      Object.defineProperty(input, 'files', { value: [file], configurable: true });
      await input.onchange?.call(input, new Event('change'));
    },
  };
}
it.each(['report.td', 'report.tdown', 'report.taildown', 'report.TAILDOWN', 'report'])(
  'exports %s with an HTML extension and MIME type',
  async (filename) => {
    const h = harness(filename);
    const pending = h.api.exportHTML();
    h.complete();
    await pending;
    expect(h.downloads[0]?.download).toBe('report.html');
    expect(h.blobs[0]?.type).toBe('text/html;charset=utf-8');
  }
);
it('keeps the filename belonging to the exported source while switching documents', async () => {
  const h = harness('guide.taildown');
  const pending = h.api.exportHTML();
  h.api.newDocument();
  h.complete();
  await pending;
  expect(h.downloads[0]?.download).toBe('guide.html');
  expect(h.display.textContent).toBe('untitled.td');
});
it('reports fallback file read errors without replacing the document', async () => {
  const h = harness();
  await h.api.openFile();
  expect(h.inputs[0]?.accept).toContain('.tdown');
  await h.selectFile({
    name: 'bad.td',
    text: () => Promise.reject(new Error('read failed')),
  });
  expect(h.status.textContent).toContain('read failed');
  expect(h.editor.state.doc.toString()).toBe('Original');
});
it('does not replace edits made while an open file is being read', async () => {
  let finish!: (value: string) => void;
  const h = harness();
  await h.api.openFile();
  const pending = h.selectFile({
    name: 'other.td',
    text: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  h.edit('Newer edits');
  finish('Other file');
  await pending;
  expect(h.editor.state.doc.toString()).toBe('Newer edits');
  expect(h.status.textContent).toContain('document changed');
});
it('does not attach a save-dialog result to a new document', async () => {
  let finish!: (value: WritableFileHandle) => void;
  const createWritable = vi.fn();
  const h = harness('old.td', {
    showSaveFilePicker: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  const pending = h.api.saveFile();
  h.api.newDocument();
  finish({ name: 'old-saved.td', createWritable });
  await pending;
  expect(createWritable).not.toHaveBeenCalled();
  expect(h.display.textContent).toBe('untitled.td');
});
it('preserves newer edits in autosave after writing the captured file version', async () => {
  let finish!: () => void;
  const write = vi.fn();
  const h = harness('draft.td', {
    showSaveFilePicker: () =>
      Promise.resolve({
        name: 'saved.td',
        createWritable: () =>
          Promise.resolve({
            write,
            close: () =>
              new Promise<void>((resolve) => {
                finish = resolve;
              }),
          }),
      }),
  });
  const pending = h.api.saveFile();
  await vi.waitFor(() => expect(write).toHaveBeenCalledWith('Original'));
  h.edit('Newer edits');
  finish();
  await pending;
  expect(h.storage.save).toHaveBeenCalledWith('Newer edits', 'saved.td');
  expect(h.status.textContent).toContain('newer edits remain');
});
it('keeps an in-progress save valid when an open dialog is cancelled', async () => {
  let finish!: (value: WritableFileHandle) => void;
  const h = harness('draft.td', {
    showSaveFilePicker: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
    showOpenFilePicker: () =>
      Promise.reject(Object.assign(new Error('cancelled'), { name: 'AbortError' })),
  });
  const pending = h.api.saveFile();
  await h.api.openFile();
  finish({
    name: 'saved.td',
    createWritable: () =>
      Promise.resolve({ write: () => Promise.resolve(), close: () => Promise.resolve() }),
  });
  await pending;
  expect(h.display.textContent).toBe('saved.td');
  expect(h.status.textContent).toBe('✓ Saved saved.td');
});
it('commits repeated saves to one handle in request order', async () => {
  let disk = '';
  const releases: Array<() => void> = [];
  const handle = {
    name: 'draft.td',
    createWritable: vi.fn(() => {
      let value = '';
      return Promise.resolve({
        write: (text: string) => {
          value = text;
          return Promise.resolve();
        },
        close: () =>
          new Promise<void>((resolve) =>
            releases.push(() => {
              disk = value;
              resolve();
            })
          ),
      });
    }),
  };
  const h = harness();
  h.api.setHandle(handle);
  const first = h.api.saveFile();
  await vi.waitFor(() => expect(releases).toHaveLength(1));
  h.edit('Newer');
  const second = h.api.saveFile();
  expect(handle.createWritable).toHaveBeenCalledTimes(1);
  releases[0]!();
  await first;
  await vi.waitFor(() => expect(releases).toHaveLength(2));
  releases[1]!();
  await second;
  expect(disk).toBe('Newer');
});

it('captures source and settings for an export and releases the download URL', async () => {
  const h = harness();
  const settings: CompileOptions = { minify: true };
  h.getDesignOptions.mockReturnValue(settings);
  const pending = h.api.exportHTML();
  settings.minify = false;
  h.edit('Newer');
  h.complete();
  await pending;
  expect(h.compile).toHaveBeenCalledWith('Original', {
    minify: true,
    inlineStyles: true,
    inlineScripts: true,
    darkMode: true,
  });
  expect(h.revokeObjectURL).toHaveBeenCalledWith('blob:fixture');
});
it('leaves the draft untouched when new-document confirmation is cancelled', () => {
  const h = harness();
  h.confirm.mockReturnValue(false);
  h.api.newDocument();
  h.api.showTemplate();
  expect(h.editor.state.doc.toString()).toBe('Original');
  expect(h.display.textContent).toBe('draft.td');
  expect(h.storage.save).not.toHaveBeenCalled();
});
it('ignores an earlier open request after a later file has been accepted', async () => {
  const h = harness();
  let finish!: (value: string) => void;
  await h.api.openFile();
  const earlier = h.selectFile({
    name: 'earlier.td',
    text: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  await h.api.openFile();
  await h.selectFile({ name: 'latest.tdown', text: () => Promise.resolve('Latest') });
  finish('Earlier');
  await earlier;
  expect(h.editor.state.doc.toString()).toBe('Latest');
  expect(h.display.textContent).toBe('latest.tdown');
});
it('opens through the native picker and saves back through that file handle', async () => {
  const write = vi.fn<[string], Promise<void>>(() => Promise.resolve());
  const showOpenFilePicker = vi.fn(() =>
    Promise.resolve([
      {
        name: 'native.td',
        getFile: () =>
          Promise.resolve({ name: 'native.td', text: () => Promise.resolve('Native') }),
        createWritable: () => Promise.resolve({ write, close: () => Promise.resolve() }),
      },
    ])
  );
  const h = harness('draft.td', { showOpenFilePicker });
  await h.api.openFile();
  h.edit('Updated');
  await h.api.saveFile();
  expect(showOpenFilePicker).toHaveBeenCalledWith({
    types: [
      { description: 'Taildown Files', accept: { 'text/plain': ['.td', '.tdown', '.taildown'] } },
    ],
    multiple: false,
  });
  expect(write).toHaveBeenCalledWith('Updated');
  expect(h.downloads).toHaveLength(0);
  expect(h.storage.save).toHaveBeenCalledWith('Updated', 'native.td');
});
it('imported source never writes through the previously opened file handle', async () => {
  const h = harness();
  const createWritable = vi.fn();
  h.api.setHandle({ name: 'original.td', createWritable });
  h.api.importDocument('Shared source', 'incoming.td');
  await h.api.saveFile();
  expect(createWritable).not.toHaveBeenCalled();
  expect(h.downloads[0]?.download).toBe('incoming.td');
  expect(h.storage.save).toHaveBeenCalledWith('Shared source', 'incoming.td');
});
it('a pending file read cannot overwrite a newly accepted shared document', async () => {
  const h = harness();
  await h.api.openFile();
  let finish!: (content: string) => void;
  const pending = h.selectFile({
    name: 'late.td',
    text: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  h.api.importDocument('Shared source', 'incoming.td');
  finish('Late read');
  await pending;
  expect(h.editor.state.doc.toString()).toBe('Shared source');
  expect(h.display.textContent).toBe('incoming.td');
});
