import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const musicLabel = '\u{1F3B5} Music';
const weatherLabel = '\u{1F326}\uFE0F Weather';
const pokedexLabel = '\u{1F984} Pok\u00E9dex';
const moon = '\u{1F319}';
const sun = '\u2600\uFE0F';

export function Header({ onToggleTheme, theme }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.title}>✨ Renata's Finder ✨</div>
        <nav className={styles.nav}>
          <NavLink to="/music" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>{musicLabel}</NavLink>
          <NavLink to="/weather" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>{weatherLabel}</NavLink>
          <NavLink to="/pokedex" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>{pokedexLabel}</NavLink>
        </nav>
        <button className={styles.theme} onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? moon : sun}
        </button>
      </div>
    </header>
  );
}
