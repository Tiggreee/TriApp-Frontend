import { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TutorialModal } from '../components/TutorialModal';
import styles from './Makeup.module.css';

export default function Makeup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const categories = [
    { id: 'all', name: 'Todos', emoji: '💄' },
    { id: 'eyes', name: 'Ojos', emoji: '👁️' },
    { id: 'lips', name: 'Labios', emoji: '💋' },
    { id: 'face', name: 'Rostro', emoji: '✨' },
    { id: 'nails', name: 'Uñas', emoji: '💅' }
  ];

  const makeupTutorials = [
    {
      id: 1,
      title: 'Smokey Eyes Perfecto',
      category: 'eyes',
      emoji: '🌙',
      description: 'Aprende a crear un smokey eye profesional en 5 pasos',
      difficulty: 'Intermedio',
      time: '15 min'
    },
    {
      id: 2,
      title: 'Base Impecable',
      category: 'face',
      emoji: '✨',
      description: 'Técnicas para una base perfecta y duradera',
      difficulty: 'Básico',
      time: '10 min'
    },
    {
      id: 3,
      title: 'Labios Nude',
      category: 'lips',
      emoji: '💋',
      description: 'Los mejores tonos nude para cada tipo de piel',
      difficulty: 'Básico',
      time: '5 min'
    },
    {
      id: 4,
      title: 'Manicura en Casa',
      category: 'nails',
      emoji: '💅',
      description: 'Diseños de uñas simples pero elegantes',
      difficulty: 'Básico',
      time: '20 min'
    },
    {
      id: 5,
      title: 'Contorno Facial',
      category: 'face',
      emoji: '🎨',
      description: 'Domina el arte del contour en minutos',
      difficulty: 'Intermedio',
      time: '12 min'
    },
    {
      id: 6,
      title: 'Glitter Party',
      category: 'eyes',
      emoji: '✨',
      description: 'Looks deslumbrantes con glitter para fiestas',
      difficulty: 'Intermedio',
      time: '18 min'
    }
  ];

  const filteredTutorials = makeupTutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (!history.includes(searchTerm)) {
        setHistory(prev => [searchTerm, ...prev].slice(0, 5));
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 style={{ color: 'var(--text-primary)' }}>💄 Tutoriales de Maquillaje</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <Input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busca tutoriales de maquillaje..."
        />
        <Button text="🔍 Buscar" />
      </form>

      <div className={styles.categories}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className={styles.history}>
          <h3>🕒 Búsquedas recientes:</h3>
          <div className={styles.historyList}>
            {history.map((term, idx) => (
              <button
                key={idx}
                className={styles.historyItem}
                onClick={() => setSearchTerm(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map(tutorial => (
            <Card 
              key={tutorial.id} 
              className={styles.card}
              onClick={() => setSelectedTutorial(tutorial)}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.emoji}>{tutorial.emoji}</span>
                  <button
                    className={`${styles.favoriteBtn} ${favorites.includes(tutorial.id) ? styles.favorited : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tutorial.id);
                    }}
                    aria-label="Agregar a favoritos"
                  >
                    ⭐
                  </button>
                </div>
                <h3 className={styles.title}>{tutorial.title}</h3>
                <p className={styles.description}>{tutorial.description}</p>
                <div className={styles.metadata}>
                  <span className={styles.difficulty}>{tutorial.difficulty}</span>
                  <span className={styles.time}>⏱️ {tutorial.time}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className={styles.empty}>
            <p>No encontramos tutoriales que coincidan con tu búsqueda 💔</p>
          </div>
        )}
      </div>

      {selectedTutorial && (
        <TutorialModal tutorial={selectedTutorial} onClose={() => setSelectedTutorial(null)} />
      )}
    </div>
  );
}
