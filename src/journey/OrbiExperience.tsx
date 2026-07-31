import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { CHOICES, type MissionChoice } from './content';
import './experience.css';

type Phase = 'boot' | 'door' | 'room' | 'laptop' | 'saved' | 'cta';

const HOTSPOTS = [
  { id: 'laptop', label: '노트북', x: 37, y: 48, w: 13, h: 16, main: true },
  { id: 'bookshelf', label: '책장', x: 74, y: 28, w: 22, h: 55, main: false },
  { id: 'letter', label: '편지', x: 55, y: 57, w: 8, h: 10, main: false },
  { id: 'printer', label: '프린터', x: 8, y: 57, w: 9, h: 12, main: false },
  { id: 'mirror', label: '거울', x: 18, y: 53, w: 7, h: 12, main: false },
] as const;

export function OrbiExperience() {
  const [phase, setPhase] = useState<Phase>('boot');
  const [load, setLoad] = useState(0);
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<MissionChoice | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const roomImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const list = [
      '/images/journey/door-scene.png',
      '/images/journey/room.png',
      '/images/journey/laptop.png',
      '/images/journey/binder.png',
      '/images/logo.svg',
    ];
    let done = 0;
    list.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        done += 1;
        setLoad(Math.round((done / list.length) * 100));
        if (done >= list.length) {
          setReady(true);
          setPhase('door');
        }
      };
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (phase !== 'room') return;
    if (roomImgRef.current) {
      gsap.set(roomImgRef.current, { clearProps: 'transform,filter' });
    }
    gsap.set('.ox-room-ui', { opacity: 1 });
  }, [phase]);

  const enterRoom = () => {
    const stage = stageRef.current;
    if (!stage) {
      setPhase('room');
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => setPhase('room'),
    });
    tl.to('.ox-door-scene', { scale: 1.18, filter: 'brightness(1.25)', duration: 0.9, ease: 'power2.inOut' });
    tl.to('.ox-door-scene', { opacity: 0, duration: 0.45 }, '-=0.15');
  };

  const openLaptop = () => {
    const img = roomImgRef.current;
    if (img) {
      gsap
        .timeline({
          onComplete: () => setPhase('laptop'),
        })
        .to(img, {
          scale: 1.55,
          xPercent: -8,
          yPercent: -6,
          duration: 0.85,
          ease: 'power3.inOut',
          transformOrigin: '42% 55%',
        })
        .to('.ox-room-ui', { opacity: 0, duration: 0.3 }, 0);
    } else {
      setPhase('laptop');
    }
  };

  const onHotspot = (id: string) => {
    if (id === 'laptop') {
      openLaptop();
      return;
    }
    const map: Record<string, string> = {
      bookshelf: '확인한 기록이 바인더로 쌓이는 보관소입니다.',
      letter: '그 사람 앞의 나를 장면으로 남깁니다.',
      printer: '저장이 끝나면 기록이 출력되어 방에 반영됩니다.',
      mirror: '나를 지키려 했던 방식을 관측합니다.',
    };
    setNote(map[id] ?? null);
    window.setTimeout(() => setNote(null), 2400);
  };

  const choose = (c: MissionChoice) => {
    setChoice(c);
  };

  const save = () => {
    setPhase('saved');
    window.setTimeout(() => setPhase('cta'), 2200);
  };

  return (
    <div className="ox" data-phase={phase} ref={stageRef}>
      {phase === 'boot' && (
        <div className="ox-boot">
          <img src="/images/logo.svg" alt="" />
          <p>Orbiroom</p>
          <div className="ox-boot-bar">
            <i style={{ width: `${load}%` }} />
          </div>
        </div>
      )}

      {phase === 'door' && (
        <section className="ox-scene ox-door-scene">
          <img src="/images/journey/door-scene.png" alt="관측실 입구" />
          <div className="ox-door-copy">
            <p>Orbiroom</p>
            <h1>아직 이름 붙이지 못한 감정</h1>
            <button type="button" disabled={!ready} onClick={enterRoom}>
              관측실 들어가기
            </button>
          </div>
          <button type="button" className="ox-door-hit" aria-label="관측실 들어가기" onClick={enterRoom} />
        </section>
      )}

      {(phase === 'room' || phase === 'laptop' || phase === 'saved' || phase === 'cta') && (
        <section className={`ox-scene ox-room ${phase !== 'room' ? 'is-away' : ''}`}>
          <img ref={roomImgRef} src="/images/journey/room.png" alt="오르비룸 관측실" />
          {phase === 'room' && (
            <div className="ox-room-ui">
              {HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className={`ox-hot ${h.main ? 'is-main' : ''}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
                  aria-label={h.label}
                  onClick={() => onHotspot(h.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {phase === 'laptop' && (
        <section className="ox-overlay ox-laptop-view">
          <img className="ox-plate" src="/images/journey/laptop.png" alt="" />
          <div className="ox-panel">
            <header>
              <button type="button" className="ox-back" onClick={() => setPhase('room')}>
                ← 방으로
              </button>
              <h2>자유롭게 정리하기</h2>
            </header>
            <p className="ox-help">일상을 대충 적어도 됩니다. AI가 구조화하고, 당신이 확인한 것만 남깁니다.</p>
            <div className="ox-choices">
              {CHOICES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={choice?.id === c.id ? 'on' : ''}
                  onClick={() => choose(c)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {choice && (
              <div className="ox-struct">
                <h3>저장 전 확인</h3>
                <dl>
                  <div>
                    <dt>감정</dt>
                    <dd>{choice.emotion}</dd>
                  </div>
                  <div>
                    <dt>생각</dt>
                    <dd>{choice.thought}</dd>
                  </div>
                  <div>
                    <dt>몸 신호</dt>
                    <dd>{choice.body}</dd>
                  </div>
                  <div>
                    <dt>자기보호</dt>
                    <dd>{choice.shield}</dd>
                  </div>
                </dl>
                <button type="button" className="ox-save" onClick={save}>
                  확인하고 저장
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {phase === 'saved' && (
        <section className="ox-overlay ox-saved">
          <img className="ox-plate" src="/images/journey/binder.png" alt="" />
          <p className="ox-saved-msg">확인한 기록이 바인더에 남았습니다.</p>
        </section>
      )}

      {phase === 'cta' && (
        <section className="ox-overlay ox-cta">
          <img className="ox-plate" src="/images/journey/room.png" alt="" />
          <div className="ox-cta-card">
            <img src="/images/logo.svg" alt="" width={40} height={40} />
            <h2>
              대화는 흘러가지만,
              <br />
              확인한 나의 기록은 남습니다.
            </h2>
            <button type="button" className="ox-save">
              나의 관측실 만들기
            </button>
            <button type="button" className="ox-back" onClick={() => setPhase('room')}>
              다시 둘러보기
            </button>
          </div>
        </section>
      )}

      {note && <div className="ox-note">{note}</div>}
    </div>
  );
}
