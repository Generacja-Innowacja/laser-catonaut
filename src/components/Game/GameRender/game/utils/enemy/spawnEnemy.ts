import { ENEMY_ANGLE_OFFSET } from "../../constants";
import type { DEFAULT_DATA } from "../../gameData";
import { getRandomEnemy } from "./getRandomEnemy";

export function spawnEnemy(data: typeof DEFAULT_DATA, scene: Phaser.Scene) {
  const enemy = getRandomEnemy();
  const { width, height } = scene.scale;

  // Spawn on a circle around the planet, slightly outside the screen
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const spawnRadius = Math.max(width, height) / 2 + 100;

  const spawnX = (data.planet?.x || 0) + Math.cos(angle) * spawnRadius;
  const spawnY = (data.planet?.y || 0) + Math.sin(angle) * spawnRadius;

  const sprite = scene.add.image(spawnX, spawnY, enemy.id);
  sprite.setOrigin(0.5, 0.5);
  sprite.setScale(0.5);
  scene.textures.get(enemy.id).setFilter(Phaser.Textures.FilterMode.NEAREST);

  // Direction and speed
  const dir = new Phaser.Math.Vector2(
    (data.planet?.x || 0) - spawnX,
    (data.planet?.y || 0) - spawnY,
  ).normalize();

  const vx = dir.x * data.enemySpeed;
  const vy = dir.y * data.enemySpeed;

  // Angle
  const angleToPlanet = Phaser.Math.Angle.Between(
    data.planet?.x || 0,
    data.planet?.y || 0,
    spawnX,
    spawnY + sprite.height / 2,
  );
  sprite.rotation = angleToPlanet + ENEMY_ANGLE_OFFSET;

  data.enemies.push({
    sprite,
    vx,
    vy,
  });
}
