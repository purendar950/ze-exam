const CACHE = 'examzen-v2-20260616c';
const ASSETS = [
  './',
  './index.html',
  './pricing.html',
  './apply-coupon.html',
  './login.html',
  './partner-dashboard.html',
  './admin-vault.html',
  './test.html',
  './exams/index.html',
  './exams/department.html',
  './exams/exam.html',
  './series/index.html',
  './live-test/index.html',
  './profile/index.html',
  './saved/index.html',
  './assets/styles.css?v=20260616c',
  './assets/logo.svg',
  './js/store.js?v=20260616c',
  './js/data.js?v=20260616c',
  './js/auth.js?v=20260616c',
  './js/main.js?v=20260616c',
  './js/test-engine.js?v=20260616c'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
