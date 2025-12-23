# Backlog

TriApp – Renata's Finder full-stack development tasks.

## Stage 1: Frontend (✅ Completed)

### Delivered Features
- [x] React 19 + Vite + React Router setup
- [x] Music Finder: iTunes search + preview + favorites
- [x] Color Palette Generator: 5 harmony modes + TheColorAPI
- [x] Avatar Creator: DiceBear API integration
- [x] Premium Trial System: 3 activations/day × 5 min
- [x] Voice Search: Spanish SpeechRecognition
- [x] Dark/Light theme toggle + localStorage persistence
- [x] Unicorn-themed UI: rainbow gradients, animations, emoji branding
- [x] Single-audio playback coordination
- [x] Help Modal with registration promo
- [x] Deployed to Vercel: https://tri-app-frontend.vercel.app/music
- [x] No code comments; clean codebase
- [x] Semantic git commits

## Stage 2: Backend (In Progress – 1 week)

### Setup & Infrastructure
- [ ] Create `TriApp-Frontend_backend` repo
- [ ] Init Node.js/Express + npm
- [ ] Git: create `stage-back-end` branch
- [ ] Add `.gitignore`, `.editorconfig`, `.eslintrc`
- [ ] Create `package.json` with `dev` and `start` scripts
- [ ] Setup `.env.example` (NODE_ENV, JWT_SECRET, MONGODB_URI, PORT)

### Database Schemas & Models
- [ ] User model:
  - `email` (string, required, unique, validated)
  - `password` (string, hashed, required, excluded from responses)
  - `name` (string, 2–30 chars, required)
  - `createdAt` (date)
- [ ] Favorite model (for Music, Colors, Avatars):
  - `type` (string: "music" | "color" | "avatar")
  - `data` (object with API response details)
  - `owner` (reference to User, required, excluded from responses)
  - `createdAt` (date)

### Authentication & Authorization
- [ ] POST `/signup`: create user + return JWT
- [ ] POST `/signin`: validate credentials + return JWT
- [ ] JWT middleware: verify token on protected routes
- [ ] Protect all `/users/*` and `/favorites/*` routes

### API Routes
- [ ] GET `/users/me`: return current user (email, name)
- [ ] GET `/favorites`: return all favorites for authenticated user
- [ ] POST `/favorites`: create favorite (music/color/avatar)
- [ ] DELETE `/favorites/:id`: remove favorite (only by owner)
- [ ] Error handling: centralized middleware, proper HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500)

### Logging & Monitoring
- [ ] Setup `request.log` (JSON format, all API requests)
- [ ] Setup `error.log` (JSON format, all errors)
- [ ] Logs excluded from git (`.gitignore`)

### Validation & Security
- [ ] Validate email, password strength, name length
- [ ] Prevent users from deleting others' favorites
- [ ] Hash passwords (bcrypt)
- [ ] Sanitize inputs

### Deployment (Google Cloud VM)
- [ ] Create GCP VM instance
- [ ] Install Node.js, MongoDB (or use Atlas)
- [ ] Setup domain (free domain or custom)
- [ ] Point domain to VM public IP
- [ ] Install SSL certificate (HTTPS)
- [ ] Create `.env` on server (NODE_ENV=production, JWT_SECRET)
- [ ] Start app with `npm start` (production mode)
- [ ] Document API domain in README

### Deliverable
- [ ] Open PR from `stage-back-end` → `main` on GitHub
- [ ] Submit PR link to TripleTen for review
- [ ] Fix any reviewer feedback
- [ ] Merge PR to main once approved

## Stage 3: Frontend-Backend Integration (Pending)

### Connect Frontend to Backend
- [ ] Update `.env` with `VITE_API_BASE_URL` (backend domain)
- [ ] Create auth context/provider in frontend
- [ ] Implement login/signup forms
- [ ] Store JWT in localStorage/sessionStorage
- [ ] Add Authorization header to API requests
- [ ] Sync favorites with backend (replace localStorage)
- [ ] Handle auth errors (401/403) with redirects

### UI Enhancements
- [ ] Fix HelpModal max-height to 70vh with scroll
- [ ] Add loading states during API calls
- [ ] Error boundaries for network failures
- [ ] Toast notifications for success/error

## Stage 4: Premium Features (Pending Backend Integration)

### Planned Premium Pages
- [ ] Consejos (Affirmations): curated positive messages
- [ ] Makeup: style/color recommendations

### Frontend Enhancements
- [ ] Connect to backend APIs (auth, favorites persistence)
- [ ] Update `VITE_API_BASE_URL` env variable to backend domain
- [ ] Unlock premium features after successful login/trial
- [ ] Sync favorites with backend (GET/POST/DELETE)

### Optional: Admin Dashboard
- [ ] User management
- [ ] Logging visualization
- [ ] Trial usage analytics

## General Rules

- **No code comments** in source files
- **English** everywhere (code, commits, README, docs)
- **Semantic commits**: feat, fix, docs, chore, style, test, refactor
- **Clear naming**: functions/variables describe their purpose
- **Error messages** clear for debugging (in logs + responses)
- **Security first**: never commit `.env`, secrets, or tokens

## Timeline

- **Week 1** (Backend): Stage 2 (setup, auth, routes, deployment)
- **Week 2+** (Integration): Stage 3 (connect frontend → backend, premium pages)

---

Last updated: 2025-12-22
