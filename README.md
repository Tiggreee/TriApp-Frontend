# TriApp Frontend

Single React app with three search features using free public APIs. No setup, no auth hassle.

## What's Inside

- **Music Finder**: Search songs and artists on iTunes. Listen to previews, check out the artwork.
- **Weather Dashboard**: Look up any city and get the current temp and wind speed via Open-Meteo.
- **Pokédex**: Find Pokémon by name, see their sprite and types straight from PokeAPI.

## Tech Stack

- React 18 + TypeScript
- Vite (fast builds and HMR)
- React Router v6 (smooth navigation)
- CSS Modules (clean styling)
- ESLint + Prettier (code quality)

## Quick Start

### You'll Need
- Node.js 18+
- npm

### Setup
```bash
git clone https://github.com/tiggreee/TriApp-Frontend.git
cd TriApp-Frontend
npm install
```

### Run It
```bash
npm run dev
```
Heads to `http://localhost:5173`

### Build & Check It Out
```bash
npm run build
npm run preview
```

### Keep Code Clean
```bash
npm run lint
npm run format
```

## Folder Layout
```
src/
├── components/       # Shared stuff (Header)
├── features/         # Feature folders
│   ├── music/       # iTunes search
│   ├── weather/     # City + weather
│   └── pokedex/     # Pokémon lookup
├── pages/           # Route components
├── App.tsx          # Router
└── main.tsx         # Entry
```

## Branches & Pull Requests

- [feat/router](TBD) – Header and routes
- [feat/music](TBD) – iTunes search UI
- [feat/weather](TBD) – City search + weather
- [feat/pokedex](TBD) – Pokémon lookup
- [chore/lint](TBD) – ESLint and Prettier config

## How We Work

- One branch per feature, PR to main
- Small, clear commits (English)
- Git Bash for all commands
- Stage-based development: 3–4 days per cycle
