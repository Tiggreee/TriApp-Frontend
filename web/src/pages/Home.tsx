import { Link, useNavigate } from 'react-router';
import { Building, type BuildingArt } from '../components/Building';
import { Icon } from '../components/Icon';
import { Idol } from '../components/Idol';
import { Mascot } from '../components/Mascot';
import { GROUPS } from '../data/groups';
import { useUnlock } from '../hooks/useUnlock';
import { speak } from '../lib/speech';
import { useSession } from '../state/session';

interface Place {
  to: string;
  name: string;
  hint: string;
  art: BuildingArt;
  needsAccount?: boolean;
}

const PLACES: Place[] = [
  {
    to: '/music',
    name: 'Sala de Conciertos',
    hint: 'Canciones para cantar',
    art: {
      wall: '#ffd6e8',
      roof: '#ff5fa2',
      door: '#8f6bff',
      sign: '#ff5fa2',
      roofStyle: 'gable',
      icon: 'note',
    },
  },
  {
    to: '/games',
    name: 'Arcade Renatown',
    hint: 'Juega con las estrellas',
    art: {
      wall: '#e3dcff',
      roof: '#8f6bff',
      door: '#ffd23f',
      sign: '#8f6bff',
      roofStyle: 'dome',
      icon: 'gamepad',
    },
  },
  {
    to: '/colors',
    name: 'Taller de Colores',
    hint: 'Mezcla y descubre',
    art: {
      wall: '#fff1c2',
      roof: '#ff9f43',
      door: '#3aa7ff',
      sign: '#ff9f43',
      roofStyle: 'awning',
      icon: 'palette',
    },
  },
  {
    to: '/avatar',
    name: 'Foto Mágica',
    hint: 'Crea tu personaje',
    art: {
      wall: '#d8f5e8',
      roof: '#3ed598',
      door: '#ff5fa2',
      sign: '#3ed598',
      roofStyle: 'dome',
      icon: 'face',
    },
  },
  {
    to: '/makeup',
    name: 'Salón Brillos',
    hint: 'Looks con brillo',
    needsAccount: true,
    art: {
      wall: '#ffe3ea',
      roof: '#ff8fb5',
      door: '#8f6bff',
      sign: '#ff7aa8',
      roofStyle: 'awning',
      icon: 'sparkle',
    },
  },
  {
    to: '/consejos',
    name: 'Casita de Consejos',
    hint: 'Ideas para brillar',
    needsAccount: true,
    art: {
      wall: '#dff3ff',
      roof: '#3aa7ff',
      door: '#ff9f43',
      sign: '#3aa7ff',
      roofStyle: 'gable',
      icon: 'bulb',
    },
  },
];

export default function Home() {
  const { user, hasPro } = useSession();
  const unlock = useUnlock();
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <Mascot className="hero__mascot" />
        <div className="hero__bubble">
          <h1>{user ? `¡Hola, ${user.name}!` : '¡Hola, bienvenida!'}</h1>
          <p>Toca un edificio para entrar a jugar.</p>
        </div>
      </section>

      <ul className="town" aria-label="Lugares de Renatown">
        {PLACES.map((place) => {
          const locked = place.needsAccount && !user;
          const inner = (
            <>
              <Building art={place.art} />
              <span className="building__name">{place.name}</span>
              <span className="building__hint">{place.hint}</span>
              {locked && (
                <span className="building__lock">
                  <Icon name="lock" />
                  <span className="sr-only">Necesita permiso de un adulto</span>
                </span>
              )}
            </>
          );
          return (
            <li key={place.to}>
              {locked ? (
                <button
                  type="button"
                  className="building building--locked"
                  onClick={() => {
                    speak(place.name);
                    unlock();
                  }}
                >
                  {inner}
                </button>
              ) : (
                <Link to={place.to} className="building" onClick={() => speak(place.name)}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="stars-title">
        <div className="section-title">
          <Icon name="star" style={{ width: 34, height: 34, color: 'var(--yellow-d)' }} />
          <h2 id="stars-title">Las estrellas del pueblo</h2>
        </div>
        <div className="stars-row">
          {GROUPS.map((group) => {
            const locked = !group.free && !hasPro;
            return (
              <button
                key={group.id}
                type="button"
                className="group-card"
                style={{ '--g': group.colors.main } as React.CSSProperties}
                onClick={() => {
                  speak(group.name);
                  if (locked) unlock();
                  else navigate(`/games?group=${group.id}`);
                }}
              >
                <div className="group-card__idols">
                  {group.members.map((m) => (
                    <Idol key={m.id} member={m} />
                  ))}
                </div>
                <h3>{group.name}</h3>
                <p className="muted small">{group.tagline}</p>
                {locked && (
                  <span className="badge" style={{ justifySelf: 'start' }}>
                    <Icon name="lock" /> Premium
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
