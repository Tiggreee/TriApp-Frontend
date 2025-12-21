export function Card({ data }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #e5e7eb', padding: 12, borderRadius: 8 }}>
      {data.sprite && <img src={data.sprite} alt={data.name} width={80} height={80} />}
      <div>
        <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{data.name}</div>
        <div style={{ color: '#6b7280' }}>Types: {data.types.join(', ') || 'n/a'}</div>
      </div>
    </div>
  );
}
