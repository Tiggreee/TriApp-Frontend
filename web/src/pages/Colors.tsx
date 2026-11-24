import { useQuery } from '@tanstack/react-query';
import { type CSSProperties, type FormEvent, useState } from 'react';
import { Icon } from '../components/Icon';
import { PageTitle } from '../components/PageTitle';
import { useFavorites } from '../hooks/useFavorites';
import { useUnlock } from '../hooks/useUnlock';
import { isValidHex, spanishColorName } from '../lib/colors';
import { sfx } from '../lib/sound';
import { speak } from '../lib/speech';
import { useSession } from '../state/session';

const MODES = [
  { id: 'monochrome', name: 'Uno solo' },
  { id: 'analogic', name: 'Vecinos' },
  { id: 'complement', name: 'Opuestos' },
  { id: 'triad', name: 'Triángulo' },
  { id: 'quad', name: 'Cuadrado' },
] as const;

const BASES = [
  { hex: 'FF69B4', name: 'rosa' },
  { hex: 'FFD700', name: 'dorado' },
  { hex: '4ECDC4', name: 'turquesa' },
  { hex: 'AA5CDB', name: 'morado' },
  { hex: 'FF6B9D', name: 'flor' },
  { hex: '95E1D3', name: 'menta' },
];

interface Scheme {
  colors: { hex: { value: string } }[];
}

async function fetchScheme(hex: string, mode: string, signal?: AbortSignal): Promise<Scheme> {
  const res = await fetch(`https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=5`, {
    signal,
  });
  if (!res.ok) throw new Error('No pudimos mezclar colores ahora');
  return (await res.json()) as Scheme;
}

type SavedPalette = { key: string; hex: string; mode: string; colors: string[] };

export default function Colors() {
  const { isRegistered, showToast } = useSession();
  const unlock = useUnlock();
  const [hex, setHex] = useState('FF69B4');
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('analogic');
  const [custom, setCustom] = useState('');
  const favorites = useFavorites<SavedPalette>('color', (p) => p.key);

  const scheme = useQuery({
    queryKey: ['scheme', hex, mode],
    queryFn: ({ signal }) => fetchScheme(hex, mode, signal),
    staleTime: 10 * 60_000,
  });

  const colors = scheme.data?.colors.map((c) => c.hex.value) ?? [];
  const saved: SavedPalette = { key: `${hex}-${mode}`, hex, mode, colors };
  const isSaved = favorites.isFavorite(saved);

  function pick(color: string) {
    const name = spanishColorName(color);
    sfx.pop();
    speak(name);
    navigator.clipboard?.writeText(color).then(
      () => showToast(`${name} · ${color} copiado`),
      () => {},
    );
  }

  function submitCustom(event: FormEvent) {
    event.preventDefault();
    if (!isValidHex(custom)) {
      showToast('Escribe un código como FF69B4');
      return;
    }
    setHex(custom.trim().replace('#', '').toUpperCase());
  }

  return (
    <>
      <PageTitle
        icon="palette"
        tone="orange"
        title="Colores"
        subtitle="Toca un color y mira qué amigos tiene"
      />

      <section className="stack" aria-labelledby="base-title">
        <h2 id="base-title">1. Elige un color</h2>
        <div className="swatches">
          {BASES.map((base) => (
            <button
              key={base.hex}
              type="button"
              className="swatch"
              style={{ background: `#${base.hex}` }}
              aria-pressed={hex === base.hex}
              aria-label={base.name}
              onClick={() => {
                setHex(base.hex);
                sfx.pop();
                speak(base.name);
              }}
            />
          ))}
        </div>
      </section>

      <section className="stack" aria-labelledby="mode-title">
        <h2 id="mode-title">2. ¿Cómo los mezclamos?</h2>
        <div className="chips">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="chip"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
      </section>

      <section className="card stack" aria-live="polite">
        {scheme.isPending && <p className="status">Mezclando colores…</p>}
        {scheme.isError && <p className="status">No pudimos mezclar ahora. Intenta otra vez.</p>}
        {colors.length > 0 && (
          <>
            <div className="bubbles">
              {colors.map((color, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: palette can repeat a colour
                  key={i}
                  type="button"
                  className="bubble"
                  style={{ '--bubble': color, '--i': i } as CSSProperties}
                  onClick={() => pick(color)}
                  aria-label={`${spanishColorName(color)}, ${color}. Toca para escuchar y copiar`}
                >
                  <span>{spanishColorName(color)}</span>
                </button>
              ))}
            </div>
            <div className="row">
              <button
                type="button"
                className={`btn btn--ghost${isSaved ? ' is-on' : ''}`}
                onClick={isRegistered ? () => favorites.toggle(saved) : unlock}
                aria-pressed={isSaved}
              >
                <Icon name={isRegistered ? 'heart' : 'lock'} filled={isSaved} />
                {isSaved ? 'Guardada' : 'Guardar paleta'}
              </button>
              <span className="muted small">
                Toca una bolita: dice su nombre y copia el código.
              </span>
            </div>
          </>
        )}
      </section>

      <details className="card advanced">
        <summary>Para grandes: escribir un código de color</summary>
        <form className="row" onSubmit={submitCustom}>
          <input
            className="input"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="FF69B4"
            aria-label="Código de color"
            maxLength={7}
          />
          <button type="submit" className="btn btn--blue">
            Usar
          </button>
        </form>
      </details>

      {favorites.items.length > 0 && (
        <section className="stack">
          <h2>Tus paletas</h2>
          <div className="saved">
            {favorites.items.map((p) => (
              <button
                key={p.key}
                type="button"
                className="saved__palette"
                onClick={() => {
                  setHex(p.hex);
                  if (MODES.some((m) => m.id === p.mode)) setMode(p.mode as typeof mode);
                }}
                aria-label="Ver esta paleta"
              >
                {p.colors.map((c, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: palette can repeat a colour
                  <i key={i} style={{ background: c }} />
                ))}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
