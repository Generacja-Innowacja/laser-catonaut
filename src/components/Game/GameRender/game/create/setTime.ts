import type { DEFAULT_DATA } from '../gameData';
import type { GameConfig } from '../types';

export function setTime(
  this: Phaser.Scene,
  data: typeof DEFAULT_DATA,
  config: GameConfig
) {
  data.roundDuration = config.duration;
  data.roundStartTime = this.time.now;
  data.timeLeftMs = data.roundDuration;
}
