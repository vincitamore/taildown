import type { EditorView } from '../packages/compiler/src/editor-bundle';
interface SavedDraft {
  content: string;
  filename: string;
}
interface RecoveryOptions {
  editor: Pick<EditorView, 'state' | 'dispatch'>;
  draftStore: { load(): SavedDraft | null };
  setFilename(filename: string): void;
  updatePreview(source: string): void | Promise<void>;
}
/** Restored edits use the editor update listener; only a fresh template needs an explicit preview. */
export function restoreDraft({
  editor,
  draftStore,
  setFilename,
  updatePreview,
}: RecoveryOptions): void {
  const saved = draftStore.load();
  if (saved !== null) {
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: saved.content } });
    if (saved.filename) setFilename(saved.filename);
  } else {
    void updatePreview(editor.state.doc.toString());
  }
}
interface UnloadOptions {
  getContent(): string | undefined;
  getFilename(): string;
  draftStore: { isSaved(content: string, filename: string): boolean };
}
export function createBeforeUnloadHandler({ getContent, getFilename, draftStore }: UnloadOptions) {
  return (event: Pick<BeforeUnloadEvent, 'preventDefault'> & { returnValue: unknown }): void => {
    const current = getContent();
    if (current !== undefined && !draftStore.isSaved(current, getFilename())) {
      event.preventDefault();
      event.returnValue = '';
    }
  };
}
