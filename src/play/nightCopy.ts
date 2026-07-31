/** Door-flavored microcopy for ritual beats */
export const DOOR_NIGHT_LINES: Record<
  string,
  { speak: string; keep: string; seal: string; enter: string; laptop: string }
> = {
  mirror: {
    enter: '비추던 시선이, 방 안으로 따라 들어옵니다.',
    speak: '나를 보는 방식을, 한 문장으로만 말해보세요.',
    keep: '그 문장을 종이 위에 올려두세요.',
    seal: '오늘 본 나를, 편지에 접어 넣습니다.',
    laptop: '거울 앞에서 고른 말로 시작합니다.',
  },
  clock: {
    enter: '같은 생각이 다시 문을 두드립니다.',
    speak: '반복되는 생각의 한 바퀴를 적어보세요.',
    keep: '그 바퀴를 멈추지 말고, 일단 남겨두세요.',
    seal: '오늘은 그 반복을 봉인해 놓습니다.',
    laptop: '시계의 문으로 들어온 밤입니다.',
  },
  window: {
    enter: '감정의 바람이 창틈으로 들어옵니다.',
    speak: '지금 출렁이는 감정을 골라보세요.',
    keep: '흘러간 감정을 종이로 붙잡아 둡니다.',
    seal: '창밖의 흐름을 편지에 남깁니다.',
    laptop: '창의 문 — 감정의 짧은 관측.',
  },
  musicbox: {
    enter: '오래된 규칙이 작은 멜로디처럼 돕니다.',
    speak: '나를 붙잡던 규칙을 하나 꺼내보세요.',
    keep: '그 규칙을 종이에 적어 책장에 끼워 둡니다.',
    seal: '멜로디를 끄고, 편지로 덮습니다.',
    laptop: '오르골이 틀어준 규칙부터 봅니다.',
  },
  curtain: {
    enter: '경계가 커튼처럼 천천히 젖혀집니다.',
    speak: '지켰던 거리와 숨긴 말을 나눠보세요.',
    keep: '경계의 흔적을 기록으로 남깁니다.',
    seal: '커튼을 다시 치고, 편지를 봉합니다.',
    laptop: '자기보호의 결을 말로 풀어봅니다.',
  },
  lamp: {
    enter: '몸의 신호가 램프처럼 켜집니다.',
    speak: '몸이 먼저 알아챈 감각을 말해보세요.',
    keep: '그 감각을 종이 위에 올려둡니다.',
    seal: '불을 낮추고, 오늘을 봉인합니다.',
    laptop: '몸의 신호부터 짚어봅니다.',
  },
  drawer: {
    enter: '서랍 깊숙이 두었던 마음이 열립니다.',
    speak: '감춰둔 마음을 한 칸만 꺼내보세요.',
    keep: '꺼낸 마음을 안전한 칸에 다시 둡니다.',
    seal: '서랍을 닫듯, 편지를 봉합니다.',
    laptop: '감춰둔 칸을 천천히 엽니다.',
  },
};

export function nightLine(doorId: string | undefined, beat: 'speak' | 'keep' | 'seal' | 'enter' | 'laptop') {
  const key = doorId && DOOR_NIGHT_LINES[doorId] ? doorId : 'window';
  return DOOR_NIGHT_LINES[key][beat];
}
