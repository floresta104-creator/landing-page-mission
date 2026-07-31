# Orbiroom · 몰입형 관측실 투어 (데모)

오르비룸 서비스를 **관측실 안에서 사물을 클릭하며 체험**하는 인터랙티브 제품 투어 데모입니다.  
실제 AI·기록 저장 기능은 포함하지 않으며, 미리 준비된 예시 화면과 연출만 제공합니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 투어 흐름

1. **입구** — 로고 등장 → 문/버튼 클릭
2. **관측실** — 노트북 클릭
3. **노트북** — 5가지 기능 소개 (방향키 ← → 지원)
4. **프린터** — 소개 기록 출력
5. **바인더** — 기록 페이지 · 기록의 가치
6. **편지** — 이메일 구독 (데모 성공 연출)

## 기술 스택

- Vite + React + TypeScript
- CSS (디자인 토큰, 카메라 transform)
- 외부 UI 라이브러리 없음
- Three.js 미사용

## 이미지 자산

현재 포함된 자산:

| 파일 | 용도 |
|------|------|
| `logo.svg` | 오르비룸 심볼 (SVG) |
| `storyboard.png` | 6장면 스토리보드 (배경 카메라 레퍼런스) |
| `logo-color.png` | 컬러 로고 |
| `logo-white.png` | 화이트 로고 |
| `logo-symbol.png` | 심볼 |
| `design-system.png` | 디자인 시스템 가이드 |

### 교체 권장 (고해상도 배경)

아래 파일을 `public/images/`에 추가하면 CSS placeholder 대신 사용할 수 있습니다.

```text
scene-door.webp       — Scene 01 입구
scene-room.webp       — Scene 02 관측실 전경
scene-desk.webp       — 책상 클로즈업
scene-printer.webp    — 프린터
scene-bookshelf.webp  — 책장
scene-letter.webp     — 편지/봉투
laptop-frame.png      — 노트북 베젤
binder-frame.png      — 바인더 외곽
envelope.png          — 봉투
letter-paper.png      — 편지지 텍스처
```

## 디자인 토큰

- Moon Ivory `#F7F4EE`
- Deep Indigo `#1D2340`
- Orb Violet `#6E59D9`
- Dim Gold `#C9A96B`
- MaruBuri (브랜드) + Pretendard (UI)

## 접근성

- 모든 인터랙션은 `<button>` 기반
- `focus-visible`, `aria-live`, `aria-label` 적용
- `prefers-reduced-motion` 시 카메라 이동 최소화
- 모바일: 장면 단위 전환, 터치 영역 44px+

## 사운드

우측 상단 토글만 제공. 음원 파일은 포함되지 않았으며, `soundEnabled` 상태와 연동할 구조만 준비되어 있습니다.

## 빌드

```bash
npm run build
npm run preview
```
