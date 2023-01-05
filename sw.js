const CACHE_NAME = `tp1-app-cache-v1`;
const urlsToCache = ["index.html", "manifest.json", "sw.js", "style.css", "icon.png"];

// Use the install event to pre-cache all initial resources.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(urlsToCache);
    })()
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        // Try to fetch the resource from the network.
        const fetchResponse = await fetch(event.request);

        // Save the resource in the cache.
        cache.put(event.request, fetchResponse.clone());
        if(navigator.offLine)
        console.log('en ligne');

        // And return it.
        return fetchResponse;
      } catch (e) {
        // Fetching didn't work get the resource from the cache.
        const cachedResponse = await cache.match(event.request);
        console.log('Hors ligne');

        // And return it.
        return cachedResponse;
      }
    })()
  );
});


self.addEventListener('offline', (e) => { console.log('offline'); });

self.addEventListener('online', (e) => { console.log('online'); });

