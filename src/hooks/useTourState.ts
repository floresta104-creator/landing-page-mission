import { useCallback, useEffect, useReducer } from 'react';
import type { FeatureIndex, TourAction, TourState } from '../types';

const initialState: TourState = {
  scene: 'entrance',
  currentFeature: 0,
  isDoorOpening: false,
  isLaptopZoomed: false,
  isPrinting: false,
  isBinderOpen: false,
  isLetterOpen: false,
  soundEnabled: false,
  featuresComplete: false,
  printComplete: false,
  emailSubmitted: false,
};

function tourReducer(state: TourState, action: TourAction): TourState {
  switch (action.type) {
    case 'OPEN_DOOR':
      return { ...state, isDoorOpening: true, soundEnabled: state.soundEnabled || true };
    case 'ENTER_ROOM':
      return { ...state, scene: 'room', isDoorOpening: false };
    case 'ZOOM_LAPTOP':
      return { ...state, scene: 'laptop', isLaptopZoomed: true };
    case 'SET_FEATURE':
      return { ...state, currentFeature: action.index, featuresComplete: false };
    case 'NEXT_FEATURE':
      if (state.currentFeature >= 4) {
        return { ...state, featuresComplete: true };
      }
      return {
        ...state,
        currentFeature: (state.currentFeature + 1) as FeatureIndex,
      };
    case 'PREV_FEATURE':
      return {
        ...state,
        currentFeature: Math.max(0, state.currentFeature - 1) as FeatureIndex,
        featuresComplete: false,
      };
    case 'COMPLETE_FEATURES':
      return { ...state, featuresComplete: true };
    case 'START_PRINT':
      return { ...state, scene: 'printing', isPrinting: true, isLaptopZoomed: false };
    case 'FINISH_PRINT':
      return { ...state, isPrinting: false, printComplete: true };
    case 'GO_BOOKSHELF':
      return { ...state, scene: 'bookshelf', isPrinting: false };
    case 'OPEN_BINDER':
      return { ...state, scene: 'binder', isBinderOpen: true };
    case 'GO_LETTER':
      return { ...state, scene: 'letter' };
    case 'OPEN_LETTER':
      return { ...state, isLetterOpen: true };
    case 'SUBMIT_EMAIL':
      return { ...state, emailSubmitted: true, scene: 'complete' };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    default:
      return state;
  }
}

export function useTourState() {
  const [state, dispatch] = useReducer(tourReducer, initialState);

  const openDoor = useCallback(() => dispatch({ type: 'OPEN_DOOR' }), []);
  const enterRoom = useCallback(() => dispatch({ type: 'ENTER_ROOM' }), []);
  const zoomLaptop = useCallback(() => dispatch({ type: 'ZOOM_LAPTOP' }), []);
  const setFeature = useCallback(
    (index: FeatureIndex) => dispatch({ type: 'SET_FEATURE', index }),
    [],
  );
  const nextFeature = useCallback(() => dispatch({ type: 'NEXT_FEATURE' }), []);
  const prevFeature = useCallback(() => dispatch({ type: 'PREV_FEATURE' }), []);
  const completeFeatures = useCallback(() => dispatch({ type: 'COMPLETE_FEATURES' }), []);
  const startPrint = useCallback(() => dispatch({ type: 'START_PRINT' }), []);
  const finishPrint = useCallback(() => dispatch({ type: 'FINISH_PRINT' }), []);
  const goBookshelf = useCallback(() => dispatch({ type: 'GO_BOOKSHELF' }), []);
  const openBinder = useCallback(() => dispatch({ type: 'OPEN_BINDER' }), []);
  const goLetter = useCallback(() => dispatch({ type: 'GO_LETTER' }), []);
  const openLetter = useCallback(() => dispatch({ type: 'OPEN_LETTER' }), []);
  const submitEmail = useCallback(() => dispatch({ type: 'SUBMIT_EMAIL' }), []);
  const toggleSound = useCallback(() => dispatch({ type: 'TOGGLE_SOUND' }), []);

  useEffect(() => {
    if (!state.isDoorOpening) return;
    const timer = window.setTimeout(() => enterRoom(), 1200);
    return () => window.clearTimeout(timer);
  }, [state.isDoorOpening, enterRoom]);

  useEffect(() => {
    if (!state.isPrinting) return;
    const timer = window.setTimeout(() => finishPrint(), 3200);
    return () => window.clearTimeout(timer);
  }, [state.isPrinting, finishPrint]);

  useEffect(() => {
    if (state.scene !== 'bookshelf') return;
    const timer = window.setTimeout(() => openBinder(), 1100);
    return () => window.clearTimeout(timer);
  }, [state.scene, openBinder]);

  return {
    state,
    openDoor,
    enterRoom,
    zoomLaptop,
    setFeature,
    nextFeature,
    prevFeature,
    completeFeatures,
    startPrint,
    finishPrint,
    goBookshelf,
    openBinder,
    goLetter,
    openLetter,
    submitEmail,
    toggleSound,
  };
}
