import styles from './TutorialModal.module.css';

export function TipsModal({ tip, onClose }) {
  if (!tip) return null;

  const getTipLink = (title) => {
    const links = {
      'Hidratación desde adentro': 'https://www.healthline.com/nutrition/water-intake-for-skin',
      'El poder de la risa': 'https://www.healthline.com/health/mental-health/laughter-is-good-medicine',
      'Rutina nocturna perfecta': 'https://www.healthline.com/health/sleep/best-sleep-schedule',
      'Aceptarte a ti misma': 'https://www.psychologytoday.com/us/basics/self-esteem',
      'Alimentos que iluminan': 'https://www.healthline.com/nutrition/foods-for-skin-health',
      'Meditación en 5 minutos': 'https://www.headspace.com/meditation',
      'Metas realistas': 'https://www.mindtools.com/pages/article/smart-goals.htm',
      'Brilla con confianza': 'https://www.psychologytoday.com/us/basics/confidence'
    };
    return links[title] || 'https://www.healthline.com';
  };

  const fullTips = {
    'Hidratación desde adentro': 'Beber agua suficiente es la base de una piel radiante. Tu piel refleja lo que bebes, así que ¡mantente hidratada! 💧',
    'El poder de la risa': 'La risa libera endorfinas, reduce el estrés y hasta mejora tu sistema inmunológico. ¡Ríe más, vive más feliz! 😊',
    'Rutina nocturna perfecta': 'Duerme 7-8 horas en un ambiente oscuro y fresco. Tu piel se regenera durante el sueño. ¡Que sea mágico! 🌙',
    'Aceptarte a ti misma': 'La verdadera belleza viene del interior. Cuando te aceptas y amas, eso brilla en tu rostro. Eres perfecta tal como eres. 🦄',
    'Alimentos que iluminan': 'Aguacate, arándanos, zanahorias y chocolates oscuros son aliados para tu piel. ¡Come con propósito! 🥗',
    'Meditación en 5 minutos': 'Cierra los ojos, respira profundo y deja que tus pensamientos pasen. 5 minutos diarios transforman tu día. 🧘',
    'Metas realistas': 'No intentes cambiar todo de una vez. Establece metas pequeñas, alcanzables y celebra cada logro. ¡Paso a paso! 🎯',
    'Brilla con confianza': 'La confianza es tu mejor accesorio. Camina derecha, sonríe genuinamente y cree en ti misma. ¡El mundo lo notará! ✨'
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          X
        </button>

        <div className={styles.header}>
          <span className={styles.emoji}>{tip.emoji}</span>
          <h2 className={styles.title}>{tip.title}</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>{tip.description}</p>

          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <strong>Por:</strong>
              <span>{tip.author}</span>
            </div>
            <div className={styles.metaItem}>
              <strong>Fecha:</strong>
              <span>{tip.date}</span>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.steps}>
            <h3>🌟 Consejo Completo:</h3>
            <p className={styles.fullTip}>{fullTips[tip.title] || tip.description}</p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.tips}>
            <h3>✨ Para Aplicar Hoy:</h3>
            <ul className={styles.actionList}>
              {tip.category === 'beauty' && (
                <>
                  <li>Empieza con un paso pequeño</li>
                  <li>Registra tus cambios</li>
                  <li>Sé consistente por 30 días</li>
                  <li>¡Celebra los resultados!</li>
                </>
              )}
              {tip.category === 'wellness' && (
                <>
                  <li>Encuentra tu momento del día</li>
                  <li>Crea un ambiente tranquilo</li>
                  <li>Sé amable contigo misma</li>
                  <li>Aumenta gradualmente</li>
                </>
              )}
              {tip.category === 'life' && (
                <>
                  <li>Escribe tus metas</li>
                  <li>Divide en pasos pequeños</li>
                  <li>Pide apoyo si lo necesitas</li>
                  <li>Celebra cada avance</li>
                </>
              )}
              {tip.category === 'confidence' && (
                <>
                  <li>Afirma algo positivo de ti</li>
                  <li>Haz algo que te asuste hoy</li>
                  <li>Aprecia tu progreso</li>
                  <li>¡Eres increíble!</li>
                </>
              )}
            </ul>
          </div>

          <a
            href={getTipLink(tip.title)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            🔗 Leer Más
          </a>
        </div>
      </div>
    </div>
  );
}
