import * as Phaser from "phaser";
import {
  SOUND_EXPLOSION,
  SOUND_LIGHT_EXPLOSION,
  TEXTURE_EXPLOSION,
} from "../constants";

export function spawnExplosion(
  scene: Phaser.Scene,
  x: number,
  y: number,
  type: "light" | "hard",
) {
  const explosion = scene.add.image(x, y, TEXTURE_EXPLOSION);
  explosion.setOrigin(0.5, 0.5);
  explosion.setScale(0.25);

  scene.sound.play(type === "light" ? SOUND_LIGHT_EXPLOSION : SOUND_EXPLOSION, {
    volume: 0.7,
  });

  scene.tweens.add({
    targets: explosion,
    alpha: 0,
    scale: 1.1,
    duration: 400,
    onComplete: () => {
      explosion.destroy();
    },
  });
}
