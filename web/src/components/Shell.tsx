import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { useUnlock } from '../hooks/useUnlock';
import { speak } from '../lib/speech';
import { useSession } from '../state/session';
import { AuthDialog } from './AuthDialog';
import { Backdrop } from './Backdrop';
import { HelpDialog } from './HelpDialog';
import { Icon, type IconName } from './Icon';
import { ParentGate } from './ParentGate';

const DOCK: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Pueblo', icon: 'home', end: true },
  { to: '/music', label: 'Música', icon: 'note' },
  { to: '/games', label: 'Juegos', icon: 'gamepad' },
  { to: '/colors', label: 'Colores', icon: 'palette' },
  { to: '/avatar', label: 'Avatares', icon: 'face' },
];

function formatRemaining(ms: number) {
  const total = Math.ceil(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export function Shell() {
  const session = useSession();
  const { pathname } = useLocation();
  const unlock = useUnlock();
  const navigate = useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const { overlay, closeOverlay } = session;

  return (
    <div className="app">
      <Backdrop />

      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="Renatown, ir al inicio">
          <img src="/unicorn.svg" alt="" width="46" height="46" />
          <span className="brand__text">
            <small>Bienvenida a</small>
            <b>Renatown</b>
          </span>
        </NavLink>

        <div className="topbar__actions">
          {session.trial.active && (
            <span className="badge" title="Premium de prueba">
              <Icon name="crown" /> {formatRemaining(session.trial.remainingMs)}
            </span>
          )}
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={() => {
              session.toggleSound();
            }}
            aria-label={session.sound ? 'Apagar el sonido' : 'Encender el sonido'}
            aria-pressed={session.sound}
          >
            <Icon name={session.sound ? 'volume' : 'mute'} />
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={session.isRegistered ? session.toggleTheme : unlock}
            aria-label={session.theme === 'dark' ? 'Cambiar a día' : 'Cambiar a noche'}
          >
            <Icon name={session.theme === 'dark' ? 'sun' : 'moon'} />
            {!session.isRegistered && (
              <span className="lock-dot" aria-hidden="true">
                <Icon name="lock" />
              </span>
            )}
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--icon"
            onClick={session.openHelp}
            aria-label="Ayuda de Renata"
          >
            <Icon name="help" />
          </button>
          <button
            type="button"
            className="btn btn--purple btn--icon"
            aria-label="Zona de papás"
            onClick={() => session.askParent(() => navigate('/premium'))}
          >
            <Icon name="shield" />
          </button>
        </div>
      </header>

      <main className="page" id="main">
        <Outlet />
      </main>

      <footer className="signature">
        <span>Hecho con cariño por Tigre Dev</span>
        <span>Sin anuncios · Sin rastreo · Solo diversión</span>
      </footer>

      <nav className="dock" aria-label="Lugares del pueblo">
        {DOCK.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="dock__item"
            onClick={() => speak(item.label)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {session.toast && (
        <div className="toast" role="status">
          {session.toast}
        </div>
      )}

      {overlay?.kind === 'gate' && <ParentGate onPass={overlay.onPass} onClose={closeOverlay} />}
      {overlay?.kind === 'auth' && <AuthDialog onClose={closeOverlay} />}
      {overlay?.kind === 'help' && <HelpDialog onClose={closeOverlay} />}
    </div>
  );
}
