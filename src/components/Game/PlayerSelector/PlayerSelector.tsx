import clickSound from "@/assets/sounds/blip.wav";
import { PLAYERS } from "@/constants/common";

interface Props {
  onPlayerSelect(id: string): void;
}

const clickAudio = new Audio(clickSound);

const PlayerSelector = ({ onPlayerSelect }: Props) => {
  return (
    <div className="nes-container is-dark with-title w-full h-full flex flex-col items-center">
      <p className="title">Choose your player</p>
      <div className="flex gap-4 h-full pb-4 overflow-x-visible">
        {PLAYERS.map(({ id, name, description, thumbnailSrc }) => (
          <div
            key={id}
            className="h-full w-full nes-container with-title is-dark min-w-[320px]"
            style={{
              background: "#000",
            }}
          >
            <p
              className="title"
              style={{
                background: "#000",
              }}
            >
              {name}
            </p>
            <div className="flex flex-col gap-4 h-full justify-between">
              <div className="flex flex-col gap-4">
                <img
                  src={thumbnailSrc}
                  className="w-full h-32 object-cover flex gap-2 shrink-0"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="text-left text-xs leading-[150%]">
                  {description}
                </div>
              </div>
              <button
                type="button"
                className="nes-btn"
                onClick={() => {
                  clickAudio.play();
                  onPlayerSelect(id);
                }}
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelector;
