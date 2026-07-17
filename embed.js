/* ShirtZone Blog embed — renders the blog into <div id="shirtzone-blog">.
   Hosted on GitHub Pages; posts come from posts.json in the same repo.
   Optional config via attributes on the container div:
     data-quote-url="/get-a-quote"  — where "Request a quote" links point
     data-max-posts="12"            — how many posts to list (default 12)
*/
(function () {
  'use strict';

  var script = document.currentScript;
  var BASE = script && script.src ? script.src.replace(/\/[^\/]*$/, '/') : './';

  var css = [
    /* ShirtZone brand: black bg, #F7A711 gold, Archivo Black uppercase headings, Montserrat body, square corners */
    '.szb{font-family:Montserrat,arial,sans-serif;color:#e2e2e2;line-height:1.65;max-width:1040px;margin:0 auto;padding:8px 4px}',
    '.szb *{box-sizing:border-box}',
    '.szb a{color:#f7a711;text-decoration:none}',
    '.szb a:hover{text-decoration:underline}',
    '.szb-head{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:24px;border-bottom:3px solid #f7a711;padding-bottom:14px}',
    '.szb-head h2{margin:0;font-family:"Archivo Black",arial,sans-serif;font-size:1.6rem;font-weight:400;text-transform:uppercase;letter-spacing:.01em;color:#fff}',
    '.szb-head h2 span{color:#f7a711}',
    '.szb-head p{margin:0;color:#919191;font-size:.88rem}',
    '.szb-badge{display:inline-block;background:#f7a711;color:#000;font-size:.68rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 12px;margin-bottom:12px}',
    '.szb-feat{background:#1b1b1b;border:1px solid #2e2e2e;padding:28px;color:#e2e2e2;cursor:pointer;transition:border-color .15s,box-shadow .15s;margin-bottom:20px}',
    '.szb-feat:hover{border-color:#f7a711;box-shadow:0 10px 30px rgba(0,0,0,.5)}',
    '.szb-feat h3{margin:0 0 10px;font-family:"Archivo Black",arial,sans-serif;font-size:1.3rem;font-weight:400;text-transform:uppercase;line-height:1.35;color:#fff}',
    '.szb-feat p{margin:0 0 14px;color:#919191;font-size:.95rem}',
    '.szb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}',
    '.szb-card{background:#161616;border:1px solid #2e2e2e;padding:22px;cursor:pointer;transition:border-color .15s,box-shadow .15s;display:flex;flex-direction:column}',
    '.szb-card:hover{border-color:#f7a711;box-shadow:0 8px 24px rgba(0,0,0,.5)}',
    '.szb-card h3{margin:0 0 8px;font-family:"Archivo Black",arial,sans-serif;font-size:.95rem;font-weight:400;text-transform:uppercase;line-height:1.4;color:#e2e2e2}',
    '.szb-card p{margin:0 0 12px;color:#919191;font-size:.86rem;flex:1}',
    '.szb-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:.72rem;color:#5e5e5e;margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em}',
    '.szb-tag{border:1px solid #f7a711;color:#f7a711;font-weight:600;padding:2px 9px;font-size:.68rem}',
    '.szb-feat .szb-meta{color:#919191}',
    '.szb-more{font-size:.78rem;font-weight:700;color:#f7a711;text-transform:uppercase;letter-spacing:.08em}',
    '.szb-article{background:#161616;border:1px solid #2e2e2e;padding:34px;max-width:780px;margin:0 auto}',
    '.szb-back{display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid #f7a711;padding:8px 18px;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#f7a711;cursor:pointer;margin-bottom:22px;font-family:Montserrat,arial,sans-serif}',
    '.szb-back:hover{background:#f7a711;color:#000}',
    '.szb-article h1{font-family:"Archivo Black",arial,sans-serif;font-size:1.55rem;font-weight:400;text-transform:uppercase;line-height:1.3;color:#f7a711;margin:0 0 10px}',
    '.szb-article h2{font-family:"Archivo Black",arial,sans-serif;font-size:1.05rem;font-weight:400;text-transform:uppercase;color:#f7a711;margin:28px 0 10px}',
    '.szb-article h3{font-family:"Archivo Black",arial,sans-serif;font-size:.92rem;font-weight:400;text-transform:uppercase;color:#e2e2e2;margin:22px 0 8px}',
    '.szb-article p{margin:0 0 14px;font-size:.95rem;color:#c2c2c2}',
    '.szb-article ul,.szb-article ol{margin:0 0 14px;padding-left:24px}',
    '.szb-article li{margin-bottom:6px;font-size:.95rem;color:#c2c2c2}',
    '.szb-article strong{color:#fff}',
    '.szb-tablewrap{overflow-x:auto;margin:0 0 14px}',
    '.szb-article table{border-collapse:collapse;width:100%;font-size:.9rem}',
    '.szb-article th{background:#f7a711;color:#000;text-align:left;padding:8px 12px;font-weight:700;text-transform:uppercase;font-size:.78rem;letter-spacing:.05em}',
    '.szb-article td{border:1px solid #2e2e2e;padding:8px 12px;color:#c2c2c2}',
    '.szb-article tr:nth-child(even) td{background:#1b1b1b}',
    '.szb-cta{background:#f7a711;padding:4px 18px;margin-top:24px}',
    '.szb-cta,.szb-article p.szb-cta{color:#000}',
    '.szb-cta strong{color:#000}',
    '.szb-cta a{color:#000;font-weight:700;text-decoration:underline}',
    '.szb-note{text-align:center;color:#919191;font-size:.9rem;padding:30px 0}',
    '.szb-foot{text-align:center;padding:24px 0 4px;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em}',
    '.szb-perma{display:block;text-align:right;font-size:.75rem;margin-top:18px}',
    '@media(max-width:600px){.szb-feat{padding:20px}.szb-article{padding:22px 16px}.szb-article h1{font-size:1.25rem}}'
  ].join('\n');

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function fmtDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function inline(s) {
    return s
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, text, url) {
        return '<a href="' + url + '">' + text + '</a>';
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  // Minimal markdown -> HTML (headings, lists, tables, paragraphs, bold/italic/links)
  function renderMd(md) {
    var lines = md.split(/\r?\n/), out = [], i = 0;
    function flushPara(buf) {
      if (buf.length) out.push('<p>' + inline(buf.join(' ')) + '</p>');
      buf.length = 0;
    }
    var para = [];
    while (i < lines.length) {
      var line = lines[i];
      var h = line.match(/^(#{1,3})\s+(.*)/);
      if (h) {
        flushPara(para);
        out.push('<h' + h[1].length + '>' + inline(esc(h[2])) + '</h' + h[1].length + '>');
        i++; continue;
      }
      if (/^\s*\|/.test(line)) {
        flushPara(para);
        var rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i].trim()); i++; }
        var cells = rows.map(function (r) {
          return r.replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); });
        });
        var body = cells.filter(function (r, idx) {
          return !(idx === 1 && r.every(function (c) { return /^:?-+:?$/.test(c); }));
        });
        var t = '<div class="szb-tablewrap"><table>';
        body.forEach(function (r, idx) {
          var tag = idx === 0 ? 'th' : 'td';
          t += '<tr>' + r.map(function (c) { return '<' + tag + '>' + inline(esc(c)) + '</' + tag + '>'; }).join('') + '</tr>';
        });
        out.push(t + '</table></div>');
        continue;
      }
      if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
        flushPara(para);
        var ordered = /^\s*\d+\.\s+/.test(line);
        var items = [];
        while (i < lines.length && (/^\s*[-*]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
          items.push('<li>' + inline(esc(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ''))) + '</li>');
          i++;
        }
        out.push((ordered ? '<ol>' : '<ul>') + items.join('') + (ordered ? '</ol>' : '</ul>'));
        continue;
      }
      if (/^\s*$/.test(line)) { flushPara(para); i++; continue; }
      para.push(esc(line.trim()));
      i++;
    }
    flushPara(para);
    return out.join('\n');
  }

  function init(root) {
    var quoteUrl = root.getAttribute('data-quote-url') || 'https://shirtzone.com/get-a-quote-now';
    var maxPosts = parseInt(root.getAttribute('data-max-posts') || '12', 10);

    if (!document.querySelector('link[href*="Archivo+Black"]')) {
      var fonts = document.createElement('link');
      fonts.rel = 'stylesheet';
      fonts.href = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Montserrat:wght@400;500;600;700&display=swap';
      document.head.appendChild(fonts);
    }
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = el('div', 'szb');
    root.appendChild(wrap);
    wrap.appendChild(el('div', 'szb-note', 'Loading the latest posts…'));

    fetch(BASE + 'posts.json?d=' + new Date().toISOString().slice(0, 10))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { renderList(data.posts.slice(0, maxPosts)); })
      .catch(function () {
        wrap.innerHTML = '';
        wrap.appendChild(el('div', 'szb-note', 'Posts are taking a break — check back soon.'));
      });

    function fixLinks(container) {
      var links = container.querySelectorAll('a');
      for (var k = 0; k < links.length; k++) {
        var a = links[k];
        if (a.getAttribute('href') === '#quote') {
          a.setAttribute('href', quoteUrl);
          a.setAttribute('target', '_top');
        } else if (/^\//.test(a.getAttribute('href') || '')) {
          // root-relative links (e.g. /p/<slug>/) point at the blog site, not the host page
          a.setAttribute('href', BASE.replace(/\/$/, '') + a.getAttribute('href'));
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener');
        } else if (/^https?:/.test(a.getAttribute('href') || '')) {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener');
        }
      }
    }

    function meta(post, featured) {
      var m = el('div', 'szb-meta');
      m.appendChild(el('span', null, fmtDate(post.date)));
      (post.tags || []).forEach(function (t) { m.appendChild(el('span', 'szb-tag', esc(t))); });
      return m;
    }

    function renderList(posts) {
      wrap.innerHTML = '';
      var head = el('div', 'szb-head');
      head.appendChild(el('h2', null, 'The Shirt<span>Zone</span> Blog'));
      head.appendChild(el('p', null, 'Fresh printing know-how, every week'));
      wrap.appendChild(head);

      if (!posts.length) {
        wrap.appendChild(el('div', 'szb-note', 'First post coming soon!'));
        return;
      }

      var feat = posts[0];
      var fc = el('div', 'szb-feat');
      fc.appendChild(el('span', 'szb-badge', 'New this week'));
      fc.appendChild(el('h3', null, esc(feat.title)));
      fc.appendChild(meta(feat, true));
      fc.appendChild(el('p', null, esc(feat.excerpt)));
      fc.appendChild(el('span', 'szb-more', 'Read the full post →'));
      fc.addEventListener('click', function () { openPost(feat, posts); });
      wrap.appendChild(fc);

      var grid = el('div', 'szb-grid');
      posts.slice(1).forEach(function (post) {
        var c = el('div', 'szb-card');
        c.appendChild(meta(post));
        c.appendChild(el('h3', null, esc(post.title)));
        c.appendChild(el('p', null, esc(post.excerpt)));
        c.appendChild(el('span', 'szb-more', 'Read →'));
        c.addEventListener('click', function () { openPost(post, posts); });
        grid.appendChild(c);
      });
      wrap.appendChild(grid);

      var foot = el('div', 'szb-foot');
      var all = el('a', null, 'Browse all posts on the ShirtZone Blog →');
      all.href = BASE;
      all.target = '_blank';
      all.rel = 'noopener';
      foot.appendChild(all);
      wrap.appendChild(foot);
    }

    function openPost(post, posts) {
      wrap.innerHTML = '';
      var art = el('div', 'szb-article');
      var back = el('button', 'szb-back', '← All posts');
      back.addEventListener('click', function () { renderList(posts); root.scrollIntoView({ block: 'start' }); });
      art.appendChild(back);
      var bodyHolder = el('div', null, '<div class="szb-note">Loading…</div>');
      art.appendChild(bodyHolder);
      wrap.appendChild(art);
      root.scrollIntoView({ block: 'start' });

      fetch(BASE + post.file + '?d=' + post.date)
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (md) {
          var html = renderMd(md);
          bodyHolder.innerHTML = '';
          var m = meta(post);
          m.style.margin = '0 0 18px';
          var titleDone = /^#\s/.test(md);
          bodyHolder.innerHTML = html;
          if (titleDone && bodyHolder.firstElementChild && bodyHolder.firstElementChild.tagName === 'H1') {
            bodyHolder.insertBefore(m, bodyHolder.firstElementChild.nextSibling);
          } else {
            bodyHolder.insertBefore(m, bodyHolder.firstChild);
          }
          var last = bodyHolder.lastElementChild;
          if (last && last.tagName === 'P' && last.querySelector('a[href="#quote"]')) {
            last.className = 'szb-cta';
            last.style.padding = '16px 18px';
          }
          var perma = el('a', 'szb-perma', 'Open this post on the blog ↗');
          perma.href = BASE + 'p/' + post.slug + '/';
          perma.target = '_blank';
          perma.rel = 'noopener';
          bodyHolder.appendChild(perma);
          fixLinks(bodyHolder);
        })
        .catch(function () {
          bodyHolder.innerHTML = '<div class="szb-note">Couldn’t load this post — try again in a minute.</div>';
        });
    }
  }

  function boot() {
    var root = document.getElementById('shirtzone-blog');
    if (root) init(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
