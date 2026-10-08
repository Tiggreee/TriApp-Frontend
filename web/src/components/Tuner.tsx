import { type CSSProperties, useState } from 'react';
import type { Instrument } from '../data/instruments';
import { useTuner } from '../hooks/useTuner';
import { centsOff, tuneState } from '../lib/pitch';
import { getAudio } from '../lib/sound';
import { Icon } from './Icon';

const METER_RANGE = 50;

function playReference(hz: number) {
  const ctx = getAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = 'triangle';
  osc.frequency.value = hz;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.7);
}

const MESSAGES = {
  low: 'Muy grave: aprieta un poquito la clavija',
  high: 'Muy aguda: afloja un poquito la clavija',
  ok: '¡Afinada! 🎉',
} as const;

export function Tuner({ instrument }: { instrument: Instrument }) {
  const { strings } = instrument;
  const [index, setIndex] = useState(0);
  const { status, hz, start, stop } = useTuner();
  const target = strings[index] ?? strings[0];
  const listening = status === 'listening';

  const cents = hz ? centsOff(hz, target.hz) : null;
  const state = cents === null ? null : tuneState(cents);
  const offString = cents !== null && Math.abs(cents) > 150;
  const needle =
    cents === null
      ? 50
      : 50 + (Math.max(-METER_RANGE, Math.min(METER_RANGE, cents)) / METER_RANGE) * 50;

  const go = (next: number) => setIndex((next + strings.length) % strings.length);

  return (
    <section className="card tuner" aria-label={`Afinador de ${instrument.name}`}>
      <div
        className="tuner__bar"
        role="group"
        aria-label="Cuerdas, de la más delgada a la más gruesa"
      >
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={() => go(index - 1)}
          aria-label="Cuerda anterior"
        >
          <Icon name="back" />
        </button>
        <ol className="tuner__strings">
          {strings.map((s, i) => (
            <li key={s.number}>
              <button
                type="button"
                className="tuner__string"
                aria-pressed={i === index}
                aria-label={`Cuerda ${s.number}, ${s.note}, ${s.hz} hertz`}
                onClick={() => setIndex(i)}
              >
                <b>{s.number}</b>
                <span>{s.note}</span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={() => go(index + 1)}
          aria-label="Cuerda siguiente"
        >
          <Icon name="next" />
        </button>
      </div>

      <div className="tuner__target">
        <p className="muted">
          Cuerda {target.number} · nota {target.note}
        </p>
        <p className="tuner__hz" data-testid="target-hz">
          {target.hz.toFixed(2)} <small>Hz</small>
        </p>
      </div>

      <div
        className="tuner__meter"
        data-state={state ?? 'idle'}
        style={{ '--needle': `${needle}%` } as CSSProperties}
      >
        <div className="tuner__track">
          <i className="tuner__zone" />
          <i className="tuner__needle" />
        </div>
        <div className="tuner__scale" aria-hidden="true">
          <span>−50</span>
          <span>0</span>
          <span>+50</span>
        </div>
      </div>

      <div className="tuner__read" aria-live="polite">
        {listening && hz && cents !== null && state ? (
          <>
            <p className="tuner__heard" data-testid="heard-hz">
              {hz.toFixed(1)} Hz{' '}
              <small>
                ({cents > 0 ? '+' : ''}
                {Math.round(cents)} cents)
              </small>
            </p>
            <p className="tuner__msg" data-state={state}>
              {offString ? `Toca la cuerda ${target.number}` : MESSAGES[state]}
            </p>
          </>
        ) : (
          <p className="muted tuner__msg">
            {status === 'denied' && 'Permite el micrófono para poder afinar.'}
            {status === 'unsupported' && 'Este navegador no puede usar el micrófono.'}
            {status === 'starting' && 'Abriendo el micrófono…'}
            {status === 'listening' && `Toca la cuerda ${target.number}…`}
            {status === 'idle' && 'Enciende el micrófono y toca la cuerda.'}
          </p>
        )}
      </div>

      <div className="row tuner__actions">
        <button
          type="button"
          className={`btn ${listening ? 'btn--orange' : 'btn--green'}`}
          onClick={listening ? stop : () => void start()}
          aria-pressed={listening}
        >
          <Icon name="mic" /> {listening ? 'Apagar micrófono' : 'Encender micrófono'}
        </button>
        <button type="button" className="btn btn--blue" onClick={() => playReference(target.hz)}>
          <Icon name="volume" /> Escuchar nota
        </button>
        <button type="button" className="btn btn--purple" onClick={() => go(index + 1)}>
          Siguiente cuerda <Icon name="next" />
        </button>
      </div>
    </section>
  );
}
