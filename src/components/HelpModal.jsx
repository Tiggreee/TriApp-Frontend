import styles from './HelpModal.module.css';

const unicorn = String.fromCodePoint(0x1F984);

export function HelpModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close help">
          ‚úñ
        </button>
        <h2 className={styles.title}>{unicorn} Ayuda de Renata {unicorn}</h2>
        <div className={styles.content}>
          <p><strong>ÔøΩÔøΩ Music:</strong> Busca tus canciones favoritas y escucha previews</p>
          <p><strong>Ìæ® Colores:</strong> Descubre colores m√°gicos con sus nombres y c√≥digos</p>
          <p><strong>Ì∂Ñ Avatar:</strong> Crea tu propio personaje escribiendo tu nombre</p>
          <p><strong>‚≠ê Favoritos:</strong> Guarda tus cosas favoritas con la estrella</p>
          <p><strong>Ì≥ú Recientes:</strong> Ve tu historial de b√∫squedas</p>
          <p><strong>Ìæ§ Voz:</strong> Usa el micr√≥fono para buscar (Music)</p>
          <p><strong>Ìºô Tema:</strong> Cambia entre modo claro y oscuro</p>
        </div>
      </div>
    </div>
  );
}
