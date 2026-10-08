import { useCallback, useEffect, useRef, useState } from 'react';
import { detectPitch, median } from '../lib/pitch';

export type TunerStatus = 'idle' | 'starting' | 'listening' | 'denied' | 'unsupported';

const FFT_SIZE = 4096;
const SMOOTHING = 5;
const SILENCE_MS = 450;

/** Listens to the microphone and reports the detected frequency (Hz) in real time. */
export function useTuner() {
  const [status, setStatus] = useState<TunerStatus>('idle');
  const [hz, setHz] = useState<number | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    cleanup.current?.();
    cleanup.current = null;
    setHz(null);
    setStatus((s) => (s === 'listening' || s === 'starting' ? 'idle' : s));
  }, []);

  const start = useCallback(async () => {
    if (cleanup.current) return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !Ctor) {
      setStatus('unsupported');
      return;
    }
    setStatus('starting');
    let stream: MediaStream;
    try {
      // Raw signal: echo cancellation and noise suppression would distort the pitch.
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch {
      setStatus('denied');
      return;
    }

    const ctx = new Ctor();
    void ctx.resume();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);

    const buffer = new Float32Array(analyser.fftSize);
    const recent: number[] = [];
    let lastHeard = 0;
    let frame = 0;

    const tick = () => {
      analyser.getFloatTimeDomainData(buffer);
      const now = performance.now();
      const pitch = detectPitch(buffer, ctx.sampleRate);
      if (pitch) {
        recent.push(pitch);
        if (recent.length > SMOOTHING) recent.shift();
        lastHeard = now;
        setHz(median(recent));
      } else if (now - lastHeard > SILENCE_MS) {
        recent.length = 0;
        setHz(null);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    cleanup.current = () => {
      cancelAnimationFrame(frame);
      source.disconnect();
      for (const track of stream.getTracks()) track.stop();
      void ctx.close();
    };
    setStatus('listening');
  }, []);

  useEffect(() => () => cleanup.current?.(), []);

  return { status, hz, start, stop };
}
