import { type FormEvent, useMemo, useState } from 'react';
import { Dialog } from '../components/Dialog';
import { ExternalLink } from '../components/ExternalLink';
import { Icon, type IconName } from '../components/Icon';
import { PageTitle } from '../components/PageTitle';
import type { Category, ContentItem } from '../data/makeup';
import { useFavorites } from '../hooks/useFavorites';
import { useHistoryList } from '../hooks/useHistoryList';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { speak } from '../lib/speech';

interface Props {
  icon: IconName;
  tone: 'pink' | 'blue';
  title: string;
  subtitle: string;
  placeholder: string;
  type: 'makeup' | 'consejos';
  categories: Category[];
  items: ContentItem[];
}

type Saved = { id: number };

// Shared by "Brillos" and "Consejos": search, filter, save, read.
export default function ContentBrowser({
  icon,
  tone,
  title,
  subtitle,
  placeholder,
  type,
  categories,
  items,
}: Props) {
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [open, setOpen] = useState<ContentItem | null>(null);
  const [history, addHistory] = useHistoryList(`${type}-history`, 5);
  const favorites = useFavorites<Saved>(type, (s) => s.id);
  const voice = useVoiceSearch((text) => {
    setTerm(text);
    addHistory(text);
  });

  const visible = useMemo(() => {
    const q = term.trim().toLowerCase();
    return items.filter(
      (item) =>
        (category === 'all' || item.category === category) &&
        (!q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)),
    );
  }, [items, term, category]);

  function submit(event: FormEvent) {
    event.preventDefault();
    addHistory(term);
  }

  return (
    <>
      <PageTitle icon={icon} tone={tone} title={title} subtitle={subtitle} />

      <form className="searchbar" onSubmit={submit} role="search">
        <input
          className="input"
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        {voice.supported && (
          <button
            type="button"
            className={`btn btn--purple btn--icon${voice.listening ? ' is-listening' : ''}`}
            onClick={voice.start}
            aria-label="Buscar con la voz"
          >
            <Icon name="mic" />
          </button>
        )}
        <button type="submit" className="btn btn--green">
          <Icon name="search" /> Buscar
        </button>
      </form>

      <div className="chips" role="group" aria-label="Categorías">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className="chip"
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            <span aria-hidden="true">{c.emoji}</span> {c.name}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <div className="chips" role="group" aria-label="Búsquedas recientes">
          {history.map((h) => (
            <button key={h} type="button" className="chip" onClick={() => setTerm(h)}>
              {h}
            </button>
          ))}
        </div>
      )}

      <div className="content-grid">
        {visible.map((item) => {
          const fav = favorites.isFavorite({ id: item.id });
          return (
            <article key={item.id} className="content-card">
              <button
                type="button"
                className="content-card__open"
                onClick={() => {
                  speak(item.title);
                  setOpen(item);
                }}
              >
                <span className="content-card__emoji" aria-hidden="true">
                  {item.emoji}
                </span>
                <h3>{item.title}</h3>
                <p className="muted">{item.description}</p>
                <span className="content-card__meta">
                  {item.meta.map((m) => (
                    <span key={m.label} className="badge badge--soft">
                      {m.value}
                    </span>
                  ))}
                </span>
              </button>
              <button
                type="button"
                className={`btn btn--ghost btn--icon heart${fav ? ' is-on' : ''}`}
                onClick={() => favorites.toggle({ id: item.id })}
                aria-pressed={fav}
                aria-label={
                  fav ? `Quitar ${item.title} de favoritos` : `Guardar ${item.title} en favoritos`
                }
              >
                <Icon name="heart" filled={fav} />
              </button>
            </article>
          );
        })}
        {visible.length === 0 && <p className="status">No encontramos nada con esa búsqueda.</p>}
      </div>

      {open && (
        <Dialog title={`${open.emoji} ${open.title}`} onClose={() => setOpen(null)}>
          <p>{open.description}</p>
          <p className="row">
            {open.meta.map((m) => (
              <span key={m.label} className="badge badge--soft">
                {m.label}: {m.value}
              </span>
            ))}
          </p>
          <h3>{open.heading}</h3>
          {open.ordered ? (
            <ol className="steps">
              {open.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          ) : (
            open.body.map((line) => <p key={line}>{line}</p>)
          )}
          {open.actions && open.actions.length > 0 && (
            <>
              <h3>Para aplicar hoy</h3>
              <ul className="steps">
                {open.actions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </>
          )}
          {open.closing && (
            <p className="lock-note">
              <Icon name="sparkle" />
              <span>
                <strong>{open.closing.title}: </strong>
                {open.closing.text}
              </span>
            </p>
          )}
          <ExternalLink href={open.link.href}>{open.link.label}</ExternalLink>
        </Dialog>
      )}
    </>
  );
}
