import { type CSSProperties, useMemo } from 'react';

// Purely decorative burst. Render it with a fresh `key` to replay.
export function Confetti({ count = 36 }: { count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const power = 180 + Math.random() * 320;
        return {
          '--h': Math.floor(Math.random() * 360),
          '--x': `${Math.cos(angle) * power}px`,
          '--y': `${Math.sin(angle) * power + 120}px`,
          '--r': `${Math.floor(Math.random() * 720 - 360)}deg`,
          '--d': `${Math.random() * 0.15}s`,
        } as CSSProperties;
      }),
    [count],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((style, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static decorative list
        <i key={i} style={style} />
      ))}
    </div>
  );
}
