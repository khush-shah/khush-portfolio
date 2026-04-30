import { useEffect, useRef, useState } from 'react';
import { BOOT_LINES } from '../../data/portfolio';
import './Boot.scss';

interface Props { onComplete: () => void; }

export default function Boot({ onComplete }: Props) {
  const [lines, setLines] = useState<typeof BOOT_LINES>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 90));
        ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
      }, line.t);
    });
    setTimeout(() => { setProgress(100); setDone(true); }, 1800);
    setTimeout(onComplete, 2500);
  }, [onComplete]);

  const col = (t: string) => {
    if (t === 'ok')   return '#39ff6e';
    if (t === 'warn') return '#ffb830';
    if (t === 'info') return '#4da6ff';
    return '#c4d4ec';
  };

  return (
    <div className={`boot${done ? ' boot--fade' : ''}`}>
      <div className="boot__lines" ref={ref}>
        {lines.map((l, i) => (
          <div key={i} className="boot__line" style={{ color: col(l.type) }}>
            {l.text}
          </div>
        ))}
      </div>
      <div className="boot__footer">
        <div className="boot__bar-wrap">
          <div className="boot__bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="boot__bar-label">
          {done ? 'Boot complete. Starting KhushOS...' : `Loading KhushOS... ${progress}%`}
        </div>
      </div>
    </div>
  );
}
