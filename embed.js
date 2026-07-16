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
    '.szb{font-family:"Segoe UI",system-ui,-apple-system,sans-serif;color:#1a1f2e;line-height:1.6;max-width:1040px;margin:0 auto;padding:8px 4px}',
    '.szb *{box-sizing:border-box}',
    '.szb a{color:#f26d21;text-decoration:none}',
    '.szb a:hover{text-decoration:underline}',
    '.szb-head{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:20px;border-bottom:3px solid #111;padding-bottom:12px}',
    '.szb-head h2{margin:0;font-size:1.7rem;font-weight:800;letter-spacing:-.02em;color:#111}',
    '.szb-head h2 span{color:#f26d21}',
    '.szb-head p{margin:0;color:#8a94a8;font-size:.9rem}',
    '.szb-badge{display:inline-block;background:#f26d21;color:#fff;font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:10px}',
    '.szb-feat{background:#111;border-radius:12px;padding:28px;color:#fff;cursor:pointer;transition:transform .15s,box-shadow .15s;margin-bottom:20px}',
    '.szb-feat:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.25)}',
    '.szb-feat h3{margin:0 0 10px;font-size:1.45rem;font-weight:800;line-height:1.3;color:#fff}',
    '.szb-feat p{margin:0 0 14px;color:#c8cdd8;font-size:.98rem}',
    '.szb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}',
    '.szb-card{background:#fff;border:1px solid #d9dde6;border-radius:12px;padding:20px;cursor:pointer;transition:transform .15s,box-shadow .15s,border-color .15s;display:flex;flex-direction:column}',
    '.szb-card:hover{transform:translateY(-2px);border-color:#f26d21;box-shadow:0 8px 24px rgba(17,17,17,.08)}',
    '.szb-card h3{margin:0 0 8px;font-size:1.08rem;font-weight:700;line-height:1.35;color:#111}',
    '.szb-card p{margin:0 0 12px;color:#4a5568;font-size:.88rem;flex:1}',
    '.szb-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:.75rem;color:#8a94a8;margin-bottom:10px}',
    '.szb-tag{background:#fff0e8;color:#d45a10;font-weight:600;padding:2px 9px;border-radius:20px;font-size:.72rem}',
    '.szb-feat .szb-meta{color:#9aa2b4}',
    '.szb-more{font-size:.85rem;font-weight:700;color:#f26d21}',
    '.szb-article{background:#fff;border:1px solid #d9dde6;border-radius:12px;padding:32px;max-width:760px;margin:0 auto}',
    '.szb-back{display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid #d9dde6;border-radius:20px;padding:7px 16px;font-size:.85rem;font-weight:600;color:#4a5568;cursor:pointer;margin-bottom:20px;font-family:inherit}',
    '.szb-back:hover{border-color:#111;color:#111}',
    '.szb-article h1{font-size:1.8rem;font-weight:800;line-height:1.25;color:#111;margin:0 0 8px;letter-spacing:-.02em}',
    '.szb-article h2{font-size:1.25rem;font-weight:700;color:#111;margin:28px 0 10px}',
    '.szb-article h3{font-size:1.05rem;font-weight:700;color:#111;margin:22px 0 8px}',
    '.szb-article p{margin:0 0 14px;font-size:.97rem}',
    '.szb-article ul,.szb-article ol{margin:0 0 14px;padding-left:24px}',
    '.szb-article li{margin-bottom:6px;font-size:.97rem}',
    '.szb-article strong{color:#111}',
    '.szb-tablewrap{overflow-x:auto;margin:0 0 14px}',
    '.szb-article table{border-collapse:collapse;width:100%;font-size:.92rem}',
    '.szb-article th{background:#111;color:#fff;text-align:left;padding:8px 12px;font-weight:600}',
    '.szb-article td{border:1px solid #d9dde6;padding:8px 12px}',
    '.szb-article tr:nth-child(even) td{background:#f8f9fb}',
    '.szb-cta{background:#fff0e8;border-radius:10px;padding:4px 18px;margin-top:24px}',
    '.szb-note{text-align:center;color:#8a94a8;font-size:.9rem;padding:30px 0}',
    '.szb-foot{text-align:center;padding:22px 0 4px;font-size:.85rem}',
    '.szb-perma{display:block;text-align:right;font-size:.78rem;margin-top:18px}',
    '@media(max-width:600px){.szb-feat{padding:20px}.szb-article{padding:22px 18px}.szb-article h1{font-size:1.45rem}}'
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
