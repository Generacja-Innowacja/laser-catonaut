import * as Phaser from 'phaser';

export const ENEMY_ANGLE_OFFSET = Phaser.Math.DegToRad(45);
export const SHOT_COOLDOWN = 200;
export const BASE_ENEMY_SPAWN_INTERVAL = 1500;
export const BASE_ENEMY_SPEED = 40;
export const BASE_PLANET_HEALTH = 3;
export const BASE_ROUND_DURATION = 1000;
export const LASER_SPEED = 1000;
export const MOVE_SPEED = 200;
export const GRAVITY_SPEED = 40;

export const ENEMY_FADE_DURATION = 300;
export const ENEMY_FADE_FAST_DURATION = 80;

export const TEXTURE_PLANET = 'planet';
export const TEXTURE_PLAYER = 'player';
export const TEXTURE_HEART = 'heart';
export const TEXTURE_EXPLOSION = 'explosion';

export const SOUND_LASER = 'laserSound';
export const SOUND_EXPLOSION = 'explosionSound';
export const SOUND_LIGHT_EXPLOSION = 'explosionLightSound';
