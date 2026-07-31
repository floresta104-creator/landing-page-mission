export type JourneyPhase =
  | 'gate'
  | 'portal'
  | 'room'
  | 'mission'
  | 'result'
  | 'cta';

export type MissionChoice = {
  id: string;
  label: string;
  emotion: string;
  thought: string;
  body: string;
  shield: string;
};

export const CHOICES: MissionChoice[] = [
  {
    id: 'messy',
    label: '감정이 복잡해요',
    emotion: '서운함 · 불안',
    thought: '내가 너무 예민한 건가?',
    body: '가슴이 답답함',
    shield: '말을 줄이기',
  },
  {
    id: 'loop',
    label: '생각이 반복돼요',
    emotion: '초조 · 피로',
    thought: '같은 장면이 계속 재생된다',
    body: '어깨 긴장',
    shield: '혼자 정리하려 함',
  },
  {
    id: 'body',
    label: '몸이 먼저 긴장돼요',
    emotion: '긴장 · 예민',
    thought: '무슨 일 나기 전에 대비해야 해',
    body: '목·턱 경직',
    shield: '과잉 설명',
  },
  {
    id: 'talk',
    label: '그냥 이야기하고 싶어요',
    emotion: '외로움 · 잔잔함',
    thought: '누구한테 말해도 될까?',
    body: '숨이 얕음',
    shield: '먼저 거리두기',
  },
];

export const HOTSPOTS = [
  {
    id: 'laptop' as const,
    label: '노트북',
    hint: 'AI가 일상을 구조화합니다',
    style: { left: '36%', top: '46%', width: '14%', height: '18%' },
  },
  {
    id: 'mirror' as const,
    label: '거울',
    hint: '나를 지키는 방식을 봅니다',
    style: { left: '17%', top: '52%', width: '8%', height: '14%' },
  },
  {
    id: 'printer' as const,
    label: '프린터',
    hint: '확인한 기록이 출력됩니다',
    style: { left: '7%', top: '56%', width: '10%', height: '14%' },
  },
  {
    id: 'letter' as const,
    label: '편지',
    hint: '관계 속 나의 장면',
    style: { left: '54%', top: '56%', width: '9%', height: '12%' },
  },
  {
    id: 'bookshelf' as const,
    label: '책장',
    hint: '바인더에 모아 지난 나와 비교',
    style: { left: '72%', top: '22%', width: '24%', height: '62%' },
  },
];
