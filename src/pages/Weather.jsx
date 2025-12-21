import { useState } from 'react';
import { searchLocations, fetchCurrentWeather } from '../features/weather/api';
import { SearchCity } from '../features/weather/components/SearchCity';
import { LocationList } from '../features/weather/components/LocationList';
import { useFeatureHistory } from '../hooks/useFeatureHistory';
import styles from './Music.module.css';

const HISTORY_KEY = 'weather-history';
const FAV_KEY = 'weather-favs';

export default function Weather() {
  const [items, setItems] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { history, favorites, addToHistory, toggleFav } = useFeatureHistory(
    HISTORY_KEY,
    FAV_KEY,
    (x) => x.id
  );

  async function onSearch(q) {
    if (!q) return;
    setLoading(true);
    const res = await searchLocations(q);
    setItems(res);
    setWeather(null);
    setLoading(false);
    addToHistory(q);
  }

  async function onPick(loc) {
    setLoading(true);
    const w = await fetchCurrentWeather(loc.latitude, loc.longitude);
    setWeather(w);
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <SearchCity onSearch={onSearch} />
      </div>
      {loading && <div className={styles.loading}>Loading...</div>}
      {!loading && <LocationList items={items} onPick={onPick} onFav={toggleFav} favorites={favorites} />}
      {weather && (
        <div style={{ marginTop: '24px', padding: '20px', background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)', borderRadius: '16px', color: 'white', boxShadow: '0 4px 16px rgba(78, 205, 196, 0.3)' }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}><strong>Temperature:</strong> {weather.temperature}°C</div>
          <div style={{ fontSize: '18px' }}><strong>Wind:</strong> {weather.windSpeed} m/s</div>
        </div>
      )}

      <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
        <div>
          <strong>Recent cities:</strong>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {history.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Empty</span>}
            {history.map((q) => (
              <button key={q} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text-primary)' }} onClick={() => onSearch(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
        <div>
          <strong>Favorite spots:</strong>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            {favorites.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No favorites yet</span>}
            {favorites.map((l) => (
              <div key={l.id} style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--card)', padding: 8, borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</div>
                <div style={{ color: 'var(--text-muted)' }}>{l.country || ''}</div>
                <button onClick={() => toggleFav(l)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', fontSize: 18, color: 'var(--text-primary)' }}>★</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
