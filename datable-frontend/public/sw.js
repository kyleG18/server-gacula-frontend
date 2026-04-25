const CACHE_NAME = "toolbox-pwa-v1";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/static/css/main.1c8c3877.css",      // Updated from your build output
  "/static/js/main.434894c1.js",        // Updated from your build output
  "/static/js/453.0dba65ed.chunk.js"    // Updated from your build output
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// Fetch cached files (Offline Support)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});