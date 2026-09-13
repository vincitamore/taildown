/** The build replaces this marker with content-addressed, same-origin app assets. */
const APP = __TAILDOWN_PWA__;
const CACHE = 'taildown-editor-' + APP.version;
const paths = new Set(APP.assets);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP.assets)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Natural activation with no open clients is the safe point to retire old shells.
    if (!(await self.clients.matchAll({type: 'window', includeUncontrolled: true})).length) {
      await Promise.all((await caches.keys()).filter(key => key.startsWith('taildown-editor-') && key !== CACHE).map(key => caches.delete(key)));
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type !== 'ACTIVATE_UPDATE') return;
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
    const editors = clients.filter(client => /^\/editor(?:\.html)?\/?$/.test(new URL(client.url).pathname));
    if (editors.some(client => client.id !== event.source?.id)) {
      event.source?.postMessage({type: 'UPDATE_BLOCKED'});
      return;
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET') return;
  const editor = event.request.mode === 'navigate' && /^\/editor(?:\.html)?\/?$/.test(url.pathname);
  const path = url.pathname === '/offline-editor.html' ? '/offline-editor' : url.pathname;
  if (!editor && !paths.has(path)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(editor ? '/editor' : path);
    return cached || fetch(event.request);
  })());
});
