// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { afterEach, expect, it, vi } from 'vitest';
import { initializeIncoming } from '../incoming';
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
async function setup() {
  document.body.innerHTML = new DOMParser().parseFromString(
    readFileSync('editor/index.html', 'utf8'),
    'text/html'
  ).body.innerHTML;
  vi.stubGlobal('location', { protocol: 'https:', search: '', pathname: '/editor', hash: '' });
  vi.stubGlobal('caches', { open: () => Promise.resolve({ keys: () => Promise.resolve([]) }) });
  const dialog = document.getElementById('incoming-dialog') as HTMLDialogElement;
  dialog.showModal = () => {
    dialog.open = true;
  };
  dialog.close = () => {
    dialog.open = false;
  };
  type Consumer = (params: { files: { getFile(): Promise<unknown> }[] }) => void;
  const setConsumer = vi.fn<[Consumer], void>();
  vi.stubGlobal('launchQueue', { setConsumer });
  const getCurrent = vi.fn(() => ({ name: 'my-draft.td', content: 'Current text' }));
  const download = vi.fn(),
    openDocument = vi.fn();
  initializeIncoming({ getCurrent, download, openDocument });
  const consumer = setConsumer.mock.calls[0]![0] as (params: {
    files: { getFile(): Promise<unknown> }[];
  }) => void;
  consumer({
    files: [
      {
        getFile: () =>
          Promise.resolve({
            name: 'incoming.td',
            size: 20,
            text: () => Promise.resolve('# Incoming'),
          }),
      },
    ],
  });
  await vi.waitFor(() => expect(dialog.open).toBe(true));
  return { dialog, getCurrent, download, openDocument };
}
it('queues OS file launches without changing the current draft', async () => {
  const { dialog, download, openDocument } = await setup();
  document.getElementById('incoming-cancel')!.click();
  expect(dialog.open).toBe(false);
  expect(download).not.toHaveBeenCalled();
  expect(openDocument).not.toHaveBeenCalled();
  document.getElementById('incoming-open')!.click();
  expect(dialog.open).toBe(true);
});
it('backs up the latest source before importing the selected incoming document', async () => {
  const { getCurrent, download, openDocument } = await setup();
  getCurrent.mockReturnValue({ name: 'edited.td', content: 'Latest text' });
  document.getElementById('incoming-accept')!.click();
  expect(download).toHaveBeenCalledWith('Latest text', 'edited.td');
  expect(openDocument).toHaveBeenCalledWith('# Incoming', 'incoming.td');
  expect(download.mock.invocationCallOrder[0]).toBeLessThan(
    openDocument.mock.invocationCallOrder[0]!
  );
});
it('discarding a shared copy leaves the current source alone', async () => {
  const { dialog, openDocument, download } = await setup();
  document.getElementById('incoming-discard')!.click();
  expect(dialog.open).toBe(false);
  expect(openDocument).not.toHaveBeenCalled();
  expect(download).not.toHaveBeenCalled();
});
