import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.title}>‚ú® Renata's Finder ‚ú®</div>
        <nav className={styles.nav}>
          <NavLink to="/music" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Ìæµ Music</NavLink>
          <NavLink to="/weather" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Ìº§Ô∏è Weather</NavLink>
          <NavLink to="/pokedex" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Ì¥¥ Pok√©dex</NavLink>
        </nav>
      </div>
    </header>
  );
}
