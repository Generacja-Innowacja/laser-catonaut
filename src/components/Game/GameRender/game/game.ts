import * as Phaser from 'phaser';
import { getCreate } from './create/create';
import { DEFAULT_DATA } from './gameData';
import { getPreload } from './preload/preload';
import type { GameConfig } from './types';
import { getUpdate } from './update/update';

const data = {
  ...DEFAULT_DATA,
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
    create: getCreate(config, data),
    update: getUpdate(config, data),
  },
});
