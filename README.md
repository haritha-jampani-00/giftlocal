# 🎁 GiftLocal

> AI-powered gift recommendations rooted in where the recipient lives.

Gift suggestions that feel like advice from a well-traveled local friend — not a generic list.

---

## Name ideas (all .com availability worth checking)

| Name | Vibe | Why it works |
|------|------|--------------|
| **GiftLocal** | Warm, clear | Does exactly what it says |
| **Lokra** | Invented, short | Lok (local) + ra (Sanskrit: give). Memorable, brandable |
| **Whereto.gift** | Descriptive | "Where to gift" — clever use of .gift TLD |
| **Nearand.co** | Poetic | "Near and dear" implied |
| **Giftroo** | Playful | Short, sounds friendly, easy to say |
| **Lokalgi** | Unique | Local + gift, feels international |
| **Heregift** | Direct | Simple, search-friendly |
| **Giftsense** | Smart | Implies intelligence + local sense |

**My pick for launch: `Lokra`** — short, invented, no baggage, works globally.

---

## What this is

A single-page web app where you enter:
- Who you're buying for (age, relationship, personality words)
- Where they live (city + country)
- Your budget
- The occasion

And get 5 thoughtful, location-aware gift suggestions powered by Claude AI — including at least one local experience and one locally-made item, with live search links.

---

## Tech stack

- **Frontend**: Vanilla HTML + CSS + JS (zero dependencies, zero build step)
- **AI**: Claude Haiku via Anthropic API
- **Web search**: Anthropic's built-in web search tool (live local results)
- **Hosting**: Vercel / Netlify free tier
- **Cost**: ~$0.001 per request (Haiku pricing)

---

## Project structure

```
giftlocal/
├── README.md
├── index.html              ← main app (open this in browser)
├── src/
│   ├── lib/
│   │   ├── api.js          ← Claude API call + web search
│   │   └── prompt.js       ← system prompt (the core logic)
│   ├── components/
│   │   ├── form.js         ← input form + pill tags
│   │   └── results.js      ← gift card rendering
│   └── styles/
│       └── main.css        ← all styles
├── public/
│   └── favicon.svg
└── .env.example            ← environment variable template
```

---

## Quick start (3 minutes)

### Option A — Open directly in browser (easiest)
1. Clone or download this repo
2. Open `index.html` in your browser
3. Enter your Anthropic API key when prompted (stored in `localStorage`, never sent anywhere except Anthropic)
4. Done

### Option B — Deploy to Vercel (recommended for sharing)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Clone and deploy
git clone https://github.com/yourusername/giftlocal
cd giftlocal
vercel

# 3. Add environment variable in Vercel dashboard
# ANTHROPIC_API_KEY = your key
```

### Option C — GitHub Pages (static, free)
1. Fork this repo
2. Go to Settings → Pages → Deploy from main branch
3. Add API key in `index.html` line marked `CONFIG`

---

## Getting a free API key

1. Go to `platform.anthropic.com`
2. Sign up — **no credit card required**
3. You get **$5 free credits** (≈ 7,500 gift suggestions at Haiku pricing)
4. Copy your API key from the dashboard
5. Paste into `index.html` where it says `YOUR_API_KEY_HERE`

---

## Validate first (free, no key needed)

Before deploying anything, test the prompt manually:

1. Open `src/lib/prompt.js`
2. Copy the system prompt
3. Go to claude.ai
4. Start a new chat, paste the system prompt, then send a test request like:

```
OCCASION: Birthday
RECIPIENT: Age 29, best friend, personality: adventurous, minimalist, plant-lover
LOCATION: Kyoto, Japan
BUDGET: ¥5000–8000
EXTRA: She just started getting into ceramics
```

5. Share the output with 5 real people. If 3+ say "that's actually good" — build it.

---

## The business model (when ready)

- **Phase 1**: Free tool, build traffic
- **Phase 2**: Local experience providers can submit listings (simple form → Airtable)
- **Phase 3**: Featured listings (£20-50/month per business)
- **Phase 4**: Click-through fees or booking commission

---

## Contributing / listing your experience

Email `hello@giftlocal.co` or open an issue.

---

## License

MIT — use it, fork it, build on it.
