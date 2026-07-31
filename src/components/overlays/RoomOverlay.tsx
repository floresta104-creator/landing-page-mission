interface RoomOverlayProps {
  onLaptopClick: () => void;
}

export function RoomOverlay({ onLaptopClick }: RoomOverlayProps) {
  return (
    <div className="stage-hud room-hud">
      <div className="room-hud__copy reveal">
        <p className="room-hud__lead">여기는 당신의 관측실이에요.</p>
        <p className="room-hud__body">
          노트북을 열어 오르비룸의 주요 기능을 살펴보세요.
        </p>
      </div>

      <button
        type="button"
        className="object-hotspot object-hotspot--laptop"
        onClick={onLaptopClick}
        aria-label="노트북을 클릭하여 기능 소개 보기"
      >
        <span className="object-hotspot__pulse" aria-hidden="true" />
        <span className="object-hotspot__label">노트북을 클릭하세요</span>
      </button>
    </div>
  );
}
