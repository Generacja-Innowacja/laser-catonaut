import * as Phaser from "phaser";
import type { DEFAULT_DATA } from "../gameData";
import type { GameOver } from "../types";

export function triggerGameOver(
  data: typeof DEFAULT_DATA,
  scene: Phaser.Scene,
  reason: GameOver["reason"],
) {
  if (data.isGameOver) return;
  data.isGameOver = true;

  scene.time.delayedCall(300, () => {
    if (data.onGameOverCallback) {
      data.onGameOverCallback({
        reason,
        stats: {
          planetHealth: data.planetHealth,
          hits: data.hits,
          misses: data.misses,
          shotsFired: data.shotsFired,
        },
      });
    }
  });
}
