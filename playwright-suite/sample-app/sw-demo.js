/**
 * Minimal service worker for the service-worker.spec.ts demo.
 * Caches the app shell; serves it when offline.
 * Registered by the spec via page.addInitScript — not part of the app.
 */
const CACHE = 'demomart-sw-demo-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add('/')),
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  );
});
