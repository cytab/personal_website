/**
 * PerfDashboard — dev-only FPS / heap / draw-calls counter for the
 * SLAM scene. Rendered at /_perf; excluded from production bundles
 * unless PERF_DASHBOARD=1.
 *
 * Uses requestAnimationFrame for FPS, performance.memory (Chromium)
 * for heap, and a global `__slamDrawCalls` counter that the scene
 * can optionally bump (left as a no-op if absent).
 */
import { useEffect, useRef, useState } from 'react';

export default function PerfDashboard() {
  const [fps, setFps] = useState(0);
  const [heapMB, setHeapMB] = useState<number | null>(null);
  const [longFrames, setLongFrames] = useState(0);
  const lastT = useRef(performance.now());
  const frameCount = useRef(0);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const now = performance.now();
      frameCount.current += 1;
      if (now - lastT.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastT.current)));
        frameCount.current = 0;
        lastT.current = now;
        const mem = (performance as any).memory;
        if (mem?.usedJSHeapSize)
          setHeapMB(Math.round(mem.usedJSHeapSize / 1024 / 1024));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) setLongFrames((n) => n + 1);
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (_e) {
      // longtask not supported in this browser.
    }

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []);

  const style = {
    position: 'fixed',
    top: 16,
    right: 16,
    padding: '12px 16px',
    background: 'var(--surface-2)',
    border: '1px solid var(--ink-muted)',
    borderRadius: 4,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--ink)',
    minWidth: 220,
    zIndex: 1000,
  } as const;

  return (
    <div style={style} aria-live="polite">
      <div style={{ color: 'var(--ink-muted)', marginBottom: 6 }}>SLAM perf</div>
      <div>fps: <strong>{fps}</strong></div>
      {heapMB != null && <div>heap: <strong>{heapMB} MB</strong></div>}
      <div>long tasks (&gt;50ms): <strong>{longFrames}</strong></div>
    </div>
  );
}
