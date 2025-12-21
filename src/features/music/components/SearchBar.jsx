import { useEffect, useState } from 'react';
import styles from './SearchBar.module.css';

export function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Speech) {
      const rec = new Speech();
      rec.lang = 'es-ES';
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setValue(text);
        onSearch(text);
      };
      setRecognition(rec);
    }
  }, [onSearch]);

  function submit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  function handleVoice() {
    if (recognition) recognition.start();
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <input
        type="text"
        placeholder="Search songs or artists..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={styles.input}
      />
      <button type="button" className={styles.voice} onClick={handleVoice} aria-label="Voice search">MIC</button>
      <button type="submit" className={styles.button}>Search</button>
    </form>
  );
}
