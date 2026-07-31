interface BinderPanelProps {
  onContinue: () => void;
}

export function BinderPanel({ onContinue }: BinderPanelProps) {
  return (
    <div className="focus-panel binder-panel">
      <p className="focus-hint">모든 기록은 보관함에 정리되어 언제든 다시 볼 수 있어요.</p>
      <div className="binder-book" role="dialog" aria-label="기록 보관함">
        <div className="binder-book__page">
          <h3>6월 기록</h3>
          <ul>
            <li className="on">6.22</li>
            <li>6.18</li>
            <li>6.12</li>
            <li>5.05</li>
          </ul>
        </div>
        <div className="binder-book__page">
          <h3>기록이 주는 가치</h3>
          <p>
            기록은 그 순간의 나를 다시 만나게 하고,
            반복되는 흐름을 발견하도록 도와줍니다.
          </p>
          <ul className="values">
            <li>시간의 흐름 속에서 변화 알아보기</li>
            <li>반복되는 감정과 반응 발견하기</li>
            <li>중요했던 순간을 다시 돌아보기</li>
            <li>리포트와 연결해 더 깊게 이해하기</li>
          </ul>
        </div>
      </div>
      <button type="button" className="btn-orb focus-cta" onClick={onContinue}>
        책상 위 편지 보기
      </button>
    </div>
  );
}
