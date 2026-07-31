import { HOTSPOTS } from './content';
import { useJourney } from './useJourney';
import './journey.css';

export function OrbiJourney() {
  const j = useJourney();

  return (
    <div className="oj" data-phase={j.phase}>
      <a className="skip-link" href="#journey-main">
        본문으로
      </a>

      {j.phase !== 'gate' && (
        <header className="oj-top">
          <div className="oj-brand">
            <img src="/images/logo.svg" alt="" width={26} height={26} />
            <div>
              <strong>Orbiroom</strong>
              <span>오르비룸</span>
            </div>
          </div>
          <nav className="oj-steps" aria-label="여정">
            <span className="on">입구</span>
            <span className={['room', 'mission', 'result', 'cta'].includes(j.phase) ? 'on' : ''}>관측실</span>
            <span className={['result', 'cta'].includes(j.phase) ? 'on' : ''}>기록</span>
          </nav>
        </header>
      )}

      <main id="journey-main" className="oj-main">
        {j.phase === 'gate' && (
          <section className="oj-gate" aria-label="시작">
            <div className="oj-gate-bg" aria-hidden />
            <div className="oj-gate-orbit" aria-hidden />
            <img className="oj-gate-mark" src="/images/logo.svg" alt="" />
            <p className="oj-eyebrow">Orbiroom</p>
            <h1>
              대화는 흘러가지만,
              <br />
              <em>확인한 나의 기록</em>은 남습니다.
            </h1>
            <p className="oj-sub">
              대충 적어도 AI가 구조화하고, 바인더에 모아
              <br />
              지난 나와 비교하는 개인 관측실.
            </p>
            <div className="oj-load" aria-hidden>
              <i style={{ width: `${j.load}%` }} />
            </div>
            <button type="button" className="oj-start" disabled={!j.ready} onClick={j.begin}>
              {j.ready ? '여정을 시작하세요' : `불러오는 중 ${j.load}%`}
            </button>
            <p className="oj-tap">클릭하면 은은한 사운드와 함께 시작합니다</p>
          </section>
        )}

        {j.phase === 'portal' && (
          <section className="oj-scene oj-portal">
            <img className="oj-plate" src="/images/journey/door-scene.png" alt="관측실로 이어지는 문" />
            <div className="oj-veil" aria-hidden />
            <div className="oj-copy oj-copy-bottom">
              <p className="oj-eyebrow">아직 이름 붙이지 못한 감정</p>
              <h2>문을 열고 관측실로</h2>
              <button type="button" className="oj-primary" onClick={j.enterRoom}>
                들어가기
              </button>
            </div>
            <button type="button" className="oj-door-hit" aria-label="관측실 들어가기" onClick={j.enterRoom} />
          </section>
        )}

        {(j.phase === 'room' || j.phase === 'mission' || j.phase === 'result' || j.phase === 'cta') && (
          <section className={`oj-scene oj-room ${j.phase === 'mission' || j.phase === 'result' ? 'is-focus' : ''}`}>
            <div className="oj-cam">
              <img className="oj-plate" src="/images/journey/room.png" alt="오르비룸 관측실" />
              {j.phase === 'room' &&
                HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    className={`oj-hot ${h.id === 'laptop' ? 'is-main' : ''}`}
                    style={h.style}
                    aria-label={`${h.label}. ${h.hint}`}
                    onClick={() => j.onHotspot(h.id)}
                  >
                    <span className="oj-hot-dot" />
                    <span className="oj-hot-tip">
                      <b>{h.label}</b>
                      <small>{h.hint}</small>
                    </span>
                  </button>
                ))}
            </div>

            {j.phase === 'room' && (
              <div className="oj-copy oj-copy-bar">
                <p>
                  첫 관측실에 들어왔습니다.
                  <br />
                  <strong>노트북</strong>을 열어 오늘의 기록을 시작해보세요.
                </p>
              </div>
            )}
          </section>
        )}

        {j.phase === 'mission' && (
          <div className="oj-sheet" role="dialog" aria-modal="true" aria-labelledby="mission-title">
            <div className="oj-sheet-card">
              <header>
                <button type="button" className="oj-ghost" onClick={j.backRoom}>
                  ← 방으로
                </button>
                <h2 id="mission-title">자유롭게 정리하기</h2>
                <span className="oj-pill">데모</span>
              </header>
              <p className="oj-lead">일상을 대충 적어도 됩니다. AI가 감정·생각·몸 신호·자기보호로 나눠 보여줍니다.</p>
              <div className="oj-choices">
                {j.choices.map((c) => (
                  <button key={c.id} type="button" onClick={() => j.choose(c)}>
                    {c.label}
                  </button>
                ))}
              </div>
              <aside className="oj-side">
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
        )}

        {j.phase === 'result' && j.choice && (
          <div className="oj-sheet" role="dialog" aria-modal="true" aria-labelledby="result-title">
            <div className="oj-sheet-card">
              <header>
                <h2 id="result-title">저장 미리보기</h2>
                <span className="oj-pill">사용자가 확인</span>
              </header>
              <p className="oj-lead">AI 후보는 확정이 아닙니다. 확인한 항목만 바인더에 남습니다.</p>
              <div className="oj-result">
                <h3>{j.choice.label}</h3>
                <dl>
                  <div>
                    <dt>감정</dt>
                    <dd>{j.choice.emotion}</dd>
                  </div>
                  <div>
                    <dt>생각</dt>
                    <dd>{j.choice.thought}</dd>
                  </div>
                  <div>
                    <dt>몸 신호</dt>
                    <dd>{j.choice.body}</dd>
                  </div>
                  <div>
                    <dt>자기보호</dt>
                    <dd>{j.choice.shield}</dd>
                  </div>
                </dl>
              </div>
              <div className="oj-actions">
                <button type="button" className="oj-ghost" onClick={j.backRoom}>
                  방으로
                </button>
                <button type="button" className="oj-primary" onClick={j.toCta}>
                  기록이 쌓이는 이유
                </button>
              </div>
            </div>
          </div>
        )}

        {j.phase === 'cta' && (
          <div className="oj-sheet oj-sheet-cta" role="dialog" aria-modal="true" aria-labelledby="cta-title">
            <div className="oj-sheet-card oj-cta">
              <p className="oj-eyebrow">Orbiroom</p>
              <h2 id="cta-title">
                대화는 흘러가지만,
                <br />
                확인한 나의 기록은 남습니다.
              </h2>
              <ul>
                <li>대충 적어도 AI가 구조화</li>
                <li>바인더에 모아 지난 나와 비교</li>
                <li>관계 · 리포트 · 프롬포트 이미지로 이어짐</li>
              </ul>
              <button type="button" className="oj-primary oj-primary-lg">
                나의 관측실 만들기
              </button>
              <button type="button" className="oj-ghost" onClick={j.backRoom}>
                관측실 다시 둘러보기
              </button>
            </div>
          </div>
        )}

        {j.toast && (
          <div className="oj-toast" role="status">
            {j.toast}
          </div>
        )}
      </main>
    </div>
  );
}
