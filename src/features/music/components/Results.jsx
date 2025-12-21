import { TrackCard } from './TrackCard';

export function Results({ items }) {
  if (!items.length) return <div style={{ textAlign: 'center', padding: '40px', color: '#636e72' }}>No results found. Try searching for your favorite artist!</div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
      {items.map((t) => (
        <TrackCard key={t.trackId} track={t} />
      ))}
    </div>
  );
}
