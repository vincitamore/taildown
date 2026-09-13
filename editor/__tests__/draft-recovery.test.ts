import { expect, it, vi } from 'vitest';
import { EditorState } from '../../packages/compiler/src/editor-bundle';
import { restoreDraft, createBeforeUnloadHandler } from '../recovery';
it.each(['', 'A saved document\n'])('restores saved content %j and its filename', (content) => {
  const editor = { state: EditorState.create({ doc: 'Welcome' }), dispatch: vi.fn() };
  const setFilename = vi.fn();
  const updatePreview = vi.fn();
  restoreDraft({
    editor,
    setFilename,
    updatePreview,
    draftStore: { load: () => ({ content, filename: 'draft.td' }) },
  });
  expect(editor.dispatch).toHaveBeenCalledWith({ changes: { from: 0, to: 7, insert: content } });
  expect(setFilename).toHaveBeenCalledWith('draft.td');
  expect(updatePreview).not.toHaveBeenCalled();
});
it('uses the welcome document only when no saved draft exists', () => {
  const editor = { state: EditorState.create({ doc: 'Welcome' }), dispatch: vi.fn() };
  const updatePreview = vi.fn();
  const setFilename = vi.fn();
  restoreDraft({ editor, updatePreview, setFilename, draftStore: { load: () => null } });
  expect(editor.dispatch).not.toHaveBeenCalled();
  expect(setFilename).not.toHaveBeenCalled();
  expect(updatePreview).toHaveBeenCalledWith('Welcome');
});
it.each([
  ['previous content', true],
  ['', false],
])('treats deletion to empty as an unsaved edit against %j', (saved, needsWarning) => {
  const isSaved = vi.fn((current: string) => current === saved);
  const handler = createBeforeUnloadHandler({
    getContent: () => '',
    getFilename: () => 'draft.td',
    draftStore: { isSaved },
  });
  const event = { preventDefault: vi.fn(), returnValue: undefined };
  handler(event);
  expect(event.preventDefault).toHaveBeenCalledTimes(needsWarning ? 1 : 0);
  expect(isSaved).toHaveBeenCalledWith('', 'draft.td');
  expect(event.returnValue).toBe(needsWarning ? '' : undefined);
});
it('does not warn before the editor has initialized', () => {
  const isSaved = vi.fn();
  const event = { preventDefault: vi.fn(), returnValue: undefined };
  createBeforeUnloadHandler({
    getContent: () => undefined,
    getFilename: () => 'draft.td',
    draftStore: { isSaved },
  })(event);
  expect(isSaved).not.toHaveBeenCalled();
  expect(event.preventDefault).not.toHaveBeenCalled();
});
