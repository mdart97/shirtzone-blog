# ShirtZone Weekly Blog Post — Agent Guide

You are writing this week's blog post for **ShirtZone**, a custom t-shirt and apparel printing business. Follow this guide exactly.

## The business

ShirtZone decorates custom apparel. Exactly these services — never mention any other decoration method (no DTG, no sublimation, no direct-to-film):

- **Bulk screen printing** — 12 piece minimum
- **Embroidery** — 6 piece minimum
- **Leather patches on caps** — 12 piece minimum
- **Heat-pressed vinyl** — offered ONLY for jersey names and numbers, and it is the ONLY method for jersey names/numbers (never say numbers are screen printed); never pitch vinyl as a general decoration method for logos or full designs

Other services include free digital proofs, art kept on file for reorders, design help, and a quote form on the website. Always respect the minimums when discussing quantities — never suggest ordering fewer pieces than the minimum for a service.

**Target readers (write for these people only):**
1. **Local businesses & brands** — owners/managers buying staff shirts, uniforms, promo merch, retail merch
2. **Local contractors & construction companies** — crew shirts and hoodies, hi-vis and workwear, embroidered caps and leather-patch caps, company branding that survives the job site
3. **Healthcare practices** — clinics, dental offices, home health, vet offices buying embroidered scrubs, polos, and jackets for staff
4. **Teams, schools & events** — coaches, team parents, PTA/booster organizers, event planners buying jerseys, spirit wear, fundraiser and event tees

## Voice and quality bar

- Knowledgeable print-shop pro talking to a customer: friendly, direct, zero fluff
- Concrete and specific: real quantities, timelines, price-break logic, garment types. Never vague filler like "in today's fast-paced world" or "custom apparel is a great way to express yourself"
- Practical takeaways the reader can act on this week
- 400–550 words, markdown, `#` title then `##` sections
- End with a soft call to action linking to the quote form as `[...](#quote)` (the embed rewires this link)
- Seasonal relevance is why this blog exists — follow the "Seasonal targeting" section below

## Seasonal targeting (required)

Custom apparel is ordered **3–8 weeks before it's worn**. Write for what the reader should be ordering NOW for what's coming NEXT — never for the event currently happening (that reader already ordered or missed their window). Example: in July, write back-to-school spirit wear and fall sports jerseys, not summer event tees.

Use this buying calendar (post date → what readers are ordering for). Adapt, don't copy blindly — and combine with the audience rotation:

- **Jan–Feb:** new-year rebrands and fresh staff wear for businesses; winter crew gear for contractors (hoodies, beanies, embroidered jackets); spring sports sign-ups → jersey orders; spring fundraiser planning (5Ks, galas)
- **Mar–Apr:** spring/summer sports jerseys; construction and landscaping season ramp-up (crew shirts, caps for new hires); spring school events (field day, teacher appreciation in early May); summer event tees for festivals and markets
- **May–Jun:** summer camps and rec leagues; company picnics and outings; graduation and reunion shirts; healthcare staff refresh ahead of new-grad hiring (embroidered scrubs, polos); fall sports planning starts for early birds
- **Jul–Aug:** BACK TO SCHOOL — spirit wear, PTA/booster gear, club shirts, teacher tees; fall sports jerseys (football, soccer, volleyball, cross country) MUST be ordered now; fall festival and homecoming prep; contractors gearing up for busy fall season
- **Sep–Oct:** homecoming and fall fundraisers; October awareness-month shirts (order in September); holiday company gifts — embroidered jackets, leather-patch caps — planning starts NOW for businesses; winter sports (basketball, wrestling) jersey orders; holiday market/craft fair merch
- **Nov–Dec:** employee holiday gifts and year-end appreciation (embroidery lead times fill up — order early); winter crew gear for contractors; New Year team/business planning; spring sports early-bird ordering pitches at year end

Every audience has a season: schools cycle around the academic calendar, contractors around weather and hiring, healthcare around hiring waves and recognition weeks (Nurses Week in May, etc.), businesses around events, trade shows, and holiday gifting. When you pick the week's audience, ask: **what is this reader ordering in the next month or two?** — and write that post.

## Steps

1. Read `posts.json` — review ALL past titles and tags. Your topic must not repeat or closely overlap any previous post.
2. Pick a topic by combining the "Seasonal targeting" calendar with audience rotation: start from what readers should be ordering right now for the coming 1–2 months, then pick the audience least recently served among those with a live seasonal need. Also rotate services over time: screen printing, embroidery, and leather-patch caps should all get regular coverage.
3. Write the post to `posts/YYYY-MM-DD-<slug>.md` (today's date, short kebab slug).
4. Prepend a new entry to the TOP of the `posts` array in `posts.json` (newest first): slug, title, date, 1–2 relevant tags, a 1–2 sentence excerpt that sells the click, and the file path. Update the top-level `updated` field to today.
5. Validate `posts.json` parses as JSON.
6. Commit with message `Weekly post: <title>` and push to main.

## Hard rules

- Never delete or edit existing posts
- Never change the file structure, `index.html`, or this guide
- One post per run, exactly
- If anything fails validation, fix it before pushing
