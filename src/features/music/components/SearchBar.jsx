import { useState } from 'react';
import { useVoiceSearch } from '../../../hooks/useVoiceSearch';
import styles from './SearchBar.module.css';

export function SearchBar({ onSearch, lockedVoice = false }) {
  const [value, setValue] = useState('');
  
  const { isSupported, startListening } = useVoiceSearch('es-ES', (text) => {
    setValue(text);
    onSearch(text);
  });

  function submit(e) {
    e.preventDefault();
    onSearch(value.trim());
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
      {isSupported && (
        <button
          type="button"
          className={`${styles.voice} ${lockedVoice ? styles.locked : ''}`}
          onClick={startListening}
          aria-label="Voice search"
          disabled={lockedVoice}
        >
          MIC
        </button>
      )}
      <button type="submit" className={styles.button}>Search</button>
    </form>
  );
}
