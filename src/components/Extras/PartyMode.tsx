// src/components/Extras/PartyMode.tsx
import { useEffect, useRef } from 'react';

interface Props { active: boolean; }

const COLORS = ['#ff4560','#4da6ff','#3dff7a','#ffb627','#c084fc','#fb7185','#34d399','#60a5fa','#fbbf24'];

export default function PartyMode({ active }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (!active) { activeRef.current = false; return; }
    activeRef.current = true;
    const container = containerRef.current!;

    const burst = () => {
      if (!activeRef.current) return;
      for (let i = 0; i < 8; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const size = Math.random() * 10 + 5;
        piece.style.cssText = `
          left: ${Math.random() * 100}vw;
          width: ${size}px;
          height: ${size * (Math.random() > 0.5 ? 1 : 2.5)}px;
          background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
          animation-duration: ${Math.random() * 2 + 1.5}s;
          animation-delay: ${Math.random() * 0.5}s;
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        `;
        container.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
      }
      if (activeRef.current) setTimeout(burst, 150);
    };
    burst();

    return () => { activeRef.current = false; };
  }, [active]);

  return <div ref={containerRef} style={{ position:'fixed', inset:0, zIndex:9001, pointerEvents:'none' }} />;
}
