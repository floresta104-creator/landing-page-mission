import { useCallback, useEffect, useRef, useState } from 'react';
import { CHOICES, type JourneyPhase, type MissionChoice } from './content';

export function useJourney() {
  const [phase, setPhase] = useState<JourneyPhase>('gate');
  const [ready, setReady] = useState(false);
  const [load, setLoad] = useState(0);
  const [choice, setChoice] = useState<MissionChoice | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [audioOn, setAudioOn] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => {
    const imgs = [
      '/images/journey/door-scene.png',
      '/images/journey/room.png',
      '/images/journey/laptop.png',
      '/images/logo.svg',
    ];
    let done = 0;
    imgs.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        done += 1;
        setLoad(Math.round((done / imgs.length) * 100));
        if (done >= imgs.length) setReady(true);
      };
      img.src = src;
    });
  }, []);

  const stopAudio = useCallback(() => {
    const n = nodesRef.current;
    if (n) {
      try {
        n.gain.gain.exponentialRampToValueAtTime(0.0001, audioRef.current!.currentTime + 0.4);
        window.setTimeout(() => {
          try {
            n.osc.stop();
          } catch {
            /* ignore */
          }
        }, 500);
      } catch {
        /* ignore */
      }
      nodesRef.current = null;
    }
  }, []);

  const startAudio = useCallback(() => {
    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      if (ctx.state === 'suspended') void ctx.resume();
      stopAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 110;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.018, ctx.currentTime + 1.2);
      nodesRef.current = { osc, gain };
      setAudioOn(true);
    } catch {
      setAudioOn(false);
    }
  }, [stopAudio]);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const begin = useCallback(() => {
    startAudio();
    setPhase('portal');
  }, [startAudio]);

  const enterRoom = useCallback(() => setPhase('room'), []);

  const openMission = useCallback(() => setPhase('mission'), []);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const onHotspot = useCallback(
    (id: string) => {
      if (id === 'laptop') {
        openMission();
        return;
      }
      const map: Record<string, string> = {
        mirror: '거울 — 나를 지키려 했던 방식을 짧게 관측합니다.',
        printer: '프린터 — 확인한 기록만 출력되어 방에 남습니다.',
        letter: '편지 — 그 사람 앞의 나를 장면으로 기록합니다.',
        bookshelf: '책장 — 바인더에 쌓인 기록으로 지난 나와 비교합니다.',
      };
      flash(map[id] ?? '');
    },
    [flash, openMission],
  );

  const choose = useCallback((c: MissionChoice) => {
    setChoice(c);
    setPhase('result');
  }, []);

  const toCta = useCallback(() => setPhase('cta'), []);
  const backRoom = useCallback(() => setPhase('room'), []);

  return {
    phase,
    ready,
    load,
    choice,
    toast,
    audioOn,
    choices: CHOICES,
    begin,
    enterRoom,
    openMission,
    onHotspot,
    choose,
    toCta,
    backRoom,
  };
}
