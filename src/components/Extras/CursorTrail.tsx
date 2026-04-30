// src/components/Extras/CursorTrail.tsx
import { useEffect, useRef } from 'react';

const CODE_CHARS = '01アイウエオカキクケコ</>{}[]();=>!=&&||'.split('');

export default function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current!;

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 18) return;

      lastPos.current = { x: e.clientX, y: e.clientY };

      const span = document.createElement('span');
      span.className = 'cursor-trail-char';
      span.textContent = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
      span.style.left = (e.clientX + (Math.random() - 0.5) * 16) + 'px';
      span.style.top  = (e.clientY + (Math.random() - 0.5) * 16) + 'px';
      span.style.animationDuration = (Math.random() * 600 + 500) + 'ms';
      container.appendChild(span);
      setTimeout(() => span.remove(), 1200);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <div ref={containerRef} className="cursor-trail" />;
}
