import type { GamePhase } from '../types/game';

export interface CameraFocus {
  x: number;
  y: number;
  scale: number;
}

export const SCENE_BG: Record<GamePhase, string> = {
  entrance: '/images/s01-door.png',
  room: '/images/s02-room.png',
  laptop: '/images/s03-laptop.png',
  printing: '/images/s02-room.png',
  binder: '/images/s02-room.png',
  letter: '/images/s02-room.png',
  complete: '/images/s02-room.png',
};

/** Gentle camera — HUD is screen-fixed */
export const CAMERA: Record<GamePhase, CameraFocus> = {
  entrance: { x: 52, y: 48, scale: 1 },
  room: { x: 50, y: 52, scale: 1 },
  laptop: { x: 48, y: 48, scale: 1.08 },
  printing: { x: 62, y: 52, scale: 1.2 },
  binder: { x: 78, y: 40, scale: 1.18 },
  letter: { x: 50, y: 55, scale: 1.12 },
  complete: { x: 50, y: 55, scale: 1.12 },
};

/** Calibrated to s01-door / s02-room artwork */
export const OBJECTS = {
  /** Centered arched door in s01 */
  door: { x: 44, y: 16, w: 18, h: 62 },
  /** Center desk laptop in s02 */
  laptop: { x: 40, y: 38, w: 18, h: 22 },
  printer: { x: 58, y: 44, w: 12, h: 16 },
  binder: { x: 76, y: 12, w: 18, h: 58 },
} as const;

export const PHASE_LABEL: Record<GamePhase, string> = {
  entrance: '입구',
  room: '관측실',
  laptop: '노트북',
  printing: '프린터',
  binder: '보관함',
  letter: '편지',
  complete: '완료',
};
