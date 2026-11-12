/* Read the analytics (admin only: the request must carry a GitHub token that can write to the portfolio repository). */
import {ensure} from './track.js';
const J=(o,s)=>new Response(JSON.stringify(o),{status:s||200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export async function onRequest({request,env}){
  const REPO=env.STATS_REPO||'adhabesha/myportfolio',auth=request.headers.get('authorization')||'';
  if(!/^Bearer \S{10,}/.test(auth))return J({error:'auth'},401);
  let g;try{g=await fetch('https://api.github.com/repos/'+REPO,{headers:{Authorization:auth,'User-Agent':'portfolio-stats',Accept:'application/vnd.github+json'}})}catch(e){return J({error:'github'},502)}
  const j=g.ok?await g.json():null;if(!j||!(j.permissions&&j.permissions.push))return J({error:'auth'},401);
  if(!env.DB)return J({error:'no-db'},503);
  await ensure(env);
  const u=new URL(request.url);
  if(request.method==='POST'&&u.searchParams.get('delvid')){await env.DB.prepare('DELETE FROM pv WHERE vid=?').bind(u.searchParams.get('delvid').slice(0,40)).run();return J({ok:1})}
  if(request.method==='POST'&&u.searchParams.get('clear')){await env.DB.prepare('DELETE FROM pv').run();return J({ok:1})}
  const days=Math.max(1,Math.min(365,+u.searchParams.get('days')||30)),since=Date.now()-days*864e5,path=u.searchParams.get('path');
  const r=path?await env.DB.prepare('SELECT pid,ts,sid,vid,n,path,dev,vw,ph,dwell,scroll,bands,clicks FROM pv WHERE ts>? AND path=? ORDER BY ts LIMIT 5000').bind(since,path).all()
    :await env.DB.prepare('SELECT pid,ts,sid,vid,n,path,title,ref,dev,country,vw,ph,dwell,scroll,who FROM pv WHERE ts>? ORDER BY ts LIMIT 30000').bind(since).all();
  return J({rows:r.results||[],now:Date.now()})}
