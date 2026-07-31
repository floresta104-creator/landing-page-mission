import { useEffect, useState } from 'react';
import type { TourState } from '../types';
import { CAMERA_VIEWS, sceneLabel } from '../config/camera';
import { sceneBackground } from '../config/sceneBackgrounds';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SoundToggle } from './SoundToggle';
import { EntranceOverlay } from './overlays/EntranceOverlay';
import { RoomOverlay } from './overlays/RoomOverlay';
import { LaptopOverlay } from './overlays/LaptopOverlay';
import { PrinterOverlay } from './overlays/PrinterOverlay';
import { BinderOverlay } from './overlays/BinderOverlay';
import { LetterOverlay } from './overlays/LetterOverlay';

interface TourExperienceProps {
  state: TourState;
  openDoor: () => void;
  zoomLaptop: () => void;
  setFeature: (index: TourState['currentFeature']) => void;
  nextFeature: () => void;
  prevFeature: () => void;
  startPrint: () => void;
  goBookshelf: () => void;
  goLetter: () => void;
  openLetter: () => void;
  submitEmail: () => void;
  toggleSound: () => void;
}

export function TourExperience({
  state,
  openDoor,
  zoomLaptop,
  setFeature,
  nextFeature,
  prevFeature,
  startPrint,
  goBookshelf,
  goLetter,
  openLetter,
  submitEmail,
  toggleSound,
}: TourExperienceProps) {
  const reducedMotion = useReducedMotion();
  const camera = CAMERA_VIEWS[state.scene];
  const nextBg = sceneBackground(state.scene);
  const [activeBg, setActiveBg] = useState(nextBg);
  const [prevBg, setPrevBg] = useState<string | null>(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (nextBg === activeBg) return;
    setPrevBg(activeBg);
    setActiveBg(nextBg);
    setFading(true);
    const t = window.setTimeout(() => {
      setPrevBg(null);
      setFading(false);
    }, reducedMotion ? 0 : 900);
    return () => window.clearTimeout(t);
  }, [nextBg, activeBg, reducedMotion]);

  return (
    <div className="tour-app">
      <a href="#tour-main" className="skip-link">
        투어 본문으로 건너뛰기
      </a>

      <header className="tour-header">
        <p className="tour-header__demo">Orbiroom · 소개용 데모</p>
        <SoundToggle enabled={state.soundEnabled} onToggle={toggleSound} />
      </header>

      <main id="tour-main" className="tour-main" aria-label={sceneLabel(state.scene)}>
        <div
          className={`spatial-stage ${reducedMotion ? 'spatial-stage--reduced' : ''} ${state.isDoorOpening ? 'is-door-opening' : ''}`}
          data-scene={state.scene}
        >
          <div
            className="spatial-stage__world"
            style={{
              ['--cam-x' as string]: `${camera.x}%`,
              ['--cam-y' as string]: `${camera.y}%`,
              ['--cam-scale' as string]: String(camera.scale),
            }}
          >
            {prevBg && (
              <div
                className={`scene-photo scene-photo--prev ${fading ? 'is-out' : ''}`}
                style={{ backgroundImage: `url(${prevBg})` }}
                aria-hidden="true"
              />
            )}
            <div
              className={`scene-photo scene-photo--active ${fading ? 'is-in' : ''}`}
              style={{ backgroundImage: `url(${activeBg})` }}
              aria-hidden="true"
            />
            <div className="scene-photo__grain" aria-hidden="true" />
            <div className="scene-photo__vignette" aria-hidden="true" />

            <div className="hud-layer">
              {state.scene === 'entrance' && (
                <EntranceOverlay isDoorOpening={state.isDoorOpening} onOpenDoor={openDoor} />
              )}
              {state.scene === 'room' && <RoomOverlay onLaptopClick={zoomLaptop} />}
              {state.scene === 'laptop' && (
                <LaptopOverlay
                  currentFeature={state.currentFeature}
                  featuresComplete={state.featuresComplete}
                  onNext={nextFeature}
                  onPrev={prevFeature}
                  onSetFeature={setFeature}
                  onStartPrint={startPrint}
                />
              )}
              {state.scene === 'printing' && (
                <PrinterOverlay
                  isPrinting={state.isPrinting}
                  printComplete={state.printComplete}
                  onArchive={goBookshelf}
                />
              )}
              {(state.scene === 'bookshelf' || state.scene === 'binder') && (
                <BinderOverlay scene={state.scene} onContinue={goLetter} />
              )}
              {(state.scene === 'letter' || state.scene === 'complete') && (
                <LetterOverlay
                  isOpen={state.isLetterOpen}
                  emailSubmitted={state.emailSubmitted}
                  onOpen={openLetter}
                  onSubmit={submitEmail}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="sr-only" aria-live="polite">
        현재 장면: {sceneLabel(state.scene)}
      </div>
    </div>
  );
}
