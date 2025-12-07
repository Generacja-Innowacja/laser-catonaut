export interface Player {
  id: string;
  name: string;
  imageSrc: string;
  thumbnailSrc: string;
  description: string;
}

export interface Enemy {
  id: string;
  imageSrc: string;
}

export interface Level {
  id: string;
  name: string;
  duration: number;
  hearts: number;
  difficulty: number;
  planetSrc: string;
  planetSize: number;
  soundSrc: string;
}
