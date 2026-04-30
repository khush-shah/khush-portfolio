// src/components/CommandPalette/CommandPalette.tsx
import { useEffect, useRef, useState } from 'react';
import type { AppId } from '../../types';
import './CommandPalette.scss';

interface Cmd { icon:string; label:string; cat:string; fn:()=>void; }

interface Props {
  open: boolean;
  onClose: () => void;
  openApp: (id: AppId) => void;
  openModal: (key: string) => void;
  triggerLoad: () => void;
}

export default function CommandPalette({ open, onClose, openApp, openModal, triggerLoad }: Props) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALL_CMDS: Cmd[] = [
    { icon:'👤', label:'Open About',                  cat:'windows',  fn:()=>openApp('about')      },
    { icon:'📦', label:'Open Projects',               cat:'windows',  fn:()=>openApp('projects')   },
    { icon:'⚡', label:'Open Skills',                  cat:'windows',  fn:()=>openApp('skills')     },
    { icon:'📋', label:'Open Experience Log',          cat:'windows',  fn:()=>openApp('experience') },
    { icon:'📊', label:'Open Metrics Dashboard',       cat:'windows',  fn:()=>openApp('metrics')    },
    { icon:'⌨️', label:'Open Terminal',                cat:'windows',  fn:()=>openApp('terminal')   },
    { icon:'✉️', label:'Open Contact',                 cat:'windows',  fn:()=>openApp('contact')    },
    { icon:'📊', label:'View Latency Optimization',    cat:'metrics',  fn:()=>openModal('latency')  },
    { icon:'👥', label:'View User Reactivation Story', cat:'metrics',  fn:()=>openModal('users')    },
    { icon:'📬', label:'View Delivery Pipeline',       cat:'metrics',  fn:()=>openModal('delivery') },
    { icon:'🔒', label:'View evital-sso Details',      cat:'metrics',  fn:()=>openModal('auth')     },
    { icon:'⚡', label:'Simulate High Load',           cat:'tools',    fn:()=>{ openApp('metrics'); setTimeout(triggerLoad,600); } },
    { icon:'✉',  label:'Send Email',                   cat:'contact',  fn:()=>{ window.location.href='mailto:kshah17121@gmail.com'; } },
    { icon:'💼', label:'Open LinkedIn',                cat:'contact',  fn:()=>window.open('https://www.linkedin.com/in/khush-shah-j172/','_blank') },
    { icon:'📦', label:'Open npm Package',             cat:'contact',  fn:()=>window.open('https://www.npmjs.com/package/evital-sso','_blank') },
  ];

  const filtered = q ? ALL_CMDS.filter(c => c.label.toLowerCase().includes(q) || c.cat.includes(q)) : ALL_CMDS;

  useEffect(() => {
    if (open) { setQ(''); setSel(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => { setSel(0); }, [q]);

  const run = (idx: number) => {
    const cmd = filtered[idx]; if (!cmd) return;
    onClose(); setTimeout(cmd.fn, 150);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s+1, filtered.length-1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
    else if (e.key === 'Enter') { run(sel); }
    else if (e.key === 'Escape') { onClose(); }
  };

  if (!open) return null;

  return (
    <div className="cmd-palette-bg" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cmd-palette" onKeyDown={handleKey}>
        <div className="cmd-palette__search">
          <span className="cmd-palette__icon">⌘</span>
          <input
            ref={inputRef}
            className="cmd-palette__input"
            placeholder="Type a command or search…"
            value={q}
            onChange={e => setQ(e.target.value.toLowerCase())}
            spellCheck={false}
            autoComplete="off"
          />
          <span className="cmd-palette__esc">ESC</span>
        </div>
        <div className="cmd-palette__list">
          {filtered.map((cmd, i) => (
            <div
              key={i}
              className={`cmd-palette__item${i === sel ? ' cmd-palette__item--sel' : ''}`}
              onClick={() => run(i)}
              onMouseEnter={() => setSel(i)}
            >
              <span className="cmd-palette__item-icon">{cmd.icon}</span>
              <span className="cmd-palette__item-label">{cmd.label}</span>
              <span className="cmd-palette__item-cat">{cmd.cat}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="cmd-palette__empty">No commands match "{q}"</div>
          )}
        </div>
        <div className="cmd-palette__footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> run</span>
          <span><kbd>ESC</kbd> close</span>
          <span><kbd>~</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}
