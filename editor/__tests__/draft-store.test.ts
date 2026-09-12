import {expect,it,vi} from 'vitest';
import {createDraftStore} from '../draft-store.js';

function backend(initial: Record<string,string>={}) {
  const values=new Map(Object.entries(initial));
  return {values,getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);},removeItem:(key:string)=>{values.delete(key);}};
}

it('keeps editing and theme preferences usable when access to storage throws',()=>{
  const report=vi.fn();
  const store=createDraftStore(()=>{throw new Error('Denied');},report);
  expect(store.load()).toBeNull();
  expect(store.save('content','draft.td')).toBe(false);
  expect(store.isSaved('content','draft.td')).toBe(false);
  expect(report).toHaveBeenLastCalledWith(false);
  store.saveTheme('dark');
  expect(store.readTheme()).toBe('dark');
});

it('preserves the last complete snapshot after quota failure and recovers on the next successful write',()=>{
  const storage=backend();const report=vi.fn();const store=createDraftStore(()=>storage,report);
  expect(store.save('old','old.td')).toBe(true);
  const write=storage.setItem;storage.setItem=()=>{throw new Error('Quota');};
  expect(store.save('new','new.td')).toBe(false);
  expect(store.isSaved('new','new.td')).toBe(false);
  expect(createDraftStore(()=>storage).load()).toEqual({content:'old',filename:'old.td'});
  expect(report).toHaveBeenLastCalledWith(false);
  storage.setItem=write;
  expect(store.save('new','new.td')).toBe(true);
  expect(report).toHaveBeenLastCalledWith(true);
  expect(createDraftStore(()=>storage).load()).toEqual({content:'new',filename:'new.td'});
});

it('migrates an empty legacy draft only after a successful atomic write',()=>{
  const storage=backend({'taildown-editor-content':'','taildown-editor-filename':'empty.td'});
  const store=createDraftStore(()=>storage);
  expect(store.load()).toEqual({content:'',filename:'empty.td'});
  const write=storage.setItem;storage.setItem=()=>{throw new Error('Quota');};
  expect(store.save('changed','changed.td')).toBe(false);
  expect(storage.getItem('taildown-editor-content')).toBe('');
  storage.setItem=write;
  expect(store.save('changed','changed.td')).toBe(true);
  expect(storage.getItem('taildown-editor-content')).toBeNull();
  expect(storage.getItem('taildown-editor-filename')).toBeNull();
  expect(createDraftStore(()=>storage).load()).toEqual({content:'changed',filename:'changed.td'});
});

it.each(['{broken','{"content":42,"filename":"draft.td"}'])('does not crash or overwrite malformed recovery data: %s',raw=>{
  const storage=backend({'taildown-editor-draft':raw});const report=vi.fn();
  expect(createDraftStore(()=>storage,report).load()).toBeNull();
  expect(report).toHaveBeenLastCalledWith(false);
  expect(storage.getItem('taildown-editor-draft')).toBe(raw);
});

it('does not let mutation of a loaded record change saved-state detection',()=>{
  const storage=backend();const store=createDraftStore(()=>storage);
  store.save('saved','draft.td');const copy=store.load()!;copy.content='changed';
  expect(store.isSaved('saved','draft.td')).toBe(true);
  expect(store.isSaved('changed','draft.td')).toBe(false);
});

it('does not credit a recovery copy overwritten by another tab',()=>{
  const storage=backend();
  const first=createDraftStore(()=>storage), second=createDraftStore(()=>storage);
  first.save('first draft','first.td');
  expect(first.isSaved('first draft','first.td')).toBe(true);
  second.save('second draft','second.td');
  expect(first.isSaved('first draft','first.td')).toBe(false);
});
