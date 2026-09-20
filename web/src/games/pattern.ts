import { type Rng, shuffle } from '../lib/rng';

export const PIECE_COLORS = ['#ff5fa2', '#3aa7ff', '#ffd23f', '#3ed598', '#8f6bff'] as const;
export const PATTERN_ROUNDS = 8;

export interface PatternRound {
  sequence: number[]; // color index per position
  blanks: number[]; // positions the player has to fill, in order
  tray: number[]; // pieces on offer (the needed ones plus decoys), color index each
}

// Pattern shapes get longer and trickier every round: AB, AAB, ABC, ABBC, ABCD...
const SHAPES: number[][] = [
  [0, 1],
  [0, 0, 1],
  [0, 1, 2],
  [0, 1, 1],
  [0, 1, 2, 2],
  [0, 0, 1, 2],
  [0, 1, 2, 3],
  [0, 1, 0, 2, 3],
];

export function createPatternRound(round: number, rng: Rng = Math.random): PatternRound {
  const index = Math.min(round, SHAPES.length - 1);
  const shape = SHAPES[index] as number[];
  const colors = shuffle([0, 1, 2, 3, 4], rng);
  const length = Math.min(9, 5 + Math.floor(round * 0.6) + (shape.length > 3 ? 1 : 0));
  const sequence = Array.from(
    { length },
    (_, i) => colors[shape[i % shape.length] as number] as number,
  );

  // Hide only later positions so the repeating unit is always visible at least once.
  const firstBlank = shape.length;
  const wanted = Math.min(length - firstBlank, 1 + Math.floor(round / 2));
  const blanks = Array.from({ length: wanted }, (_, i) => length - wanted + i);

  const needed = blanks.map((b) => sequence[b] as number);
  const decoys = shuffle(
    [0, 1, 2, 3, 4].filter((c) => !needed.includes(c)),
    rng,
  ).slice(0, Math.max(1, 3 - Math.floor(round / 3)));
  return { sequence, blanks, tray: shuffle([...needed, ...decoys], rng) };
}

export const patternStars = (mistakes: number): 1 | 2 | 3 =>
  mistakes <= 2 ? 3 : mistakes <= 7 ? 2 : 1;
