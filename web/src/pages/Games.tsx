import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { Icon, type IconName } from '../components/Icon';
import { Idol } from '../components/Idol';
import { PageTitle } from '../components/PageTitle';
import { GROUPS } from '../data/groups';
import { useGroup } from '../hooks/useGroup';
import { useUnlock } from '../hooks/useUnlock';
import { sfx } from '../lib/sound';
import { speak } from '../lib/speech';

const GAMES: {
  path: string;
  name: string;
  hint: string;
  icon: IconName;
  tone: string;
  toneDark: string;
}[] = [
  {
    path: 'rhythm',
    name: 'Ritmo',
    hint: 'Toca las notas cuando lleguen',
    icon: 'note',
    tone: 'var(--pink)',
    toneDark: 'var(--pink-d)',
  },
  {
    path: 'memory',
    name: 'Parejas',
    hint: 'Encuentra las caritas iguales',
    icon: 'heart',
    tone: 'var(--blue)',
    toneDark: 'var(--blue-d)',
  },
  {
    path: 'dance',
    name: 'Baile',
    hint: 'Repite el baile de las estrellas',
    icon: 'star',
    tone: 'var(--green)',
    toneDark: 'var(--green-d)',
  },
];

export default function Games() {
  const { group, setGroup, canUse } = useGroup();
  const unlock = useUnlock();

  return (
    <>
      <PageTitle
        icon="gamepad"
        tone="purple"
        title="Arcade Tehee"
        subtitle="Aquí nadie pierde: todos ganan estrellas"
      />

      <section className="stack" aria-labelledby="group-title">
        <h2 id="group-title">1. ¿Con qué grupo juegas?</h2>
        <div className="group-picker" role="radiogroup" aria-label="Grupo">
          {GROUPS.map((g) => {
            const usable = canUse(g);
            const selected = g.id === group.id;
            return (
              <button
                key={g.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className="group-pick"
                style={{ '--g': g.colors.main, '--soft': g.colors.soft } as CSSProperties}
                onClick={() => {
                  speak(g.name);
                  if (usable) {
                    sfx.pop();
                    setGroup(g.id);
                  } else unlock();
                }}
              >
                {g.members[0] && <Idol member={g.members[0]} label="" />}
                <span>{g.name}</span>
                {!usable && (
                  <span className="group-pick__lock">
                    <Icon name="lock" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="muted">{group.tagline}</p>
      </section>

      <section className="stack" aria-labelledby="game-title">
        <h2 id="game-title">2. ¡Elige un juego!</h2>
        <div className="game-cards">
          {GAMES.map((game) => (
            <Link
              key={game.path}
              to={`/games/${game.path}?group=${group.id}`}
              className="game-card"
              style={{ '--c': game.tone, '--cd': game.toneDark } as CSSProperties}
              onClick={() => speak(game.name)}
            >
              <span className="game-card__icon">
                <Icon name={game.icon} />
              </span>
              <span className="game-card__idols">
                {group.members.slice(0, 3).map((m) => (
                  <Idol key={m.id} member={m} label="" />
                ))}
              </span>
              <strong>{game.name}</strong>
              <span>{game.hint}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
