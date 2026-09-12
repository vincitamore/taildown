import {compile} from './index';

export {compile};
export function setAssetBase(base: string) {
  (globalThis as typeof globalThis & {__taildownAssetBase?: string}).__taildownAssetBase = base;
}

// The same module can be imported on the main thread when workers are unavailable.
if (typeof document === 'undefined') {
  self.addEventListener('message', async event => {
    const {id, source, options, assetBase} = event.data;
    try {
      setAssetBase(assetBase);
      const result = await compile(source, options);
      self.postMessage({id, result});
    } catch (error) {
      self.postMessage({id, error: error instanceof Error ? error.message : String(error)});
    }
  });
  self.postMessage({ready: true});
}
