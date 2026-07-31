import { useCallback, useState } from 'react';
import { HINTS } from './content';
import type { GameState, MissionChoice, Phase } from './types';

const initial: GameState = {
  phase: 'door',
  hint: HINTS.door,
  missionsDone: 0,
  choice: null,
  pointer: { x: 0.5, y: 0.5 },
};

export function useOrbiGame() {
  const [state, setState] = useState<GameState>(initial);

  const setPhase = useCallback((phase: Phase, hint?: string) => {
    setState((s) => ({ ...s, phase, hint: hint ?? HINTS[phase] }));
  }, []);

  const enter = useCallback(() => setPhase('room'), [setPhase]);
  const openLaptop = useCallback(() => setPhase('laptop'), [setPhase]);

  const choose = useCallback((choice: MissionChoice) => {
    setState((s) => ({
      ...s,
      choice,
      missionsDone: Math.max(s.missionsDone, 1),
      phase: 'result',
      hint: HINTS.result,
    }));
  }, []);

  const toCta = useCallback(() => setPhase('cta'), [setPhase]);
  const backToRoom = useCallback(() => setPhase('room'), [setPhase]);

  const onPointer = useCallback((x: number, y: number) => {
    setState((s) => ({ ...s, pointer: { x, y } }));
  }, []);

  return { state, enter, openLaptop, choose, toCta, backToRoom, onPointer };
}
