import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import Music from './pages/Music';
import Weather from './pages/Weather';
import Pokedex from './pages/Pokedex';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/music" element={<Music />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="*" element={<Navigate to="/music" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
