/* Sadu site: offline helper (service worker).
   It keeps a copy of the site's files on the device so Sadu opens without internet.
   Pages are served from the copy at once, then refreshed from the internet in the background,
   so an update reaches the device on the next visit. Raise VERSION when files are added or removed. */
var VERSION = 'sadu-v5';
var FILES = [
  './', 'learn.html', 'index.html', 'ar.html', 'bay.html', 'manifest.webmanifest',
  'css/site.css', 'css/learn.css',
  'js/runtime.js', 'js/courses.js', 'js/stories.js', 'js/discover.js', 'js/glossary.js', 'js/learn.js',
  'js/page-en.js', 'js/page-ar.js', 'js/falcon-flight.js', 'js/letter-catch.js', 'js/souq-dash.js', 'js/bay.js', 'js/vendor/three.min.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  var local = url.origin === location.origin, fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!local && !fonts) return;
  // serve the saved copy straight away; fetch a fresh one in the background and keep it for next time
  e.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(e.request, { ignoreSearch: local }).then(function (saved) {
      var fresh = fetch(e.request).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
        return res;
      }).catch(function () { return saved; });
      return saved || fresh;
    });
  }));
});
