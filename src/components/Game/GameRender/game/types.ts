export interface GameOver {
  reason: "planetDestroyed" | "playerHit" | "timeUp";
  stats?: {
    planetHealth: number;
    hits: number;
    misses: number;
    shotsFired: number;
  };
}

export interface GameConfig {
  planetImage: string;
  playerImage: string;
  duration: number;
  hearts: number;
  difficulty: number;
  planetSize: number;
  onGameOver?: (data: GameOver) => void;
}

export interface Enemy {
  sprite: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
}

export interface Laser {
  sprite: Phaser.GameObjects.Rectangle;
  vx: number;
  vy: number;
}
