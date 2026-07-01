# Renata's Finder

## 🚀 **[VER PROYECTO EN VIVO →](https://tri-app-frontend.vercel.app/music)**

**Full-Stack Project**  
Frontend: [github.com/Tiggreee/TriApp-Frontend](https://github.com/Tiggreee/TriApp-Frontend)  
Backend: [github.com/Tiggreee/Triapp-Backend](https://github.com/Tiggreee/Triapp-Backend)

---

Full-stack web application for discovering music, exploring colors, generating avatars, and accessing beauty tutorials. Built with React 19, Vite, Node.js, and MongoDB.

## Para Recruiters / Hiring Managers

- Caso real de producto full stack con frontend desacoplado y backend dedicado.
- Pruebas claras de implementacion: autenticacion JWT, integracion de APIs externas y persistencia en MongoDB.
- Enfoque de entrega: UX usable, features iterables y despliegue continuo.
- Stack: React, Vite, Node.js, Express, MongoDB.

Contacto directo: WhatsApp +524341696576 (+52 434 169 6576)  
Portfolio: https://www.vmdev.lat  
GitHub: https://github.com/Tiggreee

## Features

- **Música**: Search and preview songs via iTunes API
- **Colores**: Discover color palettes and codes via The Color API
- **Avatares**: Generate personalized SVG avatars via DiceBear API
- **Maquillaje**: 6 makeup tutorials with step-by-step guides
- **Consejos**: 8 daily beauty and wellness tips
- **Favoritos**: Save favorites synced to backend (MongoDB)
- **Historial**: Recent search tracking (max 10 per feature)
- **Búsqueda por Voz**: Spanish voice search (SpeechRecognition API)
- **Tema**: Light/dark mode toggle with persistence
- **Autenticación**: JWT-based user registration and login
- **Logout**: Session management with username display

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **CSS Modules** - Scoped styling
- **localStorage** - Data persistence
- **JWT** - Authentication tokens
- **Node.js/Express** - Backend API (separate repo)

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Header.jsx                # Navigation + theme toggle
│   ├── HelpModal.jsx             # Help overlay
│   ├── AuthModal.jsx             # Login/signup form
│   ├── TutorialModal.jsx         # Makeup tutorial details
│   ├── TipsModal.jsx             # Advice tips modal
│   └── Card.jsx                  # Reusable card component
├── pages/
│   ├── Music.jsx                 # iTunes music search
│   ├── Colors.jsx                # Color palette explorer
│   ├── Avatar.jsx                # Avatar generator
│   ├── Makeup.jsx                # Makeup tutorials page
│   └── Consejos.jsx              # Daily tips page
├── features/music/
│   ├── api.js                    # iTunes API service
│   └── components/               # SearchBar, TrackCard, Results
├── services/
│   └── authService.js            # Authentication helpers
├── hooks/
│   ├── useVoiceSearch.js         # SpeechRecognition logic
│   └── useFeatureHistory.js      # History/favorites management
├── utils/
│   └── searchUtils.js            # localStorage helpers
├── App.jsx                       # Root + routing + state
├── index.css                     # Global styles + CSS variables
└── main.jsx                      # Entry point
```

## Live Demo

Frontend: https://tri-app-frontend.vercel.app/music
Backend API: https://triapp-backend.onrender.com

## Repositories

- Frontend: https://github.com/Tiggreee/TriApp-Frontend
- Backend: https://github.com/Tiggreee/Triapp-Backend

## Getting Started

### Prerequisites
- Node.js 16+ & npm

### Installation

```bash
# Clone repo
git clone https://github.com/Tiggreee/TriApp-Frontend.git
cd TriApp-Frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```External APIs

- iTunes Search API: Music search and previews
- The Color API: Color information and harmonies
- DiceBear Avatars API: SVG avatar generation

##DiceBear Avatars API** - SVG avatar generation

## 🎨 Design System

- Gradient theme: pink (#ff6b9d) → turquoise (#4ecdc4) → purple (#667eea)
- Responsive mobile-first design
- CSS Modules for component scoping
- Custom scrollbars (6px, diffuse pink, 0.3 opacity)
- Smooth animations (pop, fade, scale)
- Theme-aware palette (light/dark modes)

## Deployment

**Frontend (Vercel)**
- Auto-deploys from main branch
- URL: https://tri-app-frontend.vercel.app/music

**Backend (Render)**
- Node.js + Express + MongoDB Atlas
- URL: https://triapp-backend.onrender.com
- Repository: https://github.com/Tiggreee/Triapp-Backend

## Development

```bash
# Clone and install
git clone https://github.com/Tiggreee/TriApp-Frontend.git
cd TriApp-Frontend
npm install

# Development server
npm run dev
# Opens http://localhost:5173

# Production build
npm run build
# Output in dist/
```

## Code Quality

- No development comments in source code
- Semantic git commits (feat, fix, docs, chore, style)
- CSS Modules for component scoping
- React 19 best practices
- Spanish UI text, English code

## Built By

Victor - TripleTen Web Development Bootcamp Final Project

---

## 🚀 **[VER PROYECTO EN VIVO →](https://tri-app-frontend.vercel.app/music)**

**Full-Stack Repositories**  
Frontend: [github.com/Tiggreee/TriApp-Frontend](https://github.com/Tiggreee/TriApp-Frontend)  
Backend: [github.com/Tiggreee/Triapp-Backend](https://github.com/Tiggreee/Triapp-Backend)
