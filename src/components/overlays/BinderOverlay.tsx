import type { TourScene } from '../../types';

interface BinderOverlayProps {
  scene: TourScene;
  onContinue: () => void;
}

export function BinderOverlay({ scene, onContinue }: BinderOverlayProps) {
  const showPages = scene === 'binder';

  return (
    <div className="stage-hud binder-hud">
      {!showPages && (
        <div className="binder-hud__tease reveal">
          <p>기록 보관함을 살펴보는 중…</p>
        </div>
      )}

      {showPages && (
        <>
          <div className="binder-hud__copy reveal">
            <p>모든 기록은 보관함에 안전하게 정리되어, 언제든 다시 살펴볼 수 있어요.</p>
          </div>

          <div className="binder-pages reveal" role="region" aria-label="기록 보관함">
            <div className="binder-page binder-page--left">
              <h3>6월 기록</h3>
              <ul className="date-tabs">
                <li className="is-active">6.22</li>
                <li>6.18</li>
                <li>6.12</li>
                <li>5.05</li>
              </ul>
            </div>
            <div className="binder-page binder-page--right">
              <h4>기록이 주는 가치</h4>
              <p className="binder-page__lead">
                우리는 매일 새로운 감정과 생각을 경험하지만,
                시간이 지나면 쉽게 잊어버릴 수 있어요.
                기록은 그 순간의 나를 다시 만나게 합니다.
              </p>
              <ul className="value-rows">
                <li><span aria-hidden="true">◉</span> 시간의 흐름 속에서 변화 알아보기</li>
                <li><span aria-hidden="true">↻</span> 반복되는 감정과 반응 발견하기</li>
                <li><span aria-hidden="true">✦</span> 중요했던 순간을 다시 돌아보기</li>
                <li><span aria-hidden="true">◎</span> 리포트와 연결해 더 깊게 이해하기</li>
              </ul>
            </div>
          </div>

          <button type="button" className="btn-orb binder-hud__cta" onClick={onContinue}>
            책상 위 편지 보기
          </button>
        </>
      )}
    </div>
  );
}
