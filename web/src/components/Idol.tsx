import type { Member } from '../data/groups';

const INK = '#2b2350';

function HairBack({ style, color }: { style: Member['hairStyle']; color: string }) {
  switch (style) {
    case 'long':
      return <path d="M25 64C25 26 95 26 95 64L100 128Q60 120 20 128z" fill={color} />;
    case 'bob':
      return <path d="M27 62C27 28 93 28 93 62L94 98Q60 104 26 98z" fill={color} />;
    case 'buns':
      return (
        <>
          <circle cx="32" cy="30" r="15" fill={color} />
          <circle cx="88" cy="30" r="15" fill={color} />
          <path d="M28 62C28 30 92 30 92 62L90 78H30z" fill={color} />
        </>
      );
    case 'spiky':
      return <path d="M27 62C27 30 93 30 93 62L92 74H28z" fill={color} />;
  }
}

function HairFront({ style, color }: { style: Member['hairStyle']; color: string }) {
  if (style === 'spiky') {
    return (
      <path
        d="M29 62L32 36l13 12 8-22 11 20 12-18 5 20 12-8-2 24C82 52 38 52 29 62z"
        fill={color}
      />
    );
  }
  return <path d="M29 60C33 33 87 33 91 60 80 50 70 47 60 51 50 47 40 50 29 60z" fill={color} />;
}

function Accessory({
  kind,
  color,
  hair,
}: {
  kind: Member['accessory'];
  color: string;
  hair: string;
}) {
  switch (kind) {
    case 'bow':
      return (
        <g transform="translate(84 34) rotate(18)">
          <path
            d="M0 0L-16-10v20zM0 0l16-10v20z"
            fill={color}
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle r="4.5" fill={color} stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case 'star':
      return (
        <path
          transform="translate(84 36) scale(1.05)"
          d="M0-11l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L0 5.4l-6.5 3.5 1.3-7.2-5.3-5.1 7.3-1z"
          fill={color}
          stroke={INK}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      );
    case 'bunny':
      return (
        <>
          <rect
            x="34"
            y="-6"
            width="15"
            height="46"
            rx="7.5"
            transform="rotate(-10 41 34)"
            fill={color}
            stroke={INK}
            strokeWidth="2.5"
          />
          <rect
            x="71"
            y="-6"
            width="15"
            height="46"
            rx="7.5"
            transform="rotate(10 78 34)"
            fill={color}
            stroke={INK}
            strokeWidth="2.5"
          />
          <rect
            x="38"
            y="6"
            width="7"
            height="26"
            rx="3.5"
            transform="rotate(-10 41 34)"
            fill="#ffc2dc"
          />
          <rect
            x="75"
            y="6"
            width="7"
            height="26"
            rx="3.5"
            transform="rotate(10 78 34)"
            fill="#ffc2dc"
          />
        </>
      );
    case 'cat':
      return (
        <>
          <path
            d="M30 44L32 16l22 16z"
            fill={hair}
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M90 44L88 16 66 32z"
            fill={hair}
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M35 34l-.8-10 9 6zM85 34l.8-10-9 6z" fill="#ffb3cf" />
        </>
      );
    case 'headphones':
      return (
        <>
          <path
            d="M26 66C22 20 98 20 94 66"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <rect
            x="17"
            y="58"
            width="15"
            height="26"
            rx="7"
            fill={color}
            stroke={INK}
            strokeWidth="2.5"
          />
          <rect
            x="88"
            y="58"
            width="15"
            height="26"
            rx="7"
            fill={color}
            stroke={INK}
            strokeWidth="2.5"
          />
        </>
      );
    case 'crown':
      return (
        <path
          d="M40 40l4-16 10 10 6-14 6 14 10-10 4 16z"
          fill={color}
          stroke={INK}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      );
  }
}

export function Idol({
  member,
  className,
  label,
}: {
  member: Member;
  className?: string;
  label?: string;
}) {
  const { skin, hair, hairStyle, outfit, accessory, accessoryColor, eyes } = member;
  return (
    <svg className={className} viewBox="0 0 120 140" role="img" aria-label={label ?? member.name}>
      {accessory === 'bunny' && <Accessory kind="bunny" color={accessoryColor} hair={hair} />}
      <HairBack style={hairStyle} color={hair} />
      <path d="M22 140C22 106 98 106 98 140z" fill={outfit} />
      <path
        d="M46 112l14 14 14-14"
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".85"
      />
      <rect x="52" y="90" width="16" height="20" rx="8" fill={skin} />
      <ellipse cx="60" cy="66" rx="30" ry="31" fill={skin} />
      <HairFront style={hairStyle} color={hair} />
      {eyes === 'round' ? (
        <>
          <ellipse cx="47" cy="68" rx="4.6" ry="5.6" fill={INK} />
          <ellipse cx="73" cy="68" rx="4.6" ry="5.6" fill={INK} />
          <circle cx="48.8" cy="66" r="1.7" fill="#fff" />
          <circle cx="74.8" cy="66" r="1.7" fill="#fff" />
        </>
      ) : (
        <path
          d="M41 70q6-8 12 0M67 70q6-8 12 0"
          fill="none"
          stroke={INK}
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      )}
      <ellipse cx="41" cy="79" rx="6" ry="3.8" fill="#ff8fb5" opacity=".55" />
      <ellipse cx="79" cy="79" rx="6" ry="3.8" fill="#ff8fb5" opacity=".55" />
      <path d="M53 80q7 8 14 0" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      {accessory !== 'bunny' && <Accessory kind={accessory} color={accessoryColor} hair={hair} />}
    </svg>
  );
}
