import type { Song } from '../lib/sound';

// Original, fictional pop groups created for Renatown.
// Names, characters, looks and music are our own and do not depict any real artist.

export type HairStyle = 'bob' | 'buns' | 'long' | 'spiky';
export type Accessory = 'bow' | 'star' | 'bunny' | 'cat' | 'headphones' | 'crown';
export type Eyes = 'round' | 'happy';

export interface Member {
  id: string;
  name: string;
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  outfit: string;
  accessory: Accessory;
  accessoryColor: string;
  eyes: Eyes;
}

export interface Group {
  id: string;
  name: string;
  tagline: string;
  free: boolean;
  colors: { main: string; accent: string; soft: string };
  members: Member[];
  song: Song;
}

export const GROUPS: Group[] = [
  {
    id: 'chispa-club',
    name: 'Chispa Club',
    tagline: '¡Brilla, brilla, brilla!',
    free: true,
    colors: { main: '#ff5fa2', accent: '#ffd23f', soft: '#ffe3f0' },
    song: {
      bpm: 108,
      root: 60,
      lanes: [0, 4, 7, 12],
      bass: [0, -1, -1, 0, -1, -1, 7, -1, 5, -1, -1, 5, -1, -1, 7, -1],
    },
    members: [
      {
        id: 'dori',
        name: 'Dori',
        skin: '#ffd9b8',
        hair: '#ff8fc0',
        hairStyle: 'buns',
        outfit: '#ff5fa2',
        accessory: 'bow',
        accessoryColor: '#ffd23f',
        eyes: 'round',
      },
      {
        id: 'suni',
        name: 'Suni',
        skin: '#e9b48a',
        hair: '#3b2a5a',
        hairStyle: 'long',
        outfit: '#ffd23f',
        accessory: 'star',
        accessoryColor: '#ff5fa2',
        eyes: 'happy',
      },
      {
        id: 'lulu',
        name: 'Lulu',
        skin: '#8d5a3b',
        hair: '#241a3a',
        hairStyle: 'bob',
        outfit: '#8f6bff',
        accessory: 'crown',
        accessoryColor: '#ffd23f',
        eyes: 'round',
      },
      {
        id: 'miko',
        name: 'Miko',
        skin: '#ffe0c8',
        hair: '#ffb347',
        hairStyle: 'spiky',
        outfit: '#3aa7ff',
        accessory: 'headphones',
        accessoryColor: '#ff5fa2',
        eyes: 'happy',
      },
    ],
  },
  {
    id: 'luna-gomita',
    name: 'Luna Gomita',
    tagline: 'Soñamos bailando bajo la luna',
    free: false,
    colors: { main: '#8f6bff', accent: '#7fe3ff', soft: '#ece6ff' },
    song: {
      bpm: 100,
      root: 62,
      lanes: [0, 3, 7, 10],
      bass: [0, -1, 0, -1, -1, -1, 3, -1, 5, -1, 5, -1, -1, -1, 3, -1],
    },
    members: [
      {
        id: 'luni',
        name: 'Luni',
        skin: '#ffd9b8',
        hair: '#c9b6ff',
        hairStyle: 'long',
        outfit: '#8f6bff',
        accessory: 'bunny',
        accessoryColor: '#ffffff',
        eyes: 'round',
      },
      {
        id: 'pepa',
        name: 'Pepa',
        skin: '#c98d62',
        hair: '#2b2350',
        hairStyle: 'bob',
        outfit: '#7fe3ff',
        accessory: 'star',
        accessoryColor: '#ffd23f',
        eyes: 'happy',
      },
      {
        id: 'yuyu',
        name: 'Yuyu',
        skin: '#f2c19a',
        hair: '#ff8fc0',
        hairStyle: 'buns',
        outfit: '#ff5fa2',
        accessory: 'bunny',
        accessoryColor: '#ffe3f0',
        eyes: 'round',
      },
      {
        id: 'tami',
        name: 'Tami',
        skin: '#7a4a2e',
        hair: '#1a1233',
        hairStyle: 'spiky',
        outfit: '#3ed598',
        accessory: 'headphones',
        accessoryColor: '#8f6bff',
        eyes: 'happy',
      },
    ],
  },
  {
    id: 'turbo-panditas',
    name: 'Turbo Panditas',
    tagline: '¡Ready, set, a bailar!',
    free: false,
    colors: { main: '#3ed598', accent: '#ff9f43', soft: '#dcfbee' },
    song: {
      bpm: 118,
      root: 64,
      lanes: [0, 2, 7, 9],
      bass: [0, -1, -1, 0, 3, -1, -1, 3, 5, -1, -1, 5, 3, -1, 2, -1],
    },
    members: [
      {
        id: 'bao',
        name: 'Bao',
        skin: '#ffe0c8',
        hair: '#1f1a2e',
        hairStyle: 'spiky',
        outfit: '#3ed598',
        accessory: 'cat',
        accessoryColor: '#1f1a2e',
        eyes: 'happy',
      },
      {
        id: 'chispi',
        name: 'Chispi',
        skin: '#e9b48a',
        hair: '#ff9f43',
        hairStyle: 'bob',
        outfit: '#ff9f43',
        accessory: 'bow',
        accessoryColor: '#3ed598',
        eyes: 'round',
      },
      {
        id: 'rocky',
        name: 'Rocky',
        skin: '#8d5a3b',
        hair: '#3a2a1a',
        hairStyle: 'buns',
        outfit: '#3aa7ff',
        accessory: 'headphones',
        accessoryColor: '#ff9f43',
        eyes: 'happy',
      },
      {
        id: 'noa',
        name: 'Noa',
        skin: '#ffd9b8',
        hair: '#3ed598',
        hairStyle: 'long',
        outfit: '#8f6bff',
        accessory: 'crown',
        accessoryColor: '#ff9f43',
        eyes: 'round',
      },
    ],
  },
];

export const getGroup = (id: string | undefined): Group =>
  GROUPS.find((g) => g.id === id) ?? (GROUPS[0] as Group);
