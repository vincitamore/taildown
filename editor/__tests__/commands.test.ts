import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {expect, it, vi} from 'vitest';
import {getAuthoringReference} from '../../packages/compiler/src/authoring-reference';

const source = readFileSync(new URL('../index.html', import.meta.url),'utf8');
const code = source.slice(source.indexOf('    const slashCommands ='),source.indexOf('    // Slash command functions'));
it('searches registry commands, preserves the selection, and inserts only on acceptance', async () => {
  const dom = new JSDOM(source);
  try {
    const {document} = dom.window;
    dom.window.HTMLElement.prototype.scrollIntoView = () => {};
    const dialog = document.querySelector('dialog')!;
    dialog.showModal = () => dialog.setAttribute('open','');
    dialog.close = () => {dialog.removeAttribute('open'); dialog.dispatchEvent(new dom.window.Event('close'));};
    const editor = {state:{selection:{main:{get from(){return 4;},get to(){return 9;}}}},dispatch:vi.fn(),focus:vi.fn()};
    const reference = await getAuthoringReference();
    const open = new Function('document','authoringReference','editor','hideSlashMenu','lucideIcon', code+';return openCommandPalette;')(document,reference,editor,()=>{},()=>'<svg></svg>');
    open();
    expect(editor.dispatch).not.toHaveBeenCalled();
    const titles = [...document.querySelectorAll('#command-results .slash-menu-title')].map(n=>n.textContent!.toLowerCase());
    for(const component of reference.components) expect(titles).toContain(component.name.replace(/-/g,' '));
    const search = document.querySelector<HTMLInputElement>('#command-search')!;
    search.value='no-such-command-xyz'; search.dispatchEvent(new dom.window.Event('input'));
    expect(document.querySelector('#command-empty')!.hasAttribute('hidden')).toBe(false);
    search.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Enter'}));
    expect(editor.dispatch).not.toHaveBeenCalled();
    search.value='responsive two-column cards'; search.dispatchEvent(new dom.window.Event('input'));
    search.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Enter'}));
    expect(editor.dispatch).toHaveBeenCalledWith(expect.objectContaining({changes:{from:4,to:9,insert:expect.stringContaining(':::grid {cols-2 loose}')}}));
    expect(editor.focus).toHaveBeenCalled();
    expect(dialog.open).toBe(false);
    open();
    search.value='cancel this';
    search.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'}));
    expect(dialog.open).toBe(false);
    expect(editor.dispatch).toHaveBeenCalledTimes(1);
  } finally {dom.window.close();}
});
