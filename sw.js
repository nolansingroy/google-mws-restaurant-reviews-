let restaurantsCache = 'restaurants-v2';

/**
* Initialize the Service Worker
*/
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(restaurantsCache).then(function(cache) {
      const sources = [
        '/',
        '/favicon.ico',
        '/index.html',
        '/restaurant.html',
        '/manifest.json',
        '/css/styles.css',
        '/img/1.webp',
        '/img/2.webp',
        '/img/3.webp',
        '/img/4.webp',
        '/img/5.webp',
        '/img/6.webp',
        '/img/7.webp',
        '/img/8.webp',
        '/img/9.webp',
        '/img/10.webp',
        '/img/icon-rb-96.png',
        '/img/undefined.webp',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js',
        '/node_modules/idb/lib/idb.js'
      ];
      return cache.addAll(sources);
    })
  );
});

/**
* Service Worker Fetch Call
*/
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            if (response) return response;
            //if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
            return fetch(event.request);
        })
    );
});

/**
* Activate the Service Worker
*/
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurants-v') &&
                        cacheName != restaurantsCache;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            )
        })
    );
});
