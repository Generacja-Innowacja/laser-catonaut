import { getRandomNumberInRange } from "@/utils/number/getRandomNumberInRange";
import { type CSSProperties, useState } from "react";
import { twMerge } from "tailwind-merge";
import { STAR_BASE_SIZE } from "./Star.constants";
import { getRandomStar } from "./Star.utils";

interface Props {
  className?: string;
  style?: CSSProperties;
}

const Star = ({ className, style }: Props): React.ReactElement => {
  const [animationDelay] = useState(getRandomNumberInRange(0, 3000));
  const [star] = useState(getRandomStar());

  return (
    <img
      src={star.src}
      className={twMerge("h-3 w-3 animate-pulse", className)}
      style={{
        ...style,
        animationDelay: `${animationDelay}ms`,
        width: star.size * STAR_BASE_SIZE,
        height: star.size * STAR_BASE_SIZE,
      }}
    />
  );
};

export default Star;
