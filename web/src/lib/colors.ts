// Names colours in Spanish, offline, so we can read them out loud to kids.
export function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? [...clean].map((c) => c + c).join('') : clean;
  const r = Number.parseInt(full.slice(0, 2), 16) / 255;
  const g = Number.parseInt(full.slice(2, 4), 16) / 255;
  const b = Number.parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

export function spanishColorName(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  if (l < 0.1) return 'negro';
  if (l > 0.94) return 'blanco';
  if (s < 0.12) return l < 0.4 ? 'gris oscuro' : l > 0.7 ? 'gris claro' : 'gris';

  let base: string;
  if (h < 15 || h >= 345) base = l > 0.7 ? 'rosa' : 'rojo';
  else if (h < 40) base = l < 0.4 ? 'café' : 'naranja';
  else if (h < 65) base = 'amarillo';
  else if (h < 160) base = 'verde';
  else if (h < 195) base = 'turquesa';
  else if (h < 255) base = 'azul';
  else if (h < 290) base = 'morado';
  else base = 'rosa';

  if (base === 'rosa' && l < 0.6) return 'rosa fuerte';
  if (l < 0.28) return `${base} oscuro`;
  if (l > 0.8 && base !== 'rosa') return `${base} claro`;
  return base;
}

export const isValidHex = (value: string) => /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
