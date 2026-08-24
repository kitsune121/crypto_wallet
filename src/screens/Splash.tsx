import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export const CRYPTERA_POSTER = './cryptera-splash.jpg';

const SPLASH_MS = 3000;

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
    };

    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / SPLASH_MS);
      setProgress(p * 100);
      if (p < 1) frame = requestAnimationFrame(tick);
      else finish();
    };

    frame = requestAnimationFrame(tick);
    return () => {
      finished = true;
      cancelAnimationFrame(frame);
    };
  }, [onDone]);

  return (
    <div className="splash">
      <button type="button" className="splash-skip" onClick={onDone}>
        Skip
      </button>
      <div className="splash-stage">
        <img
          className="splash-image"
          src={CRYPTERA_POSTER}
          alt="Cryptera — Your crypto. Your future."
          draggable={false}
        />
      </div>
      <div className="splash-progress-wrap splash-progress-fixed">
        <div className="splash-progress-track">
          <div className="splash-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="splash-progress-label">Loading Cryptera… {Math.round(progress)}%</span>
      </div>
    </div>
  );
}

/** Full-screen responsive poster modal (one page, fits the screen). */
export function PosterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="poster-modal" role="dialog" aria-modal="true" aria-label="About Cryptera">
      <button type="button" className="poster-modal-close" onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>
      <div className="poster-modal-frame" onClick={onClose}>
        <img
          className="poster-modal-image"
          src={CRYPTERA_POSTER}
          alt="Cryptera about poster"
          draggable={false}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
