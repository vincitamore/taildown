import type { CompileOptions, EditorView } from '../packages/compiler/src/editor-bundle';

export interface ReadableFile {
  name: string;
  text(): Promise<string>;
}
export interface WritableFileHandle {
  name: string;
  createWritable(): Promise<{ write(content: string): Promise<void>; close(): Promise<void> }>;
}
export interface OpenFileHandle extends WritableFileHandle {
  getFile(): Promise<ReadableFile>;
}
interface PickerOptions {
  types: { description: string; accept: Record<string, string[]> }[];
}
export interface FilePickers {
  showOpenFilePicker?: (
    options: PickerOptions & { multiple: boolean }
  ) => Promise<OpenFileHandle[]>;
  showSaveFilePicker?: (
    options: PickerOptions & { suggestedName: string }
  ) => Promise<WritableFileHandle>;
}
export interface FileState {
  filename: string;
  handle: WritableFileHandle | null;
  documentVersion: number;
}
interface Dependencies {
  state: FileState;
  getEditor(): Pick<EditorView, 'state' | 'dispatch'>;
  window: FilePickers;
  document: Pick<Document, 'createElement'>;
  statusBar: Pick<HTMLElement, 'textContent' | 'className'>;
  filenameDisplay: Pick<HTMLElement, 'textContent' | 'title'>;
  draftStore: { save(content: string, filename: string): unknown };
  compile(source: string, options: CompileOptions): Promise<{ html: string }>;
  getDesignOptions(): CompileOptions;
  URL: Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;
  confirm(message: string): boolean;
  DEFAULT_TEMPLATE: string;
}
const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
export function createFileOperations({
  state,
  getEditor,
  window,
  document,
  statusBar,
  filenameDisplay,
  draftStore,
  compile,
  getDesignOptions,
  URL,
  confirm,
  DEFAULT_TEMPLATE,
}: Dependencies) {
  let openRequestVersion = 0;
  const pendingFileWrites = new WeakMap<WritableFileHandle, Promise<void>>();
  // New document
  function newDocument() {
    if (confirm('Create new document? Any unsaved changes will be lost.')) {
      state.documentVersion++;
      // Start with a truly blank document
      const blankContent = '# New Document\n\n';
      getEditor().dispatch({
        changes: { from: 0, to: getEditor().state.doc.length, insert: blankContent },
      });
      state.filename = 'untitled.td';
      state.handle = null;
      filenameDisplay.textContent = filenameDisplay.title = state.filename;
      draftStore.save(blankContent, state.filename);
    }
  }

  // Show welcome template
  function showTemplate() {
    const currentContent = getEditor().state.doc.toString();
    const hasContent = currentContent.trim().length > 0 && currentContent !== '# New Document\n\n';

    if (hasContent && !confirm('Load welcome template? Any unsaved changes will be lost.')) {
      return;
    }
    state.documentVersion++;

    getEditor().dispatch({
      changes: { from: 0, to: getEditor().state.doc.length, insert: DEFAULT_TEMPLATE },
    });
    state.filename = 'welcome.td';
    state.handle = null;
    filenameDisplay.textContent = filenameDisplay.title = state.filename;
    // Don't clear localStorage - this is just a preview
  }

  // Open file
  async function openFile() {
    const version = state.documentVersion;
    const requestVersion = ++openRequestVersion;
    const originalDocument = getEditor().state.doc;
    const acceptFile = async (file: ReadableFile, fileHandle: WritableFileHandle | null = null) => {
      try {
        const content = await file.text();
        if (version !== state.documentVersion || requestVersion !== openRequestVersion) return;
        if (getEditor().state.doc !== originalDocument) {
          statusBar.textContent = 'File not opened: the document changed while opening. Try again.';
          statusBar.className = 'error';
          return;
        }
        state.documentVersion++;
        state.handle = fileHandle;
        state.filename = file.name;
        filenameDisplay.textContent = filenameDisplay.title = state.filename;
        getEditor().dispatch({
          changes: { from: 0, to: getEditor().state.doc.length, insert: content },
        });
        statusBar.textContent = `✓ Opened ${state.filename}`;
        statusBar.className = 'success';
      } catch (error) {
        if (version !== state.documentVersion || requestVersion !== openRequestVersion) return;
        statusBar.textContent = `✗ Error opening file: ${errorMessage(error)}`;
        statusBar.className = 'error';
      }
    };
    try {
      if (window.showOpenFilePicker) {
        // Modern File System API
        const [fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'Taildown Files',
              accept: { 'text/plain': ['.td', '.tdown', '.taildown'] },
            },
          ],
          multiple: false,
        });
        if (!fileHandle) return;
        const file = await fileHandle.getFile();
        await acceptFile(file, fileHandle);
      } else {
        // Fallback: traditional file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.td,.tdown,.taildown';
        input.onchange = async () => {
          const file = input.files?.[0];
          if (file) {
            await acceptFile(file);
          }
        };
        input.click();
      }
    } catch (error) {
      if (version !== state.documentVersion || requestVersion !== openRequestVersion) return;
      if (!(error instanceof Error && error.name === 'AbortError')) {
        statusBar.textContent = `✗ Error opening file: ${errorMessage(error)}`;
        statusBar.className = 'error';
        console.error('Error opening file:', error);
      }
    }
  }

  // Save file
  async function writeFileSnapshot(fileHandle: WritableFileHandle, content: string) {
    const previous = pendingFileWrites.get(fileHandle) || Promise.resolve();
    const pending = previous
      .catch(() => {})
      .then(async () => {
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
      });
    pendingFileWrites.set(fileHandle, pending);
    try {
      await pending;
    } finally {
      if (pendingFileWrites.get(fileHandle) === pending) pendingFileWrites.delete(fileHandle);
    }
  }

  async function saveFile() {
    const version = state.documentVersion;
    const filename = state.filename;
    const existingHandle = state.handle;
    try {
      const content = getEditor().state.doc.toString();

      if (existingHandle && 'createWritable' in existingHandle) {
        // File System API save
        await writeFileSnapshot(existingHandle, content);
        if (version !== state.documentVersion) return;
        statusBar.textContent = `✓ Saved ${state.filename}`;
        statusBar.className = 'success';
      } else if (window.showSaveFilePicker) {
        // Show save dialog
        const fileHandle = await window.showSaveFilePicker({
          types: [
            {
              description: 'Taildown Files',
              accept: { 'text/plain': ['.td'] },
            },
          ],
          suggestedName: filename,
        });
        if (version !== state.documentVersion) return;
        await writeFileSnapshot(fileHandle, content);
        if (version !== state.documentVersion) return;
        state.handle = fileHandle;
        state.filename = fileHandle.name;
        filenameDisplay.textContent = filenameDisplay.title = state.filename;
        statusBar.textContent = `✓ Saved ${state.filename}`;
        statusBar.className = 'success';
      } else {
        // Fallback: download
        downloadFile(content, filename);
      }

      // Browser recovery failure must not turn a successful file write into an error.
      draftStore.save(getEditor().state.doc.toString(), state.filename);
      if (content !== getEditor().state.doc.toString())
        statusBar.textContent += ' (newer edits remain)';
    } catch (error) {
      if (version !== state.documentVersion) return;
      if (!(error instanceof Error && error.name === 'AbortError')) {
        statusBar.textContent = `✗ Error saving: ${errorMessage(error)}`;
        statusBar.className = 'error';
        console.error('Error saving file:', error);
      }
    }
  }

  // Download file
  function downloadFile(content: string, filename: string, mimeType = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    statusBar.textContent = `✓ Downloaded ${filename}`;
    statusBar.className = 'success';
  }

  // Export HTML
  async function exportHTML() {
    const filename = state.filename;
    try {
      const source = getEditor().state.doc.toString();

      const result = await compile(source, {
        ...getDesignOptions(),
        inlineStyles: true,
        inlineScripts: true,
        darkMode: true,
      });

      const htmlFilename = /\.(?:td|tdown|taildown)$/i.test(filename)
        ? filename.replace(/\.(?:td|tdown|taildown)$/i, '.html')
        : filename + '.html';
      downloadFile(result.html, htmlFilename, 'text/html;charset=utf-8');
      statusBar.textContent = `✓ Exported ${htmlFilename}`;
      statusBar.className = 'success';
    } catch (error) {
      statusBar.textContent = `✗ Export failed: ${errorMessage(error)}`;
      statusBar.className = 'error';
      console.error('Export error:', error);
    }
  }

  return { newDocument, showTemplate, openFile, saveFile, downloadFile, exportHTML };
}
