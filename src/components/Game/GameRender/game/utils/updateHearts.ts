import type { DEFAULT_DATA } from "../gameData";

export function updateHearts(data: typeof DEFAULT_DATA) {
  for (let i = 0; i < data.hearts.length; i++) {
    data.hearts[i].setVisible(i < data.planetHealth);
  }
}
