import { useCallback, useEffect, useRef, useState } from 'react';

// One preview at a time: starting a new song stops the previous one.
export function usePreviewPlayer() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(
    () => () => {
      audio.current?.pause();
    },
    [],
  );

  const toggle = useCallback(
    (id: number, url: string) => {
      if (audio.current && playingId === id) {
        audio.current.pause();
        setPlayingId(null);
        return;
      }
      audio.current?.pause();
      const next = new Audio(url);
      next.onended = () => setPlayingId((current) => (current === id ? null : current));
      next.onerror = () => setPlayingId(null);
      audio.current = next;
      setPlayingId(id);
      next.play().catch(() => setPlayingId(null));
    },
    [playingId],
  );

  return { playingId, toggle };
}
