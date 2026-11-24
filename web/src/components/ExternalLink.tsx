import type { ReactNode } from 'react';
import { useSession } from '../state/session';
import { Icon } from './Icon';

// Kids never leave the app by accident: any outside link goes through the grown-up gate first.
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  const { askParent } = useSession();
  return (
    <button
      type="button"
      className="btn btn--blue"
      onClick={() => askParent(() => window.open(href, '_blank', 'noopener,noreferrer'))}
    >
      <Icon name="out" /> {children}
    </button>
  );
}
