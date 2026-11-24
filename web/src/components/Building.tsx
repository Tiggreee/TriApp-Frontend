import { Icon, type IconName } from './Icon';

export interface BuildingArt {
  wall: string;
  roof: string;
  door: string;
  sign: string;
  roofStyle: 'gable' | 'dome' | 'awning';
  icon: IconName;
}

const INK = '#2b2350';

// A little storefront for Renatown, drawn with flat shapes so it stays crisp at any size.
export function Building({ art }: { art: BuildingArt }) {
  const { wall, roof, door, sign, roofStyle, icon } = art;
  return (
    <div className="building__art">
      <svg viewBox="0 0 200 170" aria-hidden="true" focusable="false">
        <ellipse cx="100" cy="158" rx="82" ry="9" fill="rgba(43,35,80,.16)" />
        <rect
          x="26"
          y="70"
          width="148"
          height="84"
          rx="14"
          fill={wall}
          stroke={INK}
          strokeWidth="4"
        />
        {roofStyle === 'gable' && (
          <path
            d="M14 76L100 20l86 56z"
            fill={roof}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        )}
        {roofStyle === 'dome' && (
          <path
            d="M22 76C22 30 178 30 178 76z"
            fill={roof}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        )}
        {roofStyle === 'awning' && (
          <>
            <path
              d="M16 78V52h168v26z"
              fill={roof}
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path
                key={i}
                d={`M${16 + i * 28} 78a14 14 0 0 0 28 0`}
                fill={i % 2 ? '#fff' : roof}
                stroke={INK}
                strokeWidth="4"
              />
            ))}
          </>
        )}
        <path
          d="M84 154v-34a16 16 0 0 1 32 0v34z"
          fill={door}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="108" cy="138" r="3" fill="#fff" />
        <rect
          x="38"
          y="96"
          width="32"
          height="28"
          rx="8"
          fill="#eaf8ff"
          stroke={INK}
          strokeWidth="4"
        />
        <rect
          x="130"
          y="96"
          width="32"
          height="28"
          rx="8"
          fill="#eaf8ff"
          stroke={INK}
          strokeWidth="4"
        />
        <path d="M54 96v28M38 110h32M146 96v28M130 110h32" stroke={INK} strokeWidth="3" />
      </svg>
      <span className="building__sign" style={{ background: sign }}>
        <Icon name={icon} />
      </span>
    </div>
  );
}
