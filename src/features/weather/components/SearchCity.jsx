import { useState } from 'react';

export function SearchCity({ onSearch }) {
  const [v, setV] = useState('');
  function submit(e) {
    e.preventDefault();
    onSearch(v.trim());
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Search city" style={{ flex: 1, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6 }} />
      <button type="submit" style={{ padding: '8px 12px', borderRadius: 6 }}>Search</button>
    </form>
  );
}
