/* Build script — runs in GitHub Actions on every push.
   Reads posts.json + posts/*.md and emits _site/:
     index.html            blog home (SEO-rendered list of all posts)
     p/<slug>/index.html   one full HTML page per post (meta, OG, JSON-LD)
     sitemap.xml, rss.xml, robots.txt, 404.html
     embed.js, posts.json, posts/*  (unchanged, used by the GoDaddy embed)
*/
'use strict';
const fs = require('fs');
const path = require('path');

const SITE = 'https://blog.shirtzone.com';
const MAIN = 'https://shirtzone.com';
const QUOTE = 'https://shirtzone.com/get-a-quote-now';
const PHONE = '530-722-0122';
const BLOG_NAME = 'The ShirtZone Blog';
const TAGLINE = 'Custom screen printing, embroidery & leather patch know-how from Redding, CA';

const OUT = path.join(__dirname, '_site');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'posts.json'), 'utf8'));
const posts = data.posts;

/* ---------- helpers ---------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function metaDesc(s) {
  s = String(s).trim();
  if (s.length <= 155) return s;
  var cut = s.slice(0, 152);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}
function fmtDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
function postUrl(p) { return SITE + '/p/' + p.slug + '/'; }

/* ---------- markdown renderer (same dialect as embed.js) ---------- */
function inline(s) {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, text, url) {
      if (url === '#quote') url = QUOTE;
      var ext = /^https?:/.test(url) && url.indexOf(SITE) !== 0 && url.indexOf(MAIN) !== 0;
      return '<a href="' + url + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + text + '</a>';
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
function renderMd(md) {
  var lines = md.split(/\r?\n/), out = [], i = 0, para = [];
  function flush() {
    if (para.length) out.push('<p>' + inline(para.join(' ')) + '</p>');
    para.length = 0;
  }
  while (i < lines.length) {
    var line = lines[i];
    var h = line.match(/^(#{1,3})\s+(.*)/);
    if (h) { flush(); out.push('<h' + h[1].length + '>' + inline(esc(h[2])) + '</h' + h[1].length + '>'); i++; continue; }
    if (/^\s*\|/.test(line)) {
      flush();
      var rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i].trim()); i++; }
      var cells = rows.map(function (r) { return r.replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }); });
      var body = cells.filter(function (r, idx) {
        return !(idx === 1 && r.every(function (c) { return /^:?-+:?$/.test(c); }));
      });
      var t = '<div class="tablewrap"><table>';
      body.forEach(function (r, idx) {
        var tag = idx === 0 ? 'th' : 'td';
        t += '<tr>' + r.map(function (c) { return '<' + tag + '>' + inline(esc(c)) + '</' + tag + '>'; }).join('') + '</tr>';
      });
      out.push(t + '</table></div>');
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      flush();
      var ordered = /^\s*\d+\.\s+/.test(line), items = [];
      while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push('<li>' + inline(esc(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''))) + '</li>');
        i++;
      }
      out.push((ordered ? '<ol>' : '<ul>') + items.join('') + (ordered ? '</ol>' : '</ul>'));
      continue;
    }
    if (/^\s*$/.test(line)) { flush(); i++; continue; }
    para.push(esc(line.trim()));
    i++;
  }
  flush();
  return out.join('\n');
}

/* ---------- shared page chrome ---------- */
var CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#1a1f2e;line-height:1.65;background:#f2f4f7}
a{color:#f26d21;text-decoration:none}a:hover{text-decoration:underline}
.topbar{background:#111;padding:14px 20px}
.topbar-in{max-width:1040px;margin:0 auto;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.logo{font-size:1.3rem;font-weight:800;color:#fff;letter-spacing:-.02em}.logo span{color:#f26d21}
.topbar a.nav{color:#c8cdd8;font-size:.88rem;font-weight:600}.topbar a.nav:hover{color:#fff;text-decoration:none}
.topbar .btn{margin-left:auto;background:#f26d21;color:#fff;font-weight:700;font-size:.85rem;padding:8px 18px;border-radius:6px}
.topbar .btn:hover{background:#d45a10;text-decoration:none}
main{max-width:1040px;margin:0 auto;padding:32px 16px 60px}
.crumbs{font-size:.8rem;color:#8a94a8;margin-bottom:18px}
article{background:#fff;border:1px solid #d9dde6;border-radius:12px;padding:36px;max-width:780px;margin:0 auto}
article h1{font-size:1.9rem;font-weight:800;line-height:1.25;color:#111;letter-spacing:-.02em;margin-bottom:8px}
article h2{font-size:1.3rem;font-weight:700;color:#111;margin:28px 0 10px}
article h3{font-size:1.08rem;font-weight:700;color:#111;margin:22px 0 8px}
article p{margin:0 0 14px;font-size:1rem}
article ul,article ol{margin:0 0 14px;padding-left:24px}article li{margin-bottom:6px}
article strong{color:#111}
.tablewrap{overflow-x:auto;margin:0 0 14px}
table{border-collapse:collapse;width:100%;font-size:.93rem}
th{background:#111;color:#fff;text-align:left;padding:8px 12px;font-weight:600}
td{border:1px solid #d9dde6;padding:8px 12px}tr:nth-child(even) td{background:#f8f9fb}
.pmeta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:.8rem;color:#8a94a8;margin:0 0 20px}
.tag{background:#fff0e8;color:#d45a10;font-weight:600;padding:2px 10px;border-radius:20px;font-size:.74rem}
.cta{background:#fff0e8;border-radius:10px;padding:18px 20px;margin-top:26px}
.related{max-width:780px;margin:26px auto 0}
.related h2{font-size:1.05rem;font-weight:700;color:#111;margin-bottom:12px}
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}
.rcard{background:#fff;border:1px solid #d9dde6;border-radius:10px;padding:16px;display:block;color:#1a1f2e}
.rcard:hover{border-color:#f26d21;text-decoration:none}
.rcard b{display:block;font-size:.92rem;line-height:1.35;color:#111;margin-bottom:6px}
.rcard span{font-size:.76rem;color:#8a94a8}
.head{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:22px;border-bottom:3px solid #111;padding-bottom:12px}
.head h1{font-size:1.8rem;font-weight:800;letter-spacing:-.02em;color:#111}.head h1 span{color:#f26d21}
.head p{color:#8a94a8;font-size:.9rem}
.feat{display:block;background:#111;border-radius:12px;padding:28px;color:#fff;margin-bottom:20px}
.feat:hover{text-decoration:none;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.feat .badge{display:inline-block;background:#f26d21;color:#fff;font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:10px}
.feat h2{font-size:1.45rem;font-weight:800;line-height:1.3;color:#fff;margin-bottom:10px}
.feat p{color:#c8cdd8;margin-bottom:12px}
.feat .pmeta{color:#9aa2b4;margin-bottom:10px}
.more{font-size:.85rem;font-weight:700;color:#f26d21}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.card{background:#fff;border:1px solid #d9dde6;border-radius:12px;padding:20px;display:flex;flex-direction:column;color:#1a1f2e}
.card:hover{border-color:#f26d21;text-decoration:none;box-shadow:0 8px 24px rgba(17,17,17,.08)}
.card h2{font-size:1.08rem;font-weight:700;line-height:1.35;color:#111;margin-bottom:8px}
.card p{color:#4a5568;font-size:.88rem;flex:1;margin-bottom:12px}
.card .pmeta{margin-bottom:10px}
footer{background:#111;color:#9aa2b4;padding:28px 20px;font-size:.85rem}
.foot-in{max-width:1040px;margin:0 auto;display:flex;gap:20px;flex-wrap:wrap;align-items:center}
footer a{color:#c8cdd8}
@media(max-width:640px){article{padding:24px 18px}article h1{font-size:1.5rem}}
`;

function chrome(opts) {
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    + '<title>' + esc(opts.title) + '</title>\n'
    + '<meta name="description" content="' + esc(opts.desc) + '">\n'
    + '<link rel="canonical" href="' + opts.url + '">\n'
    + '<link rel="alternate" type="application/rss+xml" title="' + esc(BLOG_NAME) + '" href="' + SITE + '/rss.xml">\n'
    + '<meta property="og:site_name" content="' + esc(BLOG_NAME) + '">\n'
    + '<meta property="og:type" content="' + (opts.article ? 'article' : 'website') + '">\n'
    + '<meta property="og:title" content="' + esc(opts.title) + '">\n'
    + '<meta property="og:description" content="' + esc(opts.desc) + '">\n'
    + '<meta property="og:url" content="' + opts.url + '">\n'
    + (opts.article ? '<meta property="article:published_time" content="' + opts.article.date + '">\n' : '')
    + '<meta name="twitter:card" content="summary">\n'
    + (opts.jsonld || []).map(function (o) { return '<script type="application/ld+json">' + JSON.stringify(o) + '</script>\n'; }).join('')
    + '<style>' + CSS + '</style>\n</head>\n<body>\n'
    + '<div class="topbar"><div class="topbar-in">'
    + '<a class="logo" href="' + SITE + '/">Shirt<span>Zone</span> Blog</a>'
    + '<a class="nav" href="' + MAIN + '/">shirtzone.com</a>'
    + '<a class="nav" href="tel:5307220122">' + PHONE + '</a>'
    + '<a class="btn" href="' + QUOTE + '">Get a Quote</a>'
    + '</div></div>\n<main>\n'
    + opts.body
    + '\n</main>\n<footer><div class="foot-in">'
    + '<span>© ' + new Date().getFullYear() + ' ShirtZone · Redding, CA</span>'
    + '<a href="' + MAIN + '/">shirtzone.com</a>'
    + '<a href="' + QUOTE + '">Request a quote</a>'
    + '<a href="' + SITE + '/rss.xml">RSS</a>'
    + '<span>Custom screen printing · embroidery · leather patch caps — serving Redding &amp; Northern California, shipping everywhere</span>'
    + '</div></footer>\n</body>\n</html>\n';
}

var BUSINESS = {
  '@type': 'LocalBusiness',
  name: 'ShirtZone',
  url: MAIN,
  telephone: '+1-530-722-0122',
  address: { '@type': 'PostalAddress', addressLocality: 'Redding', addressRegion: 'CA', addressCountry: 'US' },
  areaServed: [
    { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: 40.5865, longitude: -122.3917 }, geoRadius: 104607 },
    { '@type': 'Country', name: 'United States' }
  ],
  description: 'Custom apparel decoration in Redding, CA: bulk screen printing, embroidery, and leather patch caps. Local service within 65 miles and shipping nationwide.'
};

function pmeta(p) {
  return '<div class="pmeta"><time datetime="' + p.date + '">' + fmtDate(p.date) + '</time>'
    + (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>';
}

/* ---------- emit ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

/* post pages */
posts.forEach(function (p) {
  var md = fs.readFileSync(path.join(__dirname, p.file), 'utf8');
  var html = renderMd(md);
  // insert meta line after the H1
  html = html.replace(/(<\/h1>)/, '$1\n' + pmeta(p));
  // style the closing CTA paragraph if it links to the quote page
  var lastP = html.lastIndexOf('<p>');
  if (lastP !== -1 && html.indexOf(QUOTE, lastP) !== -1) {
    html = html.slice(0, lastP) + '<p class="cta">' + html.slice(lastP + 3);
  }

  var related = posts.filter(function (o) {
    return o.slug !== p.slug && (o.tags || []).some(function (t) { return (p.tags || []).indexOf(t) !== -1; });
  });
  posts.forEach(function (o) {
    if (related.length < 3 && o.slug !== p.slug && related.indexOf(o) === -1) related.push(o);
  });
  related = related.slice(0, 3);

  var body = '<nav class="crumbs"><a href="' + SITE + '/">All posts</a> › ' + esc(p.title) + '</nav>'
    + '<article>' + html + '</article>'
    + '<div class="related"><h2>Keep reading</h2><div class="rgrid">'
    + related.map(function (o) {
        return '<a class="rcard" href="' + postUrl(o) + '"><b>' + esc(o.title) + '</b><span>' + fmtDate(o.date) + '</span></a>';
      }).join('')
    + '</div></div>';

  var jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: metaDesc(p.excerpt),
      datePublished: p.date,
      dateModified: p.date,
      mainEntityOfPage: postUrl(p),
      url: postUrl(p),
      keywords: (p.tags || []).join(', '),
      author: { '@type': 'Organization', name: 'ShirtZone', url: MAIN },
      publisher: BUSINESS
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: BLOG_NAME, item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: p.title, item: postUrl(p) }
      ]
    }
  ];

  var dir = path.join(OUT, 'p', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), chrome({
    title: p.title + ' | ShirtZone Blog',
    desc: metaDesc(p.excerpt),
    url: postUrl(p),
    article: p,
    jsonld: jsonld,
    body: body
  }));
});

/* blog home */
(function () {
  var feat = posts[0];
  var body = '<div class="head"><h1>The Shirt<span>Zone</span> Blog</h1><p>' + esc(TAGLINE) + '</p></div>';
  if (feat) {
    body += '<a class="feat" href="' + postUrl(feat) + '"><span class="badge">New this week</span>'
      + '<h2>' + esc(feat.title) + '</h2>' + pmeta(feat)
      + '<p>' + esc(feat.excerpt) + '</p><span class="more">Read the full post →</span></a>';
  }
  body += '<div class="grid">' + posts.slice(1).map(function (p) {
    return '<a class="card" href="' + postUrl(p) + '">' + pmeta(p) + '<h2>' + esc(p.title) + '</h2>'
      + '<p>' + esc(p.excerpt) + '</p><span class="more">Read →</span></a>';
  }).join('') + '</div>';

  var jsonld = [
    { '@context': 'https://schema.org', '@type': 'Blog', name: BLOG_NAME, url: SITE + '/', description: TAGLINE, publisher: BUSINESS },
    Object.assign({ '@context': 'https://schema.org' }, BUSINESS)
  ];
  fs.writeFileSync(path.join(OUT, 'index.html'), chrome({
    title: 'ShirtZone Blog | Custom Apparel Tips from Redding, CA Printers',
    desc: 'Weekly, practical advice on custom screen printing, embroidery, and leather patch caps — from ShirtZone in Redding, CA. Bulk orders, team gear, fundraisers, and more.',
    url: SITE + '/',
    jsonld: jsonld,
    body: body
  }));
})();

/* sitemap */
(function () {
  var urls = [{ loc: SITE + '/', lastmod: data.updated || posts[0].date }]
    .concat(posts.map(function (p) { return { loc: postUrl(p), lastmod: p.date }; }));
  var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(function (u) { return '  <url><loc>' + u.loc + '</loc><lastmod>' + u.lastmod + '</lastmod></url>'; }).join('\n')
    + '\n</urlset>\n';
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
})();

/* rss */
(function () {
  function xesc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var items = posts.slice(0, 20).map(function (p) {
    return '  <item>\n    <title>' + xesc(p.title) + '</title>\n    <link>' + postUrl(p) + '</link>\n'
      + '    <guid isPermaLink="true">' + postUrl(p) + '</guid>\n'
      + '    <pubDate>' + new Date(p.date + 'T09:00:00-08:00').toUTCString() + '</pubDate>\n'
      + '    <description>' + xesc(p.excerpt) + '</description>\n  </item>';
  }).join('\n');
  var rss = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n'
    + '  <title>' + xesc(BLOG_NAME) + '</title>\n  <link>' + SITE + '/</link>\n'
    + '  <description>' + xesc(TAGLINE) + '</description>\n  <language>en-us</language>\n'
    + items + '\n</channel></rss>\n';
  fs.writeFileSync(path.join(OUT, 'rss.xml'), rss);
})();

/* custom domain (must persist across every deploy or Pages drops it) */
fs.writeFileSync(path.join(OUT, 'CNAME'), 'blog.shirtzone.com\n');

/* robots + 404 */
fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n');
fs.writeFileSync(path.join(OUT, '404.html'), chrome({
  title: 'Page not found | ShirtZone Blog',
  desc: 'That page does not exist. Browse the latest custom apparel tips from ShirtZone.',
  url: SITE + '/404.html',
  body: '<div class="head"><h1>Page not found</h1></div><p>That page doesn’t exist. <a href="' + SITE + '/">Browse all posts →</a></p>'
}));

/* copy embed assets (used by the GoDaddy widget) */
fs.copyFileSync(path.join(__dirname, 'embed.js'), path.join(OUT, 'embed.js'));
fs.copyFileSync(path.join(__dirname, 'posts.json'), path.join(OUT, 'posts.json'));
fs.mkdirSync(path.join(OUT, 'posts'), { recursive: true });
fs.readdirSync(path.join(__dirname, 'posts')).forEach(function (f) {
  fs.copyFileSync(path.join(__dirname, 'posts', f), path.join(OUT, 'posts', f));
});

console.log('Built ' + posts.length + ' posts -> _site');
