/* Mobile contact dock: WhatsApp, Email, Call in a bottom bar. Desktop keeps the floating Chat button. Details come from data.json. */
(function(){
var css='.dock{display:none}'
+'@media(max-width:800px){'
+'.fab{display:none!important}'
+'.dock{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:950;justify-content:space-around;align-items:center;padding:12px 8% calc(12px + env(safe-area-inset-bottom,0px));background:linear-gradient(rgba(214,214,214,.86),rgba(190,190,190,.9));-webkit-backdrop-filter:blur(16px) saturate(1.2);backdrop-filter:blur(16px) saturate(1.2);border-radius:26px 26px 0 0;box-shadow:0 -8px 28px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.55);transform:translateY(110%);transition:transform .5s cubic-bezier(.2,.9,.25,1)}'
+'.dock.on{transform:none}'
+'.dock a{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(0,0,0,.28);background:rgba(255,255,255,.08);color:#111;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:transform .2s,background .2s,color .2s}'
+'.dock a:active{transform:scale(.92);background:#111;color:#fff}'
+'.dock svg{width:24px;height:24px;fill:currentColor}'
+'footer{padding-bottom:calc(84px + env(safe-area-inset-bottom,0px))!important}'
+'body:has(.cfbox) .dock{transform:translateY(110%)}'
+'}@media print{.dock{display:none!important}}@media(prefers-reduced-motion:reduce){.dock{transition:none}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var I={wa:'M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.2 14c-.2.6-1.3 1.1-1.8 1.2-.5.1-1 .1-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.3 0 .5l-.3.4-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.8-.1 1.3z',
mail:'M3 5h18a1 1 0 011 1v.4l-10 6.6L2 6.4V6a1 1 0 011-1zm-1 3.8l10 6.6 10-6.6V18a1 1 0 01-1 1H3a1 1 0 01-1-1z',
tel:'M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.6 3.6a1 1 0 01-.25 1z'};
var svg=function(d){return '<svg viewBox="0 0 24 24"><path d="'+d+'"/></svg>'};
(window.DJ?DJ():fetch('data.json').then(function(r){return r.json()})).then(function(D){
  var c=(D.site||{}).contact||{},tel=String(c.phone||'').replace(/[^\d+]/g,''),wa=String(c.whatsapp||c.phone||'').replace(/[^\d]/g,''),L=[];
  if(wa)L.push(['WhatsApp','https://wa.me/'+wa,I.wa,1]);if(c.email)L.push(['Email','mailto:'+c.email,I.mail]);if(tel)L.push(['Call','tel:'+tel,I.tel]);
  if(!L.length)return;
  var d=document.createElement('nav');d.className='dock';d.setAttribute('aria-label','Contact');
  d.innerHTML=L.map(function(x){return '<a href="'+x[1].replace(/"/g,'&quot;')+'"'+(x[3]?' target="_blank" rel="noopener"':'')+' aria-label="'+x[0]+'">'+svg(x[2])+'</a>'}).join('');
  document.body.appendChild(d);setTimeout(function(){d.classList.add('on')},400);
}).catch(function(){});
})();
