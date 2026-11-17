const V="kumquat-7becc07f74";const SHELL=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:"reload"})))))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 // app shell first: launch from this version's cache at once; a new version arrives as a new worker and the "New version ready" banner
 if(e.request.mode==="navigate"){e.respondWith(caches.open(V).then(c=>c.match("./index.html")).then(r=>r||fetch(e.request).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put("./index.html",cp))}return n})));return}
 if(u.pathname.endsWith("manifest.webmanifest")){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{const cp=n.clone();caches.open(V).then(c=>c.put(e.request,cp));return n}).catch(()=>caches.match("./index.html"))))});
self.addEventListener("message",e=>{if(e.data==="skipWaiting")self.skipWaiting()});