import type { GameState } from '../../types/game';
import { CAMERA, OBJECTS, PHASE_LABEL, SCENE_BG } from '../../config/gameWorld';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { OrbiroomLogo } from '../OrbiroomLogo';
import { SoundToggle } from '../SoundToggle';
import { Hotspot } from './Hotspot';
import { LaptopPanel } from './LaptopPanel';
import { PrintPanel } from './PrintPanel';
import { BinderPanel } from './BinderPanel';
import { LetterPanel } from './LetterPanel';

interface GameExperienceProps {
  state: GameState;
  openDoor: () => void;
  focusLaptop: () => void;
  setFeature: (i: GameState['feature']) => void;
  nextFeature: () => void;
  prevFeature: () => void;
  startPrint: () => void;
  openBinder: () => void;
  goLetter: () => void;
  openLetter: () => void;
  submitEmail: () => void;
  toggleSound: () => void;
}

export function GameExperience({
  state,
  openDoor,
  focusLaptop,
  setFeature,
  nextFeature,
  prevFeature,
  startPrint,
  openBinder,
  goLetter,
  openLetter,
  submitEmail,
  toggleSound,
}: GameExperienceProps) {
  const reduced = useReducedMotion();
  const cam = CAMERA[state.phase];
  const bg = SCENE_BG[state.phase];

  return (
    <div className="game">
      <header className="game-top">
        <p className="game-top__badge">Orbiroom</p>
        <ol className="game-progress" aria-label="진행">
          {(['entrance', 'room', 'laptop', 'printing', 'binder', 'letter'] as const).map((p) => (
            <li
              key={p}
              className={
                state.phase === p || (state.phase === 'complete' && p === 'letter')
                  ? 'is-now'
                  : ''
              }
            >
              {PHASE_LABEL[p]}
            </li>
          ))}
        </ol>
        <SoundToggle enabled={state.soundOn} onToggle={toggleSound} />
      </header>

      <main
        className={[
          'game-stage',
          reduced ? 'is-reduced' : '',
          state.doorOpening ? 'is-warp' : '',
          `phase-${state.phase}`,
        ].join(' ')}
        aria-label={PHASE_LABEL[state.phase]}
      >
        <div className="game-viewport">
          <div
            className="game-world"
            style={{
              ['--ox' as string]: `${cam.x}%`,
              ['--oy' as string]: `${cam.y}%`,
              ['--scale' as string]: String(cam.scale),
              backgroundImage: `url(${bg})`,
            }}
          />
          <div className="game-viewport__shade" aria-hidden="true" />
        </div>

        <div className="game-hud">
          {state.phase === 'entrance' && (
            <section className="s01">
              <div className="s01__copy">
                <OrbiroomLogo />
                <p className="s01__eyebrow">오르비룸</p>
                <h1>
                  반복되는 감정에는
                  <br />
                  나만의 궤도가 있습니다.
                </h1>
                <p className="s01__desc">
                  오르비룸은 당신의 내면을 관찰하고
                  <br />
                  기록하며, 더 나은 자신을 발견하는 공간입니다.
                </p>
                <button type="button" className="btn-orb" onClick={openDoor}>
                  관측실로 들어가기
                </button>
              </div>

              <Hotspot
                label="문 열기"
                x={OBJECTS.door.x}
                y={OBJECTS.door.y}
                w={OBJECTS.door.w}
                h={OBJECTS.door.h}
                onClick={openDoor}
              />
            </section>
          )}

          {state.phase === 'room' && (
            <section className="s02">
              <div className="s02__copy">
                <p className="s02__lead">여기는 당신의 관측실이에요.</p>
                <p>
                  노트북을 열어
                  <br />
                  오르비룸의 주요 기능을 살펴보세요.
                </p>
              </div>

              <Hotspot
                label="노트북을 클릭하세요"
                x={OBJECTS.laptop.x}
                y={OBJECTS.laptop.y}
                w={OBJECTS.laptop.w}
                h={OBJECTS.laptop.h}
                onClick={focusLaptop}
              />

              <button type="button" className="btn-orb s02__cta" onClick={focusLaptop}>
                노트북 열기
              </button>
            </section>
          )}

          {state.phase === 'laptop' && (
            <LaptopPanel
              feature={state.feature}
              featuresDone={state.featuresDone}
              onNext={nextFeature}
              onPrev={prevFeature}
              onSet={setFeature}
              onPrint={startPrint}
            />
          )}

          {state.phase === 'printing' && (
            <PrintPanel
              printing={state.printing}
              printDone={state.printDone}
              onArchive={openBinder}
            />
          )}

          {state.phase === 'binder' && <BinderPanel onContinue={goLetter} />}

          {(state.phase === 'letter' || state.phase === 'complete') && (
            <LetterPanel
              open={state.letterOpen}
              done={state.emailDone}
              onOpen={openLetter}
              onSubmit={submitEmail}
            />
          )}
        </div>
      </main>
    </div>
  );
}
