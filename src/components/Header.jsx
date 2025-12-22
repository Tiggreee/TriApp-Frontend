import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header({ onToggleTheme, theme }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.title}>Renata's Finder</div>
        <nav className={styles.nav}>
          <NavLink to="/music" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            Music
          </NavLink>
          <NavLink to="/colors" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            Paletas
          </NavLink>
          <NavLink to="/avatar" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            Avatar
          </NavLink>
        </nav>
        <button className={styles.theme} onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
