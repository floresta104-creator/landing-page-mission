import { OrbiroomLogo } from '../OrbiroomLogo';

interface EntranceOverlayProps {
  isDoorOpening: boolean;
  onOpenDoor: () => void;
}

export function EntranceOverlay({ isDoorOpening, onOpenDoor }: EntranceOverlayProps) {
  return (
    <div className={`stage-hud entrance-hud ${isDoorOpening ? 'is-opening' : ''}`}>
      <div className="entrance-hud__copy reveal">
        <OrbiroomLogo />
        <p className="entrance-hud__eyebrow">오르비룸</p>
        <h1 className="entrance-hud__headline">
          반복되는 감정에는
          <br />
          나만의 궤도가 있습니다.
        </h1>
        <p className="entrance-hud__desc">
          오르비룸은 당신의 내면을 관찰하고
          기록하며, 더 나은 자신을 발견하는 공간입니다.
        </p>
        <button type="button" className="btn-orb" onClick={onOpenDoor}>
          <span className="btn-orb__icon" aria-hidden="true" />
          관측실로 들어가기
        </button>
      </div>

      <button
        type="button"
        className="door-portal"
        onClick={onOpenDoor}
        aria-label="문을 열어 관측실로 들어가기"
      >
        <span className="door-portal__glow" aria-hidden="true" />
        <span className="door-portal__hint">문을 열어보세요</span>
      </button>
    </div>
  );
}
