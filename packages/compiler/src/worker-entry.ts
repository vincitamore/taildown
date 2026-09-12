import {compile} from './index';
import type {CompileOptions} from '@taildown/shared';
type WorkerRequest = {id: number; assetBase: string; options?: CompileOptions} & (
  | {operation?: 'compile'; source: string}
  | {operation: 'getIconData'; source?: undefined}
  | {operation: 'getAuthoringReference'; source?: undefined}
);
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
  const handleMessage = async (event: MessageEvent<WorkerRequest>) => {
    const request = event.data;
    const {id, options, assetBase} = request;
    try {
      setAssetBase(assetBase);
      const result = request.operation === 'getIconData' ? getIconData()
        : request.operation === 'getAuthoringReference' ? await getAuthoringReference(options)
        : await compile(request.source, options);
      self.postMessage({id, result});
    } catch (error) {
      self.postMessage({id, error: error instanceof Error ? error.message : String(error)});
    }
  }
  self.addEventListener('message', (event: MessageEvent<WorkerRequest>) => { void handleMessage(event); });
  self.postMessage({ready: true});
}
