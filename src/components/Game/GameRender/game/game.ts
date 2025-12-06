import * as Phaser from 'phaser';
import {
  BASE_ENEMY_SPAWN_INTERVAL,
  BASE_ENEMY_SPEED,
  BASE_PLANET_HEALTH,
  BASE_ROUND_DURATION,
  ENEMY_ANGLE_OFFSET,
  ENEMY_FADE_DURATION,
  ENEMY_FADE_FAST_DURATION,
  SHOT_COOLDOWN,
  SOUND_EXPLOSION,
  SOUND_LASER,
  SOUND_LIGHT_EXPLOSION,
  TEXTURE_EXPLOSION,
  TEXTURE_HEART,
  TEXTURE_PLANET,
  TEXTURE_PLAYER,
} from './constants';
import { getPreload } from './gamePreload';
import { getRandomEnemy } from './getRandomEnemy';
import type { Enemy, GameConfig, Laser } from './types';

const enemies: Enemy[] = [];
const lasers: Laser[] = [];

let player: Phaser.GameObjects.Image;
let planet: Phaser.GameObjects.Image;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let spaceKey: Phaser.Input.Keyboard.Key;

// WASD
let keyW: Phaser.Input.Keyboard.Key;
let keyA: Phaser.Input.Keyboard.Key;
let keyS: Phaser.Input.Keyboard.Key;
let keyD: Phaser.Input.Keyboard.Key;

let lastShotTime = 0;
let lastEnemySpawnTime = 0;
let enemySpawnInterval = BASE_ENEMY_SPAWN_INTERVAL; // ms
let planetHealth = BASE_PLANET_HEALTH;
let enemySpeed = BASE_ENEMY_SPEED;
let roundDuration = BASE_ROUND_DURATION;
let roundStartTime = 0;
let timeLeftMs = roundDuration;

let planetRadius = 0;
let playerRadius = 0;
let shotsFired = 0;
let hits = 0;
let misses = 0;
let hudText: Phaser.GameObjects.Text;
let hearts: Phaser.GameObjects.Image[] = [];

let isGameOver = false;
let onGameOverCallback: GameConfig['onGameOver'];

export const getCreate = (config: GameConfig) =>
  function (this: Phaser.Scene) {
    const { width, height } = this.scale;
    // Reset state
    planetHealth = config.hearts;
    enemySpeed = BASE_ENEMY_SPEED * config.difficulty;
    enemySpawnInterval = BASE_ENEMY_SPAWN_INTERVAL / config.difficulty;
    enemies.length = 0;
    lasers.length = 0;
    lastShotTime = 0;
    lastEnemySpawnTime = 0;
    shotsFired = 0;
    hits = 0;
    misses = 0;

    // czas
    roundDuration = config.duration;
    roundStartTime = this.time.now;
    timeLeftMs = roundDuration;

    onGameOverCallback = config.onGameOver;
    isGameOver = false;

    // Center planet
    planet = this.add.image(width / 2, height / 2, TEXTURE_PLANET);
    planet.setOrigin(0.5, 0.5);
    this.textures
      .get(TEXTURE_PLANET)
      .setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Player cat (above the planet)
    player = this.add.image(width / 2, height / 4, TEXTURE_PLAYER);
    player.setScale(2);
    player.setOrigin(0.5, 0.5);
    this.textures
      .get(TEXTURE_PLAYER)
      .setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Compute collision radii based on rendered size
    planetRadius = planet.displayWidth / 2;
    playerRadius = player.displayWidth / 2;

    // Input – arrows + WASD + SPACE
    cursors = this.input.keyboard!.createCursorKeys();
    spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    const wasd = this.input.keyboard!.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;

    keyW = wasd.W;
    keyA = wasd.A;
    keyS = wasd.S;
    keyD = wasd.D;

    // Mouse – lewy przycisk strzela w punkt kliknięcia
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        shootLaser(this, this.time.now, {
          x: pointer.worldX,
          y: pointer.worldY,
        });
      }
    });

    // HUD text
    hudText = this.add.text(16, 16, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    });
    hudText.setScrollFactor(0);

    // Hearts HUD (na środku)
    for (const heart of hearts) {
      heart.destroy();
    }
    hearts = [];

    const heartsCount = planetHealth; // initial HP
    const baseY = height / 2;

    for (let i = 0; i < heartsCount; i++) {
      const heart = this.add.image(0, baseY, TEXTURE_HEART);
      heart.setOrigin(0.5, 0.5);
      heart.setScale(1.5);
      hearts.push(heart);
    }

    layoutHearts(width);
    updateHud();
    updateHearts();

    // Limit czasu: jeśli po ROUND_DURATION planeta żyje -> timeUp
    this.time.addEvent({
      delay: roundDuration,
      callback: () => {
        if (isGameOver) return;
        timeLeftMs = 0;
        updateHud();
        triggerGameOver(this, 'timeUp');
      },
    });
  };

// layout hearts centered
function layoutHearts(width: number) {
  if (hearts.length === 0) return;

  const spacing = 8;
  const hw = hearts[0].displayWidth;
  const totalWidth = hearts.length * hw + (hearts.length - 1) * spacing;
  let x = width / 2 - totalWidth / 2;

  for (const heart of hearts) {
    heart.x = x + heart.displayWidth / 2;
    x += heart.displayWidth + spacing;
  }
}

// kolor czasu: zielony -> czerwony
function getTimeColor(): string {
  if (roundDuration <= 0) return '#ff0000';
  const t = Phaser.Math.Clamp(timeLeftMs / roundDuration, 0, 1); // 1 = full time (green), 0 = no time (red)

  const r = Math.round((1 - t) * 255); // rośnie do czerwieni
  const g = Math.round(t * 255); // maleje z zieleni
  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = '00';

  return `#${rr}${gg}${bb}`;
}

function updateHud() {
  if (!hudText) return;

  const secondsLeft = Math.max(0, timeLeftMs / 1000);
  const timeText = secondsLeft.toFixed(1);

  hudText.setText(
    `Time: ${timeText}s  |  Hits: ${hits}   Misses: ${misses}   Planet HP: ${planetHealth}`
  );
  hudText.setColor(getTimeColor());
}

function updateHearts() {
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].setVisible(i < planetHealth);
  }
}

function triggerGameOver(
  scene: Phaser.Scene,
  reason: 'planetDestroyed' | 'playerHit' | 'timeUp'
) {
  if (isGameOver) return;
  isGameOver = true;

  scene.time.delayedCall(300, () => {
    if (onGameOverCallback) {
      onGameOverCallback({
        reason,
        stats: { planetHealth, hits, misses, shotsFired },
      });
    }
  });
}

function fadeOutEnemy(
  scene: Phaser.Scene,
  enemy: Enemy,
  index: number,
  duration: number
) {
  enemies.splice(index, 1);
  scene.tweens.add({
    targets: enemy.sprite,
    alpha: 0,
    duration,
    onComplete: () => {
      enemy.sprite.destroy();
    },
  });
}

function spawnEnemy(scene: Phaser.Scene) {
  const enemy = getRandomEnemy();
  const { width, height } = scene.scale;

  // Spawn on a circle around the planet, slightly outside the screen
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const spawnRadius = Math.max(width, height) / 2 + 100;

  const spawnX = planet.x + Math.cos(angle) * spawnRadius;
  const spawnY = planet.y + Math.sin(angle) * spawnRadius;

  const sprite = scene.add.image(spawnX, spawnY, enemy.id);
  sprite.setOrigin(0.5, 0.5);
  sprite.setScale(0.5);
  scene.textures.get(enemy.id).setFilter(Phaser.Textures.FilterMode.NEAREST);

  // kierunek i prędkość w stronę planety
  const dir = new Phaser.Math.Vector2(
    planet.x - spawnX,
    planet.y - spawnY
  ).normalize();

  const vx = dir.x * enemySpeed;
  const vy = dir.y * enemySpeed;

  // rotacja tak, by asteroid 45° był skierowany w stronę planety (kierunek ruchu)
  const angleToPlanet = Phaser.Math.Angle.Between(
    planet.x,
    planet.y,
    spawnX,
    spawnY + sprite.height / 2
  );
  sprite.rotation = angleToPlanet + ENEMY_ANGLE_OFFSET;

  enemies.push({
    sprite,
    vx,
    vy,
  });
}

/**
 * Prostą eksplozję robimy jako sprite + mały tween (możesz tu potem podmienić
 * na animację ze spritesheetu, jeśli zamiast gifa użyjesz klatek).
 */
function spawnExplosion(
  scene: Phaser.Scene,
  x: number,
  y: number,
  type: 'light' | 'hard'
) {
  const explosion = scene.add.image(x, y, TEXTURE_EXPLOSION);
  explosion.setOrigin(0.5, 0.5);
  explosion.setScale(0.25);

  scene.sound.play(type === 'light' ? SOUND_LIGHT_EXPLOSION : SOUND_EXPLOSION, {
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

/**
 * Strzał:
 * - bez targetu: kierunek planeta -> gracz (SPACE, tak jak wcześniej)
 * - z targetem: kierunek gracz -> punkt kliknięcia (LPM)
 */
function shootLaser(
  scene: Phaser.Scene,
  time: number,
  target?: { x: number; y: number }
) {
  if (!player) return;
  if (isGameOver) return;
  if (time - lastShotTime < SHOT_COOLDOWN) return;

  lastShotTime = time;
  shotsFired += 1;
  updateHud();

  let dir: Phaser.Math.Vector2;

  if (target) {
    // LPM – kierunek od kota do klikniętego punktu
    dir = new Phaser.Math.Vector2(target.x - player.x, target.y - player.y);
  } else {
    // SPACE – kierunek od planety do kota, jak dotychczas
    dir = new Phaser.Math.Vector2(player.x - planet.x, player.y - planet.y);
  }

  dir = dir.normalize();

  // Laser starts at player position
  const laserSprite = scene.add.rectangle(
    player.x,
    player.y,
    64,
    4,
    0x66_ff_ff
  );
  laserSprite.setOrigin(0, 0);
  laserSprite.rotation = Phaser.Math.Angle.Between(0, 0, dir.x, dir.y);

  const LASER_SPEED = 1000;

  lasers.push({
    sprite: laserSprite,
    vx: dir.x * LASER_SPEED,
    vy: dir.y * LASER_SPEED,
  });

  // dźwięk lasera
  scene.sound.play(SOUND_LASER, {
    volume: 0.5,
  });

  scene.tweens.add({
    targets: player,
    scaleX: 1.03,
    scaleY: 0.96,
    duration: 80,
    yoyo: true,
    ease: 'Quad.easeOut',
  });
}

const getUpdate = (_config: GameConfig) =>
  function (this: Phaser.Scene, _time: number, delta: number) {
    if (!player || !planet || !cursors) return;

    const dt = delta / 1000;
    const moveSpeed = 200; // px/s (keyboard)
    const gravity = 40; // px/s gravity towards planet center

    // aktualizujemy czas rundy
    const now = this.time.now;
    timeLeftMs = Math.max(0, roundDuration - (now - roundStartTime));
    updateHud();

    if (isGameOver) {
      return;
    }

    // 1) Keyboard movement (arrows + WASD)
    let dx = 0;
    let dy = 0;

    if (cursors.left?.isDown || keyA?.isDown) dx -= 1;
    if (cursors.right?.isDown || keyD?.isDown) dx += 1;
    if (cursors.up?.isDown || keyW?.isDown) dy -= 1;
    if (cursors.down?.isDown || keyS?.isDown) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const dir = new Phaser.Math.Vector2(dx, dy).normalize();
      player.x += dir.x * moveSpeed * dt;
      player.y += dir.y * moveSpeed * dt;
    }

    // 2) Gravity towards planet center (keeps the cat “orbiting”)
    const toPlanet = new Phaser.Math.Vector2(
      planet.x - player.x,
      planet.y - player.y
    );

    const distanceToPlanet = toPlanet.length();

    if (distanceToPlanet > 1) {
      toPlanet.normalize();
      const gravityStep = gravity * dt;
      player.x += toPlanet.x * gravityStep;
      player.y += toPlanet.y * gravityStep;
    }

    // 3) Collision: keep player outside planet radius (bounding circle)
    const minDistance = planetRadius + playerRadius * 3;
    const fromPlanet = new Phaser.Math.Vector2(
      player.x - planet.x,
      player.y - planet.y
    );
    const newDistance = fromPlanet.length();

    if (newDistance < minDistance && newDistance > 0) {
      const pushDir = fromPlanet.normalize();
      player.x = planet.x + pushDir.x * minDistance;
      player.y = planet.y + pushDir.y * minDistance;
    }

    // 4) Keep player inside screen
    const { width, height } = this.scale;
    player.x = Phaser.Math.Clamp(player.x, 0, width);
    player.y = Phaser.Math.Clamp(player.y, 0, height);

    // 5) Shooting (Space – dalej planeta -> kot)
    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
      shootLaser(this, this.time.now);
    }

    // 6) Spawn enemies over time
    if (now - lastEnemySpawnTime > enemySpawnInterval) {
      lastEnemySpawnTime = now;
      spawnEnemy(this);
    }

    // 7) Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.sprite.x += enemy.vx * dt;
      enemy.sprite.y += enemy.vy * dt;

      // Player–enemy collision (asteroid kills the cat)
      const distToPlayer = Phaser.Math.Distance.Between(
        enemy.sprite.x,
        enemy.sprite.y,
        player.x,
        player.y
      );
      const playerHitRadius =
        enemy.sprite.displayWidth / 2 + playerRadius * 0.6;

      if (distToPlayer < playerHitRadius) {
        this.cameras.main.shake(250, 0.02);
        fadeOutEnemy(this, enemy, i, ENEMY_FADE_FAST_DURATION);
        triggerGameOver(this, 'playerHit');
        break;
      }

      // Enemy hits planet -> damage planet
      const distToPlanet = Phaser.Math.Distance.Between(
        enemy.sprite.x,
        enemy.sprite.y,
        planet.x,
        planet.y
      );

      if (distToPlanet < planetRadius) {
        planetHealth -= 1;
        updateHud();
        updateHearts();

        this.cameras.main.shake(200, 0.01);
        spawnExplosion(this, enemy.sprite.x, enemy.sprite.y, 'hard');

        // szybki fade-out przy uderzeniu w planetę
        fadeOutEnemy(this, enemy, i, ENEMY_FADE_FAST_DURATION);

        if (planetHealth <= 0) {
          triggerGameOver(this, 'planetDestroyed');
        }
      }
    }

    // 8) Update lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
      const laser = lasers[i];
      laser.sprite.x += laser.vx * dt;
      laser.sprite.y += laser.vy * dt;

      // laser nie może przekroczyć planety – jeśli wpadnie w jej promień, znika
      const distToPlanetForLaser = Phaser.Math.Distance.Between(
        laser.sprite.x,
        laser.sprite.y,
        planet.x,
        planet.y
      );
      if (distToPlanetForLaser < planetRadius) {
        laser.sprite.destroy();
        lasers.splice(i, 1);
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
        lasers.splice(i, 1);
        misses += 1;
        updateHud();
      }
    }

    // 9) Laser–enemy collisions
    for (let e = enemies.length - 1; e >= 0; e--) {
      const enemy = enemies[e];

      for (let l = lasers.length - 1; l >= 0; l--) {
        const laser = lasers[l];

        const dist = Phaser.Math.Distance.Between(
          enemy.sprite.x,
          enemy.sprite.y,
          laser.sprite.x,
          laser.sprite.y
        );

        const hitRadius =
          (enemy.sprite.displayWidth + laser.sprite.width) / 2 / 1.3;

        if (dist < hitRadius) {
          // Enemy killed – wolniejszy fade-out + eksplozja
          hits += 1;
          updateHud();

          spawnExplosion(this, enemy.sprite.x, enemy.sprite.y, 'light');
          fadeOutEnemy(this, enemy, e, ENEMY_FADE_DURATION);

          // Laser znika natychmiast
          laser.sprite.destroy();
          lasers.splice(l, 1);

          break; // move to next enemy
        }
      }
    }

    // re-layout hearts in case canvas size changed
    layoutHearts(this.scale.width);
  };

export const getConfig = (
  config: GameConfig
): Phaser.Types.Core.GameConfig => ({
  parent: 'game-content',
  type: Phaser.CANVAS, // force Canvas renderer
  width: 792,
  height: 592,
  transparent: true,
  pixelArt: true,
  scene: {
    preload: getPreload(config),
    create: getCreate(config),
    update: getUpdate(config),
  },
});
