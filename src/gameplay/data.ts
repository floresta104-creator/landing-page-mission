export type GameFlag =
  | 'entered'
  | 'sawMenus'
  | 'printed'
  | 'sawBinder'
  | 'gotLetter'
  | 'subscribed';

export type Focus = 'wide' | 'door' | 'laptop' | 'printer' | 'shelf' | 'letter';

export type Examine = null | 'laptop' | 'printer' | 'shelf' | 'binder' | 'letter';

export type GameState = {
  started: boolean;
  outside: boolean;
  flags: Record<GameFlag, boolean>;
  focus: Focus;
  examine: Examine;
  menuStep: number;
  objective: string;
};

export const MENU_BEATS = [
  { title: 'AI 대화', line: '대충 말해도 감정·생각·몸·자기보호로 정리됩니다.' },
  { title: '관측 테스트', line: '7가지 입구로 나를 더 깊게 관측합니다.' },
  { title: '관계 속 나', line: '그 사람 앞에서 나타난 나의 반응을 기록합니다.' },
  { title: '리포트', line: '더 깊은 통찰을 얻고, 일상 AI에 이어 붙일 수 있습니다.' },
  { title: '설정', line: '무엇을 저장하고 반영할지 내가 통제합니다.' },
];

export const OBJECTIVES = {
  outside: '빛나는 문을 열어 관측실로 들어가세요.',
  roomLaptop: '책상의 노트북을 조사하세요.',
  roomPrint: '프린터가 기록을 출력합니다. 프린터를 확인하세요.',
  roomShelf: '책장으로 가서 바인더를 열어보세요.',
  roomLetter: '책상에 편지가 도착했습니다. 편지를 열어보세요.',
  done: '관측실 체험을 마쳤습니다.',
} as const;

export const HOTSPOTS: Array<{
  id: Exclude<Focus, 'wide' | 'door'>;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  unlock: (f: GameState['flags']) => boolean;
  glow: (f: GameState['flags']) => boolean;
}> = [
  {
    id: 'laptop',
    label: '노트북',
    x: 36,
    y: 46,
    w: 14,
    h: 18,
    unlock: (f) => f.entered && !f.printed,
    glow: (f) => f.entered && !f.sawMenus,
  },
  {
    id: 'printer',
    label: '프린터',
    x: 7,
    y: 56,
    w: 11,
    h: 14,
    unlock: (f) => f.sawMenus && !f.sawBinder,
    glow: (f) => f.sawMenus && !f.printed,
  },
  {
    id: 'shelf',
    label: '책장',
    x: 72,
    y: 24,
    w: 24,
    h: 58,
    unlock: (f) => f.printed && !f.gotLetter,
    glow: (f) => f.printed && !f.sawBinder,
  },
  {
    id: 'letter',
    label: '편지',
    x: 54,
    y: 56,
    w: 10,
    h: 12,
    unlock: (f) => f.sawBinder,
    glow: (f) => f.sawBinder && !f.subscribed,
  },
];
