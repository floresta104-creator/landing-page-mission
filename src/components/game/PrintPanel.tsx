interface PrintPanelProps {
  printing: boolean;
  printDone: boolean;
  onArchive: () => void;
}

export function PrintPanel({ printing, printDone, onArchive }: PrintPanelProps) {
  return (
    <div className="focus-panel print-panel">
      <p className="focus-hint">프린터에서 소개 기록이 출력됩니다.</p>
      <article className={`paper ${printing || printDone ? 'out' : ''}`} aria-live="polite">
        <header>
          <h3>오늘의 소개 기록</h3>
          <time>2026.06.22</time>
        </header>
        <ul>
          <li>✓ AI 대화</li>
          <li>✓ 사람 앞의 나</li>
          <li>✓ 관측 테스트</li>
          <li>✓ 프롬포트 커뮤니티</li>
          <li>✓ 리포트</li>
        </ul>
        <p>당신의 기록은 시간이 지나도 다시 꺼내볼 수 있는 관측 자료가 됩니다.</p>
      </article>
      {printDone && (
        <button type="button" className="btn-orb focus-cta" onClick={onArchive}>
          책장에 보관하기
        </button>
      )}
    </div>
  );
}
