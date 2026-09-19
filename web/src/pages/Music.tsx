import { useQuery } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { Icon } from '../components/Icon';
import { PageTitle } from '../components/PageTitle';
import { useFavorites } from '../hooks/useFavorites';
import { useHistoryList } from '../hooks/useHistoryList';
import { usePreviewPlayer } from '../hooks/usePreviewPlayer';
import { useUnlock } from '../hooks/useUnlock';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { searchTracks, type Track } from '../lib/itunes';
import { speak } from '../lib/speech';
import { useSession } from '../state/session';

const IDEAS = ['Rondas infantiles', 'Cri-Cri', 'Canciones de cuna', 'Para bailar', 'K-pop'];
const trackKey = (t: Track) => t.trackId;

export default function Music() {
  const { isRegistered } = useSession();
  const unlock = useUnlock();
  const [term, setTerm] = useState('');
  const [query, setQuery] = useState('');
  const [history, addHistory] = useHistoryList('music-history');
  const favorites = useFavorites<Track>('music', trackKey, 'music-favs');
  const player = usePreviewPlayer();

  const results = useQuery({
    queryKey: ['tracks', query],
    queryFn: ({ signal }) => searchTracks(query, signal),
    enabled: query.length > 0,
    staleTime: 5 * 60_000,
  });

  function search(value: string) {
    const clean = value.trim();
    if (!clean) return;
    setTerm(clean);
    setQuery(clean);
    addHistory(clean);
  }

  const voice = useVoiceSearch(search);

  function submit(event: FormEvent) {
    event.preventDefault();
    search(term);
  }

  return (
    <>
      <PageTitle
        icon="note"
        tone="pink"
        title="Sala de Conciertos"
        subtitle="Escucha un pedacito de tus canciones"
      />

      <form className="searchbar" onSubmit={submit} role="search">
        <input
          className="input"
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="¿Qué quieres escuchar?"
          aria-label="Buscar canciones o artistas"
        />
        {voice.supported && (
          <button
            type="button"
            className={`btn btn--purple btn--icon${voice.listening ? ' is-listening' : ''}`}
            onClick={isRegistered ? voice.start : unlock}
            aria-label="Buscar con la voz"
          >
            <Icon name="mic" />
            {!isRegistered && (
              <span className="lock-dot" aria-hidden="true">
                <Icon name="lock" />
              </span>
            )}
          </button>
        )}
        <button type="submit" className="btn btn--green">
          <Icon name="search" /> Buscar
        </button>
      </form>

      <div className="chips" role="group" aria-label="Ideas para buscar">
        {IDEAS.map((idea) => (
          <button key={idea} type="button" className="chip" onClick={() => search(idea)}>
            {idea}
          </button>
        ))}
      </div>

      {results.isFetching && <p className="status">Buscando música…</p>}
      {results.isError && <p className="status">No pudimos buscar ahora. Intenta otra vez.</p>}
      {results.data && results.data.length === 0 && !results.isFetching && (
        <p className="status">No encontramos nada. ¡Prueba con otra palabra!</p>
      )}

      {results.data && results.data.length > 0 && (
        <ul className="tracks">
          {results.data.map((track) => {
            const playing = player.playingId === track.trackId;
            const fav = favorites.isFavorite(track);
            return (
              <li key={track.trackId} className={`track${playing ? ' is-playing' : ''}`}>
                <button
                  type="button"
                  className="track__play"
                  onClick={() => track.previewUrl && player.toggle(track.trackId, track.previewUrl)}
                  aria-label={`${playing ? 'Pausar' : 'Escuchar'} ${track.trackName}`}
                >
                  <img
                    src={track.artworkUrl100.replace('100x100', '200x200')}
                    alt=""
                    width="96"
                    height="96"
                    loading="lazy"
                  />
                  <span className="track__btn">
                    <Icon name={playing ? 'pause' : 'play'} />
                  </span>
                </button>
                <div className="track__info">
                  <strong>{track.trackName}</strong>
                  <span className="muted">{track.artistName}</span>
                </div>
                <button
                  type="button"
                  className={`btn btn--ghost btn--icon heart${fav ? ' is-on' : ''}`}
                  onClick={isRegistered ? () => favorites.toggle(track) : unlock}
                  aria-pressed={fav}
                  aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                >
                  <Icon name={isRegistered ? 'heart' : 'lock'} filled={fav} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {history.length > 0 && (
        <section className="stack">
          <h2>Lo último que buscaste</h2>
          <div className="chips">
            {history.map((h) => (
              <button key={h} type="button" className="chip" onClick={() => search(h)}>
                {h}
              </button>
            ))}
          </div>
        </section>
      )}

      {favorites.items.length > 0 && (
        <section className="stack">
          <h2>Tus favoritas</h2>
          <ul className="tracks">
            {favorites.items.map((track) => {
              const playing = player.playingId === track.trackId;
              return (
                <li key={track.trackId} className={`track${playing ? ' is-playing' : ''}`}>
                  <button
                    type="button"
                    className="track__play"
                    onClick={() => {
                      speak(track.trackName);
                      if (track.previewUrl) player.toggle(track.trackId, track.previewUrl);
                    }}
                    aria-label={`${playing ? 'Pausar' : 'Escuchar'} ${track.trackName}`}
                  >
                    <img src={track.artworkUrl100} alt="" width="96" height="96" loading="lazy" />
                    <span className="track__btn">
                      <Icon name={playing ? 'pause' : 'play'} />
                    </span>
                  </button>
                  <div className="track__info">
                    <strong>{track.trackName}</strong>
                    <span className="muted">{track.artistName}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost btn--icon heart is-on"
                    onClick={() => favorites.toggle(track)}
                    aria-label="Quitar de favoritos"
                  >
                    <Icon name="heart" filled />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="muted small">
        Vistas previas cortas cortesía de Apple. Solo música sin lenguaje para adultos.
      </p>
    </>
  );
}
