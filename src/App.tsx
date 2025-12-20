import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import Music from './pages/Music';
import Weather from './pages/Weather';
import Pokedex from './pages/Pokedex';

function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: '16px' }}>
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
