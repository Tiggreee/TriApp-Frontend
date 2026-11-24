import type { CSSProperties } from 'react';
import { Icon, type IconName } from './Icon';

const TONES = {
  pink: ['var(--pink)', 'var(--pink-d)'],
  orange: ['var(--orange)', 'var(--orange-d)'],
  green: ['var(--green)', 'var(--green-d)'],
  blue: ['var(--blue)', 'var(--blue-d)'],
  purple: ['var(--purple)', 'var(--purple-d)'],
} as const;

interface PageTitleProps {
  icon: IconName;
  tone: keyof typeof TONES;
  title: string;
  subtitle?: string;
}

export function PageTitle({ icon, tone, title, subtitle }: PageTitleProps) {
  const [c, cd] = TONES[tone];
  return (
    <div className="page__title" style={{ '--c': c, '--cd': cd } as CSSProperties}>
      <span className="title-icon">
        <Icon name={icon} />
      </span>
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
    </div>
  );
}
