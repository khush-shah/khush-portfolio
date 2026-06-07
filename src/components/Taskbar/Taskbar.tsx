import { useEffect, useState } from 'react';
import type { AppId, WindowState } from '../../types';
import { APP_CONFIGS } from '../../data/portfolio';
import './Taskbar.scss';

interface Props {
  windows: WindowState[];
  openApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  onCmdPalette: () => void;
}

const ALL_APPS = Object.keys(APP_CONFIGS) as AppId[];

export default function Taskbar({ windows, openApp, minimizeApp, onCmdPalette }: Props) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const handleAppBtn = (id: AppId) => {
    const win = windows.find(w => w.id === id);
    if (!win) { openApp(id); return; }
    if (win.minimized) { openApp(id); return; }
    minimizeApp(id);
  };

  return (
    <div className="taskbar">
      {/* OS logo */}
      <div className="taskbar__logo">
        <div className="taskbar__logo-mark">K</div>
        <span className="taskbar__logo-text">KhushOS</span>
      </div>
      <div className="taskbar__sep" />

      {/* App buttons */}
      <div className="taskbar__apps">
        {ALL_APPS.map(id => {
          const cfg = APP_CONFIGS[id];
          const win = windows.find(w => w.id === id);
          const isOpen = !!win;
          const isMin = win?.minimized ?? false;
          return (
            <button
              key={id}
              className={`taskbar__app${isOpen ? ' taskbar__app--open' : ''}${isMin ? ' taskbar__app--min' : ''}`}
              onClick={() => handleAppBtn(id)}
              title={cfg.title}
            >
              <span className="taskbar__app-icon">{cfg.icon}</span>
              <span className="taskbar__app-label">{id}</span>
              {isOpen && <div className="taskbar__app-dot" />}
            </button>
          );
        })}
      </div>

      {/* Right side */}
      <div className="taskbar__right">
        <button className="taskbar__cmd-hint" onClick={onCmdPalette} title="Command Palette (~)">
          <span className="taskbar__cmd-key">~</span>
          <span className="taskbar__cmd-label">cmd</span>
        </button>
        <div className="taskbar__sep" />
        <div className="taskbar__sys">
          <div className="taskbar__sys-dot" />
          <span>live</span>
        </div>
        <div className="taskbar__clock">
          <div className="taskbar__clock-time">{time}</div>
          <div className="taskbar__clock-date">{date}</div>
        </div>
      </div>
    </div>
  );
}
