// Pitch detection for the tuner. Pure functions so they can be tested with synthetic tones.

export const MIN_HZ = 150;
export const MAX_HZ = 1200;
const YIN_THRESHOLD = 0.15;
const MIN_RMS = 0.012;

export function rms(buffer: ArrayLike<number>): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) sum += (buffer[i] ?? 0) ** 2;
  return Math.sqrt(sum / buffer.length);
}

/**
 * Estimates the fundamental frequency (Hz) of a mono buffer with the YIN algorithm.
 * Returns null when the signal is too quiet or has no clear pitch.
 */
export function detectPitch(buffer: ArrayLike<number>, sampleRate: number): number | null {
  if (rms(buffer) < MIN_RMS) return null;

  const half = Math.floor(buffer.length / 2);
  const tauMin = Math.max(2, Math.floor(sampleRate / MAX_HZ));
  const tauMax = Math.min(half - 1, Math.floor(sampleRate / MIN_HZ));
  if (tauMax <= tauMin) return null;

  // Difference function, normalised by its cumulative mean.
  const cmnd = new Float32Array(tauMax + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    let sum = 0;
    for (let i = 0; i < half; i++) {
      const delta = (buffer[i] ?? 0) - (buffer[i + tau] ?? 0);
      sum += delta * delta;
    }
    running += sum;
    cmnd[tau] = running === 0 ? 1 : (sum * tau) / running;
  }

  // First dip under the threshold, followed down to its local minimum.
  let tau = -1;
  for (let t = tauMin; t <= tauMax; t++) {
    if ((cmnd[t] ?? 1) < YIN_THRESHOLD) {
      while (t + 1 <= tauMax && (cmnd[t + 1] ?? 1) < (cmnd[t] ?? 1)) t++;
      tau = t;
      break;
    }
  }
  if (tau === -1) return null;

  // Parabolic interpolation for sub-sample accuracy.
  const a = cmnd[tau - 1] ?? 1;
  const b = cmnd[tau] ?? 1;
  const c = tau + 1 <= tauMax ? (cmnd[tau + 1] ?? b) : b;
  const denom = a - 2 * b + c;
  const refined = denom === 0 ? tau : tau + (a - c) / (2 * denom);
  return sampleRate / refined;
}

/** Distance from `target` to `freq` in cents (100 cents = one semitone). Positive = too high. */
export function centsOff(freq: number, target: number): number {
  return 1200 * Math.log2(freq / target);
}

export type TuneState = 'low' | 'ok' | 'high';

/** Within ±6 cents counts as in tune, which is plenty for a ukulele. */
export const IN_TUNE_CENTS = 6;

export function tuneState(cents: number): TuneState {
  if (Math.abs(cents) <= IN_TUNE_CENTS) return 'ok';
  return cents < 0 ? 'low' : 'high';
}

export function median(values: number[]): number {
  const sorted = [...values].sort((x, y) => x - y);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? (sorted[mid] ?? 0) : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
}

const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Frequency in Hz of a note name such as "F#4" or "Bb4", in equal temperament with A4 = 440 Hz. */
export function noteToHz(note: string): number {
  const match = /^([A-G])([#b]?)(-?\d+)$/.exec(note);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const [, letter = 'A', accidental = '', octave = '4'] = match;
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
  const midi = (Number(octave) + 1) * 12 + (SEMITONES[letter] ?? 0) + shift;
  return 440 * 2 ** ((midi - 69) / 12);
}

/** Index of the target closest to `freq`, with its distance in cents. */
export function nearestTarget(freq: number, targets: number[]): { index: number; cents: number } {
  let best = { index: 0, cents: Number.POSITIVE_INFINITY };
  targets.forEach((target, index) => {
    const cents = centsOff(freq, target);
    if (Math.abs(cents) < Math.abs(best.cents)) best = { index, cents };
  });
  return best;
}
