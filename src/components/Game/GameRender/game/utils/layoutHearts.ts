import { DEFAULT_DATA } from "./../gameData";
export function layoutHearts(data: typeof DEFAULT_DATA, width: number) {
  if (data.hearts.length === 0) return;

  const spacing = 8;
  const hw = data.hearts[0].displayWidth;
  const totalWidth =
    data.hearts.length * hw + (data.hearts.length - 1) * spacing;
  let x = width / 2 - totalWidth / 2;

  for (const heart of data.hearts) {
    heart.x = x + heart.displayWidth / 2;
    x += heart.displayWidth + spacing;
  }
}
