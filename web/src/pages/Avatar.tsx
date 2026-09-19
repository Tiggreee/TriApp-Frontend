import { adventurer, bigSmile, bottts, funEmoji, lorelei, personas } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { type FormEvent, useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { PageTitle } from '../components/PageTitle';
import { useFavorites } from '../hooks/useFavorites';
import { useHistoryList } from '../hooks/useHistoryList';
import { useUnlock } from '../hooks/useUnlock';
import { sfx } from '../lib/sound';
import { speak } from '../lib/speech';
import { useSession } from '../state/session';

const STYLES = [
  { id: 'lorelei', name: 'Princesa', style: lorelei },
  { id: 'adventurer', name: 'Aventurera', style: adventurer },
  { id: 'big-smile', name: 'Sonrisota', style: bigSmile },
  { id: 'bottts', name: 'Robot', style: bottts },
  { id: 'personas', name: 'Personas', style: personas },
  { id: 'fun-emoji', name: 'Emoji', style: funEmoji },
] as const;

type StyleId = (typeof STYLES)[number]['id'];
type SavedAvatar = { key: string; name: string; style: StyleId };

// Avatars are drawn right here in the browser: the child's name never leaves the device.
function avatarUri(styleId: StyleId, seed: string): string {
  const entry = STYLES.find((s) => s.id === styleId) ?? STYLES[0];
  return createAvatar(entry.style as never, { seed }).toDataUri();
}

export default function Avatar() {
  const { isRegistered } = useSession();
  const unlock = useUnlock();
  const [name, setName] = useState('');
  const [styleId, setStyleId] = useState<StyleId>('lorelei');
  const [current, setCurrent] = useState<{ name: string; style: StyleId } | null>(null);
  const [recent, addRecent] = useHistoryList('avatar-history', 10);
  const favorites = useFavorites<SavedAvatar>('avatar', (a) => a.key);

  const previewSeed = name.trim().toLowerCase() || 'renata';
  const previews = useMemo(() => STYLES.map((s) => avatarUri(s.id, previewSeed)), [previewSeed]);
  const currentUri = current ? avatarUri(current.style, current.name) : null;
  const saved: SavedAvatar | null = current
    ? { key: `${current.name}-${current.style}`, ...current }
    : null;
  const isSaved = saved ? favorites.isFavorite(saved) : false;

  function generate(next?: { name: string; style: StyleId }) {
    const target = next ?? { name: name.trim().toLowerCase(), style: styleId };
    if (!target.name) return;
    setCurrent(target);
    addRecent(`${target.name}|${target.style}`);
    sfx.win();
    speak(target.name);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    generate();
  }

  return (
    <>
      <PageTitle
        icon="face"
        tone="green"
        title="Mi personaje"
        subtitle="Escribe un nombre y crea tu personaje"
      />

      <form className="stack" onSubmit={submit}>
        <label className="field">
          ¿Cómo se llama?
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Renata"
            maxLength={30}
            autoComplete="off"
          />
        </label>

        <fieldset className="styles">
          <legend>Elige tu estilo</legend>
          {STYLES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="style-tile"
              aria-pressed={styleId === s.id}
              onClick={() => {
                setStyleId(s.id);
                sfx.pop();
              }}
            >
              <img src={previews[i]} alt="" width="96" height="96" />
              <span>{s.name}</span>
            </button>
          ))}
        </fieldset>

        <button type="submit" className="btn btn--green" disabled={!name.trim()}>
          <Icon name="sparkle" /> ¡Crear mi personaje!
        </button>
      </form>

      {current && currentUri && saved && (
        <section className="card avatar-result" aria-live="polite">
          <img
            key={currentUri}
            className="avatar-result__img"
            src={currentUri}
            alt={`Personaje de ${current.name}`}
          />
          <h2 className="capitalize">{current.name}</h2>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button
              type="button"
              className={`btn btn--ghost${isSaved ? ' is-on' : ''}`}
              onClick={isRegistered ? () => favorites.toggle(saved) : unlock}
              aria-pressed={isSaved}
            >
              <Icon name={isRegistered ? 'heart' : 'lock'} filled={isSaved} />
              {isSaved ? 'Guardado' : 'Guardar'}
            </button>
            <a
              className="btn btn--blue"
              href={currentUri}
              download={`personaje-${current.name}.svg`}
            >
              <Icon name="download" /> Descargar
            </a>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="stack">
          <h2>Personajes recientes</h2>
          <div className="recent">
            {recent.map((entry) => {
              const [n = '', s = 'lorelei'] = entry.split('|');
              const id = (STYLES.some((x) => x.id === s) ? s : 'lorelei') as StyleId;
              return (
                <button
                  key={entry}
                  type="button"
                  className="recent__item"
                  onClick={() => {
                    setName(n);
                    setStyleId(id);
                    generate({ name: n, style: id });
                  }}
                >
                  <img src={avatarUri(id, n)} alt="" width="72" height="72" />
                  <span className="capitalize">{n}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {favorites.items.length > 0 && (
        <section className="stack">
          <h2>Tus guardados</h2>
          <div className="recent">
            {favorites.items.map((a) => (
              <button
                key={a.key}
                type="button"
                className="recent__item"
                onClick={() => generate({ name: a.name, style: a.style })}
              >
                <img src={avatarUri(a.style, a.name)} alt="" width="72" height="72" />
                <span className="capitalize">{a.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
