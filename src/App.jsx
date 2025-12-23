import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { HelpModal } from './components/HelpModal';
import Music from './pages/Music';
import Colors from './pages/Colors';
import Avatar from './pages/Avatar';
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [toast, setToast] = useState(null);
  const trialTimeoutRef = useRef();

  const TRIAL_MS = 5 * 60 * 1000;
  const MAX_TRIALS_PER_DAY = 3;
  const SHOW_ADMIN_RESET = false;

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function loadTrial() {
    try {
      const raw = window.localStorage.getItem('trialData');
      if (!raw) return { date: todayKey(), count: 0, activeUntil: 0 };
      const parsed = JSON.parse(raw);
      if (parsed.date !== todayKey()) return { date: todayKey(), count: 0, activeUntil: 0 };
      return parsed;
    } catch {
      return { date: todayKey(), count: 0, activeUntil: 0 };
    }
  }

  function saveTrial(data) {
    try { window.localStorage.setItem('trialData', JSON.stringify(data)); } catch {}
  }

  function scheduleExpiry(untilTs) {
    if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
    const ms = Math.max(0, untilTs - Date.now());
    if (ms > 0) {
      trialTimeoutRef.current = setTimeout(() => setIsRegistered(false), ms);
    }
  }

  useEffect(() => {
    const data = loadTrial();
    const active = Date.now() < data.activeUntil;
    setIsRegistered(active);
    if (active) scheduleExpiry(data.activeUntil);
  }, []);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), 5000);
  }

  function handleTrialToggle() {
    const data = loadTrial();
    const now = Date.now();
    const active = now < data.activeUntil;

    if (active) {
      data.activeUntil = 0;
      saveTrial(data);
      setIsRegistered(false);
      if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
      showToast('Premium de prueba desactivado');
      return;
    }

    if (data.count >= MAX_TRIALS_PER_DAY) {
      showToast('Has agotado tus 3 activaciones de hoy ✨');
      return;
    }

    data.count += 1;
    data.date = todayKey();
    data.activeUntil = now + TRIAL_MS;
    saveTrial(data);
    setIsRegistered(true);
    scheduleExpiry(data.activeUntil);
    showToast('Premium de prueba activado por 5 minutos 💎');
  }

  function resetTrials() {
    if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
    saveTrial({ date: todayKey(), count: 0, activeUntil: 0 });
    setIsRegistered(false);
    showToast('Contador de pruebas premium reiniciado');
  }
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('theme', theme);
    } catch (e) {
    }
  }, [theme]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (trialTimeoutRef.current) clearTimeout(trialTimeoutRef.current);
    saveTrial({ date: todayKey(), count: 0, activeUntil: 0 });
    setIsRegistered(false);
  }, []);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <div className="app-container">
      <Header onToggleTheme={toggleTheme} theme={theme} locked={!isRegistered} />
      <main className="main-content">
        <Routes>
          <Route path="/music" element={<Music isRegistered={isRegistered} />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/avatar" element={<Avatar />} />
          <Route path="*" element={<Navigate to="/music" replace />} />
        </Routes>
      </main>

      <button
        className={`trial-button ${isRegistered ? 'active' : ''}`}
        onClick={handleTrialToggle}
        aria-label={isRegistered ? 'Desactivar Premium de prueba' : 'Probar Premium'}
      >
        💎 {isRegistered ? 'Premium activo' : 'Probar Premium'}
      </button>

      {SHOW_ADMIN_RESET && (
        <button
          className="admin-reset"
          onClick={resetTrials}
          aria-label="Reiniciar contador de pruebas premium"
        >
          Reiniciar pruebas (admin)
        </button>
      )}

      <button className="help-button" onClick={() => setShowHelp(true)} aria-label="Need help from Renata?">
        🦄 ¿Necesitas ayuda de Renata?
      </button>

      {toast && <div className="toast">{toast}</div>}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;
