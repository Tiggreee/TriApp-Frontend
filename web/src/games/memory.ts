import { type Rng, shuffle } from '../lib/rng';

export interface MemoryState {
  deck: string[]; // member id per card position
  flipped: number[]; // positions currently face up and unresolved
  matched: string[]; // member ids already paired
  moves: number;
}

export type MemoryAction =
  | { type: 'flip'; index: number }
  | { type: 'resolve' }
  | { type: 'reset'; state: MemoryState };

export function createMemory(
  memberIds: readonly string[],
  pairs: number,
  rng: Rng = Math.random,
): MemoryState {
  const chosen = shuffle(memberIds, rng).slice(0, pairs);
  return { deck: shuffle([...chosen, ...chosen], rng), flipped: [], matched: [], moves: 0 };
}

export function memoryReducer(state: MemoryState, action: MemoryAction): MemoryState {
  if (action.type === 'reset') return action.state;

  if (action.type === 'flip') {
    const id = state.deck[action.index];
    if (id === undefined || state.matched.includes(id)) return state;
    if (state.flipped.includes(action.index) || state.flipped.length >= 2) return state;
    const flipped = [...state.flipped, action.index];
    return { ...state, flipped, moves: flipped.length === 2 ? state.moves + 1 : state.moves };
  }

  if (state.flipped.length !== 2) return state;
  const [a, b] = state.flipped as [number, number];
  const same = state.deck[a] === state.deck[b];
  return {
    ...state,
    flipped: [],
    matched: same ? [...state.matched, state.deck[a] as string] : state.matched,
  };
}

export const isMemoryDone = (state: MemoryState) =>
  state.deck.length > 0 && state.matched.length * 2 === state.deck.length;

// No penalty for mistakes; stars only reward tidy play.
export function memoryStars(moves: number, pairs: number): 1 | 2 | 3 {
  if (moves <= Math.ceil(pairs * 1.6)) return 3;
  if (moves <= pairs * 2.6) return 2;
  return 1;
}
