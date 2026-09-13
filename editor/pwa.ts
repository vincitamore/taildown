/** Hosted installation is separate from the portable file editor. */
export function initializePwa({
  saveDraft,
  canReload,
}: {
  saveDraft: () => boolean;
  canReload: () => boolean;
}): void {
  if (
    !/^https?:$/.test(location.protocol) ||
    !document.querySelector('link[rel="manifest"]') ||
    !('serviceWorker' in navigator)
  )
    return;
  const install = document.getElementById('install-app') as HTMLButtonElement;
  const update = document.getElementById('update-app') as HTMLButtonElement;
  const status = document.getElementById('app-status')!;
  let installEvent: (Event & { prompt(): Promise<void> }) | null = null;
  let requestedUpdate = false;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installEvent = event as typeof installEvent;
    install.hidden = false;
  });
  window.addEventListener('appinstalled', () => {
    install.hidden = true;
    status.textContent = 'Taildown installed';
  });
  install.addEventListener('click', () => {
    if (!installEvent) return;
    void installEvent
      .prompt()
      .then(() => {
        installEvent = null;
        install.hidden = true;
      })
      .catch(() => {
        status.textContent = 'Use your browser menu to install Taildown.';
      });
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!requestedUpdate) return;
    requestedUpdate = false;
    update.hidden = true;
    // Activation is asynchronous; edits or a dialog may have arrived since the click.
    if (canReload() && saveDraft()) {
      location.reload();
    } else {
      status.textContent = 'Update ready. Save your work and reload when you are ready.';
    }
  });
  navigator.serviceWorker.addEventListener('message', (event) => {
    const data: unknown = event.data;
    if (data && typeof data === 'object' && 'type' in data && data.type === 'UPDATE_BLOCKED') {
      requestedUpdate = false;
      update.disabled = false;
      status.textContent = 'Close other Taildown editor windows, then update.';
    }
  });
  void navigator.serviceWorker
    .register('/editor-sw.js', { scope: '/', updateViaCache: 'none' })
    .then((registration) => {
      function showUpdate() {
        update.hidden = !registration.waiting;
      }
      showUpdate();
      registration.addEventListener('updatefound', () => {
        registration.installing?.addEventListener('statechange', () => {
          showUpdate();
        });
      });
      void navigator.serviceWorker.ready.then(() => {
        status.textContent = 'Editor ready offline';
      });
      update.addEventListener('click', () => {
        if (!registration.waiting) return;
        if (!canReload()) {
          status.textContent = 'Close open dialogs before updating.';
          return;
        }
        if (!saveDraft()) {
          status.textContent =
            'Download your source before updating; draft storage is unavailable.';
          return;
        }
        requestedUpdate = true;
        update.disabled = true;
        registration.waiting.postMessage({ type: 'ACTIVATE_UPDATE' });
      });
    })
    .catch(() => {
      status.textContent =
        'Offline setup unavailable. You can download the offline editor from File.';
    });
}
