import clickSound from "@/assets/sounds/blip.wav";
import { PLAYERS } from "@/constants/common";

interface Props {
  onPlayerSelect(id: string): void;
}

const clickAudio = new Audio(clickSound);

const PlayerSelector = ({ onPlayerSelect }: Props) => {
  return (
    <div className="nes-container is-dark with-title w-full h-full">
      <p className="title">Choose your player</p>
      <div className="flex flex-col h-full">
        {PLAYERS.map(({ id, name, imageSrc }) => (
          <button
            key={id}
            type="button"
            className="nes-btn h-full w-full"
            onClick={() => {
              clickAudio.play();
              onPlayerSelect(id);
            }}
          >
            <div className="flex gap-8 items-center justify-center">
              <img
                src={imageSrc}
                className="h-8 w-8"
                style={{ imageRendering: "pixelated" }}
              />
              {name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelector;
