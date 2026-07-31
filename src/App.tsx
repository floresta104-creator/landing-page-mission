import { useCallback, useEffect, useState } from 'react';
import { Landing } from './landing/Landing';
import { PhotoGame } from './play/PhotoGame';
import { saveArrival } from './play/arrival';
import './styles/tokens.css';
import './styles/global.css';

type View = 'landing' | 'play';

function viewFromPath(pathname: string): View {
  return pathname.startsWith('/play') ? 'play' : 'landing';
}

function App() {
  const [view, setView] = useState<View>(() =>
    typeof window === 'undefined' ? 'landing' : viewFromPath(window.location.pathname),
  );
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    const onPop = () => setView(viewFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goPlay = useCallback((doorIndex = 2) => {
    saveArrival(doorIndex);
    window.history.pushState({}, '', '/play');
    setPlayKey((k) => k + 1);
    setView('play');
    window.scrollTo(0, 0);
  }, []);

  const goLanding = useCallback(() => {
    window.history.pushState({}, '', '/');
    setView('landing');
    window.scrollTo(0, 0);
  }, []);

  if (view === 'play') {
    return (
      <>
        <button type="button" className="back-to-landing" onClick={goLanding}>
          ← 복도로
        </button>
        <PhotoGame key={playKey} />
      </>
    );
  }

  return <Landing onEnterPlay={goPlay} />;
}

export default App;
