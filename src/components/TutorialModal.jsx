import styles from './TutorialModal.module.css';

export function TutorialModal({ tutorial, onClose }) {
  if (!tutorial) return null;

  const getTutorialLink = (title) => {
    const links = {
      'Smokey Eyes Perfecto': 'https://www.youtube.com/results?search_query=smokey+eyes+tutorial',
      'Base Impecable': 'https://www.youtube.com/results?search_query=base+makeup+tutorial',
      'Labios Nude': 'https://www.youtube.com/results?search_query=nude+lips+tutorial',
      'Manicura en Casa': 'https://www.youtube.com/results?search_query=diy+manicure+tutorial',
      'Contorno Facial': 'https://www.youtube.com/results?search_query=contouring+tutorial',
      'Glitter Party': 'https://www.youtube.com/results?search_query=glitter+makeup+tutorial'
    };
    return links[title] || 'https://www.youtube.com';
  };

  const steps = {
    'Smokey Eyes Perfecto': [
      'Aplica base de sombra en todo el párpado',
      'Usa una sombra gris oscuro en el pliegue',
      'Difumina bien los bordes',
      'Aplica negro en la línea superior',
      'Termina con un iluminador en la parte interna'
    ],
    'Base Impecable': [
      'Hidrata tu piel con primer',
      'Aplica base con una esponja húmeda',
      'Cubre con polvo translúcido',
      'Fija con spray setting',
      '¡Listo para 12+ horas!'
    ],
    'Labios Nude': [
      'Exfolia tus labios suavemente',
      'Hidrata con bálsamo labial',
      'Aplica el labial nude elegido',
      'Perfilador opcional para mayor precisión',
      'Top coat para durabilidad'
    ],
    'Manicura en Casa': [
      'Empuja las cutículas hacia atrás',
      'Lija las uñas en forma ovalada',
      'Aplica base protectora',
      'Dos capas de esmalte color',
      'Sella con top coat brillante'
    ],
    'Contorno Facial': [
      'Elige un contorno 2 tonos más oscuro',
      'Aplica en los lados de la nariz',
      'Sombrea los laterales del rostro',
      'Difumina bien para un efecto natural',
      'Resalta con iluminador en puntos altos'
    ],
    'Glitter Party': [
      'Aplica sombra pegajosa como base',
      'Usa dedos para aplicar glitter',
      'Presiona firmemente para que se adhiera',
      'Combina con delineador dramático',
      'Sella con spray fijador fuerte'
    ]
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          X
        </button>

        <div className={styles.header}>
          <span className={styles.emoji}>{tutorial.emoji}</span>
          <h2 className={styles.title}>{tutorial.title}</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>{tutorial.description}</p>

          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <strong>Dificultad:</strong>
              <span className={styles.difficulty}>{tutorial.difficulty}</span>
            </div>
            <div className={styles.metaItem}>
              <strong>Tiempo:</strong>
              <span>{tutorial.time}</span>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.steps}>
            <h3>📋 Pasos:</h3>
            <ol>
              {(steps[tutorial.title] || []).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.tips}>
            <h3>💡 Tip Mágico:</h3>
            <p>¡La práctica hace al maestro! No desistas si el primer intento no es perfecto. Cada día mejorarás tu técnica. 🦄</p>
          </div>

          <a
            href={getTutorialLink(tutorial.title)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            ▶️ Ver Tutorial en YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
