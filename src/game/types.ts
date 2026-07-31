export type Phase = 'door' | 'room' | 'laptop' | 'result' | 'cta';

export type MissionChoice = {
  id: string;
  label: string;
  emotion: string;
  thought: string;
  body: string;
  shield: string;
};

export type GameState = {
  phase: Phase;
  hint: string;
  missionsDone: number;
  choice: MissionChoice | null;
  pointer: { x: number; y: number };
};
