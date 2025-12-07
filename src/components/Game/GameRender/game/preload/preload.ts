import explosionImage from "@/assets/images/explosion.gif";
import heartImage from "@/assets/images/heart.png";
import boomSound from "@/assets/sounds/boom.wav";
import boomLightSound from "@/assets/sounds/boom-light.wav";
import shootSound from "@/assets/sounds/meow.mp3";
import { ENEMIES } from "@/constants/common";
import {
  SOUND_EXPLOSION,
  SOUND_LASER,
  SOUND_LIGHT_EXPLOSION,
  TEXTURE_EXPLOSION,
  TEXTURE_HEART,
  TEXTURE_PLANET,
  TEXTURE_PLAYER,
} from "../constants";
import type { GameConfig } from "../types";

export function getPreload({ planetImage, playerImage }: GameConfig) {
  return function (this: Phaser.Scene) {
    this.load.image(TEXTURE_PLANET, planetImage);
    this.load.image(TEXTURE_PLAYER, playerImage);
    this.load.image(TEXTURE_HEART, heartImage);
    this.load.image(TEXTURE_EXPLOSION, explosionImage);

    this.load.audio(SOUND_LASER, shootSound);
    this.load.audio(SOUND_LIGHT_EXPLOSION, boomLightSound);
    this.load.audio(SOUND_EXPLOSION, boomSound);

    for (const enemy of ENEMIES) {
      this.load.image(enemy.id, enemy.imageSrc);
    }
  };
}
