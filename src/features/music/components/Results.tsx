import type { Track } from '../../music/api';
import { TrackCard } from './TrackCard';

type Props = {
  items: Track[];
};

export function Results({ items }: Props) {
  if (!items.length) return <div style={{ color: '#6b7280' }}>No results</div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
      {items.map((t) => (
        <TrackCard key={t.trackId} track={t} />
      ))}
    </div>
  );
}
