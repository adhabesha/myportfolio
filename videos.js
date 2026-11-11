/* Motion graphics strip options (admin > Home page): site.videoAuto (default on) = strip moves on by itself, site.videoPlay = the middle video previews when the strip is reached. */
(function(){
var tr=document.getElementById('track'),sec=document.getElementById('videos');if(!tr||!sec||!window.DJ)return;
DJ().then(function(D){var S=D.site||{},AUTO=S.videoAuto!==false,PLAY=!!S.videoPlay;
  var block=!AUTO||PLAY;if(block){var sb=tr.scrollBy.bind(tr),sc=tr.scrollTo.bind(tr),f=function(g){return function(o){if(o&&typeof o==='object'&&o.behavior==='smooth')return;return g.apply(null,arguments)}};tr.scrollBy=f(sb);tr.scrollTo=f(sc)}
  if(!PLAY)return;
  var vis=false,dir=1,raf=0,pauseUntil=0,cur=null,showT=0,settleT=0,snap=tr.style.scrollSnapType;
  function items(){return [].slice.call(tr.querySelectorAll('.vid'))}
  function ytId(li){var a=li.querySelector('a'),m=a&&/[?&]v=([\w-]{11})/.exec(a.getAttribute('href')||'');return m&&m[1]}
  function center(){var r=tr.getBoundingClientRect(),mid=r.left+r.width/2,best=null,bd=1e9;items().forEach(function(li){var b=li.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-mid);if(d<bd){bd=d;best=li}});return best}
  function stop(){if(!cur)return;var t=cur.th;t.innerHTML=cur.html;cur=null}
  function play(li){if(!li)return;if(cur&&cur.li===li)return;var id=ytId(li);if(!id)return;stop();var th=li.querySelector('.vthumb');if(!th)return;cur={li:li,th:th,html:th.innerHTML};
    th.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&mute=1&controls=0&loop=1&playlist='+id+'&playsinline=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media" title="Preview" style="position:absolute;inset:0;width:100%;height:100%;border:0;pointer-events:none"></iframe>'}
  function playCenter(){if(!vis||!PLAY)return;var c=center();if(c&&ytId(c))play(c);else{var all=items(),i=all.indexOf(c),k,j;for(k=1;k<all.length;k++){j=all[i+k];if(j&&ytId(j)){play(j);return}}}}
  /* showreel (auto + play): each centred video plays a while, then the strip glides on */
  function next(){showT=0;if(!vis)return;var all=items(),c=center(),i=all.indexOf(c);if(i+dir>=all.length||i+dir<0)dir=-dir;var t=all[Math.max(0,Math.min(all.length-1,i+dir))];if(!t)return;stop();
    tr.style.scrollSnapType=snap;t.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});clearTimeout(settleT);settleT=setTimeout(function(){playCenter();showT=setTimeout(next,7000)},900)}
  function begin(){if(!vis)return;settleT=setTimeout(function(){playCenter();if(AUTO)showT=setTimeout(next,7000)},500)}
  function end(){clearTimeout(showT);clearTimeout(settleT);showT=0;stop();tr.style.scrollSnapType=snap}
  function touched(){pauseUntil=performance.now()+4000;clearTimeout(showT);showT=0;tr.style.scrollSnapType=snap}
  ['pointerdown','touchstart','wheel','mouseenter'].forEach(function(e){tr.addEventListener(e,touched,{passive:true})});
  tr.addEventListener('mouseleave',function(){pauseUntil=performance.now()+1500});
  var st;tr.addEventListener('scroll',function(){if(!PLAY||!vis)return;if(performance.now()<pauseUntil||!AUTO){clearTimeout(st);st=setTimeout(function(){if(performance.now()>=pauseUntil-3000||!AUTO)playCenter();if(AUTO&&!showT)showT=setTimeout(next,7000)},400)}},{passive:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)end();else if(vis)begin()});
  function ready(){return items().length>0}
  var tries=0,iv=setInterval(function(){if(ready()||++tries>40){clearInterval(iv);if(!ready())return;
    new IntersectionObserver(function(es){es.forEach(function(e){var on=e.isIntersecting;if(on&&!vis){vis=true;begin()}else if(!on&&vis){vis=false;end()}})},{threshold:.55}).observe(tr)}},250)
})})();
