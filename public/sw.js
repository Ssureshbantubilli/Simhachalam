// Simhachalam Temple — Service Worker v1.0
// Offline-first strategy for pilgrim use in low-connectivity areas

const CACHE_NAME = 'simhachalam-v1';
const STATIC_ASSETS = [
  '/',
  '/pradakshina',
  '/safety',
  '/temple',
  '/manifest.json',
];

const RITUAL_CACHE = 'simhachalam-rituals-v1';
const RITUAL_ASSETS = [
  '/messages/en.json',
  '/messages/te.json',
  '/messages/hi.json',
  '/messages/or.json',
];

// ─── Install: pre-cache critical assets ──────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
      caches.open(RITUAL_CACHE).then((cache) => cache.addAll(RITUAL_ASSETS)),
    ])
  );
  self.skipWaiting();
});

// ─── Activate: clean old caches ──────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== RITUAL_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch: network-first for API, cache-first for static ────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache external APIs (Google Maps, Firebase)
  if (url.hostname !== self.location.hostname) {
    event.respondWith(fetch(event.request).catch(() => new Response('Offline', { status: 503 })));
    return;
  }

  // Cache-first for ritual/i18n content (critical offline)
  if (url.pathname.startsWith('/messages/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(RITUAL_CACHE).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Network-first with cache fallback for app pages
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ─── Background Sync for offline pilgrim registration ────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pilgrim-data') {
    event.waitUntil(syncPilgrimData());
  }
});

async function syncPilgrimData() {
  // Sync offline-registered pilgrims to backend when connectivity returns
  const pendingData = await getFromIndexedDB('pending-registrations');
  if (pendingData && pendingData.length > 0) {
    // POST to temple RFID backend
    console.log('[SW] Syncing', pendingData.length, 'pending pilgrim registrations');
  }
}

async function getFromIndexedDB(store) {
  return new Promise((resolve) => {
    const request = indexedDB.open('simhachalam-offline', 1);
    request.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(store)) { resolve([]); return; }
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => resolve(req.result);
    };
    request.onerror = () => resolve([]);
  });
}
