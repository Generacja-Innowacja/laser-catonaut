import cat1 from "@/assets/vectors/cats/cat-1.svg";
import cat2 from "@/assets/vectors/cats/cat-2.svg";
import cat3 from "@/assets/vectors/cats/cat-3.svg";
import cat4 from "@/assets/vectors/cats/cat-4.svg";

const PLAYERS = [
  {
    id: "cat-1",
    name: "Oscar",
    imageSrc: cat1,
  },
  {
    id: "cat-2",
    name: "Kamil",
    imageSrc: cat2,
  },
  {
    id: "cat-3",
    name: "Adrian",
    imageSrc: cat3,
  },
  {
    id: "cat-4",
    name: "Natalie",
    imageSrc: cat4,
  },
];

const PlayerSelector = () => {
  return (
    <div className="nes-container is-dark with-title w-full h-full">
      <p className="title">Choose your player</p>
      <div className="flex flex-col h-full">
        {PLAYERS.map(({ id, name, imageSrc }) => (
          <button key={id} type="button" className="nes-btn h-full w-full">
            <div className="flex gap-8 items-center justify-center">
              <img src={imageSrc} className="h-8 w-8" />
              {name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelector;
