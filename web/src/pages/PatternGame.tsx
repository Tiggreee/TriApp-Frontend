import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { GameResults } from '../components/GameResults';
import { Icon } from '../components/Icon';
import { PageTitle } from '../components/PageTitle';
import {
  PATTERN_ROUNDS,
  PIECE_COLORS,
  createPatternRound,
  patternStars,
} from '../games/pattern';
import { useGroup } from '../hooks/useGroup';
import { playNote, sfx } from '../lib/sound';
import { speak } from '../lib/speech';

const SCALE = [0, 2, 4, 7, 9];

interface Drag {
  tray: number;
  x: number;
  y: number;
}

// Drag-and-drop pattern puzzle: finish the row of colors by dropping the right pieces on the gaps.
export default function PatternGame() {
  const { group } = useGroup();
  const [round, setRound] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [filled, setFilled] = useState<number[]>([]);
  const [used, setUsed] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const slotEls = useRef(new Map<number, HTMLElement>());

  // biome-ignore lint/correctness/useExhaustiveDependencies: a fresh puzzle whenever the round or a replay changes
  const puzzle = useMemo(() => createPatternRound(round), [round, attempt]);

  const note = (color: number) => group.song.root + 12 + (SCALE[color] ?? 0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset progress for each new puzzle
  useEffect(() => {
    setFilled([]);
    setUsed([]);
    setWrong(null);
  }, [puzzle]);

  useEffect(() => {
    if (filled.length === 0 || filled.length < puzzle.blanks.length) return;
    const timer = window.setTimeout(() => {
      if (round + 1 >= PATTERN_ROUNDS) {
        sfx.win();
        setDone(true);
      } else {
        sfx.match();
        setRound((r) => r + 1);
      }
    }, 900);
    return () => window.clearTimeout(timer);
  }, [filled, puzzle.blanks.length, round]);

  function drop(trayIndex: number, x: number, y: number) {
    const color = puzzle.tray[trayIndex] as number;
    for (const slot of puzzle.blanks) {
      const el = slotEls.current.get(slot);
      if (!el || filled.includes(slot)) continue;
      const r = el.getBoundingClientRect();
      const pad = 14;
      if (x < r.left - pad || x > r.right + pad || y < r.top - pad || y > r.bottom + pad) continue;
      if (puzzle.sequence[slot] === color) {
        playNote(note(color), 0.35, 'triangle', 0.25);
        setFilled((f) => [...f, slot]);
        setUsed((u) => [...u, trayIndex]);
      } else {
        sfx.oops();
        setMistakes((m) => m + 1);
        setWrong(slot);
        window.setTimeout(() => setWrong(null), 500);
      }
      return;
    }
  }

  function again() {
    setRound(0);
    setMistakes(0);
    setDone(false);
    setAttempt((a) => a + 1);
  }

  return (
    <>
      <PageTitle
        icon="palette"
        tone="purple"
        title="Colores en fila"
        subtitle={`Con ${group.name}. Arrastra las piezas y completa el patrón.`}
      />

      <div className="row">
        <Link to={`/games?group=${group.id}`} className="btn btn--ghost btn--small">
          <Icon name="back" /> Juegos
        </Link>
        <span className="badge">
          Ronda {Math.min(round + 1, PATTERN_ROUNDS)} de {PATTERN_ROUNDS}
        </span>
      </div>

      <div
        className="pattern"
        style={{ '--g': group.colors.main, '--soft': group.colors.soft } as CSSProperties}
      >
        <div className="pattern__row" role="img" aria-label="Patrón de colores por completar">
          {puzzle.sequence.map((color, i) => {
            const blank = puzzle.blanks.includes(i);
            const isFilled = filled.includes(i);
            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: positions are fixed for a puzzle
                key={i}
                ref={(el) => {
                  if (el) slotEls.current.set(i, el);
                  else slotEls.current.delete(i);
                }}
                className="pattern__slot"
                data-blank={blank && !isFilled}
                data-wrong={wrong === i}
                style={{ '--c': PIECE_COLORS[color] } as CSSProperties}
              />
            );
          })}
        </div>

        <p className="pattern__hint">¿Qué color sigue? Arrastra la pieza al hueco.</p>

        <div className="pattern__tray">
          {puzzle.tray.map((color, i) => {
            const gone = used.includes(i);
            const dragging = drag?.tray === i;
            return (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: tray order is fixed for a puzzle
                key={i}
                type="button"
                className="pattern__piece"
                data-gone={gone}
                data-dragging={dragging}
                disabled={gone}
                aria-label="Pieza de color, arrástrala al hueco"
                style={{ '--c': PIECE_COLORS[color] } as CSSProperties}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  playNote(note(color), 0.2, 'triangle', 0.15);
                  setDrag({ tray: i, x: e.clientX, y: e.clientY });
                }}
                onPointerMove={(e) => {
                  if (drag?.tray === i) setDrag({ tray: i, x: e.clientX, y: e.clientY });
                }}
                onPointerUp={(e) => {
                  if (drag?.tray !== i) return;
                  setDrag(null);
                  drop(i, e.clientX, e.clientY);
                }}
                onPointerCancel={() => setDrag(null)}
              />
            );
          })}
        </div>
      </div>

      {drag && (
        <span
          className="pattern__ghost"
          style={
            {
              '--c': PIECE_COLORS[puzzle.tray[drag.tray] as number],
              transform: `translate(${drag.x}px, ${drag.y}px) translate(-50%, -50%)`,
            } as CSSProperties
          }
        />
      )}

      {done && (
        <GameResults
          group={group.id}
          stars={patternStars(mistakes)}
          message="¡Completaste todos los patrones!"
          detail={`Te equivocaste ${mistakes} ${mistakes === 1 ? 'vez' : 'veces'}.`}
          onAgain={again}
          onClose={() => {
            speak('¡Muy bien!');
            setDone(false);
          }}
        />
      )}
    </>
  );
}
