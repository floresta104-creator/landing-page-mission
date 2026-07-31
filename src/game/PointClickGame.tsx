import { useState } from 'react';
import { DoorScene } from './DoorScene';
import { LayeredRoom } from './LayeredRoom';
import { GamePanels } from './GamePanels';
import { useOrbiGame } from './useOrbiGame';
import type { PropId } from './propIds';

export function PointClickGame() {
  const g = useOrbiGame();
  const [toast, setToast] = useState<string | null>(null);

  const onObject = (id: PropId) => {
    if (id === 'laptop') {
      g.openLaptop();
      return;
    }
    const messages: Record<string, string> = {
      mirror: '거울은 랜딩 체험에서 ‘무엇을 지키고 싶었는지’를 짧게 보여줍니다. (다음 미션)',
      bookshelf: '책장은 확인한 기록이 바인더로 쌓이는 보관소입니다.',
      printer: '프린터는 저장 완료 연출입니다. 실제 기능은 노트북에서 실행됩니다.',
      letter: '편지는 관계·정밀 응답의 입구 메타포입니다.',
      lamp: '',
    };
    setToast(messages[id] ?? null);
    window.setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="pc-game" data-phase={g.state.phase}>
      <a className="skip-link" href="#main">
        본문으로
      </a>

      <header className="pc-hud">
        <div className="pc-brand">
          <img src="/images/logo.svg" alt="" width={28} height={28} />
          <strong>Orbiroom</strong>
          <span>오르비룸</span>
        </div>
        <p className="pc-hint" aria-live="polite">
          {g.state.hint}
        </p>
        <div className="pc-progress" aria-label="진행">
          <span className={g.state.phase !== 'door' ? 'on' : ''}>입구</span>
          <span className={g.state.phase === 'room' || g.state.phase === 'laptop' || g.state.phase === 'result' || g.state.phase === 'cta' ? 'on' : ''}>
            방
          </span>
          <span className={g.state.missionsDone > 0 ? 'on' : ''}>첫 관측</span>
        </div>
      </header>

      <main id="main" className="pc-stage">
        <DoorScene active={g.state.phase === 'door'} onEnter={g.enter} />
        {g.state.phase !== 'door' && (
          <LayeredRoom
            pointer={g.state.pointer}
            onPointer={g.onPointer}
            onObject={onObject}
            laptopDone={g.state.missionsDone > 0}
            showCaption={g.state.phase === 'room'}
          />
        )}
        <GamePanels
          state={g.state}
          onChoose={g.choose}
          onClose={g.backToRoom}
          onCta={g.toCta}
          onBackRoom={g.backToRoom}
        />
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}
