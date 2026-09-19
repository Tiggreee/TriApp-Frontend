import { readString, writeString } from './storage';

const SOUND_KEY = 'sound';
let enabled = readString(SOUND_KEY) !== 'off';
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

export const isSoundOn = () => enabled;

export function setSoundOn(value: boolean) {
  enabled = value;
  writeString(SOUND_KEY, value ? 'on' : 'off');
  if (!value && typeof window !== 'undefined') window.speechSynthesis?.cancel();
}

export function getAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export const midiToFreq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function tone(
  c: AudioContext,
  dest: AudioNode,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  peak: number,
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(dest);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

function noiseBurst(
  c: AudioContext,
  dest: AudioNode,
  start: number,
  duration: number,
  peak: number,
  highpass: number,
) {
  noise ??= (() => {
    const buffer = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  })();
  const src = c.createBufferSource();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  src.buffer = noise;
  filter.type = 'highpass';
  filter.frequency.value = highpass;
  gain.gain.setValueAtTime(peak, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(gain).connect(dest);
  src.start(start);
  src.stop(start + duration + 0.05);
}

export function playNote(
  midi: number,
  duration = 0.28,
  type: OscillatorType = 'triangle',
  peak = 0.22,
) {
  if (!enabled) return;
  const c = getAudio();
  if (c) tone(c, c.destination, midiToFreq(midi), c.currentTime, duration, type, peak);
}

export const sfx = {
  tap: () => playNote(84, 0.1, 'sine', 0.16),
  pop: () => playNote(88, 0.14, 'triangle', 0.2),
  flip: () => playNote(76, 0.12, 'triangle', 0.18),
  oops: () => {
    playNote(60, 0.22, 'sine', 0.18);
  },
  match: () => {
    playNote(79, 0.16);
    setTimeout(() => playNote(84, 0.24), 110);
  },
  win: () => {
    for (const [i, m] of [72, 76, 79, 84, 88].entries()) {
      setTimeout(() => playNote(m, 0.3, 'triangle', 0.24), i * 110);
    }
  },
};

export interface Song {
  bpm: number;
  root: number; // MIDI note of the tonic
  lanes: [number, number, number, number]; // semitone offsets above the root, one per lane
  bass: number[]; // 16 sixteenth-note steps; semitone offset above root - 24, or -1 for silence
}

export const BEATS_PER_BAR = 4;
export const secondsPerBeat = (song: Song) => 60 / song.bpm;

// Schedules kick, clap, hats and bass for `bars` bars, starting at `startAt` (audio clock).
export function scheduleBacking(song: Song, startAt: number, bars: number) {
  const c = getAudio();
  if (!c || !enabled) return { stop: () => {} };

  const master = c.createGain();
  master.gain.value = 0.9;
  master.connect(c.destination);

  const step = secondsPerBeat(song) / 4;
  for (let bar = 0; bar < bars; bar++) {
    for (let s = 0; s < 16; s++) {
      const at = startAt + (bar * 16 + s) * step;
      if (s % 4 === 0) {
        const kick = c.createOscillator();
        const g = c.createGain();
        kick.frequency.setValueAtTime(150, at);
        kick.frequency.exponentialRampToValueAtTime(45, at + 0.12);
        g.gain.setValueAtTime(0.5, at);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
        kick.connect(g).connect(master);
        kick.start(at);
        kick.stop(at + 0.2);
      }
      if (s === 4 || s === 12) noiseBurst(c, master, at, 0.12, 0.22, 1200);
      if (s % 2 === 1) noiseBurst(c, master, at, 0.04, 0.07, 7000);
      const bassStep = song.bass[s] ?? -1;
      if (bassStep >= 0)
        tone(c, master, midiToFreq(song.root - 24 + bassStep), at, step * 1.6, 'sine', 0.32);
    }
  }

  return {
    stop: () => {
      master.gain.cancelScheduledValues(c.currentTime);
      master.gain.setValueAtTime(0.0001, c.currentTime);
      setTimeout(() => master.disconnect(), 200);
    },
  };
}
