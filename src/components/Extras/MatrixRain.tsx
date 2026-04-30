// src/components/Extras/MatrixRain.tsx
import { useEffect, useRef } from 'react';

interface Props { active: boolean; onExit: () => void; }

export default function MatrixRain({ active, onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const FONT_SIZE = 14;
    const cols = Math.floor(W / FONT_SIZE);
    const drops: number[] = Array(cols).fill(1);
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>{}[]()'.split('');

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#0f0';
      ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        // Brighten the leading character
        ctx.fillStyle = drops[i] * FONT_SIZE < H * 0.1 ? '#fff' : '#0f0';
        ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current!);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="matrix-overlay" onClick={onExit}>
      <canvas ref={canvasRef} className="matrix-canvas" />
      <div className="matrix-exit">Click anywhere or press ESC to exit matrix mode</div>
    </div>
  );
}
