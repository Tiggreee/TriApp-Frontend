import styles from './HelpModal.module.css';

export function HelpModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close help">
          X
        </button>
        <h2 className={styles.title}>Ayuda de Renata</h2>
        <div className={styles.content}>
          <p><strong>Music:</strong> Busca tus canciones favoritas y escucha previews</p>
          <p><strong>Colores:</strong> Descubre colores magicos con sus nombres y codigos</p>
          <p><strong>Avatar:</strong> Crea tu propio personaje escribiendo tu nombre</p>
          <p><strong>Favoritos:</strong> Guarda tus cosas favoritas con la estrella</p>
          <p><strong>Recientes:</strong> Ve tu historial de busquedas</p>
          <p><strong>Voz:</strong> Usa el microfono para buscar (Music)</p>
          <p><strong>Tema:</strong> Cambia entre modo claro y oscuro</p>
        </div>
      </div>
    </div>
  );
}
