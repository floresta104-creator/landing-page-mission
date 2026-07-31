export const ARRIVAL_KEY = 'orbiroom-arrival';

export const DOOR_ENTRIES = [
  { id: 'mirror', src: '/landing/door-mirror.png', title: '거울의 문', desc: '내가 나를 보는 방식', path: 'test' as const },
  { id: 'clock', src: '/landing/door-clock.png', title: '시계의 문', desc: '반복되는 생각', path: 'test' as const },
  { id: 'window', src: '/landing/door-window.png', title: '창의 문', desc: '감정의 흐름', path: 'test' as const },
  { id: 'musicbox', src: '/landing/door-musicbox.png', title: '오르골의 문', desc: '오래된 내 안의 규칙', path: 'test' as const },
  { id: 'curtain', src: '/landing/door-curtain.png', title: '커튼의 문', desc: '자기보호와 경계', path: 'chat' as const },
  { id: 'lamp', src: '/landing/door-lamp.png', title: '조명의 문', desc: '몸의 신호', path: 'chat' as const },
  { id: 'drawer', src: '/landing/door-drawer.png', title: '서랍의 문', desc: '감춰둔 마음', path: 'report' as const },
] as const;

export type DoorPath = 'test' | 'chat' | 'report';

export type Arrival = {
  doorIndex: number;
  id: string;
  title: string;
  desc: string;
  src: string;
  path: DoorPath;
  at: number;
};

export function saveArrival(doorIndex: number) {
  const i = Math.max(0, Math.min(DOOR_ENTRIES.length - 1, doorIndex | 0));
  const door = DOOR_ENTRIES[i];
  const payload: Arrival = {
    doorIndex: i,
    id: door.id,
    title: door.title,
    desc: door.desc,
    src: door.src,
    path: door.path,
    at: Date.now(),
  };
  sessionStorage.setItem(ARRIVAL_KEY, JSON.stringify(payload));
}

export function readArrival(): Arrival | null {
  try {
    const raw = sessionStorage.getItem(ARRIVAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Arrival;
  } catch {
    return null;
  }
}
