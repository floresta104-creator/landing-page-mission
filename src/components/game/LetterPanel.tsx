import { useState, type FormEvent } from 'react';

interface LetterPanelProps {
  open: boolean;
  done: boolean;
  onOpen: () => void;
  onSubmit: () => void;
}

export function LetterPanel({ open, done, onOpen, onSubmit }: LetterPanelProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    setError('');
    onSubmit();
  };

  if (done) {
    return (
      <div className="focus-panel letter-panel">
        <div className="letter-done" aria-live="polite">
          <div className="seal" aria-hidden="true" />
          <p>다음 편지에서 만나요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="focus-panel letter-panel">
      {!open ? (
        <button type="button" className="letter-open-btn" onClick={onOpen}>
          편지를 열어보세요
        </button>
      ) : (
        <article className="letter-card">
          <h3>
            오르비룸과 함께,
            <br />
            당신의 내일을 더 빛나게
          </h3>
          <p>새로운 기록과 따뜻한 소식을 이메일로 받아보세요.</p>
          <form onSubmit={submit} noValidate>
            <label htmlFor="mail">이메일 주소</label>
            <input
              id="mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
            />
            {error && <p className="err">{error}</p>}
            <label className="chk">
              <input type="checkbox" defaultChecked />
              오르비룸 소식을 이메일로 받아봅니다.
            </label>
            <button type="submit" className="btn-orb">
              소식 받기
            </button>
          </form>
        </article>
      )}
    </div>
  );
}
