import type { Rng } from '../lib/rng';

export type Lane = 0 | 1 | 2;
export type Kind = 'star' | 'bump' | 'block' | 'arch';

export interface RunObject {
  id: number;
  lane: Lane;
  z: number; // 1 = far away at the horizon, 0 = where the runner stands
  kind: Kind;
  checked: boolean;
}

export type RunEvent =
  | { type: 'star'; combo: number }
  | { type: 'hop' }
  | { type: 'stumble' }
  | { type: 'done' };

export interface RunnerState {
  t: number;
  lane: Lane;
  jumpT: number; // -1 when on the ground, otherwise seconds since take-off
  stumbleT: number; // seconds left of the wobble after bumping into something
  slideT: number; // seconds left of the slide, 0 when standing
  objs: RunObject[];
  stars: number;
  starsSpawned: number;
  combo: number;
  bestCombo: number;
  bumps: number;
  distance: number;
  nextRow: number;
  trailLane: Lane;
  nextId: number;
  done: boolean;
}

export const RUN_SECONDS = 70;
export const JUMP_SECONDS = 0.72;
export const SLIDE_SECONDS = 0.7;
const STUMBLE_SECONDS = 0.7;
const BASE_SPEED = 0.55; // depth units per second: about 1.8 s from horizon to runner
const MAX_SPEED = 0.95;

export const speedAt = (t: number) =>
  BASE_SPEED + (MAX_SPEED - BASE_SPEED) * Math.min(1, t / RUN_SECONDS);
export const jumpHeight = (s: RunnerState) =>
  s.jumpT >= 0 && s.jumpT < JUMP_SECONDS ? Math.sin((Math.PI * s.jumpT) / JUMP_SECONDS) : 0;

export function createRunner(): RunnerState {
  return {
    t: 0,
    lane: 1,
    jumpT: -1,
    stumbleT: 0,
    slideT: 0,
    objs: [],
    stars: 0,
    starsSpawned: 0,
    combo: 0,
    bestCombo: 0,
    bumps: 0,
    distance: 0,
    nextRow: 0,
    trailLane: 1,
    nextId: 0,
    done: false,
  };
}

export function moveLane(s: RunnerState, dir: -1 | 1): void {
  s.lane = Math.max(0, Math.min(2, s.lane + dir)) as Lane;
}

export function jump(s: RunnerState): void {
  s.slideT = 0;
  if (s.jumpT < 0 || s.jumpT >= JUMP_SECONDS) s.jumpT = 0;
}

// Sliding is only possible on the ground; it lets the runner pass under the rainbow arches.
export function slide(s: RunnerState): void {
  if (s.jumpT < 0 || s.jumpT >= JUMP_SECONDS) s.slideT = SLIDE_SECONDS;
}

const lanes: Lane[] = [0, 1, 2];

function add(s: RunnerState, lane: Lane, kind: Kind) {
  s.objs.push({ id: s.nextId++, lane, z: 1, kind, checked: false });
  if (kind === 'star') s.starsSpawned++;
}

// Every row is friendly: there is always a free lane, and there is nearly always a star to chase.
function spawnRow(s: RunnerState, rng: Rng) {
  const roll = rng();
  if (roll < 0.34) {
    if (rng() < 0.3)
      s.trailLane = Math.max(0, Math.min(2, s.trailLane + (rng() < 0.5 ? -1 : 1))) as Lane;
    add(s, s.trailLane, 'star');
  } else if (roll < 0.86) {
    const lane = lanes[Math.floor(rng() * 3)] as Lane;
    add(s, lane, rng() < 0.5 ? 'bump' : 'arch');
    const other = lanes.filter((l) => l !== lane);
    add(s, other[Math.floor(rng() * other.length)] as Lane, 'star');
  } else {
    const blocked = lanes[Math.floor(rng() * 3)] as Lane;
    add(s, blocked, 'block');
    const free = lanes.filter((l) => l !== blocked);
    s.trailLane = free[Math.floor(rng() * free.length)] as Lane;
    add(s, s.trailLane, 'star');
  }
}

export function stepRunner(s: RunnerState, dt: number, rng: Rng): RunEvent[] {
  const events: RunEvent[] = [];
  if (s.done) return events;

  s.t += dt;
  if (s.jumpT >= 0) {
    s.jumpT += dt;
    if (s.jumpT >= JUMP_SECONDS) s.jumpT = -1;
  }
  s.stumbleT = Math.max(0, s.stumbleT - dt);
  s.slideT = Math.max(0, s.slideT - dt);

  const speed = speedAt(s.t) * (s.stumbleT > 0 ? 0.6 : 1);
  s.distance += speed * dt;
  const finishing = s.t > RUN_SECONDS - 2.6;
  while (!finishing && s.distance >= s.nextRow) {
    spawnRow(s, rng);
    s.nextRow += 0.26 - 0.07 * Math.min(1, s.t / RUN_SECONDS);
  }

  for (const o of s.objs) {
    o.z -= speed * dt;
    if (o.checked || o.z > 0) continue;
    o.checked = true;
    if (o.lane !== s.lane) continue;

    if (o.kind === 'star') {
      s.stars++;
      s.combo++;
      s.bestCombo = Math.max(s.bestCombo, s.combo);
      events.push({ type: 'star', combo: s.combo });
    } else if (
      (o.kind === 'bump' && jumpHeight(s) > 0.35) ||
      (o.kind === 'arch' && s.slideT > 0)
    ) {
      s.stars++;
      events.push({ type: 'hop' });
    } else if (s.stumbleT <= 0) {
      s.stumbleT = STUMBLE_SECONDS;
      s.combo = 0;
      s.bumps++;
      events.push({ type: 'stumble' });
    }
  }
  s.objs = s.objs.filter((o) => o.z > -0.25);

  if (s.t >= RUN_SECONDS) {
    s.done = true;
    events.push({ type: 'done' });
  }
  return events;
}

// Nobody fails: the least you get is one star.
export function runnerStars(collected: number, spawned: number): 1 | 2 | 3 {
  if (spawned === 0) return 3;
  const ratio = collected / spawned;
  if (ratio >= 0.72) return 3;
  if (ratio >= 0.4) return 2;
  return 1;
}
