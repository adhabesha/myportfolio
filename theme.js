/* Scroll reveals + page-leave transition */
(function(){
if('IntersectionObserver' in window){var n=0,io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.05,rootMargin:'0px 0px 12% 0px'});
function scan(){document.querySelectorAll('.card,.title,.txt,.shot,.video,.vid,.rv,.rl,.rr').forEach(function(el){if(el.__rv)return;el.__rv=1;if(!/(^| )(rl|rr)( |$)/.test(el.className))el.classList.add('rv');
el.style.transitionDelay=((performance.now()<2500?500:0)+(n++%3)*35)+'ms';el.addEventListener('transitionend',function(){el.style.transitionDelay=''},{once:true});io.observe(el)})}
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;
var h=a.getAttribute('href');if(!h||/^(mailto:|tel:|javascript:)/.test(h))return;var u=new URL(a.href,location.href);if(u.origin!==location.origin)return;
if(u.pathname===location.pathname&&u.search===location.search)return;
e.preventDefault();document.documentElement.classList.add('leaving');setTimeout(function(){location.href=u.href},560)});
addEventListener('pageshow',function(e){if(e.persisted)document.documentElement.classList.remove('leaving')});
})();
/* Home hero sequence: menu slides in, then the image fades in once it has loaded, then the text */
(function(){var h=document.querySelector('.hero'),d=0;if(!h)return;
var iv=setInterval(function(){var el=h.querySelector('.hero-in').firstElementChild,t=performance.now(),ok=el&&(el.tagName!=='IMG'||el.complete);
if(!d&&((t>800&&ok&&window.__homeReady)||t>6000)){d=1;clearInterval(iv);h.classList.add('s1');setTimeout(function(){h.classList.add('s2')},1000)}},100)})();
