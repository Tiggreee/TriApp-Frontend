import type { SVGProps } from 'react';

const PATHS = {
  note: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.6" fill="currentColor" />
      <circle cx="16.5" cy="16" r="2.6" fill="currentColor" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.6 0 2.1-1.1 1.5-2.3-.6-1.3.2-2.7 1.7-2.7H17a4 4 0 0 0 4-4c0-4.6-4-9-9-9z" />
      <circle cx="7.6" cy="11.2" r="1.3" fill="currentColor" />
      <circle cx="10" cy="7.2" r="1.3" fill="currentColor" />
      <circle cx="15" cy="7.2" r="1.3" fill="currentColor" />
    </>
  ),
  face: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" />
      <path d="M8 14c1 2 2.5 3 4 3s3-1 4-3" />
    </>
  ),
  gamepad: (
    <>
      <path d="M7 8h10a5 5 0 0 1 5 5v1.5a3 3 0 0 1-5.3 1.9L15 14.5H9l-1.7 1.9A3 3 0 0 1 2 14.5V13a5 5 0 0 1 5-5z" />
      <path d="M7 11v3M5.5 12.5h3" />
      <circle cx="15.5" cy="11.6" r="1" fill="currentColor" />
      <circle cx="18" cy="13.2" r="1" fill="currentColor" />
    </>
  ),
  sparkle: (
    <>
      <path d="M11 2l2 6.2L19.5 10 13 12l-2 6.2L9 12 2.5 10 9 8.2z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" fill="currentColor" />
    </>
  ),
  bulb: (
    <>
      <path d="M12 3a6 6 0 0 0-3.9 10.6c.8.7 1.1 1.5 1.1 2.4h5.6c0-.9.3-1.7 1.1-2.4A6 6 0 0 0 12 3z" />
      <path d="M9.5 19h5M10.5 21.5h3" />
    </>
  ),
  heart: (
    <path d="M12 20.5s-8-4.9-8-10.7A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.8c0 5.8-8 10.7-8 10.7z" />
  ),
  star: <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z" />,
  moon: <path d="M20 14.6A8.5 8.5 0 0 1 9.4 4a8.5 8.5 0 1 0 10.6 10.6z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.3M12 19.2v2.3M2.5 12h2.3M19.2 12h2.3M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="3" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9.5v5h3.8L13 18.5v-13L7.8 9.5H4z" />
      <path d="M16.2 9a4.2 4.2 0 0 1 0 6M18.6 6.4a8 8 0 0 1 0 11.2" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9.5v5h3.8L13 18.5v-13L7.8 9.5H4z" />
      <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" />
    </>
  ),
  expand: (
    <>
      <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
    </>
  ),
  home: (
    <>
      <path d="M3 11.2L12 3.5l9 7.7" />
      <path d="M5.5 9.6V20h4.3v-5.5h4.4V20h4.3V9.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.2 21a7.8 7.8 0 0 1 15.6 0" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </>
  ),
  play: <path d="M8 5.2v13.6a1 1 0 0 0 1.5.9l10.6-6.8a1 1 0 0 0 0-1.7L9.5 4.3A1 1 0 0 0 8 5.2z" />,
  pause: (
    <>
      <rect x="6" y="5" width="4.2" height="14" rx="1.6" />
      <rect x="13.8" y="5" width="4.2" height="14" rx="1.6" />
    </>
  ),
  download: <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />,
  back: <path d="M15 5l-7 7 7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l5 5" />
    </>
  ),
  out: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  bolt: <path d="M13.5 2.5L4.5 14h6.4l-1.2 7.5 9.3-12h-6.5z" />,
  crown: <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.4a2.7 2.7 0 1 1 3.9 2.4c-.9.5-1.3 1-1.3 2M12 17.2v.1" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

const FILLED: ReadonlySet<IconName> = new Set([
  'star',
  'play',
  'pause',
  'heart',
  'moon',
  'crown',
  'bolt',
]);

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  filled?: boolean;
}

export function Icon({ name, filled, ...props }: IconProps) {
  const solid = filled ?? FILLED.has(name);
  return (
    <svg
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
