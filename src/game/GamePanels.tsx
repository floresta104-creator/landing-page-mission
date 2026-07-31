import { MISSION_CHOICES } from './content';
import type { GameState, MissionChoice } from './types';

type PanelsProps = {
  state: GameState;
  onChoose: (c: MissionChoice) => void;
  onClose: () => void;
  onCta: () => void;
  onBackRoom: () => void;
};

export function GamePanels({ state, onChoose, onClose, onCta, onBackRoom }: PanelsProps) {
  if (state.phase === 'laptop') {
    return (
      <div className="panel-layer" role="dialog" aria-modal="true" aria-labelledby="laptop-title">
        <div className="panel panel-laptop">
          <header className="panel-head">
            <button type="button" className="ghost" onClick={onClose}>
              ← 방으로
            </button>
            <h2 id="laptop-title">AI 대화 · 자유롭게 정리하기</h2>
            <span className="chip">데모</span>
          </header>
          <p className="panel-lead">
            일상을 대충 적어도 됩니다. AI가 감정·생각·몸 신호·자기보호로 나눠 보여줍니다.
          </p>
          <div className="choice-grid">
            {MISSION_CHOICES.map((c) => (
              <button key={c.id} type="button" className="choice" onClick={() => onChoose(c)}>
                {c.label}
              </button>
            ))}
          </div>
          <aside className="structure-preview" aria-label="구조화 미리보기">
            <h3>AI 정리 후보</h3>
            <ul>
              <li>
                <span>감정</span>
                <em>아직 정리 전</em>
              </li>
              <li>
                <span>생각</span>
                <em>아직 정리 전</em>
              </li>
              <li>
                <span>몸 신호</span>
                <em>아직 정리 전</em>
              </li>
              <li>
                <span>자기보호</span>
                <em>아직 정리 전</em>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    );
  }

  if (state.phase === 'result' && state.choice) {
    const c = state.choice;
    return (
      <div className="panel-layer" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <div className="panel panel-result">
          <header className="panel-head">
            <h2 id="result-title">저장 미리보기</h2>
            <span className="chip">사용자가 확인</span>
          </header>
          <p className="panel-lead">AI 후보는 확정이 아닙니다. 확인한 항목만 바인더에 남습니다.</p>
          <div className="result-card">
            <h3>{c.label}</h3>
            <dl>
              <div>
                <dt>감정</dt>
                <dd>{c.emotion}</dd>
              </div>
              <div>
                <dt>생각</dt>
                <dd>{c.thought}</dd>
              </div>
              <div>
                <dt>몸 신호</dt>
                <dd>{c.body}</dd>
              </div>
              <div>
                <dt>자기보호</dt>
                <dd>{c.shield}</dd>
              </div>
            </dl>
          </div>
          <div className="panel-actions">
            <button type="button" className="ghost" onClick={onBackRoom}>
              방으로 돌아가기
            </button>
            <button type="button" className="primary" onClick={onCta}>
              기록이 쌓이는 이유 보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.phase === 'cta') {
    return (
      <div className="panel-layer" role="dialog" aria-modal="true" aria-labelledby="cta-title">
        <div className="panel panel-cta">
          <p className="door-brand">Orbiroom</p>
          <h2 id="cta-title">대화는 흘러가지만, 확인한 나의 기록은 남습니다.</h2>
          <ul className="cta-points">
            <li>대충 적어도 AI가 구조화</li>
            <li>바인더에 모아 지난 나와 비교</li>
            <li>관계·리포트·프롬포트 이미지로 이어짐</li>
          </ul>
          <button type="button" className="primary primary-lg">
            나의 관측실 만들기
          </button>
          <button type="button" className="ghost" onClick={onBackRoom}>
            관측실 다시 둘러보기
          </button>
        </div>
      </div>
    );
  }

  return null;
}
