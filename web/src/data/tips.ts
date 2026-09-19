import type { Category, ContentItem } from './makeup';

export const TIPS_CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos', emoji: '💡' },
  { id: 'beauty', name: 'Belleza', emoji: '✨' },
  { id: 'wellness', name: 'Bienestar', emoji: '🧘' },
  { id: 'life', name: 'Vida', emoji: '🌟' },
  { id: 'confidence', name: 'Autoestima', emoji: '💪' },
];

const ACTIONS: Record<string, string[]> = {
  beauty: [
    'Empieza con un paso pequeño',
    'Registra tus cambios',
    'Sé consistente por 30 días',
    '¡Celebra los resultados!',
  ],
  wellness: [
    'Encuentra tu momento del día',
    'Crea un ambiente tranquilo',
    'Sé amable contigo misma',
    'Aumenta gradualmente',
  ],
  life: [
    'Escribe tus metas',
    'Divide en pasos pequeños',
    'Pide apoyo si lo necesitas',
    'Celebra cada avance',
  ],
  confidence: [
    'Afirma algo positivo de ti',
    'Haz algo que te asuste hoy',
    'Aprecia tu progreso',
    '¡Eres increíble!',
  ],
};

interface Raw {
  id: number;
  title: string;
  category: string;
  emoji: string;
  description: string;
  date: string;
  full: string;
  link: string;
}

const RAW: Raw[] = [
  {
    id: 1,
    title: 'Hidratación desde adentro',
    category: 'beauty',
    emoji: '💧',
    description: 'Beber 2 litros de agua diarios transforma tu piel en 30 días',
    date: 'Hoy',
    full: 'Beber agua suficiente es la base de una piel radiante. Tu piel refleja lo que bebes, así que ¡mantente hidratada!',
    link: 'https://www.healthline.com/nutrition/water-intake-for-skin',
  },
  {
    id: 2,
    title: 'El poder de la risa',
    category: 'life',
    emoji: '😊',
    description: 'Reír 10 minutos al día aumenta tu felicidad y bienestar',
    date: 'Ayer',
    full: 'La risa libera endorfinas, reduce el estrés y hasta mejora tu sistema inmunológico. ¡Ríe más, vive más feliz!',
    link: 'https://www.healthline.com/health/mental-health/laughter-is-good-medicine',
  },
  {
    id: 3,
    title: 'Rutina nocturna perfecta',
    category: 'wellness',
    emoji: '🌙',
    description: 'Crea una rutina de sueño que te ayude a despertar radiante',
    date: 'Ayer',
    full: 'Duerme 7-8 horas en un ambiente oscuro y fresco. Tu piel se regenera durante el sueño. ¡Que sea mágico!',
    link: 'https://www.healthline.com/health/sleep/best-sleep-schedule',
  },
  {
    id: 4,
    title: 'Aceptarte a ti misma',
    category: 'confidence',
    emoji: '🦄',
    description: 'La verdadera belleza comienza cuando aceptas quién eres',
    date: 'Hace 2 días',
    full: 'La verdadera belleza viene del interior. Cuando te aceptas y amas, eso brilla en tu rostro. Eres perfecta tal como eres.',
    link: 'https://www.psychologytoday.com/us/basics/self-esteem',
  },
  {
    id: 5,
    title: 'Alimentos que iluminan',
    category: 'beauty',
    emoji: '🥗',
    description: 'Descubre alimentos naturales que dan brillo a tu piel',
    date: 'Hace 2 días',
    full: 'Aguacate, arándanos, zanahorias y chocolates oscuros son aliados para tu piel. ¡Come con propósito!',
    link: 'https://www.healthline.com/nutrition/foods-for-skin-health',
  },
  {
    id: 6,
    title: 'Meditación en 5 minutos',
    category: 'wellness',
    emoji: '🧘',
    description: 'Técnicas rápidas de meditación para tu día ajetreado',
    date: 'Hace 3 días',
    full: 'Cierra los ojos, respira profundo y deja que tus pensamientos pasen. 5 minutos diarios transforman tu día.',
    link: 'https://www.headspace.com/meditation',
  },
  {
    id: 7,
    title: 'Metas realistas',
    category: 'life',
    emoji: '🎯',
    description: 'Cómo establecer metas que realmente puedas lograr',
    date: 'Hace 3 días',
    full: 'No intentes cambiar todo de una vez. Establece metas pequeñas, alcanzables y celebra cada logro. ¡Paso a paso!',
    link: 'https://www.mindtools.com/pages/article/smart-goals.htm',
  },
  {
    id: 8,
    title: 'Brilla con confianza',
    category: 'confidence',
    emoji: '✨',
    description: 'Pasos para construir una autoestima inquebrantable',
    date: 'Hace 4 días',
    full: 'La confianza es tu mejor accesorio. Camina derecha, sonríe genuinamente y cree en ti misma. ¡El mundo lo notará!',
    link: 'https://www.psychologytoday.com/us/basics/confidence',
  },
];

export const TIPS: ContentItem[] = RAW.map((r) => ({
  id: r.id,
  title: r.title,
  category: r.category,
  emoji: r.emoji,
  description: r.description,
  meta: [
    { label: 'Por', value: 'Renata 🦄' },
    { label: 'Fecha', value: r.date },
  ],
  heading: 'Consejo completo',
  body: [r.full],
  ordered: false,
  actions: ACTIONS[r.category] ?? [],
  link: { href: r.link, label: 'Leer más' },
}));
