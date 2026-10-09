import { type CSSProperties, useEffect, useState } from 'react';
import type { Tuning } from '../data/instruments';
import { useTuner } from '../hooks/useTuner';
import { centsOff, nearestTarget, tuneState } from '../lib/pitch';
import { getAudio } from '../lib/sound';
import { Icon } from './Icon';
import { MetalUkulele, type StringState } from './MetalUkulele';

const METER_RANGE = 50;
/** A note closer than this to a string counts as that string being played. */
const AUTO_CENTS = 100;

// Tuning-peg buttons on the headstock, as % of the artwork: strings 1 and 2 left, 3 and 4 right.
const PEGS = [
  { x: 35, y: 8.9 },
  { x: 35, y: 17.7 },
  { x: 65, y: 8.9 },
  { x: 65, y: 17.7 },
] as const;

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

export function Tuner({ name, tuning }: { name: string; tuning: Tuning }) {
  const { strings } = tuning;
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const { status, hz, start, stop } = useTuner();
  const listening = status === 'listening';

  // Which string is sounding, if any: the closest one within a semitone.
  const nearest = hz
    ? nearestTarget(
        hz,
        strings.map((s) => s.hz),
      )
    : null;
  const heardIndex = nearest && Math.abs(nearest.cents) <= AUTO_CENTS ? nearest.index : null;

  // In auto mode the string being played becomes the target, and stays selected afterwards.
  const activeIndex = auto && heardIndex !== null ? heardIndex : index;
  useEffect(() => {
    if (auto && heardIndex !== null) setIndex(heardIndex);
  }, [auto, heardIndex]);

  const target = strings[activeIndex] ?? strings[0];
  const cents = hz ? centsOff(hz, target.hz) : null;
  const state = cents === null ? null : tuneState(cents);
  const offString = cents !== null && Math.abs(cents) > 150;
  const clamped = cents === null ? 0 : Math.max(-METER_RANGE, Math.min(METER_RANGE, cents));
  const needle = cents === null ? 50 : 50 + (clamped / METER_RANGE) * 50;

  const select = (next: number) => {
    setAuto(false);
    setIndex((next + strings.length) % strings.length);
  };

  const stringStates: StringState[] = strings.map((_, i) =>
    i !== activeIndex ? 'idle' : state === 'ok' ? 'ok' : 'target',
  );

  return (
    <section className="card tuner" aria-label={`Afinador de ${name}`}>
      <div className="uke">
        <MetalUkulele states={stringStates} />

        <div
          className="uke__pegs"
          role="group"
          aria-label="Cuerdas, de la más delgada a la más gruesa"
        >
          {strings.map((s, i) => (
            <button
              key={s.number}
              type="button"
              className="uke__peg"
              style={{ left: `${PEGS[i]?.x}%`, top: `${PEGS[i]?.y}%` } as CSSProperties}
              aria-pressed={i === activeIndex}
              data-heard={i === heardIndex}
              data-ok={i === heardIndex && state === 'ok'}
              aria-label={`Cuerda ${s.number}, ${s.note}, ${s.hz.toFixed(2)} hertz`}
              onClick={() => select(i)}
            >
              <b>{s.number}</b>
              <span>{s.note}</span>
            </button>
          ))}
        </div>

        <div className="uke__screen">
          <p className="tuner__label">
            Cuerda {target.number} · {target.note}
          </p>
          <p className="tuner__hz" data-testid="target-hz">
            {target.hz.toFixed(2)} <small>Hz</small>
          </p>

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
              <p className="tuner__msg tuner__msg--idle">
                {status === 'denied' && 'Permite el micrófono para poder afinar.'}
                {status === 'unsupported' && 'Este navegador no puede usar el micrófono.'}
                {status === 'starting' && 'Abriendo el micrófono…'}
                {status === 'listening' &&
                  (auto ? 'Toca una cuerda…' : `Toca la cuerda ${target.number}…`)}
                {status === 'idle' && 'Enciende el micrófono y toca una cuerda.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="tuner__actions">
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={() => select(activeIndex - 1)}
          aria-label="Cuerda anterior"
        >
          <Icon name="back" />
        </button>
        <button
          type="button"
          className="chip"
          aria-pressed={auto}
          aria-label="Selección automática de cuerda"
          onClick={() => setAuto((on) => !on)}
        >
          {auto ? 'Auto' : 'Manual'}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--icon"
          onClick={() => select(activeIndex + 1)}
          aria-label="Cuerda siguiente"
        >
          <Icon name="next" />
        </button>
      </div>
      <div className="tuner__actions">
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
      </div>
    </section>
  );
}
