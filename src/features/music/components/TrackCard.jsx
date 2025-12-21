export function TrackCard({ track }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #e5e7eb', padding: 8, borderRadius: 8 }}>
      <img src={track.artworkUrl100} alt={track.trackName} width={60} height={60} style={{ borderRadius: 6 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>{track.trackName}</div>
        <div style={{ color: '#6b7280' }}>{track.artistName}</div>
      </div>
      {track.previewUrl && (
        <audio controls style={{ height: 30 }}>
          <source src={track.previewUrl} />
        </audio>
      )}
    </div>
  );
}
