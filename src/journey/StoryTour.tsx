import gsap from 'gsap';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import './tour.css';

type Step = 'boot' | 'door' | 'room' | 'laptop' | 'print' | 'shelf' | 'binder' | 'letter';

const MENU_SPOTS = [
  { title: 'AI 대화', desc: '일상을 말해도 구조화됩니다', left: '18%', top: '28%' },
  { title: '관측 테스트', desc: '7가지 입구로 나를 관측', left: '18%', top: '38%' },
  { title: '관계 속 나', desc: '그 사람 앞의 나를 기록', left: '18%', top: '48%' },
  { title: '리포트', desc: '더 깊은 나를 유료로 분석', left: '18%', top: '58%' },
  { title: '설정', desc: '저장과 반영 범위를 통제', left: '18%', top: '68%' },
];

const PLATES: Record<Exclude<Step, 'boot'>, string> = {
  door: '/images/journey/door-scene.png',
  room: '/images/journey/room.png',
  laptop: '/images/journey/laptop.png',
  print: '/images/journey/printer.png',
  shelf: '/images/journey/bookshelf.png',
  binder: '/images/journey/binder.png',
  letter: '/images/journey/letter.png',
};

export function StoryTour() {
  const [step, setStep] = useState<Step>('boot');
  const [load, setLoad] = useState(0);
  const [spot, setSpot] = useState(-1);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const aRef = useRef<HTMLImageElement>(null);
  const bRef = useRef<HTMLImageElement>(null);
  const frontIsA = useRef(true);
  const cameraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = Object.values(PLATES);
    let n = 0;
    list.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        n += 1;
        setLoad(Math.round((n / list.length) * 100));
        if (n >= list.length) {
          if (aRef.current) {
            aRef.current.src = PLATES.door;
            gsap.set(aRef.current, { opacity: 1, scale: 1 });
          }
          if (bRef.current) gsap.set(bRef.current, { opacity: 0 });
          setStep('door');
        }
      };
      img.src = src;
    });
  }, []);

  const front = () => (frontIsA.current ? aRef.current : bRef.current);
  const back = () => (frontIsA.current ? bRef.current : aRef.current);

  const swapTo = (src: string, opts?: { scale?: number; ox?: string; oy?: string; dur?: number }) =>
    new Promise<void>((resolve) => {
      const f = front();
      const k = back();
      const cam = cameraRef.current;
      if (!f || !k || !cam) {
        resolve();
        return;
      }
      k.src = src;
      gsap.set(k, { opacity: 0, scale: opts?.scale ?? 1.08, x: 0, y: 0 });
      gsap.set(cam, { clearProps: 'transform' });
      const tl = gsap.timeline({
        onComplete: () => {
          frontIsA.current = !frontIsA.current;
          gsap.set(f, { opacity: 0 });
          gsap.set(k, { opacity: 1, scale: 1 });
          resolve();
        },
      });
      tl.to(f, { scale: opts?.scale ? opts.scale * 0.92 : 1.12, opacity: 0, duration: opts?.dur ?? 0.9, ease: 'power2.inOut' }, 0);
      tl.to(k, { opacity: 1, scale: 1, duration: opts?.dur ?? 0.9, ease: 'power2.inOut' }, 0.05);
    });

  const zoomCam = (vars: gsap.TweenVars) =>
    new Promise<void>((resolve) => {
      const cam = cameraRef.current;
      if (!cam) {
        resolve();
        return;
      }
      gsap.to(cam, {
        ...vars,
        duration: vars.duration ?? 1,
        ease: vars.ease ?? 'power3.inOut',
        onComplete: () => resolve(),
      });
    });

  const enterDoor = async () => {
    if (busy) return;
    setBusy(true);
    await zoomCam({ scale: 1.55, filter: 'brightness(1.25)', duration: 1.15, transformOrigin: '50% 42%' });
    await swapTo(PLATES.room, { scale: 1.2, dur: 0.85 });
    gsap.set(cameraRef.current, { clearProps: 'all' });
    setStep('room');
    setBusy(false);
  };

  const openLaptop = async () => {
    if (busy) return;
    setBusy(true);
    await zoomCam({
      scale: 1.7,
      xPercent: -9,
      yPercent: -6,
      duration: 1,
      transformOrigin: '42% 54%',
    });
    await swapTo(PLATES.laptop, { dur: 0.75 });
    gsap.set(cameraRef.current, { clearProps: 'all' });
    setStep('laptop');
    setSpot(0);
    setBusy(false);
  };

  useEffect(() => {
    if (step !== 'laptop') return;
    setSpot(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= MENU_SPOTS.length) {
        window.clearInterval(id);
        setSpot(MENU_SPOTS.length);
        return;
      }
      setSpot(i);
    }, 850);
    return () => window.clearInterval(id);
  }, [step]);

  const startPrint = async () => {
    if (busy) return;
    setBusy(true);
    await swapTo(PLATES.print, { dur: 0.8 });
    setStep('print');
    setBusy(false);
  };

  useEffect(() => {
    if (step !== 'print') return;
    const t = window.setTimeout(async () => {
      setBusy(true);
      await swapTo(PLATES.shelf, { dur: 0.7 });
      setStep('shelf');
      setBusy(false);
    }, 2800);
    return () => window.clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== 'shelf') return;
    const t = window.setTimeout(async () => {
      setBusy(true);
      await zoomCam({ scale: 1.25, xPercent: 8, duration: 0.9, transformOrigin: '70% 50%' });
      await swapTo(PLATES.binder, { dur: 0.75 });
      gsap.set(cameraRef.current, { clearProps: 'all' });
      setStep('binder');
      setBusy(false);
    }, 1600);
    return () => window.clearTimeout(t);
  }, [step]);

  const openLetter = async () => {
    if (busy) return;
    setBusy(true);
    await swapTo(PLATES.letter, { dur: 0.85 });
    setStep('letter');
    setBusy(false);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  const menusReady = spot >= MENU_SPOTS.length;

  return (
    <div className="st" data-step={step}>
      <div className="st-stage" aria-hidden={step === 'boot'}>
        <div className="st-camera" ref={cameraRef}>
          <img ref={aRef} className="st-layer" alt="" draggable={false} />
          <img ref={bRef} className="st-layer" alt="" draggable={false} />
        </div>
      </div>

      {step === 'boot' && (
        <div className="st-boot">
          <img src="/images/logo.svg" alt="" />
          <strong>Orbiroom</strong>
          <div className="st-boot-bar">
            <i style={{ width: `${load}%` }} />
          </div>
        </div>
      )}

      {step === 'door' && (
        <div className="st-ui st-ui-door">
          <p>Orbiroom</p>
          <h1>아직 이름 붙이지 못한 감정</h1>
          <button type="button" disabled={busy} onClick={enterDoor}>
            문을 열고 들어가기
          </button>
          <button type="button" className="st-hit-door" aria-label="들어가기" disabled={busy} onClick={enterDoor} />
        </div>
      )}

      {step === 'room' && (
        <div className="st-ui st-ui-room">
          <button type="button" className="st-hit-laptop" aria-label="노트북 열기" disabled={busy} onClick={openLaptop} />
          <div className="st-glow" aria-hidden />
        </div>
      )}

      {step === 'laptop' && (
        <div className="st-ui st-ui-laptop">
          {MENU_SPOTS.map((m, i) => (
            <aside
              key={m.title}
              className={`st-spot ${i <= spot ? 'on' : ''} ${i === Math.min(spot, MENU_SPOTS.length - 1) ? 'focus' : ''}`}
              style={{ left: m.left, top: m.top }}
            >
              <b>{m.title}</b>
              <span>{m.desc}</span>
            </aside>
          ))}
          {menusReady && (
            <div className="st-bottom">
              <p>메뉴를 모두 살펴봤습니다. 오늘의 기록을 저장할까요?</p>
              <button type="button" disabled={busy} onClick={startPrint}>
                저장하고 출력하기
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'print' && (
        <div className="st-ui st-ui-print">
          <div className="st-progress">
            <i />
          </div>
        </div>
      )}

      {step === 'shelf' && <div className="st-ui st-ui-shelf" aria-hidden />}

      {step === 'binder' && (
        <div className="st-ui st-ui-binder">
          <div className="st-bottom">
            <p>바인더에 여러 날짜의 기록이 쌓입니다</p>
            <button type="button" disabled={busy} onClick={openLetter}>
              편지 확인하기
            </button>
          </div>
        </div>
      )}

      {step === 'letter' && (
        <div className="st-ui st-ui-letter">
          {!sent ? (
            <form className="st-mail" onSubmit={onSubmit}>
              <p className="st-mail-kicker">편지가 도착했습니다</p>
              <h2>관측실 소식을 이메일로 받아보세요</h2>
              <label htmlFor="mail">이메일 주소</label>
              <input
                id="mail"
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">소식 받기</button>
            </form>
          ) : (
            <div className="st-mail st-mail-done">
              <img src="/images/logo.svg" alt="" width={36} height={36} />
              <h2>남겨두었습니다</h2>
              <p>준비되는 대로 관측실 소식을 보내드릴게요.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
