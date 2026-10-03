/* 3D coverflow slider (Swiper) and fullscreen lightbox. CF.mount(data) fills every [data-slot] and [data-slider] on the page. */
(function(){
var E=function(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')},CF=window.CF={},q=[],st=0;
function ready(cb){if(window.Swiper)return cb();q.push(cb);if(st)return;st=1;
  var l=document.createElement('link');l.rel='stylesheet';l.href='swiper/swiper-bundle.min.css';document.head.appendChild(l);
  var s=document.createElement('script');s.src='swiper/swiper-bundle.min.js';s.onload=function(){q.splice(0).forEach(function(f){f()})};document.head.appendChild(s)}
var SH={sq:['1/1','min(52%,460px)','66%'],'43':['4/3','min(62%,560px)','74%'],'169':['16/9','min(70%,680px)','80%'],'45':['4/5','min(44%,380px)','60%'],'916':['9/16','min(30%,260px)','56%']};
function thumb(s,R){if(s.type==='yt')return 'https://i.ytimg.com/vi/'+s.id+'/hqdefault.jpg';if(s.type==='video')return s.poster?R(s.poster):'';return R(s.src)}
function slide(s,i,R,ar){var t=thumb(s,R),play=s.type==='image'?'':'<span class="cf-play"></span>';
  var m=t?'<img src="'+E(t)+'" alt="'+E(s.caption||'')+'" loading="lazy" draggable="false">':'<video src="'+E(R(s.src))+'#t=0.5" preload="metadata" muted playsinline></video>';
  return '<div class="swiper-slide"'+(ar?' style="aspect-ratio:'+ar+'"':'')+' role="button" tabindex="0" aria-label="'+E(s.caption||'Open slide '+(i+1))+'">'+m+play+(s.caption?'<div class="cf-cap">'+E(s.caption)+'</div>':'')+'</div>'}
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
function dims(sl,R){if((sl.shape||'orig')!=='orig')return Promise.resolve([]);
  return Promise.all(sl.slides.map(function(s){return new Promise(function(res){var t=thumb(s,R);if(s.type==='yt'||!t)return res(16/9);var i=new Image(),done=0;function fin(v){if(!done){done=1;res(v)}}
    i.onload=function(){fin(i.naturalWidth/i.naturalHeight||16/9)};i.onerror=function(){fin(16/9)};setTimeout(function(){fin(16/9)},6000);i.src=t})}))}
CF.build=function(sl,R,full,ars){R=R||function(x){return x};var d=document.createElement('div');d.className='cf cf-'+(sl.bg||'dark')+(full?' cf-full':'');
  d.innerHTML=(sl.title?'<h3 class="cf-title">'+E(sl.title)+'</h3>':'')+'<div class="swiper"><div class="swiper-wrapper">'+sl.slides.map(function(s,i){return slide(s,i,R,ars&&ars[i])}).join('')+'</div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>';
  var sh=SH[sl.shape||'orig'];if(sh){d.style.setProperty('--ar',sh[0]);d.style.setProperty('--sw',sh[1]);d.style.setProperty('--swm',sh[2])}else d.classList.add('cf-orig');d.__sl=sl;d.__R=R;return d};
CF.init=function(d){var sl=d.__sl,R=d.__R,n=sl.slides.length,tall=sl.shape==='916',auto=!!sl.auto&&n>1,sw=new Swiper(d.querySelector('.swiper'),{loop:auto&&n>=5,rewind:auto&&n<5,autoplay:auto?{delay:Math.max(1,+sl.delay||3)*1000,disableOnInteraction:false,pauseOnMouseEnter:false}:false,effect:'coverflow',grabCursor:true,centeredSlides:true,slidesPerView:'auto',slideToClickedSlide:true,initialSlide:Math.floor(n/2),keyboard:{enabled:true,onlyInViewport:true},
    coverflowEffect:{rotate:0,stretch:-20,depth:200,modifier:1,slideShadows:true},pagination:{el:d.querySelector('.swiper-pagination'),clickable:true},navigation:{nextEl:d.querySelector('.swiper-button-next'),prevEl:d.querySelector('.swiper-button-prev')}}),down=null;
  d.addEventListener('pointerdown',function(e){var s=e.target.closest('.swiper-slide');down=s?{s:s,a:s.classList.contains('swiper-slide-active'),x:e.clientX,y:e.clientY}:null},true);
  d.addEventListener('click',function(e){var s=e.target.closest('.swiper-slide');if(!s||!down||down.s!==s||!down.a)return;if(Math.abs(e.clientX-down.x)>6||Math.abs(e.clientY-down.y)>6)return;openBox(sl.slides,sw.realIndex,R,tall,sw)});
  d.addEventListener('keydown',function(e){var s=e.target.closest&&e.target.closest('.swiper-slide');if(s&&s.classList.contains('swiper-slide-active')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openBox(sl.slides,sw.realIndex,R,tall,sw)}});
  d.__sw=sw;return sw};
CF.mount=function(D,R){R=R||function(x){return x};var map={},jobs=[];(D.sliders||[]).forEach(function(s){map[s.id]=s});
  document.querySelectorAll('[data-slot]').forEach(function(n){if(n.__cf)return;n.__cf=1;(((D.site||{}).slots||{})[n.getAttribute('data-slot')]||[]).forEach(function(id){if(map[id]&&map[id].slides.length)jobs.push([n,map[id],1])})});
  document.querySelectorAll('[data-slider]').forEach(function(n){if(n.__cf)return;n.__cf=1;var s=map[n.getAttribute('data-slider')];if(s&&s.slides.length)jobs.push([n,s,n.hasAttribute('data-full')?1:0])});
  if(!jobs.length)return;ready(function(){jobs.forEach(function(j){dims(j[1],R).then(function(ars){var el=CF.build(j[1],R,j[2],ars);j[0].appendChild(el);CF.init(el)})})})};
})();
