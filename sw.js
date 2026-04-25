/* ═══════════════════════════════════════════════════
   ArboVTA Service Worker — Offline-first PWA
   v3.0 — Gestione cache + sincronizzazione dati
═══════════════════════════════════════════════════ */

const CACHE_NAME = 'arbovta-v15';
const CACHE_STATIC = 'arbovta-static-v15';
const CACHE_DATA  = 'arbovta-data-v15';

/* Risorse da precachare all'installazione */
const PRECACHE_URLS = [
  '/Arbovta/',
  '/Arbovta/index.html',
  '/Arbovta/manifest.json',
  '/Arbovta/icons/icon-192.png',
  '/Arbovta/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap'
];

/* ── INSTALL ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('[SW] Precache parziale:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_DATA)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH — Strategia per tipo di risorsa ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  /* 1. API Anthropic — sempre rete, mai cache */
  if (url.hostname === 'api.anthropic.com') {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({
          error: 'offline',
          message: 'Connessione non disponibile. Il riconoscimento AI richiede internet.'
        }), { headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }

  /* 2. Font Google — Cache then network */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_STATIC).then(c => c.put(event.request, clone));
          return response;
        }).catch(() => cached || new Response('', { status: 503 }));
      })
    );
    return;
  }

  /* 3. App shell (HTML, manifest, icone) — Cache first, fallback network */
  if (
    event.request.destination === 'document' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.json') ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_STATIC).then(c => c.put(event.request, clone));
          }
          return response;
        });
        return cached || networkFetch;
      })
    );
    return;
  }

  /* 4. Default — Network with cache fallback */
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

/* ══════════════════════════════════════════════
   GESTIONE MESSAGGI da/per la pagina principale
══════════════════════════════════════════════ */
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};

  /* Salvataggio dati offline */
  if (type === 'SAVE_TREES') {
    saveToCache('arbovta-trees', payload);
    event.ports[0]?.postMessage({ ok: true });
  }

  /* Lettura dati */
  if (type === 'LOAD_TREES') {
    loadFromCache('arbovta-trees').then(data => {
      event.ports[0]?.postMessage({ ok: true, data });
    });
  }

  /* Force update */
  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  /* Stato connessione */
  if (type === 'CHECK_ONLINE') {
    event.ports[0]?.postMessage({ online: true });
  }
});

/* ── Helpers cache dati ── */
async function saveToCache(key, data) {
  const cache = await caches.open(CACHE_DATA);
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
  await cache.put(`/sw-data/${key}`, response);
}

async function loadFromCache(key) {
  const cache = await caches.open(CACHE_DATA);
  const response = await cache.match(`/sw-data/${key}`);
  if (!response) return null;
  return response.json();
}

/* ── Background sync (quando torna la connessione) ── */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-trees') {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  const pending = await loadFromCache('pending-sync');
  if (!pending || !pending.length) return;
  console.log('[SW] Sync in background:', pending.length, 'elementi');
  /* Placeholder per sync con backend cloud futuro */
}

/* ── Push notifications (struttura per futuro) ── */
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'ArboVTA', {
      body: data.body || 'Aggiornamento disponibile',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      tag: 'arbovta-notification'
    })
  );
});
