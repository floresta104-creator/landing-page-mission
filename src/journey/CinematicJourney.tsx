import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import { CHOICES, type MissionChoice } from './content';
import './cinematic.css';

gsap.registerPlugin(ScrollTrigger);

type Stage = 'gate' | 'journey';

export function CinematicJourney() {
  const [stage, setStage] = useState<Stage>('gate');
  const [load, setLoad] = useState(0);
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<MissionChoice | null>(null);
  const [structured, setStructured] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => {
    const srcs = [
      '/images/journey/door-scene.png',
      '/images/journey/room.png',
      '/images/journey/laptop.png',
      '/images/journey/binder.png',
      '/images/journey/bookshelf.png',
      '/images/journey/splash.png',
      '/images/logo.svg',
    ];
    let n = 0;
    srcs.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        n += 1;
        setLoad(Math.round((n / srcs.length) * 100));
        if (n >= srcs.length) setReady(true);
      };
      img.src = src;
    });
  }, []);

  const startAudio = () => {
    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      void ctx.resume();
      if (oscRef.current) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 98;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.014, ctx.currentTime + 1.4);
      oscRef.current = { osc, gain };
    } catch {
      /* optional */
    }
  };

  const begin = () => {
    startAudio();
    setStage('journey');
  };

  useEffect(() => {
    if (stage !== 'journey' || !rootRef.current) return;

    const room = roomRef.current;
    const move = (e: PointerEvent) => {
      if (!room) return;
      const r = room.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(room.querySelector('.cz-room-plate'), {
        x: x * -28,
        y: y * -16,
        duration: 0.8,
        ease: 'power3.out',
      });
    };
    room?.addEventListener('pointermove', move);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.cz-panel').forEach((panel) => {
        const media = panel.querySelector('.cz-media');
        const copy = panel.querySelector('.cz-copy');
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.12, y: 40 },
            {
              scale: 1,
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          );
        }
        if (copy) {
          gsap.fromTo(
            copy,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 65%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        }
      });
    }, rootRef);

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => {
      window.clearTimeout(t);
      room?.removeEventListener('pointermove', move);
      ctx.revert();
    };
  }, [stage]);

  const pick = (c: MissionChoice) => {
    setChoice(c);
    window.setTimeout(() => setStructured(true), 280);
  };

  return (
    <div className="cz" data-stage={stage}>
      <a className="skip-link" href="#cz-main">
        본문으로
      </a>

      {stage === 'gate' && (
        <section className="cz-gate" aria-label="시작">
          <div className="cz-gate-visual" aria-hidden>
            <img src="/images/journey/splash.png" alt="" />
            <div className="cz-gate-shade" />
          </div>
          <div className="cz-gate-content">
            <img className="cz-mark" src="/images/logo.svg" alt="" />
            <p className="cz-kicker">Orbiroom</p>
            <h1>
              From feeling
              <br />
              <span>to clarity.</span>
            </h1>
            <p className="cz-line">
              대화는 흘러가지만,
              <br />
              확인한 나의 기록은 남습니다.
            </p>
            <div className="cz-meter" aria-hidden>
              <i style={{ width: `${load}%` }} />
            </div>
            <button type="button" className="cz-enter" disabled={!ready} onClick={begin}>
              {ready ? 'Click to begin the journey' : `Loading ${load}%`}
            </button>
            <p className="cz-hint">사운드와 함께 관측실로 들어갑니다</p>
          </div>
        </section>
      )}

      {stage === 'journey' && (
        <div ref={rootRef} id="cz-main" className="cz-journey">
          <header className="cz-nav">
            <div className="cz-nav-brand">
              <img src="/images/logo.svg" alt="" width={22} height={22} />
              <strong>Orbiroom</strong>
            </div>
            <p>scroll to continue</p>
          </header>

          {/* 01 portal */}
          <section className="cz-panel cz-portal">
            <div className="cz-media">
              <img src="/images/journey/door-scene.png" alt="" />
            </div>
            <div className="cz-veil" />
            <div className="cz-copy cz-copy-center">
              <p className="cz-kicker">01 — Entrance</p>
              <h2>
                아직 이름 붙이지 못한
                <br />
                <em>감정</em> 앞에서.
              </h2>
              <p>문을 지나면, 나의 관측실이 기다립니다.</p>
            </div>
          </section>

          {/* 02 room */}
          <section className="cz-panel cz-room" ref={roomRef}>
            <div className="cz-media cz-room-plate">
              <img src="/images/journey/room.png" alt="오르비룸 관측실" />
            </div>
            <div className="cz-veil cz-veil-soft" />
            <div className="cz-copy cz-copy-bottom">
              <p className="cz-kicker">02 — Observation Room</p>
              <h2>
                방은 홈이고,
                <br />
                기록은 <em>궤도</em>가 됩니다.
              </h2>
              <p>노트북 · 책장 · 편지 — 모든 관측이 이 공간에 남습니다.</p>
            </div>
          </section>

          {/* 03 promise */}
          <section className="cz-panel cz-promise">
            <div className="cz-media">
              <img src="/images/journey/laptop.png" alt="" />
            </div>
            <div className="cz-veil" />
            <div className="cz-copy cz-copy-center">
              <p className="cz-kicker">03 — AI Structure</p>
              <h2>
                대충 적어도,
                <br />
                AI가 <em>정리</em>합니다.
              </h2>
              <p>감정 · 생각 · 몸 신호 · 자기보호로 나눠, 당신이 확인한 것만 남깁니다.</p>
            </div>
          </section>

          {/* 04 interact */}
          <section className="cz-panel cz-interact">
            <div className="cz-media cz-dim">
              <img src="/images/journey/ai.png" alt="" />
            </div>
            <div className="cz-veil" />
            <div className="cz-copy cz-copy-card">
              <p className="cz-kicker">04 — Try a moment</p>
              <h2>지금 떠오른 말을 고르세요</h2>
              <div className="cz-choices">
                {CHOICES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={choice?.id === c.id ? 'is-on' : ''}
                    onClick={() => pick(c)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className={`cz-structure ${structured && choice ? 'is-show' : ''}`} aria-live="polite">
                {choice && (
                  <>
                    <h3>확인된 구조화 기록</h3>
                    <ul>
                      <li>
                        <span>감정</span>
                        <b>{choice.emotion}</b>
                      </li>
                      <li>
                        <span>생각</span>
                        <b>{choice.thought}</b>
                      </li>
                      <li>
                        <span>몸 신호</span>
                        <b>{choice.body}</b>
                      </li>
                      <li>
                        <span>자기보호</span>
                        <b>{choice.shield}</b>
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* 05 archive */}
          <section className="cz-panel cz-archive">
            <div className="cz-media">
              <img src="/images/journey/binder.png" alt="" />
            </div>
            <div className="cz-veil cz-veil-soft" />
            <div className="cz-copy cz-copy-center">
              <p className="cz-kicker">05 — Binder</p>
              <h2>
                잊히지 않게 모아두고,
                <br />
                지난 나와 <em>비교</em>합니다.
              </h2>
              <p>바인더에 쌓인 관측으로 자기객관화가 시작됩니다.</p>
            </div>
          </section>

          {/* 06 deeper */}
          <section className="cz-panel cz-deeper">
            <div className="cz-media">
              <img src="/images/journey/bookshelf.png" alt="" />
            </div>
            <div className="cz-veil" />
            <div className="cz-copy cz-copy-center">
              <p className="cz-kicker">06 — Deeper layers</p>
              <h2>
                관계 · 리포트 · 프롬포트까지
                <br />
                <em>이어지는</em> 나.
              </h2>
              <p>유료 리포트의 통찰은, 당신이 허용한 범위에서 일상 AI 관측에 반영됩니다.</p>
            </div>
          </section>

          {/* 07 cta */}
          <section className="cz-panel cz-cta">
            <div className="cz-media">
              <img src="/images/journey/room.png" alt="" />
            </div>
            <div className="cz-veil cz-veil-heavy" />
            <div className="cz-copy cz-copy-center">
              <img className="cz-mark cz-mark-sm" src="/images/logo.svg" alt="" />
              <p className="cz-kicker">Orbiroom</p>
              <h2>
                나의 관측실을
                <br />
                <em>만드세요.</em>
              </h2>
              <p className="cz-cta-sub">대화는 흘러가지만, 확인한 나의 기록은 남습니다.</p>
              <button type="button" className="cz-enter">
                관측실 만들기
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
