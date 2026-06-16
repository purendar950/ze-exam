const CACHE = 'examzen-v1';
const ASSETS = [
  './',
  './index.html',
  './pricing.html',
  './apply-coupon.html',
  './login.html',
  './partner-dashboard.html',
  './admin-vault.html',
  './test.html',
  './assets/styles.css',
  './assets/logo.svg',
  './js/store.js',
  './js/data.js',
  './js/auth.js',
  './js/main.js'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
