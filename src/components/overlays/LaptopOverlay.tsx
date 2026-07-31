import { useEffect } from 'react';
import type { FeatureIndex } from '../../types';
import { FEATURE_COUNT, FEATURES } from '../../data/features';
import { FEATURE_COMPONENTS } from '../features/FeaturePanels';

interface LaptopOverlayProps {
  currentFeature: FeatureIndex;
  featuresComplete: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSetFeature: (index: FeatureIndex) => void;
  onStartPrint: () => void;
}

export function LaptopOverlay({
  currentFeature,
  featuresComplete,
  onNext,
  onPrev,
  onSetFeature,
  onStartPrint,
}: LaptopOverlayProps) {
  const FeatureView = FEATURE_COMPONENTS[currentFeature];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onNext, onPrev]);

  return (
    <div className="stage-hud laptop-hud">
      <p className="laptop-hud__guide reveal">다섯 가지 핵심 기능을 하나씩 탐색해 보세요.</p>

      <div className="laptop-frame reveal" role="region" aria-label="노트북 화면">
        <div className="laptop-frame__chrome">
          <span />
          <span />
          <span />
        </div>

        <div className="laptop-app">
          <aside className="laptop-app__rail" aria-label="기능 목록">
            <div className="laptop-app__brand">
              <img src="/images/logo.svg" alt="" width={18} height={22} />
              <span>Orbiroom</span>
            </div>
            <nav>
              <ol>
                {FEATURES.map((feature, index) => (
                  <li key={feature.id}>
                    <button
                      type="button"
                      className={`rail-item ${index === currentFeature && !featuresComplete ? 'is-active' : ''}`}
                      onClick={() => onSetFeature(index as FeatureIndex)}
                      aria-current={index === currentFeature && !featuresComplete ? 'step' : undefined}
                    >
                      <span className="rail-item__num">{index + 1}</span>
                      <span className="rail-item__label">{feature.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <section className="laptop-app__main" aria-live="polite">
            {!featuresComplete ? (
              <>
                <FeatureView />
                <footer className="laptop-app__footer">
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={onPrev}
                    disabled={currentFeature === 0}
                  >
                    이전
                  </button>
                  <div className="progress-dots" aria-hidden="true">
                    {Array.from({ length: FEATURE_COUNT }).map((_, i) => (
                      <span key={i} className={i === currentFeature ? 'is-active' : ''} />
                    ))}
                  </div>
                  <span className="progress-count">
                    {currentFeature + 1} / {FEATURE_COUNT}
                  </span>
                  <button type="button" className="ghost-btn ghost-btn--next" onClick={onNext}>
                    {currentFeature === 4 ? '완료' : '다음'}
                  </button>
                </footer>
              </>
            ) : (
              <div className="laptop-complete">
                <div className="laptop-complete__mark" aria-hidden="true" />
                <p>
                  오르비룸의 주요 공간을 모두 살펴봤어요.
                  <br />
                  지금까지의 여정을 한 장의 소개 기록으로 남겨볼까요?
                </p>
                <button type="button" className="btn-orb" onClick={onStartPrint}>
                  소개 기록 출력하기
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
