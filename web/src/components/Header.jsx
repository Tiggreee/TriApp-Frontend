import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header({ onToggleTheme, theme, locked = false, user = null, onLogout = null }) {
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
            🎵 Música
          </NavLink>
          <NavLink to="/colors" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            🎨 Colores
          </NavLink>
          <NavLink to="/avatar" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
            🦄 Avatares
          </NavLink>
          {user && (
            <>
              <NavLink to="/makeup" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
                💄 Maquillaje
              </NavLink>
              <NavLink to="/consejos" className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
                💡 Consejos
              </NavLink>
            </>
          )}
        </nav>
        
        <div className={styles.right}>
          {user && (
            <div className={styles.userSection}>
              <span className={styles.username}>{user.name}</span>
              {onLogout && (
                <button 
                  className={styles.logoutBtn}
                  onClick={onLogout}
                  aria-label="Logout"
                >
                  Salir
                </button>
              )}
            </div>
          )}
          
          <button className={`${styles.theme} ${locked ? styles.locked : ''}`} onClick={onToggleTheme} aria-label="Toggle theme" disabled={locked}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
}
