import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { GameResults } from '../components/GameResults';
import { Icon } from '../components/Icon';
import { Idol } from '../components/Idol';
import { PageTitle } from '../components/PageTitle';
import { GROUPS } from '../data/groups';
import {
  createRunner,
  jump,
  jumpHeight,
  slide,
  moveLane,
  RUN_SECONDS,
  type RunnerState,
  type RunObject,
  runnerStars,
  stepRunner,
} from '../games/runner';
import { useGroup } from '../hooks/useGroup';
import { useUnlock } from '../hooks/useUnlock';
import { getAudio, playNote, scheduleBacking, secondsPerBeat, sfx } from '../lib/sound';
import { speak } from '../lib/speech';
import { readJSON, writeJSON } from '../lib/storage';

const STATS_KEY = 'runner-stats';
const HORIZON = 0.3;
const GROUND = 0.9;

interface Stats {
  total: number;
  best: number;
}

const persp = (z: number) => {
  const d = Math.max(0, Math.min(1.25, 1 - z));
  return d ** 1.6;
};
const roadHalf = (k: number, w: number) => w * (0.09 + 0.37 * k);
const laneX = (lane: number, k: number, w: number) => w / 2 + (lane - 1) * roadHalf(k, w) * 0.66;

function starPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, spin: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = spin + (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.48;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
}

function drawObject(
  ctx: CanvasRenderingContext2D,
  o: RunObject,
  w: number,
  h: number,
  time: number,
) {
  const k = persp(o.z);
  const y = h * (HORIZON + (GROUND - HORIZON) * k);
  const x = laneX(o.lane, k, w);
  const scale = 0.12 + 0.88 * k;
  const unit = w * 0.15 * scale;

  ctx.fillStyle = 'rgba(43,35,80,.22)';
  ctx.beginPath();
  ctx.ellipse(x, y, unit * 0.5, unit * 0.14, 0, 0, Math.PI * 2);
  ctx.fill();

  if (o.kind === 'star') {
    const cy = y - unit * 0.55;
    ctx.save();
    ctx.shadowColor = 'rgba(255,210,63,.9)';
    ctx.shadowBlur = unit * 0.4;
    ctx.fillStyle = '#ffd23f';
    ctx.strokeStyle = '#d4a50c';
    ctx.lineWidth = Math.max(1, unit * 0.06);
    starPath(ctx, x, cy, unit * 0.36, Math.sin(time * 3 + o.id) * 0.25);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  } else if (o.kind === 'arch') {
    const aw = unit * 1.15;
    const ah = unit * 1.25;
    ctx.lineCap = 'round';
    const bands = ['#ff5fa2', '#ffd23f', '#3ed598', '#3aa7ff'];
    bands.forEach((c, i) => {
      ctx.strokeStyle = c;
      ctx.lineWidth = Math.max(2, unit * 0.09);
      const r = aw * 0.5 - i * unit * 0.085;
      ctx.beginPath();
      ctx.moveTo(x - r, y);
      ctx.lineTo(x - r, y - ah * 0.55);
      ctx.arc(x, y - ah * 0.55, r, Math.PI, 0);
      ctx.lineTo(x + r, y);
      ctx.stroke();
    });
  } else if (o.kind === 'bump') {
    const bw = unit * 0.95;
    ctx.fillStyle = '#ff9f43';
    ctx.beginPath();
    ctx.moveTo(x - bw * 0.42, y);
    ctx.lineTo(x - bw * 0.5, y - bw * 0.34);
    ctx.lineTo(x + bw * 0.5, y - bw * 0.34);
    ctx.lineTo(x + bw * 0.42, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    for (const dx of [-0.24, 0, 0.24])
      ctx.fillRect(x + dx * bw - bw * 0.03, y - bw * 0.32, bw * 0.06, bw * 0.3);
    ctx.fillStyle = '#ff5fa2';
    ctx.beginPath();
    ctx.arc(x, y - bw * 0.42, bw * 0.46, Math.PI, 0);
    ctx.arc(x + bw * 0.2, y - bw * 0.34, bw * 0.22, 0, Math.PI);
    ctx.arc(x - bw * 0.2, y - bw * 0.34, bw * 0.22, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#e8203c';
    ctx.beginPath();
    ctx.arc(x, y - bw * 0.86, bw * 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const bw = unit * 1.05;
    const bh = unit * 1.2;
    ctx.fillStyle = '#8f6bff';
    ctx.strokeStyle = '#6844d8';
    ctx.lineWidth = Math.max(1, unit * 0.05);
    ctx.beginPath();
    ctx.roundRect(x - bw / 2, y - bh, bw, bh, bw * 0.12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(x - bw * 0.09, y - bh, bw * 0.18, bh);
    ctx.fillRect(x - bw / 2, y - bh * 0.55, bw, bw * 0.16);
    ctx.beginPath();
    ctx.arc(x - bw * 0.16, y - bh - bw * 0.05, bw * 0.16, 0, Math.PI * 2);
    ctx.arc(x + bw * 0.16, y - bh - bw * 0.05, bw * 0.16, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWorld(
  ctx: CanvasRenderingContext2D,
  s: RunnerState,
  w: number,
  h: number,
  colors: { main: string; accent: string; soft: string },
) {
  const sky = ctx.createLinearGradient(0, 0, 0, h * HORIZON + 10);
  sky.addColorStop(0, colors.main);
  sky.addColorStop(1, colors.soft);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.beginPath();
  ctx.arc(w * 0.78, h * 0.13, w * 0.07, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,.55)';
  for (const [cx, cy, r] of [
    [0.2, 0.1, 0.06],
    [0.32, 0.12, 0.045],
    [0.55, 0.06, 0.05],
  ] as const) {
    const drift = ((s.distance * 0.05 + cx) % 1.2) - 0.1;
    ctx.beginPath();
    ctx.arc(drift * w, cy * h, r * w, 0, Math.PI * 2);
    ctx.arc(drift * w + r * w, cy * h + 4, r * w * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#7fe0a0';
  ctx.beginPath();
  ctx.moveTo(0, h * HORIZON);
  ctx.quadraticCurveTo(w * 0.25, h * (HORIZON - 0.07), w * 0.5, h * HORIZON);
  ctx.quadraticCurveTo(w * 0.78, h * (HORIZON - 0.09), w, h * HORIZON);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();

  const bands = 16;
  const shift = (s.distance * 3.2) % (2 / bands);
  for (let i = -2; i < bands; i++) {
    const d0 = Math.max(0, i / bands + shift);
    const d1 = Math.min(1.3, (i + 1) / bands + shift);
    if (d1 <= 0) continue;
    const k0 = d0 ** 1.6;
    const k1 = d1 ** 1.6;
    const y0 = h * (HORIZON + (GROUND - HORIZON) * k0);
    const y1 = h * (HORIZON + (GROUND - HORIZON) * k1);
    ctx.fillStyle = (i + bands * 4) % 2 === 0 ? '#5fd07c' : '#6ee08a';
    ctx.fillRect(0, y0, w, y1 - y0 + 1);
    ctx.fillStyle = (i + bands * 4) % 2 === 0 ? '#f6e2b8' : '#fff0cf';
    ctx.beginPath();
    ctx.moveTo(w / 2 - roadHalf(k0, w), y0);
    ctx.lineTo(w / 2 + roadHalf(k0, w), y0);
    ctx.lineTo(w / 2 + roadHalf(k1, w), y1 + 1);
    ctx.lineTo(w / 2 - roadHalf(k1, w), y1 + 1);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(255,255,255,.75)';
  ctx.lineWidth = Math.max(2, w * 0.008);
  const farY = h * (HORIZON + (GROUND - HORIZON) * 0.02);
  const nearY = h * (HORIZON + (GROUND - HORIZON) * 1.2);
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(w / 2 + side * roadHalf(0.02, w) * 0.33, farY);
    ctx.lineTo(w / 2 + side * roadHalf(1.2, w) * 0.33, nearY);
    ctx.stroke();
  }

  for (let i = 0; i < 7; i++) {
    const z = 1 - ((i / 7 + s.distance * 0.75) % 1);
    const k = persp(z);
    const scale = 0.12 + 0.88 * k;
    const y = h * (HORIZON + (GROUND - HORIZON) * k);
    for (const side of [-1, 1]) {
      const x = w / 2 + side * (roadHalf(k, w) + w * 0.12 * scale);
      const tw = w * 0.05 * scale;
      ctx.fillStyle = '#8b5a3c';
      ctx.fillRect(x - tw * 0.2, y - tw * 2.2, tw * 0.4, tw * 2.2);
      ctx.fillStyle = side < 0 ? colors.accent : '#3ed598';
      ctx.beginPath();
      ctx.arc(x, y - tw * 2.6, tw * 1.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const objs = [...s.objs].sort((a, b) => b.z - a.z);
  for (const o of objs)
    if (!(o.checked && o.kind === 'star' && o.lane === s.lane)) drawObject(ctx, o, w, h, s.t);
}

export default function RunnerGame() {
  const { group, setGroup, canUse } = useGroup();
  const unlock = useUnlock();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'ready' | 'count' | 'running' | 'done'>('ready');
  const [count, setCount] = useState(3);
  const [hud, setHud] = useState({ stars: 0, combo: 0, progress: 0 });
  const [result, setResult] = useState({
    stars: 3 as 1 | 2 | 3,
    collected: 0,
    spawned: 0,
    best: 0,
  });
  const [stats, setStats] = useState<Stats>(() =>
    readJSON<Stats>(STATS_KEY, { total: 0, best: 0 }),
  );

  const member = group.members.find((m) => m.id === memberId) ?? group.members[0];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const run = useRef<{ s: RunnerState; raf: number; stop: () => void; shake: number } | null>(null);

  const finish = useCallback((s: RunnerState) => {
    const stars = runnerStars(s.stars, s.starsSpawned);
    const previous = readJSON<Stats>(STATS_KEY, { total: 0, best: 0 });
    const next = { total: previous.total + s.stars, best: Math.max(previous.best, s.stars) };
    writeJSON(STATS_KEY, next);
    setStats(next);
    setResult({ stars, collected: s.stars, spawned: s.starsSpawned, best: s.bestCombo });
    setPhase('done');
    sfx.win();
  }, []);

  // Countdown, then the run itself.
  useEffect(() => {
    if (phase !== 'count') return;
    setCount(3);
    speak('¡Listos!');
    const timers = [
      window.setTimeout(() => setCount(2), 800),
      window.setTimeout(() => setCount(1), 1600),
      window.setTimeout(() => setPhase('running'), 2400),
    ];
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running') return;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !stage || !ctx) return;

    const s = createRunner();
    const beat = secondsPerBeat(group.song);
    const bars = Math.ceil((RUN_SECONDS + 2) / (beat * 4));
    const audio = getAudio();
    const backing = scheduleBacking(group.song, (audio?.currentTime ?? 0) + 0.15, bars);
    const state = { s, raf: 0, stop: backing.stop, shake: 0 };
    run.current = state;

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);

    let last = performance.now();
    let hudTick = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      for (const event of stepRunner(s, dt, Math.random)) {
        if (event.type === 'star')
          playNote(76 + Math.min(event.combo, 7) * 2, 0.18, 'triangle', 0.22);
        else if (event.type === 'hop') sfx.pop();
        else if (event.type === 'stumble') {
          sfx.oops();
          state.shake = 0.3;
        }
      }
      state.shake = Math.max(0, state.shake - dt);

      ctx.save();
      if (state.shake > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
      drawWorld(ctx, s, width, height, group.colors);
      ctx.restore();

      const runner = runnerRef.current;
      if (runner) {
        const k = 1;
        const x = laneX(s.lane, k, width);
        const lift = jumpHeight(s) * height * 0.17;
        const wobble = s.stumbleT > 0 ? Math.sin(s.t * 40) * 6 : 0;
        const squash = s.slideT > 0 ? ' scale(1.1, 0.5)' : '';
        runner.style.transform = `translate(${x - runner.offsetWidth / 2 + wobble}px, ${
          height * GROUND - runner.offsetHeight * 0.96 - lift
        }px)${squash}`;
        runner.dataset.sliding = String(s.slideT > 0);
        runner.dataset.jumping = String(jumpHeight(s) > 0);
        runner.dataset.stumble = String(s.stumbleT > 0);
      }

      hudTick += dt;
      if (hudTick > 0.1) {
        hudTick = 0;
        setHud({ stars: s.stars, combo: s.combo, progress: Math.min(1, s.t / RUN_SECONDS) });
      }

      if (s.done) {
        setHud({ stars: s.stars, combo: s.combo, progress: 1 });
        finish(s);
        return;
      }
      state.raf = requestAnimationFrame(frame);
    };
    state.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(state.raf);
      state.stop();
      observer.disconnect();
      run.current = null;
    };
  }, [phase, group.song, group.colors, finish]);

  const steer = useCallback((action: 'left' | 'right' | 'jump' | 'slide') => {
    const state = run.current;
    if (!state) return;
    if (action === 'jump') {
      jump(state.s);
      sfx.tap();
    } else if (action === 'slide') {
      slide(state.s);
      sfx.tap();
    } else {
      moveLane(state.s, action === 'left' ? -1 : 1);
      sfx.tap();
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'jump' | 'slide'> = {
        ArrowLeft: 'left',
        a: 'left',
        ArrowRight: 'right',
        d: 'right',
        ArrowDown: 'slide',
        s: 'slide',
        ArrowUp: 'jump',
        w: 'jump',
        ' ': 'jump',
      };
      const action = map[e.key];
      if (!action || e.repeat) return;
      e.preventDefault();
      steer(action);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steer]);

  const swipe = useRef<{ x: number; y: number } | null>(null);

  return (
    <>
      <PageTitle
        icon="bolt"
        tone="orange"
        title="¡Corre!"
        subtitle={`Con ${group.name}. Salta los pastelitos y deslízate bajo los arcoíris.`}
      />

      <div className="row">
        <Link to={`/games?group=${group.id}`} className="btn btn--ghost btn--small">
          <Icon name="back" /> Juegos
        </Link>
        <span className="badge">
          <Icon name="star" /> {stats.total} en total
        </span>
        {stats.best > 0 && <span className="badge badge--soft">Récord: {stats.best}</span>}
      </div>

      <div
        className="runner"
        ref={stageRef}
        style={{ '--g': group.colors.main } as CSSProperties}
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start || phase !== 'running') return;
          const dx = e.clientX - start.x;
          const dy = e.clientY - start.y;
          if (Math.abs(dx) > 28 || Math.abs(dy) > 28) {
            if (Math.abs(dx) > Math.abs(dy)) steer(dx < 0 ? 'left' : 'right');
            else steer(dy < 0 ? 'jump' : 'slide');
          } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const fraction = (e.clientX - rect.left) / rect.width;
            steer(fraction < 0.33 ? 'left' : fraction > 0.67 ? 'right' : 'jump');
          }
        }}
      >
        <canvas ref={canvasRef} className="runner__canvas" />

        {member && phase !== 'ready' && (
          <div className="runner__me" ref={runnerRef}>
            <Idol member={member} label="" />
          </div>
        )}

        {phase === 'running' && (
          <div className="runner__hud">
            <span className="badge">
              <Icon name="star" /> {hud.stars}
            </span>
            {hud.combo >= 3 && <span className="badge badge--combo">¡Racha x{hud.combo}!</span>}
            <span className="runner__bar" aria-hidden="true">
              <i style={{ width: `${hud.progress * 100}%` }} />
            </span>
          </div>
        )}

        {phase === 'count' && (
          <div className="runner__overlay">
            <span className="runner__count" key={count}>
              {count}
            </span>
          </div>
        )}

        {phase === 'ready' && (
          <div className="runner__overlay runner__overlay--start">
            <h2>¿Quién corre hoy?</h2>
            <div className="runner__pick" role="radiogroup" aria-label="Personaje">
              {group.members.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={m.id === member?.id}
                  className="runner__who"
                  onClick={() => {
                    setMemberId(m.id);
                    speak(m.name);
                  }}
                >
                  <Idol member={m} label="" />
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
            <div className="runner__groups" role="radiogroup" aria-label="Grupo">
              {GROUPS.map((g) => {
                const usable = canUse(g);
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="radio"
                    aria-checked={g.id === group.id}
                    className="chip"
                    onClick={() => {
                      if (usable) {
                        setMemberId(null);
                        setGroup(g.id);
                      } else unlock();
                    }}
                  >
                    {!usable && <Icon name="lock" />} {g.name}
                  </button>
                );
              })}
            </div>
            <button type="button" className="btn btn--green" onClick={() => setPhase('count')}>
              <Icon name="play" /> ¡Vamos!
            </button>
            <p className="small">Desliza en cualquier dirección: arriba salta, abajo se desliza.</p>
          </div>
        )}
      </div>

      <div className="runner__controls">
        <button
          type="button"
          className="btn btn--blue runner__btn"
          onPointerDown={() => steer('left')}
          aria-label="Izquierda"
        >
          <Icon name="back" />
        </button>
        <button
          type="button"
          className="btn btn--yellow runner__btn"
          onPointerDown={() => steer('jump')}
          aria-label="Saltar"
        >
          <Icon name="back" style={{ transform: 'rotate(90deg)' }} />
        </button>
        <button
          type="button"
          className="btn btn--green runner__btn"
          onPointerDown={() => steer('slide')}
          aria-label="Deslizarse"
        >
          <Icon name="back" style={{ transform: 'rotate(-90deg)' }} />
        </button>
        <button
          type="button"
          className="btn btn--blue runner__btn"
          onPointerDown={() => steer('right')}
          aria-label="Derecha"
        >
          <Icon name="back" style={{ transform: 'rotate(180deg)' }} />
        </button>
      </div>

      {phase === 'done' && (
        <GameResults
          group={group.id}
          stars={result.stars}
          message="¡Qué carrera!"
          detail={`Juntaste ${result.collected} estrellas. Tu mejor racha fue de ${result.best}.`}
          onAgain={() => setPhase('count')}
          onClose={() => setPhase('ready')}
        />
      )}
    </>
  );
}
