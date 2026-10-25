/* 3D coverflow slider (Swiper) and fullscreen lightbox. CF.mount(data) fills every [data-slot] and [data-slider] on the page. */
(function(){
var E=function(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')},CF=window.CF={},q=[],st=0;
function ready(cb){if(window.Swiper)return cb();q.push(cb);if(st)return;st=1;
  function run(){q.splice(0).forEach(function(f){f()})}
  if(!document.querySelector('link[href*="swiper-bundle"]')){var l=document.createElement('link');l.rel='stylesheet';l.href='swiper/swiper-bundle.min.css';document.head.appendChild(l)}
  var ex=document.querySelector('script[src*="swiper-bundle"]');
  if(ex){var t=setInterval(function(){if(window.Swiper){clearInterval(t);run()}},30);return}
  var s=document.createElement('script');s.src='swiper/swiper-bundle.min.js';s.onload=run;document.head.appendChild(s)}
var SH={sq:['1/1','min(52%,460px)','66%'],'43':['4/3','min(62%,560px)','74%'],'169':['16/9','min(70%,680px)','80%'],'45':['4/5','min(44%,380px)','60%'],'916':['9/16','min(30%,260px)','56%']};
function thumb(s,R){if(s.type==='yt')return 'https://i.ytimg.com/vi/'+s.id+'/hqdefault.jpg';if(s.type==='video')return s.poster?R(s.poster):'';return R(s.src)}
function slide(s,i,R,orig,pri){var t=thumb(s,R),gif=s.type==='image'&&s.poster,show=gif?R(s.poster):t,play=s.type==='image'?'':'<span class="cf-play"></span>',known=s.w&&s.h,ar=orig?(known?s.w+'/'+s.h:'16/9'):'';
  var big=s.type==='image'&&!gif&&/\.gif$/i.test(s.src||''),m=show?'<img '+(pri?'src':'data-src')+'="'+E(show)+'"'+(gif?' data-full="'+E(R(s.src))+'"':'')+(big?' data-lim="1"':'')+' alt="'+E(s.caption||'')+'" '+(pri?'fetchpriority="high" ':'')+'decoding="async" draggable="false">':'<video src="'+E(R(s.src))+'#t=0.5" preload="metadata" muted playsinline></video>';
  return '<div class="swiper-slide"'+(ar?' style="aspect-ratio:'+ar+'"':'')+(orig&&!known?' data-g="1"':'')+' role="button" tabindex="0" aria-label="'+E(s.caption||'Open slide '+(i+1))+'">'+m+play+(s.caption?'<div class="cf-cap">'+E(s.caption)+'</div>':'')+'</div>'}
/* lightbox */
function openBox(list,i,R,tall,sw){if(sw&&sw.autoplay&&sw.autoplay.running)sw.autoplay.stop();var prevFocus=document.activeElement,o=document.createElement('div');o.className='cfbox'+(tall?' v':'');o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
  o.innerHTML='<div class="st"></div><button class="x" aria-label="Close">&times;</button>'+(list.length>1?'<button class="p" aria-label="Previous">&#8249;</button><button class="n" aria-label="Next">&#8250;</button>':'')+'<div class="ct"></div>';
  var stg=o.querySelector('.st'),ct=o.querySelector('.ct');
  function show(k){i=(k+list.length)%list.length;var s=list[i];
    stg.innerHTML=s.type==='yt'?'<iframe src="https://www.youtube-nocookie.com/embed/'+E(s.id)+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="'+E(s.caption||'Video')+'"></iframe>':
      s.type==='video'?'<video src="'+E(R(s.src))+'" controls autoplay playsinline></video>':'<img src="'+E(R(s.src))+'" alt="'+E(s.caption||'')+'">';
    ct.textContent=(s.caption?s.caption+'  ·  ':'')+(i+1)+' / '+list.length}
  function close(){stg.innerHTML='';o.remove();document.removeEventListener('keydown',key);document.documentElement.style.overflow='';if(sw&&sw.params.autoplay&&sw.autoplay&&!sw.autoplay.running)sw.autoplay.start();if(prevFocus&&prevFocus.focus)prevFocus.focus()}
  function key(e){if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(i-1);else if(e.key==='ArrowRight')show(i+1)}
  o.addEventListener('click',function(e){var c=e.target;if(c===o||c===stg)close();else if(c.classList.contains('x'))close();else if(c.classList.contains('p'))show(i-1);else if(c.classList.contains('n'))show(i+1)});
  document.addEventListener('keydown',key);document.documentElement.style.overflow='hidden';document.body.appendChild(o);show(i);o.querySelector('.x').focus()}
CF.build=function(sl,R,full){R=R||function(x){return x};var d=document.createElement('div'),orig=!SH[sl.shape||'orig'],mid=Math.floor(sl.slides.length/2);d.className='cf cf-'+(sl.bg||'dark')+' cf-full';
  d.innerHTML=(sl.title?'<h3 class="cf-title">'+E(sl.title)+'</h3>':'')+'<div class="swiper"><div class="swiper-wrapper">'+sl.slides.map(function(s,i){return slide(s,i,R,orig,i===mid)}).join('')+'</div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>';
  var sh=SH[sl.shape||'orig'];if(sh){d.style.setProperty('--ar',sh[0]);d.style.setProperty('--sw',sh[1]);d.style.setProperty('--swm',sh[2])}else d.classList.add('cf-orig');d.__sl=sl;d.__R=R;return d};
CF.init=function(d){var sl=d.__sl,R=d.__R,n=sl.slides.length,tall=sl.shape==='916',auto=!!sl.auto&&n>1,sw=new Swiper(d.querySelector('.swiper'),{loop:auto&&n>=5,rewind:auto&&n<5,autoplay:auto?{delay:Math.max(1,+sl.delay||3)*1000,disableOnInteraction:false,pauseOnMouseEnter:false}:false,effect:'coverflow',grabCursor:true,centeredSlides:true,slidesPerView:'auto',slideToClickedSlide:true,initialSlide:Math.floor(n/2),keyboard:{enabled:true,onlyInViewport:true},
    coverflowEffect:{rotate:0,stretch:-20,depth:200,modifier:1,slideShadows:true},pagination:{el:d.querySelector('.swiper-pagination'),clickable:true},navigation:{nextEl:d.querySelector('.swiper-button-next'),prevEl:d.querySelector('.swiper-button-prev')}}),down=null;
  d.addEventListener('pointerdown',function(e){var s=e.target.closest('.swiper-slide');down=s?{s:s,a:s.classList.contains('swiper-slide-active'),x:e.clientX,y:e.clientY}:null},true);
  d.addEventListener('click',function(e){var s=e.target.closest('.swiper-slide');if(!s||!down||down.s!==s||!down.a)return;if(Math.abs(e.clientX-down.x)>6||Math.abs(e.clientY-down.y)>6)return;openBox(sl.slides,sw.realIndex,R,tall,sw)});
  d.addEventListener('keydown',function(e){var s=e.target.closest&&e.target.closest('.swiper-slide');if(s&&s.classList.contains('swiper-slide-active')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openBox(sl.slides,sw.realIndex,R,tall,sw)}});
  function fit(im){var sl=im.closest&&im.closest('.swiper-slide');if(!sl||!sl.hasAttribute('data-g')||!im.naturalWidth)return;sl.style.aspectRatio=im.naturalWidth/im.naturalHeight;sl.removeAttribute('data-g');sw.update()}
  d.addEventListener('load',function(e){if(e.target.tagName==='IMG')fit(e.target)},true);d.querySelectorAll('.swiper-slide[data-g] img').forEach(function(im){if(im.complete)fit(im)});
  var ut,sd=navigator.connection&&navigator.connection.saveData;
  function up(){clearTimeout(ut);if(sd)return;ut=setTimeout(function(){var el=sw.slides[sw.activeIndex],im=el&&el.querySelector('img[data-full]');if(!im||im.__up)return;im.__up=1;var u=im.getAttribute('data-full'),x=new Image();x.onload=function(){im.src=u};x.src=u},500)}
  sw.on('slideChange',up);up();
  var go=0;function near(){var a=sw.activeIndex,L=sw.slides;for(var k=a-4;k<=a+4;k++){var el=L[k],im=el&&el.querySelector('img[data-src]');if(im&&Math.abs(k-a)<=(+im.getAttribute('data-lim')||4)){im.src=im.getAttribute('data-src');im.removeAttribute('data-src')}}}
  function start(){if(go)return;go=1;near();sw.on('slideChange',near);CF.rel(d)}
  var c0=sw.slides[sw.activeIndex]&&sw.slides[sw.activeIndex].querySelector('img');
  if(c0&&c0.getAttribute('src')&&!c0.complete){c0.addEventListener('load',start,{once:true});c0.addEventListener('error',start,{once:true});setTimeout(start,9000)}else start();
  d.__sw=sw;return sw};
CF.open=function(list,i,R){openBox(list,i,R||function(x){return x},0,null)};
CF.hold=0;CF.q=[];CF.rel=function(el){if(el.__rel)return;el.__rel=1;if(el.__top&&CF.hold>0)CF.hold--;if(!CF.hold){var q=CF.q;CF.q=[];q.forEach(function(f){f()})}};
CF.mount=function(D,R){R=R||function(x){return x};var map={},jobs=[];(D.sliders||[]).forEach(function(s){map[s.id]=s});
  function top(name,n){return name==='pv'||/\.(header|top)$/.test(name||'')||(n&&(n.hasAttribute('data-full')||n.id==='hs'))}
  document.querySelectorAll('[data-slot]').forEach(function(n){if(n.__cf)return;n.__cf=1;var nm=n.getAttribute('data-slot');(((D.site||{}).slots||{})[nm]||[]).forEach(function(id){if(map[id]&&map[id].slides.length)jobs.push([n,map[id],top(nm,n)])})});
  document.querySelectorAll('[data-slider]').forEach(function(n){if(n.__cf)return;n.__cf=1;var s=map[n.getAttribute('data-slider')];if(s&&s.slides.length)jobs.push([n,s,top('',n)])});
  if(!jobs.length)return;
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);var t=e.target;CF.hold>0?CF.q.push(t.__go):t.__go()}})},{rootMargin:'900px 0px'}):null;
  ready(function(){jobs.forEach(function(j){
    function go(host){var el=CF.build(j[1],R,1);if(j[2]){el.__top=1;CF.hold++;setTimeout(CF.rel,9000,el)}host.appendChild(el);host.classList.remove('cfph');CF.init(el)}
    if(j[2]||!io)return go(j[0]);
    var w=document.createElement('div');w.className='cfph';j[0].appendChild(w);w.__go=function(){go(w)};io.observe(w)})})};
})();
