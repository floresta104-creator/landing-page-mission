import type { TourScene } from '../types';

export interface CameraView {
  x: number;
  y: number;
  scale: number;
}

export const CAMERA_VIEWS: Record<TourScene, CameraView> = {
  entrance: { x: 0, y: 0, scale: 1 },
  room: { x: 0, y: 0, scale: 1 },
  laptop: { x: 0, y: -2, scale: 1.08 },
  printing: { x: 0, y: 0, scale: 1.05 },
  bookshelf: { x: -8, y: 0, scale: 1.12 },
  binder: { x: 0, y: 0, scale: 1.04 },
  letter: { x: 0, y: 0, scale: 1.04 },
  complete: { x: 0, y: 0, scale: 1.04 },
};

export function sceneLabel(scene: TourScene): string {
  const labels: Record<TourScene, string> = {
    entrance: '오르비룸 입구',
    room: '관측실',
    laptop: '노트북 기능 소개',
    printing: '소개 기록 출력',
    bookshelf: '책장',
    binder: '기록 보관함',
    letter: '편지',
    complete: '구독 완료',
  };
  return labels[scene];
}
