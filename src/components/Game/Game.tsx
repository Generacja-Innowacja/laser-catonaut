import { useState } from "react";
import GameRender from "./GameRender/GameRender";
import PlayerSelector from "./PlayerSelector/PlayerSelector";

const Game = (): React.ReactElement => {
  const [playerId, setPlayerId] = useState<null | string>(null);

  const handleRestart = () => {
    setPlayerId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[600px] w-[800px]">
        {!playerId && <PlayerSelector onPlayerSelect={setPlayerId} />}
        {playerId && (
          <GameRender playerId={playerId} onRestart={handleRestart} />
        )}
      </div>
      <div className="title text-white">Laser Catonaut</div>
    </div>
  );
};

export default Game;
