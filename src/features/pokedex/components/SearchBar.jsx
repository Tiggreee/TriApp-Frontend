import { useState } from 'react';
import { useVoiceSearch } from '../../../hooks/useVoiceSearch';

export function SearchBar({ onSearch }) {
  const [v, setV] = useState('');
  
  const { isSupported, startListening } = useVoiceSearch('en-US', (text) => {
    setV(text);
    onSearch(text);
  });

  function submit(e) {
    e.preventDefault();
    onSearch(v);
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Search"
        style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--card)', color: 'var(--text-primary)' }}
      />
      {isSupported && <button type="button" onClick={startListening} style={{ padding: '8px 12px', borderRadius: 6, background: '#4ecdc4', color: 'white' }}>MIC</button>}
      <button type="submit" style={{ padding: '8px 12px', borderRadius: 6 }}>Search</button>
    </form>
  );
}
