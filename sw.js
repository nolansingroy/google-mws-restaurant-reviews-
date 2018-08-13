var Cache_Name = 'Cache-v2';
var urlsToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/manifest.json',
  '/css/styles.css',
  '/img/undefined.webp',
  '/js/all.js',
  '/js/restaurant_all.js',
];

self.addEventListener('install',function (event) {
//installation steps
  event.waitUntil(
    caches.open(Cache_Name).then(function (cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(Cache_Name)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

/*
// fetching data from cache
self.addEventListener('fetch', function (event) {
	event.respondWith(caches.match(event.request).then(function (response) {
		if (response !== undefined) {
			return response;
		} else {
			return fetch(event.request).then(function (response) {
				var responseClone = response.clone();
				caches.open(Cache_Name).then(function (cache) {
					cache.put(event.request, responseClone);
				});
				return response;
			});
		}
	}));
});
*/
/*
//Activate SW
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(keys.map(function (key, i) {
				if (key !== Cache_Name) {
					return caches.delete(keys[i]);
				}
			}));
		})
	);
});
*/


// var restaurantsCache = 'restaurants-v2';
//
// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open(restaurantsCache).then(function(cache) {
//       const sources = [
//         '/',
//         '/index.html',
//         '/restaurant.html',
//         '/manifest.json',
//         '/css/styles.css',
//         '/img/1.webp',
//         '/img/2.webp',
//         '/img/3.webp',
//         '/img/4.webp',
//         '/img/5.webp',
//         '/img/6.webp',
//         '/img/7.webp',
//         '/img/8.webp',
//         '/img/9.webp',
//         '/img/10.webp',
//         '/img/icon-rb-96.png',
//         '/img/undefined.webp',
//         '/js/all.js',
//         '/js/restaurant_all.js',
//         '/js/dbhelper.js',
//         '/js/main.js',
//         '/js/restaurant_info.js',
//         '/js/idb.js'
//           ];
//       return cache.addAll(sources);
//     })
//   );
// });
//
// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request)
//         .then(function (response) {
//             if (response) return response;
//             if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
//             return fetch(event.request);
//         })
//     );
// });
//
// self.addEventListener('activate', event => {
//     event.waitUntil(clients.claim());
// });
//
// self.addEventListener('activate', function (event) {
//     event.waitUntil(
//         caches.keys().then(function (cacheNames) {
//             return Promise.all(
//                 cacheNames.filter(function (cacheName) {
//                     return cacheName.startsWith('restaurants-v') &&
//                         cacheName != restaurantsCache;
//                 }).map(function (cacheName) {
//                     return caches.delete(cacheName);
//                 })
//             )
//         })
//     );
// });
