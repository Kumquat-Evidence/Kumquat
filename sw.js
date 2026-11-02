const V="kumquat-755704b45b";const SHELL=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(u.origin!==location.origin)return;
 if(u.pathname.endsWith("manifest.webmanifest")){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{const cp=n.clone();caches.open(V).then(c=>c.put(e.request,cp));return n}).catch(()=>caches.match("./index.html"))))});
self.addEventListener("message",e=>{if(e.data==="skipWaiting")self.skipWaiting()});