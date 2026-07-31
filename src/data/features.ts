export const FEATURE_COUNT = 5;

export const FEATURES = [
  {
    id: 'ai-chat',
    title: 'AI 대화',
    description:
      '막연한 이야기를 꺼내면,\n오르비룸이 감정과 생각의 흐름을 함께 정리합니다.',
  },
  {
    id: 'social-self',
    title: '사람 앞의 나',
    description: '사람들 앞에서 반복되는\n나의 감정, 해석, 반응을 돌아봅니다.',
  },
  {
    id: 'observation-tests',
    title: '관측 테스트',
    description: '7가지 관측 입구를 통해\n나를 바라보는 여러 관점을 시작합니다.',
  },
  {
    id: 'prompt-community',
    title: '프롬포트 커뮤니티',
    description:
      '다른 사람들이 만든 질문을 둘러보고,\n마음에 드는 프롬포트로\n나를 새롭게 표현해보세요.',
  },
  {
    id: 'report',
    title: '리포트',
    description:
      '대화와 기록을 바탕으로\n나의 흐름을 더 깊게 살펴볼 수 있는\n관측 리포트를 제공합니다.',
  },
] as const;

export const TEST_ENTRIES = [
  '내가 나를 보는 방식',
  '생각 과밀도',
  '오래된 내면 규칙',
  '자기보호 방식',
  '몸의 신호',
  '반복 생각',
  '사람 앞의 나',
] as const;

export const SAMPLE_PROMPTS = [
  '내가 만약 신화동물이라면?',
  '요즘 내 마음은 어떤 날씨에 가까울까?',
  '사람들 앞의 나는 어떤 가면을 쓰고 있을까?',
  '요즘의 나는 어떤 방에 살고 있을까?',
] as const;
