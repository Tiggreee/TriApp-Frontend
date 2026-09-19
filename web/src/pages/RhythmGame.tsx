import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { GameResults } from '../components/GameResults';
import { Icon } from '../components/Icon';
import { Idol } from '../components/Idol';
import { PageTitle } from '../components/PageTitle';
import {
  buildChart,
  type ChartNote,
  type Difficulty,
  FALL_SECONDS,
  GOOD_WINDOW,
  judge,
  type Lane,
  SONG_BARS,
  songLength,
  starsFor,
} from '../games/chart';
import { useGroup } from '../hooks/useGroup';
import { hashString } from '../lib/rng';
import { getAudio, playNote, scheduleBacking, secondsPerBeat, sfx } from '../lib/sound';

const LANE_COLORS = ['var(--pink)', 'var(--yellow)', 'var(--green)', 'var(--blue)'];
const KEYS: Record<string, Lane> = {
  a: 0,
  s: 1,
  d: 2,
  f: 3,
  ArrowLeft: 0,
  ArrowDown: 1,
  ArrowUp: 2,
  ArrowRight: 3,
};
const HIT_LINE = 0.82; // fraction of the lane height where notes should be tapped

interface Feedback {
  id: number;
  lane: Lane;
  text: string;
}

export default function RhythmGame() {
  const { group } = useGroup();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [hits, setHits] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const chart = useMemo(
    () =>
      buildChart(group.song, hashString(group.id) + (difficulty === 'easy' ? 1 : 2), difficulty),
    [group, difficulty],
  );

  const noteEls = useRef(new Map<number, HTMLElement>());
  const laneEls = useRef<(HTMLElement | null)[]>([]);
  const state = useRef({ startAt: 0, done: new Set<number>(), hits: 0, raf: 0, stop: () => {} });

  const clock = useCallback(() => {
    const ctx = getAudio();
    return ctx ? ctx.currentTime : performance.now() / 1000;
  }, []);

  const finish = useCallback(() => {
    cancelAnimationFrame(state.current.raf);
    state.current.stop();
    setHits(state.current.hits);
    setPhase('done');
    sfx.win();
  }, []);

  const start = useCallback(() => {
    const song = group.song;
    const startAt = clock() + 0.5;
    const s = state.current;
    s.stop();
    s.startAt = startAt;
    s.done = new Set();
    s.hits = 0;
    s.stop = scheduleBacking(song, startAt, SONG_BARS).stop;
    setHits(0);
    setFeedback(null);
    setPhase('playing');

    const end = songLength(song) + 1.2;
    const frame = () => {
      const t = clock() - s.startAt;
      const height = laneEls.current[0]?.clientHeight ?? 400;
      for (const note of chart) {
        const el = noteEls.current.get(note.id);
        if (!el) continue;
        const progress = 1 - (note.time - t) / FALL_SECONDS;
        const missed = !s.done.has(note.id) && t - note.time > GOOD_WINDOW;
        el.style.transform = `translateY(${progress * height * HIT_LINE}px)`;
        el.style.opacity = progress < 0 || progress > 1.3 ? '0' : missed ? '0.25' : '1';
      }
      if (t > end) finish();
      else s.raf = requestAnimationFrame(frame);
    };
    s.raf = requestAnimationFrame(frame);
  }, [group.song, chart, clock, finish]);

  useEffect(() => {
    const s = state.current;
    return () => {
      cancelAnimationFrame(s.raf);
      s.stop();
    };
  }, []);

  // Changing group or difficulty mid-song restarts from the ready screen.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only when the song itself changes
  useEffect(() => {
    cancelAnimationFrame(state.current.raf);
    state.current.stop();
    setPhase('ready');
  }, [group.id, difficulty]);

  const press = useCallback(
    (lane: Lane) => {
      const s = state.current;
      if (phase !== 'playing') return;
      const t = clock() - s.startAt;
      const target = chart
        .filter(
          (n: ChartNote) =>
            n.lane === lane && !s.done.has(n.id) && Math.abs(n.time - t) <= GOOD_WINDOW,
        )
        .sort((a, b) => Math.abs(a.time - t) - Math.abs(b.time - t))[0];

      playNote(
        group.song.root + 12 + (group.song.lanes[lane] ?? 0),
        0.3,
        'triangle',
        target ? 0.3 : 0.12,
      );
      if (!target) return;

      const result = judge(target.time - t);
      if (!result) return;
      s.done.add(target.id);
      s.hits += 1;
      setHits(s.hits);
      const el = noteEls.current.get(target.id);
      if (el) el.dataset.hit = 'true';
      setFeedback({ id: target.id, lane, text: result === 'perfect' ? '¡Perfecto!' : '¡Bien!' });
    },
    [phase, chart, clock, group.song],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const lane = KEYS[e.key];
      if (lane === undefined || e.repeat) return;
      e.preventDefault();
      press(lane);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press]);

  const beat = secondsPerBeat(group.song);

  return (
    <>
      <PageTitle
        icon="note"
        tone="pink"
        title="Ritmo"
        subtitle={`Con ${group.name}. Toca cada nota cuando llegue a la línea.`}
      />

      <div className="row">
        <Link to={`/games?group=${group.id}`} className="btn btn--ghost btn--small">
          <Icon name="back" /> Juegos
        </Link>
        <div className="chips" role="group" aria-label="Dificultad">
          <button
            type="button"
            className="chip"
            aria-pressed={difficulty === 'easy'}
            onClick={() => setDifficulty('easy')}
          >
            Fácil
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={difficulty === 'normal'}
            onClick={() => setDifficulty('normal')}
          >
            Normal
          </button>
        </div>
        <span className="badge">
          <Icon name="star" /> {hits}
        </span>
      </div>

      <div
        className={`rhythm${phase === 'playing' ? ' is-playing' : ''}`}
        style={{ '--g': group.colors.main, '--beat': `${beat}s` } as CSSProperties}
      >
        <div className="rhythm__stage" aria-hidden="true">
          {group.members.map((m) => (
            <Idol key={m.id} member={m} label="" />
          ))}
        </div>

        <div className="rhythm__board">
          {([0, 1, 2, 3] as const).map((lane) => (
            <div
              key={lane}
              className="lane"
              style={{ '--lane': LANE_COLORS[lane] } as CSSProperties}
              ref={(el) => {
                laneEls.current[lane] = el;
              }}
            >
              {phase === 'playing' &&
                chart
                  .filter((n) => n.lane === lane)
                  .map((n) => (
                    <i
                      key={n.id}
                      className="note"
                      ref={(el) => {
                        if (el) noteEls.current.set(n.id, el);
                        else noteEls.current.delete(n.id);
                      }}
                    />
                  ))}
              <div className="lane__line" style={{ top: `${HIT_LINE * 100}%` }} />
              {feedback?.lane === lane && (
                <span
                  key={feedback.id}
                  className="lane__feedback"
                  style={{ top: `${HIT_LINE * 100 - 16}%` }}
                >
                  {feedback.text}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="rhythm__pads">
          {([0, 1, 2, 3] as const).map((lane) => (
            <button
              key={lane}
              type="button"
              className="pad"
              style={{ '--lane': LANE_COLORS[lane] } as CSSProperties}
              onPointerDown={(e) => {
                e.preventDefault();
                press(lane);
              }}
              aria-label={`Nota ${lane + 1}`}
            />
          ))}
        </div>

        {phase === 'ready' && (
          <div className="rhythm__start">
            <button type="button" className="btn btn--green" onClick={start}>
              <Icon name="play" /> ¡Empezar!
            </button>
            <p className="small">
              Toca los botones de colores. También puedes usar las flechas o A S D F.
            </p>
          </div>
        )}
      </div>

      {phase === 'done' && (
        <GameResults
          group={group.id}
          stars={starsFor(hits, chart.length)}
          message="¡Qué concierto!"
          detail={`Tocaste ${hits} de ${chart.length} notas.`}
          onAgain={start}
          onClose={() => setPhase('ready')}
        />
      )}
    </>
  );
}
