import { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import styles from './Avatar.module.css';

export default function Avatar() {
  const [name, setName] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [style, setStyle] = useState('lorelei');
  const [history, setHistory] = useState([]);

  const avatarStyles = [
    { id: 'lorelei', name: 'Lorelei (Ninas)' },
    { id: 'adventurer', name: 'Aventurero' },
    { id: 'big-smile', name: 'Gran Sonrisa' },
    { id: 'bottts', name: 'Robot' },
    { id: 'personas', name: 'Personas' },
    { id: 'fun-emoji', name: 'Emoji' }
  ];

  const generateAvatar = () => {
    if (!name.trim()) return;
    
    const seed = name.trim().toLowerCase();
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
    
    setCurrentAvatar({ url: avatarUrl, name: seed, style });
    
    if (!history.find(h => h.name === seed && h.style === style)) {
      setHistory(prev => [{ name: seed, style, url: avatarUrl }, ...prev].slice(0, 10));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    generateAvatar();
  };

  return (
    <div className={styles.container}>
      <h1 style={{ color: 'var(--text-primary)' }}>Crea tu Avatar</h1>
      
      <form onSubmit={onSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Escribe tu nombre o palabra..."
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
            Estilo de Avatar:
          </label>
          <select 
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={{
              padding: '0.8rem',
              fontSize: '1rem',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              backgroundColor: 'var(--card)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {avatarStyles.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <Button type="submit">Generar Avatar</Button>
      </form>

      {currentAvatar && (
        <Card style={{ textAlign: 'center' }}>
          <div style={{
            width: '200px',
            height: '200px',
            margin: '0 auto',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid var(--primary)',
            backgroundColor: '#fff'
          }}>
            <img 
              src={currentAvatar.url}
              alt={'Avatar de ' + currentAvatar.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
          <h2 style={{ color: 'var(--text-primary)', marginTop: '1.5rem', textTransform: 'capitalize' }}>
            {currentAvatar.name}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Estilo: {avatarStyles.find(s => s.id === currentAvatar.style)?.name}
          </p>

          <a 
            href={currentAvatar.url}
            download={'avatar-' + currentAvatar.name + '.svg'}
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.6rem 1.5rem',
              background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            Descargar Avatar
          </a>
        </Card>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Avatares Recientes:</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: '1rem'
          }}>
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setName(item.name);
                  setStyle(item.style);
                  setCurrentAvatar(item);
                }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'var(--card)',
                  border: '2px solid var(--border)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <img 
                  src={item.url}
                  alt={item.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#fff'
                  }}
                />
                <span style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.8rem',
                  textTransform: 'capitalize',
                  wordBreak: 'break-word'
                }}>
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
