import {readFileSync} from 'node:fs';
import {expect,it,vi} from 'vitest';
const template=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=template.slice(template.indexOf('    // New document'),template.indexOf('    // Draggable divider'));
function harness(filename='draft.td', window:any={}) {
 let content='Original';
 const doc=()=>({length:content.length,toString:()=>content});
 const editor={state:{doc:doc()},dispatch:({changes}:any)=>{content=changes.insert;editor.state.doc=doc();}};
 const status={textContent:'',className:''}, display={textContent:filename};
 const elements:any[]=[], blobs:Blob[]=[];
 const document={createElement:(tag:string)=>{const element={tag,click:vi.fn()};elements.push(element);return element;}};
 const storage={save:vi.fn()};
 let finish!:(value:any)=>void;
 const compile=vi.fn(()=>new Promise(resolve=>{finish=resolve;}));
 const create=new Function('editor','window','document','statusBar','filenameDisplay','draftStore','compile','Blob','URL','confirm','initialFilename',`let currentFilename=initialFilename,currentFileHandle=null,documentVersion=0,openRequestVersion=0; const pendingFileWrites=new WeakMap(); const DEFAULT_TEMPLATE='Welcome';\n${source}\nreturn {openFile,saveFile,exportHTML,newDocument,setHandle:handle=>{currentFileHandle=handle;}};`);
 const api=create(editor,window,document,status,display,storage,compile,Blob,{createObjectURL:(blob:Blob)=>{blobs.push(blob);return 'blob:fixture';},revokeObjectURL:vi.fn()},()=>true,filename);
 return {api,editor,status,display,storage,elements,blobs,complete:()=>finish({html:'<!DOCTYPE html><p>Export</p>'}),edit:(text:string)=>editor.dispatch({changes:{insert:text}})};
}
it.each(['report.td','report.tdown','report.taildown','report.TAILDOWN','report'])('exports %s with an HTML extension and MIME type',async filename=>{
 const h=harness(filename); const pending=h.api.exportHTML();h.complete();await pending;
 expect(h.elements[0].download).toBe('report.html');expect(h.blobs[0].type).toBe('text/html;charset=utf-8');
});
it('keeps the filename belonging to the exported source while switching documents',async()=>{
 const h=harness('guide.taildown');const pending=h.api.exportHTML();h.api.newDocument();h.complete();await pending;
 expect(h.elements[0].download).toBe('guide.html');expect(h.display.textContent).toBe('untitled.td');
});
it('reports fallback file read errors without replacing the document',async()=>{
 const h=harness();await h.api.openFile();expect(h.elements[0].accept).toContain('.tdown');
 await h.elements[0].onchange({target:{files:[{name:'bad.td',text:async()=>{throw new Error('read failed');}}]}});
 expect(h.status.textContent).toContain('read failed');expect(h.editor.state.doc.toString()).toBe('Original');
});
it('does not replace edits made while an open file is being read',async()=>{
 let finish!:(value:string)=>void;const h=harness();await h.api.openFile();
 const pending=h.elements[0].onchange({target:{files:[{name:'other.td',text:()=>new Promise(resolve=>{finish=resolve;})}]}});
 h.edit('Newer edits');finish('Other file');await pending;
 expect(h.editor.state.doc.toString()).toBe('Newer edits');expect(h.status.textContent).toContain('document changed');
});
it('does not attach a save-dialog result to a new document',async()=>{
 let finish!:(value:any)=>void;const createWritable=vi.fn();const h=harness('old.td',{showSaveFilePicker:()=>new Promise(resolve=>{finish=resolve;})});
 const pending=h.api.saveFile();h.api.newDocument();finish({name:'old-saved.td',createWritable});await pending;
 expect(createWritable).not.toHaveBeenCalled();expect(h.display.textContent).toBe('untitled.td');
});
it('preserves newer edits in autosave after writing the captured file version',async()=>{
 let finish!:()=>void;const write=vi.fn();const h=harness('draft.td',{showSaveFilePicker:async()=>({name:'saved.td',createWritable:async()=>({write,close:()=>new Promise<void>(resolve=>{finish=resolve;})})})});
 const pending=h.api.saveFile();await vi.waitFor(()=>expect(write).toHaveBeenCalledWith('Original'));
 h.edit('Newer edits');finish();await pending;
 expect(h.storage.save).toHaveBeenCalledWith('Newer edits','saved.td');expect(h.status.textContent).toContain('newer edits remain');
});
it('keeps an in-progress save valid when an open dialog is cancelled',async()=>{
 let finish!:(value:any)=>void;
 const h=harness('draft.td',{
  showSaveFilePicker:()=>new Promise(resolve=>{finish=resolve;}),
  showOpenFilePicker:async()=>{throw Object.assign(new Error('cancelled'),{name:'AbortError'});}
 });
 const pending=h.api.saveFile();await h.api.openFile();
 finish({name:'saved.td',createWritable:async()=>({write:async()=>{},close:async()=>{}})});await pending;
 expect(h.display.textContent).toBe('saved.td');expect(h.status.textContent).toBe('✓ Saved saved.td');
});
it('commits repeated saves to one handle in request order',async()=>{
 let disk='';const releases:Array<()=>void>=[];
 const handle={createWritable:vi.fn(async()=>{let value='';return {
  write:async(text:string)=>{value=text;},
  close:()=>new Promise<void>(resolve=>releases.push(()=>{disk=value;resolve();}))
 };})};
 const h=harness();h.api.setHandle(handle);
 const first=h.api.saveFile();await vi.waitFor(()=>expect(releases).toHaveLength(1));
 h.edit('Newer');const second=h.api.saveFile();
 expect(handle.createWritable).toHaveBeenCalledTimes(1);
 releases[0]!();await first;await vi.waitFor(()=>expect(releases).toHaveLength(2));
 releases[1]!();await second;expect(disk).toBe('Newer');
});
