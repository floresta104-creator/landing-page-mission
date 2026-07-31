type DoorSceneProps = {
  active: boolean;
  onEnter: () => void;
};

export function DoorScene({ active, onEnter }: DoorSceneProps) {
  if (!active) return null;

  return (
    <section className="door-scene" aria-label="오르비룸 입구">
      <div className="door-atmosphere" aria-hidden />
      <div className="door-rings" aria-hidden>
        <span />
        <span />
      </div>

      <button type="button" className="door-hit" onClick={onEnter} aria-label="관측실 들어가기">
        <img src="/images/room/door.png" alt="" className="door-img" draggable={false} />
      </button>

      <div className="door-copy">
        <p className="door-brand">Orbiroom · 오르비룸</p>
        <h1>아직 이름 붙이지 못한 감정</h1>
        <p>대충 적어도, 확인한 기록은 남습니다.</p>
        <span className="door-cta-hint">아치 문을 눌러 관측실로</span>
      </div>
    </section>
  );
}
