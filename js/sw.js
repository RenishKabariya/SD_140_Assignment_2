const currentCache = 'portfolio-cache-v0';
const itemsToCache = [
  'index.html',
  'imgs/CODE.png',
  'imgs/download.jpg',
  'styles.css',
  'sw.js',
  'http://powerforallats.com/wp-content/uploads/2016/03/js-logo.png',
  'https://www.lifewire.com/thmb/res912A5Bt95jVZvZfHQ5UE3_Lk=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/css3-57b597e85f9b58b5c2b338de.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/170px-HTML5_logo_and_wordmark.svg.png',
];

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheName => {
      return Promise.all(
        cacheName.filter(cacheName => {
          return cacheName.startsWith('portfolio-cache') && cacheName != currentCache;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      )
    })
  )
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache).then(cache => {
      itemsToCache.forEach(urlToCache => {
        const request = new Request(urlToCache, {
          mode: 'no-cors'
        });
        fetch(request).then(response => cache.put(request, response));
      })
    })
  )
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(currentCache).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});