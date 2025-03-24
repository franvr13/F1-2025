const CACHE_NAME = 'f1-2025-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/scripts.js',
    '/data/data.json',
    '/images/circuitos/',
    '/images/favicon/',
    // Añade otras rutas importantes
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});