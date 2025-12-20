import { useState } from 'react';
import { searchTracks, type Track } from '../features/music/api';
import { SearchBar } from '../features/music/components/SearchBar';
import { Results } from '../features/music/components/Results';

export default function Music() {
  const [items, setItems] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSearch(query: string) {
    if (!query) return;
    setLoading(true);
    const data = await searchTracks(query);
    setItems(data);
    setLoading(false);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SearchBar onSearch={onSearch} />
      {loading ? <div>Loading…</div> : <Results items={items} />}
    </div>
  );
}
