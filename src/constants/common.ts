import cat1 from '@/assets/images/cats/cat-1.png';
import cat2 from '@/assets/images/cats/cat-2.png';
import cat3 from '@/assets/images/cats/cat-3.png';
import cat4 from '@/assets/images/cats/cat-4.png';

import enemy1 from '@/assets/images/enemies/enemy-1.png';
import enemy2 from '@/assets/images/enemies/enemy-2.png';
import enemy3 from '@/assets/images/enemies/enemy-3.png';
import enemy4 from '@/assets/images/enemies/enemy-4.png';

import earthPlanet from '@/assets/images/planets/earth.png';
import eresPlanet from '@/assets/images/planets/eres.png';
import marsPlanet from '@/assets/images/planets/mars.png';
import venusPlanet from '@/assets/images/planets/venus.png';
import thumbnail1 from '@/assets/images/thumbnails/thumbnail-1.png';
import thumbnail2 from '@/assets/images/thumbnails/thumbnail-2.png';
import thumbnail3 from '@/assets/images/thumbnails/thumbnail-3.png';
import thumbnail4 from '@/assets/images/thumbnails/thumbnail-4.png';
import soundLevel1 from '@/assets/sounds/level-1.mp3';
import soundLevel2 from '@/assets/sounds/level-2.mp3';
import soundLevel3 from '@/assets/sounds/level-3.mp3';
import soundLevel4 from '@/assets/sounds/level-4.mp3';

import type { Enemy, Level, Player } from '@/types/common';

export const PLAYERS: Player[] = [
  {
    id: 'cat-1',
    name: 'Qwerty',
    imageSrc: cat1,
    thumbnailSrc: thumbnail1,
    description:
      'An agile, interstellar cat, known throughout the Galaxy as the one who watches where others fear to look into the abyss. If someone gets lost in the darkness of space, she will guide them back, leaving behind a luminous trail like a comet.',
  },
  {
    id: 'cat-2',
    name: 'Pixel',
    imageSrc: cat2,
    thumbnailSrc: thumbnail2,
    description:
      'An incredibly influential space cat whose every movement looks like a flash of a single, universe-creating pixel against a black void. Her tiny paws leave behind sparkling trails, as if she were redesigning reality with every step.',
  },
  {
    id: 'cat-3',
    name: 'Tequilla',
    imageSrc: cat3,
    thumbnailSrc: thumbnail3,
    description:
      'A mean space cat who can throw everyone off balance. Wherever she appears, she always leaves a trail of chaos behind her. Still, everyone knows that her cosmic sassiness is part of her charm, without which the universe would simply be boring.',
  },
  {
    id: 'cat-4',
    name: 'Cheeky',
    imageSrc: cat4,
    thumbnailSrc: thumbnail4,
    description:
      'A cosmic cat with an extraordinary personality, who gracefully glides between asteroids, leaving behind swirls of stardust. His playful gaze and agile jumps can disarm even the toughest satellites. His magnificence makes space a little bit more magical.',
  },
];

export const DEFAULT_PLAYER = PLAYERS[0];

export const ENEMIES: Enemy[] = [
  {
    id: 'enemy-1',
    imageSrc: enemy1,
  },
  {
    id: 'enemy-2',
    imageSrc: enemy2,
  },
  {
    id: 'enemy-3',
    imageSrc: enemy3,
  },
  {
    id: 'enemy-4',
    imageSrc: enemy4,
  },
];

export const LEVELS: Level[] = [
  {
    id: 'level-1',
    name: 'Level 1',
    duration: 28_000,
    difficulty: 1,
    planetSize: 1,
    hearts: 4,
    planetSrc: earthPlanet,
    soundSrc: soundLevel1,
  },
  {
    id: 'level-2',
    name: 'Level 2',
    duration: 25_000,
    difficulty: 1.5,
    planetSize: 1.5,
    hearts: 3,
    planetSrc: marsPlanet,
    soundSrc: soundLevel2,
  },
  {
    id: 'level-3',
    name: 'Level 3',
    duration: 40_000,
    difficulty: 1.5,
    planetSize: 1.5,
    hearts: 2,
    planetSrc: venusPlanet,
    soundSrc: soundLevel3,
  },
  {
    id: 'level-4',
    name: 'Level 4',
    duration: 40_000,
    difficulty: 2,
    planetSize: 1,
    hearts: 1,
    planetSrc: eresPlanet,
    soundSrc: soundLevel4,
  },
];
