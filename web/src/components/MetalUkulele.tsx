// Angular, metal-style ukulele drawn in SVG (reverse-pointed headstock, sharp horns).
// Strings sit at fixed x positions so the tuner can light the one being played.

export const STRING_X = [176, 192, 208, 224] as const;
const STRING_WIDTH = [1.6, 2, 2.4, 2.2] as const;
const FRETS = [190, 212, 232, 250, 266, 281, 295] as const;

export type StringState = 'idle' | 'target' | 'ok';

export function MetalUkulele({ states }: { states: StringState[] }) {
  return (
    <svg
      className="uke__art"
      viewBox="0 0 400 700"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="uke-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a0d1c" />
          <stop offset="0.5" stopColor="#15151d" />
          <stop offset="1" stopColor="#07070b" />
        </linearGradient>
        <linearGradient id="uke-neck" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b1410" />
          <stop offset="0.5" stopColor="#2b2019" />
          <stop offset="1" stopColor="#1b1410" />
        </linearGradient>
        <linearGradient id="uke-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8ebf2" />
          <stop offset="1" stopColor="#7b8190" />
        </linearGradient>
      </defs>

      <path
        d="M165 300 L118 296 L50 338 L62 392 L30 440 L74 528 L44 606 L122 690 L200 666 L278 690 L356 606 L326 528 L370 440 L338 392 L350 338 L282 296 L235 300 Z"
        fill="url(#uke-body)"
        stroke="#e11d48"
        strokeWidth="3.5"
        strokeLinejoin="miter"
      />
      <path
        d="M118 296 L50 338 L62 392 L30 440"
        fill="none"
        stroke="rgba(255,255,255,.22)"
        strokeWidth="2"
      />

      <path
        d="M118 34 L200 10 L282 34 L306 128 L252 164 L148 164 L94 128 Z"
        fill="url(#uke-body)"
        stroke="#e11d48"
        strokeWidth="3.5"
        strokeLinejoin="miter"
      />
      <rect x="165" y="164" width="70" height="8" fill="url(#uke-metal)" />
      <rect x="165" y="172" width="70" height="160" fill="url(#uke-neck)" />
      {FRETS.map((y) => (
        <line key={y} x1="165" x2="235" y1={y} y2={y} stroke="url(#uke-metal)" strokeWidth="2" />
      ))}
      <circle cx="200" cy="258" r="3.5" fill="#d7d9e0" />

      <rect x="170" y="418" width="60" height="24" rx="3" fill="#0a0a0f" stroke="#8b91a1" />
      <rect x="170" y="486" width="60" height="24" rx="3" fill="#0a0a0f" stroke="#8b91a1" />
      <rect x="168" y="628" width="64" height="16" rx="2" fill="url(#uke-metal)" />

      {STRING_X.map((x, i) => (
        <line
          key={x}
          className="uke__string"
          data-state={states[i] ?? 'idle'}
          x1={x}
          x2={x}
          y1="172"
          y2="636"
          strokeWidth={STRING_WIDTH[i]}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
