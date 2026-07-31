import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { MENUS, RITUAL_STEPS, objectiveOf, ritualOf, type Game, type Screen } from './content';
import { readArrival, type Arrival } from './arrival';
import { nightLine } from './nightCopy';
import { useAmbientTone } from './useAmbientTone';
import { usePointerAura } from './usePointerAura';
import './play.css';
import './photo.css';
import './osGlass.css';
import './_nd-shell.css';
import './ref-rebuild.css';
import './laptop-reassembly.css';
import './laptop-workspace.css';
import './laptop-mobile.css';

/** Custom atmosphere + glass UI (no 시안 mock screenshots) */
function OsAtmo({ theme = 'cosmos' }: { theme?: 'cosmos' | 'dossier' | 'threshold' }) {
  return (
    <div className={`os-atmo os-atmo--${theme}`} aria-hidden>
      {theme === 'dossier' ? (
        <img className="os-atmo-photo" src="/os/dossier-desk.png" alt="" draggable={false} />
      ) : (
        <img className="os-atmo-photo" src="/os/cosmos-study.png" alt="" draggable={false} />
      )}
      <div className="os-atmo-wash" />
      <div className="os-atmo-rays" />
      <div className="os-atmo-stars">
        <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <div className="os-atmo-dust">
        <i /><i /><i /><i /><i /><i />
      </div>
      <div className="os-atmo-orb o1" />
      <div className="os-atmo-orb o2" />
      <div className="os-atmo-orb o3" />
      <div className="os-atmo-deskline" />
      <div className="os-atmo-grain" />
      <div className="os-atmo-vignette" />
    </div>
  );
}

function GlassApp({
  title,
  theme = 'cosmos',
  clock,
  desktop = false,
  onHome,
  children,
}: {
  title: string;
  theme?: 'cosmos' | 'dossier' | 'threshold';
  clock?: string;
  desktop?: boolean;
  onHome?: () => void;
  children: ReactNode;
}) {
  return (
    <div className={`glass-app ref-os glass-theme-${theme}${desktop ? ' is-desktop' : ' is-app'}`}>
      <OsAtmo theme={theme} />
      {desktop ? (
        <>
          <header className="nd-topbar">
            <span className="nd-topbar-brand">
              <img src="/os/mark-orb.svg" alt="" />
              Orbiroom
            </span>
            <span className="nd-topbar-center">Night Desk</span>
            <span className="nd-topbar-meta">
              <em>관측실</em>
              {clock && <time>{clock}</time>}
            </span>
          </header>
          <div className="glass-desktop">{children}</div>
        </>
      ) : (
        <div className="nd-appframe">
          <header className="nd-apptitle">
            <span className="glass-traffic" aria-hidden>
              <i className="r" />
              <i className="y" />
              <i className="g" />
            </span>
            <span className="nd-apptitle-text">{title}</span>
            <span className="nd-apptitle-meta">
              {clock && <time>{clock}</time>}
            </span>
          </header>
          <div className="nd-appshell">
            <nav className="nd-rail" aria-label="OS 탐색">
              <button type="button" className="nd-rail-home" onClick={onHome} aria-label="Night Desk 홈으로">
                <img src="/os/mark-orb.svg" alt="" />
              </button>
              <i aria-hidden />
              <span aria-hidden>AI</span>
              <span aria-hidden>AR</span>
              <span aria-hidden>RP</span>
            </nav>
            <div className="glass-body">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Full-scene plate + bottom dock (binder / printer style) */
function PlateDock({
  src,
  alt,
  kicker,
  title,
  note,
  plateStyle,
  children,
}: {
  src: string;
  alt: string;
  kicker?: string;
  title?: string;
  note?: string;
  plateStyle?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className="plate-dock">
      <div className="plate-dock-visual">
        <img className="pw-plate" src={src} alt={alt} draggable={false} style={plateStyle} />
        <div className="plate-dock-veil" aria-hidden />
      </div>
      <div className="dock-panel">
        {kicker && <p className="dock-kicker">{kicker}</p>}
        {title && <p className="dock-title">{title}</p>}
        {note && <p className="dock-note">{note}</p>}
        {children && <div className="dock-actions">{children}</div>}
      </div>
    </div>
  );
}

const MODE_CARDS = [
  { id: 'free', icon: 'chat', art: '/os/ref-mode-free.png', title: '자유롭게 정리하기', desc: '떠오르는 이야기를 나누면 AI가 감정과 생각을 나눠요' },
  { id: 'today', icon: 'note', art: '/os/ref-mode-today.png', title: '오늘의 일 기록하기', desc: '오늘 있었던 일과 남은 감정을 차분히 적어요' },
  { id: 'loop', icon: 'orbit', art: '/os/ref-mode-loop.png', title: '반복 생각 살펴보기', desc: '머릿속에서 도는 문장을 함께 들여다봐요' },
  { id: 'body', icon: 'body', art: '/os/ref-mode-body.png', title: '몸 신호 정리하기', desc: '긴장·답답함·피로 같은 몸의 반응을 남겨요' },
  { id: 'rel', icon: 'rel', art: '/os/ref-mode-relationship.png', title: '관계 속 나 돌아보기', desc: '상대가 아니라, 그 앞의 내 반응을 봐요' },
] as const;

const initial: Game = {
  screen: 'title',
  flags: { entered: false, menusDone: false, saved: false, printed: false, binderDone: false, mailed: false },
  menuIndex: 0,
  objective: '문 앞에 서 있습니다.',
};

const SCENES = {
  room: '/scenes/title.png',
  laptop: '/scenes/laptop.png',
  printer: '/scenes/printer.png',
  printer0: '/scenes/printer0.png',
  binder: '/scenes/binder.png',
  detail: '/scenes/detail.png',
  letter: '/scenes/letter.png',
  sealed: '/scenes/sealed.png',
} as const;

/** hotspot anchor + camera zoom origin, in % of the room plate */
const SPOTS = {
  laptop: { x: 31, y: 55.5, label: '열린 노트북' },
  printer: { x: 8, y: 68, label: '종이로 내리는 곳' },
  shelf: { x: 78, y: 40, label: '자리를 찾는 책장' },
  letter: { x: 52.7, y: 62.5, label: '도착한 편지' },
} as const;

type SpotId = keyof typeof SPOTS;

/** ambient layer anchors on the room plate */
const STARS = [
  [9, 7], [13, 14], [17.5, 5], [22, 10], [26.5, 17], [30.5, 6], [34.5, 13], [12, 21], [20, 23], [32.5, 21], [37, 9],
] as const;

const CITY_LIGHTS = [
  [10.5, 50], [13.5, 54.5], [17, 48], [21, 52.5], [25, 47], [28.5, 51.5], [32.5, 49], [36, 53], [15, 58], [27, 57], [23, 44],
] as const;

const DUST = [
  [24, 42], [40, 36], [56, 46], [66, 32], [48, 58], [72, 52], [60, 66], [36, 62],
] as const;

type PrintPhase = 'printing' | 'ready';
/** in-laptop app flow: launcher OS → mode select → AI chat → save preview (+ optional test/report tours) */
type AppStep = 'launcher' | 'mode' | 'chat' | 'preview' | 'testdoor' | 'testq' | 'report' | 'reportdetail';

function LaptopWorkspace({
  app, setApp, modeId, setModeId, chatDraft, setChatDraft, sendChat, pickChip, chatStep, chatLine,
  testStep, setTestStep, arrival, today, saveAndPrint,
}: {
  app: AppStep; setApp: (app: AppStep) => void; modeId: (typeof MODE_CARDS)[number]['id'];
  setModeId: (id: (typeof MODE_CARDS)[number]['id']) => void; chatDraft: string; setChatDraft: (value: string) => void;
  sendChat: (event: FormEvent<HTMLFormElement>) => void; pickChip: (line: string) => void; chatStep: number; chatLine: string;
  testStep: number; setTestStep: (step: number) => void; arrival: Arrival | null; today: string; saveAndPrint: () => void;
}) {
  const selected = MODE_CARDS.find((card) => card.id === modeId) ?? MODE_CARDS[0];
  const title = app === 'launcher' ? 'ORBIROOM / PRIVATE DESK' : app === 'chat' ? 'AI CONVERSATION' : 'OBSERVATION WORKSPACE';
  return (
    <GlassApp title={title} clock={today} onHome={() => setApp('launcher')} desktop={app === 'launcher'}>
      <div className="lb-workspace">
        <aside className="lb-side"><img src="/os/mark-orb.svg" alt="" /><b>ORBIROOM</b><span>PRIVATE DESK</span>
          <button className={app === 'launcher' ? 'on' : ''} onClick={() => setApp('launcher')}>오늘의 책상</button>
          <button className={app === 'mode' || app === 'chat' || app === 'preview' ? 'on' : ''} onClick={() => setApp('mode')}>AI 대화</button>
          <button className={app === 'testdoor' || app === 'testq' ? 'on' : ''} onClick={() => { setTestStep(0); setApp('testdoor'); }}>관측 테스트</button>
          <button className={app === 'report' || app === 'reportdetail' ? 'on' : ''} onClick={() => setApp('report')}>리포트</button>
          <small>기록은 저장 전까지<br />언제든 바꿀 수 있어요.</small>
          <div className="lb-side-folio"><span>ARCHIVE STATUS</span><b>01</b><em>이번 주 관측</em></div>
        </aside>
        <main className="lb-main">
          {app === 'launcher' && <><header className="lb-heading"><p>GOOD EVENING · {today}</p><h1>오늘, 마음에 남은 장면이 있나요?</h1><span>짧게 적고 · 차분히 정리하고 · 필요한 것만 남깁니다.</span></header><section className="lb-hero"><div><b>오늘의 첫 관측</b><h2>지금의 마음을<br />한 문장부터 시작해요.</h2><p>AI와 대화하거나 짧은 관측 테스트를 통해, 감정과 생각의 흐름을 차례로 살펴볼 수 있습니다.</p><button onClick={() => setApp('mode')}>AI 대화 시작하기 →</button></div><dl><div><dt>추천 시간</dt><dd>03 MIN</dd></div><div><dt>대화 상태</dt><dd>READY</dd></div><div><dt>기록 방식</dt><dd>PRIVATE</dd></div></dl></section><section className="lb-grid"><article><b>최근 기록</b><strong>{chatStep >= 2 ? '오늘의 관측 초안' : '아직 남긴 기록이 없어요'}</strong><p>{chatStep >= 2 ? chatLine : '첫 문장을 남기면 이곳에 대화 요약이 쌓입니다.'}</p></article><article><b>추천 관측</b><strong>{arrival?.title ?? '지금의 신호 살피기'}</strong><p>정답 없이, 가장 가까운 감각을 고르는 3분 관측입니다.</p><button onClick={() => { setTestStep(0); setApp('testdoor'); }}>관측 열기</button></article></section></>}
          {app === 'mode' && <><header className="lb-heading"><p>STEP 01 / CONVERSATION</p><h1>어떤 이야기부터<br />정리해볼까요?</h1><span>지금 가장 가까운 주제를 하나 고르면, 대화의 첫 질문을 준비합니다.</span></header><section className="lb-mode-grid">{MODE_CARDS.map((card, index) => <button className={modeId === card.id ? 'on' : ''} key={card.id} onClick={() => setModeId(card.id)}><em>0{index + 1}</em><img src={card.art} alt="" /><strong>{card.title}</strong><span>{card.desc}</span></button>)}</section><button className="lb-primary" onClick={() => setApp('chat')}>선택한 방식으로 대화 시작하기 →</button></>}
          {app === 'chat' && <section className="lb-chat"><div className="lb-thread"><header><img src={selected.art} alt="" /><div><b>{selected.title}</b><span>SESSION 01 · 저장 전 초안</span></div><em>LIVE</em></header><div className="lb-status"><span>오늘의 대화</span><span>AI 정리 준비됨</span><span>언제든 종료 가능</span></div><div className="lb-messages"><p className="ai">지금 떠오르는 장면부터 편하게 적어 주세요. 한 문장으로 시작해도 되고, 무슨 일인지 아직 정확히 설명하기 어려워도 괜찮아요. 오늘 있었던 일, 계속 되풀이되는 생각, 혹은 몸에 먼저 닿은 감각 중에서 가장 가까운 것 하나만 꺼내어 보세요.</p><p className="guide">이 대화는 답을 빨리 찾기 위한 자리가 아닙니다. AI는 적어주신 문장을 감정·생각·몸의 신호로 천천히 나누어 보고, 지금의 나에게 필요한 거리와 속도를 함께 확인할 수 있도록 곁에서 정리합니다.</p>{chatStep >= 1 && <p className="me">{chatLine}</p>}{chatStep >= 2 && <p className="ai">적어주신 문장을 다시 천천히 읽어 보았어요. 그 안에는 마음이 출렁이는 순간, 같은 생각이 되돌아오는 흐름, 그리고 몸이 먼저 알아챈 긴장이 함께 담겨 있을 수 있어요. 오른쪽 정리 노트에서 지금 남기고 싶은 신호만 골라볼까요?</p>}</div><div className="lb-chips"><button onClick={() => pickChip('생각이 너무 많아요')}>생각이 너무 많아요</button><button onClick={() => pickChip('감정만 정리해줘요')}>감정만 정리해줘요</button><button onClick={() => pickChip('몸이 먼저 알아채요')}>몸이 먼저 알아채요</button></div><form onSubmit={sendChat}><textarea value={chatDraft} onChange={(e) => setChatDraft(e.target.value)} placeholder="지금 떠오르는 이야기를 적어보세요." /><button>보내기</button></form></div><aside className="lb-summary"><b>AI 정리 노트</b><p>대화에서 발견한 현재의 신호입니다. 저장 전에 언제든 고칠 수 있어요.</p><dl><div><dt>감정</dt><dd>{chatStep >= 2 ? '출렁임 · 불안 · 외로움' : '대화를 기다리고 있어요'}</dd></div><div><dt>생각</dt><dd>같은 문장이 반복됨</dd></div><div><dt>몸의 신호</dt><dd>어깨 긴장 · 가슴 답답함</dd></div></dl>{chatStep >= 2 && <button onClick={() => setApp('preview')}>저장 미리보기 →</button>}</aside></section>}
          {(app === 'testdoor' || app === 'testq') && <section className="lb-test"><header><p>OBSERVATION TEST / 03 MIN</p><h1>{testStep ? '가장 가까운 신호를 골라보세요.' : '답을 찾기보다, 지금을 살펴봐요.'}</h1><span>정답은 없습니다. 처음 닿는 감각 하나면 충분합니다.</span></header>{testStep ? <div className="lb-test-cards">{['출렁임|작은 파도가 계속 움직여요','잔잔함|고요하지만 조금 무거워요','안개|아직 이름이 흐릿해요'].map((item, index) => { const [name, copy] = item.split('|'); return <button key={name} onClick={() => setApp('mode')}><em>0{index + 1}</em><strong>{name}</strong><span>{copy}</span></button>; })}</div> : <div className="lb-test-start"><img src={arrival?.src ?? '/os/ref-door-window.png'} alt="" /><div><b>오늘의 관측 세션</b><h2>짧은 질문 하나로<br />현재의 흐름을 확인합니다.</h2><p>선택 결과는 진단이 아니며, 원할 때만 대화로 이어집니다.</p><button onClick={() => setTestStep(1)}>관측 시작하기 →</button></div></div>}</section>}
          {(app === 'report' || app === 'reportdetail') && <section className="lb-reports"><header className="lb-heading"><p>ARCHIVE / REPORTS</p><h1>{app === 'report' ? '나를 더 깊게 읽는 리포트' : 'Inner Shield'}</h1><span>{app === 'report' ? '대화와 관측이 쌓일수록, 나의 반응 패턴을 더 또렷하게 살펴볼 수 있어요.' : '가까워지기 전, 스스로를 지키는 방식에 대한 관측 기록입니다.'}</span></header>{app === 'report' ? <div className="lb-report-list">{['Inner Shield|자기보호의 방식을 깊게 관측합니다|15–20분','Orbit Log|반복되는 생각의 흐름을 기록합니다|초안','Window Notes|관측 기록이 더 쌓이면 열립니다|잠김'].map((item, index) => { const [name, copy, state] = item.split('|'); return <button key={name} onClick={() => index === 0 && setApp('reportdetail')}><em>0{index + 1}</em><div><strong>{name}</strong><span>{copy}</span></div><i>{state}</i></button>; })}</div> : <article className="lb-report-detail"><b>현재 발견한 흐름</b><h2>거리를 두는 것은<br />나를 지키는 방식일 수 있어요.</h2><p>몸이 먼저 긴장할 때 생각은 뒤늦게 이유를 붙입니다. 지금은 그 반응을 고치려 하기보다, 어떤 순간에 시작되는지 알아차리는 것만으로 충분합니다.</p><button onClick={saveAndPrint}>이 관측을 저장하기 →</button></article>}</section>}
          {app === 'preview' && <section className="lb-preview"><header className="lb-heading"><p>DRAFT / READY TO SAVE</p><h1>오늘 밤의 관측 기록</h1><span>원문은 저장되지 않으며, 아래에서 고른 내용만 남습니다.</span></header><div><article><b>당신의 문장</b><p>“{chatLine}”</p><span>오늘 밤의 짧은 대화에서 남긴 문장입니다.</span></article><article><b>정리된 신호</b><dl><div><dt>감정</dt><dd>출렁임 · 불안</dd></div><div><dt>생각</dt><dd>반복되는 문장</dd></div><div><dt>몸</dt><dd>어깨의 긴장</dd></div></dl></article></div><button className="lb-primary" onClick={saveAndPrint}>이 내용으로 저장하기 →</button></section>}
        </main>
      </div>
    </GlassApp>
  );
}

const LAPTOP_BACK_LABEL: Record<AppStep, string> = {
  launcher: '← 방',
  mode: '← 방',
  chat: '← 방식 선택',
  preview: '← AI 대화',
  testdoor: '← 방',
  testq: '← 문',
  report: '← 방',
  reportdetail: '← 리포트',
};

export function PhotoGame() {
  const [game, setGame] = useState<Game>(initial);
  const [zoom, setZoom] = useState<SpotId | null>(null);
  const [printProgress, setPrintProgress] = useState(0);
  const [printPhase, setPrintPhase] = useState<PrintPhase>('printing');
  const [entering, setEntering] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [arrival] = useState<Arrival | null>(() => readArrival());
  const [arriveNote, setArriveNote] = useState(false);

  const [app, setApp] = useState<AppStep>('launcher');
  const [chatStep, setChatStep] = useState(0);
  const [chatLine, setChatLine] = useState('감정만 정리해줘요');
  const [chatDraft, setChatDraft] = useState('');
  const [modeId, setModeId] = useState<(typeof MODE_CARDS)[number]['id']>('free');
  const [testStep, setTestStep] = useState(0);
  const [email, setEmail] = useState('');
  const [binderView, setBinderView] = useState<'list' | 'detail'>('list');
  const [sealing, setSealing] = useState(false);
  const typingTimer = useRef(0);
  const sealTimer = useRef(0);
  const arriveTimer = useRef(0);

  const pointer = usePointerAura(true);
  useAmbientTone(soundOn && game.screen !== 'title');

  useEffect(() => {
    Object.values(SCENES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    return () => {
      window.clearTimeout(typingTimer.current);
      window.clearTimeout(sealTimer.current);
      window.clearTimeout(arriveTimer.current);
    };
  }, []);

  const setScreen = (screen: Screen, patch?: Partial<Game['flags']>) => {
    setGame((g) => {
      const flags = { ...g.flags, ...patch };
      const next = { ...g, screen, flags };
      return { ...next, objective: objectiveOf(next) };
    });
  };

  const ritual = ritualOf(game);
  const beatHint =
    ritual === 'speak'
      ? nightLine(arrival?.id, 'speak')
      : ritual === 'keep'
        ? nightLine(arrival?.id, 'keep')
        : ritual === 'seal'
          ? nightLine(arrival?.id, 'seal')
          : '확인한 기록만 남겨도 충분합니다.';

  const unlocked: Record<SpotId, boolean> = {
    laptop: game.flags.entered && ritual === 'speak',
    printer: ritual === 'keep' && game.flags.saved && !game.flags.printed,
    shelf: ritual === 'keep' && game.flags.printed && !game.flags.binderDone,
    letter: ritual === 'seal',
  };

  const glow: Record<SpotId, boolean> = {
    laptop: unlocked.laptop,
    printer: unlocked.printer,
    shelf: unlocked.shelf,
    letter: unlocked.letter,
  };

  const startPathForTonight = (): AppStep => {
    const path = arrival?.path ?? 'chat';
    if (path === 'test') return 'testdoor';
    if (path === 'report') return 'report';
    return 'mode';
  };

  const resetLaptopApp = () => {
    setChatStep(0);
    setChatLine('감정만 정리해줘요');
    setChatDraft('');
    setTestStep(0);
    // 노트북은 항상 OS 홈부터 시작하고, 사용자가 앱을 고릅니다.
    setApp('launcher');
  };

  /** camera ride into the object, then reveal the closeup */
  const goTo = (id: SpotId) => {
    if (zoom) return;
    setZoom(id);
    if (id === 'shelf') setBinderView('list');
    if (id === 'laptop') {
      setGame((g) => {
        const flags = { ...g.flags, menusDone: true };
        const next = { ...g, flags, menuIndex: MENUS.length };
        return { ...next, objective: objectiveOf(next) };
      });
      resetLaptopApp();
    }
    if (id === 'letter') setSealing(false);
    window.setTimeout(() => {
      setScreen(id === 'shelf' ? 'binder' : id);
    }, 760);
  };

  const backToRoom = (patch?: Partial<Game['flags']>) => {
    setScreen('room', patch);
    setZoom(null);
  };

  useEffect(() => {
    if (game.screen !== 'printer') return;
    setPrintPhase('printing');
    setPrintProgress(0);
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 3200);
      setPrintProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setPrintPhase('ready');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [game.screen]);

  const enter = () => {
    if (entering) return;
    setEntering(true);
    setSoundOn(true);
    window.setTimeout(() => {
      setScreen('room', { entered: true });
      setEntering(false);
      setArriveNote(true);
      window.clearTimeout(arriveTimer.current);
      arriveTimer.current = window.setTimeout(() => setArriveNote(false), 4200);
    }, 900);
  };

  const pickChip = (line: string) => {
    const exampleLines: Record<string, string> = {
      '생각이 너무 많아요': '직장 상사에게 들은 말이 계속 마음에 남아요. 내가 너무 예민하게 받아들인 건지, 오늘 하루 종일 그 장면을 곱씹고 있어요.',
      '감정만 정리해줘요': '친한 사람에게 서운한 일이 있었는데, 말을 꺼내면 관계가 어색해질까 봐 아무렇지 않은 척했어요. 그런데 집에 오니 더 답답해요.',
      '몸이 먼저 알아채요': '해야 할 일이 많은데 시작하지 못하고 있어요. 가슴은 답답하고 어깨가 굳어 있는데, 무엇부터 해야 할지 모르겠어요.',
    };
    setChatLine(exampleLines[line] ?? line);
    setChatDraft('');
    setChatStep(1);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => setChatStep(2), 1500);
  };

  const sendChat = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const line = chatDraft.trim();
    if (!line || chatStep === 1) return;
    pickChip(line);
  };

  const saveAndPrint = () => {
    setZoom('printer');
    setScreen('printer', { saved: true });
  };

  const backFromLaptop = () => {
    if (app === 'launcher') backToRoom();
    else if (app === 'chat') setApp('mode');
    else if (app === 'preview') setApp('chat');
    else if (app === 'testq') setApp('testdoor');
    else if (app === 'reportdetail') setApp('report');
    else if (app === 'mode' || app === 'testdoor' || app === 'report') {
      // 의식 중엔 투어 런처 대신 방으로
      if (ritual === 'speak') backToRoom();
      else setApp('launcher');
    } else resetLaptopApp();
  };

  /** brand click: back to the very first screen */
  const resetToTitle = () => {
    window.clearTimeout(typingTimer.current);
    window.clearTimeout(sealTimer.current);
    setGame(initial);
    setZoom(null);
    setEmail('');
    setPrintPhase('printing');
    setPrintProgress(0);
    setEntering(false);
    resetLaptopApp();
    setBinderView('list');
    setSealing(false);
  };

  const mail = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || sealing) return;
    setSealing(true);
    window.clearTimeout(sealTimer.current);
    sealTimer.current = window.setTimeout(() => {
      setScreen('clear', { mailed: true });
      setZoom(null);
      setSealing(false);
    }, 2400);
  };

  const inWorld = game.screen !== 'title';
  const origin = zoom ? `${SPOTS[zoom].x}% ${SPOTS[zoom].y}%` : '50% 50%';
  const scale = zoom ? 2.5 : 1.06;
  const parX = pointer.nx * (zoom ? 4 : 14);
  const parY = pointer.ny * (zoom ? 3 : 9);
  const now = new Date();
  const today = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}`;
  const plateDrift = {
    transform: `translate(${pointer.nx * -6}px, ${pointer.ny * -4}px) scale(1.03)`,
  };

  return (
    <div
      className={`play ${entering ? 'is-entering' : ''}`}
      data-screen={game.screen}
      style={{ '--px': String(pointer.nx), '--py': String(pointer.ny) } as CSSProperties}
    >
      <div className="film-grain" aria-hidden />
      <div
        className={`pointer-aura ${pointer.active ? 'on' : ''}`}
        aria-hidden
        style={{ transform: `translate(${pointer.x}px, ${pointer.y}px)` }}
      />

      <header className="play-hud">
        <button type="button" className="play-brand" onClick={resetToTitle} aria-label="처음 화면으로 돌아가기">
          <span className="logo-mark" aria-hidden />
          <div>
            <strong>Orbiroom</strong>
            <span>오르비룸</span>
          </div>
        </button>
        <button
          type="button"
          className={`sound-chip ${soundOn ? 'on' : ''}`}
          aria-pressed={soundOn}
          onClick={() => setSoundOn((v) => !v)}
        >
          {soundOn ? '사운드 켜짐' : '사운드'}
        </button>
      </header>

      {/* ================= threshold / title ================= */}
      {game.screen === 'title' && (
        <section className={`play-title${arrival ? ' has-arrival' : ''}`}>
          <div
            className="title-space"
            style={{ transform: `translate(${pointer.nx * -18}px, ${pointer.ny * -12}px)` }}
          >
            {arrival ? (
              <div className={`title-portal ${entering ? 'open' : ''}`}>
                <div className="title-door-stage" aria-hidden>
                  <i className="title-mote" /><i className="title-mote" /><i className="title-mote" />
                  <i className="title-mote" /><i className="title-mote" /><i className="title-mote" />
                  <div className="title-floor-glow" />
                </div>
                <div className="title-door-unit">
                  <div className="title-door-face">
                    <img src={arrival.src} alt="" draggable={false} />
                    <div className="title-door-sheen" aria-hidden />
                    <div className="title-door-rays" aria-hidden />
                  </div>
                  <img className="title-door-frame" src="/os/door-frame.svg" alt="" draggable={false} />
                  <div className="title-door-light" aria-hidden />
                </div>
                <div className="title-portal-glow" aria-hidden />
              </div>
            ) : (
              <div className={`title-door ${entering ? 'open' : ''}`} aria-hidden>
                <div className="arch" />
                <div className="orb" />
                <div className="ring" />
                <div className="door-glow" />
              </div>
            )}
          </div>
          <p className="title-kicker">{arrival ? 'THRESHOLD' : 'INNER OBSERVATORY'}</p>
          <h1>
            {arrival ? (
              <>
                {arrival.title}이
                <br />
                열려 있습니다
              </>
            ) : (
              '아직 이름 붙이지 못한 감정'
            )}
          </h1>
          <p className="title-sub">
            {arrival
              ? `${arrival.desc}. 문턱 너머에는 말하다 · 남기다 · 봉인하다, 세 번의 움직임만 기다립니다.`
              : '본능처럼 끌리는 쪽으로 — 문을 열고 관측실에 들어가세요.'}
          </p>
          <button type="button" className="btn" onClick={enter} disabled={entering}>
            {entering ? '안으로…' : arrival ? '문턱을 넘다' : '문을 열고 들어가기'}
          </button>
        </section>
      )}

      {/* ================= room world: plate + living layers ================= */}
      {inWorld && (
        <div className="pw-world" aria-hidden={game.screen !== 'room'}>
          <div className="pw-stage">
            <div
              className={`pw-cam ${zoom ? 'zoomed' : ''}`}
              style={{
                transformOrigin: origin,
                transform: `translate(${parX}px, ${parY}px) scale(${scale})`,
              }}
            >
              <img className="pw-plate kenburns" src={SCENES.room} alt="오르비룸 관측실" draggable={false} />

              {/* living ambient layers anchored to the plate */}
              <div className="amb" aria-hidden>
                <i className="amb-moon" style={{ left: '20.8%', top: '12.5%' }} />
                {STARS.map(([x, y], i) => (
                  <i
                    key={`s${i}`}
                    className="amb-star"
                    style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i % 5) * 0.7}s` }}
                  />
                ))}
                {CITY_LIGHTS.map(([x, y], i) => (
                  <i
                    key={`c${i}`}
                    className="amb-city"
                    style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i % 7) * 0.9}s` }}
                  />
                ))}
                <i className="amb-lamp" style={{ left: '43.3%', top: '43.5%' }} />
                <i className="amb-screenglow" style={{ left: '31%', top: '55.5%' }} />
                <i className="amb-boxglow" style={{ left: '55%', top: '52.5%' }} />
                {DUST.map(([x, y], i) => (
                  <i
                    key={`d${i}`}
                    className="amb-dust"
                    style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.8}s`, animationDuration: `${5 + (i % 4)}s` }}
                  />
                ))}
              </div>

              <div className="pw-shade" />

              {game.screen === 'room' &&
                !zoom &&
                (Object.keys(SPOTS) as SpotId[]).map((id, idx) =>
                  glow[id] && unlocked[id] ? (
                    <button
                      key={id}
                      type="button"
                      className="pw-hotspot is-live"
                      style={{
                        left: `${SPOTS[id].x}%`,
                        top: `${SPOTS[id].y}%`,
                        ['--delay' as string]: `${idx * 0.12}s`,
                      }}
                      onClick={() => goTo(id)}
                    >
                      <i className="pw-ring" aria-hidden />
                      <span>{SPOTS[id].label}</span>
                      <b className="pw-beat">
                        {id === 'laptop' ? '① 말하다' : id === 'letter' ? '③ 봉인하다' : '② 남기다'}
                      </b>
                    </button>
                  ) : null,
                )}
            </div>
          </div>
        </div>
      )}

      {game.screen === 'room' && arriveNote && (
        <div className="arrive-toast" role="status">
          <img src={arrival?.src ?? '/landing/door-window.png'} alt="" />
          <div>
            <em>{arrival?.title ?? '관측실'}</em>
            <strong>{nightLine(arrival?.id, 'enter')}</strong>
          </div>
        </div>
      )}

      {game.screen === 'room' && !zoom && (
        <footer className="ritual-hud">
          <div className="ritual-track" aria-label="하룻밤 관측 진행">
            {RITUAL_STEPS.map((step, i) => {
              const done =
                (step.id === 'speak' && game.flags.saved) ||
                (step.id === 'keep' && game.flags.binderDone) ||
                (step.id === 'seal' && game.flags.mailed);
              const current = ritual === step.id;
              return (
                <div key={step.id} className={`ritual-step${done ? ' done' : ''}${current ? ' current' : ''}`}>
                  <i data-n={i + 1} />
                  <div>
                    <strong>{step.label}</strong>
                    <span>{step.hint}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="ritual-line">
            <em>{arrival ? arrival.title : '관측실'}</em>
            {beatHint}
          </p>
        </footer>
      )}

      {/* ================= laptop: plate frame + everything on its screen ================= */}
      {game.screen === 'laptop' && (
        <section className="pw-scene" role="dialog" aria-label="노트북">
          <div className="pw-stage">
            <img className="pw-plate" src={SCENES.laptop} alt="" draggable={false} />

            {/* realistic LCD nest + OS */}
            <div className="lap-screen">
              <div className="lap-bezel" aria-hidden />
              <div className="lap-webcam" aria-hidden>
                <i />
              </div>
              <div className="lap-lcd">
                <div className="lap-lcd-panel">
                  <LaptopWorkspace app={app} setApp={setApp} modeId={modeId} setModeId={setModeId} chatDraft={chatDraft} setChatDraft={setChatDraft} sendChat={sendChat} pickChip={pickChip} chatStep={chatStep} chatLine={chatLine} testStep={testStep} setTestStep={setTestStep} arrival={arrival} today={today} saveAndPrint={saveAndPrint} />
                  {false && app === 'launcher' && (
                    <GlassApp title="Orbiroom · Night Desk" clock={today} desktop>
                      <div className="nd-desk">
                        <aside className="nd-launcher-nav" aria-label="Orbiroom 앱">
                          <div className="nd-launcher-mark">
                            <img src="/os/mark-orb.svg" alt="" draggable={false} />
                            <span>Orbiroom</span>
                          </div>
                          <button type="button" className="is-current" onClick={() => setApp('mode')}>
                            <img src="/os/ref-mode-free.png" alt="" draggable={false} />
                            <span>AI 대화</span>
                          </button>
                          <button type="button" onClick={() => { setTestStep(0); setApp('testdoor'); }}>
                            <img src="/os/ref-door-window.png" alt="" draggable={false} />
                            <span>관측 테스트</span>
                          </button>
                          <button type="button" onClick={() => setApp('report')}>
                            <img src="/os/dock-report.svg" alt="" draggable={false} />
                            <span>리포트</span>
                          </button>
                          <div className="nd-launcher-nav-spacer" />
                          <button type="button" className="nd-launcher-settings" aria-label="설정">
                            <span aria-hidden>⌘</span>
                            <small>설정</small>
                          </button>
                        </aside>
                        <main className="nd-launcher">
                          <section className="nd-observe-card">
                            <img className="nd-observe-orb" src="/os/ref-launch-orb.png" alt="" draggable={false} />
                            <span className="nd-observe-star" aria-hidden>✦</span>
                            <div className="nd-observe-meta">
                              <span>PRIVATE OBSERVATION</span>
                              <time>{today}</time>
                            </div>
                            <h1>오늘의 관측</h1>
                            <p>지금의 감정이나 생각을 부드럽게 기록해 보세요.</p>
                            <button type="button" onClick={() => setApp(startPathForTonight())}>
                              <span>AI 대화 시작</span><i aria-hidden>→</i>
                            </button>
                            <div className="nd-observe-foot">
                              <span><i aria-hidden>◌</i> 대화는 언제든 수정할 수 있어요</span>
                              <span><i aria-hidden>⌁</i> 기록은 선택해서 남겨요</span>
                            </div>
                            <div className="nd-observe-stats">
                              <span><b>01</b><em>오늘의 대화</em></span>
                              <span><b>03 MIN</b><em>추천 시간</em></span>
                              <span><b>PRIVATE</b><em>개인 기록</em></span>
                            </div>
                          </section>
                          <section className="nd-launcher-bottom">
                            <article>
                              <header><span>◷</span> 최근 관측지 <i>›</i></header>
                              {chatStep >= 2 ? (
                                <button type="button" className="nd-launcher-record" onClick={() => setApp('preview')}>
                                  <img src="/os/ref-mode-free.png" alt="" draggable={false} />
                                  <span><strong>{arrival?.title ?? '관측실'}의 기록</strong><em>{chatLine}</em></span>
                                </button>
                              ) : (
                                <div className="nd-launcher-empty">
                                  <img src="/os/ref-mode-free.png" alt="" draggable={false} />
                                  <p>아직 남긴 관측이 없습니다.<br />첫 문장부터 시작해 보세요.</p>
                                </div>
                              )}
                            </article>
                            <article>
                              <header><span>✧</span> 추천 관측 <i>›</i></header>
                              <button type="button" className="nd-launcher-recommend" onClick={() => { setTestStep(0); setApp('testdoor'); }}>
                                <img src="/os/ref-door-window.png" alt="" draggable={false} />
                                <span><strong>{arrival?.title ?? '창의 문'}</strong><em>{arrival?.desc ?? '감정의 흐름'} · 약 3분</em></span>
                              </button>
                            </article>
                          </section>
                        </main>
                      </div>
                    </GlassApp>
                  )}

              {false && app === 'mode' && (
                <GlassApp title="AI 대화 · 방식 고르기" clock={today} onHome={() => setApp('launcher')}>
                  <div className="nd-mode">
                    <header className="nd-mode-head">
                      <div className="nd-mode-overline">
                        <p className="nd-kicker light">Speak</p>
                        <span>05 PATHS</span>
                      </div>
                      <h2>오늘은 무엇을 정리해볼까요?</h2>
                      <p>가장 가까운 주제 하나만 골라도 충분합니다.</p>
                    </header>
                    <div className="nd-mode-list" role="listbox" aria-label="정리 방식">
                      {MODE_CARDS.map((card) => (
                        <button
                          key={card.id}
                          type="button"
                          role="option"
                          aria-selected={modeId === card.id}
                          className={`nd-mode-row${modeId === card.id ? ' is-on' : ''}`}
                          onClick={() => setModeId(card.id)}
                        >
                          <img src={card.art} alt="" draggable={false} />
                          <span className="nd-mode-copy">
                            <strong>{card.title}</strong>
                            <em>{card.desc}</em>
                          </span>
                          <i className="nd-mode-check" aria-hidden />
                        </button>
                      ))}
                    </div>
                    <footer className="nd-mode-foot">
                      <button type="button" className="nd-primary" onClick={() => setApp('chat')}>
                        선택한 방식으로 시작하기
                      </button>
                    </footer>
                  </div>
                </GlassApp>
              )}

              {false && app === 'chat' && (
                <GlassApp title="AI 대화" clock={today} onHome={() => setApp('launcher')}>
                  <div className="nd-chat">
                    <section className="nd-thread-pane">
                      <header className="nd-pane-head">
                        <img src={MODE_CARDS.find((c) => c.id === modeId)?.art ?? '/os/mode-chat.svg'} alt="" />
                        <div>
                          <strong>{MODE_CARDS.find((c) => c.id === modeId)?.title ?? '자유롭게 정리하기'}</strong>
                          <em>오늘의 관측 · 언제든 수정하거나 그만둘 수 있어요</em>
                        </div>
                        <span className="nd-pane-status">LIVE</span>
                      </header>
                      <div className="nd-chat-context">
                        <span><b>SESSION 01</b> 오늘 밤의 첫 기록</span>
                        <span><b>기록 방식</b> 말로 천천히 정리하기</span>
                        <span><b>저장 상태</b> 아직 저장되지 않음</span>
                      </div>
                      <div className="nd-chat-date">오늘 밤 · {today}</div>
                      <div className="g-thread nd-message-thread">
                        <div className="nd-message nd-message-ai">
                          <img src="/os/mark-orb.svg" alt="" />
                          <div className="nd-message-content">
                            <span>Orbiroom</span>
                            <p>지금 떠오르는 이야기를 편하게 적어 주세요. 한 문장이어도 괜찮아요. 오늘 있었던 장면, 머릿속에 남은 문장, 몸의 감각 중 어디서 시작해도 됩니다.</p>
                          </div>
                        </div>
                        <div className="nd-message nd-message-guide">
                          <span aria-hidden>✦</span>
                          <p>급하게 결론내리지 않아도 돼요. 적은 내용은 오른쪽에서 감정·생각·몸의 신호로 나누어 확인할 수 있습니다.</p>
                        </div>
                        <div className="nd-message nd-message-ai">
                          <img src="/os/mark-orb.svg" alt="" />
                          <div className="nd-message-content">
                            <span>Orbiroom · 시작 질문</span>
                            <p>지금 가장 먼저 말을 걸고 싶은 건 어떤 장면인가요?</p>
                          </div>
                        </div>
                        <div className="nd-chat-note">
                          <b>대화 안내</b>
                          <span>문장이 길어져도 괜찮습니다. AI는 답을 단정하지 않고, 지금의 감정·생각·몸 신호를 구분해 볼 수 있도록 도와드려요.</span>
                        </div>
                        {chatStep >= 1 && <div className="g-bubble me">{chatLine}</div>}
                        {chatStep === 1 && (
                          <div className="nd-message nd-message-ai nd-message-thinking" aria-live="polite">
                            <img src="/os/mark-orb.svg" alt="" />
                            <div className="nd-message-content">
                              <span>Orbiroom</span>
                              <p>문장을 천천히 들여다보고 있어요
                              <i className="dock-typing">
                              <i />
                              <i />
                              <i />
                              </i></p>
                            </div>
                          </div>
                        )}
                        {chatStep >= 2 && (
                          <div className="nd-message nd-message-ai">
                            <img src="/os/mark-orb.svg" alt="" />
                            <div className="nd-message-content">
                              <span>Orbiroom</span>
                              <p>정리 후보를 만들었어요. 오른쪽에서 남길 항목만 확인해 주세요.</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="nd-prompt-row" aria-label="빠른 대화 시작">
                        <button type="button" onClick={() => pickChip('감정만 정리해줘요')}>감정만 정리해줘요</button>
                        <button type="button" onClick={() => pickChip('생각이 너무 많아요')}>생각이 너무 많아요</button>
                        <button type="button" onClick={() => pickChip('몸이 먼저 알아채요')}>몸이 먼저 알아채요</button>
                      </div>
                      <form className="nd-composer" onSubmit={sendChat}>
                        <textarea
                          value={chatDraft}
                          onChange={(e) => setChatDraft(e.target.value)}
                          placeholder="지금 떠오르는 이야기를 적어보세요."
                          aria-label="AI에게 보낼 메시지"
                          rows={1}
                        />
                        <button type="submit" aria-label="메시지 보내기" disabled={!chatDraft.trim() || chatStep === 1}>
                          <span aria-hidden>↑</span>
                        </button>
                      </form>
                      <p className="nd-composer-note">민감한 기록은 잠그거나 저장하지 않을 수 있어요.</p>
                    </section>
                    <aside className="nd-insight-pane">
                      <header className="nd-pane-head">
                        <img src="/os/mark-orb.svg" alt="" />
                        <div>
                          <strong>AI 정리 후보</strong>
                          <em>저장 전에 고칠 수 있어요</em>
                        </div>
                        <span className="nd-pane-status is-muted">04 ITEMS</span>
                      </header>
                      <div className="g-cands">
                        <div className="g-cand">
                          <em>감정</em>
                          <p>{chatStep >= 2 ? '출렁임 · 불안 · 외로움' : '대화 후 정리됩니다'}</p>
                        </div>
                        <div className="g-cand">
                          <em>생각</em>
                          <p>{chatStep >= 2 ? '같은 문장이 한 바퀴 더 돕니다' : '대화 후 정리됩니다'}</p>
                        </div>
                        <div className="g-cand">
                          <em>몸 신호</em>
                          <p>가슴 답답함 · 어깨 긴장</p>
                        </div>
                        <div className="g-cand">
                          <em>자기보호</em>
                          <p>거리를 먼저 두는 편</p>
                        </div>
                      </div>
                      {chatStep >= 2 && (
                        <button type="button" className="nd-primary wide" onClick={() => setApp('preview')}>
                          저장 미리보기
                        </button>
                      )}
                    </aside>
                  </div>
                </GlassApp>
              )}

              {false && app === 'preview' && (
                <GlassApp title="문서 보관함 · 저장 미리보기" clock={today} onHome={() => setApp('launcher')}>
                  <div className="nd-document">
                    <header className="nd-document-head">
                      <div>
                        <p className="nd-kicker light">Draft / 01</p>
                        <h2>오늘 밤의 관측 기록</h2>
                        <p>{arrival?.title ?? '관측실'} · 저장 전 마지막 확인</p>
                      </div>
                      <img src="/os/dock-report.svg" alt="" draggable={false} />
                    </header>
                    <div className="nd-document-pages">
                      <article className="nd-paper nd-paper-source">
                        <span className="nd-paper-label">SOURCE NOTE</span>
                        <p className="nd-source-quote">“{chatLine}”</p>
                        <p className="nd-paper-note">오늘 밤 {arrival?.title ?? '관측실'}에서 남긴 짧은 관측입니다. 이 문장은 종이에 그대로 남지 않고, 아래에서 고른 내용만 기록됩니다.</p>
                      </article>
                      <article className="nd-paper nd-paper-summary">
                        <span className="nd-paper-label">SELECTED SIGNALS</span>
                        <div className="nd-signal-list">
                          <div><em>01</em><span>감정</span><strong>출렁임 · 불안</strong><i>선택됨</i></div>
                          <div><em>02</em><span>생각</span><strong>반복되는 문장</strong><i>선택됨</i></div>
                          <div><em>03</em><span>몸</span><strong>어깨 긴장</strong><i>선택됨</i></div>
                          <div><em>04</em><span>보호</span><strong>거리 두기</strong><i>선택됨</i></div>
                        </div>
                      </article>
                    </div>
                    <div className="g-preview-actions">
                      <button type="button" className="nd-secondary on-light" onClick={() => setApp('chat')}>
                        수정하기
                      </button>
                      <button type="button" className="nd-primary" onClick={saveAndPrint}>
                        이 내용으로 저장하기
                      </button>
                    </div>
                  </div>
                </GlassApp>
              )}

              {false && app === 'testdoor' && (
                <GlassApp theme="threshold" title="아카이브 · 관측 테스트" clock={today} onHome={() => setApp('launcher')}>
                  <div className="ot-intro">
                    <header className="ot-bar">
                      <span>OBSERVATION / 01</span>
                      <span>짧은 현재 감각 기록</span>
                    </header>
                    <section className="ot-intro-main">
                      <div className="ot-orbit" aria-hidden>
                        <i /><i /><b>01</b>
                      </div>
                      <div className="ot-intro-copy">
                        <p className="nd-kicker">오늘의 관측</p>
                        <h2>{arrival?.title ?? '지금의 나를 관측하기'}</h2>
                        <p>{arrival?.desc ?? '말로 꺼내기 전의 신호'}를 따라, 지금 가장 가까운 감각을 살펴봅니다.</p>
                        <ol className="ot-steps">
                          <li><b>01</b><span>지금의 신호를 고릅니다</span></li>
                          <li><b>02</b><span>짧은 문장으로 이어갑니다</span></li>
                          <li><b>03</b><span>원할 때만 기록으로 남깁니다</span></li>
                        </ol>
                        <button type="button" className="nd-primary" onClick={() => setApp('testq')}>
                          관측 시작하기 <span aria-hidden>→</span>
                        </button>
                      </div>
                    </section>
                    <aside className="ot-session">
                      <div className="ot-session-image">
                        <img src={arrival?.src ?? '/os/ref-door-window.png'} alt="" draggable={false} />
                      </div>
                      <p>SESSION NOTE</p>
                      <strong>정답을 찾는 테스트가 아닙니다.</strong>
                      <span>가까운 쪽을 고르거나, 건너뛰어도 괜찮아요.</span>
                      <dl>
                        <div><dt>소요 시간</dt><dd>약 3분</dd></div>
                        <div><dt>기록 방식</dt><dd>선택 사항</dd></div>
                      </dl>
                    </aside>
                  </div>
                </GlassApp>
              )}

              {false && app === 'testq' && (
                <GlassApp theme="threshold" title="아카이브 · 01/01" clock={today} onHome={() => setApp('launcher')}>
                  <div className="ot-flow">
                    <header className="ot-flow-head">
                      <div><span>관측 중</span><strong>01</strong><em>/ 01</em></div>
                      <p>오늘의 신호를 한 번만 살펴봅니다</p>
                      <i aria-hidden><b /></i>
                    </header>
                    {testStep === 0 ? (
                      <section className="ot-question">
                        <div className="ot-question-copy">
                          <p className="nd-kicker">CURRENT SIGNAL</p>
                          <h2>지금 느낌에<br />가까운 결은 무엇인가요?</h2>
                          <p>정확한 이름이 아니어도 됩니다. 오래 머물지 말고, 처음 닿는 쪽을 골라보세요.</p>
                        </div>
                        <div className="ot-answer-grid">
                        <button type="button" onClick={() => setTestStep(1)}>
                          <em><i />01</em>
                          <strong>출렁임</strong>
                          <span>작은 파도가 안쪽에서<br />계속 움직이고 있어요</span>
                        </button>
                        <button type="button" onClick={() => setTestStep(1)}>
                          <em><i />02</em>
                          <strong>잔잔함</strong>
                          <span>고요하지만 조금 무겁게<br />가라앉아 있어요</span>
                        </button>
                        <button type="button" onClick={() => setTestStep(1)}>
                          <em><i />03</em>
                          <strong>안개</strong>
                          <span>아직 이름을 붙이기엔<br />흐릿하게 느껴져요</span>
                        </button>
                        </div>
                        <button type="button" className="ot-skip" onClick={() => setTestStep(1)}>지금은 고르지 않고 넘어갈게요</button>
                      </section>
                    ) : (
                      <section className="ot-complete">
                        <span aria-hidden>✓</span>
                        <p className="nd-kicker">OBSERVATION SAVED</p>
                        <h2>잠깐, 잘 들여다보았어요.</h2>
                        <p>지금 느껴지는 것을 말로 조금 더 남길 수도 있고, 여기서 멈춰도 괜찮습니다.</p>
                        <div>
                          <button type="button" className="nd-primary" onClick={() => setApp('mode')}>말로 이어서 남기기 <span aria-hidden>→</span></button>
                          <button type="button" className="nd-secondary" onClick={() => setApp('launcher')}>오늘은 여기까지</button>
                        </div>
                      </section>
                    )}
                  </div>
                </GlassApp>
              )}

              {false && app === 'report' && (
                <GlassApp theme="dossier" title="파일 보관함 · 리포트" clock={today} onHome={() => setApp('launcher')}>
                  <div className="nd-files">
                    <header className="nd-files-head">
                      <div>
                        <p className="nd-kicker">Archive / Reports</p>
                        <h2>나를 더 깊게 관측하는 리포트</h2>
                      </div>
                      <span>3 FILES</span>
                    </header>
                    <div className="nd-report-feature">
                      <img src="/os/ref-inner-shield.png" alt="Inner Shield 리포트 미리보기" draggable={false} />
                      <div>
                        <span>RECOMMENDED FILE</span>
                        <strong>Inner Shield</strong>
                        <p>자기보호 방식을 관측하는 정밀 리포트</p>
                      </div>
                    </div>
                    <div className="nd-file-list">
                      <button type="button" className="nd-file-row is-featured" onClick={() => setApp('reportdetail')}>
                        <img src="/os/dock-report.svg" alt="" draggable={false} />
                        <span><em>RECOMMENDED</em><strong>Inner Shield</strong><small>자기보호의 방식을 깊게 관측합니다 · 15–20분</small></span>
                        <i>열기</i>
                      </button>
                      <button type="button" className="nd-file-row">
                        <img src="/os/mode-orbit.svg" alt="" draggable={false} />
                        <span><em>DRAFT</em><strong>Orbit Log</strong><small>반복되는 생각의 흐름을 기록합니다</small></span>
                        <i>초안</i>
                      </button>
                      <button type="button" className="nd-file-row is-locked">
                        <img src="/os/mode-note.svg" alt="" draggable={false} />
                        <span><em>LOCKED</em><strong>Window Notes</strong><small>관측 기록이 더 쌓이면 열립니다</small></span>
                        <i>잠김</i>
                      </button>
                    </div>
                  </div>
                </GlassApp>
              )}

              {false && app === 'reportdetail' && (
                <GlassApp theme="dossier" title="리포트 상세" clock={today} onHome={() => setApp('launcher')}>
                  <div className="g-detail">
                    <div className="glass-panel g-detail-card">
                      <h2>Inner Shield</h2>
                      <p className="lead">
                        {arrival?.title
                          ? `${arrival?.title}으로 들어온 밤의 자기보호 결을 짧게 적어둡니다.`
                          : '자기보호의 결을 짧게 적어둡니다.'}
                      </p>
                      <ul>
                        <li>
                          <em>거리</em>
                          <p>가까워지기 전에 커튼을 한 겹 칩니다. 그게 틀린 건 아닙니다.</p>
                        </li>
                        <li>
                          <em>신호</em>
                          <p>몸이 먼저 긴장할 때, 생각은 뒤늦게 이유를 붙입니다.</p>
                        </li>
                        <li>
                          <em>남겨두기</em>
                          <p>확인한 문장만 종이로 내리면 충분합니다.</p>
                        </li>
                      </ul>
                    </div>
                    <div className="g-preview-actions">
                      <button type="button" className="nd-secondary on-light" onClick={() => setApp('report')}>
                        목록으로
                      </button>
                      <button type="button" className="nd-primary" onClick={saveAndPrint}>
                        이 관측을 남기고 출력하기
                      </button>
                    </div>
                  </div>
                </GlassApp>
              )}

                </div>
                <div className="lap-lcd-pixel" aria-hidden />
                <div className="lap-lcd-scan" aria-hidden />
                <div className="lap-lcd-glare" aria-hidden />
                <div className="lap-lcd-edge" aria-hidden />
              </div>
              <i className="lap-reflect" aria-hidden />
            </div>

          </div>
          <button type="button" className="back" onClick={backFromLaptop}>
            {LAPTOP_BACK_LABEL[app]}
          </button>
        </section>
      )}

      {/* ================= printer: interactive sequence ================= */}
      {game.screen === 'printer' && (
        <section className="pw-scene" role="dialog" aria-label="프린터">
          <div className="pw-stage">
            <img
              className="pw-plate"
              src={printPhase === 'printing' ? SCENES.printer0 : SCENES.printer}
              alt=""
              draggable={false}
            />
            <i className="pw-led" style={{ left: '32.7%', top: '43%' }} aria-hidden />

            {printPhase === 'printing' && (
              <div className="prn-status" style={{ left: '50%', top: '88%' }}>
                <strong>기록이 종이로 내려오는 중</strong>
                <div className="pw-meter">
                  <i style={{ width: `${printProgress * 100}%` }} />
                </div>
                <span>{nightLine(arrival?.id, 'keep')}</span>
              </div>
            )}

            {printPhase === 'ready' && (
              <>
                <button
                  type="button"
                  className="pw-hotspot"
                  style={{ left: '34.5%', top: '54%' }}
                  onClick={() => backToRoom({ printed: true })}
                >
                  <i className="pw-ring" aria-hidden />
                  <span>책장에 자리 만들기</span>
                </button>
                <div className="prn-status" style={{ left: '50%', top: '86%' }}>
                  <strong>출력 완료</strong>
                  <span>종이를 집어, 책장 바인더에 끼워 두세요</span>
                </div>
              </>
            )}
          </div>
          <button type="button" className="back" onClick={() => backToRoom()}>
            ← 방
          </button>
        </section>
      )}

      {/* ================= binder: record list ================= */}
      {game.screen === 'binder' && binderView === 'list' && (
        <section className="pw-scene" role="dialog" aria-label="바인더">
          <div className="pw-stage">
            <PlateDock
              src={SCENES.binder}
              alt="바인더"
              plateStyle={plateDrift}
              kicker="남기다 · 책장"
              title="오늘 기록을 펼쳐 보세요"
              note={nightLine(arrival?.id, 'keep')}
            >
              <button type="button" className="btn sm" onClick={() => setBinderView('detail')}>
                기록 펼치기
              </button>
              <button type="button" className="ghost" onClick={() => backToRoom()}>
                나중에 두기
              </button>
            </PlateDock>
          </div>
          <button type="button" className="back" onClick={() => backToRoom()}>
            ← 방
          </button>
        </section>
      )}

      {/* ================= binder: record detail plate ================= */}
      {game.screen === 'binder' && binderView === 'detail' && (
        <section className="pw-scene" role="dialog" aria-label="기록 상세">
          <div className="pw-stage">
            <PlateDock
              src={SCENES.detail}
              alt="기록 상세"
              plateStyle={plateDrift}
              kicker="남기다 · 확인"
              title="확인한 기록만 책장에 남깁니다"
              note="끼워 두면 다음 의식 — 봉인하다(편지)로 이어집니다."
            >
              <button type="button" className="btn sm" onClick={() => backToRoom({ binderDone: true })}>
                끼워 두고 책상으로
              </button>
              <button type="button" className="ghost" onClick={() => setBinderView('list')}>
                목록으로
              </button>
            </PlateDock>
          </div>
          <button type="button" className="back" onClick={() => setBinderView('list')}>
            ← 바인더
          </button>
        </section>
      )}

      {/* ================= letter: sealing desk ================= */}
      {game.screen === 'letter' && (
        <section className="pw-scene" role="dialog" aria-label="편지">
          <div className="pw-stage">
            <img
              className={`pw-plate ${sealing ? 'pw-swap' : ''}`}
              src={sealing ? SCENES.sealed : SCENES.letter}
              alt=""
              draggable={false}
              style={plateDrift}
            />

            {!sealing ? (
              <>
                <i className="pw-glow" style={{ left: '58.6%', top: '63.8%' }} aria-hidden />
                <form className="paper-letter" onSubmit={mail}>
                  <i className="pl-wax" aria-hidden />
                  <p className="rs-kicker">ORBIROOM · {arrival?.title ?? '관측실'}에서 온 편지</p>
                  <h2>
                    오늘의 관측을
                    <br />
                    봉인할 준비가 됐어요
                  </h2>
                  <p>{nightLine(arrival?.id, 'seal')}</p>
                  <label htmlFor="pw-email">이메일</label>
                  <input
                    id="pw-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                  />
                  <button type="submit" className="btn sm">
                    봉인하고 소식 받기
                  </button>
                  <button type="button" className="ghost" onClick={() => backToRoom()}>
                    아직 열어두기
                  </button>
                </form>
              </>
            ) : (
              <>
                <i className="pw-glow" style={{ left: '56.8%', top: '67.2%' }} aria-hidden />
                <div className="prn-status" style={{ left: '50%', top: '88%' }}>
                  <strong>봉인하는 중</strong>
                  <span>{nightLine(arrival?.id, 'seal')}</span>
                </div>
              </>
            )}
          </div>
          {!sealing && (
            <button type="button" className="back" onClick={() => backToRoom()}>
              ← 방
            </button>
          )}
        </section>
      )}

      {game.screen === 'clear' && (
        <div className="play-clear">
          <p className="clear-kicker">{arrival ? arrival.title : '관측실'} · 하룻밤</p>
          <h2>
            말하다 · 남기다 · 봉인하다
            <br />
            오늘 의식은 여기까지
          </h2>
          <p>
            {arrival
              ? `${arrival.title}으로 들어와 확인한 기록만 방에 남습니다. 나머지는 흘려보내도 됩니다.`
              : '확인한 기록만 방에 남습니다. 나머지는 흘려보내도 됩니다.'}
          </p>
          <button type="button" className="btn" onClick={resetToTitle}>
            문 앞으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
