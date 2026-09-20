import type { Rng } from '../lib/rng';

export const PADS = 4;
export const MAX_ROUND = 10;

export interface SimonState {
  phase: 'idle' | 'showing' | 'input' | 'won';
  sequence: number[];
  position: number;
  mistakes: number;
}

export type PressResult = 'ok' | 'round' | 'wrong' | 'win' | 'ignored';

export const initialSimon: SimonState = { phase: 'idle', sequence: [], position: 0, mistakes: 0 };

const randomPad = (rng: Rng) => Math.floor(rng() * PADS);

export function startSimon(rng: Rng = Math.random): SimonState {
  return { phase: 'showing', sequence: [randomPad(rng)], position: 0, mistakes: 0 };
}

export function finishShowing(state: SimonState): SimonState {
  return state.phase === 'showing' ? { ...state, phase: 'input', position: 0 } : state;
}

// A wrong pad never ends the game: the dance is replayed from the start of the round.
export function pressPad(
  state: SimonState,
  pad: number,
  rng: Rng = Math.random,
): { state: SimonState; result: PressResult } {
  if (state.phase !== 'input') return { state, result: 'ignored' };

  if (state.sequence[state.position] !== pad) {
    return {
      state: { ...state, phase: 'showing', position: 0, mistakes: state.mistakes + 1 },
      result: 'wrong',
    };
  }

  const position = state.position + 1;
  if (position < state.sequence.length) return { state: { ...state, position }, result: 'ok' };

  if (state.sequence.length >= MAX_ROUND) {
    return { state: { ...state, phase: 'won', position }, result: 'win' };
  }
  return {
    state: {
      ...state,
      phase: 'showing',
      position: 0,
      sequence: [...state.sequence, randomPad(rng)],
    },
    result: 'round',
  };
}

export function simonStars(mistakes: number): 1 | 2 | 3 {
  if (mistakes <= 1) return 3;
  if (mistakes <= 4) return 2;
  return 1;
}
