/* Visitor analytics (no cookies, no personal data): one record per page view with time spent, scroll depth, time on each part of the page and clicks. */
(function(){
try{var QS=new URLSearchParams(location.search),nt=QS.get('notrack');if(nt==='1'&&top===self){var ov=localStorage.vid;if(ov)navigator.sendBeacon('/api/track',new Blob([JSON.stringify({forget:ov})],{type:'text/plain'}));localStorage.noTrack=1;localStorage.removeItem('vid');addEventListener('DOMContentLoaded',function(){var d=document.createElement('div');d.textContent='This device is now ignored by your analytics \u2713';d.style.cssText='position:fixed;left:50%;top:16px;transform:translateX(-50%);background:#111;color:#fff;padding:10px 16px;border-radius:8px;font:600 13px system-ui;z-index:2147483647;box-shadow:0 6px 20px rgba(0,0,0,.3)';document.body.appendChild(d);setTimeout(function(){d.remove()},4500)})}else if(nt==='0'){localStorage.removeItem('noTrack')}
  var wf=QS.get('for');if(wf)localStorage.who=wf.slice(0,40);
  if(top!==self||/bot|crawl|spider|headless|lighthouse|preview/i.test(navigator.userAgent)||localStorage.noTrack||navigator.doNotTrack==='1')return}catch(e){return}
var S=sessionStorage,L=localStorage,rnd=function(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)},sid,vid,n,cur=null;
try{sid=S.sid||(S.sid=rnd());vid=L.vid||(L.vid=rnd());n=+S.n||0}catch(e){return}
function key(){var p=location.pathname.replace(/^\/|\.html$/g,'')||'index';if(p==='page'){var q=new URLSearchParams(location.search),c=q.get('c'),k=q.get('p');return 'page'+(c?'?c='+c+(k?'&p='+k:''):'')}return p}
function dh(){var d=document.documentElement,b=document.body;return Math.max(d.scrollHeight,b?b.scrollHeight:0)}
function start(){var ref='';if(!n){try{var r=document.referrer;if(r){var h=new URL(r).hostname;ref=h===location.hostname?'':h.replace(/^www\./,'')}}catch(e){}}
  cur={pid:rnd(),ts:Date.now(),path:key(),ref:ref,n:n,dwell:0,b:{},clicks:[],max:0};n++;try{S.n=n}catch(e){}}
function tick(){if(!cur||document.visibilityState!=='visible')return;var h=dh(),y=scrollY,v=innerHeight;cur.dwell++;var bd=Math.floor((y+v/2)/100);cur.b[bd]=(cur.b[bd]||0)+1;var m=Math.min(100,Math.round((y+v)/h*100));if(m>cur.max)cur.max=m}
function send(){if(!cur||(!cur.dwell&&!cur.clicks.length))return;tick();var p={pid:cur.pid,sid:sid,vid:vid,n:cur.n,ts:cur.ts,path:cur.path,title:document.title.slice(0,100),ref:cur.ref,who:L.who||'',dev:innerWidth<760?'m':'d',vw:innerWidth,ph:dh(),dwell:cur.dwell,scroll:cur.max,b:cur.b,clicks:cur.clicks},j=JSON.stringify(p);
  try{if(!(navigator.sendBeacon&&navigator.sendBeacon('/api/track',new Blob([j],{type:'text/plain'}))))fetch('/api/track',{method:'POST',body:j,keepalive:true})}catch(e){}}
function change(){if(!cur||key()===cur.path)return;send();start()}
start();setInterval(tick,1000);
addEventListener('click',function(e){if(!cur||cur.clicks.length>=80)return;var el=e.target.closest&&e.target.closest('a,button,img,[role=button],.swiper-slide,li,h1,h2,h3')||e.target,t=(el.getAttribute&&(el.getAttribute('aria-label')||el.getAttribute('alt')))||(el.textContent||'').trim().replace(/\s+/g,' ')||el.tagName.toLowerCase();
  var w=document.documentElement.scrollWidth||innerWidth;cur.clicks.push([Math.round(e.pageX/w*1000),Math.round(e.pageY),t.slice(0,40)])},true);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')send()});addEventListener('pagehide',send);
var ps=history.pushState;history.pushState=function(){var r=ps.apply(this,arguments);setTimeout(change,0);return r};addEventListener('popstate',function(){setTimeout(change,0)});
})();
