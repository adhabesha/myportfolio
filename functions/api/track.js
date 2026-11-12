/* Collects one record per page view (what page, how long, how far they scrolled, where they clicked). No cookies, no IP stored. Needs a D1 database bound as DB. */
let ready=0;
const BOT=/bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|telegram|pingdom|uptime/i;
export async function ensure(env){if(ready)return;
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS pv(pid TEXT PRIMARY KEY,ts INTEGER,sid TEXT,vid TEXT,n INTEGER,path TEXT,title TEXT,ref TEXT,dev TEXT,country TEXT,vw INTEGER,ph INTEGER,dwell INTEGER,scroll INTEGER,bands TEXT,clicks TEXT)').run();
  await env.DB.prepare('CREATE INDEX IF NOT EXISTS pv_ts ON pv(ts)').run();
  try{await env.DB.prepare('ALTER TABLE pv ADD COLUMN who TEXT').run()}catch(e){}
  ready=1}
export async function onRequestPost({request,env}){
  const ok=new Response(null,{status:204});
  try{
    if(!env.DB||BOT.test(request.headers.get('user-agent')||''))return ok;
    const txt=await request.text();if(txt.length>40000)return ok;
    const p=JSON.parse(txt);
    if(p&&p.forget){await ensure(env);await env.DB.prepare('DELETE FROM pv WHERE vid=?').bind(String(p.forget).slice(0,40)).run();return ok}
    if(!p||!p.pid||!p.sid||!p.path)return ok;
    const s=(v,m)=>String(v==null?'':v).slice(0,m),i=(v,m)=>Math.max(0,Math.min(m,Math.round(+v||0)));
    let b={};if(p.b&&typeof p.b==='object'){let k=0;for(const a in p.b){if(++k>600)break;b[i(a,5000)]=i(p.b[a],3600)}}
    const c=(Array.isArray(p.clicks)?p.clicks:[]).slice(0,80).map(x=>[i(x[0],1000),i(x[1],60000),s(x[2],40)]);
    await ensure(env);
    await env.DB.prepare('INSERT OR REPLACE INTO pv(pid,ts,sid,vid,n,path,title,ref,dev,country,vw,ph,dwell,scroll,bands,clicks,who) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .bind(s(p.pid,40),i(p.ts,9e15)||Date.now(),s(p.sid,40),s(p.vid,40),i(p.n,500),s(p.path,120),s(p.title,120),s(p.ref,80),p.dev==='m'?'m':'d',s((request.cf&&request.cf.country)||'',4),i(p.vw,6000),i(p.ph,60000),i(p.dwell,36000),i(p.scroll,100),JSON.stringify(b),JSON.stringify(c),s(p.who,40)).run();
  }catch(e){}
  return ok}
