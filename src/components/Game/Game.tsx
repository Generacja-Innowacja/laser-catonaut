import PlayerSelector from "./PlayerSelector/PlayerSelector";

const Game = (): React.ReactElement => {
  return (
    <div className="h-[512px] w-[512px]">
      <PlayerSelector />
    </div>
  );
};

export default Game;
