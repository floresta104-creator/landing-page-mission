import { FormEvent, useEffect, useState } from 'react';
import './landing.css';

const doors = [
  { src: '/landing/door-mirror.png', title: '거울의 문', desc: '내가 나를 보는 방식', note: '시선이 머무는 자리' },
  { src: '/landing/door-clock.png', title: '시계의 문', desc: '반복되는 생각', note: '같은 바퀴의 밤' },
  { src: '/landing/door-window.png', title: '창의 문', desc: '감정의 흐름', note: '출렁임을 보는 창' },
  { src: '/landing/door-musicbox.png', title: '오르골의 문', desc: '오래된 내 안의 규칙', note: '작은 멜로디의 규칙' },
  { src: '/landing/door-curtain.png', title: '커튼의 문', desc: '자기보호와 경계', note: '거리를 두는 천' },
  { src: '/landing/door-lamp.png', title: '조명의 문', desc: '몸의 신호', note: '몸이 먼저 켠 불' },
  { src: '/landing/door-drawer.png', title: '서랍의 문', desc: '감춰둔 마음', note: '깊숙이 넣은 칸' },
] as const;

type LandingProps = {
  onEnterPlay: (doorIndex: number) => void;
};

export function Landing({ onEnterPlay }: LandingProps) {
  const [doorIndex, setDoorIndex] = useState(2);
  const [formMsg, setFormMsg] = useState('');
  const door = doors[doorIndex];
  const prev = doors[(doorIndex - 1 + doors.length) % doors.length];
  const next = doors[(doorIndex + 1) % doors.length];

  useEffect(() => {
    document.documentElement.classList.add('on-landing');
    document.body.classList.add('on-landing');
    return () => {
      document.documentElement.classList.remove('on-landing');
      document.body.classList.remove('on-landing');
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setDoorIndex((i) => (i - 1 + doors.length) % doors.length);
      if (e.key === 'ArrowRight') setDoorIndex((i) => (i + 1) % doors.length);
      if (e.key === 'Enter' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        onEnterPlay(doorIndex);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doorIndex, onEnterPlay]);

  function prevDoor() {
    setDoorIndex((i) => (i - 1 + doors.length) % doors.length);
  }
  function nextDoor() {
    setDoorIndex((i) => (i + 1) % doors.length);
  }

  function onInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    const list: string[] = JSON.parse(localStorage.getItem('orbiroom-waitlist') || '[]');
    if (typeof email === 'string' && email && !list.includes(email)) list.push(email);
    localStorage.setItem('orbiroom-waitlist', JSON.stringify(list));
    setFormMsg('남겨둘게요. 첫 관측 때 소식 드릴게요.');
    e.currentTarget.reset();
  }

  return (
    <div className="orbi-landing">
      <section className="stage stage-room" id="top">
        <img className="stage-bg" src="/landing/concept-hero.png" alt="" />
        <div className="stage-veil" />
        <header className="topbar">
          <span className="logo">
            <i className="mark" aria-hidden="true" />
            Orbiroom
          </span>
          <button type="button" className="linkish" onClick={() => onEnterPlay(doorIndex)}>
            관측실 바로 들어가기
          </button>
        </header>
        <div className="stage-center">
          <p className="wordmark">Orbiroom</p>
          <h1>
            방에 들어오면
            <br />
            이야기가 자리로 나뉩니다
          </h1>
          <p className="stage-sub">진단하지 않습니다. 판정하지 않습니다.</p>
          <button type="button" className="btn" onClick={() => onEnterPlay(doorIndex)}>
            문고리를 잡다
          </button>
        </div>
        <p className="stage-hint">
          <span />
          아래로 내리면 방 안이 보입니다
        </p>
      </section>

      <section className="stage stage-desk" id="desk">
        <div className="desk-copy">
          <p className="eyebrow">책상 위</p>
          <h2>
            진단 도구가 아니라
            <br />
            관측을 돕는 물건들
          </h2>
          <p className="lead">하룻밤은 세 번만 움직이면 됩니다. 말하고, 남기고, 봉인합니다.</p>
        </div>
        <div className="desk-row">
          <figure>
            <span className="desk-num">01</span>
            <img src="/landing/concept-chat.png" alt="" />
            <figcaption>
              <b>열린 노트북</b>
              <span>말하면 갈라집니다 · 말하다</span>
            </figcaption>
          </figure>
          <figure>
            <span className="desk-num">02</span>
            <img src="/landing/door-archetype.png" alt="" />
            <figcaption>
              <b>일곱 개의 입구</b>
              <span>고르는 순간 관측이 시작됩니다</span>
            </figcaption>
          </figure>
          <figure>
            <span className="desk-num">03</span>
            <img src="/landing/concept-letter.png" alt="" />
            <figcaption>
              <b>도착한 편지</b>
              <span>궤도가 글로 돌아옵니다 · 봉인하다</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="stage stage-hall" id="doors">
        <img className="hall-mist" src="/landing/landing-atmosphere.png" alt="" />
        <div className="hall-copy">
          <p className="eyebrow">복도</p>
          <h2>오늘은 어느 문으로?</h2>
          <p className="lead">일곱 문이 나란히 있지 않습니다. 지금 가까운 하나만 앞에 둡니다.</p>
        </div>

        <p className="portal-count">
          {doorIndex + 1}
          <span> / {doors.length}</span>
        </p>

        <div className="portal">
          <button type="button" className="portal-nav" onClick={prevDoor} aria-label="이전 문">
            ←
          </button>

          <div className="portal-stage">
            <button type="button" className="portal-peek left" onClick={prevDoor} aria-label={prev.title}>
              <img src={prev.src} alt="" />
            </button>

            <div className="portal-frame" key={door.title}>
              <img src={door.src} alt="" />
              <div className="portal-meta">
                <strong>{door.title}</strong>
                <span>{door.desc}</span>
                <em>{door.note}</em>
              </div>
            </div>

            <button type="button" className="portal-peek right" onClick={nextDoor} aria-label={next.title}>
              <img src={next.src} alt="" />
            </button>
          </div>

          <button type="button" className="portal-nav" onClick={nextDoor} aria-label="다음 문">
            →
          </button>
        </div>

        <div className="portal-dots" role="tablist" aria-label="문 선택">
          {doors.map((d, i) => (
            <button
              key={d.title}
              type="button"
              className={i === doorIndex ? 'is-on' : undefined}
              aria-label={d.title}
              aria-current={i === doorIndex ? 'true' : undefined}
              onClick={() => setDoorIndex(i)}
            />
          ))}
        </div>

        <p className="portal-keys">← → 로 고르고 Enter 로 들어갑니다</p>

        <button type="button" className="btn btn-wide" onClick={() => onEnterPlay(doorIndex)}>
          {door.title}을 열고 들어가기
        </button>

        <p className="whisper">결과는 진단이 아니라, 관측 후보입니다.</p>
      </section>

      <section className="stage stage-bound" id="safety">
        <p className="eyebrow">경계</p>
        <p>
          오르비룸은 치료하지 않습니다.
          <br />
          저장 전에 고칠 수 있고, 민감한 기록은 잠글 수 있습니다.
        </p>
      </section>

      <section className="stage stage-invite" id="start">
        <div className="invite-card">
          <img src="/landing/concept-report.png" alt="" />
          <div>
            <p className="eyebrow">초대</p>
            <h2>
              아직 이름 붙이지 못한
              <br />
              궤도가 있다면
            </h2>
            <button type="button" className="btn" onClick={() => onEnterPlay(doorIndex)}>
              관측실로
            </button>
            <form onSubmit={onInvite}>
              <input type="email" name="email" required placeholder="이메일 남기기" aria-label="이메일" />
              <button type="submit">보내기</button>
            </form>
            <p className="form-msg" role="status">
              {formMsg}
            </p>
          </div>
        </div>
        <footer>
          <span>© 2026 Orbiroom</span>
          <span>판정하지 않는 방</span>
        </footer>
      </section>
    </div>
  );
}
