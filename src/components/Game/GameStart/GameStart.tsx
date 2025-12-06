import howToPlayImage from "@/assets/images/how-to-play.gif";

interface Props {
  onStart(): void;
}

const GameStart = ({ onStart }: Props) => {
  return (
    <div className="nes-container is-dark with-title w-full h-full">
      <p className="title">How to play?</p>
      <img src={howToPlayImage} className="w-full mb-3" />
      <section className="message-list mb-3">
        <section className="message -left">
          <div className="nes-balloon from-left is-dark">
            <p>
              Your mission is to fight asteroids to protect your cat nation on 4
              planets!
            </p>
          </div>
        </section>
      </section>
      <button type="button" className="nes-btn" onClick={onStart}>
        Start
      </button>
    </div>
  );
};

export default GameStart;
