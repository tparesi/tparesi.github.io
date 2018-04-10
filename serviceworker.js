const criticalResources = [
  '/javascripts/site.js',
  '/stylesheets/site.css',
  '/images/cactus.jpg',
  'index.html'
],
otherResources = [],
version = 'v1::',
staticCacheName = 'static';

self.addEventListener('install', event => {
  console.log('Install event');

  event.waitUntil(
    caches.open(version + staticCacheName)
          .then(cache => {
                  cache.addAll(otherResources);
                  return cache.addAll(criticalResources)})
          .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('Activate event');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((key) => {
            return key.includes(version);
          }).map((key) => {
            return caches.delete(key);
          })
        );
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event');
  const request = event.request;

  event.respondWith(
    caches.open(version + staticCacheName).then((cache) => {
      return cache.match(request).then((response) => {
        return response || fetch(request).then((response) => {
          cache.put(request, response.clone());
          return response;
        });
      });
    })
  );
});