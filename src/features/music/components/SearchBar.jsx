import { useState } from 'react';

export function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  function submit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
      <input
        type="text"
        placeholder="Search songs or artists"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ flex: 1, padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: 6 }}
      />
      <button type="submit" style={{ padding: '8px 12px', borderRadius: 6 }}>Search</button>
    </form>
  );
}
