import { type FormEvent, useState } from 'react';
import { ApiError } from '../lib/api';
import { useSession } from '../state/session';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

const MESSAGES: Record<string, string> = {
  'Email already registered': 'Ese correo ya tiene una cuenta. Prueba con "Entrar".',
  'Incorrect email or password': 'El correo o la contraseña no coinciden.',
};

export function AuthDialog({ onClose }: { onClose: () => void }) {
  const { signIn, signUp } = useSession();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    setError('');
    setBusy(true);
    try {
      if (mode === 'signup') await signUp(email, password, String(form.get('name') ?? ''));
      else await signIn(email, password);
      onClose();
    } catch (err) {
      const message = err instanceof ApiError || err instanceof Error ? err.message : '';
      setError(MESSAGES[message] ?? (message || 'No pudimos completar esto. Intenta otra vez.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog title="Cuenta de papá o mamá" onClose={onClose}>
      <div className="chips" role="tablist" aria-label="Tipo de acceso">
        <button
          type="button"
          role="tab"
          className="chip"
          aria-selected={mode === 'signup'}
          onClick={() => setMode('signup')}
        >
          Crear cuenta
        </button>
        <button
          type="button"
          role="tab"
          className="chip"
          aria-selected={mode === 'signin'}
          onClick={() => setMode('signin')}
        >
          Entrar
        </button>
      </div>

      <form className="stack" onSubmit={submit} key={mode}>
        {mode === 'signup' && (
          <label className="field">
            Tu nombre
            <input
              className="input"
              name="name"
              minLength={2}
              maxLength={30}
              required
              autoComplete="given-name"
            />
          </label>
        )}
        <label className="field">
          Correo
          <input className="input" name="email" type="email" required autoComplete="email" />
        </label>
        <label className="field">
          Contraseña (mínimo 8)
          <input
            className="input"
            name="password"
            type="password"
            minLength={8}
            maxLength={72}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
        </label>
        {error && (
          <p className="field__error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--green" disabled={busy}>
          <Icon name="user" />{' '}
          {busy ? 'Un momento…' : mode === 'signup' ? 'Crear cuenta' : 'Entrar'}
        </button>
        {mode === 'signup' && (
          <p className="muted small">
            Al crear la cuenta confirmas que eres madre, padre o tutor. Solo guardamos tu nombre y
            correo, nada de tus peques.
          </p>
        )}
      </form>
    </Dialog>
  );
}
