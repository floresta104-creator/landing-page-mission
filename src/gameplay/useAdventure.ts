import { useCallback, useMemo, useState } from 'react';
import {
  MENU_BEATS,
  OBJECTIVES,
  type Examine,
  type Focus,
  type GameFlag,
  type GameState,
} from './data';

const initial: GameState = {
  started: false,
  outside: true,
  flags: {
    entered: false,
    sawMenus: false,
    printed: false,
    sawBinder: false,
    gotLetter: false,
    subscribed: false,
  },
  focus: 'door',
  examine: null,
  menuStep: -1,
  objective: OBJECTIVES.outside,
};

function objectiveFor(flags: GameState['flags'], outside: boolean): string {
  if (outside) return OBJECTIVES.outside;
  if (!flags.sawMenus) return OBJECTIVES.roomLaptop;
  if (!flags.printed) return OBJECTIVES.roomPrint;
  if (!flags.sawBinder) return OBJECTIVES.roomShelf;
  if (!flags.subscribed) return OBJECTIVES.roomLetter;
  return OBJECTIVES.done;
}

export function useAdventure() {
  const [state, setState] = useState<GameState>(initial);

  const setFlag = useCallback((flag: GameFlag, value = true) => {
    setState((s) => {
      const flags = { ...s.flags, [flag]: value };
      return { ...s, flags, objective: objectiveFor(flags, s.outside) };
    });
  }, []);

  const start = useCallback(() => {
    setState((s) => ({ ...s, started: true }));
  }, []);

  const enterRoom = useCallback(() => {
    setState((s) => {
      const flags = { ...s.flags, entered: true };
      return {
        ...s,
        outside: false,
        focus: 'wide',
        examine: null,
        flags,
        objective: objectiveFor(flags, false),
      };
    });
  }, []);

  const setFocus = useCallback((focus: Focus) => {
    setState((s) => ({ ...s, focus }));
  }, []);

  const examine = useCallback((target: Examine) => {
    setState((s) => ({
      ...s,
      examine: target,
      focus: target === 'binder' ? 'shelf' : target === null ? 'wide' : (target as Focus),
      menuStep: target === 'laptop' ? 0 : s.menuStep,
    }));
  }, []);

  const closeExamine = useCallback(() => {
    setState((s) => ({ ...s, examine: null, focus: 'wide', menuStep: -1 }));
  }, []);

  const nextMenu = useCallback(() => {
    setState((s) => {
      const next = s.menuStep + 1;
      if (next >= MENU_BEATS.length) {
        const flags = { ...s.flags, sawMenus: true };
        return {
          ...s,
          menuStep: MENU_BEATS.length,
          flags,
          objective: objectiveFor(flags, false),
        };
      }
      return { ...s, menuStep: next };
    });
  }, []);

  const finishPrint = useCallback(() => {
    setState((s) => {
      const flags = { ...s.flags, printed: true };
      return {
        ...s,
        examine: null,
        focus: 'wide',
        flags,
        objective: objectiveFor(flags, false),
      };
    });
  }, []);

  const finishBinder = useCallback(() => {
    setState((s) => {
      const flags = { ...s.flags, sawBinder: true, gotLetter: true };
      return {
        ...s,
        examine: null,
        focus: 'wide',
        flags,
        objective: objectiveFor(flags, false),
      };
    });
  }, []);

  const finishLetter = useCallback(() => {
    setState((s) => {
      const flags = { ...s.flags, subscribed: true };
      return {
        ...s,
        examine: null,
        focus: 'wide',
        flags,
        objective: objectiveFor(flags, false),
      };
    });
  }, []);

  const menusDone = state.menuStep >= MENU_BEATS.length;

  const currentMenu = useMemo(() => {
    if (state.menuStep < 0 || state.menuStep >= MENU_BEATS.length) return null;
    return MENU_BEATS[state.menuStep];
  }, [state.menuStep]);

  return {
    state,
    menusDone,
    currentMenu,
    start,
    enterRoom,
    setFocus,
    examine,
    closeExamine,
    nextMenu,
    finishPrint,
    finishBinder,
    finishLetter,
    setFlag,
  };
}
