import { describe, expect, it } from 'vitest';
import { INSTRUMENTS } from '../src/data/instruments';
import { centsOff, detectPitch, tuneState } from '../src/lib/pitch';

const SAMPLE_RATE = 48000;

function tone(hz: number, size = 4096, amplitude = 0.5, harmonics = false) {
  const buffer = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    const t = (2 * Math.PI * hz * i) / SAMPLE_RATE;
    buffer[i] =
      amplitude * (Math.sin(t) + (harmonics ? 0.5 * Math.sin(2 * t) + 0.25 * Math.sin(3 * t) : 0));
  }
  return buffer;
}

describe('pitch detection', () => {
  it('finds every sopranino string within 1 Hz', () => {
    for (const string of INSTRUMENTS[0].strings) {
      const hz = detectPitch(tone(string.hz), SAMPLE_RATE);
      expect(hz).not.toBeNull();
      expect(Math.abs((hz ?? 0) - string.hz)).toBeLessThan(1);
    }
  });

  it('is not fooled by harmonics', () => {
    const hz = detectPitch(tone(349.23, 4096, 0.5, true), SAMPLE_RATE);
    expect(Math.abs((hz ?? 0) - 349.23)).toBeLessThan(1);
  });

  it('ignores silence and very quiet noise', () => {
    expect(detectPitch(new Float32Array(4096), SAMPLE_RATE)).toBeNull();
    expect(detectPitch(tone(440, 4096, 0.001), SAMPLE_RATE)).toBeNull();
  });
});

describe('tuning state', () => {
  it('measures cents against the target', () => {
    expect(centsOff(440, 440)).toBe(0);
    expect(Math.round(centsOff(880, 440))).toBe(1200);
    expect(tuneState(centsOff(436, 440))).toBe('low');
    expect(tuneState(centsOff(444, 440))).toBe('high');
    expect(tuneState(centsOff(440.5, 440))).toBe('ok');
  });

  it('lists the thinnest string first', () => {
    expect(INSTRUMENTS[0].strings[0].number).toBe(1);
  });
});
