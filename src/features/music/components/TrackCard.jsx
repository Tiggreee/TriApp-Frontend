import styles from './TrackCard.module.css';

export function TrackCard({ track, onFav, isFav }) {
  return (
    <div className={styles.card}>
      <img src={track.artworkUrl100} alt={track.trackName} width={80} height={80} className={styles.artwork} />
      <div className={styles.info}>
        <div className={styles.trackName}>{track.trackName}</div>
        <div className={styles.artistName}>{track.artistName}</div>
      </div>
      {track.previewUrl && (
        <audio controls className={styles.audio}>
          <source src={track.previewUrl} />
        </audio>
      )}
      {onFav && (
        <button
          onClick={() => onFav(track)}
          style={{
            marginLeft: 8,
            background: 'transparent',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
          }}
          aria-label="Toggle favorite"
        >
          {isFav ? '★' : '☆'}
        </button>
      )}
    </div>
  );
}
