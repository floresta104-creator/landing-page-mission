import gsap from 'gsap';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { HOTSPOTS, MENU_BEATS } from './data';
import { useAdventure } from './useAdventure';
import './adventure.css';

const CAM: Record<string, { x: number; y: number; s: number }> = {
  wide: { x: 0, y: 0, s: 1 },
  laptop: { x: -8, y: -4, s: 1.55 },
  printer: { x: 18, y: -2, s: 1.45 },
  shelf: { x: -16, y: 0, s: 1.4 },
  letter: { x: -10, y: -2, s: 1.5 },
  door: { x: 0, y: 0, s: 1 },
};

export function AdventureGame() {
  const g = useAdventure();
  const [booting, setBooting] = useState(true);
  const [load, setLoad] = useState(0);
  const [email, setEmail] = useState('');
  const worldRef = useRef<HTMLDivElement>(null);
  const doorRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imgs = [
      '/images/journey/door-scene.png',
      '/images/journey/room.png',
      '/images/journey/laptop.png',
      '/images/journey/printer.png',
      '/images/journey/bookshelf.png',
      '/images/journey/binder.png',
      '/images/journey/letter.png',
    ];
    let n = 0;
    imgs.forEach((src) => {
      const i = new Image();
      i.onload = i.onerror = () => {
        n += 1;
        setLoad(Math.round((n / imgs.length) * 100));
        if (n >= imgs.length) {
          setBooting(false);
          g.start();
        }
      };
      i.src = src;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = worldRef.current;
    if (!el || g.state.outside) return;
    const cam = CAM[g.state.focus] ?? CAM.wide;
    gsap.to(el, {
      xPercent: cam.x,
      yPercent: cam.y,
      scale: cam.s,
      duration: 0.95,
      ease: 'power3.inOut',
    });
  }, [g.state.focus, g.state.outside]);

  const enter = () => {
    const door = doorRef.current;
    if (!door) {
      g.enterRoom();
      return;
    }
    gsap
      .timeline({ onComplete: () => g.enterRoom() })
      .to(door, { scale: 1.6, filter: 'brightness(1.3)', duration: 1.05, ease: 'power2.in', transformOrigin: '50% 42%' })
      .to('.ag-outside-ui', { opacity: 0, duration: 0.3 }, 0.2)
      .to(door, { opacity: 0, duration: 0.35 }, '-=0.15');
  };

  const onObject = (id: (typeof HOTSPOTS)[number]['id']) => {
    if (id === 'laptop') {
      g.setFocus('laptop');
      window.setTimeout(() => g.examine('laptop'), 500);
      return;
    }
    if (id === 'printer') {
      g.setFocus('printer');
      window.setTimeout(() => g.examine('printer'), 500);
      return;
    }
    if (id === 'shelf') {
      g.setFocus('shelf');
      window.setTimeout(() => g.examine('shelf'), 450);
      return;
    }
    if (id === 'letter') {
      g.setFocus('letter');
      window.setTimeout(() => g.examine('letter'), 450);
    }
  };

  useEffect(() => {
    if (g.state.examine !== 'printer') return;
    const t = window.setTimeout(() => g.finishPrint(), 2700);
    return () => window.clearTimeout(t);
  }, [g.state.examine, g.finishPrint]);

  useEffect(() => {
    if (g.state.examine !== 'shelf') return;
    const t = window.setTimeout(() => g.examine('binder'), 1400);
    return () => window.clearTimeout(t);
  }, [g.state.examine, g.examine]);

  const submitMail = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    g.finishLetter();
  };

  if (booting) {
    return (
      <div className="ag ag-boot">
        <img src="/images/logo.svg" alt="" />
        <p>Orbiroom</p>
        <div className="ag-load">
          <i style={{ width: `${load}%` }} />
        </div>
        <span>세계를 불러오는 중…</span>
      </div>
    );
  }

  return (
    <div className="ag" data-place={g.state.outside ? 'outside' : 'room'}>
      <header className="ag-hud">
        <div className="ag-brand">
          <img src="/images/logo.svg" alt="" width={22} height={22} />
          <strong>Orbiroom</strong>
        </div>
        <p className="ag-quest" aria-live="polite">
          {g.state.objective}
        </p>
      </header>

      {g.state.outside && (
        <section className="ag-outside">
          <img ref={doorRef} src="/images/journey/door-scene.png" alt="관측실 문" className="ag-door" />
          <div className="ag-outside-ui">
            <h1>아직 이름 붙이지 못한 감정</h1>
            <button type="button" onClick={enter}>
              문 열기
            </button>
          </div>
          <button type="button" className="ag-door-hit" aria-label="문 열기" onClick={enter} />
        </section>
      )}

      {!g.state.outside && (
        <section className="ag-room">
          <div className="ag-world" ref={worldRef}>
            <img src="/images/journey/room.png" alt="관측실" className="ag-room-art" draggable={false} />
            {HOTSPOTS.map((h) => {
              if (!h.unlock(g.state.flags)) return null;
              const glow = h.glow(g.state.flags);
              return (
                <button
                  key={h.id}
                  type="button"
                  className={`ag-hot ${glow ? 'is-glow' : ''}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                  aria-label={h.label}
                  onClick={() => onObject(h.id)}
                  onMouseEnter={() => g.setFocus(h.id)}
                  onMouseLeave={() => {
                    if (!g.state.examine) g.setFocus('wide');
                  }}
                >
                  <span className="ag-hot-label">{h.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Examine views = looking at an object up close */}
      {g.state.examine === 'laptop' && (
        <div className="ag-examine" role="dialog" aria-label="노트북">
          <img src="/images/journey/laptop.png" alt="" />
          <div className="ag-examine-panel">
            {!g.menusDone ? (
              <>
                <p className="ag-step">
                  메뉴 {Math.max(1, g.state.menuStep + 1)} / {MENU_BEATS.length}
                </p>
                <h2>{g.currentMenu?.title ?? '메뉴'}</h2>
                <p>{g.currentMenu?.line}</p>
                <button type="button" onClick={g.nextMenu}>
                  {g.state.menuStep < 0 ? '화면 켜기' : '다음 메뉴'}
                </button>
              </>
            ) : (
              <>
                <h2>오늘의 기록 저장</h2>
                <p>확인한 내용만 출력되어 바인더에 남습니다.</p>
                <button
                  type="button"
                  onClick={() => {
                    g.closeExamine();
                    window.setTimeout(() => onObject('printer'), 350);
                  }}
                >
                  저장하고 출력하기
                </button>
                <button type="button" className="ag-ghost" onClick={g.closeExamine}>
                  방 둘러보기
                </button>
              </>
            )}
          </div>
          <button type="button" className="ag-x" aria-label="닫기" onClick={g.closeExamine}>
            ← 방
          </button>
        </div>
      )}

      {g.state.examine === 'printer' && (
        <div className="ag-examine" role="dialog" aria-label="프린터">
          <img src="/images/journey/printer.png" alt="" />
          <div className="ag-print-bar">
            <div className="ag-print-meter">
              <i />
            </div>
            <p>기록을 출력하는 중…</p>
          </div>
        </div>
      )}

      {g.state.examine === 'shelf' && (
        <div className="ag-examine" role="dialog" aria-label="책장">
          <img src="/images/journey/bookshelf.png" alt="" />
          <p className="ag-toast">바인더를 꺼내는 중…</p>
        </div>
      )}

      {g.state.examine === 'binder' && (
        <div className="ag-examine" role="dialog" aria-label="바인더">
          <img src="/images/journey/binder.png" alt="" />
          <div className="ag-examine-panel ag-examine-panel-bottom">
            <h2>쌓인 관측 기록</h2>
            <p>날짜마다 감정·생각·몸 신호·자기보호가 남아 있습니다.</p>
            <button type="button" onClick={g.finishBinder}>
              책상으로 돌아가기
            </button>
          </div>
        </div>
      )}

      {g.state.examine === 'letter' && (
        <div className="ag-examine" role="dialog" aria-label="편지">
          <img src="/images/journey/letter.png" alt="" />
          <form className="ag-examine-panel" onSubmit={submitMail}>
            <p className="ag-mail-kicker">편지 도착</p>
            <h2>관측실 소식을 받아보시겠어요?</h2>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              placeholder="you@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">소식 받기</button>
            <button type="button" className="ag-ghost" onClick={g.closeExamine}>
              나중에
            </button>
          </form>
        </div>
      )}

      {g.state.flags.subscribed && !g.state.examine && (
        <div className="ag-clear">
          <img src="/images/logo.svg" alt="" width={36} height={36} />
          <h2>퀘스트 완료</h2>
          <p>대화는 흘러가지만, 확인한 기록은 관측실에 남습니다.</p>
        </div>
      )}
    </div>
  );
}
