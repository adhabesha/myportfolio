/* Fade-up on scroll for cards, titles, text and media (also catches items added later by data.json) */
(function(){if(!('IntersectionObserver' in window))return;var n=0,io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
function scan(){document.querySelectorAll('.card,.title,.txt,.shot,.video,.vid,.rv').forEach(function(el){if(el.__rv)return;el.__rv=1;el.classList.add('rv');el.style.transitionDelay=(n++%3)*90+'ms';el.addEventListener('transitionend',function(){el.style.transitionDelay=''},{once:true});io.observe(el)})}
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});scan()})();
