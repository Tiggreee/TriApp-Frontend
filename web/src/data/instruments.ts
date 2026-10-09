import { noteToHz } from '../lib/pitch';

export interface TunerString {
  /** String number, 1 is the thinnest (the one nearest the floor when played). */
  number: number;
  note: string;
  hz: number;
}

export interface Tuning {
  id: string;
  name: string;
  /** What the tuning asks of the strings, shown under the selector. */
  hint: string;
  /** Listed from the thinnest string down, so the tuner starts on string 1. */
  strings: [TunerString, ...TunerString[]];
}

export interface Instrument {
  id: string;
  name: string;
  tagline: string;
  tunings: [Tuning, ...Tuning[]];
}

// Frequencies come from the note names (equal temperament, A4 = 440 Hz), never typed by hand.
function tuning(
  id: string,
  name: string,
  hint: string,
  notes: [string, string, string, string],
): Tuning {
  const [first, ...rest] = notes.map((note, i) => ({ number: i + 1, note, hz: noteToHz(note) }));
  return { id, name, hint, strings: [first as TunerString, ...rest] };
}

// Sopranino ukulele, re-entrant. The notes are listed from string 1 (thinnest) to string 4,
// and every tuning is a transposition of the soprano's G-C-E-A (G4 C4 E4 A4).
export const INSTRUMENTS: [Instrument, ...Instrument[]] = [
  {
    id: 'ukulele-sopranino',
    name: 'Ukelele sopranino',
    tagline: 'Cuatro cuerdas · empieza por la más delgada',
    tunings: [
      tuning(
        'adfb',
        'A D F# B',
        'Un tono arriba del estándar. Seguro con cuerdas de soprano: más brillo y tensión moderada.',
        ['B4', 'F#4', 'D4', 'A4'],
      ),
      tuning(
        'bebgc',
        'Bb Eb G C',
        'Un tono y medio arriba. Es el límite para cuerdas de soprano: más brillo y ataque, pero en un sopranino muy pequeño se siente dura.',
        ['C5', 'G4', 'Eb4', 'Bb4'],
      ),
      tuning(
        'dgbe',
        'D G B E',
        'Una quinta arriba. Pide cuerdas hechas para sopranino: más volumen y brillo. Con cuerdas de soprano la tensión es demasiada.',
        ['E5', 'B4', 'G4', 'D5'],
      ),
    ],
  },
];

export const DEFAULT_TUNING_ID = 'dgbe';
