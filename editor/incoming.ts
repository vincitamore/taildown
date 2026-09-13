interface IncomingDocument {
  name: string;
  content: string;
}
interface PendingDocument extends IncomingDocument {
  key?: string;
  index?: number;
}
interface LaunchWindow extends Window {
  launchQueue?: {
    setConsumer(consumer: (params: { files: { getFile(): Promise<File> }[] }) => void): void;
  };
}
/** Incoming OS content is reviewed before replacing source; cancellation keeps it queued. */
export function initializeIncoming({
  getCurrent,
  download,
  openDocument,
}: {
  getCurrent(): IncomingDocument;
  download(content: string, name: string): void;
  openDocument(content: string, name: string): void;
}): void {
  if (!/^https?:$/.test(location.protocol)) return;
  const share = document.getElementById('share-source') as HTMLButtonElement;
  const shareSupported =
    typeof navigator.canShare === 'function' && typeof navigator.share === 'function';
  share.hidden =
    !shareSupported ||
    !navigator.canShare({ files: [new File([''], 'document.td', { type: 'text/plain' })] });
  share.addEventListener('click', () => {
    const current = getCurrent();
    const file = new File([current.content], current.name, { type: 'text/plain' });
    void navigator.share({ files: [file], title: current.name }).catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        document.getElementById('app-status')!.textContent =
          'Sharing is unavailable. Use File → Download source instead.';
    });
  });
  const dialog = document.getElementById('incoming-dialog') as HTMLDialogElement;
  const trigger = document.getElementById('incoming-open') as HTMLButtonElement;
  const choices = document.getElementById('incoming-choice') as HTMLSelectElement;
  const preview = document.getElementById('incoming-preview')!;
  const accept = document.getElementById('incoming-accept') as HTMLButtonElement;
  const status = document.getElementById('incoming-status')!;
  let pending: PendingDocument[] = [];
  const display = () => {
    trigger.hidden = pending.length === 0;
    choices.replaceChildren(
      ...pending.map((item, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = item.name;
        return option;
      })
    );
    preview.textContent = pending[0]?.content.slice(0, 4000) ?? '';
    accept.disabled = pending.length === 0;
  };
  const open = () => {
    display();
    if (!dialog.open) dialog.showModal();
  };
  trigger.addEventListener('click', open);
  choices.addEventListener('change', () => {
    preview.textContent = pending[Number(choices.value)]?.content.slice(0, 4000) ?? '';
  });
  document.getElementById('incoming-cancel')!.addEventListener('click', () => dialog.close());
  function remove(item: PendingDocument) {
    pending = pending.filter((entry) => entry !== item);
    display();
    if (!pending.length) dialog.close();
    if (item.key) {
      void caches
        .open('taildown-incoming-shares')
        .then(async (cache) => {
          const remaining = pending
            .filter((entry) => entry.key === item.key)
            .map(({ name, content }) => ({ name, content }));
          if (remaining.length)
            await cache.put(
              item.key!,
              new Response(JSON.stringify({ documents: remaining }), {
                headers: { 'Content-Type': 'application/json' },
              })
            );
          else await cache.delete(item.key!);
        })
        .catch(() => {
          document.getElementById('app-status')!.textContent =
            'The shared copy could not be removed from browser storage.';
        });
    }
  }
  document.getElementById('incoming-discard')!.addEventListener('click', () => {
    const item = pending[Number(choices.value)];
    if (item) remove(item);
  });
  accept.addEventListener('click', () => {
    const item = pending[Number(choices.value)];
    if (!item) return;
    try {
      const current = getCurrent();
      if (current.content.trim()) download(current.content, current.name);
      openDocument(item.content, item.name);
      dialog.close();
      remove(item);
    } catch {
      status.textContent =
        'The document could not be opened. Save the current source and try again.';
    }
  });
  async function restoreShared() {
    try {
      const cache = await caches.open('taildown-incoming-shares');
      for (const key of await cache.keys()) {
        const response = await cache.match(key);
        const data: unknown = await response?.json();
        if (
          !data ||
          typeof data !== 'object' ||
          !('documents' in data) ||
          !Array.isArray(data.documents)
        )
          continue;
        for (const item of data.documents as unknown[]) {
          if (
            item &&
            typeof item === 'object' &&
            'name' in item &&
            typeof item.name === 'string' &&
            'content' in item &&
            typeof item.content === 'string'
          )
            pending.push({ name: item.name, content: item.content, key: key.url });
        }
      }
      display();
      const params = new URLSearchParams(location.search);
      if (params.has('share') && pending.length) open();
      if (params.has('share-error')) {
        const messages: Record<string, string> = {
          size: 'Share up to 10 source files, totaling at most 8 MB.',
          format: 'Share Taildown, Markdown or plain-text source files.',
          empty: 'The shared item contained no text or source files.',
          full: 'Open pending shared files before sharing more.',
        };
        document.getElementById('app-status')!.textContent =
          messages[params.get('share-error')!] ??
          'The shared item could not be stored. Use File → Open instead.';
      }
      if (params.has('share') || params.has('share-error')) {
        params.delete('share');
        params.delete('share-error');
        history.replaceState(
          null,
          '',
          location.pathname + (params.size ? '?' + params.toString() : '') + location.hash
        );
      }
    } catch {
      document.getElementById('app-status')!.textContent =
        'Shared-file storage is unavailable. Use File → Open instead.';
    }
  }
  void restoreShared();
  (window as LaunchWindow).launchQueue?.setConsumer((params) => {
    void (async () => {
      for (const handle of params.files) {
        const file = await handle.getFile();
        if (file.size > 8 * 1024 * 1024 || !/\.(td|tdown|taildown|md|txt)$/i.test(file.name))
          throw new Error('Use a source file smaller than 8 MB.');
        pending.push({ name: file.name, content: await file.text() });
      }
      if (params.files.length) open();
    })().catch(() => {
      document.getElementById('app-status')!.textContent =
        'The file could not be opened. Use File → Open to choose it again.';
    });
  });
}
