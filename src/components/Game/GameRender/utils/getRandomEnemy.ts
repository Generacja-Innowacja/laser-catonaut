import { ENEMIES } from "@/constants/common";
import { getRandomNumberInRange } from "@/utils/number/getRandomNumberInRange";

export const getRandomEnemy = () =>
  ENEMIES[getRandomNumberInRange(0, ENEMIES.length - 1)] || ENEMIES[0];
