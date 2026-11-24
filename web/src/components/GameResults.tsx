import { Link } from 'react-router';
import { Confetti } from './Confetti';
import { Dialog } from './Dialog';
import { Icon } from './Icon';

interface GameResultsProps {
  stars: 1 | 2 | 3;
  message: string;
  detail?: string;
  onAgain: () => void;
  onClose: () => void;
  group: string;
}

// Everybody wins something: no game-over screens, only stars.
export function GameResults({ stars, message, detail, onAgain, onClose, group }: GameResultsProps) {
  return (
    <>
      <Confetti />
      <Dialog title={message} onClose={onClose}>
        <div className="stars" role="img" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((n) => (
            <Icon key={n} name="star" data-on={n <= stars} />
          ))}
        </div>
        {detail && <p style={{ textAlign: 'center' }}>{detail}</p>}
        <div className="row" style={{ justifyContent: 'center' }}>
          <button type="button" className="btn btn--green" onClick={onAgain}>
            <Icon name="play" /> Otra vez
          </button>
          <Link className="btn btn--ghost" to={`/games?group=${group}`}>
            Más juegos
          </Link>
        </div>
      </Dialog>
    </>
  );
}
