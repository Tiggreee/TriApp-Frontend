import { useSession } from '../state/session';
import { Dialog } from './Dialog';
import { Icon, type IconName } from './Icon';
import { Mascot } from './Mascot';

const TIPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'note',
    title: 'Música',
    text: 'Busca canciones y escucha un pedacito. Toca el micrófono para buscar con la voz.',
  },
  {
    icon: 'palette',
    title: 'Colores',
    text: 'Toca un color y aparece una paleta mágica. Toca una bolita para escuchar su nombre.',
  },
  {
    icon: 'face',
    title: 'Avatares',
    text: 'Escribe un nombre y crea tu personaje. Puedes guardarlo.',
  },
  {
    icon: 'gamepad',
    title: 'Juegos',
    text: 'Baila, junta parejas y sigue el ritmo con nuestros grupos. Aquí nadie pierde, todos ganan estrellas.',
  },
  { icon: 'heart', title: 'Favoritos', text: 'Toca el corazón para guardar lo que más te gusta.' },
];

export function HelpDialog({ onClose }: { onClose: () => void }) {
  const { user } = useSession();
  return (
    <Dialog title="¡Hola! Soy Renata" onClose={onClose}>
      <div className="help__hero">
        <Mascot className="help__mascot" />
        <p>Te enseño cómo se juega en Renatown.</p>
      </div>
      <ul className="help__list">
        {TIPS.map((tip) => (
          <li key={tip.title}>
            <span className="help__icon">
              <Icon name={tip.icon} />
            </span>
            <span>
              <strong>{tip.title}</strong>
              <br />
              {tip.text}
            </span>
          </li>
        ))}
      </ul>
      <p className="lock-note">
        <Icon name="lock" />
        {user
          ? 'Tu cuenta de papá o mamá ya tiene todas las funciones activas.'
          : 'Algunas cosas son Premium. Un adulto puede activarlas desde la Zona de papás.'}
      </p>
    </Dialog>
  );
}
