# Renata's Finder 🎀

A vibrant, kid-friendly web app built for Renata (age 4-6) to discover music, explore magical colors, and create unique avatars. Features voice search, favorites, and a unicorn-themed help system!

## ✨ Features

- **🎵 Music**: Search and preview songs using iTunes API
- **🎨 Magical Colors**: Discover colors with their names and codes using The Color API
- **😊 Avatar Creator**: Generate personalized avatars with DiceBear API
- **⭐ Favorites**: Save favorite items (music, colors, avatars)
- **🕘 History**: Track recent searches (max 10 per feature)
- **🎤 Voice Search**: Hands-free music search (Spanish)
- **🌗 Theme Toggle**: Switch between light and dark modes (persisted)
- **❓ Help Modal**: Interactive unicorn-themed guide

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **CSS Modules** - Scoped styling
- **localStorage** - Data persistence

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation + theme toggle
│   └── HelpModal.jsx        # Help overlay
├── pages/
│   ├── Music.jsx            # iTunes music search
│   ├── Colors.jsx           # Color explorer
│   └── Avatar.jsx           # Avatar generator
├── features/music/
│   ├── api.js               # iTunes API
│   └── components/          # SearchBar, TrackCard, Results
├── hooks/
│   ├── useVoiceSearch.js    # SpeechRecognition logic
│   └── useFeatureHistory.js # History/favorites management
├── utils/
│   └── searchUtils.js       # localStorage helpers
├── App.jsx                  # Root + routing
├── index.css                # Global styles + CSS variables
└── main.jsx                 # Entry point
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

## 🔌 APIs Used

1. **iTunes Search API** - Music search and previews
2. **The Color API** - Color information and palettes
3. **DiceBear Avatars API** - SVG avatar generation

## 🎨 Design Highlights

- Vibrant gradients and smooth animations
- Responsive mobile-first design
- Custom unicorn favicon
- Theme-aware color palette (CSS variables)
- Emoji-based navigation

## 🧑‍💻 Development Notes

- Originally built with TypeScript, converted to JavaScript for simplicity
- Custom hooks eliminate code duplication (~120 lines saved)
- Git workflow: Feature branches → PR → main
- Admin reset button (para pruebas de trials) está oculto por defecto. Para mostrarlo:
	1) Abre `src/App.jsx`
	2) Cambia `const SHOW_ADMIN_RESET = false;` a `true`
	3) Ejecuta `npm run dev` o `npm run build` según corresponda

## 🗺️ Roadmap (BACKLOG.md)

- Error boundaries
- Loading skeletons
- Search debouncing
- Performance optimization (memoization)
- ⏳ Backend integration (Node.js + MongoDB) - *Pending*

## ⚠️ Nota Importante

Este proyecto está **en construcción** y próximamente contará con un backend en un repositorio separado. Se añadirán las siguientes funcionalidades:

- 🔐 **Autenticación y Registro**: Sistema de login con JWT + OAuth (Google/Microsoft)
- 💎 **Características Premium**: Desbloqueo completo del tema oscuro, micrófono y favoritos
- 📚 **Nuevas Páginas Premium**: Consejos (Affirmations) y Maquillaje (Makeup)
- ☁️ **API REST**: Endpoints para usuarios, favoritos y historial persistente
- 🚀 **Despliegue**: Servidor en Google Cloud con dominio personalizado y certificado HTTPS

**URL del Backend**: *Próximamente...*

---

Made with 💖 for Renata by Victor ✨
