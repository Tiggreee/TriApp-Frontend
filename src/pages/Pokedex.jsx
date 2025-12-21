import { useEffect, useState } from 'react';
import { fetchPokemon } from '../features/pokedex/api';
import { SearchBar } from '../features/pokedex/components/SearchBar';
import { Card } from '../features/pokedex/components/Card';
import { addHistory, loadList, toggleFavorite } from '../utils/searchUtils';
import styles from './Music.module.css';

const HISTORY_KEY = 'pokedex-history';
const FAV_KEY = 'pokedex-favs';

export default function Pokedex() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setHistory(loadList(HISTORY_KEY));
    setFavorites(loadList(FAV_KEY));
  }, []);

  async function onSearch(q) {
    if (!q) return;
    setLoading(true);
    const p = await fetchPokemon(q);
    setData(p);
    setLoading(false);
    setHistory(addHistory(HISTORY_KEY, q));
  }

  function onFav(p) {
    if (!p) return;
    const next = toggleFavorite(FAV_KEY, p, (x) => x.id);
    setFavorites(next);
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <SearchBar onSearch={onSearch} />
      </div>
      {loading && <div className={styles.loading}>Loading...</div>}
      {!loading && data && <Card data={data} onFav={onFav} isFav={favorites.some((f) => f.id === data.id)} />}
      {!loading && !data && <div style={{ textAlign: 'center', padding: '40px', color: '#636e72' }}>Search for a Pokémon by name!</div>}

      <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
        <div>
          <strong>Recent Pokémon:</strong>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {history.length === 0 && <span style={{ color: '#636e72' }}>Empty</span>}
            {history.map((q) => (
              <button key={q} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e5e7eb', background: 'white' }} onClick={() => onSearch(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
        <div>
          <strong>Favorites:</strong>
          <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
            {favorites.length === 0 && <span style={{ color: '#636e72' }}>No favorites yet</span>}
            {favorites.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: 8, borderRadius: 10, border: '1px solid #e5e7eb' }}>
                {p.sprite && <img src={p.sprite} alt={p.name} width={50} height={50} />}
                <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{p.name}</div>
                <div style={{ color: '#636e72' }}>{p.types.join(', ')}</div>
                <button onClick={() => onFav(p)} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', fontSize: 18 }}>★</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
