/* Speed layer: after the first visit, pages, scripts and pictures come from the phone's own storage. */
var V='v3',ST='st-'+V,IM='im-'+V,SHELL=['./','index.html','page.html','about.html','contact.html','theme.css','theme.js','slider.js','slider.css','float.js','share.js','defaults.js','swiper/swiper-bundle.min.css','swiper/swiper-bundle.min.js','fonts/metropolis-latin-300-normal.woff2','fonts/metropolis-latin-400-normal.woff2','fonts/metropolis-latin-600-normal.woff2','fonts/metropolis-latin-700-normal.woff2'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(ST).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==ST&&n!==IM}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
function put(n,req,res,max){if(!res||res.status!==200||res.type==='opaque')return;var cp=res.clone();caches.open(n).then(function(c){c.put(req,cp).then(function(){if(!max)return;c.keys().then(function(k){if(k.length>max)c.delete(k[0])})})})}
function race(req,ms,name){return new Promise(function(ok){var done=0,t=setTimeout(function(){caches.match(req,{ignoreSearch:false}).then(function(m){if(m&&!done){done=1;ok(m)}})},ms);
  fetch(req,{cache:'no-cache'}).then(function(r){clearTimeout(t);if(r&&r.status===200)put(name,req,r);if(!done){done=1;ok(r)}}).catch(function(){clearTimeout(t);caches.match(req).then(function(m){if(!done){done=1;ok(m||Response.error())}})})})}
function swr(req,name,max){return caches.open(name).then(function(c){return c.match(req).then(function(m){var n=fetch(req).then(function(r){if(r&&r.status===200){c.put(req,r.clone()).then(function(){if(max)c.keys().then(function(k){if(k.length>max)c.delete(k[0])})})}return r}).catch(function(){return m});return m||n})})}
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET'||r.headers.has('range'))return;var u=new URL(r.url);if(u.origin!==location.origin)return;
  var p=u.pathname;if(/^\/(admin|share|functions)/.test(p)||/admin\.html$/.test(p)||/\.mp4$|\.webm$/.test(p))return;
  if(/data\.json$/.test(p)){e.respondWith(race(new Request(r.url),1500,ST));return}
  if(r.mode==='navigate'||/\.(html|js|css)$/.test(p)||p==='/'){e.respondWith(race(r,1200,ST));return}
  if(/\.(woff2?|ttf)$/.test(p)){e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(x){put(ST,r,x);return x})}));return}
  if(/\.(jpe?g|png|gif|webp|avif|svg|ico)$/i.test(p)){e.respondWith(swr(r,IM,260));return}
});
