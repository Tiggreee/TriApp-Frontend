import { type CSSProperties, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router';
import { GameResults } from '../components/GameResults';
import { Icon } from '../components/Icon';
import { Idol } from '../components/Idol';
import { PageTitle } from '../components/PageTitle';
import { createMemory, isMemoryDone, memoryReducer, memoryStars } from '../games/memory';
import { useGroup } from '../hooks/useGroup';
import { sfx } from '../lib/sound';
import { speak } from '../lib/speech';

const LEVELS = [
  { pairs: 3, name: 'Fácil' },
  { pairs: 4, name: 'Normal' },
];

export default function MemoryGame() {
  const { group } = useGroup();
  const [pairs, setPairs] = useState(3);
  const [round, setRound] = useState(0);
  const ids = group.members.map((m) => m.id);
  const [state, dispatch] = useReducer(memoryReducer, undefined, () => createMemory(ids, pairs));
  const [showResults, setShowResults] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new deal starts whenever the group, level or round changes
  useEffect(() => {
    dispatch({ type: 'reset', state: createMemory(ids, pairs) });
    setShowResults(false);
  }, [group.id, pairs, round]);

  useEffect(() => {
    if (state.flipped.length !== 2) return;
    const [a, b] = state.flipped as [number, number];
    const match = state.deck[a] === state.deck[b];
    const timer = window.setTimeout(
      () => {
        dispatch({ type: 'resolve' });
        if (match) {
          sfx.match();
          const member = group.members.find((m) => m.id === state.deck[a]);
          if (member) speak(member.name);
        }
      },
      match ? 500 : 950,
    );
    return () => window.clearTimeout(timer);
  }, [state.flipped, state.deck, group.members]);

  const done = isMemoryDone(state);
  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => {
      sfx.win();
      setShowResults(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [done]);

  const cols = state.deck.length <= 6 ? 3 : 4;

  return (
    <>
      <PageTitle
        icon="heart"
        tone="blue"
        title="Parejas"
        subtitle={`Con ${group.name}. Encuentra las caritas iguales.`}
      />

      <div className="row">
        <Link to={`/games?group=${group.id}`} className="btn btn--ghost btn--small">
          <Icon name="back" /> Juegos
        </Link>
        <div className="chips" role="group" aria-label="Dificultad">
          {LEVELS.map((l) => (
            <button
              key={l.pairs}
              type="button"
              className="chip"
              aria-pressed={pairs === l.pairs}
              onClick={() => setPairs(l.pairs)}
            >
              {l.name}
            </button>
          ))}
        </div>
        <span className="badge">Turnos: {state.moves}</span>
      </div>

      <div className="memory" style={{ '--cols': cols, '--g': group.colors.main } as CSSProperties}>
        {state.deck.map((id, index) => {
          const member = group.members.find((m) => m.id === id);
          const faceUp = state.flipped.includes(index) || state.matched.includes(id);
          return (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: deck positions are stable
              key={index}
              type="button"
              className={`mcard${faceUp ? ' is-up' : ''}${state.matched.includes(id) ? ' is-matched' : ''}`}
              onClick={() => {
                if (!faceUp) {
                  sfx.flip();
                  dispatch({ type: 'flip', index });
                }
              }}
              aria-label={faceUp && member ? member.name : 'Carta boca abajo'}
              aria-pressed={faceUp}
            >
              <span className="mcard__inner">
                <span className="mcard__back">
                  <Icon name="star" />
                </span>
                <span className="mcard__front">{member && <Idol member={member} label="" />}</span>
              </span>
            </button>
          );
        })}
      </div>

      {showResults && (
        <GameResults
          group={group.id}
          stars={memoryStars(state.moves, state.deck.length / 2)}
          message="¡Encontraste todas las parejas!"
          detail={`Lo lograste en ${state.moves} turnos.`}
          onAgain={() => setRound((r) => r + 1)}
          onClose={() => setShowResults(false)}
        />
      )}
    </>
  );
}
