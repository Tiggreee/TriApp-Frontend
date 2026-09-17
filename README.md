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
