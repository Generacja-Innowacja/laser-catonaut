import { ENEMY_FADE_DURATION, ENEMY_FADE_FAST_DURATION } from "../constants";
import type { DEFAULT_DATA } from "../gameData";
import type { GameConfig } from "../types";
import { fadeOutEnemy } from "../utils/fadeOutEnemy";
import { layoutHearts } from "../utils/layoutHearts";
import { shootLaser } from "../utils/shootLaser";
import { spawnEnemy } from "../utils/spawnEnemy";
import { spawnExplosion } from "../utils/spawnExplosion";
import { triggerGameOver } from "../utils/triggetGameOver";
import { updateHearts } from "../utils/updateHearts";
import { updateHud } from "../utils/updateHud";

export function getUpdate(_config: GameConfig, data: typeof DEFAULT_DATA) {
  return function (this: Phaser.Scene, _time: number, delta: number) {
    if (!data.player || !data.planet || !data.cursors) return;

    const dt = delta / 1000;
    const moveSpeed = 200; // px/s (keyboard)
    const gravity = 40; // px/s gravity towards planet center

    // aktualizujemy czas rundy
    const now = this.time.now;
    data.timeLeftMs = Math.max(
      0,
      data.roundDuration - (now - data.roundStartTime),
    );
    updateHud(data);

    if (data.isGameOver) {
      return;
    }

    // 1) Keyboard movement (arrows + WASD)
    let dx = 0;
    let dy = 0;

    if (data.cursors.left?.isDown || data.keyA?.isDown) dx -= 1;
    if (data.cursors.right?.isDown || data.keyD?.isDown) dx += 1;
    if (data.cursors.up?.isDown || data.keyW?.isDown) dy -= 1;
    if (data.cursors.down?.isDown || data.keyS?.isDown) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const dir = new Phaser.Math.Vector2(dx, dy).normalize();
      data.player.x += dir.x * moveSpeed * dt;
      data.player.y += dir.y * moveSpeed * dt;
    }

    // 2) Gravity towards planet center (keeps the cat “orbiting”)
    const toPlanet = new Phaser.Math.Vector2(
      data.planet.x - data.player.x,
      data.planet.y - data.player.y,
    );

    const distanceToPlanet = toPlanet.length();

    if (distanceToPlanet > 1) {
      toPlanet.normalize();
      const gravityStep = gravity * dt;
      data.player.x += toPlanet.x * gravityStep;
      data.player.y += toPlanet.y * gravityStep;
    }

    // 3) Collision: keep player outside planet radius (bounding circle)
    const minDistance = data.planetRadius + data.playerRadius * 3;
    const fromPlanet = new Phaser.Math.Vector2(
      data.player.x - data.planet.x,
      data.player.y - data.planet.y,
    );
    const newDistance = fromPlanet.length();

    if (newDistance < minDistance && newDistance > 0) {
      const pushDir = fromPlanet.normalize();
      data.player.x = data.planet.x + pushDir.x * minDistance;
      data.player.y = data.planet.y + pushDir.y * minDistance;
    }

    // 4) Keep player inside screen
    const { width, height } = this.scale;
    data.player.x = Phaser.Math.Clamp(data.player.x, 0, width);
    data.player.y = Phaser.Math.Clamp(data.player.y, 0, height);

    // 5) Shooting (Space – dalej planeta -> kot)
    if (Phaser.Input.Keyboard.JustDown(data.spaceKey)) {
      shootLaser(data, this, this.time.now);
    }

    // 6) Spawn enemies over time
    if (now - data.lastEnemySpawnTime > data.enemySpawnInterval) {
      data.lastEnemySpawnTime = now;
      spawnEnemy(data, this);
    }

    // 7) Update enemies
    for (let i = data.enemies.length - 1; i >= 0; i--) {
      const enemy = data.enemies[i];
      enemy.sprite.x += enemy.vx * dt;
      enemy.sprite.y += enemy.vy * dt;

      // Player–enemy collision (asteroid kills the cat)
      const distToPlayer = Phaser.Math.Distance.Between(
        enemy.sprite.x,
        enemy.sprite.y,
        data.player.x,
        data.player.y,
      );
      const playerHitRadius =
        enemy.sprite.displayWidth / 2 + data.playerRadius * 0.6;

      if (distToPlayer < playerHitRadius) {
        this.cameras.main.shake(250, 0.02);
        fadeOutEnemy(data, this, enemy, i, ENEMY_FADE_FAST_DURATION);
        triggerGameOver(data, this, "playerHit");
        break;
      }

      // Enemy hits planet -> damage planet
      const distToPlanet = Phaser.Math.Distance.Between(
        enemy.sprite.x,
        enemy.sprite.y,
        data.planet.x,
        data.planet.y,
      );

      if (distToPlanet < data.planetRadius) {
        data.planetHealth -= 1;
        updateHud(data);
        updateHearts(data);

        this.cameras.main.shake(200, 0.01);
        spawnExplosion(this, enemy.sprite.x, enemy.sprite.y, "hard");

        // szybki fade-out przy uderzeniu w planetę
        fadeOutEnemy(data, this, enemy, i, ENEMY_FADE_FAST_DURATION);

        if (data.planetHealth <= 0) {
          triggerGameOver(data, this, "planetDestroyed");
        }
      }
    }

    // 8) Update lasers
    for (let i = data.lasers.length - 1; i >= 0; i--) {
      const laser = data.lasers[i];
      laser.sprite.x += laser.vx * dt;
      laser.sprite.y += laser.vy * dt;

      // laser nie może przekroczyć planety – jeśli wpadnie w jej promień, znika
      const distToPlanetForLaser = Phaser.Math.Distance.Between(
        laser.sprite.x,
        laser.sprite.y,
        data.planet.x,
        data.planet.y,
      );
      if (distToPlanetForLaser < data.planetRadius) {
        laser.sprite.destroy();
        data.lasers.splice(i, 1);
        continue;
      }

      // Remove lasers that leave the screen (count as miss)
      if (
        laser.sprite.x < -50 ||
        laser.sprite.x > width + 50 ||
        laser.sprite.y < -50 ||
        laser.sprite.y > height + 50
      ) {
        laser.sprite.destroy();
        data.lasers.splice(i, 1);
        data.misses += 1;
        updateHud(data);
      }
    }

    // 9) Laser–enemy collisions
    for (let e = data.enemies.length - 1; e >= 0; e--) {
      const enemy = data.enemies[e];

      for (let l = data.lasers.length - 1; l >= 0; l--) {
        const laser = data.lasers[l];

        const dist = Phaser.Math.Distance.Between(
          enemy.sprite.x,
          enemy.sprite.y,
          laser.sprite.x,
          laser.sprite.y,
        );

        const hitRadius =
          (enemy.sprite.displayWidth + laser.sprite.width) / 2 / 1.3;

        if (dist < hitRadius) {
          // Enemy killed – wolniejszy fade-out + eksplozja
          data.hits += 1;
          updateHud(data);

          spawnExplosion(this, enemy.sprite.x, enemy.sprite.y, "light");
          fadeOutEnemy(data, this, enemy, e, ENEMY_FADE_DURATION);

          // Laser znika natychmiast
          laser.sprite.destroy();
          data.lasers.splice(l, 1);

          break; // move to next enemy
        }
      }
    }

    // re-layout hearts in case canvas size changed
    layoutHearts(data, this.scale.width);
  };
}
