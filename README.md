# Renatown

A kid-friendly web app built for my daughter Renata: music, colours, avatars and pop-group mini-games in a little illustrated town. No ads, no tracking, no in-game purchases.

Live: https://tri-app-frontend.vercel.app/

## What's inside

| Place | What it does |
|---|---|
| Música | Search songs and hear 30-second previews (explicit content filtered out). Voice search, favourites. |
| Juegos | Four mini-games with three original pop groups: **Corre** (an endless-runner style dash), **Ritmo** (rhythm), **Parejas** (memory) and **Baile** (repeat-the-dance). Nobody loses, everybody earns stars. |
| Colores | Pick a colour, pick a harmony, tap the bubbles to hear the colour name in Spanish. |
| Mi personaje | Draw an avatar from a name, drawn locally so the name never leaves the device. |
| Brillos / Consejos | Makeup tutorials and daily tips, behind a grown-up account. |
| Zona de papás | Premium, privacy promises, account. Everything here sits behind a grown-up gate. |

### Designed for small hands

- Big, chunky touch targets, and labels are read aloud when tapped.
- Outside links and anything about money or accounts require solving a grown-up puzzle first.
- Premium is paid through Stripe Checkout by an adult; the app never sees card data and never collects anything about the child.
- The pop groups (Chispa Club, Luna Gomita, Turbo Panditas), their looks and the music are original creations. The songs are synthesised in the browser with the Web Audio API.

## Stack

- **Monorepo:** pnpm workspaces (`web/`, `server/`)
- **Web:** React 19, TypeScript, Vite 8, React Router, TanStack Query, Web Audio, hand-written CSS design system
- **Server:** Node 22, Express 5, TypeScript, Mongoose 9, Zod, Helmet, pino, Stripe Checkout
- **Quality:** Vitest (unit, component, API with an in-memory MongoDB), Biome, GitHub Actions

## Run it locally

```bash
corepack enable
pnpm install
cp server/.env.example server/.env   # set JWT_SECRET and MONGODB_URI
cp web/.env.example web/.env
pnpm dev                              # web on :5173, API on :3000
```

Other scripts: `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm lint`.

Payments are optional. Without `STRIPE_*` variables the billing endpoints answer `503` and everything else works.

## Structure

```
web/
  src/components   shared UI (Icon, Idol, Building, Dialog, ParentGate...)
  src/pages        one file per place in town
  src/games        pure game logic (chart, memory, simon) + tests
  src/lib          audio synth, API client, trial, gate, speech
  src/state        session (account, trial, theme, sound)
server/
  src/routes       auth, users, favourites, billing
  tests            API tests against an in-memory MongoDB
```

## Deployment

- Web: Vercel (`web/`)
- API: Render (`server/`, start with `pnpm --filter @triapp/server start`)

## Roadmap

- Native Android app once the web experience is solid.
- More songs and groups.
- Accessibility pass with a screen-reader user.
