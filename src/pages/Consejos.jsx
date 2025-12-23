import { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TipsModal } from '../components/TipsModal';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import styles from './Consejos.module.css';

export default function Consejos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedTip, setSelectedTip] = useState(null);

  const { isSupported: voiceSupported, startListening } = useVoiceSearch('es-ES', (text) => {
    setSearchTerm(text);
  });

  const categories = [
    { id: 'all', name: 'Todos', emoji: '💡' },
    { id: 'beauty', name: 'Belleza', emoji: '✨' },
    { id: 'wellness', name: 'Bienestar', emoji: '🧘' },
    { id: 'life', name: 'Vida', emoji: '🌟' },
    { id: 'confidence', name: 'Autoestima', emoji: '💪' }
  ];

  const tips = [
    {
      id: 1,
      title: 'Hidratación desde adentro',
      category: 'beauty',
      emoji: '💧',
      description: 'Beber 2 litros de agua diarios transforma tu piel en 30 días',
      author: 'Renata 🦄',
      date: 'Hoy'
    },
    {
      id: 2,
      title: 'El poder de la risa',
      category: 'life',
      emoji: '😊',
      description: 'Reír 10 minutos al día aumenta tu felicidad y bienestar',
      author: 'Renata 🦄',
      date: 'Ayer'
    },
    {
      id: 3,
      title: 'Rutina nocturna perfecta',
      category: 'wellness',
      emoji: '🌙',
      description: 'Crea una rutina de sueño que te ayude a despertar radiante',
      author: 'Renata 🦄',
      date: 'Ayer'
    },
    {
      id: 4,
      title: 'Aceptarte a ti misma',
      category: 'confidence',
      emoji: '🦄',
      description: 'La verdadera belleza comienza cuando aceptas quién eres',
      author: 'Renata 🦄',
      date: 'Hace 2 días'
    },
    {
      id: 5,
      title: 'Alimentos que iluminan',
      category: 'beauty',
      emoji: '🥗',
      description: 'Descubre alimentos naturales que dan brillo a tu piel',
      author: 'Renata 🦄',
      date: 'Hace 2 días'
    },
    {
      id: 6,
      title: 'Meditación en 5 minutos',
      category: 'wellness',
      emoji: '🧘',
      description: 'Técnicas rápidas de meditación para tu día ajetreado',
      author: 'Renata 🦄',
      date: 'Hace 3 días'
    },
    {
      id: 7,
      title: 'Metas realistas',
      category: 'life',
      emoji: '🎯',
      description: 'Cómo establecer metas que realmente puedas lograr',
      author: 'Renata 🦄',
      date: 'Hace 3 días'
    },
    {
      id: 8,
      title: 'Brilla con confianza',
      category: 'confidence',
      emoji: '✨',
      description: 'Pasos para construir una autoestima inquebrantable',
      author: 'Renata 🦄',
      date: 'Hace 4 días'
    }
  ];

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
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
      <h1 style={{ color: 'var(--text-primary)' }}>💡 Consejos Mágicos Diarios</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busca consejos de belleza y vida..."
          />
        </div>
        {voiceSupported && (
          <button
            type="button"
            onClick={startListening}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #ff6b9d, #4ecdc4)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}
            aria-label="Voice search"
          >
            🎤 MIC
          </button>
        )}
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
        {filteredTips.length > 0 ? (
          filteredTips.map(tip => (
            <Card 
              key={tip.id} 
              className={styles.card}
              onClick={() => setSelectedTip(tip)}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.emoji}>{tip.emoji}</span>
                  <button
                    className={`${styles.favoriteBtn} ${favorites.includes(tip.id) ? styles.favorited : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tip.id);
                    }}
                    aria-label="Agregar a favoritos"
                  >
                    ⭐
                  </button>
                </div>
                <h3 className={styles.title}>{tip.title}</h3>
                <p className={styles.description}>{tip.description}</p>
                <div className={styles.metadata}>
                  <span className={styles.author}>{tip.author}</span>
                  <span className={styles.date}>{tip.date}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className={styles.empty}>
            <p>No encontramos consejos que coincidan con tu búsqueda 💔</p>
          </div>
        )}
      </div>

      {selectedTip && (
        <TipsModal tip={selectedTip} onClose={() => setSelectedTip(null)} />
      )}
    </div>
  );
}
