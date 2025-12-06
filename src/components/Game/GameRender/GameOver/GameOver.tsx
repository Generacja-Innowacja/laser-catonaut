import { useEffect } from "react";
import successSound from "@/assets/sounds/success.wav";
import type { GameOver } from "../utils/game";

interface Props {
  data: GameOver;
  onRestart(): void;
  onNextLevel(): void;
}

const successAudio = new Audio(successSound);
const gaveOverAudio = new Audio(successSound);

const GameOver = ({
  data,
  onRestart,
  onNextLevel,
}: Props): React.ReactElement => {
  console.log({ successSound });

  useEffect(() => {
    console.log("should play sound");

    if (data.reason === "timeUp") {
      successAudio.play();
      return;
    }

    gaveOverAudio.play();
  }, [data.reason]);

  const Stats = data.stats && (
    <div className="nes-text is-disabled opacity-50">
      Planet health: {data.stats.planetHealth} | Hits: {data.stats.hits} |
      Misses: {data.stats.misses} | Accuracy:{" "}
      {Math.round((data.stats.hits / data.stats.shotsFired) * 100) || 0}%
    </div>
  );

  if (data.reason === "timeUp") {
    return (
      <>
        <i className="nes-icon trophy is-large"></i>
        <div className="nes-text is-success">You won!</div>
        <div className="nes-text is-disabled">
          Well done for saving the planet, brave cat.
        </div>
        {Stats}
        <button type="button" className="nes-btn" onClick={onNextLevel}>
          Next level
        </button>
      </>
    );
  }

  return (
    <>
      <div className="nes-text is-dark is-error">Game over</div>
      <div className="nes-text is-disabled">
        Unfortunately, the planet has been destroyed.
      </div>
      {Stats}
      <button type="button" className="nes-btn" onClick={onRestart}>
        Restart
      </button>
    </>
  );
};

export default GameOver;
