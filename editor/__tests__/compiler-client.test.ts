import {expect, it, vi} from 'vitest';
import {createCompilerClient} from '../compiler-client.js';

function setup() {
  const instances: FakeWorker[] = [];
  class FakeWorker {
    onmessage: any;
    onerror: any;
    onmessageerror: any;
    sent: any[] = [];
    terminate = vi.fn();
    constructor() { instances.push(this); queueMicrotask(() => this.onmessage({data:{ready:true}})); }
    postMessage(message: any) { this.sent.push(message); }
    reply(data: any) { this.onmessage({data}); }
  }
  const fallback = {setAssetBase:vi.fn(),compile:vi.fn(async (source: string) => source)};
  const environment = {Worker:FakeWorker,Blob,URL:{createObjectURL:()=> 'blob:compiler'},importCompiler:vi.fn(async()=>fallback)};
  const compile = createCompilerClient('source','https://example.test/',environment);
  return {compile,environment,fallback,worker:instances[0]!};
}

it('matches overlapping replies by id and snapshots options before startup', async () => {
  const {compile,worker}=setup();
  const options={theme:{colors:{primary:'#123456'}}};
  const first=compile('first',options),second=compile('second');
  options.theme.colors.primary='#abcdef';
  await Promise.resolve();await Promise.resolve();
  expect(worker.sent[0].options.theme.colors.primary).toBe('#123456');
  worker.reply({id:worker.sent[1].id,result:'second result'});
  worker.reply({id:worker.sent[0].id,result:'first result'});
  expect(await first).toBe('first result');expect(await second).toBe('second result');
});

it('preserves compiler errors without switching execution modes', async () => {
  const {compile,worker,environment}=setup();const pending=compile('invalid');
  await Promise.resolve();await Promise.resolve();
  worker.reply({id:worker.sent[0].id,error:'Invalid theme: colors'});
  await expect(pending).rejects.toThrow('Invalid theme: colors');
  expect(environment.importCompiler).not.toHaveBeenCalled();
});

it('rejects interrupted requests and uses the shared module for later requests', async () => {
  const {compile,worker,environment,fallback}=setup();const pending=compile('old');
  await Promise.resolve();await Promise.resolve();worker.onerror();
  await expect(pending).rejects.toThrow('interrupted');
  expect(await compile('new')).toBe('new');expect(worker.terminate).toHaveBeenCalled();
  expect(environment.importCompiler).toHaveBeenCalledTimes(1);
  expect(fallback.setAssetBase).toHaveBeenCalledWith('https://example.test/');
});

it('falls back when worker construction is unavailable', async () => {
  const module={setAssetBase:vi.fn(),compile:vi.fn(async()=> 'fallback')};
  const blobs: Blob[]=[];
  const compile=createCompilerClient('compiler payload','file:///editor.html',{Worker:class {constructor(){throw new Error('blocked');}},Blob,URL:{createObjectURL:(blob:Blob)=>{blobs.push(blob);return 'blob:compiler';}},importCompiler:async()=>module});
  expect(await compile('document')).toBe('fallback');
  expect(await blobs[1]!.text()).toContain('compiler payload');
  expect(await blobs[1]!.text()).not.toContain('document');
});
