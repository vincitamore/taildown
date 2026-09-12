import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {expect, it, vi} from 'vitest';
import {getAuthoringReference} from '../../packages/compiler/src/authoring-reference';
import {compile} from '../../packages/compiler/src/index';

const source = readFileSync(new URL('../index.html', import.meta.url),'utf8');
const code = source.slice(source.indexOf('    const slashCommands ='),source.indexOf('    // Slash command functions'));
const editCode = source.slice(source.indexOf('    function commandEdit('),source.indexOf('    function insertPaletteCommand('));
const commandEdit = new Function(editCode+';return commandEdit;')();
const curated = new Function(source.slice(source.indexOf('    const slashCommands ='),source.indexOf('    // Every registered component'))+';return slashCommands;')();

it.each(['BeforeAfter', 'Before\nAfter', 'Before\n\nAfter'])('separates inserted blocks from surrounding prose: %j', async text => {
  const from = text.indexOf('After');
  const command = {insert:':::card\nContent\n:::',cursorOffset:-4};
  const edit = commandEdit(command,from,from,{sliceString:(start:number,end?:number)=>text.slice(start,end)});
  const resultText = text.slice(0,from)+edit.changes.insert+text.slice(from);
  expect(resultText).toBe('Before\n\n:::card\nContent\n:::\n\nAfter');
  expect(resultText.slice(edit.selection.anchor,edit.selection.anchor+4)).toBe('\n:::');
  const result = await compile(resultText,{inlineStyles:true});
  const dom = new JSDOM(result.html);
  expect(dom.window.document.querySelector('.component-card')?.textContent).toBe('Content');
  expect([...dom.window.document.querySelectorAll('body > p')].map(n=>n.textContent)).toEqual(['Before','After']);
  dom.window.close();
});

it('leaves inline insertion inline and avoids blank padding at document edges', () => {
  const doc = {sliceString:(start:number,end?:number)=>'ab'.slice(start,end)};
  expect(commandEdit({insert:'**',cursorOffset:-1},1,1,doc).changes.insert).toBe('**');
  expect(commandEdit({insert:':::card\n\n:::'},0,2,doc).changes.insert).toBe(':::card\n\n:::');
});

it('wraps palette selections but does not retain slash search text', () => {
  const doc = {sliceString:(start:number,end?:number)=>'before words after'.slice(start,end)};
  const command = {insert:'****',cursorOffset:-2,wrapSelection:true};
  expect(commandEdit(command,7,12,doc,true).changes.insert).toBe('**words**');
  expect(commandEdit(command,7,12,doc).changes.insert).toBe('****');
  expect(commandEdit(curated.find((command:any)=>command.name==='Link'),7,12,doc,true).changes.insert).toBe('[words](url)');
  expect(commandEdit(curated.find((command:any)=>command.name==='Image'),7,12,doc,true).changes.insert).toBe('![words](url)');
});
it('searches registry commands, preserves the selection, and inserts only on acceptance', async () => {
  const dom = new JSDOM(source);
  try {
    const {document} = dom.window;
    dom.window.HTMLElement.prototype.scrollIntoView = () => {};
    const dialog = document.querySelector('dialog')!;
    dialog.showModal = () => dialog.setAttribute('open','');
    dialog.close = () => {dialog.removeAttribute('open'); dialog.dispatchEvent(new dom.window.Event('close'));};
    const editor = {state:{doc:{sliceString:(from:number,to?:number)=>'Before text after'.slice(from,to)},selection:{main:{get from(){return 4;},get to(){return 9;}}}},dispatch:vi.fn(),focus:vi.fn()};
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
