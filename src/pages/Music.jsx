import { useState, useEffect } from 'react';
import { searchTracks } from '../features/music/api';
import { SearchBar } from '../features/music/components/SearchBar';
import { Results } from '../features/music/components/Results';
import { useFeatureHistory } from '../hooks/useFeatureHistory';
import { getFavorites, addFavorite, removeFavorite } from '../services/favoritesService';
import styles from './Music.module.css';

const HISTORY_KEY = 'music-history';
const FAV_KEY = 'music-favs';

export default function Music({ isRegistered = false, user = null }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { history, favorites, addToHistory, toggleFav, isFavorite } = useFeatureHistory(
    HISTORY_KEY,
    FAV_KEY,
    (t) => t.trackId
  );

  useEffect(() => {
    if (user) {
      loadBackendFavorites();
    }
  }, [user]);

  async function loadBackendFavorites() {
    const backendFavs = await getFavorites();
    const musicFavs = backendFavs.filter(fav => fav.type === 'music');
    if (musicFavs.length > 0) {
      const ids = musicFavs.map(fav => fav.data.trackId);
      localStorage.setItem(FAV_KEY, JSON.stringify(ids));
    }
  }

  async function onSearch(query) {
    if (!query) return;
    setLoading(true);
    const data = await searchTracks(query);
    setItems(data);
    setLoading(false);
    addToHistory(query);
  }

  async function handleFavToggle(track) {
    const isFav = isFavorite(track.trackId);
    
    if (isFav) {
      if (user) {
        const backendFavs = await getFavorites();
        const toDelete = backendFavs.find(fav => fav.type === 'music' && fav.data.trackId === track.trackId);
        if (toDelete) {
          await removeFavorite(toDelete._id);
        }
      }
    } else {
      if (user) {
        await addFavorite('music', track);
      }
    }
    
    toggleFav(track.trackId);
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <SearchBar onSearch={onSearch} lockedVoice={!isRegistered} />
      </div>
      {loading ? <div className={styles.loading}>Loading...</div> : <Results items={items} onFav={handleFavToggle} favorites={favorites} lockedFav={!isRegistered} />}

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
        <div className={!isRegistered ? styles.blurLock : ''}>
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
                <button onClick={() => toggleFav(t)} style={{ border: 'none', background: 'transparent', fontSize: 18, color: 'var(--text-primary)' }} disabled={!isRegistered}>★</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
