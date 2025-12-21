export function Card({ data, onFav, isFav }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
      {data.sprite && <img src={data.sprite} alt={data.name} width={80} height={80} />}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{data.name}</div>
        <div style={{ color: '#6b7280' }}>Types: {data.types.join(', ') || 'n/a'}</div>
      </div>
      {onFav && (
        <button onClick={() => onFav(data)} style={{ border: 'none', background: 'transparent', fontSize: 20 }} aria-label="Favorite Pokemon">
          {isFav ? '★' : '☆'}
        </button>
      )}
    </div>
  );
}
