import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.title}>Tri App</div>
      <nav className={styles.nav}>
        <NavLink to="/music" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Music</NavLink>
        <NavLink to="/weather" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Weather</NavLink>
        <NavLink to="/pokedex" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>Pokédex</NavLink>
      </nav>
    </header>
  );
}
