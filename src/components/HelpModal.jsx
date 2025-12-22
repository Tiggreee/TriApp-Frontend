import styles from './HelpModal.module.css';

export function HelpModal({ onClose }) {
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
              <strong className={styles.sectionTitle}>Music</strong>
              <p>Encuentra tus canciones favoritas y escucha previews mágicos. ¡Usa el micrófono para buscar con tu voz! 🎤</p>
            </div>
          </div>
          
          <div className={styles.section}>
            <span className={styles.emoji}>🎨</span>
            <div>
              <strong className={styles.sectionTitle}>Paletas</strong>
              <p>Genera paletas de colores mágicas con 5 armonías diferentes. Copia los códigos con un click. 🌟</p>
            </div>
          </div>
          
          <div className={styles.section}>
            <span className={styles.emoji}>😊</span>
            <div>
              <strong className={styles.sectionTitle}>Avatar</strong>
              <p>Crea tu avatar personalizado escribiendo tu nombre. ¡Elige entre 6 estilos diferentes! ✨</p>
            </div>
          </div>
          
          <div className={styles.promo}>
            <strong>💎 Desbloquea la magia completa:</strong>
            <p>Regístrate en segundos y activa el <em>modo oscuro</em>, el <em>micrófono</em> y los <em>favoritos</em>. Accede a temas exclusivos y sorpresas de unicornio. ¡Es rápido y gratuito!</p>
          </div>

          <div className={styles.divider}></div>
          
          <div className={styles.tips}>
            <p><strong>⭐ Favoritos:</strong> Guarda lo que amas con la estrella dorada</p>
            <p><strong>🕒 Recientes:</strong> Revisa tu historial de búsquedas</p>
            <p><strong>🌙 Tema:</strong> Cambia entre modo claro y oscuro</p>
          </div>
          
          <div className={styles.footer}>
            🌈 Creado con magia de unicornio para Renata 🦄
          </div>
        </div>
      </div>
    </div>
  );
}
