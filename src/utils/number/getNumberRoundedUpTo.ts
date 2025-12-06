export const getNumberRoundedUpTo = (roundTo: number, value: number) =>
  Math.round(value / roundTo) * roundTo;
