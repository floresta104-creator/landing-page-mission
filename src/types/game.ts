export type GamePhase =
  | 'entrance'
  | 'room'
  | 'laptop'
  | 'printing'
  | 'binder'
  | 'letter'
  | 'complete';

export type FeatureIndex = 0 | 1 | 2 | 3 | 4;

export interface GameState {
  phase: GamePhase;
  feature: FeatureIndex;
  doorOpening: boolean;
  printing: boolean;
  printDone: boolean;
  binderOpen: boolean;
  letterOpen: boolean;
  featuresDone: boolean;
  emailDone: boolean;
  soundOn: boolean;
}

export type GameAction =
  | { type: 'OPEN_DOOR' }
  | { type: 'ENTER_ROOM' }
  | { type: 'FOCUS_LAPTOP' }
  | { type: 'SET_FEATURE'; index: FeatureIndex }
  | { type: 'NEXT_FEATURE' }
  | { type: 'PREV_FEATURE' }
  | { type: 'START_PRINT' }
  | { type: 'FINISH_PRINT' }
  | { type: 'OPEN_BINDER' }
  | { type: 'GO_LETTER' }
  | { type: 'OPEN_LETTER' }
  | { type: 'SUBMIT_EMAIL' }
  | { type: 'TOGGLE_SOUND' };
