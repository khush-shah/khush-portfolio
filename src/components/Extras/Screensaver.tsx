// src/components/Extras/Screensaver.tsx
import { useEffect, useRef, useState } from 'react';

interface Props { active: boolean; onWake: () => void; }

export default function Screensaver({ active, onWake }: Props) {
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

  // Floating particles on screensaver canvas
  useEffect(() => {
    if (!active) return;
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
  }, [active]);

  if (!active) return null;

  return (
    <div className="screensaver" onClick={onWake}>
      <canvas ref={canvasRef} className="screensaver__canvas" />
      <div className="screensaver__content">
        <div className="screensaver__time">{time}</div>
        <div className="screensaver__date">{date}</div>
        <div className="screensaver__name">Khush Shah &nbsp;·&nbsp; KhushOS</div>
        <div className="screensaver__hint">Click or press any key to wake</div>
      </div>
    </div>
  );
}
