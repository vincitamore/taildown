import { expect, it, vi } from 'vitest';
import { createCompilerClient } from '../compiler-client.js';

interface WorkerRequest {
  id: number;
  operation: string;
  options: unknown;
  source: unknown;
}
function parseRequest(message: unknown): WorkerRequest {
  if (
    typeof message !== 'object' ||
    message === null ||
    !('id' in message) ||
    typeof message.id !== 'number' ||
    !('operation' in message) ||
    typeof message.operation !== 'string' ||
    !('options' in message) ||
    !('source' in message)
  )
    throw new Error('Invalid worker request');
  return {
    id: message.id,
    operation: message.operation,
    options: message.options,
    source: message.source,
  };
}
function requireRequest(request: WorkerRequest | undefined): WorkerRequest {
  if (!request) throw new Error('Missing worker request');
  return request;
}
function setup() {
  const instances: FakeWorker[] = [];
  class FakeWorker {
    onmessage: ((event: Pick<MessageEvent<unknown>, 'data'>) => void) | null = null;
    onerror: (() => void) | null = null;
    onmessageerror: (() => void) | null = null;
    sent: WorkerRequest[] = [];
    terminate = vi.fn();
    constructor() {
      instances.push(this);
      queueMicrotask(() => this.onmessage?.({ data: { ready: true } }));
    }
    postMessage(message: unknown) {
      this.sent.push(parseRequest(message));
    }
    reply(data: unknown) {
      this.onmessage?.({ data });
    }
  }
  const fallback = {
    setAssetBase: vi.fn(),
    compile: vi.fn((source: string) => Promise.resolve(source)),
    getIconData: vi.fn(() => ({ wave: [] })),
  };
  const environment = {
    Worker: FakeWorker,
    Blob,
    URL: { createObjectURL: () => 'blob:compiler', revokeObjectURL: vi.fn() },
    importCompiler: vi.fn(() => Promise.resolve(fallback)),
  };
  const compile = createCompilerClient('source', 'https://example.test/', environment);
  return { compile, environment, fallback, worker: instances[0]! };
}

it('matches overlapping replies by id and snapshots options before startup', async () => {
  const { compile, worker } = setup();
  const options = { theme: { colors: { primary: '#123456' } } };
  const first = compile('first', options),
    second = compile('second');
  options.theme.colors.primary = '#abcdef';
  await Promise.resolve();
  await Promise.resolve();
  expect(requireRequest(worker.sent[0]).options).toMatchObject({
    theme: { colors: { primary: '#123456' } },
  });
  worker.reply({ id: requireRequest(worker.sent[1]).id, result: 'second result' });
  worker.reply({ id: requireRequest(worker.sent[0]).id, result: 'first result' });
  expect(await first).toBe('first result');
  expect(await second).toBe('second result');
});

it('preserves compiler errors without switching execution modes', async () => {
  const { compile, worker, environment } = setup();
  const pending = compile('invalid');
  await Promise.resolve();
  await Promise.resolve();
  worker.reply({ id: requireRequest(worker.sent[0]).id, error: 'Invalid theme: colors' });
  await expect(pending).rejects.toThrow('Invalid theme: colors');
  expect(environment.importCompiler).not.toHaveBeenCalled();
});

it('requests icon data separately from overlapping compilation', async () => {
  const { compile, worker } = setup();
  const icons = compile.getIconData(),
    document = compile('document');
  await Promise.resolve();
  await Promise.resolve();
  const iconRequest = worker.sent.find((request) => request.operation === 'getIconData');
  const documentRequest = worker.sent.find((request) => request.operation === 'compile');
  worker.reply({ id: requireRequest(documentRequest).id, result: 'compiled' });
  worker.reply({ id: requireRequest(iconRequest).id, result: { wave: [['path', { d: 'M0 0' }]] } });
  expect(await document).toBe('compiled');
  expect(await icons).toEqual({ wave: [['path', { d: 'M0 0' }]] });
});

it('loads icons from the same fallback module after worker failure', async () => {
  const { compile, worker, environment, fallback } = setup();
  worker.onerror?.();
  expect(await compile.getIconData()).toEqual({ wave: [] });
  expect(await compile('document')).toBe('document');
  expect(fallback.getIconData).toHaveBeenCalledTimes(1);
  expect(environment.importCompiler).toHaveBeenCalledTimes(1);
});

it('rejects interrupted requests and uses the shared module for later requests', async () => {
  const { compile, worker, environment, fallback } = setup();
  const pending = compile('old');
  await Promise.resolve();
  await Promise.resolve();
  worker.onerror?.();
  await expect(pending).rejects.toThrow('interrupted');
  expect(await compile('new')).toBe('new');
  expect(worker.terminate).toHaveBeenCalled();
  expect(environment.importCompiler).toHaveBeenCalledTimes(1);
  expect(fallback.setAssetBase).toHaveBeenCalledWith('https://example.test/');
});

it('falls back when worker construction is unavailable', async () => {
  const module = { setAssetBase: vi.fn(), compile: vi.fn(() => Promise.resolve('fallback')) };
  const blobs: Blob[] = [];
  const compile = createCompilerClient('compiler payload', 'file:///editor.html', {
    Worker: class {
      constructor() {
        throw new Error('blocked');
      }
    },
    Blob,
    URL: {
      createObjectURL: (blob: Blob) => {
        blobs.push(blob);
        return 'blob:compiler';
      },
    },
    importCompiler: () => Promise.resolve(module),
  });
  expect(await compile('document')).toBe('fallback');
  expect(await blobs[1]!.text()).toContain('compiler payload');
  expect(await blobs[1]!.text()).not.toContain('document');
});

it('rejects a failed post without breaking later requests on the worker', async () => {
  const { compile, worker, environment } = setup();
  const post = vi.spyOn(worker, 'postMessage').mockImplementationOnce(() => {
    throw new Error('Could not clone message');
  });
  await expect(compile('first')).rejects.toThrow('Could not clone message');
  const pending = compile('second');
  await Promise.resolve();
  await Promise.resolve();
  const sent = requireRequest(worker.sent[0]);
  expect(sent.source).toBe('second');
  worker.reply({ id: sent.id, result: 'second result' });
  expect(await pending).toBe('second result');
  expect(post).toHaveBeenCalledTimes(2);
  expect(environment.importCompiler).not.toHaveBeenCalled();
});
it('rejects every pending request after a message decoding failure and releases payload URLs', async () => {
  const { compile, worker, environment } = setup();
  const first = compile('first'),
    second = compile.getIconData();
  const firstError = expect(first).rejects.toThrow('interrupted'),
    secondError = expect(second).rejects.toThrow('interrupted');
  await Promise.resolve();
  await Promise.resolve();
  worker.onmessageerror?.();
  await Promise.all([firstError, secondError]);
  expect(worker.terminate).toHaveBeenCalledOnce();
  expect(await compile('fallback')).toBe('fallback');
  expect(environment.URL.revokeObjectURL).toHaveBeenCalledWith('blob:compiler');
});
it('snapshots authoring reference options separately from source compilation', async () => {
  const { compile, worker } = setup();
  const options = { theme: { colors: { primary: '#123456' } } };
  const reference = compile.getAuthoringReference(options);
  options.theme.colors.primary = '#abcdef';
  await Promise.resolve();
  await Promise.resolve();
  const sent = requireRequest(worker.sent[0]);
  expect(sent.operation).toBe('getAuthoringReference');
  expect(sent.source).toBeUndefined();
  expect(sent.options).toMatchObject({ theme: { colors: { primary: '#123456' } } });
  worker.reply({ id: sent.id, result: { components: [] } });
  expect(await reference).toEqual({ components: [] });
});
