import {
  BASE_ENEMY_SPAWN_INTERVAL,
  BASE_ENEMY_SPEED,
  BASE_PLANET_HEALTH,
  BASE_ROUND_DURATION,
} from './constants';
import type { Enemy, GameConfig, Laser } from './types';

export const DEFAULT_DATA = {
  enemies: [] as Enemy[],
  lasers: [] as Laser[],

  player: null as Phaser.GameObjects.Image | null,
  planet: null as Phaser.GameObjects.Image | null,

  cursors: null as Phaser.Types.Input.Keyboard.CursorKeys | null,
  spaceKey: null as Phaser.Input.Keyboard.Key | null,

  keyW: null as Phaser.Input.Keyboard.Key | null,
  keyA: null as Phaser.Input.Keyboard.Key | null,
  keyS: null as Phaser.Input.Keyboard.Key | null,
  keyD: null as Phaser.Input.Keyboard.Key | null,

  lastShotTime: 0,
  lastEnemySpawnTime: 0,
  enemySpawnInterval: BASE_ENEMY_SPAWN_INTERVAL,
  planetHealth: BASE_PLANET_HEALTH,
  enemySpeed: BASE_ENEMY_SPEED,
  roundDuration: BASE_ROUND_DURATION,
  roundStartTime: 0,
  timeLeftMs: BASE_ROUND_DURATION,

  planetRadius: 0,
  playerRadius: 0,
  shotsFired: 0,
  hits: 0,
  misses: 0,

  hudText: null as Phaser.GameObjects.Text | null,
  hearts: [] as Phaser.GameObjects.Image[],

  isGameOver: false,
  onGameOverCallback: undefined as GameConfig['onGameOver'] | undefined,
};
