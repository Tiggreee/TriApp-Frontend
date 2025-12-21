import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const musicLabel = '\u{1F3B5} Music';
const colorsLabel = '\u{1F3A8} Colores';
const avatarLabel = '\u{1F984} Avatar';
const moon = '\u{1F319}';
const sun = '\u2600\uFE0F';

export function Header({ onToggleTheme, theme }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.title}>✨ Renata's Finder ✨</div>
        <nav className={styles.nav}>
          <NavLink to="/music" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>{musicLabel}</NavLink>
          <NavLink to="/colors" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>{colorsLabel}</NavLink>
          <NavLink to="/avatar" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>{avatarLabel}</NavLink>
        </nav>
        <button className={styles.theme} onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? moon : sun}
        </button>
      </div>
    </header>
  );
}
