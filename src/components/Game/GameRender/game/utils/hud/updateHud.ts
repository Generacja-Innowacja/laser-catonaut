import type { DEFAULT_DATA } from '../../gameData';
import { getTimeColor } from './getTimeColors';

export function updateHud(data: typeof DEFAULT_DATA) {
  if (!data.hudText) return;

  const secondsLeft = Math.max(0, data.timeLeftMs / 1000);
  const timeText = secondsLeft.toFixed(1);

  data.hudText.setText(
    `Time: ${timeText}s  |  Hits: ${data.hits}   Misses: ${data.misses}   Planet HP: ${data.planetHealth}`
  );
  data.hudText.setColor(getTimeColor(data));
}
