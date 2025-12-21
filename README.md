# Renata's Finder í¶„

A vibrant, kid-friendly web app built for Renata (age 4-6) to discover music, explore magical colors, and create unique avatars. Features voice search, favorites, and a unicorn-themed help system!

## âœ¨ Features

- **í¾µ Music**: Search and preview songs using iTunes API
- **í¾¨ Magical Colors**: Discover colors with their names and codes using The Color API
- **í¶„ Avatar Creator**: Generate personalized avatars with DiceBear API
- **â­ Favorites**: Save favorite items (music, colors, avatars)
- **í³œ History**: Track recent searches (max 10 per feature)
- **í¾¤ Voice Search**: Hands-free music search (Spanish)
- **í¼™ Theme Toggle**: Switch between light and dark modes (persisted)
- **â“ Help Modal**: Interactive unicorn-themed guide

## í» ï¸ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **CSS Modules** - Scoped styling
- **localStorage** - Data persistence

## í³ Project Structure

```
src/
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Header.jsx          # Navigation + theme toggle
â”‚   â””â”€â”€ HelpModal.jsx        # Help overlay
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ Music.jsx            # iTunes music search
â”‚   â”œâ”€â”€ Colors.jsx           # Color explorer
â”‚   â””â”€â”€ Avatar.jsx           # Avatar generator
â”œâ”€â”€ features/music/
â”‚   â”œâ”€â”€ api.js               # iTunes API
â”‚   â””â”€â”€ components/          # SearchBar, TrackCard, Results
â”œâ”€â”€ hooks/
â”‚   â”œâ”€â”€ useVoiceSearch.js    # SpeechRecognition logic
â”‚   â””â”€â”€ useFeatureHistory.js # History/favorites management
â”œâ”€â”€ utils/
â”‚   â””â”€â”€ searchUtils.js       # localStorage helpers
â”œâ”€â”€ App.jsx                  # Root + routing
â”œâ”€â”€ index.css                # Global styles + CSS variables
â””â”€â”€ main.jsx                 # Entry point
```

## íº€ Getting Started

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

## í¾¯ APIs Used

1. **iTunes Search API** - Music search and previews
2. **The Color API** - Color information and palettes
3. **DiceBear Avatars API** - SVG avatar generation

## í¾¨ Design Highlights

- Vibrant gradients and smooth animations
- Responsive mobile-first design
- Custom unicorn favicon
- Theme-aware color palette (CSS variables)
- Emoji-based navigation

## í³ Development Notes

- Originally built with TypeScript, converted to JavaScript for simplicity
- Custom hooks eliminate code duplication (~120 lines saved)
- Git workflow: Feature branches â†’ PR â†’ main

## í´® Roadmap (BACKLOG.md)

- Error boundaries
- Loading skeletons
- Search debouncing
- Performance optimization (memoization)
- Backend integration (Node.js + MongoDB)

## í³„ License

MIT

---

Made with í²– for Renata
