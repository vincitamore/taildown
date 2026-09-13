// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { expect, it, vi } from 'vitest';
import { getAuthoringReference } from '../../packages/compiler/src/authoring-reference';
import { compile } from '../../packages/compiler/src/index';
import { EditorState, type CompileOptions } from '../../packages/compiler/src/editor-bundle';
import { commandEdit, createCuratedCommands, createCommands, type SlashState } from '../commands';
const source = readFileSync(resolve('editor/index.html'), 'utf8');
function findCurated(name: string) {
  const command = createCuratedCommands().find((command) => command.name === name);
  if (!command) throw new Error(name);
  return command;
}
async function harness() {
  document.body.innerHTML = new DOMParser().parseFromString(source, 'text/html').body.innerHTML;
  HTMLElement.prototype.scrollIntoView = () => {};
  const dialog = document.querySelector('dialog');
  const search = document.querySelector<HTMLInputElement>('#command-search');
  const results = document.getElementById('command-results'),
    empty = document.getElementById('command-empty'),
    close = document.getElementById('command-close'),
    open = document.getElementById('commands-btn'),
    menu = document.getElementById('slash-menu');
  if (!dialog || !search || !results || !empty || !close || !open || !menu)
    throw new Error('Missing command controls');
  dialog.showModal = () => dialog.setAttribute('open', '');
  dialog.close = () => {
    dialog.removeAttribute('open');
    dialog.dispatchEvent(new Event('close'));
  };
  const editor = {
    state: EditorState.create({ doc: 'Before text after', selection: { anchor: 4, head: 9 } }),
    dispatch: vi.fn<[ReturnType<typeof commandEdit>], void>(),
    focus: vi.fn(),
    coordsAtPos: () => ({ left: 10, right: 12, top: 10, bottom: 20 }),
  };
  const state: SlashState = { active: false, start: 12, filtered: [] };
  const reference = await getAuthoringReference();
  const settings: CompileOptions = {};
  const openDesignSettings = vi.fn();
  const api = createCommands({
    document,
    elements: { palette: dialog, search, results, empty, close, open },
    slashMenu: menu,
    state,
    getEditor: () => editor,
    authoringReference: reference,
    getDesignOptions: () => settings,
    lucideIcon: () => '<svg></svg>',
    openDesignSettings,
  });
  return {
    api,
    state,
    editor,
    dialog,
    search,
    results,
    empty,
    menu,
    reference,
    settings,
    openDesignSettings,
  };
}
it('retains a slash search through no results so a typo can be corrected', async () => {
  const h = await harness();
  h.api.showSlashMenu('serifzz');
  expect(h.menu.querySelector('[role="status"]')?.textContent).toContain('No matching commands');
  expect(h.menu.querySelectorAll('[data-index]')).toHaveLength(0);
  expect(h.state.start).toBe(12);
  expect(h.state.active).toBe(true);
  h.api.showSlashMenu('serif');
  expect(h.menu.querySelector('[role="status"]')).toBeNull();
  expect(h.menu.querySelector('.slash-menu-title')?.textContent).toBe('Serif text');
});
it('shared content examples compile to meaningful component content', async () => {
  const reference = await getAuthoringReference();
  for (const component of reference.components.filter((item) => item.example)) {
    const result = await compile(component.example!, { inlineStyles: true });
    expect(result.metadata.warnings, component.name).toEqual([]);
    const dom = new JSDOM(result.html);
    try {
      const content = dom.window.document.querySelector(
        component.name === 'footnotes'
          ? 'section[data-footnotes]'
          : `[data-component="${component.name}"]`
      );
      expect(content, component.name).not.toBeNull();
      if (component.name === 'avatar') expect(content?.textContent?.trim()).toBe('AM');
      else if (component.name === 'skeleton')
        expect(content!.classList.contains('h-32')).toBe(true);
      else if (['breadcrumb', 'pagination', 'sidebar'].includes(component.name))
        expect(content!.querySelector('a[href]')).not.toBeNull();
      else if (component.name === 'progress') {
        expect(content?.tagName).toBe('PROGRESS');
        expect(content?.getAttribute('value')).toBe('35');
        expect(dom.window.document.getElementById(content!.getAttribute('aria-labelledby')!)?.textContent).toContain('Preparing the report');
      }
      else expect(content?.textContent?.trim().length, component.name).toBeGreaterThan(25);
    } finally {
      dom.window.close();
    }
  }
});

it.each(['BeforeAfter', 'Before\nAfter', 'Before\n\nAfter'])(
  'separates inserted blocks from surrounding prose: %j',
  async (text) => {
    const from = text.indexOf('After');
    const command = { insert: ':::card\nContent\n:::', cursorOffset: -4 };
    const edit = commandEdit(command, from, from, {
      sliceString: (start: number, end?: number) => text.slice(start, end),
    });
    const resultText = text.slice(0, from) + edit.changes.insert + text.slice(from);
    expect(resultText).toBe('Before\n\n:::card\nContent\n:::\n\nAfter');
    expect(resultText.slice(edit.selection.anchor, edit.selection.anchor + 4)).toBe('\n:::');
    const result = await compile(resultText, { inlineStyles: true });
    const dom = new JSDOM(result.html);
    expect(dom.window.document.querySelector('.component-card')?.textContent).toBe('Content');
    expect([...dom.window.document.querySelectorAll('body > p')].map((n) => n.textContent)).toEqual(
      ['Before', 'After']
    );
    dom.window.close();
  }
);

it('leaves inline insertion inline and avoids blank padding at document edges', () => {
  const doc = { sliceString: (start: number, end?: number) => 'ab'.slice(start, end) };
  expect(commandEdit({ insert: '**', cursorOffset: -1 }, 1, 1, doc).changes.insert).toBe('**');
  expect(commandEdit({ insert: ':::card\n\n:::' }, 0, 2, doc).changes.insert).toBe(
    ':::card\n\n:::'
  );
});

it('wraps palette selections but does not retain slash search text', () => {
  const doc = {
    sliceString: (start: number, end?: number) => 'before words after'.slice(start, end),
  };
  const command = { insert: '****', cursorOffset: -2, wrapSelection: true };
  expect(commandEdit(command, 7, 12, doc, true).changes.insert).toBe('**words**');
  expect(commandEdit(command, 7, 12, doc).changes.insert).toBe('****');
  expect(commandEdit(findCurated('Link'), 7, 12, doc, true).changes.insert).toBe('[words](url)');
  expect(commandEdit(findCurated('Image'), 7, 12, doc, true).changes.insert).toBe('![words](url)');
});
it('searches registry commands, preserves the selection, and inserts only on acceptance', async () => {
  const h = await harness();
  const { api, editor, dialog, search } = h;
  api.openCommandPalette();
  expect(editor.dispatch).not.toHaveBeenCalled();
  const titles = [...h.results.querySelectorAll('.slash-menu-title')].map((n) =>
    n.textContent?.toLowerCase()
  );
  for (const component of h.reference.components)
    expect(titles).toContain(component.name.replace(/-/g, ' '));
  search.value = '  SERIF TEXT  ';
  search.dispatchEvent(new Event('input'));
  expect(h.results.querySelector('[aria-selected="true"] .slash-menu-title')?.textContent).toBe(
    'Serif text'
  );
  search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  expect(editor.dispatch.mock.calls[0]?.[0].changes.insert).toContain('{serif}');
  editor.dispatch.mockClear();
  api.openCommandPalette();
  search.value = 'no-such-command-xyz';
  search.dispatchEvent(new Event('input'));
  expect(h.empty.hidden).toBe(false);
  search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  expect(editor.dispatch).not.toHaveBeenCalled();
  search.value = 'responsive two-column cards';
  search.dispatchEvent(new Event('input'));
  search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  expect(editor.dispatch.mock.calls[0]?.[0].changes).toMatchObject({ from: 4, to: 9 });
  expect(editor.dispatch.mock.calls[0]?.[0].changes.insert).toContain(':::grid {cols-2 loose}');
  expect(editor.focus).toHaveBeenCalled();
  expect(dialog.open).toBe(false);
  api.openCommandPalette();
  search.value = 'cancel this';
  search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  expect(dialog.open).toBe(false);
  expect(editor.dispatch).toHaveBeenCalledTimes(1);
});

it('refreshes custom component commands when design settings change', async () => {
  const h = await harness();
  expect(h.api.searchCommands('feature-box')).toHaveLength(0);
  h.settings.components = {
    'feature-box': { name: 'feature-box', defaultClasses: ['p-4'], htmlElement: 'section' },
  };
  const command = h.api.searchCommands('feature box')[0];
  expect(command?.insert).toBe(':::feature-box\nYour content\n:::');
  expect(command?.customComponent).toBe('feature-box');
  h.settings.components = {};
  expect(h.api.searchCommands('feature box')).toHaveLength(0);
});
it('navigates slash results and replaces the search at its original position', async () => {
  const h = await harness();
  h.editor.state = EditorState.create({ doc: 'Before\n\n/heading', selection: { anchor: 16 } });
  h.state.start = 8;
  h.api.showSlashMenu('heading');
  h.api.navigateSlashMenu('up');
  expect(h.menu.querySelector('.selected .slash-menu-title')?.textContent).toBe('Heading 3');
  h.api.navigateSlashMenu('down');
  expect(h.menu.querySelector('.selected .slash-menu-title')?.textContent).toBe('Heading 1');
  h.api.executeSelectedCommand();
  expect(h.editor.dispatch.mock.calls[0]?.[0]).toEqual({
    changes: { from: 8, to: 16, insert: '# ' },
    selection: { anchor: 10 },
  });
  expect(h.state.active).toBe(false);
  expect(h.state.start).toBeNull();
  expect(h.state.filtered).toEqual([]);
});
it('moves palette selection with arrows and runs settings after closing', async () => {
  const h = await harness();
  h.api.openCommandPalette();
  h.search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
  expect(h.results.lastElementChild?.getAttribute('aria-selected')).toBe('true');
  h.search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  expect(h.results.firstElementChild?.getAttribute('aria-selected')).toBe('true');
  h.openDesignSettings.mockImplementation(() => expect(h.dialog.open).toBe(false));
  h.search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  expect(h.openDesignSettings).toHaveBeenCalledOnce();
  expect(h.editor.dispatch).not.toHaveBeenCalled();
});

it('renders custom slash descriptions as literal text while preserving icon SVG', async () => {
  const h = await harness();
  const description = '<img src=x onerror="alert(1)"><strong>Custom</strong>';
  const component = { name: 'feature-box', defaultClasses: ['p-4'], description };
  h.settings.components = { 'feature-box': component };
  h.api.showSlashMenu('feature box');
  expect(h.menu.querySelector('.slash-menu-desc')?.textContent).toBe(description);
  expect(h.menu.querySelector('img')).toBeNull();
  expect(h.menu.querySelector('strong')).toBeNull();
  expect(h.menu.querySelector('.slash-menu-icon svg')).not.toBeNull();
});
