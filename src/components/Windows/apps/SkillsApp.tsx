// src/components/Windows/apps/SkillsApp.tsx
import { useEffect, useRef, useState } from 'react';
import { SKILLS } from '../../../data/portfolio';
import './SkillsApp.scss';

export default function SkillsApp() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="skills-app" ref={ref}>
      {Object.entries(SKILLS).map(([cat, items]) => (
        <div key={cat} className="skills-app__cat">
          <div className="skills-app__cat-label">{cat}</div>
          {items.map((s, i) => (
            <div key={s.n} className="skills-app__row">
              <div className="skills-app__name">{s.n}</div>
              <div className="skills-app__track">
                <div
                  className="skills-app__fill"
                  style={{
                    width: animated ? `${s.v}%` : '0%',
                    transitionDelay: `${i * 50}ms`,
                  }}
                />
              </div>
              <div className="skills-app__pct">{s.v}%</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
