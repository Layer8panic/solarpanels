// Funzionamento offline: salva in cache i file dell'app
const C='solarpanels-v2';
const F=['./','index.html','css/app.css','assets/logo.png','assets/icon.svg','manifest.webmanifest',...['util','data','logo','figs-base','figs-scene','figs-comp','figs-info','figs-new','calc','tables','steps','layouts','docx','report','app'].map(n=>`js/${n}.js`)];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x.startsWith('solarpanels-')).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)))});
