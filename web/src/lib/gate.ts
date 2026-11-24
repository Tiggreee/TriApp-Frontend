import type { Rng } from './rng';

export interface GateChallenge {
  question: string;
  answer: number;
}

// A grown-up puzzle: easy for an adult, out of reach for a 3–5 year old.
export function makeGateChallenge(rng: Rng = Math.random): GateChallenge {
  const a = 11 + Math.floor(rng() * 8);
  const b = 3 + Math.floor(rng() * 6);
  const c = 7 + Math.floor(rng() * 12);
  return { question: `${a} × ${b} − ${c}`, answer: a * b - c };
}

export function checkGateAnswer(challenge: GateChallenge, input: string): boolean {
  return input.trim() !== '' && Number(input.trim()) === challenge.answer;
}
