import { useEffect, useRef } from 'react';

export default function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let W = 0, H = 0;
    let t = 0;

    interface P { x: number; y: number; vx: number; vy: number; r: number; a: number; }
    let pts: P[] = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      pts = Array.from({ length: 70 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.4, a: Math.random() * 0.35 + 0.08,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.0005;

      // Deep bg
      const bg = ctx.createRadialGradient(W * .35, H * .25, 0, W * .5, H * .5, W * .9);
      bg.addColorStop(0, 'rgba(8,18,48,0.98)');
      bg.addColorStop(0.5, 'rgba(4,9,24,0.99)');
      bg.addColorStop(1, 'rgba(2,4,12,1)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Aurora blobs
      [[W * .2, H * .15, 0.05], [W * .75, H * .08, 0.06], [W * .55, H * .78, 0.04]].forEach(([ax, ay, alpha], i) => {
        const gx = (ax as number) + Math.sin(t * 0.8 + i) * W * 0.06;
        const gy = (ay as number) + Math.cos(t * 0.6 + i) * H * 0.04;
        const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * .4);
        const cols = ['rgba(20,70,180,', 'rgba(60,20,140,', 'rgba(0,110,150,'];
        gr.addColorStop(0, cols[i] + (alpha) + ')');
        gr.addColorStop(1, cols[i] + '0)');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      });

      // Mouse glow
      const mg = ctx.createRadialGradient(mouse.current.x, mouse.current.y, 0, mouse.current.x, mouse.current.y, 260);
      mg.addColorStop(0, 'rgba(77,166,255,0.04)'); mg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mg; ctx.fillRect(0, 0, W, H);

      // Move & wrap
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });

      // Connections
      pts.forEach((a, i) => {
        pts.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(77,166,255,${0.055 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        });
      });

      // Dots
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(77,166,255,${p.a})`; ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}
