import {compile} from './index';
import {getAuthoringReference} from './authoring-reference';
import {getAllLucideIconNames, getLucideIconElements} from './icons/lucide-icons';

export {compile, getAuthoringReference};
export function getIconData() {
  return Object.fromEntries(getAllLucideIconNames().map(name => [name, getLucideIconElements(name)]));
}
export function setAssetBase(base: string) {
  (globalThis as typeof globalThis & {__taildownAssetBase?: string}).__taildownAssetBase = base;
}

// The same module can be imported on the main thread when workers are unavailable.
if (typeof document === 'undefined') {
  self.addEventListener('message', async event => {
    const {id, source, options, assetBase, operation = 'compile'} = event.data;
    try {
      setAssetBase(assetBase);
      const result = operation === 'getIconData' ? getIconData()
        : operation === 'getAuthoringReference' ? await getAuthoringReference(options)
        : await compile(source, options);
      self.postMessage({id, result});
    } catch (error) {
      self.postMessage({id, error: error instanceof Error ? error.message : String(error)});
    }
  });
  self.postMessage({ready: true});
}
