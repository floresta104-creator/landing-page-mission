import { FEATURES, SAMPLE_PROMPTS, TEST_ENTRIES } from '../../data/features';

export function FeatureAI() {
  return (
    <div className="feature-panel feature-ai">
      <header className="feature-panel__header">
        <h3>{FEATURES[0].title}</h3>
        <p>{FEATURES[0].description}</p>
      </header>
      <div className="feature-ai__layout">
        <div className="feature-ai__chat">
          <div className="chat-bubble chat-bubble--user chat-anim chat-anim--1">
            요즘 생각이 정리가 안 돼요.
          </div>
          <div className="chat-bubble chat-bubble--ai chat-anim chat-anim--2">
            그렇군요. 지금 마음을 가장 흔드는 것은 무엇인가요?
          </div>
          <div className="chat-input chat-anim chat-anim--3" aria-hidden="true">
            <span>오늘 마음에 남은 이야기를 적어보세요</span>
          </div>
        </div>
        <aside className="feature-ai__summary">
          <h4>정리된 흐름</h4>
          <dl>
            <div className="summary-row chat-anim chat-anim--2">
              <dt>감정</dt>
              <dd>답답함, 불안</dd>
            </div>
            <div className="summary-row chat-anim chat-anim--3">
              <dt>생각</dt>
              <dd>나는 괜찮지 않은 걸까?</dd>
            </div>
            <div className="summary-row chat-anim chat-anim--4">
              <dt>몸의 신호</dt>
              <dd>가슴 답답함, 어깨 긴장</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

export function FeatureSocialSelf() {
  return (
    <div className="feature-panel feature-social">
      <header className="feature-panel__header">
        <h3>{FEATURES[1].title}</h3>
        <p>{FEATURES[1].description}</p>
      </header>
      <article className="record-sheet">
        <p className="record-sheet__date">2026. 6. 22 · 회의 후</p>
        <dl className="record-grid">
          <div><dt>인물 별칭</dt><dd>팀 동료 A</dd></div>
          <div><dt>상황</dt><dd>내 의견이 가볍게 넘어간 순간</dd></div>
          <div><dt>감정</dt><dd>서운함, 불안</dd></div>
          <div><dt>떠오른 생각</dt><dd>내 말은 중요하지 않은가?</dd></div>
          <div><dt>몸의 신호</dt><dd>목이 조여옴, 숨이 얕아짐</dd></div>
          <div><dt>내가 취한 반응</dt><dd>더 이상 말하지 않고 고개를 끄덕임</dd></div>
        </dl>
      </article>
    </div>
  );
}

export function FeatureTests() {
  return (
    <div className="feature-panel feature-tests">
      <header className="feature-panel__header">
        <h3>{FEATURES[2].title}</h3>
        <p>{FEATURES[2].description}</p>
      </header>
      <ul className="test-arches">
        {TEST_ENTRIES.map((label, i) => (
          <li key={label} className="test-arch" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="test-arch__frame" aria-hidden="true" />
            <span className="test-arch__label">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeaturePromptCommunity() {
  return (
    <div className="feature-panel feature-prompts">
      <header className="feature-panel__header">
        <h3>{FEATURES[3].title}</h3>
        <p>{FEATURES[3].description}</p>
      </header>
      <ul className="prompt-slips">
        {SAMPLE_PROMPTS.map((prompt, i) => (
          <li key={prompt}>
            <button
              type="button"
              className={`prompt-slip ${i === 0 ? 'prompt-slip--active' : ''}`}
              aria-label={`프롬포트: ${prompt}`}
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
      <div className="prompt-focus">
        <p className="prompt-focus__text">{SAMPLE_PROMPTS[0]}</p>
        <button type="button" className="prompt-focus__cta" disabled>
          이 프롬포트로 시작하기
        </button>
      </div>
    </div>
  );
}

export function FeatureReport() {
  return (
    <div className="feature-panel feature-report">
      <header className="feature-panel__header">
        <h3>{FEATURES[4].title}</h3>
        <p>{FEATURES[4].description}</p>
      </header>
      <article className="report-paper">
        <p className="report-paper__meta">6월 관측 리포트 · 2주차</p>
        <h4 className="report-paper__title">반복되는 서운함의 흐름</h4>
        <section>
          <h5>요약</h5>
          <p>
            사람들 앞에서의 반응이 줄어들 때, 몸은 먼저 긴장하고 생각은
            &lsquo;내가 중요하지 않은가&rsquo;로 이어지는 패턴이 보입니다.
          </p>
        </section>
        <section>
          <h5>핵심 패턴</h5>
          <ul>
            <li>의견이 가볍게 넘어갈 때 → 말 줄이기</li>
            <li>서운함 → 거리두기</li>
          </ul>
        </section>
        <section>
          <h5>관측 질문</h5>
          <p>다음에 비슷한 순간이 오면, 어떤 한 문장을 남겨보고 싶나요?</p>
        </section>
        <div className="report-flow" aria-hidden="true">
          <span>감정</span>
          <span>→</span>
          <span>생각</span>
          <span>→</span>
          <span>반응</span>
        </div>
      </article>
    </div>
  );
}

export const FEATURE_COMPONENTS = [
  FeatureAI,
  FeatureSocialSelf,
  FeatureTests,
  FeaturePromptCommunity,
  FeatureReport,
];
