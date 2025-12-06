import { SHOT_COOLDOWN, SOUND_LASER } from "../../constants";
import type { DEFAULT_DATA } from "../../gameData";
import { updateHud } from "../hud/updateHud";

export function shootLaser(
  data: typeof DEFAULT_DATA,
  scene: Phaser.Scene,
  time: number,
  target?: { x: number; y: number },
) {
  if (!data.player) return;
  if (data.isGameOver) return;
  if (time - data.lastShotTime < SHOT_COOLDOWN) return;

  data.lastShotTime = time;
  data.shotsFired += 1;
  updateHud(data);

  let dir: Phaser.Math.Vector2;

  if (target) {
    // LPM – kierunek od kota do klikniętego punktu
    dir = new Phaser.Math.Vector2(
      target.x - data.player.x,
      target.y - data.player.y,
    );
  } else {
    // SPACE – kierunek od planety do kota, jak dotychczas
    dir = new Phaser.Math.Vector2(
      data.player.x - data.planet.x,
      data.player.y - data.planet.y,
    );
  }

  dir = dir.normalize();

  // Laser starts at player position
  const laserSprite = scene.add.rectangle(
    data.player.x,
    data.player.y,
    64,
    4,
    0x66_ff_ff,
  );
  laserSprite.setOrigin(0, 0);
  laserSprite.rotation = Phaser.Math.Angle.Between(0, 0, dir.x, dir.y);

  const LASER_SPEED = 1000;

  data.lasers.push({
    sprite: laserSprite,
    vx: dir.x * LASER_SPEED,
    vy: dir.y * LASER_SPEED,
  });

  // dźwięk lasera
  scene.sound.play(SOUND_LASER, {
    volume: 0.5,
  });

  scene.tweens.add({
    targets: data.player,
    scaleX: 1.03,
    scaleY: 0.96,
    duration: 80,
    yoyo: true,
    ease: "Quad.easeOut",
  });
}
