import { useState } from 'react';
import styles from './SearchBar.module.css';

export function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

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
      <button type="submit" className={styles.button}>Search</button>
    </form>
  );
}
