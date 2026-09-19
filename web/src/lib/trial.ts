import { readJSON, writeJSON } from './storage';

export const TRIAL_MS = 5 * 60 * 1000;
export const MAX_TRIALS_PER_DAY = 3;
const TRIAL_KEY = 'trialData';

export interface TrialData {
  date: string;
  count: number;
  activeUntil: number;
}

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fresh = (now: number): TrialData => ({
  date: dayKey(new Date(now)),
  count: 0,
  activeUntil: 0,
});

export function loadTrial(now = Date.now()): TrialData {
  const data = readJSON<TrialData | null>(TRIAL_KEY, null);
  if (!data || data.date !== dayKey(new Date(now))) return fresh(now);
  return data;
}

export const saveTrial = (data: TrialData) => writeJSON(TRIAL_KEY, data);

export const isTrialActive = (data: TrialData, now = Date.now()) => now < data.activeUntil;

// Returns null when today's free tries are used up.
export function startTrial(data: TrialData, now = Date.now()): TrialData | null {
  if (data.count >= MAX_TRIALS_PER_DAY) return null;
  return { date: dayKey(new Date(now)), count: data.count + 1, activeUntil: now + TRIAL_MS };
}

export const stopTrial = (data: TrialData): TrialData => ({ ...data, activeUntil: 0 });
