export type TourScene =
  | 'entrance'
  | 'room'
  | 'laptop'
  | 'printing'
  | 'bookshelf'
  | 'binder'
  | 'letter'
  | 'complete';

export type FeatureIndex = 0 | 1 | 2 | 3 | 4;

export interface TourState {
  scene: TourScene;
  currentFeature: FeatureIndex;
  isDoorOpening: boolean;
  isLaptopZoomed: boolean;
  isPrinting: boolean;
  isBinderOpen: boolean;
  isLetterOpen: boolean;
  soundEnabled: boolean;
  featuresComplete: boolean;
  printComplete: boolean;
  emailSubmitted: boolean;
}

export type TourAction =
  | { type: 'OPEN_DOOR' }
  | { type: 'ENTER_ROOM' }
  | { type: 'ZOOM_LAPTOP' }
  | { type: 'SET_FEATURE'; index: FeatureIndex }
  | { type: 'NEXT_FEATURE' }
  | { type: 'PREV_FEATURE' }
  | { type: 'COMPLETE_FEATURES' }
  | { type: 'START_PRINT' }
  | { type: 'FINISH_PRINT' }
  | { type: 'GO_BOOKSHELF' }
  | { type: 'OPEN_BINDER' }
  | { type: 'GO_LETTER' }
  | { type: 'OPEN_LETTER' }
  | { type: 'SUBMIT_EMAIL' }
  | { type: 'TOGGLE_SOUND' };
