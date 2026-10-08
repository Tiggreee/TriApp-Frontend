export interface TunerString {
  /** String number, 1 is the thinnest (the one nearest the floor when played). */
  number: number;
  note: string;
  hz: number;
}

export interface Tuning {
  id: string;
  name: string;
  /** Listed from the thinnest string down, so the tuner starts on string 1. */
  strings: [TunerString, ...TunerString[]];
}

export interface Instrument {
  id: string;
  name: string;
  tagline: string;
  tunings: [Tuning, ...Tuning[]];
}

// Sopranino (pocket) ukulele, re-entrant. Both tunings below are standard for this size.
export const INSTRUMENTS: [Instrument, ...Instrument[]] = [
  {
    id: 'ukulele-sopranino',
    name: 'Ukelele sopranino',
    tagline: 'Cuatro cuerdas · empieza por la más delgada',
    tunings: [
      {
        id: 'dgbe',
        name: 'D G B E',
        strings: [
          { number: 1, note: 'E5', hz: 659.26 },
          { number: 2, note: 'B4', hz: 493.88 },
          { number: 3, note: 'G4', hz: 392.0 },
          { number: 4, note: 'D5', hz: 587.33 },
        ],
      },
      {
        id: 'cfad',
        name: 'C F A D',
        strings: [
          { number: 1, note: 'D5', hz: 587.33 },
          { number: 2, note: 'A4', hz: 440.0 },
          { number: 3, note: 'F4', hz: 349.23 },
          { number: 4, note: 'C5', hz: 523.25 },
        ],
      },
    ],
  },
];
