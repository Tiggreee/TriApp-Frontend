export function LocationList({ items, onPick }) {
  if (!items.length) return <div style={{ color: '#6b7280' }}>No locations</div>;
  return (
    <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
      {items.map((l) => (
        <li key={l.id} style={{ border: '1px solid #e5e7eb', padding: 8, borderRadius: 8, cursor: 'pointer' }} onClick={() => onPick(l)}>
          {l.name} {l.country ? `(${l.country})` : ''}
        </li>
      ))}
    </ul>
  );
}
