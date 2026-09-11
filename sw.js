/* Allenamento — service worker
   App-shell caching so the app opens instantly and works fully offline.
   Bump CACHE when you change any cached file to force an update. */
var CACHE = "allenamento-v1";
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  // Navigation requests: network-first, fall back to cached app shell (offline).
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).catch(function(){ return caches.match("./index.html"); })
    );
    return;
  }
  // Other GETs: cache-first, then network (and cache a copy).
  e.respondWith(
    caches.match(req).then(function(hit){
      return hit || fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, copy); }).catch(function(){});
        return res;
      }).catch(function(){ return hit; });
    })
  );
});
