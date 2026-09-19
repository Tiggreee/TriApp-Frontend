# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [2.0.0] - 2026-09-19

### Added
- Renatown: a new illustrated, kid-first interface with day/night sky, sound and read-aloud labels.
- Arcade Renatown with three mini-games (rhythm, memory, dance) and three original pop groups.
- Grown-up gate before outside links, accounts and Premium.
- Premium checkout through Stripe (optional, off until configured) and a paid `premium` flag on accounts.
- Local avatar generation: names no longer go to a third-party API.
- Server, API and component tests.

### Changed
- Stack modernised: TypeScript, Vite 8, React 19.3, React Router 8, TanStack Query, Express 5, Mongoose 9, Zod, pnpm workspaces, Biome.
- Music search now filters explicit content and uses the Mexican store.
- Sign-up and sign-in return the same session payload, including the account name.
- Minimum password length is 8 on both client and server.

### Fixed
- Saving favourites for makeup and tips was rejected by the API.
- Sign-up did not return a token, so new accounts appeared logged out.
- Missing import crashed `GET /users/me` when the user was not found.

### Removed
- Dead code and self-referencing `file:` dependencies.
- Winston file logging (replaced by pino).

## [0.1.0] - 2026-07-01

### Added
- Governance baseline, CI hardening, and README professionalization updates.
