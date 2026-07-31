interface PrinterOverlayProps {
  isPrinting: boolean;
  printComplete: boolean;
  onArchive: () => void;
}

export function PrinterOverlay({ isPrinting, printComplete, onArchive }: PrinterOverlayProps) {
  return (
    <div className="stage-hud printer-hud">
      <div className="printer-hud__copy reveal">
        <p>
          기능 소개가 완료되면,
          <br />
          오늘의 소개 기록을 출력하여 보관할 수 있어요.
        </p>
      </div>

      <article
        className={`print-paper ${isPrinting || printComplete ? 'is-out' : ''} ${printComplete ? 'is-done' : ''}`}
        aria-live="polite"
      >
        <header className="print-paper__head">
          <h3>오늘의 소개 기록</h3>
          <time>2026.06.22</time>
        </header>
        <ul className="print-paper__list">
          <li><span>✓</span> AI 대화</li>
          <li><span>✓</span> 사람 앞의 나</li>
          <li><span>✓</span> 관측 테스트</li>
          <li><span>✓</span> 프롬포트 커뮤니티</li>
          <li><span>✓</span> 리포트</li>
        </ul>
        <p className="print-paper__note">
          당신의 기록은 시간이 지나도
          다시 꺼내볼 수 있는 관측 자료가 됩니다.
        </p>
      </article>

      {printComplete && (
        <button type="button" className="btn-orb printer-hud__cta reveal" onClick={onArchive}>
          책장에 보관하기
        </button>
      )}
    </div>
  );
}
