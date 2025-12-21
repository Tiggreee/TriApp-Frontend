import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { HelpModal } from './components/HelpModal';
import Music from './pages/Music';
import Weather from './pages/Weather';
import Pokedex from './pages/Pokedex';
import './App.css';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) {
    return 'light';
  }
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore write failures
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className="app-container">
      <Header onToggleTheme={toggleTheme} theme={theme} />
      <main className="main-content">
        <Routes>
          <Route path="/music" element={<Music theme={theme} />} />
          <Route path="/weather" element={<Weather theme={theme} />} />
          <Route path="/pokedex" element={<Pokedex theme={theme} />} />
          <Route path="*" element={<Navigate to="/music" replace />} />
        </Routes>
      </main>

      <button className="help-button" onClick={() => setShowHelp(true)} aria-label="Need help from Renata?">
        ❓ Necesitas ayuda de Renata?
      </button>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;
