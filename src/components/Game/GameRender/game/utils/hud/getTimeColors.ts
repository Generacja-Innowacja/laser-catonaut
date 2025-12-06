import * as Phaser from 'phaser';
import type { DEFAULT_DATA } from '../../gameData';

export function getTimeColor(data: typeof DEFAULT_DATA): string {
  if (data.roundDuration <= 0) {
    return '#ff0000';
  }

  // 1 = full time (green), 0 = no time (red)
  const t = Phaser.Math.Clamp(data.timeLeftMs / data.roundDuration, 0, 1);
  const r = Math.round((1 - t) * 255);
  const g = Math.round(t * 255);
  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = '00';

  return `#${rr}${gg}${bb}`;
}
