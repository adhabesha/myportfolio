// Cloudflare Pages Function: /share?c=<category>&p=<project number>
// Returns a tiny page with Open Graph tags (so WhatsApp, LinkedIn, Telegram, Facebook, X... show the cover, title and description),
// then sends real visitors straight to the right page of the portfolio.
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const enc = p => String(p).split('/').map(encodeURIComponent).join('/');
const clip = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };

export async function onRequest({ request, env }) {
  const url = new URL(request.url), origin = url.origin;
  const get = p => env.ASSETS.fetch(new Request(origin + '/' + p, { headers: { accept: '*/*' } }));
  let D = {};
  try { D = await (await get('data.json')).json(); } catch (e) {}
  const site = D.site || {}, sh = site.share || {}, about = site.about || {};
  const cid = url.searchParams.get('c') || '', n = parseInt(url.searchParams.get('p') || '0', 10) || 0;
  const cat = (D.categories || []).find(c => c.id === cid), proj = cat && n ? (cat.projects || [])[n - 1] : null;

  let title, desc, img, target;
  const brand = 'Addis Alemayehu';
  if (proj) {
    title = (proj.title || cat.title) + ' | ' + brand;
    desc = proj.summary || [proj.client, proj.date].filter(Boolean).join(' · ') || ('Selected ' + cat.title.toLowerCase() + ' work by ' + brand + '.');
    img = proj.cover || ('images/' + cat.id + '/' + n + '-cover.jpg');
    target = 'page.html?c=' + encodeURIComponent(cat.id) + '&p=' + n;
  } else if (cat) {
    title = cat.title + ' | ' + brand;
    desc = cat.description || ('A selection of ' + cat.title.toLowerCase() + ' projects by ' + brand + '.');
    img = cat.cover || (cat.projects && cat.projects[0] && cat.projects[0].cover) || ('images/' + cat.id + '/1-cover.jpg');
    target = 'page.html?c=' + encodeURIComponent(cat.id);
  } else {
    title = sh.title || (brand + ' | Graphic designer & front end developer');
    desc = sh.description || about.lead || 'Branding, social media, packaging, UI/UX, 3D and motion graphics.';
    img = sh.image || (site.hero && site.hero.image) || site.logo || 'images/logo.png';
    target = 'index.html';
  }
  // GIF covers: use the light JPEG poster when the admin made one, so previews load fast
  if (/\.gif$/i.test(img)) {
    const poster = img.replace(/\.gif$/i, '-poster.jpg');
    try { const r = await get(poster); if (r.ok) img = poster; } catch (e) {}
  }
  const imgUrl = /^https?:/i.test(img) ? img : origin + '/' + enc(img);
  const self = origin + '/share' + url.search, dest = origin + '/' + target;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(clip(desc, 200))}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(brand)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(clip(desc, 200))}"><meta property="og:url" content="${esc(self)}"><meta property="og:image" content="${esc(imgUrl)}"><meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(clip(desc, 200))}"><meta name="twitter:image" content="${esc(imgUrl)}">
<link rel="canonical" href="${esc(dest)}"><noscript><meta http-equiv="refresh" content="0;url=${esc(dest)}"></noscript>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#111;color:#fff;font:16px Helvetica,Arial,sans-serif}a{color:#fff}</style></head>
<body><p>Opening <a href="${esc(dest)}">${esc(title)}</a>…</p><script>location.replace(${JSON.stringify(dest)})</script></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
