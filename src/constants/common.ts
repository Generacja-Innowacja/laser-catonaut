import cat1 from "@/assets/images/cats/cat-1.png";
import cat2 from "@/assets/images/cats/cat-2.png";
import cat3 from "@/assets/images/cats/cat-3.png";
import cat4 from "@/assets/images/cats/cat-4.png";

import enemy1 from "@/assets/images/enemies/enemy-1.png";
import enemy2 from "@/assets/images/enemies/enemy-2.png";
import enemy3 from "@/assets/images/enemies/enemy-3.png";
import enemy4 from "@/assets/images/enemies/enemy-4.png";

import earthPlanet from "@/assets/images/planets/earth.png";
import eresPlanet from "@/assets/images/planets/eres.png";
import marsPlanet from "@/assets/images/planets/mars.png";
import venusPlanet from "@/assets/images/planets/venus.png";

import soundLevel1 from "@/assets/sounds/level-1.mp3";
import soundLevel2 from "@/assets/sounds/level-2.mp3";
import soundLevel3 from "@/assets/sounds/level-3.mp3";
import soundLevel4 from "@/assets/sounds/level-4.mp3";

import type { Enemy, Level, Player } from "@/types/common";

export const PLAYERS: Player[] = [
  {
    id: "cat-1",
    name: "Oscar",
    imageSrc: cat1,
  },
  {
    id: "cat-2",
    name: "Kamil",
    imageSrc: cat2,
  },
  {
    id: "cat-3",
    name: "Adrian",
    imageSrc: cat3,
  },
  {
    id: "cat-4",
    name: "Natalie",
    imageSrc: cat4,
  },
];

export const DEFAULT_PLAYER = PLAYERS[0];

export const ENEMIES: Enemy[] = [
  {
    id: "enemy-1",
    imageSrc: enemy1,
  },
  {
    id: "enemy-2",
    imageSrc: enemy2,
  },
  {
    id: "enemy-3",
    imageSrc: enemy3,
  },
  {
    id: "enemy-4",
    imageSrc: enemy4,
  },
];

export const LEVELS: Level[] = [
  {
    id: "level-1",
    name: "Level 1",
    duration: 25_000,
    difficulty: 1,
    hearts: 4,
    planetSrc: earthPlanet,
    soundSrc: soundLevel1,
  },
  {
    id: "level-2",
    name: "Level 2",
    duration: 35_000,
    difficulty: 1.5,
    hearts: 3,
    planetSrc: marsPlanet,
    soundSrc: soundLevel2,
  },
  {
    id: "level-3",
    name: "Level 3",
    duration: 45_000,
    difficulty: 1.5,
    hearts: 2,
    planetSrc: venusPlanet,
    soundSrc: soundLevel3,
  },
  {
    id: "level-4",
    name: "Level 4",
    duration: 65_000,
    difficulty: 2,
    hearts: 1,
    planetSrc: eresPlanet,
    soundSrc: soundLevel4,
  },
];
