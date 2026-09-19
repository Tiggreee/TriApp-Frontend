import { type ReactNode, useEffect, useId, useRef } from 'react';
import { Icon } from './Icon';

interface DialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

// Native <dialog>: focus trapping, Escape to close and inert background come for free.
export function Dialog({ title, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
    return () => el?.close();
  }, []);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled by onCancel; the click only closes on backdrop
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="dialog__panel">
        <button
          type="button"
          className="btn btn--ghost btn--icon dialog__close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <Icon name="close" />
        </button>
        <h2 id={titleId} className="dialog__title">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
