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
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/editor-share' && event.request.method === 'POST') {
    event.respondWith(receiveShare(event.request));
    return;
  }
  if (event.request.method !== 'GET') return;
  const editor = event.request.mode === 'navigate' && /^\/editor(?:\.html)?\/?$/.test(url.pathname);
  const path = url.pathname === '/offline-editor.html' ? '/offline-editor' : url.pathname;
  if (!editor && !paths.has(path)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(editor ? '/editor' : path);
    return cached || fetch(event.request);
  })());
});

// Shared source stays in browser storage; it is never forwarded to a server.
async function receiveShare(request) {
  try {
    const data = await request.formData();
    const files = data.getAll('files').filter(value => typeof value !== 'string');
    const text = [data.get('title'), data.get('text'), data.get('url')].filter(value => typeof value === 'string' && value.trim()).join('\n\n');
    const size = files.reduce((total, file) => total + file.size, new Blob([text]).size);
    if (files.length > 10 || size > 8 * 1024 * 1024) throw new Error('size');
    if (files.some(file => !/\.(td|tdown|taildown|md|txt)$/i.test(file.name))) throw new Error('format');
    const documents = await Promise.all(files.map(async file => ({name: file.name, content: await file.text()})));
    if (text) documents.push({name: 'shared-note.td', content: text});
    if (!documents.length) throw new Error('empty');
    const cache = await caches.open('taildown-incoming-shares');
    if ((await cache.keys()).length >= 10) throw new Error('full');
    const id = crypto.randomUUID();
    await cache.put('/editor-share/' + id, new Response(JSON.stringify({documents}), {headers: {'Content-Type': 'application/json'}}));
    return Response.redirect(new URL('/editor?share=' + id, self.location.origin).href, 303);
  } catch (error) {
    const code = ['size', 'format', 'empty', 'full'].includes(error.message) ? error.message : 'storage';
    return Response.redirect(new URL('/editor?share-error=' + code, self.location.origin).href, 303);
  }
}
