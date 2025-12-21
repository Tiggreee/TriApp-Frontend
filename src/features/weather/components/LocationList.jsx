export function LocationList({ items, onPick, onFav, favorites = [] }) {
  if (!items.length) return <div style={{ color: 'var(--text-muted)' }}>No locations</div>;
  return (
    <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
      {items.map((l) => (
        <li
          key={l.id}
          style={{
            border: '1px solid var(--border)',
            padding: 8,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--card)',
          }}
        >
          <div style={{ cursor: 'pointer', flex: 1, color: 'var(--text-primary)' }} onClick={() => onPick(l)}>
            {l.name} {l.country ? `(${l.country})` : ''}
          </div>
          {onFav && (
            <button onClick={() => onFav(l)} style={{ border: 'none', background: 'transparent', fontSize: 18, color: 'var(--text-primary)' }} aria-label="Favorite location">
              {favorites.some((f) => f.id === l.id) ? '★' : '☆'}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
