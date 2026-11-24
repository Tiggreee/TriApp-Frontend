import { useState } from 'react';
import { checkGateAnswer, makeGateChallenge } from '../lib/gate';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

interface ParentGateProps {
  onPass: () => void;
  onClose: () => void;
}

export function ParentGate({ onPass, onClose }: ParentGateProps) {
  const [challenge, setChallenge] = useState(() => makeGateChallenge());
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (checkGateAnswer(challenge, answer)) {
      onClose();
      onPass();
      return;
    }
    setWrong(true);
    setAnswer('');
    setChallenge(makeGateChallenge());
  }

  return (
    <Dialog title="Solo para papás y mamás" onClose={onClose}>
      <p className="muted">
        Esta parte es para personas grandes. Resuelve esta cuenta para continuar:
      </p>
      <form className="stack" onSubmit={submit}>
        <label className="field">
          <span className="gate__question">{challenge.question} = ?</span>
          <input
            className="input"
            inputMode="numeric"
            autoComplete="off"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value.replace(/[^\d-]/g, ''));
              setWrong(false);
            }}
            aria-invalid={wrong}
            aria-describedby={wrong ? 'gate-error' : undefined}
          />
          {wrong && (
            <span id="gate-error" className="field__error" role="alert">
              Esa no era. Aquí va una cuenta nueva.
            </span>
          )}
        </label>
        <button type="submit" className="btn btn--purple" disabled={!answer}>
          <Icon name="shield" /> Soy un adulto
        </button>
      </form>
    </Dialog>
  );
}
