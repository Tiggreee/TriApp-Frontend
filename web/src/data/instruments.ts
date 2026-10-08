export interface TunerString {
  /** String number, 1 is the thinnest (the one nearest the floor when played). */
  number: number;
  note: string;
  hz: number;
}

export interface Instrument {
  id: string;
  name: string;
  tagline: string;
  /** Listed from the thinnest string down, so the tuner starts on string 1. */
  strings: [TunerString, ...TunerString[]];
}

// Sopranino (pocket) ukulele: a fourth above the soprano's G-C-E-A, re-entrant (C-F-A-D).
export const INSTRUMENTS: [Instrument, ...Instrument[]] = [
  {
    id: 'ukulele-sopranino',
    name: 'Ukelele sopranino',
    tagline: 'Cuatro cuerdas · C F A D',
    strings: [
      { number: 1, note: 'D5', hz: 587.33 },
      { number: 2, note: 'A4', hz: 440.0 },
      { number: 3, note: 'F4', hz: 349.23 },
      { number: 4, note: 'C5', hz: 523.25 },
    ],
  },
];
