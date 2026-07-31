import { useEffect, useRef, useState } from 'react';

export type PointerState = {
  x: number;
  y: number;
  nx: number;
  ny: number;
  active: boolean;
};

const idle: PointerState = { x: 0, y: 0, nx: 0, ny: 0, active: false };

/** Soft cursor aura + normalized parallax offsets (−1…1). */
export function usePointerAura(enabled: boolean) {
  const [pointer, setPointer] = useState<PointerState>(idle);
  const target = useRef(idle);
  const raf = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setPointer(idle);
      return;
    }

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      target.current = {
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / w) * 2 - 1,
        ny: (e.clientY / h) * 2 - 1,
        active: true,
      };
    };

    const onLeave = () => {
      target.current = { ...target.current, active: false };
    };

    const tick = () => {
      setPointer((prev) => {
        const t = target.current;
        // cursor aura snaps quickly; parallax stays soft
        const posEase = 0.45;
        const parEase = 0.14;
        return {
          x: prev.x + (t.x - prev.x) * posEase,
          y: prev.y + (t.y - prev.y) * posEase,
          nx: prev.nx + (t.nx - prev.nx) * parEase,
          ny: prev.ny + (t.ny - prev.ny) * parEase,
          active: t.active,
        };
      });
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  return pointer;
}
