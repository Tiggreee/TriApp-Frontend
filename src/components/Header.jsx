import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header({ onToggleTheme, theme, locked = false }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleWrap}>
          <div className={styles.title}>
            <span className={styles.titleSmall}>Renata’s...</span>
            <span className={styles.titleBig}>¡Finder!</span>
          </div>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/music" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            🎵 Music
          </NavLink>
          <NavLink to="/colors" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            🎨 Paletas
          </NavLink>
          <NavLink to="/avatar" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            😊 Avatar
          </NavLink>
        </nav>
        <button className={`${styles.theme} ${locked ? styles.locked : ''}`} onClick={onToggleTheme} aria-label="Toggle theme" disabled={locked}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
