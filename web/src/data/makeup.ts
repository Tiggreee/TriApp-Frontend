export interface ContentItem {
  id: number;
  title: string;
  category: string;
  emoji: string;
  description: string;
  meta: { label: string; value: string }[];
  heading: string;
  body: string[];
  ordered: boolean;
  actions?: string[];
  link: { href: string; label: string };
  closing?: { title: string; text: string };
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const MAKEUP_CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos', emoji: '💄' },
  { id: 'eyes', name: 'Ojos', emoji: '👁️' },
  { id: 'lips', name: 'Labios', emoji: '💋' },
  { id: 'face', name: 'Rostro', emoji: '✨' },
  { id: 'nails', name: 'Uñas', emoji: '💅' },
];

const yt = (q: string) => `https://www.youtube.com/results?search_query=${q}`;
const magicTip = {
  title: 'Tip Mágico',
  text: '¡La práctica hace al maestro! No desistas si el primer intento no es perfecto. Cada día mejorarás tu técnica.',
};

interface Raw {
  id: number;
  title: string;
  category: string;
  emoji: string;
  description: string;
  difficulty: string;
  time: string;
  steps: string[];
  query: string;
}

const RAW: Raw[] = [
  {
    id: 1,
    title: 'Smokey Eyes Perfecto',
    category: 'eyes',
    emoji: '🌙',
    description: 'Aprende a crear un smokey eye profesional en 5 pasos',
    difficulty: 'Intermedio',
    time: '15 min',
    query: 'smokey+eyes+tutorial',
    steps: [
      'Aplica base de sombra en todo el párpado',
      'Usa una sombra gris oscuro en el pliegue',
      'Difumina bien los bordes',
      'Aplica negro en la línea superior',
      'Termina con un iluminador en la parte interna',
    ],
  },
  {
    id: 2,
    title: 'Base Impecable',
    category: 'face',
    emoji: '✨',
    description: 'Técnicas para una base perfecta y duradera',
    difficulty: 'Básico',
    time: '10 min',
    query: 'base+makeup+tutorial',
    steps: [
      'Hidrata tu piel con primer',
      'Aplica base con una esponja húmeda',
      'Cubre con polvo translúcido',
      'Fija con spray setting',
      '¡Listo para 12+ horas!',
    ],
  },
  {
    id: 3,
    title: 'Labios Nude',
    category: 'lips',
    emoji: '💋',
    description: 'Los mejores tonos nude para cada tipo de piel',
    difficulty: 'Básico',
    time: '5 min',
    query: 'nude+lips+tutorial',
    steps: [
      'Exfolia tus labios suavemente',
      'Hidrata con bálsamo labial',
      'Aplica el labial nude elegido',
      'Perfilador opcional para mayor precisión',
      'Top coat para durabilidad',
    ],
  },
  {
    id: 4,
    title: 'Manicura en Casa',
    category: 'nails',
    emoji: '💅',
    description: 'Diseños de uñas simples pero elegantes',
    difficulty: 'Básico',
    time: '20 min',
    query: 'diy+manicure+tutorial',
    steps: [
      'Empuja las cutículas hacia atrás',
      'Lija las uñas en forma ovalada',
      'Aplica base protectora',
      'Dos capas de esmalte color',
      'Sella con top coat brillante',
    ],
  },
  {
    id: 5,
    title: 'Contorno Facial',
    category: 'face',
    emoji: '🎨',
    description: 'Domina el arte del contour en minutos',
    difficulty: 'Intermedio',
    time: '12 min',
    query: 'contouring+tutorial',
    steps: [
      'Elige un contorno 2 tonos más oscuro',
      'Aplica en los lados de la nariz',
      'Sombrea los laterales del rostro',
      'Difumina bien para un efecto natural',
      'Resalta con iluminador en puntos altos',
    ],
  },
  {
    id: 6,
    title: 'Glitter Party',
    category: 'eyes',
    emoji: '✨',
    description: 'Looks deslumbrantes con glitter para fiestas',
    difficulty: 'Intermedio',
    time: '18 min',
    query: 'glitter+makeup+tutorial',
    steps: [
      'Aplica sombra pegajosa como base',
      'Usa dedos para aplicar glitter',
      'Presiona firmemente para que se adhiera',
      'Combina con delineador dramático',
      'Sella con spray fijador fuerte',
    ],
  },
];

export const MAKEUP: ContentItem[] = RAW.map((r) => ({
  id: r.id,
  title: r.title,
  category: r.category,
  emoji: r.emoji,
  description: r.description,
  meta: [
    { label: 'Dificultad', value: r.difficulty },
    { label: 'Tiempo', value: r.time },
  ],
  heading: 'Pasos',
  body: r.steps,
  ordered: true,
  link: { href: yt(r.query), label: 'Ver tutorial en YouTube' },
  closing: magicTip,
}));
