// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { beforeEach, expect, it, vi } from 'vitest';
import { initializeMobileEditor } from '../mobile';

function setup() {
  document.body.innerHTML = new DOMParser().parseFromString(
    readFileSync('editor/index.html', 'utf8'),
    'text/html'
  ).body.innerHTML;
  const media = Object.assign(new EventTarget(), { matches: true });
  vi.stubGlobal('matchMedia', () => media);
  const focusEditor = vi.fn(),
    setMobile = vi.fn();
  initializeMobileEditor({
    window,
    document,
    focusEditor,
    setMobile,
    openDesign: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    find: vi.fn(),
  });
  return { media, focusEditor, setMobile };
}
beforeEach(() => vi.unstubAllGlobals());
const button = (id: string) => document.getElementById(id) as HTMLButtonElement;
it('keeps inactive panes inert and exposes both again on desktop', () => {
  const { media, setMobile } = setup();
  button('mobile-preview').click();
  expect(button('editor-pane').inert).toBe(true);
  expect(button('preview-pane').inert).toBe(false);
  media.matches = false;
  media.dispatchEvent(new Event('change'));
  expect(button('editor-pane').inert).toBe(false);
  expect(button('file-actions').hidden).toBe(false);
  expect(setMobile).toHaveBeenCalledWith(false);
});
it('returns to source before a diagnostic tries to focus the editor', () => {
  setup();
  button('mobile-preview').click();
  const diagnostic = document.createElement('button');
  button('diagnostics').append(diagnostic);
  let inertAtActivation = true;
  diagnostic.onclick = () => {
    inertAtActivation = button('editor-pane').inert;
  };
  diagnostic.click();
  expect(inertAtActivation).toBe(false);
  expect(button('mobile-edit').getAttribute('aria-pressed')).toBe('true');
});
it('closes file actions with Escape and restores the trigger focus', () => {
  setup();
  button('file-menu-toggle').click();
  expect(button('file-actions').hidden).toBe(false);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(button('file-actions').hidden).toBe(true);
  expect(document.activeElement).toBe(button('file-menu-toggle'));
});
