const CACHE_NAME = 'cookbook-v2';
const PRECACHE_URLS = [
  '/',
  '/bundle.css',
  '/bundle.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Navigation requests: network-first so content stays fresh
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App bundles: stale-while-revalidate. Serving from cache keeps things fast,
  // but the background refresh means a new build reaches installed clients on
  // the next load without needing a CACHE_NAME bump.
  const url = new URL(request.url);
  const isAppBundle = url.origin === self.location.origin
    && (url.pathname.endsWith('/bundle.js') || url.pathname.endsWith('/bundle.css'));

  if (isAppBundle) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const network = fetch(request)
            .then(response => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached);

          if (cached) {
            event.waitUntil(network);
            return cached;
          }
          return network;
        })
      )
    );
    return;
  }

  // Other static assets & fonts: cache-first for speed
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        // Only cache same-origin and font requests
        const cacheable = url.origin === self.location.origin
          || url.hostname === 'fonts.googleapis.com'
          || url.hostname === 'fonts.gstatic.com';
        if (cacheable && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
