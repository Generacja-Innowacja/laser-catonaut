import { LASER_SPEED, SHOT_COOLDOWN, SOUND_LASER } from '../../constants';
import type { DEFAULT_DATA } from '../../gameData';
import { updateHud } from '../hud/updateHud';

export function shootLaser(
  data: typeof DEFAULT_DATA,
  scene: Phaser.Scene,
  time: number,
  target?: { x: number; y: number }
) {
  if (
    !data.player ||
    data.isGameOver ||
    time - data.lastShotTime < SHOT_COOLDOWN
  ) {
    return;
  }

  data.lastShotTime = time;
  data.shotsFired += 1;
  updateHud(data);

  let dir: Phaser.Math.Vector2;

  if (target) {
    dir = new Phaser.Math.Vector2(
      target.x - data.player.x,
      target.y - data.player.y
    );
  } else {
    dir = new Phaser.Math.Vector2(
      data.player.x - (data.planet?.x || 0),
      data.player.y - (data.planet?.y || 0)
    );
  }

  dir = dir.normalize();

  const laserSprite = scene.add.rectangle(
    data.player.x,
    data.player.y,
    64,
    4,
    0x66_ff_ff
  );
  laserSprite.setOrigin(0, 0);
  laserSprite.rotation = Phaser.Math.Angle.Between(0, 0, dir.x, dir.y);

  data.lasers.push({
    sprite: laserSprite,
    vx: dir.x * LASER_SPEED,
    vy: dir.y * LASER_SPEED,
  });

  scene.sound.play(SOUND_LASER, {
    volume: 0.5,
  });

  scene.tweens.add({
    targets: data.player,
    scaleX: 1.03,
    scaleY: 0.96,
    duration: 80,
    yoyo: true,
    ease: 'Quad.easeOut',
  });
}
