import { useState } from 'react';
import { searchTracks } from '../features/music/api';
import { SearchBar } from '../features/music/components/SearchBar';
import { Results } from '../features/music/components/Results';
import { useFeatureHistory } from '../hooks/useFeatureHistory';
import styles from './Music.module.css';

const HISTORY_KEY = 'music-history';
const FAV_KEY = 'music-favs';

export default function Music() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { history, favorites, addToHistory, toggleFav, isFavorite } = useFeatureHistory(
    HISTORY_KEY,
    FAV_KEY,
    (t) => t.trackId
  );

  async function onSearch(query) {
    if (!query) return;
    setLoading(true);
    const data = await searchTracks(query);
    setItems(data);
    setLoading(false);
    addToHistory(query);
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <SearchBar onSearch={onSearch} />
      </div>
      {loading ? <div className={styles.loading}>Loading...</div> : <Results items={items} onFav={toggleFav} favorites={favorites} />}

      <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
        <div>
          <strong>Recent searches:</strong>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {history.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Empty</span>}
            {history.map((q) => (
              <button
                key={q}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'var(--text-primary)',
                }}
                onClick={() => onSearch(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <div>
          <strong>Favorites:</strong>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            {favorites.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No favorites yet</span>}
            {favorites.map((t) => (
              <div
                key={t.trackId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--card)',
                  padding: 8,
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                }}
              >
                <img src={t.artworkUrl100} alt={t.trackName} width={40} height={40} style={{ borderRadius: 6 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{t.trackName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t.artistName}</div>
                </div>
                <button onClick={() => toggleFav(t)} style={{ border: 'none', background: 'transparent', fontSize: 18, color: 'var(--text-primary)' }}>★</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
