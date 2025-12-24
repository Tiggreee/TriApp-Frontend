import { useEffect } from 'react';
import styles from './HelpModal.module.css';

export function HelpModal({ onClose, user = null }) {
  useEffect(() => {
    const modal = document.querySelector(`.${styles.content}`);
    if (modal) modal.scrollTop = 0;
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close help">
          X
        </button>
        <h2 className={styles.title}>🦄 Guía Mágica de Renata 🌈</h2>
        <div className={styles.content}>
          <div className={styles.section}>
            <span className={styles.emoji}>🎵</span>
            <div>
              <strong className={styles.sectionTitle}>Música</strong>
              <p>Encuentra tus canciones favoritas y escucha previews mágicos. 🎤 <em>Usa el micrófono para buscar con tu voz</em>!</p>
            </div>
          </div>
          
          <div className={styles.section}>
            <span className={styles.emoji}>🎨</span>
            <div>
              <strong className={styles.sectionTitle}>Colores</strong>
              <p>Genera paletas de colores mágicas con 5 armonías diferentes. Copia los códigos con un click. 🌟</p>
            </div>
          </div>
          
          <div className={styles.section}>
            <span className={styles.emoji}>😊</span>
            <div>
              <strong className={styles.sectionTitle}>Avatares</strong>
              <p>Crea tu avatar personalizado escribiendo tu nombre. ¡Elige entre 6 estilos diferentes! ✨</p>
            </div>
          </div>

          {user && (
            <>
              <div className={styles.section}>
                <span className={styles.emoji}>💄</span>
                <div>
                  <strong className={styles.sectionTitle}>Maquillaje</strong>
                  <p>Explora tutoriales de maquillaje mágico y encuentra productos que te encantarán. 💅</p>
                </div>
              </div>

              <div className={styles.section}>
                <span className={styles.emoji}>💡</span>
                <div>
                  <strong className={styles.sectionTitle}>Consejos</strong>
                  <p>Descubre consejos diarios de belleza, vida y bienestar. ¡Cada día una nueva magia! ✨</p>
                </div>
              </div>
            </>
          )}
          
          <div className={styles.promo}>
            {user ? (
              <strong>🦄 ¡Ya tienes la magia de unicornio!</strong>
            ) : (
              <strong>✨ Usuario básico - Inicia sesión para desbloquear todas las funciones</strong>
            )}
          </div>

          <div className={styles.divider}></div>
          
          <div className={styles.tips}>
            <p><strong>🎤 MIC:</strong> Para hacer búsqueda por voz.</p>
            <p><strong>⭐ Favoritos:</strong> Guarda lo que amas con un click en la estrella dorada.</p>
            <p><strong>🕒 Recientes:</strong> Revisa tu historial de búsquedas.</p>
            <p><strong>🌙 Tema:</strong> Cambia entre modo claro y oscuro.</p>
          </div>
          
          <div className={styles.footer}>
            🌈 Creado para ti con ayuda de Renata 🦄
          </div>
        </div>
      </div>
    </div>
  );
}
