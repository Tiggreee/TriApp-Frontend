import { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import styles from './Colors.module.css';

export default function Colors() {
  const [hexInput, setHexInput] = useState('FF69B4');
  const [palette, setPalette] = useState(null);
  const [mode, setMode] = useState('monochrome');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const modes = [
    { id: 'monochrome', name: 'Monocromático', emoji: '🎨' },
    { id: 'analogic', name: 'Análogo', emoji: '🌈' },
    { id: 'complement', name: 'Complementario', emoji: '💫' },
    { id: 'triad', name: 'Triada', emoji: '✨' },
    { id: 'quad', name: 'Cuadrado', emoji: '⭐' }
  ];

  const fetchPalette = async (hex, selectedMode) => {
    const cleanHex = hex.replace('#', '');
    setLoading(true);
    try {
      const res = await fetch(`https://www.thecolorapi.com/scheme?hex=${cleanHex}&mode=${selectedMode}&count=5`);
      const data = await res.json();
      setPalette(data);
      
      if (!history.find(h => h.hex === cleanHex && h.mode === selectedMode)) {
        setHistory(prev => [{ hex: cleanHex, mode: selectedMode, seed: data.seed.hex.value }, ...prev].slice(0, 8));
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (hexInput.trim()) {
      fetchPalette(hexInput.trim(), mode);
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
      <h1 style={{ color: 'var(--text-primary)' }}>✨ Generador de Paletas</h1>
      
      <form onSubmit={onSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Input 
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="Color base (ej: FF69B4)"
          />
          <select 
            value={mode}
            onChange={(e) => setMode(e.target.value)}
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
            {modes.map(m => (
              <option key={m.id} value={m.id}>{m.emoji} {m.name}</option>
            ))}
          </select>
          <Button type="submit">Generar Paleta</Button>
        </div>
      </form>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Colores Base:</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {predefinedColors.map(color => (
            <button
              key={color.hex}
              onClick={() => { setHexInput(color.hex); fetchPalette(color.hex, mode); }}
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

      {loading && <p style={{ color: 'var(--text-muted)' }}>Generando paleta mágica...</p>}

      {palette && !loading && (
        <Card>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {modes.find(m => m.id === palette.mode)?.emoji} Paleta {modes.find(m => m.id === palette.mode)?.name}
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {palette.colors.map((color, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '120px',
                  backgroundColor: color.hex.value,
                  borderRadius: '12px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onClick={() => {
                  navigator.clipboard.writeText(color.hex.value);
                }}
                title="Click para copiar"
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {color.hex.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {color.name.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            display: 'flex', 
            height: '60px', 
            borderRadius: '12px', 
            overflow: 'hidden',
            border: '3px solid var(--border)'
          }}>
            {palette.colors.map((color, idx) => (
              <div 
                key={idx}
                style={{
                  flex: 1,
                  backgroundColor: color.hex.value,
                  cursor: 'pointer'
                }}
                onClick={() => {
                  navigator.clipboard.writeText(color.hex.value);
                }}
                title={`${color.hex.value} - Click para copiar`}
              />
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
            💡 Tip: Click en cualquier color para copiarlo
          </p>
        </Card>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Paletas Recientes:</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => { setHexInput(item.hex); setMode(item.mode); fetchPalette(item.hex, item.mode); }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'var(--card)',
                  border: '2px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: item.seed || '#' + item.hex,
                  borderRadius: '8px',
                  border: '2px solid rgba(255,255,255,0.3)'
                }} />
                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {modes.find(m => m.id === item.mode)?.emoji} {modes.find(m => m.id === item.mode)?.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
