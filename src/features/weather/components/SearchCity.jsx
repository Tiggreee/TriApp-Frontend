import { useEffect, useState } from 'react';

export function SearchCity({ onSearch }) {
  const [v, setV] = useState('');
  const [rec, setRec] = useState(null);

  useEffect(() => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Speech) {
      const r = new Speech();
      r.lang = 'es-ES';
      r.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setV(text);
        onSearch(text);
      };
      setRec(r);
    }
  }, [onSearch]);

  function submit(e) {
    e.preventDefault();
    onSearch(v.trim());
  }

  function handleVoice() {
    if (rec) rec.start();
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Search city"
        style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--card)', color: 'var(--text-primary)' }}
      />
      <button type="button" onClick={handleVoice} style={{ padding: '8px 12px', borderRadius: 6, background: '#4ecdc4', color: 'white' }}>MIC</button>
      <button type="submit" style={{ padding: '8px 12px', borderRadius: 6 }}>Search</button>
    </form>
  );
}
