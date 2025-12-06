import {
  BASE_ENEMY_SPAWN_INTERVAL,
  BASE_ENEMY_SPEED,
  TEXTURE_HEART,
  TEXTURE_PLANET,
  TEXTURE_PLAYER,
} from '../constants';
import type { DEFAULT_DATA } from '../gameData';
import type { GameConfig } from '../types';
import { layoutHearts } from '../utils/layoutHearts';
import { shootLaser } from '../utils/shootLaser';
import { triggerGameOver } from '../utils/triggetGameOver';
import { updateHearts } from '../utils/updateHearts';
import { updateHud } from '../utils/updateHud';

export function getCreate(config: GameConfig, data: typeof DEFAULT_DATA) {
  return function (this: Phaser.Scene) {
    const { width, height } = this.scale;
    // Reset state
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

    // czas
    data.roundDuration = config.duration;
    data.roundStartTime = this.time.now;
    data.timeLeftMs = data.roundDuration;

    data.onGameOverCallback = config.onGameOver;
    data.isGameOver = false;

    // Center planet
    data.planet = this.add.image(width / 2, height / 2, TEXTURE_PLANET);
    data.planet.setOrigin(0.5, 0.5);
    this.textures
      .get(TEXTURE_PLANET)
      .setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Player cat (above the planet)
    data.player = this.add.image(width / 2, height / 4, TEXTURE_PLAYER);
    data.player.setScale(2);
    data.player.setOrigin(0.5, 0.5);
    this.textures
      .get(TEXTURE_PLAYER)
      .setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Compute collision radii based on rendered size
    data.planetRadius = data.planet.displayWidth / 2;
    data.playerRadius = data.player.displayWidth / 2;

    // Input – arrows + WASD + SPACE
    data.cursors = this.input.keyboard!.createCursorKeys();
    data.spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    const wasd = this.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;

    data.keyW = wasd.W;
    data.keyA = wasd.A;
    data.keyS = wasd.S;
    data.keyD = wasd.D;

    // Mouse – lewy przycisk strzela w punkt kliknięcia
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        shootLaser(data, this, this.time.now, {
          x: pointer.worldX,
          y: pointer.worldY,
        });
      }
    });

    // HUD text
    data.hudText = this.add.text(16, 16, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    });
    data.hudText.setScrollFactor(0);

    // Hearts HUD (na środku)
    for (const heart of data.hearts) {
      heart.destroy();
    }
    data.hearts = [];

    const heartsCount = data.planetHealth; // initial HP
    const baseY = height / 2;

    for (let i = 0; i < heartsCount; i++) {
      const heart = this.add.image(0, baseY, TEXTURE_HEART);
      heart.setOrigin(0.5, 0.5);
      heart.setScale(1.5);
      data.hearts.push(heart);
    }

    layoutHearts(data, width);
    updateHud(data);
    updateHearts(data);

    // Limit czasu: jeśli po ROUND_DURATION planeta żyje -> timeUp
    this.time.addEvent({
      delay: data.roundDuration,
      callback: () => {
        if (data.isGameOver) return;
        data.timeLeftMs = 0;
        updateHud(data);
        triggerGameOver(data, this, 'timeUp');
      },
    });
  };
}
