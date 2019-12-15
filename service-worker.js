let CACHE_NAME = 'fipoff-cache-release001';
let urlsToCache = [
	'index.html',
	'manifest.json',
	'css/styles.css',
	'images/bgtest.png',
	'images/devices.png',
	'scripts/swHandling.js',
	'scripts/main.js',
	'scripts/interface.js',
	'scripts/fip.js',
	'scripts/config.js',
	'systems/station33/station33a.js',
	'systems/station33/blockplanA_addr.png',
	'systems/station33/station33c.js',
	'systems/station33/blockplanA_conv.png',
	'systems/abstract/abstractSimple/abstractSimple.js',
	'systems/abstract/abstractSimple/abstractSimple.png',
	'systems/abstract/abstractComplex/abstractComplex.js',
	'systems/abstract/abstractComplex/abstractComplex_main_contents.png',
	'systems/abstract/abstractComplex/abstractComplex_main_p2.png',
	'systems/abstract/abstractComplex/abstractComplex_main_p3.png',
	'systems/abstract/abstractComplex/abstractComplex_east.png',
	'systems/abstract/abstractComplex/abstractComplex_west.png',

];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
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

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.filter(function(cacheName){
					return cacheName.startsWith('fipoff-') && cacheName != CACHE_NAME;
				}).map(function(cacheName){
					return caches.delete(cacheName);
				})
			)
		})
	);


});

self.addEventListener('message', function(event){
	if(event.data.action == 'skipWaiting'){
		self.skipWaiting();
	}
});
