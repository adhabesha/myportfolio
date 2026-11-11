/* Admin > Home page: two switches for the Motion graphics strip. Saved in site.videoAuto and site.videoPlay. */
(function(){
function inject(){var ed=document.getElementById('ed');if(!ed||document.getElementById('vopt'))return;if(!D.site)return;
  var box=document.createElement('div');box.id='vopt';box.className='box';box.style.cssText='margin:14px 0;padding:12px 14px;background:#fff;border:1px solid #e1e4e8;border-radius:8px';
  box.innerHTML='<h4 style="margin:0 0 8px">Motion graphics strip (home page)</h4>'+
   '<label style="display:flex;gap:10px;align-items:flex-start;margin:6px 0;cursor:pointer"><input type="checkbox" id="vo1" style="width:auto;margin-top:3px"'+(D.site.videoAuto!==false?' checked':'')+'><span><b>Scroll by itself</b><br><small class="hint">The strip moves on to the next video every few seconds while it is on screen. Switch off to keep it still.</small></span></label>'+
   '<label style="display:flex;gap:10px;align-items:flex-start;margin:6px 0;cursor:pointer"><input type="checkbox" id="vo2" style="width:auto;margin-top:3px"'+(D.site.videoPlay?' checked':'')+'><span><b>Play the middle video when visitors reach it</b><br><small class="hint">A silent preview of the centre YouTube video starts as the strip comes into view. Tapping a video still opens it on YouTube. With both on, each video plays about 7 seconds, then the strip glides to the next one.</small></span></label>';
  var hs=[].slice.call(ed.querySelectorAll('h4,h3')).filter(function(h){return /video|motion/i.test(h.textContent)})[0];
  if(hs){var n=hs.nextElementSibling;hs.parentNode.insertBefore(box,hs)}else ed.appendChild(box);
  box.querySelector('#vo1').onchange=function(e){D.site.videoAuto=e.target.checked;touch()};
  box.querySelector('#vo2').onchange=function(e){D.site.videoPlay=e.target.checked;touch()}}
var o=window.home;if(typeof o==='function'){window.home=function(){var r=o.apply(this,arguments);try{inject()}catch(e){}return r}}
})();
