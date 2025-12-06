import { BASE_ENEMY_SPAWN_INTERVAL, BASE_ENEMY_SPEED } from "../constants";
import type { DEFAULT_DATA } from "../gameData";
import type { GameConfig } from "../types";

export function resetData(data: typeof DEFAULT_DATA, config: GameConfig) {
  data.planetHealth = config.hearts;
  data.enemySpeed = BASE_ENEMY_SPEED * config.difficulty;
  data.enemySpawnInterval = BASE_ENEMY_SPAWN_INTERVAL / config.difficulty;
  data.enemies.length = 0;
  data.lasers.length = 0;
  data.lastShotTime = 0;
  data.lastEnemySpawnTime = 0;
  data.shotsFired = 0;
  data.hits = 0;
  data.misses = 0;
}
