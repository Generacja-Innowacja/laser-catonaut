import type { DEFAULT_DATA } from '../gameData';
import type { Enemy } from '../types';
export function fadeOutEnemy(
  data: typeof DEFAULT_DATA,
  scene: Phaser.Scene,
  enemy: Enemy,
  index: number,
  duration: number
) {
  data.enemies.splice(index, 1);
  scene.tweens.add({
    targets: enemy.sprite,
    alpha: 0,
    duration,
    onComplete: () => {
      enemy.sprite.destroy();
    },
  });
}
