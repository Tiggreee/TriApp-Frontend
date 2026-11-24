import { useState } from 'react';
import { PageTitle } from '../components/PageTitle';
import { Tuner } from '../components/Tuner';
import { DEFAULT_TUNING_ID, INSTRUMENTS } from '../data/instruments';

export default function Instruments() {
  const [id, setId] = useState(INSTRUMENTS[0].id);
  const instrument = INSTRUMENTS.find((i) => i.id === id) ?? INSTRUMENTS[0];
  const [tuningId, setTuningId] = useState<string>(DEFAULT_TUNING_ID);
  const tuning = instrument.tunings.find((t) => t.id === tuningId) ?? instrument.tunings[0];

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
        <h2 id="tuning-title">Afinación</h2>
        <div className="chips" role="group" aria-labelledby="tuning-title">
          {instrument.tunings.map((t) => (
            <button
              key={t.id}
              type="button"
              className="chip"
              aria-pressed={t.id === tuning.id}
              onClick={() => setTuningId(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
        <p className="muted small">{tuning.hint}</p>
      </section>
      <Tuner key={`${instrument.id}-${tuning.id}`} name={instrument.name} tuning={tuning} />
    </>
  );
}
