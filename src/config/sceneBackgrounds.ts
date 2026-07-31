import type { TourScene } from '../types';

export const SCENE_BACKGROUNDS: Record<TourScene, string> = {
  entrance: '/images/scene-door.png',
  room: '/images/scene-room.png',
  laptop: '/images/scene-laptop.png',
  printing: '/images/scene-printer.png',
  bookshelf: '/images/scene-room.png',
  binder: '/images/scene-binder.png',
  letter: '/images/scene-letter.png',
  complete: '/images/scene-letter.png',
};

export function sceneBackground(scene: TourScene): string {
  return SCENE_BACKGROUNDS[scene];
}
