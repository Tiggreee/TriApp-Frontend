import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { Icon } from '../components/Icon';
import { PageTitle } from '../components/PageTitle';
import { startCheckout } from '../lib/api';
import { useSession } from '../state/session';

const BENEFITS = [
  'Los 3 grupos completos en todos los juegos',
  'Búsqueda por voz, favoritos y modo día/noche',
  'Brillos y Consejos',
  'Cero anuncios y cero compras dentro de los juegos, para siempre',
];

const PROMISES = [
  'No hay anuncios ni publicidad de terceros.',
  'No hay compras dentro de los juegos ni cajas sorpresa.',
  'No pedimos datos de tus peques: solo tu nombre y correo, si creas cuenta.',
  'Los avatares se dibujan en el dispositivo; su nombre no sale de aquí.',
  'Cada enlace que sale de la app pide permiso a un adulto primero.',
];

export default function Premium() {
  const {
    user,
    trial,
    toggleTrial,
    openAuth,
    signOut,
    showToast,
    theme,
    toggleTheme,
    isRegistered,
  } = useSession();
  const [params] = useSearchParams();
  const status = params.get('status');
  const [busy, setBusy] = useState(false);

  async function buy() {
    setBusy(true);
    try {
      const { url } = await startCheckout();
      window.location.assign(url);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'No pudimos abrir el pago');
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle
        icon="shield"
        tone="purple"
        title="Zona de papás y mamás"
        subtitle="Premium, privacidad y tu cuenta"
      />

      {status === 'success' && (
        <p className="lock-note" role="status">
          <Icon name="star" />
          ¡Gracias! Tu pago se está confirmando; Premium se activa en unos segundos.
        </p>
      )}
      {status === 'cancelled' && (
        <p className="lock-note" role="status">
          <Icon name="lock" />
          No se hizo ningún cobro. Puedes intentarlo cuando quieras.
        </p>
      )}

      <section className="card stack">
        <h2>Premium</h2>
        <ul className="checks">
          {BENEFITS.map((b) => (
            <li key={b}>
              <Icon name="star" /> {b}
            </li>
          ))}
        </ul>

        {user?.premium ? (
          <p className="lock-note">
            <Icon name="crown" /> Tu cuenta ya es Premium. ¡Gracias por apoyar un pueblo sin
            anuncios!
          </p>
        ) : user ? (
          <div className="stack">
            <button type="button" className="btn btn--yellow" onClick={buy} disabled={busy}>
              <Icon name="crown" /> {busy ? 'Abriendo el pago…' : 'Activar Premium'}
            </button>
            <p className="muted small">
              El pago lo hace un adulto en una página segura de Stripe. Nunca vemos los datos de tu
              tarjeta.
            </p>
          </div>
        ) : (
          <div className="stack">
            <p className="muted">Crea tu cuenta de adulto para activar Premium.</p>
            <button type="button" className="btn btn--green" onClick={openAuth}>
              <Icon name="user" /> Crear cuenta o entrar
            </button>
          </div>
        )}
      </section>

      {!user && (
        <section className="card stack">
          <h2>Probar Premium</h2>
          <p className="muted">
            Prueba todo por 5 minutos, hasta {trial.max} veces al día. Hoy llevas {trial.usedToday}.
          </p>
          <button type="button" className="btn btn--orange" onClick={toggleTrial}>
            <Icon name="crown" />{' '}
            {trial.active ? 'Terminar la prueba' : 'Empezar prueba de 5 minutos'}
          </button>
        </section>
      )}

      <section className="card stack">
        <h2>Nuestra promesa</h2>
        <ul className="checks">
          {PROMISES.map((p) => (
            <li key={p}>
              <Icon name="shield" /> {p}
            </li>
          ))}
        </ul>
        <p className="muted small">
          Sabemos que los peques merecen un lugar seguro. Si algo no te convence, escríbenos a
          tiggreee@vmdev.lat.
        </p>
      </section>

      <section className="card stack">
        <h2>Apariencia</h2>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={
            isRegistered
              ? toggleTheme
              : () => showToast('El modo noche es parte de Premium o de la prueba')
          }
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          {theme === 'dark' ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
          {!isRegistered && <Icon name="lock" />}
        </button>
      </section>

      {user && (
        <section className="card stack">
          <h2>Tu cuenta</h2>
          <p>
            {user.name} · <span className="muted">{user.email}</span>
          </p>
          <button type="button" className="btn btn--ghost" onClick={signOut}>
            Cerrar sesión
          </button>
        </section>
      )}
    </>
  );
}
