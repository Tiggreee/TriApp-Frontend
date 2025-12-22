import { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import styles from './Music.module.css';

export default function Colors() {
  const [hexInput, setHexInput] = useState('FF69B4');
  const [colorData, setColorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchColorInfo = async (hex) => {
    const cleanHex = hex.replace('#', '');
    setLoading(true);
    try {
      const res = await fetch(`https://www.thecolorapi.com/id?hex=${cleanHex}`);
      const data = await res.json();
      setColorData(data);
      
      if (!history.find(h => h.hex === data.hex.clean)) {
        setHistory(prev => [{ hex: data.hex.clean, name: data.name.value }, ...prev].slice(0, 10));
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (hexInput.trim()) {
      fetchColorInfo(hexInput.trim());
    }
  };

  const predefinedColors = [
    { hex: 'FF69B4', name: 'Hot Pink' },
    { hex: 'FFD700', name: 'Gold' },
    { hex: '4ECDC4', name: 'Turquoise' },
    { hex: 'AA5CDB', name: 'Purple' },
    { hex: 'FF6B9D', name: 'Rose' },
    { hex: '95E1D3', name: 'Mint' }
  ];

  return (
    <div className={styles.container}>
      <h1 style={{ color: 'var(--text-primary)' }}>Colores Magicos</h1>
      
      <form onSubmit={onSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Input 
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          placeholder="Escribe codigo de color (ej: FF69B4)"
        />
        <Button type="submit">Ver Color</Button>
      </form>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Colores Predefinidos:</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {predefinedColors.map(color => (
            <button
              key={color.hex}
              onClick={() => { setHexInput(color.hex); fetchColorInfo(color.hex); }}
              style={{
                padding: '1rem',
                backgroundColor: '#' + color.hex,
                border: '2px solid var(--border)',
                borderRadius: '12px',
                cursor: 'pointer',
                color: '#fff',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                minWidth: '100px'
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>}

      {colorData && !loading && (
        <Card>
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: colorData.hex.value,
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '3px solid rgba(255,255,255,0.3)'
          }} />
          
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            {colorData.name.value}
          </h2>
          
          <div style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            <p><strong>HEX:</strong> {colorData.hex.value}</p>
            <p><strong>RGB:</strong> {colorData.rgb.value}</p>
            <p><strong>HSL:</strong> {colorData.hsl.value}</p>
          </div>
        </Card>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Historial de Colores:</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => { setHexInput(item.hex); fetchColorInfo(item.hex); }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#' + item.hex,
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '0.9rem',
                  textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
