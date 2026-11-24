// Angular, metal-style ukulele (sharp horns, red-to-black burst, chrome hardware) drawn in SVG.
// The four strings are separate lines so the tuner can light the one being played.

export type StringState = 'idle' | 'target' | 'ok';

const NUT_Y = 184;
const BRIDGE_Y = 722;
const SCALE = 367; // virtual scale length, tuned so about ten frets fit on the visible neck
const NECK_END_Y = 352;
const NECK_HALF_NUT = 31;
const NECK_HALF_END = 42;
const STRING_NUT = [180, 193.3, 206.7, 220] as const;
const STRING_BRIDGE = [169, 190, 210, 231] as const;
const STRING_WIDTH = [1.5, 1.9, 2.4, 2.1] as const;

const BODY =
  'M158 352 Q112 330 70 262 Q50 320 48 376 L66 434 Q46 500 32 568 Q40 640 58 664 L92 752 ' +
  'Q150 738 200 742 Q256 738 322 758 Q372 706 370 640 Q372 580 346 528 L338 448 ' +
  'Q364 396 352 340 L334 288 Q296 334 242 352 Z';

const HEADSTOCK = 'M122 184 L96 100 Q90 54 128 34 L200 14 L272 34 Q310 54 304 100 L278 184 Z';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const neckHalf = (y: number) =>
  lerp(NECK_HALF_NUT, NECK_HALF_END, (y - NUT_Y) / (NECK_END_Y - NUT_Y));
const fretY = (n: number) => NUT_Y + SCALE * (1 - 2 ** (-n / 12));
const FRETS = Array.from({ length: 10 }, (_, i) => fretY(i + 1));
const INLAYS = [3, 5, 7, 9].map((n) => (fretY(n - 1) + fretY(n)) / 2);

export function MetalUkulele({ states }: { states: StringState[] }) {
  return (
    <svg
      className="uke__art"
      viewBox="0 0 400 760"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="uke-glow" cx="0.5" cy="0.55" r="0.65">
          <stop offset="0" stopColor="#5a0f26" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#1b0b16" stopOpacity="0.4" />
          <stop offset="1" stopColor="#09090e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="uke-burst" cx="0.5" cy="0.62" r="0.62">
          <stop offset="0" stopColor="#0d0d14" />
          <stop offset="0.55" stopColor="#1a0d17" />
          <stop offset="0.82" stopColor="#8d0f2a" />
          <stop offset="1" stopColor="#e2183f" />
        </radialGradient>
        <linearGradient id="uke-gloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="uke-board" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a0f0d" />
          <stop offset="0.5" stopColor="#2e1b16" />
          <stop offset="1" stopColor="#1a0f0d" />
        </linearGradient>
        <linearGradient id="uke-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fafbff" />
          <stop offset="0.45" stopColor="#a9afbf" />
          <stop offset="0.55" stopColor="#6c7283" />
          <stop offset="1" stopColor="#d4d8e4" />
        </linearGradient>
        <linearGradient id="uke-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0c18" />
          <stop offset="1" stopColor="#0c0c12" />
        </linearGradient>
        <filter id="uke-shadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      <rect width="400" height="760" fill="url(#uke-glow)" />
      {[-60, -30, 0, 30, 60].map((dx) => (
        <line
          key={dx}
          x1={200 + dx * 0.2}
          y1="0"
          x2={200 + dx * 6}
          y2="760"
          stroke="#e2183f"
          strokeOpacity="0.07"
          strokeWidth="6"
        />
      ))}

      {/* body */}
      <path d={BODY} fill="url(#uke-burst)" filter="url(#uke-shadow)" />
      <path d={BODY} fill="url(#uke-gloss)" />
      <path d={BODY} fill="none" stroke="#efe7d2" strokeWidth="3.5" strokeLinejoin="round" />
      <path
        d={BODY}
        fill="none"
        stroke="#000"
        strokeOpacity="0.55"
        strokeWidth="1"
        transform="translate(200 400) scale(0.975) translate(-200 -400)"
      />

      {/* neck */}
      <polygon
        points={`${200 - neckHalf(NUT_Y)},${NUT_Y} ${200 + neckHalf(NUT_Y)},${NUT_Y} ${200 + neckHalf(NECK_END_Y)},${NECK_END_Y} ${200 - neckHalf(NECK_END_Y)},${NECK_END_Y}`}
        fill="url(#uke-board)"
        stroke="#efe7d2"
        strokeOpacity="0.75"
        strokeWidth="1.5"
      />
      {FRETS.map((y) => (
        <line
          key={y}
          x1={200 - neckHalf(y)}
          x2={200 + neckHalf(y)}
          y1={y}
          y2={y}
          stroke="#c9cedb"
          strokeWidth="2.2"
        />
      ))}
      {INLAYS.map((y) => (
        <circle key={y} cx="200" cy={y} r="3.6" fill="#efe7d2" fillOpacity="0.9" />
      ))}
      <rect
        x={200 - NECK_HALF_NUT}
        y={NUT_Y - 5}
        width={NECK_HALF_NUT * 2}
        height="6"
        rx="1.5"
        fill="#f4efe0"
      />

      {/* headstock */}
      <path
        d={HEADSTOCK}
        fill="url(#uke-head)"
        stroke="#efe7d2"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M128 40 L200 20 L272 40"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.28"
        strokeWidth="2"
      />
      <path d="M126 177 L274 177" stroke="#e2183f" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M150 34 L200 22 L250 34"
        fill="none"
        stroke="#e2183f"
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />

      {/* pickups */}
      {[392, 444].map((y) => (
        <g key={y}>
          <rect
            x="158"
            y={y - 14}
            width="84"
            height="28"
            rx="4"
            fill="url(#uke-chrome)"
            stroke="#2a2d38"
            strokeWidth="1.5"
          />
          <rect
            x="162"
            y={y - 10}
            width="76"
            height="20"
            rx="2.5"
            fill="#0b0b10"
            fillOpacity="0.55"
          />
          {STRING_NUT.map((nutX, i) => (
            <circle
              key={nutX}
              cx={lerp(nutX, STRING_BRIDGE[i] ?? 200, (y - NUT_Y) / (BRIDGE_Y - NUT_Y))}
              cy={y}
              r="3.2"
              fill="#d7dae4"
              stroke="#3a3e4b"
              strokeWidth="0.8"
            />
          ))}
        </g>
      ))}
      <rect x="82" y="410" width="12" height="30" rx="3" fill="url(#uke-chrome)" stroke="#2a2d38" />
      <rect x="86" y="412" width="4" height="12" rx="1.5" fill="#15161c" />

      {/* bridge, tailpiece and knobs */}
      <rect
        x="156"
        y="716"
        width="88"
        height="12"
        rx="3"
        fill="url(#uke-chrome)"
        stroke="#2a2d38"
        strokeWidth="1.2"
      />
      <rect
        x="164"
        y="738"
        width="72"
        height="9"
        rx="3"
        fill="url(#uke-chrome)"
        stroke="#2a2d38"
        strokeWidth="1.2"
      />
      {[112, 288].map((x) => (
        <g key={x}>
          <circle
            cx={x}
            cy="736"
            r="11"
            fill="url(#uke-chrome)"
            stroke="#2a2d38"
            strokeWidth="1.5"
          />
          <line
            x1={x}
            y1="736"
            x2={x + 5}
            y2="729"
            stroke="#15161c"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* strings */}
      {STRING_NUT.map((x0, i) => (
        <line
          key={x0}
          className="uke__string"
          data-state={states[i] ?? 'idle'}
          x1={x0}
          x2={STRING_BRIDGE[i]}
          y1={NUT_Y}
          y2={BRIDGE_Y}
          strokeWidth={STRING_WIDTH[i]}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
