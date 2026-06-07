// src/components/Windows/apps/ExperienceApp.tsx
import { useEffect, useState } from 'react';
import { EXPERIENCE_LOG } from '../../../data/portfolio';
import './ExperienceApp.scss';

export default function ExperienceApp() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setShown(n => {
      if (n >= EXPERIENCE_LOG.length) { clearInterval(t); return n; }
      return n + 1;
    }), 55);
    return () => clearInterval(t);
  }, []);

  const lvlClass: Record<string, string> = { OK: 'lvl-ok', INFO: 'lvl-info', WARN: 'lvl-warn', SYS: 'lvl-sys' };

  return (
    <div className="exp-app">
      <div className="exp-app__header">// experience.log - sorted by timestamp</div>
      {EXPERIENCE_LOG.slice(0, shown).map((e, i) => {
        if (!e.ts) return <div key={i} style={{ height: 10 }} />;
        return (
          <div key={i} className="exp-app__line">
            <span className="exp-app__ts">{e.ts}</span>
            {e.lvl && <span className={`exp-app__lvl ${lvlClass[e.lvl] || ''}`}>{e.lvl}</span>}
            <span className="exp-app__msg" dangerouslySetInnerHTML={{ __html: e.msg }} />
          </div>
        );
      })}
    </div>
  );
}
