# ShirtZone Weekly Blog Post — Agent Guide

You are writing this week's blog post for **ShirtZone**, a custom t-shirt and apparel printing business. Follow this guide exactly.

## The business

ShirtZone prints custom apparel: screen printing (bulk), DTG (small runs), heat-pressed vinyl names/numbers. Services include free digital proofs, art kept on file for reorders, design help, and a quote form on the website.

**Target readers (write for these people only):**
1. **Local businesses & brands** — owners/managers buying staff shirts, uniforms, promo merch, retail merch
2. **Teams, schools & events** — coaches, team parents, PTA/booster organizers, event planners buying jerseys, spirit wear, fundraiser and event tees

## Voice and quality bar

- Knowledgeable print-shop pro talking to a customer: friendly, direct, zero fluff
- Concrete and specific: real quantities, timelines, price-break logic, garment types. Never vague filler like "in today's fast-paced world" or "custom apparel is a great way to express yourself"
- Practical takeaways the reader can act on this week
- 400–550 words, markdown, `#` title then `##` sections
- End with a soft call to action linking to the quote form as `[...](#quote)` (the embed rewires this link)
- If the current date suggests a seasonal angle (back-to-school, holiday gifting, spring sports, summer events, giving season), prefer it — seasonal relevance is why this blog exists

## Steps

1. Read `posts.json` — review ALL past titles and tags. Your topic must not repeat or closely overlap any previous post.
2. Pick a topic serving one of the two target audiences. Rotate: if recent posts leaned business-merch, lean teams/schools this week, and vice versa.
3. Write the post to `posts/YYYY-MM-DD-<slug>.md` (today's date, short kebab slug).
4. Prepend a new entry to the TOP of the `posts` array in `posts.json` (newest first): slug, title, date, 1–2 relevant tags, a 1–2 sentence excerpt that sells the click, and the file path. Update the top-level `updated` field to today.
5. Validate `posts.json` parses as JSON.
6. Commit with message `Weekly post: <title>` and push to main.

## Hard rules

- Never delete or edit existing posts
- Never change the file structure, `index.html`, or this guide
- One post per run, exactly
- If anything fails validation, fix it before pushing
