import { useCallback, useEffect, useReducer } from 'react';
import type { FeatureIndex, GameAction, GameState } from '../types/game';

const initial: GameState = {
  phase: 'entrance',
  feature: 0,
  doorOpening: false,
  printing: false,
  printDone: false,
  binderOpen: false,
  letterOpen: false,
  featuresDone: false,
  emailDone: false,
  soundOn: false,
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'OPEN_DOOR':
      return { ...state, doorOpening: true, soundOn: true };
    case 'ENTER_ROOM':
      return { ...state, phase: 'room', doorOpening: false };
    case 'FOCUS_LAPTOP':
      return { ...state, phase: 'laptop' };
    case 'SET_FEATURE':
      return { ...state, feature: action.index, featuresDone: false };
    case 'NEXT_FEATURE':
      if (state.feature >= 4) return { ...state, featuresDone: true };
      return { ...state, feature: (state.feature + 1) as FeatureIndex };
    case 'PREV_FEATURE':
      return {
        ...state,
        feature: Math.max(0, state.feature - 1) as FeatureIndex,
        featuresDone: false,
      };
    case 'START_PRINT':
      return { ...state, phase: 'printing', printing: true, printDone: false };
    case 'FINISH_PRINT':
      return { ...state, printing: false, printDone: true };
    case 'OPEN_BINDER':
      return { ...state, phase: 'binder', binderOpen: true, printDone: false };
    case 'GO_LETTER':
      return { ...state, phase: 'letter', letterOpen: false };
    case 'OPEN_LETTER':
      return { ...state, letterOpen: true };
    case 'SUBMIT_EMAIL':
      return { ...state, emailDone: true, phase: 'complete' };
    case 'TOGGLE_SOUND':
      return { ...state, soundOn: !state.soundOn };
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initial);

  const openDoor = useCallback(() => dispatch({ type: 'OPEN_DOOR' }), []);
  const enterRoom = useCallback(() => dispatch({ type: 'ENTER_ROOM' }), []);
  const focusLaptop = useCallback(() => dispatch({ type: 'FOCUS_LAPTOP' }), []);
  const setFeature = useCallback(
    (index: FeatureIndex) => dispatch({ type: 'SET_FEATURE', index }),
    [],
  );
  const nextFeature = useCallback(() => dispatch({ type: 'NEXT_FEATURE' }), []);
  const prevFeature = useCallback(() => dispatch({ type: 'PREV_FEATURE' }), []);
  const startPrint = useCallback(() => dispatch({ type: 'START_PRINT' }), []);
  const finishPrint = useCallback(() => dispatch({ type: 'FINISH_PRINT' }), []);
  const openBinder = useCallback(() => dispatch({ type: 'OPEN_BINDER' }), []);
  const goLetter = useCallback(() => dispatch({ type: 'GO_LETTER' }), []);
  const openLetter = useCallback(() => dispatch({ type: 'OPEN_LETTER' }), []);
  const submitEmail = useCallback(() => dispatch({ type: 'SUBMIT_EMAIL' }), []);
  const toggleSound = useCallback(() => dispatch({ type: 'TOGGLE_SOUND' }), []);

  useEffect(() => {
    if (!state.doorOpening) return;
    const t = window.setTimeout(enterRoom, 1400);
    return () => window.clearTimeout(t);
  }, [state.doorOpening, enterRoom]);

  useEffect(() => {
    if (!state.printing) return;
    const t = window.setTimeout(finishPrint, 2800);
    return () => window.clearTimeout(t);
  }, [state.printing, finishPrint]);

  return {
    state,
    openDoor,
    focusLaptop,
    setFeature,
    nextFeature,
    prevFeature,
    startPrint,
    openBinder,
    goLetter,
    openLetter,
    submitEmail,
    toggleSound,
  };
}
