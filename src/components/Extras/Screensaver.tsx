// src/components/Extras/Screensaver.tsx
import { useEffect, useRef, useState } from 'react';

export type ScreensaverMode = 'clock' | 'particles';

interface Props {
  active: boolean;
  onWake: () => void;
  mode?: ScreensaverMode;
  isStatic?: boolean;
}

// ── Clock screensaver (existing style, cleaned up) ──────────────────────────
function ClockScreensaver({ onWake, isStatic }: { onWake: () => void; isStatic: boolean }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const orbs: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = Array.from({ length: 12 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 120 + 60,
      hue: Math.random() * 60 + 200,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = canvas.width + o.r;
        if (o.x > canvas.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = canvas.height + o.r;
        if (o.y > canvas.height + o.r) o.y = -o.r;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},80%,60%,0.07)`);
        g.addColorStop(1, `hsla(${o.hue},80%,60%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
        o.hue += 0.05;
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  return (
    <div className="screensaver screensaver--clock" onClick={isStatic ? undefined : onWake}>
      <canvas ref={canvasRef} className="screensaver__canvas" />
      <div className="screensaver__content">
        <div className="screensaver__time">{time}</div>
        <div className="screensaver__date">{date}</div>
        <div className="screensaver__name">Khush Shah &nbsp;·&nbsp; KhushOS</div>
        {!isStatic && <div className="screensaver__hint">Click or press any key to wake</div>}
      </div>
    </div>
  );
}

// ── Particles screensaver (starfield / network dots) ───────────────────────
function ParticlesScreensaver({ onWake }: { onWake: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const COUNT = Math.min(120, Math.floor((W * H) / 8000));
    const CONNECT_DIST = 140;

    type Dot = { x: number; y: number; vx: number; vy: number; r: number };
    const dots: Dot[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.strokeStyle = `rgba(77,166,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;

        ctx.fillStyle = 'rgba(77,166,255,0.7)';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  return (
    <div className="screensaver screensaver--particles" onClick={onWake}>
      <canvas ref={canvasRef} className="screensaver__canvas" />
      <div className="screensaver__content screensaver__content--minimal">
        <div className="screensaver__logo">KS</div>
        <div className="screensaver__tagline">khush-dev-portfolio.vercel.app</div>
        <div className="screensaver__hint">Click or press any key to wake</div>
      </div>
    </div>
  );
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function Screensaver({ active, onWake, mode = 'clock', isStatic = false }: Props) {
  if (!active) return null;
  if (mode === 'particles') return <ParticlesScreensaver onWake={onWake} />;
  return <ClockScreensaver onWake={onWake} isStatic={isStatic} />;
}