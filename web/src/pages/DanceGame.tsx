import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { GameResults } from '../components/GameResults';
import { Icon } from '../components/Icon';
import { Idol } from '../components/Idol';
import { PageTitle } from '../components/PageTitle';
import {
  finishShowing,
  initialSimon,
  MAX_ROUND,
  pressPad,
  type SimonState,
  simonStars,
  startSimon,
} from '../games/simon';
import { useGroup } from '../hooks/useGroup';
import { playNote, sfx } from '../lib/sound';
import { speak } from '../lib/speech';

const STEP_MS = 600;
const PAD_COLORS = ['var(--pink)', 'var(--yellow)', 'var(--green)', 'var(--blue)'];

export default function DanceGame() {
  const { group } = useGroup();
  const [state, setState] = useState<SimonState>(initialSimon);
  const [active, setActive] = useState<number | null>(null);
  const [message, setMessage] = useState('Toca "Empezar" y mira quién baila primero.');
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const flash = useCallback(
    (pad: number) => {
      setActive(pad);
      playNote(group.song.root + 12 + (group.song.lanes[pad] ?? 0), 0.4);
      timers.current.push(
        window.setTimeout(() => setActive((a) => (a === pad ? null : a)), STEP_MS * 0.6),
      );
    },
    [group.song],
  );

  // Show the dance: each member takes a turn, then it's the player's turn.
  useEffect(() => {
    if (state.phase !== 'showing') return;
    clearTimers();
    const sequence = state.sequence;
    sequence.forEach((pad, i) => {
      timers.current.push(window.setTimeout(() => flash(pad), 700 + i * STEP_MS));
    });
    timers.current.push(
      window.setTimeout(
        () => {
          setState((s) => finishShowing(s));
          setMessage('¡Ahora tú! Toca en el mismo orden.');
        },
        700 + sequence.length * STEP_MS,
      ),
    );
    return clearTimers;
  }, [state.phase, state.sequence, flash, clearTimers]);

  function start() {
    clearTimers();
    setState(startSimon());
    setMessage('¡Mira con atención!');
  }

  function press(pad: number) {
    if (state.phase !== 'input') return;
    flash(pad);
    const outcome = pressPad(state, pad);
    setState(outcome.state);
    if (outcome.result === 'wrong') {
      sfx.oops();
      setMessage('¡Casi! Vamos a verlo otra vez.');
    } else if (outcome.result === 'round') {
      sfx.match();
      setMessage('¡Muy bien! Ahora uno más.');
    } else if (outcome.result === 'win') {
      sfx.win();
      speak('¡Bravo!');
    }
  }

  const round = Math.max(1, state.sequence.length);
  const playing = state.phase !== 'idle' && state.phase !== 'won';

  return (
    <>
      <PageTitle
        icon="star"
        tone="green"
        title="Baile"
        subtitle={`Con ${group.name}. Repite el baile de las estrellas.`}
      />

      <div className="row">
        <Link to={`/games?group=${group.id}`} className="btn btn--ghost btn--small">
          <Icon name="back" /> Juegos
        </Link>
        {playing && (
          <span className="badge">
            Baile {round} de {MAX_ROUND}
          </span>
        )}
      </div>

      <p className="dance__message" role="status">
        {message}
      </p>

      <div className="dance" style={{ '--g': group.colors.main } as CSSProperties}>
        {group.members.map((member, pad) => (
          <button
            key={member.id}
            type="button"
            className={`dancer${active === pad ? ' is-dancing' : ''}${state.phase === 'input' ? ' is-ready' : ''}`}
            style={{ '--pad': PAD_COLORS[pad] } as CSSProperties}
            onClick={() => press(pad)}
            disabled={state.phase !== 'input'}
            aria-label={member.name}
          >
            <Idol member={member} label="" />
            <span>{member.name}</span>
          </button>
        ))}
      </div>

      {(state.phase === 'idle' || state.phase === 'won') && (
        <div className="row" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn btn--green" onClick={start}>
            <Icon name="play" /> Empezar
          </button>
        </div>
      )}

      {state.phase === 'won' && (
        <GameResults
          group={group.id}
          stars={simonStars(state.mistakes)}
          message="¡Bailaste perfecto!"
          detail={
            state.mistakes === 0 ? '¡Sin ningún error!' : `Solo ${state.mistakes} intento(s) extra.`
          }
          onAgain={start}
          onClose={() => setState(initialSimon)}
        />
      )}
    </>
  );
}
