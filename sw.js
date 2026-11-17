/* Allenamento — service worker
   - La pagina viene sempre scaricata fresca quando c'è rete (niente versioni vecchie).
   - Senza rete si apre l'ultima copia salvata.
   - Le richieste a Firebase (login, database) non passano MAI dalla cache.
   Cambia CACHE solo se modifichi icone o manifest. */
var CACHE = "allenamento-v2";
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
    caches.open(CACHE)
      .then(function(c){ return c.addAll(ASSETS.map(function(u){ return new Request(u, {cache:"reload"}); })); })
      .catch(function(){})
      .then(function(){ return self.skipWaiting(); })
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
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var firebaseSdk = url.hostname === "www.gstatic.com" && url.pathname.indexOf("/firebasejs/") === 0;

  // Tutto il resto (login Google, database Firestore, ecc.) va diretto in rete.
  if(!sameOrigin && !firebaseSdk) return;

  // Pagina: sempre dalla rete, ignorando la cache del browser; copia aggiornata per l'offline.
  if(req.mode === "navigate" || (sameOrigin && /\/(index\.html)?$/.test(url.pathname))){
    e.respondWith(
      fetch(req, {cache:"no-store"}).then(function(res){
        if(res && res.ok){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put("./index.html", copy); }); }
        return res;
      }).catch(function(){
        return caches.match("./index.html").then(function(hit){ return hit || caches.match("./"); });
      })
    );
    return;
  }

  // Libreria Firebase (versione fissa nell'indirizzo): dalla cache, così funziona offline.
  if(firebaseSdk){
    e.respondWith(
      caches.match(req).then(function(hit){
        return hit || fetch(req).then(function(res){
          if(res && res.ok){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
          return res;
        });
      })
    );
    return;
  }

  // Icone e manifest: copia in cache subito, aggiornata in background.
  e.respondWith(
    caches.match(req).then(function(hit){
      var net = fetch(req).then(function(res){
        if(res && res.ok){ var copy=res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
        return res;
      }).catch(function(){ return hit; });
      return hit || net;
    })
  );
});
