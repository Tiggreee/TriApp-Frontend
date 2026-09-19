import { type Rng, seeded } from '../lib/rng';
import { BEATS_PER_BAR, type Song, secondsPerBeat } from '../lib/sound';

export type Difficulty = 'easy' | 'normal';
export type Lane = 0 | 1 | 2 | 3;

export interface ChartNote {
  id: number;
  time: number; // seconds from the start of the backing track
  lane: Lane;
}

export const SONG_BARS = 10;
export const FALL_SECONDS = 2.1;
export const PERFECT_WINDOW = 0.14;
export const GOOD_WINDOW = 0.32;

export type Judgement = 'perfect' | 'good';

export function judge(delta: number): Judgement | null {
  const d = Math.abs(delta);
  if (d <= PERFECT_WINDOW) return 'perfect';
  if (d <= GOOD_WINDOW) return 'good';
  return null;
}

// One bar of lead-in, then notes on the beat (easy) or on the beat and half-beats (normal),
// leaving the last bar empty so the song can breathe before the results.
export function buildChart(
  song: Song,
  seed: number,
  difficulty: Difficulty = 'easy',
  bars = SONG_BARS,
): ChartNote[] {
  const rng: Rng = seeded(seed);
  const beat = secondsPerBeat(song);
  const notes: ChartNote[] = [];
  const step = difficulty === 'easy' ? 1 : 0.5;
  const chance = difficulty === 'easy' ? 0.7 : 0.55;
  let previous: Lane = 1;
  let repeats = 0;

  for (let b = BEATS_PER_BAR; b < (bars - 1) * BEATS_PER_BAR; b += step) {
    if (rng() > chance) continue;
    let lane = Math.floor(rng() * 4) as Lane;
    if (lane === previous && repeats >= 1) lane = ((lane + 1 + Math.floor(rng() * 3)) % 4) as Lane;
    repeats = lane === previous ? repeats + 1 : 0;
    previous = lane;
    notes.push({ id: notes.length, time: b * beat, lane });
  }
  return notes;
}

export const songLength = (song: Song, bars = SONG_BARS) =>
  bars * BEATS_PER_BAR * secondsPerBeat(song);

// Kids never "fail": everyone gets at least one star.
export function starsFor(hits: number, total: number): 1 | 2 | 3 {
  if (total === 0) return 3;
  const ratio = hits / total;
  if (ratio >= 0.8) return 3;
  if (ratio >= 0.45) return 2;
  return 1;
}
