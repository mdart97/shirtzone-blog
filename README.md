# ShirtZone Blog

Auto-updating weekly blog for the ShirtZone website (GoDaddy Website Builder).

- **posts.json** — index of all posts, newest first
- **posts/** — one markdown file per post
- **embed.js** — the widget the GoDaddy site loads; renders the blog from posts.json
- **index.html** — standalone blog page on GitHub Pages
- **AGENT_GUIDE.md** — instructions the weekly AI agent follows to write each post

A scheduled Claude agent writes one new post per week, updates posts.json, and pushes to main. GitHub Pages serves everything; the GoDaddy site embeds it with a 3-line HTML snippet.
