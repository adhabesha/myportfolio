/* Floating contact buttons (bottom right): WhatsApp, call, email, LinkedIn, Facebook. Numbers and links come from data.json. */
(function(){
var css='.fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:900;display:flex;flex-direction:column;align-items:center;gap:10px}'
+'.fab a,.fab button{width:44px;height:44px;border-radius:50%;border:0;display:grid;place-items:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);transition:transform .25s,opacity .25s;padding:0;text-decoration:none}'
+'.fab{align-items:flex-end}.fab svg{width:22px;height:22px;fill:#fff}'
+'.fab .m{width:auto;height:50px;padding:0 20px 0 16px;border-radius:30px;background:#111;display:flex;align-items:center;gap:9px;color:#fff;font:500 15px/1 Metropolis,Helvetica,Arial,sans-serif;letter-spacing:.02em;position:relative;animation:fabring 2.8s ease-out infinite}'
+'.fab .m svg{width:22px;height:22px;flex:none}.fab .m .ic{display:grid;place-items:center;width:22px;height:22px;animation:fabwig 5s ease-in-out infinite;transform-origin:50% 80%}.fab .m .c{display:none}'
+'.fab .m i{position:absolute;top:-3px;right:-3px;width:13px;height:13px;border-radius:50%;background:#25D366;border:2px solid #fff;animation:fabdot 1.6s ease-in-out infinite}'
+'.fab.open .m{animation:none;padding:0 18px 0 14px}.fab.open .m i,.fab.open .m .o{display:none}.fab.open .m .c{display:block}.fab.open .m .ic{animation:none}'
+'@keyframes fabring{0%{box-shadow:0 4px 14px rgba(0,0,0,.35),0 0 0 0 rgba(37,211,102,.55)}70%{box-shadow:0 4px 14px rgba(0,0,0,.35),0 0 0 16px rgba(37,211,102,0)}100%{box-shadow:0 4px 14px rgba(0,0,0,.35),0 0 0 0 rgba(37,211,102,0)}}'
+'@keyframes fabwig{0%,70%,100%{transform:none}74%{transform:rotate(-14deg)}80%{transform:rotate(12deg)}86%{transform:rotate(-8deg)}92%{transform:rotate(4deg)}}'
+'@keyframes fabdot{50%{transform:scale(1.25)}}@media(prefers-reduced-motion:reduce){.fab .m,.fab .m .ic,.fab .m i{animation:none}}'
+'.fab .l{display:flex;flex-direction:column;gap:10px}.fab .l a{opacity:0;transform:translateY(14px) scale(.6);pointer-events:none}.fab.open .l a{opacity:1;transform:none;pointer-events:auto}'
+'.fab.open .l a:nth-last-child(1){transition-delay:.02s}.fab.open .l a:nth-last-child(2){transition-delay:.06s}.fab.open .l a:nth-last-child(3){transition-delay:.1s}.fab.open .l a:nth-last-child(4){transition-delay:.14s}.fab.open .l a:nth-last-child(5){transition-delay:.18s}'
+'.fab a:hover,.fab button:hover{transform:scale(1.08)}body:has(.cfbox) .fab{display:none}@media print{.fab{display:none}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var I={wa:'M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.2 14c-.2.6-1.3 1.1-1.8 1.2-.5.1-1 .1-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.8-.1 1.3z',
tel:'M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z',
mail:'M3 5h18a1 1 0 011 1v.4l-10 6.6L2 6.4V6a1 1 0 011-1zm-1 3.8l10 6.6 10-6.6V18a1 1 0 01-1 1H3a1 1 0 01-1-1z',
li:'M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.9 2.6 4.9 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z',
fb:'M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V13h2.8v8z'};
var svg=function(d){return '<svg viewBox="0 0 24 24"><path d="'+d+'"/></svg>'};
(window.DJ?DJ():fetch('data.json').then(function(r){return r.json()})).then(function(D){
  var S=D.site||{},c=S.contact||{},so=S.social||{},tel=String(c.phone||'').replace(/[^\d+]/g,''),wa=String(c.whatsapp||c.phone||'').replace(/[^\d]/g,''),
  fb=so.facebook&&so.facebook!=='#'?so.facebook:'https://web.facebook.com/sikettc',li=so.linkedin&&so.linkedin!=='#'?so.linkedin:'https://www.linkedin.com/in/aceaddiss/',L=[];
  if(wa)L.push(['WhatsApp','https://wa.me/'+wa,'#25D366',I.wa,1]);if(tel)L.push(['Call','tel:'+tel,'#1e88e5',I.tel]);if(c.email)L.push(['Email','mailto:'+c.email,'#d93025',I.mail]);
  L.push(['LinkedIn',li,'#0a66c2',I.li,1]);L.push(['Facebook',fb,'#1877f2',I.fb,1]);
  var d=document.createElement('div');d.className='fab';
  d.innerHTML='<div class="l">'+L.map(function(x){return '<a href="'+x[1].replace(/"/g,'&quot;')+'"'+(x[4]?' target="_blank" rel="noopener"':'')+' style="background:'+x[2]+'" aria-label="'+x[0]+'" title="'+x[0]+'">'+svg(x[3])+'</a>'}).join('')+'</div><button type="button" class="m" aria-label="Chat with me" aria-expanded="false"><i></i><span class="ic"><svg class="o" viewBox="0 0 24 24"><path d="M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H9l-5 4V5a1 1 0 011-1z"/></svg><svg class="c" viewBox="0 0 24 24"><path d="M6.4 5L5 6.4 10.6 12 5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4L13.4 12 19 6.4 17.6 5 12 10.6z"/></svg></span><span class="t">Chat</span></button>';
  document.body.appendChild(d);var b=d.querySelector('.m');
  b.onclick=function(e){e.stopPropagation();var o=d.classList.toggle('open');b.setAttribute('aria-expanded',o);b.querySelector('.t').textContent=o?'Close':'Chat'};
  document.addEventListener('click',function(e){if(!d.contains(e.target)){d.classList.remove('open');b.setAttribute('aria-expanded',false);b.querySelector('.t').textContent='Chat'}});
}).catch(function(){});
})();
