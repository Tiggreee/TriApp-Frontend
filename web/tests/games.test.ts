import { PATTERN_ROUNDS, createPatternRound } from '../src/games/pattern';
import { describe, expect, it } from 'vitest';
import { GROUPS } from '../src/data/groups';
import {
  buildChart,
  GOOD_WINDOW,
  judge,
  PERFECT_WINDOW,
  SONG_BARS,
  starsFor,
} from '../src/games/chart';
import { createMemory, isMemoryDone, memoryReducer, memoryStars } from '../src/games/memory';
import {
  createRunner,
  jump,
  moveLane,
  type RunnerState,
  runnerStars,
  slide,
  stepRunner,
} from '../src/games/runner';
import {
  finishShowing,
  MAX_ROUND,
  pressPad,
  type SimonState,
  simonStars,
  startSimon,
} from '../src/games/simon';
import { checkGateAnswer, makeGateChallenge } from '../src/lib/gate';
import { seeded } from '../src/lib/rng';
import { BEATS_PER_BAR, secondsPerBeat } from '../src/lib/sound';

describe('rhythm chart', () => {
  const song = GROUPS[0]!.song;

  it('is deterministic per seed and stays inside the playable bars', () => {
    const a = buildChart(song, 7);
    const b = buildChart(song, 7);
    expect(a).toEqual(b);
    const first = BEATS_PER_BAR * secondsPerBeat(song);
    const last = (SONG_BARS - 1) * BEATS_PER_BAR * secondsPerBeat(song);
    for (const n of a) {
      expect(n.time).toBeGreaterThanOrEqual(first);
      expect(n.time).toBeLessThan(last);
      expect([0, 1, 2, 3]).toContain(n.lane);
    }
  });

  it('easy has fewer, slower notes than normal', () => {
    const easy = buildChart(song, 3, 'easy');
    const normal = buildChart(song, 3, 'normal');
    expect(easy.length).toBeGreaterThan(8);
    expect(normal.length).toBeGreaterThan(easy.length);
    const gaps = easy.slice(1).map((n, i) => n.time - easy[i]!.time);
    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(secondsPerBeat(song) - 1e-9);
  });

  it('judges generously and gives at least one star', () => {
    expect(judge(0)).toBe('perfect');
    expect(judge(PERFECT_WINDOW)).toBe('perfect');
    expect(judge(-GOOD_WINDOW)).toBe('good');
    expect(judge(GOOD_WINDOW + 0.01)).toBeNull();
    expect(starsFor(0, 20)).toBe(1);
    expect(starsFor(10, 20)).toBe(2);
    expect(starsFor(18, 20)).toBe(3);
  });
});

describe('memory', () => {
  const ids = GROUPS[0]!.members.map((m) => m.id);

  it('deals each chosen member exactly twice', () => {
    const state = createMemory(ids, 3, seeded(1));
    expect(state.deck).toHaveLength(6);
    for (const id of new Set(state.deck))
      expect(state.deck.filter((d) => d === id)).toHaveLength(2);
  });

  it('matches pairs, ignores extra taps, and finishes', () => {
    let state = createMemory(ids, 2, seeded(2));
    for (const id of new Set(state.deck)) {
      const [i, j] = state.deck.flatMap((d, idx) => (d === id ? [idx] : []));
      state = memoryReducer(state, { type: 'flip', index: i! });
      state = memoryReducer(state, { type: 'flip', index: j! });
      expect(memoryReducer(state, { type: 'flip', index: 0 })).toBe(state);
      state = memoryReducer(state, { type: 'resolve' });
    }
    expect(state.moves).toBe(2);
    expect(isMemoryDone(state)).toBe(true);
    expect(memoryStars(state.moves, 2)).toBe(3);
  });

  it('turns a mismatch back over without punishment', () => {
    let state = createMemory(ids, 2, seeded(2));
    const other = state.deck.findIndex((d) => d !== state.deck[0]);
    state = memoryReducer(state, { type: 'flip', index: 0 });
    state = memoryReducer(state, { type: 'flip', index: other });
    state = memoryReducer(state, { type: 'resolve' });
    expect(state.flipped).toEqual([]);
    expect(state.matched).toEqual([]);
  });
});

describe('dance (simon)', () => {
  it('grows each round and wins at the last one', () => {
    let state: SimonState = startSimon(seeded(5));
    for (let round = 1; round <= MAX_ROUND; round++) {
      expect(state.sequence).toHaveLength(round);
      state = finishShowing(state);
      let result = 'ok';
      for (const pad of [...state.sequence]) {
        ({ state, result } = pressPad(state, pad, seeded(round)) as never);
      }
      expect(result).toBe(round === MAX_ROUND ? 'win' : 'round');
    }
    expect(state.phase).toBe('won');
    expect(simonStars(state.mistakes)).toBe(3);
  });

  it('replays the round after a mistake instead of ending the game', () => {
    let state = finishShowing(startSimon(seeded(9)));
    const wrong = (state.sequence[0]! + 1) % 4;
    const out = pressPad(state, wrong);
    expect(out.result).toBe('wrong');
    expect(out.state.phase).toBe('showing');
    expect(out.state.sequence).toEqual(state.sequence);
    expect(out.state.mistakes).toBe(1);
    state = out.state;
    expect(pressPad(state, 0).result).toBe('ignored');
  });
});

describe('parent gate', () => {
  it('accepts only the right answer', () => {
    const challenge = makeGateChallenge(seeded(4));
    expect(checkGateAnswer(challenge, String(challenge.answer))).toBe(true);
    expect(checkGateAnswer(challenge, ` ${challenge.answer} `)).toBe(true);
    expect(checkGateAnswer(challenge, String(challenge.answer + 1))).toBe(false);
    expect(checkGateAnswer(challenge, '')).toBe(false);
  });
});

describe('runner', () => {
  const play = (steer: (s: RunnerState) => void, seed = 11) => {
    const rng = seeded(seed);
    const s = createRunner();
    for (let i = 0; i < 70 * 60 + 200 && !s.done; i++) {
      steer(s);
      stepRunner(s, 1 / 60, rng);
    }
    return s;
  };

  it('always leaves a free lane and ends after the run', () => {
    const rng = seeded(3);
    const s = createRunner();
    let rows = 0;
    while (!s.done) {
      stepRunner(s, 1 / 30, rng);
      for (const z of new Set(s.objs.filter((o) => o.z > 0.98).map((o) => o.z))) {
        const blocking = s.objs.filter((o) => o.z === z && o.kind !== 'star').length;
        expect(blocking).toBeLessThan(3);
        rows++;
      }
    }
    expect(rows).toBeGreaterThan(20);
    expect(s.t).toBeGreaterThanOrEqual(70);
  });

  it('collects stars in the chased lane and never ends early after a bump', () => {
    const chaser = play((s) => {
      const next = s.objs
        .filter((o) => o.kind === 'star' && !o.checked && o.z > 0)
        .sort((a, b) => a.z - b.z)[0];
      if (next) s.lane = next.lane;
    });
    const idle = play(() => {});
    expect(chaser.stars).toBeGreaterThan(idle.stars);
    expect(runnerStars(chaser.stars, chaser.starsSpawned)).toBeGreaterThanOrEqual(2);
    expect(runnerStars(0, 50)).toBe(1);
    expect(idle.done).toBe(true);
  });

  it('lets a jump clear the cupcakes but not the gift boxes', () => {
    const rng = seeded(1);
    const s = createRunner();
    s.objs.push({ id: 1, lane: 1, z: 0.005, kind: 'bump', checked: false });
    jump(s);
    s.jumpT = 0.36;
    expect(stepRunner(s, 0.02, rng).map((e) => e.type)).toContain('hop');
    s.jumpT = -1;
    s.objs.push({ id: 2, lane: 1, z: 0.005, kind: 'block', checked: false });
    expect(stepRunner(s, 0.02, rng).map((e) => e.type)).toContain('stumble');
    expect(s.bumps).toBe(1);
  });

  it('keeps the runner inside the three lanes', () => {
    const s = createRunner();
    moveLane(s, -1);
    moveLane(s, -1);
    moveLane(s, -1);
    expect(s.lane).toBe(0);
    for (let i = 0; i < 5; i++) moveLane(s, 1);
    expect(s.lane).toBe(2);
  });
});

describe('runner slide', () => {
  it('lets a slide pass under the arches but a standing runner stumbles', () => {
    const rng = seeded(1);
    const s = createRunner();
    s.objs.push({ id: 1, lane: 1, z: 0.005, kind: 'arch', checked: false });
    slide(s);
    expect(stepRunner(s, 0.02, rng).map((e) => e.type)).toContain('hop');
    s.slideT = 0;
    s.objs.push({ id: 2, lane: 1, z: 0.005, kind: 'arch', checked: false });
    expect(stepRunner(s, 0.02, rng).map((e) => e.type)).toContain('stumble');
  });
});

describe('pattern puzzle', () => {
  it('builds solvable rounds that get longer', () => {
    for (let round = 0; round < PATTERN_ROUNDS; round++) {
      const p = createPatternRound(round, seeded(round + 3));
      expect(p.blanks.length).toBeGreaterThan(0);
      expect(p.tray.length).toBeGreaterThanOrEqual(p.blanks.length);
      const needed = p.blanks.map((b) => p.sequence[b]).sort();
      const offered = [...p.tray].sort();
      for (const c of needed) expect(offered).toContain(c);
      expect(Math.min(...p.blanks)).toBeGreaterThanOrEqual(2);
    }
    expect(createPatternRound(7, seeded(1)).sequence.length).toBeGreaterThan(
      createPatternRound(0, seeded(1)).sequence.length,
    );
  });
});
