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
function openBox(list,i,R,tall,sw,d3){if(sw&&sw.autoplay&&sw.autoplay.running)sw.autoplay.stop();var prevFocus=document.activeElement,o=document.createElement('div');o.className='cfbox'+(tall?' v':'')+(d3?' d3':'');var dir=1;o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
  o.innerHTML='<div class="st"></div><button class="x" aria-label="Close">&times;</button>'+(list.length>1?'<button class="p" aria-label="Previous">&#8249;</button><button class="n" aria-label="Next">&#8250;</button>':'')+'<div class="ct"></div>';
  var stg=o.querySelector('.st'),ct=o.querySelector('.ct');
  function show(k){dir=k<i?-1:1;i=(k+list.length)%list.length;var s=list[i];o.style.setProperty('--dir',dir);stg.classList.remove('flip');void stg.offsetWidth;stg.classList.add('flip');
    stg.innerHTML=s.type==='yt'?'<iframe src="https://www.youtube-nocookie.com/embed/'+E(s.id)+'?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="'+E(s.caption||'Video')+'"></iframe>':
      s.type==='video'?'<video src="'+E(R(s.src))+'" controls autoplay playsinline></video>':'<img src="'+E(R(s.src))+'" alt="'+E(s.caption||'')+'">';
    ct.textContent=(s.caption?s.caption+'  ·  ':'')+(i+1)+' / '+list.length}
  function close(){stg.innerHTML='';o.remove();document.removeEventListener('keydown',key);document.documentElement.style.overflow='';if(sw&&sw.params.autoplay&&sw.autoplay&&!sw.autoplay.running)sw.autoplay.start();if(prevFocus&&prevFocus.focus)prevFocus.focus()}
  function key(e){if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(i-1);else if(e.key==='ArrowRight')show(i+1)}
  o.addEventListener('click',function(e){var c=e.target;if(c===o||c===stg)close();else if(c.classList.contains('x'))close();else if(c.classList.contains('p'))show(i-1);else if(c.classList.contains('n'))show(i+1)});
  var tx=null;o.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});o.addEventListener('touchend',function(e){if(tx==null||list.length<2)return;var dx=e.changedTouches[0].clientX-tx;tx=null;if(Math.abs(dx)>50)show(i+(dx<0?1:-1))});
  document.addEventListener('keydown',key);document.documentElement.style.overflow='hidden';document.body.appendChild(o);show(i);o.querySelector('.x').focus()}
function gthumb(s,R,eager){var ar=s.w&&s.h?' style="aspect-ratio:'+s.w+'/'+s.h+'"':'',cap=s.caption?'<div class="cf-cap">'+E(s.caption)+'</div>':'',m,play='';
  if(s.type==='yt'){m='<img src="https://i.ytimg.com/vi/'+E(s.id)+'/hqdefault.jpg" alt="" loading="lazy" decoding="async">';play='<span class="cf-play"></span>'}
  else if(s.type==='video'){m=s.poster?'<img src="'+E(R(s.poster))+'" alt="" loading="lazy" decoding="async">':'<video src="'+E(R(s.src))+'#t=0.5" preload="metadata" muted playsinline></video>';play='<span class="cf-play"></span>'}
  else m='<img src="'+E(R(s.poster||s.src))+'" alt="'+E(s.caption||'')+'" '+(eager?'fetchpriority="high"':'loading="lazy"')+' decoding="async">';
  return '<a class="gl-i" href="#" role="button" data-ar="'+(s.w&&s.h?s.w/s.h:'')+'">'+m+play+cap+'</a>'}
CF.buildG=function(sl,R){var d=document.createElement('div');d.className='cf cf-g cf-'+(sl.bg||'none');d.__sl=sl;d.__R=R;
  d.innerHTML=(sl.title?'<h3 class="cf-title">'+E(sl.title)+'</h3>':'')+'<div class="gl"></div><div class="gl-more"><button type="button">Show more</button></div>';return d};
CF.initG=function(d){var sl=d.__sl,R=d.__R,L=sl.slides,C=Math.min(6,Math.max(1,+sl.cols||3)),rows=+sl.rows||0,shape=sl.shape||'orig',gap=sl.gap==null||sl.gap===''?10:+sl.gap,g=d.querySelector('.gl'),more=d.querySelector('.gl-more'),shown=0,per,cur,inrow=0,mq=matchMedia('(max-width:700px)');
  function nc(){if(!mq.matches)return C;var k=0,t=0;L.forEach(function(x){if(x.w&&x.h){t++;if(x.w/x.h<.8)k++}});return Math.min(C,t&&k/t>.5?1:2)}
  function ratio(a){var r=+a.getAttribute('data-ar');if(shape!=='orig'){var q=(SH[shape]||SH.sq)[0].split('/');r=q[0]/q[1]}return Math.min(2.4,Math.max(.45,r||1))}
  function fit(a){var r=ratio(a);a.style.aspectRatio=r;a.style.flex=(r*100)+' 1 0'}
  function layout(){var n=nc();per=rows?rows*n:L.length;g.innerHTML='';g.style.setProperty('--g',gap+'px');cur=null;inrow=0;var was=Math.max(shown,per);shown=0;add(Math.min(L.length,was))}
  function add(k){var n=nc(),end=Math.min(L.length,shown+k);for(;shown<end;shown++){if(!cur||inrow>=n){cur=document.createElement('div');cur.className='gl-r';g.appendChild(cur);inrow=0}
      var t=document.createElement('div');t.innerHTML=gthumb(L[shown],R,shown<n);var a=t.firstChild;a.setAttribute('data-i',shown);fit(a);cur.appendChild(a);inrow++}
    more.style.display=shown<L.length?'':'none'}
  more.firstChild.onclick=function(){add(per)};
  d.addEventListener('click',function(e){var a=e.target.closest('.gl-i');if(!a)return;e.preventDefault();openBox(L,+a.getAttribute('data-i'),R,0,null,1)});
  d.addEventListener('load',function(e){var im=e.target;if(im.tagName!=='IMG')return;var a=im.closest('.gl-i');if(a&&!a.getAttribute('data-ar')&&im.naturalWidth){a.setAttribute('data-ar',im.naturalWidth/im.naturalHeight);fit(a)}},true);
  var lastN=nc();(mq.addEventListener?mq.addEventListener('change',function(){if(nc()!==lastN){lastN=nc();layout()}}):0);
  layout();CF.rel(d);return d};
CF.build=function(sl,R,full){if(sl.kind==='gallery')return CF.buildG(sl,R||function(x){return x});R=R||function(x){return x};var d=document.createElement('div'),orig=!SH[sl.shape||'orig'],mid=Math.floor(sl.slides.length/2);d.className='cf cf-'+(sl.bg||'dark')+' cf-full';
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
  (jobs.every(function(j){return j[1].kind==='gallery'})?function(f){f()}:ready)(function(){jobs.forEach(function(j){
    function go(host){var el=CF.build(j[1],R,1);if(j[2]){el.__top=1;CF.hold++;setTimeout(CF.rel,9000,el)}host.appendChild(el);host.classList.remove('cfph');j[1].kind==='gallery'?CF.initG(el):CF.init(el)}
    if(j[2]||!io)return go(j[0]);
    var w=document.createElement('div');w.className='cfph';j[0].appendChild(w);w.__go=function(){go(w)};io.observe(w)})})};
})();
