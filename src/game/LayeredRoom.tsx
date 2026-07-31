import type { PropId } from './propIds';

type RoomProps = {
  pointer: { x: number; y: number };
  onPointer: (x: number, y: number) => void;
  onObject: (id: PropId) => void;
  laptopDone: boolean;
  showCaption?: boolean;
};

const HOTSPOTS: Array<{
  id: PropId;
  label: string;
  className: string;
}> = [
  { id: 'laptop', label: '노트북 · AI 대화', className: 'hot-laptop' },
  { id: 'mirror', label: '거울', className: 'hot-mirror' },
  { id: 'printer', label: '프린터', className: 'hot-printer' },
  { id: 'letter', label: '편지', className: 'hot-letter' },
  { id: 'bookshelf', label: '책장 · 바인더', className: 'hot-bookshelf' },
];

export function LayeredRoom({
  pointer,
  onPointer,
  onObject,
  laptopDone,
  showCaption = true,
}: RoomProps) {
  const px = (pointer.x - 0.5) * 12;
  const py = (pointer.y - 0.5) * 7;

  return (
    <section
      className="room-scene"
      aria-label="오르비룸 관측실"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onPointer((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      }}
    >
      <div
        className="room-stage"
        style={{ transform: `translate3d(${px * -0.35}px, ${py * -0.35}px, 0) scale(1.04)` }}
      >
        <img className="room-plate" src="/images/room/plate.jpg" alt="" draggable={false} />

        <div className="room-objects" style={{ transform: `translate3d(${px}px, ${py}px, 0)` }}>
          <div className="obj obj-shelf" aria-hidden>
            <img src="/images/room/shelf.png" alt="" draggable={false} />
          </div>
          <div className="obj obj-deskset" aria-hidden>
            <img src="/images/room/deskset.png" alt="" draggable={false} />
          </div>

          {HOTSPOTS.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`hotspot ${h.className}${h.id === 'laptop' ? ' is-pulse' : ''}${
                h.id === 'laptop' && laptopDone ? ' is-done' : ''
              }`}
              aria-label={h.label}
              onClick={() => onObject(h.id)}
            >
              <span className="hotspot-ring" aria-hidden />
              <span className="hotspot-label">{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showCaption && (
        <p className="room-caption">첫 관측실에 들어왔습니다. 빛나는 노트북을 열어보세요.</p>
      )}
    </section>
  );
}
