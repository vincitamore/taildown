import {readFileSync} from 'node:fs';
import {expect,it,vi} from 'vitest';

const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const recovery=source.slice(source.indexOf('// Try to restore from localStorage'),source.indexOf('// Hide loading indicator'));

it.each(['', 'A saved document\n'])('restores saved content %j and its filename', content=>{
  const editor={state:{doc:{length:7,toString:()=> 'Welcome'}},dispatch:vi.fn()};
  const display={textContent:'untitled.td'};
  const updatePreview=vi.fn();
  const storage={getItem:(key:string)=>key==='taildown-editor-content'?content:'draft.td'};
  new Function('editor','filenameDisplay','updatePreview','localStorage',`let currentFilename='untitled.td';${recovery}`)(editor,display,updatePreview,storage);
  expect(editor.dispatch).toHaveBeenCalledWith({changes:{from:0,to:7,insert:content}});
  expect(display.textContent).toBe('draft.td');
  expect(updatePreview).not.toHaveBeenCalled();
});

it('uses the welcome document only when no saved draft exists',()=>{
  const editor={state:{doc:{toString:()=> 'Welcome'}},dispatch:vi.fn()};
  const updatePreview=vi.fn();
  new Function('editor','filenameDisplay','updatePreview','localStorage',`let currentFilename='untitled.td';${recovery}`)(editor,{},updatePreview,{getItem:()=>null});
  expect(editor.dispatch).not.toHaveBeenCalled();
  expect(updatePreview).toHaveBeenCalledWith('Welcome');
});

it.each([['previous content',true],['',false]])('treats deletion to empty as an unsaved edit against %j', (saved,needsWarning)=>{
  const start=source.indexOf("window.addEventListener('beforeunload'");
  const code=source.slice(start,source.indexOf('</script>',start));
  let handler!:(event:any)=>void;
  new Function('window','editor','localStorage',code)({addEventListener:(_name:string,callback:any)=>{handler=callback;}},{state:{doc:{toString:()=>''}}},{getItem:()=>saved});
  const event={preventDefault:vi.fn(),returnValue:undefined};
  handler(event);
  expect(event.preventDefault).toHaveBeenCalledTimes(needsWarning?1:0);
});
