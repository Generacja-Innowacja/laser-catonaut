import { useEffect, useRef, useState } from "react";
import soundLobby from "@/assets/sounds/lobby.mp3";
import { LEVELS } from "@/constants/common";
import GameRender from "./GameRender/GameRender";
import GameStart from "./GameStart/GameStart";
import PlayerSelector from "./PlayerSelector/PlayerSelector";

const Game = (): React.ReactElement => {
  const lobbyAudio = useRef(new Audio(soundLobby));
  const [isStarted, setIsStarted] = useState(false);
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [playerId, setPlayerId] = useState<null | string>(null);

  const handleRestart = () => {
    setPlayerId(null);
    setLevelIndex(0);
  };

  const handleNextLevel = () => {
    const isHasNextLevel = levelIndex + 1 <= LEVELS.length;
    if (!isHasNextLevel) {
      return;
    }

    setLevelIndex((currentLevel) => currentLevel + 1);
  };

  useEffect(() => {
    if (!isStarted) {
      return;
    }

    if (!playerId) {
      lobbyAudio.current.play();
    } else {
      lobbyAudio.current.pause();
      lobbyAudio.current.currentTime = 0;
    }

    return () => lobbyAudio.current.pause();
  }, [playerId, isStarted]);

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[600px] w-[800px]">
        {!isStarted && <GameStart onStart={() => setIsStarted(true)} />}
        {isStarted && !playerId && (
          <PlayerSelector onPlayerSelect={setPlayerId} />
        )}
        {isStarted && playerId && (
          <GameRender
            playerId={playerId}
            levelIndex={levelIndex}
            onRestart={handleRestart}
            onNextLevel={handleNextLevel}
          />
        )}
      </div>
      <div className="title text-white">
        Laser Catonaut{playerId ? ` | Level ${levelIndex + 1}` : ""}
      </div>
    </div>
  );
};

export default Game;
