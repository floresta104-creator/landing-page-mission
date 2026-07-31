import { useState, type FormEvent } from 'react';

interface LetterOverlayProps {
  isOpen: boolean;
  emailSubmitted: boolean;
  onOpen: () => void;
  onSubmit: () => void;
}

export function LetterOverlay({ isOpen, emailSubmitted, onOpen, onSubmit }: LetterOverlayProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    setError('');
    onSubmit();
  };

  if (emailSubmitted) {
    return (
      <div className="stage-hud letter-hud">
        <div className="letter-success reveal" aria-live="polite">
          <div className="letter-success__seal" aria-hidden="true">
            <img src="/images/logo.svg" alt="" />
          </div>
          <p>다음 편지에서 만나요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stage-hud letter-hud">
      <div className="letter-hud__aside reveal">
        <ul>
          <li>새로운 업데이트</li>
          <li>깊은 인사이트</li>
          <li>이벤트와 혜택</li>
        </ul>
      </div>

      {!isOpen ? (
        <button type="button" className="letter-hit reveal" onClick={onOpen} aria-label="봉투를 열어 편지 읽기">
          <span className="letter-hit__pulse" aria-hidden="true" />
          <span>편지를 열어보세요</span>
        </button>
      ) : (
        <article className="letter-sheet reveal">
          <h3>
            오르비룸과 함께,
            <br />
            당신의 내일을 더 빛나게
          </h3>
          <p>
            새로운 기록과 이야기, 오르비룸의 따뜻한 소식을
            이메일로 가장 먼저 받아보세요.
          </p>
          <form className="letter-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">이메일 주소</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              required
            />
            {error && (
              <p className="letter-form__error" role="alert">
                {error}
              </p>
            )}
            <label className="letter-form__check">
              <input type="checkbox" defaultChecked />
              오르비룸의 브랜드 스토리와 새로운 소식을 이메일로 받아봅니다.
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
