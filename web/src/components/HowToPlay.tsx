import { useEffect, useState } from 'react';
import { readString, writeString } from '../lib/storage';
import { speak } from '../lib/speech';
import { Dialog } from './Dialog';
import { Icon, type IconName } from './Icon';

export interface HowToStep {
  icon: IconName;
  title: string;
  text: string;
}

interface HowToPlayProps {
  /** Stable id: the guide opens by itself the first time each game is visited. */
  game: string;
  title: string;
  steps: HowToStep[];
}

// Every game explains itself: a step-by-step card that opens the first time, can be read aloud,
// and can be reopened any time from the "¿Cómo se juega?" button.
export function HowToPlay({ game, title, steps }: HowToPlayProps) {
  const seenKey = `howto-seen-${game}`;
  const [open, setOpen] = useState(() => readString(seenKey) === null);

  useEffect(() => {
    if (open) speak(title);
  }, [open, title]);

  function close() {
    writeString(seenKey, '1');
    setOpen(false);
  }

  return (
    <>
      <button type="button" className="btn btn--ghost btn--small" onClick={() => setOpen(true)}>
        <Icon name="help" /> ¿Cómo se juega?
      </button>

      {open && (
        <Dialog title={title} onClose={close}>
          <ol className="help__list howto">
            {steps.map((step, i) => (
              <li key={step.title}>
                <span className="help__icon">
                  <Icon name={step.icon} />
                </span>
                <span>
                  <strong>
                    {i + 1}. {step.title}
                  </strong>
                  <br />
                  {step.text}
                </span>
              </li>
            ))}
          </ol>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn--blue"
              onClick={() => speak(steps.map((s) => `${s.title}. ${s.text}`).join(' '))}
            >
              <Icon name="volume" /> Escuchar
            </button>
            <button type="button" className="btn btn--green" onClick={close}>
              <Icon name="play" /> ¡Entendí, a jugar!
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
