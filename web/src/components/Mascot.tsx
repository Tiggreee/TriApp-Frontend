// Renata's unicorn: the guide of Pueblo Tehee.
export function Mascot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 170" role="img" aria-label="Un unicornio sonriente">
      <defs>
        <linearGradient id="mane" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5fa2" />
          <stop offset="0.35" stopColor="#ffd23f" />
          <stop offset="0.7" stopColor="#3ed598" />
          <stop offset="1" stopColor="#8f6bff" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="160" rx="46" ry="7" fill="rgba(43,35,80,.14)" />
      <path d="M30 96c-14 4-20 22-14 40 8-6 18-8 26-6z" fill="url(#mane)" />
      <path d="M40 82c-14-2-26 10-22 26 6-8 14-12 24-12z" fill="url(#mane)" />
      <path d="M104 44c14-4 30 6 30 24 0 12-8 20-20 22z" fill="url(#mane)" />
      <ellipse cx="82" cy="98" rx="46" ry="44" fill="#fff" stroke="#2b2350" strokeWidth="4" />
      <path
        d="M62 10l-8 34h22z"
        fill="#ffd23f"
        stroke="#2b2350"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M58 26l16-6M55 36l20-7" stroke="#d4a50c" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M48 52c-6-14-2-26 8-30 2 10 6 16 12 20z"
        fill="#ffd0e4"
        stroke="#2b2350"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M96 52c6-14 2-26-8-30-2 10-6 16-12 20z"
        fill="#ffd0e4"
        stroke="#2b2350"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx="62" cy="98" rx="7" ry="9" fill="#2b2350" />
      <ellipse cx="102" cy="98" rx="7" ry="9" fill="#2b2350" />
      <circle cx="64.5" cy="94.5" r="2.6" fill="#fff" />
      <circle cx="104.5" cy="94.5" r="2.6" fill="#fff" />
      <ellipse cx="48" cy="114" rx="9" ry="6" fill="#ff9cc1" opacity=".7" />
      <ellipse cx="116" cy="114" rx="9" ry="6" fill="#ff9cc1" opacity=".7" />
      <path
        d="M70 116c6 8 18 8 24 0"
        fill="none"
        stroke="#2b2350"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
