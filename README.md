# ShirtZone Blog

Auto-updating weekly blog for the ShirtZone website (GoDaddy Website Builder).

- **posts.json** — index of all posts, newest first
- **posts/** — one markdown file per post
- **embed.js** — the widget the GoDaddy site loads; renders the blog from posts.json
- **build.js** — generates the SEO site into `_site/`: blog home, one HTML page per post (meta tags, Open Graph, JSON-LD), sitemap.xml, rss.xml, robots.txt
- **.github/workflows/build.yml** — runs build.js and deploys to GitHub Pages on every push
- **AGENT_GUIDE.md** — instructions the weekly AI agent follows to write each post

A scheduled Claude agent writes one new post per week, updates posts.json, and pushes to main. The Action rebuilds and deploys; the GoDaddy site embeds the widget with a 3-line HTML snippet. Canonical home: https://blog.shirtzone.com
