import styles from './HelpModal.module.css';

const uc = String.fromCodePoint(0x1F984);

export function HelpModal({ onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>Unicorn Guide by Renata {uc}</div>
          <button className={styles.close} onClick={onClose} aria-label="Close help">✖</button>
        </div>
        <div className={styles.body}>
          <ul>
            <li>🎵 Music: busca artistas o canciones.</li>
            <li>🌦️ Weather: ciudad y clima.</li>
            <li>🦄 Pokédex: encuentra Pokémon.</li>
            <li>⭐ Favoritos: guarda top items.</li>
            <li>🕒 Recientes: último buscado.</li>
            <li>🎙️ Voz: búsqueda por voz.</li>
            <li>🌓 Tema: modo claro/oscuro.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}