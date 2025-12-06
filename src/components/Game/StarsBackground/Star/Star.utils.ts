import { getRandomNumberInRange } from "@/utils/number/getRandomNumberInRange";
import { STARS } from "./Star.constants";

export const getRandomStar = () => {
  const index = getRandomNumberInRange(0, STARS.length - 1);
  return STARS[index];
};
