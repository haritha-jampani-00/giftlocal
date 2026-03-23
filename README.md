# GiftLocal

**AI-powered gift recommendations rooted in where the recipient lives.**

Find thoughtful, locally-aware gift ideas for anyone, anywhere. Tell us about the person — we'll suggest gifts that feel personal, not picked off a generic list.

**Live:** [giftlocal.vercel.app](https://giftlocal.vercel.app)

---

## Features

- **AI-powered suggestions** — Groq Llama 3.3 generates 5 curated gifts per search, with Claude Haiku and Gemini as fallbacks
- **Location-aware** — prices in local currency, city-specific experiences and crafts
- **Smart form** — 24 occasions, 22 relationships, 20 interest tags, custom personality input
- **Baby mode** — entering age 0–2 dynamically switches options to baby-appropriate occasions, relationships, and gifts
- **Carousel results** — horizontal swipe/scroll cards with category filtering
- **Refine with feedback** — type "more outdoorsy" or "skip group activities" and results update
- **90+ local gift fallback** — curated database works without any API key
- **Serverless proxy** — Vercel function hides API keys, with rate limiting (10 req/min) and bot protection
- **4 currencies** — USD, GBP, EUR, INR with region-aware search links
- **SEO ready** — sitemap, robots.txt, OG tags, Google Search Console verified

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML, CSS, JS (ES modules) — zero frameworks, zero build step |
| AI | Groq (Llama 3.3 70B) → Google Gemini → Anthropic Claude Haiku (fallback chain) |
| Backend | Vercel Serverless Functions (API proxy) |
| Hosting | Vercel |
| Analytics | Vercel Analytics |
| Fonts | Google Fonts (Quicksand, Caveat) |

---

## Quick Start

### Run locally
```bash
git clone https://github.com/haritha-jampani-00/giftlocal
cd giftlocal
open index.html
```

For AI-powered results locally, uncomment and add your Groq key in `index.html` line 58.

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```
Then add `GROQ_API_KEY` in Vercel → Settings → Environment Variables.

---

## Architecture

```
giftlocal/
├── index.html                  ← Single page app
├── api/
│   └── suggest.js              ← Vercel serverless proxy (rate limited, bot protected)
├── src/
│   ├── lib/
│   │   ├── prompt.js           ← Core system prompt (4-layer reasoning)
│   │   ├── groq.js             ← Groq API integration
│   │   ├── gemini.js           ← Google Gemini fallback
│   │   ├── api.js              ← Anthropic Claude integration
│   │   └── gifts.js            ← Local gift database (90+ items)
│   ├── components/
│   │   ├── form.js             ← Form logic, validation, dynamic baby mode
│   │   └── results.js          ← Carousel rendering, category tabs, search links
│   └── styles/
│       └── main.css            ← Pastel theme, animations, responsive
├── public/
│   ├── sitemap.xml
│   ├── robots.txt
│   └── og-image.svg
└── vercel.json                 ← Security headers, routing
```

---

## How the AI Prompt Works

The system prompt uses a 4-layer reasoning approach:

1. **Cultural Lens** — What's culturally significant in this city? What season is it? Any local festivals?
2. **Local Radar** — What experiences and locally-made things exist here? (with real search paths, never invented business names)
3. **Thoughtfulness Engine** — Why would THIS person love this gift? Connects personality → city → occasion
4. **Anti-Generic Filter** — Removes anything that would appear on a generic listicle. A chocolate-making class in Brussels passes. A box of chocolates does not.

---

## Roadmap

- [ ] **User accounts** — Google + email sign-in via Firebase
- [ ] **Save searches** — Revisit past gift searches
- [ ] **Wishlist** — Bookmark individual gift ideas
- [ ] **Share results** — Shareable link to gift suggestions
- [ ] **Custom domain** — giftlocal.co
- [ ] **Experience listings** — Local businesses can submit experiences
- [ ] **Affiliate integration** — Amazon Associates for purchase links

---

## Business Model

| Phase | What | Revenue |
|-------|------|---------|
| 1 | Free tool, build traffic | $0 |
| 2 | Local experience providers submit listings | Free |
| 3 | Featured/promoted listings | $20–50/month per business |
| 4 | Booking commission on experiences | 5–10% per booking |

---

## License

MIT — use it, fork it, build on it.
