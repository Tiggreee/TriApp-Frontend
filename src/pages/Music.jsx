import { useState } from 'react';
import { searchTracks } from '../features/music/api';
import { SearchBar } from '../features/music/components/SearchBar';
import { Results } from '../features/music/components/Results';
import styles from './Music.module.css';

export default function Music() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function onSearch(query) {
    if (!query) return;
    setLoading(true);
    const data = await searchTracks(query);
    setItems(data);
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <SearchBar onSearch={onSearch} />
      </div>
      {loading ? <div className={styles.loading}>Loading...</div> : <Results items={items} />}
    </div>
  );
}
