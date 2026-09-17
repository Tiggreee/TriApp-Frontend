# TriApp — Renata's Finder

A multi-feature consumer app: music discovery, color exploration, avatar generation, makeup tutorials, and daily tips. Originally a full-stack capstone project, now maintained as a real product.

Live demo: https://tri-app-frontend.vercel.app/music

## Product summary

Renata's Finder is a full-stack app focused on modular frontend architecture, API integration patterns, and user-facing feature delivery — built and maintained as a real, evolving product, not a one-time submission.

## Key features

- Music search and previews
- Color exploration and palette utilities
- Avatar generation
- Makeup tutorials and daily tips
- Favorites and recent history persistence
- JWT-based authentication flow
- Light/dark theme support
- Voice-assisted search (browser support dependent)

## Tech stack

- **Web:** React 19, Vite, React Router, CSS Modules
- **Server:** Node.js, Express, MongoDB (Mongoose), JWT auth, Helmet, rate limiting, Winston logging

## Structure

This is a monolith: both apps live in this repository and deploy from it.

```
web/     → frontend (React + Vite)
server/  → backend API (Express + MongoDB)
```

## Run locally

```bash
git clone https://github.com/Tiggreee/TriApp-Frontend.git
cd TriApp-Frontend
npm run install:all
npm run dev
```

This runs `web` and `server` together. Individually: `npm run dev:web` / `npm run dev:server`.

Production build (web): `npm run build`

## Deployment

- Frontend: Vercel
- Backend API: Render

## Engineering focus

- Clear component boundaries
- Feature modularization
- Reusable UI and hooks
- Maintainable state and persistence flows

## Recruiter notes

This project demonstrates practical full-stack delivery under real product constraints: UX continuity, API integration, authentication, and iterative feature expansion — maintained over time, not abandoned after submission.

## Roadmap

- Kid-focused redesign (ages 3–5): bigger touch targets, simpler navigation, louder visual feedback.
- New content sections: nursery rhymes/chants and K-pop, alongside the existing music/colors/avatar features.
- At least 3 mini-games.
- Stack modernization across web and server (dependencies, removing dead code).
- Native Android app, once the web experience is solid.

## Maintained with Claude

Unlike the rest of my public repos, this one is maintained openly with
Claude (Anthropic) as a collaborator — reviewing dependencies, merging the
frontend and backend into this monolith, and helping ship new features. It's
a real product I keep polishing for my daughter, not a one-time submission,
and I'd rather show the actual process than pretend it's solo work.
