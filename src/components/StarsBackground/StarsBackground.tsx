import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Star from "./Star/Star";
import { getStarsList } from "./StarsBackground.utils";

interface Props {
  className?: string;
}

const StarsBackground = ({ className }: Props): React.ReactElement => {
  const [stars] = useState(getStarsList());

  return (
    <div
      className={twMerge(
        "w-full h-full bg-stars-night overflow-hidden",
        className,
      )}
    >
      <div className="relative w-full h-full">
        {stars.map(({ position }, index) => (
          <Star
            key={index}
            className="absolute"
            style={{
              top: `${position.top}%`,
              left: `${position.left}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StarsBackground;
