import { getNumberRoundedUpTo } from '@/utils/number/getNumberRoundedUpTo';
import { getRandomNumberInRange } from '@/utils/number/getRandomNumberInRange';
import { NUMBER_OF_STARS, STARS_GAP } from './StarsBackground.constants';

export const getStarPosition = (): { top: number; left: number } => {
  const top = getRandomNumberInRange(0, 100);
  const left = getRandomNumberInRange(0, 100);
  const gap = STARS_GAP;

  return {
    top: getNumberRoundedUpTo(gap, top),
    left: getNumberRoundedUpTo(gap, left),
  };
};

export const getStarsList = () =>
  [...Array(NUMBER_OF_STARS)].map(() => ({
    position: getStarPosition(),
  }));
