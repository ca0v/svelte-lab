!function(){"use strict";const e=1601750441590,t="cache"+e,s=["/client/inject_styles.5607aec6.js","/client/index.0c09fce2.js","/client/_examples.9b620e0b.js","/client/_examples.f0b5da5a.js","/client/index.6f7f3e84.js","/client/index.9ab41bf6.js","/client/links.eb0d6940.js","/client/index.e8048d92.js","/client/transitions.245561aa.js","/client/components.ad473c96.js","/client/transitions.c7bdba63.js","/client/stores.b54a2005.js","/client/about.a31bb808.js","/client/actions.c0bd6593.js","/client/index.1ee1e642.js","/client/links.f7b8b8ab.js","/client/[slug].a7c88533.js","/client/client.738a53c2.js"].concat(["/service-worker-index.html","/favicon.png","/global.css","/logo-192.png","/logo-512.png","/manifest.json","/successkid.jpg"]),n=new Set(s);self.addEventListener("install",(e=>{e.waitUntil(caches.open(t).then((e=>e.addAll(s))).then((()=>{self.skipWaiting()})))})),self.addEventListener("activate",(e=>{e.waitUntil(caches.keys().then((async e=>{for(const s of e)s!==t&&await caches.delete(s);self.clients.claim()})))})),self.addEventListener("fetch",(t=>{if("GET"!==t.request.method||t.request.headers.has("range"))return;const s=new URL(t.request.url);s.protocol.startsWith("http")&&(s.hostname===self.location.hostname&&s.port!==self.location.port||(s.host===self.location.host&&n.has(s.pathname)?t.respondWith(caches.match(t.request)):"only-if-cached"!==t.request.cache&&t.respondWith(caches.open("offline"+e).then((async e=>{try{const s=await fetch(t.request);return e.put(t.request,s.clone()),s}catch(s){const n=await e.match(t.request);if(n)return n;throw s}})))))}))}();
