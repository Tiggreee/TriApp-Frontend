import styles from './TrackCard.module.css';

export function TrackCard({ track, onFav, isFav, lockedFav = false }) {
  return (
    <div className={styles.card}>
      <div className={styles.topSection}>
        <img src={track.artworkUrl100} alt={track.trackName} width={80} height={80} className={styles.artwork} />
        <div className={styles.info}>
          <div className={styles.trackName}>{track.trackName}</div>
          <div className={styles.artistName}>{track.artistName}</div>
        </div>
        {onFav && (
          <button
            onClick={lockedFav ? undefined : () => onFav(track)}
            className={`${styles.favButton} ${lockedFav ? styles.locked : ''}`}
            aria-label="Toggle favorite"
            disabled={lockedFav}
          >
            {isFav ? '★' : '☆'}
          </button>
        )}
      </div>
      {track.previewUrl && (
        <audio controls className={styles.audio}>
          <source src={track.previewUrl} />
        </audio>
      )}
    </div>
  );
}
