import * as Phaser from "phaser";
import { useEffect, useRef, useState } from "react";
import earthPlanet from "@/assets/images/planets/earth.png";
import { DEFAULT_PLAYER, PLAYERS } from "@/constants/common";
import GameOverView from "./GameOver/GameOver";
import { type GameOver as GameOverType, getConfig } from "./utils/game";

interface Props {
  playerId: string;
  onRestart(): void;
}

const GameRender = ({ playerId, onRestart }: Props): React.ReactElement => {
  const game = useRef<Phaser.Game | undefined>(undefined);
  const [gameOver, setGameOver] = useState<GameOverType>();

  const startGame = () => {
    const currentPlayer =
      PLAYERS.find((player) => player.id === playerId) || DEFAULT_PLAYER;

    const gameConfig = getConfig({
      planetImage: earthPlanet,
      playerImage: currentPlayer.imageSrc,
      onGameOver: setGameOver,
    });

    const gameContent = document.getElementById("game-content");
    const isGameContentHasCanvas = Boolean(
      gameContent?.querySelector("canvas"),
    );

    if (!game.current && !isGameContentHasCanvas) {
      game.current = new Phaser.Game(gameConfig);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  return (
    <div className="relative border-4 border-white w-full h-full backdrop-blur-xs">
      <div className="h-full w-full" id="game-content"></div>
      {gameOver && (
        <div className="absolute top-0 left-0 h-full w-full flex flex-col gap-4 justify-center items-center z-10 bg-stars-night text-center">
          <GameOverView
            data={gameOver}
            onNextLevel={() => {}}
            onRestart={onRestart}
          />
        </div>
      )}
    </div>
  );
};

export default GameRender;
