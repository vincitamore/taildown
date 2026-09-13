// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { initializePwa } from '../pwa';
const windows: (() => void)[] = [];
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  windows.splice(0).forEach((cleanup) => cleanup());
});
async function setup(saveDraft = vi.fn(() => true), canReload = vi.fn(() => true)) {
  vi.stubGlobal('location', { protocol: 'https:', reload: vi.fn() });
  document.head.innerHTML = '<link rel="manifest" href="/manifest.json">';
  document.body.innerHTML =
    '<button id="install-app" hidden></button><button id="update-app" hidden></button><p id="app-status"></p>';
  const registration = Object.assign(new EventTarget(), {
    waiting: { postMessage: vi.fn() },
    installing: null,
  });
  const serviceWorker = Object.assign(new EventTarget(), {
    register: vi.fn().mockResolvedValue(registration),
    ready: Promise.resolve(registration),
  });
  const original = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
  Object.defineProperty(navigator, 'serviceWorker', { value: serviceWorker, configurable: true });
  windows.push(() => {
    if (original) Object.defineProperty(navigator, 'serviceWorker', original);
    else Reflect.deleteProperty(navigator, 'serviceWorker');
  });
  initializePwa({ saveDraft, canReload });
  await vi.waitFor(() => expect(serviceWorker.register).toHaveBeenCalled());
  await vi.waitFor(() => expect(document.getElementById('update-app')?.hidden).toBe(false));
  return {
    saveDraft,
    registration,
    serviceWorker,
    update: document.getElementById('update-app') as HTMLButtonElement,
  };
}
it('refuses activation when a durable draft cannot be written', async () => {
  const { update, registration } = await setup(vi.fn(() => false));
  update.click();
  expect(registration.waiting.postMessage).not.toHaveBeenCalled();
  expect(document.getElementById('app-status')?.textContent).toContain(
    'draft storage is unavailable'
  );
});
it('keeps unapplied design edits open instead of reloading them away', async () => {
  const { update, registration, saveDraft } = await setup(
    vi.fn(() => true),
    vi.fn(() => false)
  );
  update.click();
  expect(saveDraft).not.toHaveBeenCalled();
  expect(registration.waiting.postMessage).not.toHaveBeenCalled();
});
it('persists source before activation and permits retry after another window blocks it', async () => {
  const { update, registration, serviceWorker, saveDraft } = await setup();
  update.click();
  expect(saveDraft.mock.invocationCallOrder[0]).toBeLessThan(
    registration.waiting.postMessage.mock.invocationCallOrder[0]!
  );
  expect(update.disabled).toBe(true);
  serviceWorker.dispatchEvent(new MessageEvent('message', { data: { type: 'UPDATE_BLOCKED' } }));
  expect(update.disabled).toBe(false);
  update.click();
  expect(registration.waiting.postMessage).toHaveBeenCalledTimes(2);
});
