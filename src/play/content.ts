export type Flag = 'entered' | 'menusDone' | 'saved' | 'printed' | 'binderDone' | 'mailed';

export type Screen = 'title' | 'room' | 'laptop' | 'printer' | 'binder' | 'letter' | 'clear';

export type Ritual = 'speak' | 'keep' | 'seal' | 'done';

export type Game = {
  screen: Screen;
  flags: Record<Flag, boolean>;
  menuIndex: number;
  objective: string;
};

export const MENUS = [
  {
    id: 'ai',
    name: 'AI 대화',
    blurb: '말한 내용을 감정·생각·몸·자기보호로 나눠 정리해요. 저장 전에 직접 확인합니다.',
  },
  {
    id: 'test',
    name: '관측 테스트',
    blurb: '거울·시계·창·오르골… 가까운 문으로 들어가는 짧은 테스트예요.',
  },
  {
    id: 'rel',
    name: '관계 속 나',
    blurb: '그 사람 앞에서의 내 감정·반응만 정리하고, 편지에 봉인해 보관해요.',
  },
  {
    id: 'report',
    name: '리포트',
    blurb: '나를 지키는 방식을 깊게 관측하는 정밀 리포트예요.',
  },
  {
    id: 'community',
    name: '커뮤니티',
    blurb: '익명으로 관측 프롬프트를 나누고, 마음에 드는 상징을 저장해요.',
  },
] as const;

export function ritualOf(g: Game): Ritual {
  if (!g.flags.saved) return 'speak';
  if (!g.flags.binderDone) return 'keep';
  if (!g.flags.mailed) return 'seal';
  return 'done';
}

export function objectiveOf(g: Game): string {
  const r = ritualOf(g);
  if (g.screen === 'title') return '문턱에 서 있습니다.';
  if (r === 'speak') return '오늘 밤의 말을, 노트북에 내려놓으세요.';
  if (r === 'keep') return '말이 종이로 굳으면, 책장에 자리를 주세요.';
  if (r === 'seal') return '편지로 오늘을 봉인할 수 있습니다.';
  return '하룻밤의 관측이 끝났습니다.';
}

export const RITUAL_STEPS = [
  { id: 'speak' as const, label: '말하다', hint: '노트북' },
  { id: 'keep' as const, label: '남기다', hint: '인쇄 · 책장' },
  { id: 'seal' as const, label: '봉인하다', hint: '편지' },
];
