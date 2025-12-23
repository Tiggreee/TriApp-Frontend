# Renata's Finder 🎀

A vibrant, kid-friendly web app built for Renata (age 4-6) to discover music, explore magical colors, and create unique avatars. Features voice search, favorites, and a unicorn-themed help system!

## ✨ Features

- **🎵 Música**: Search and preview songs using iTunes API
- **🎨 Colores**: Discover colors with their names and codes using The Color API
- **😊 Avatares**: Generate personalized avatars with DiceBear API
- **💄 Maquillaje**: 6 makeup tutorials with step-by-step guides and YouTube links
- **💡 Consejos**: 8 daily beauty and wellness tips with resource links
- **⭐ Favoritos**: Save favorite items (music, colors, avatars, tutorials, tips)
- **🕘 Historial**: Track recent searches (max 10 per feature)
- **🎤 Búsqueda por Voz**: Hands-free music search (Spanish)
- **🌗 Tema**: Switch between light and dark modes (persisted)
- **👤 Autenticación**: User registration and login with JWT
- **❓ Ayuda**: Interactive unicorn-themed guide for all features

## 🛠️ Tech Stack

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

## 🌐 Demo

- Visita el frontend en producción: https://tri-app-frontend.vercel.app/music

## 📌 Alcance de la entrega

- Este proyecto fue presentado **solo como frontend**. El backend se implementará en un repositorio separado.

## 🚀 Getting Started

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
```

## 🔌 External APIs

1. **iTunes Search API** - Music search and previews
2. **The Color API** - Color information and harmonies
3. **DiceBear Avatars API** - SVG avatar generation

## 🎨 Design System

- Gradient theme: pink (#ff6b9d) → turquoise (#4ecdc4) → purple (#667eea)
- Responsive mobile-first design
- CSS Modules for component scoping
- Custom scrollbars (6px, diffuse pink, 0.3 opacity)
- Smooth animations (pop, fade, scale)
- Theme-aware palette (light/dark modes)

## 🚀 Deployment

**Frontend**: [Vercel](https://tri-app-frontend.vercel.app/music)
- Auto-deploys from `main` branch
- Live at: https://tri-app-frontend.vercel.app/music

**Backend**: [Render.com](https://triapp-backend.onrender.com)
- Node.js + Express + MongoDB Atlas
- API documentation: [Triapp-Backend](https://github.com/Tiggreee/Triapp-Backend)
- Live at: https://triapp-backend.onrender.com

## 🧑‍💻 Development

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

## 📝 Code Quality

- No development comments in source code
- Semantic git commits (feat, fix, docs, chore, style)
- CSS Modules eliminate style conflicts
- Clean codebase following React best practices
- Spanish text for UI; clear English for code

## 🗺️ Next Steps (Stage 4)

- [ ] Logout button in Header
- [ ] Display username when logged in
- [ ] Sync favorites with backend API
- [ ] OAuth integration (Microsoft/Google)
- [ ] Admin dashboard for user analytics

## 👨‍💻 Built By

Victor for Renata 🦄
