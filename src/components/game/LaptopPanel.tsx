import { useEffect } from 'react';
import type { FeatureIndex } from '../../types/game';
import { FEATURE_COUNT, FEATURES } from '../../data/features';
import { FEATURE_COMPONENTS } from '../features/FeaturePanels';

interface LaptopPanelProps {
  feature: FeatureIndex;
  featuresDone: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSet: (i: FeatureIndex) => void;
  onPrint: () => void;
}

export function LaptopPanel({
  feature,
  featuresDone,
  onNext,
  onPrev,
  onSet,
  onPrint,
}: LaptopPanelProps) {
  const View = FEATURE_COMPONENTS[feature];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNext, onPrev]);

  return (
    <div className="focus-panel laptop-panel" role="dialog" aria-label="노트북 화면">
      <div className="laptop-panel__shell">
        <aside className="laptop-panel__rail">
          <div className="laptop-panel__brand">
            <img src="/images/logo.svg" alt="" width={16} height={20} />
            Orbiroom
          </div>
          <ol>
            {FEATURES.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  className={i === feature && !featuresDone ? 'is-on' : ''}
                  onClick={() => onSet(i as FeatureIndex)}
                >
                  <em>{i + 1}</em>
                  {f.title}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="laptop-panel__screen" aria-live="polite">
          {!featuresDone ? (
            <>
              <View />
              <footer className="laptop-panel__bar">
                <button type="button" onClick={onPrev} disabled={feature === 0}>
                  ← 이전
                </button>
                <div className="dots" aria-hidden="true">
                  {Array.from({ length: FEATURE_COUNT }).map((_, i) => (
                    <i key={i} className={i === feature ? 'on' : ''} />
                  ))}
                </div>
                <span>
                  {feature + 1}/{FEATURE_COUNT}
                </span>
                <button type="button" className="go" onClick={onNext}>
                  {feature === 4 ? '완료 →' : '다음 →'}
                </button>
              </footer>
            </>
          ) : (
            <div className="laptop-panel__done">
              <p>
                오르비룸의 주요 공간을 모두 살펴봤어요.
                <br />
                소개 기록을 출력할까요?
              </p>
              <button type="button" className="btn-orb" onClick={onPrint}>
                소개 기록 출력하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
