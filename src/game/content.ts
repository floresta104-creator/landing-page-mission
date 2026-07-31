import type { MissionChoice } from './types';

export const MISSION_CHOICES: MissionChoice[] = [
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

export const HINTS = {
  door: '아치 문을 눌러 관측실로 들어가세요.',
  room: '빛나는 오브젝트를 살펴보세요. 노트북부터 열어볼까요?',
  laptop: '대충 말해도 됩니다. AI가 구조화 후보를 보여줍니다.',
  result: '확인한 기록만 남습니다. 바인더에 쌓이는 흐름을 느껴보세요.',
  cta: '대화는 흘러가지만, 확인한 나의 기록은 남습니다.',
} as const;
