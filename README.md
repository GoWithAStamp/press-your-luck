# Press-Your-Luck!

A score tracker for **Flip 7**, the press-your-luck card game by USAopoly. Live at **[press-your-luck.me](https://press-your-luck.me)**.

## Why this exists

I love Flip 7. The group I play with loves it too. But the official scoring web app has a handful of rough edges — duplicate rows when you add a 5th player, no support for negative scores, no persistence if you refresh — and the layout never felt right on a phone, which is where we mostly play.

So I set myself a challenge: build a better one, free for anyone to use. This is it.

If anyone from the team at Flip 7 / USAopoly stumbles on this and likes it, the code is yours — fork it, take ideas from it, ship the whole thing, whatever works for you.

## What's in it

- Add players with 3-letter initials, score round by round
- Live ranking with a crown for the leader
- Per-round limits (max 200, min −18 — matches the actual rules)
- A one-tap **Bust** button per round
- Pop-up calculator with the "decimals round down" house rule baked into Copy
- In-app **Rules & FAQ** reference (Original + With a Vengeance)
- "Who deals first?" randomiser
- Proper tie handling — if two players cross 200 in the same round, you keep playing until one pulls ahead
- Three themes × light/dark, picked by you and remembered
- Everything persists locally — refresh, close the tab, come back tomorrow

## Tech

React 18 + Vite. No backend, no analytics, no tracking. State lives in `localStorage`. Hosted on Netlify.

## Running locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the built dist/ locally
```

Node 20+ recommended.

## Deploying your own copy

Cheapest path is what I did:

1. Fork this repo (or clone and push to your own remote)
2. Sign in to [Netlify](https://www.netlify.com/) → **Add new site → Import from Git** → pick the repo
3. Netlify reads `netlify.toml` and pre-fills everything. Hit Deploy.
4. **Domain management → Add custom domain** → follow the DNS instructions at your registrar
5. Netlify auto-provisions a Let's Encrypt cert once DNS resolves

Every push to `main` triggers a fresh deploy. PR branches get unique preview URLs.

## Project layout

```
.
├── index.html              # Vite entry HTML
├── netlify.toml            # build + cache config
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # React mount
    ├── Tracker.jsx         # the tracker + theme system + calculator
    └── Reference.jsx       # Rules & FAQ overlay
```

## Licence

MIT — see [LICENSE](./LICENSE). Use it, change it, ship it, sell it. Just keep the copyright line.

## Credits

Created by **Henrique Vasconcelos** — [cellocode.pt](https://cellocode.pt)

Rules text in the in-app reference is an original paraphrase, not the publisher's printed text.

Flip 7™ and Flip 7™: With a Vengeance are trademarks of [USAopoly, Inc](https://theop.games/). This project is an unofficial fan-made helper, not affiliated with or endorsed by USAopoly.
