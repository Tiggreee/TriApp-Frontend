import { useState } from 'react';
import { fetchPokemon, type Pokemon } from '../features/pokedex/api';
import { SearchBar } from '../features/pokedex/components/SearchBar';
import { Card } from '../features/pokedex/components/Card';

export default function Pokedex() {
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSearch(q: string) {
    setLoading(true);
    const p = await fetchPokemon(q);
    setData(p);
    setLoading(false);
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SearchBar onSearch={onSearch} />
      {loading && <div>Loading…</div>}
      {!loading && data && <Card data={data} />}
    </div>
  );
}
