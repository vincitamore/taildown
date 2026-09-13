/** One reusable compiler payload, executed in a worker or imported as a fallback. */
export function createCompilerClient(compilerSource, assetBase, environment = globalThis) {
  const pending = new Map();
  let sequence = 0;
  let worker;
  let fallback;
  let failed = false;
  const url = environment.URL.createObjectURL(new environment.Blob([compilerSource], {type: 'text/javascript'}));
  const ready = new Promise(resolve => {
    let timer;
    const fail = () => {
      failed = true;
      clearTimeout(timer);
      worker?.terminate();
      environment.URL.revokeObjectURL?.(url);
      for (const request of pending.values()) request.reject(new Error('Background compilation was interrupted. Please retry.'));
      pending.clear();
      resolve(false);
    };
    try {
      worker = new environment.Worker(url);
      worker.onerror = fail;
      worker.onmessageerror = fail;
      worker.onmessage = ({data}) => {
        if (data.ready) { clearTimeout(timer); environment.URL.revokeObjectURL?.(url); resolve(true); return; }
        const request = pending.get(data.id);
        if (!request) return;
        pending.delete(data.id);
        if (data.error !== undefined) request.reject(new Error(data.error));
        else request.resolve(data.result);
      };
      timer = setTimeout(fail, 15000);
    } catch { fail(); }
  });
  async function request(operation, source, options = {}) {
    // Capture caller options before worker startup or another asynchronous operation.
    const snapshot = structuredClone(options);
    const available = await ready;
    if (!available || failed) {
      if (!fallback) {
        const moduleURL = environment.URL.createObjectURL(new environment.Blob([
          compilerSource, '\nexport const compile = TaildownCompiler.compile; export const getIconData = TaildownCompiler.getIconData; export const getAuthoringReference = TaildownCompiler.getAuthoringReference; export const setAssetBase = TaildownCompiler.setAssetBase;',
        ], {type: 'text/javascript'}));
        fallback = (environment.importCompiler ? environment.importCompiler(moduleURL) : import(/* @vite-ignore */ moduleURL))
          .then(module => {module.setAssetBase(assetBase); return module;})
          .finally(() => environment.URL.revokeObjectURL?.(moduleURL));
      }
      const module = await fallback;
      return operation === 'getAuthoringReference' ? module.getAuthoringReference(snapshot) : module[operation](source, snapshot);
    }
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, {resolve, reject});
      try { worker.postMessage({id, operation, source, options: snapshot, assetBase}); }
      catch (error) { pending.delete(id); reject(error); }
    });
  }
  const compile = (source, options = {}) => request('compile', source, options);
  compile.getIconData = () => request('getIconData');
  compile.getAuthoringReference = options => request('getAuthoringReference', undefined, options);
  return compile;
}
