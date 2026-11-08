/* Scroll reveals + page-leave transition */
(function(){
if('IntersectionObserver' in window){var n=0,io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.05,rootMargin:'0px 0px 12% 0px'});
function scan(){document.querySelectorAll('.card,.title,.txt,.shot,.video,.vid,.rv,.rl,.rr').forEach(function(el){if(el.__rv)return;el.__rv=1;if(!/(^| )(rl|rr)( |$)/.test(el.className))el.classList.add('rv');
el.style.transitionDelay=((performance.now()<2500?120:0)+(n++%3)*35)+'ms';el.addEventListener('transitionend',function(){el.style.transitionDelay=''},{once:true});io.observe(el)})}
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;
var h=a.getAttribute('href');if(!h||/^(mailto:|tel:|javascript:)/.test(h))return;var u=new URL(a.href,location.href);if(u.origin!==location.origin)return;
if(u.pathname===location.pathname&&u.search===location.search)return;
e.preventDefault();document.documentElement.classList.add('leaving');setTimeout(function(){location.href=u.href},240)});
addEventListener('pageshow',function(e){if(e.persisted)document.documentElement.classList.remove('leaving')});
})();
/* Home hero sequence: menu slides in, then the image fades in once it has loaded, then the text */
(function(){var h=document.querySelector('.hero'),d=0;if(!h)return;
var iv=setInterval(function(){var el=h.querySelector('.hero-in').firstElementChild,t=performance.now(),ok=el&&(el.tagName!=='IMG'||el.complete);
if(!d&&((t>200&&ok&&window.__homeReady)||t>6000)){d=1;clearInterval(iv);h.classList.add('s1');setTimeout(function(){h.classList.add('s2')},450)}},100)})();

/* sticky menu behaviour */
(function(){var h=document.querySelector('header');if(!h)return;var y=scrollY,tk=0;
function rdy(){h.classList.add('ready')}h.addEventListener('animationend',rdy,{once:true});setTimeout(rdy,1500);
addEventListener('scroll',function(){if(tk)return;tk=1;requestAnimationFrame(function(){tk=0;var n=scrollY,m=document.getElementById('menu');
h.classList.toggle('stuck',n>10);
if(m&&m.classList.contains('open')){y=n;return}
if(n>y+4&&n>120)h.classList.add('hide');else if(n<y-4||n<=10)h.classList.remove('hide');y=n})},{passive:true})})();

/* instant navigation: start fetching a page the moment a finger or mouse goes toward its link; keep the offline speed layer registered */
(function(){var seen={};function pf(e){var a=e.target.closest&&e.target.closest('a');if(!a||!a.href||seen[a.href])return;var u;try{u=new URL(a.href)}catch(x){return}if(u.origin!==location.origin||/^(mailto|tel):/.test(a.href)||u.pathname===location.pathname&&u.search===location.search)return;seen[a.href]=1;var l=document.createElement('link');l.rel='prefetch';l.href=a.href;document.head.appendChild(l)}
addEventListener('touchstart',pf,{passive:true,capture:true});addEventListener('mouseover',pf,{passive:true,capture:true});
if('serviceWorker' in navigator)addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})})();
