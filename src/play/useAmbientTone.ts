import { useEffect, useRef } from 'react';

/** Soft ambient pad — Pottermore-like presence without shipping audio files. */
export function useAmbientTone(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode[]; gain: GainNode } | null>(null);

  useEffect(() => {
    if (!enabled) {
      const nodes = nodesRef.current;
      const ctx = ctxRef.current;
      if (nodes && ctx) {
        const now = ctx.currentTime;
        nodes.gain.gain.cancelScheduledValues(now);
        nodes.gain.gain.setValueAtTime(nodes.gain.gain.value, now);
        nodes.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        window.setTimeout(() => {
          nodes.osc.forEach((o) => {
            try {
              o.stop();
            } catch {
              /* already stopped */
            }
          });
          void ctx.close();
        }, 700);
      }
      nodesRef.current = null;
      ctxRef.current = null;
      return;
    }

    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;

    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);

    const freqs = [110, 164.81, 220];
    const oscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      g.gain.value = i === 0 ? 0.35 : 0.12;
      osc.connect(g);
      g.connect(master);
      osc.start();
      return osc;
    });

    const now = ctx.currentTime;
    master.gain.exponentialRampToValueAtTime(0.045, now + 1.4);

    ctxRef.current = ctx;
    nodesRef.current = { osc: oscs, gain: master };

    const resume = () => {
      if (ctx.state === 'suspended') void ctx.resume();
    };
    window.addEventListener('pointerdown', resume, { once: true });

    return () => {
      window.removeEventListener('pointerdown', resume);
      try {
        oscs.forEach((o) => o.stop());
        void ctx.close();
      } catch {
        /* ignore */
      }
      nodesRef.current = null;
      ctxRef.current = null;
    };
  }, [enabled]);
}
