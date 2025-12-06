import { DEFAULT_PLAYER, LEVELS, PLAYERS } from "@/constants/common";
import * as Phaser from "phaser";
import { useEffect, useRef, useState } from "react";
import GameOverView from "./GameOver/GameOver";
import { getConfig } from "./game/game";
import type { GameOver } from "./game/types";

interface Props {
  playerId: string;
  levelIndex: number;
  onRestart(): void;
  onNextLevel(): void;
}

const GameRender = ({
  playerId,
  levelIndex,
  onRestart,
  onNextLevel,
}: Props): React.ReactElement => {
  const game = useRef<Phaser.Game | undefined>(undefined);
  const [gameOver, setGameOver] = useState<GameOver>();
  const level = LEVELS[levelIndex];
  const levelAudio = useRef(new Audio(level.soundSrc));
  const isLastLevel = levelIndex === LEVELS.length - 1;

  const handleGameOver = (data: GameOver) => {
    setGameOver(data);
    levelAudio.current.pause();
    game!.current!.destroy(true);
  };

  const handleNextLevel = () => {
    setGameOver(undefined);
    onNextLevel();
  };

  const startGame = () => {
    const currentPlayer =
      PLAYERS.find((player) => player.id === playerId) || DEFAULT_PLAYER;

    const gameConfig = getConfig({
      planetImage: level.planetSrc,
      duration: level.duration,
      hearts: level.hearts,
      difficulty: level.difficulty,
      playerImage: currentPlayer.imageSrc,
      onGameOver: handleGameOver,
    });

    const gameContent = document.getElementById("game-content");
    const isGameContentHasCanvas = Boolean(
      gameContent?.querySelector("canvas"),
    );

    if (!isGameContentHasCanvas) {
      game.current = new Phaser.Game(gameConfig);
    }
  };

  useEffect(() => {
    levelAudio.current = new Audio(level.soundSrc);
    levelAudio.current.play();
    startGame();

    return () => levelAudio.current.pause();
  }, [level]);

  return (
    <div className="relative border-4 border-white w-full h-full backdrop-blur-xs">
      <div className="h-full w-full" id="game-content"></div>
      {gameOver && (
        <div className="absolute top-0 left-0 h-full w-full flex flex-col gap-4 justify-center items-center z-10 bg-stars-night text-center">
          <GameOverView
            data={gameOver}
            onNextLevel={handleNextLevel}
            onRestart={onRestart}
            isLastLevel={isLastLevel}
          />
        </div>
      )}
    </div>
  );
};

export default GameRender;
