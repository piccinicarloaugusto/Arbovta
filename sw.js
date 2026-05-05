/* ArboVTA Service Worker v75 — NO CACHE per index.html */
const CACHE = 'arbovta-v75';

self.addEventListener('install', e => {
  /* NON precachiamo index.html — sempre dalla rete */
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(['/Arbovta/manifest.json']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  /* index.html — SEMPRE dalla rete, mai dalla cache */
  if (e.request.mode === 'navigate' ||
      url.pathname === '/Arbovta/' ||
      url.pathname === '/Arbovta/index.html') {
    e.respondWith(fetch(e.request));
    return;
  }
  
  /* Tutto il resto — rete first, cache come fallback offline */
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
