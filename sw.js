const CACHE_NAME = 'trading-strategy-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-trading-v1';
const ASSETS = [
  '/TradingStrategy/',
  '/TradingStrategy/index.html',
  '/TradingStrategy/home.html',
  '/TradingStrategy/trading.html',
  '/TradingStrategy/profile.html',
  '/TradingStrategy/contact.html',
  '/TradingStrategy/about.html',
  '/TradingStrategy/css/style.css',
  '/TradingStrategy/css/dark-mode.css',
  '/TradingStrategy/js/app.js',
  '/TradingStrategy/js/auth.js',
  '/TradingStrategy/js/trading.js',
  '/TradingStrategy/js/form.js',
  '/TradingStrategy/images/icon192.png',
  '/TradingStrategy/images/icon512.png',
  '/TradingStrategy/assets/chart-logo.svg',
  '/TradingStrategy/offline.html'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            console.log('Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event (Network falling back to cache)
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Handle API calls differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache dynamic pages
        if (event.request.headers.get('accept').includes('text/html')) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Fallback strategies
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/TradingStrategy/offline.html');
        }
        return caches.match(event.request);
      })
  );
});

// Background Sync (for failed POST requests)
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncTrades') {
    event.waitUntil(syncTrades());
  }
});

async function syncTrades() {
  const requests = await indexedDB.getAll('failedRequests');
  for (const request of requests) {
    try {
      const response = await fetch(request.url, request.options);
      if (response.ok) {
        await indexedDB.delete('failedRequests', request.id);
      }
    } catch (err) {
      console.error('Sync failed:', err);
    }
  }
}
