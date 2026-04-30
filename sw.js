/* ═══════════════════════════════════════════════════
   ArboVTA Service Worker v61 — Network First
═══════════════════════════════════════════════════ */
const CACHE = 'arbovta-v61';

/* INSTALL — precache risorse statiche */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([
      '/Arbovta/',
      '/Arbovta/index.html',
      '/Arbovta/manifest.json',
    ])).then(() => self.skipWaiting())
  );
});

/* ACTIVATE — elimina cache vecchie */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* FETCH — Network first per HTML, cache first per il resto */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  /* HTML — sempre dalla rete, fallback cache */
  if (e.request.mode === 'navigate' ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('/Arbovta/') ||
      url.pathname === '/Arbovta') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  /* Tutto il resto — cache first, poi rete */
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      });
    })
  );
});

/* Messaggio da app per forzare aggiornamento */
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
