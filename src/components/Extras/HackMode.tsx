// src/components/Extras/HackMode.tsx
import { useEffect, useState } from 'react';

interface Props { active: boolean; onExit: () => void; }

const HACK_LINES = [
  'Accessing mainframe... ████████ 100%',
  'Bypassing firewall... SUCCESS',
  'Extracting credentials... found 2,048 records',
  'Injecting payload into production DB...',
  'Downloading /etc/shadow... done',
  'Pivoting to internal network...',
  'Establishing reverse shell on :4444',
  'rm -rf /* ... just kidding 😄',
  'This is Khush Shah\'s portfolio, not a real hack.',
  'But seriously — hire this guy.',
];

export default function HackMode({ active, onExit }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) { setVisibleLines([]); setProgress(0); return; }
    let i = 0;
    const t = setInterval(() => {
      if (i < HACK_LINES.length) {
        setVisibleLines(prev => [...prev, HACK_LINES[i]]);
        setProgress(Math.round(((i + 1) / HACK_LINES.length) * 100));
        i++;
      } else {
        clearInterval(t);
        setTimeout(onExit, 2000);
      }
    }, 500);
    return () => clearInterval(t);
  }, [active, onExit]);

  if (!active) return null;

  return (
    <div className="hack-overlay" onClick={onExit}>
      <div className="hack-title">HACKING...</div>
      <div className="hack-lines">
        {visibleLines.map((l, i) => (
          <div key={i} style={{ animation: `hackLineIn 0.2s ease both` }}>{l}</div>
        ))}
      </div>
      <div className="hack-progress">
        <div className="hack-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="hack-exit">Click to abort · {progress}% complete</div>
    </div>
  );
}
