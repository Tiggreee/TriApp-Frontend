import { useState } from 'react';
import { PageTitle } from '../components/PageTitle';
import { Tuner } from '../components/Tuner';
import { INSTRUMENTS } from '../data/instruments';

export default function Instruments() {
  const [id, setId] = useState(INSTRUMENTS[0].id);
  const instrument = INSTRUMENTS.find((i) => i.id === id) ?? INSTRUMENTS[0];

  return (
    <>
      <PageTitle
        icon="ukulele"
        tone="orange"
        title="Instrumentos"
        subtitle="Afina con el micrófono"
      />
      <section className="stack" aria-labelledby="instrument-title">
        <h2 id="instrument-title">Tu instrumento</h2>
        <div className="chips">
          {INSTRUMENTS.map((i) => (
            <button
              key={i.id}
              type="button"
              className="chip"
              aria-pressed={i.id === id}
              onClick={() => setId(i.id)}
            >
              {i.name}
            </button>
          ))}
        </div>
        <p className="muted small">{instrument.tagline}</p>
      </section>
      <Tuner key={instrument.id} instrument={instrument} />
    </>
  );
}
