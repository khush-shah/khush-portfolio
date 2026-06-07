import { useCallback, useEffect, useRef, useState } from 'react';
import { useOS } from './hooks/useOS';
import type { AppId } from './types';
import type { StickyNoteData } from './components/Extras/StickyNote';

import Boot from './components/Boot/Boot';
import Login from './components/Login/Login';
import Wallpaper from './components/Desktop/Wallpaper';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import Window from './components/Windows/Window';
import AboutApp from './components/Windows/apps/AboutApp';
import ProjectsApp from './components/Windows/apps/ProjectsApp';
import SkillsApp from './components/Windows/apps/SkillsApp';
import ExperienceApp from './components/Windows/apps/ExperienceApp';
import MetricsApp from './components/Windows/apps/MetricsApp';
import TerminalApp from './components/Windows/apps/TerminalApp';
import ContactApp from './components/Windows/apps/ContactApp';
import SystemMonitorApp from './components/Windows/apps/SystemMonitorApp';
import CommandPalette from './components/CommandPalette/CommandPalette';
import MetricModal from './components/MetricModal/MetricModal';
import Notifications from './components/Notifications/Notifications';
import CursorTrail from './components/Extras/CursorTrail';
import MatrixRain from './components/Extras/MatrixRain';
import HackMode from './components/Extras/HackMode';
import PartyMode from './components/Extras/PartyMode';
import Screensaver from './components/Extras/Screensaver';
import ScreensaverPicker from './components/Extras/ScreensaverPicker';
import type { ScreensaverMode } from './components/Extras/Screensaver';
import StickyNotes from './components/Extras/StickyNote';
import { COLORS as STICKY_COLORS } from './components/Extras/StickyNote';

import './components/Extras/Extras.scss';

export default function App() {
  const os = useOS();

  const [matrixMode, setMatrixMode] = useState(false);
  const [hackMode, setHackMode] = useState(false);
  const [partyMode, setPartyMode] = useState(false);
  const [screensaver, setScreensaver] = useState(false);
  const [screensaverMode, setScreensaverMode] = useState<ScreensaverMode>('clock');
  const [ssPickerOpen, setSsPickerOpen] = useState(false);
  const [ssStatic, setSsStatic] = useState(false);
  const ssStaticRef = useRef(false);
  useEffect(() => { ssStaticRef.current = ssStatic; }, [ssStatic]);
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([]);

  // SCREENSAVER
  const idleTimer = useRef<ReturnType<typeof setTimeout>>();
  const screensaverRef = useRef(false);   // mirrors state without closure issues
  const phaseRef = useRef(os.phase);

  useEffect(() => { phaseRef.current = os.phase; }, [os.phase]);

  // stable resetIdle - never recreated
  const resetIdle = useCallback(() => {
    // wake screensaver if it's on (but not in static mode)
    if (screensaverRef.current && ssStaticRef.current) return;
    if (screensaverRef.current) {
      screensaverRef.current = false;
      setScreensaver(false);
    }
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (phaseRef.current === 'desktop') {
        screensaverRef.current = true;
        setScreensaver(true);
      }
    }, 90000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resetIdle, { passive: true });
    window.addEventListener('keydown', resetIdle, { passive: true });
    window.addEventListener('mousedown', resetIdle, { passive: true });
    resetIdle();
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('mousedown', resetIdle);
      clearTimeout(idleTimer.current);
    };
  }, [resetIdle]);

  // ── Global keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '`' || e.key === '~') { e.preventDefault(); os.setCmdOpen(v => !v); }
      if (e.key === 'Escape') {
        os.setCmdOpen(false);
        os.setMetricModalKey(null);
        setMatrixMode(false);
        setHackMode(false);
        // wake screensaver on ESC too
        if (screensaverRef.current && !ssStaticRef.current) { screensaverRef.current = false; setScreensaver(false); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [os]);

  // ── Konami code ──
  const konamiSeq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  const konamiIdx = useRef(0);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.keyCode === konamiSeq[konamiIdx.current]) {
        konamiIdx.current++;
        if (konamiIdx.current === konamiSeq.length) {
          konamiIdx.current = 0;
          triggerParty();
          os.showNotif('🎮', 'Konami Code!', 'Party mode activated! 🎉');
        }
      } else {
        konamiIdx.current = 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Terminal command dispatcher ──
  useEffect(() => {
    const handler = (e: Event) => {
      const { cmd } = (e as CustomEvent).detail;
      if (cmd === 'matrix') setMatrixMode(true);
      if (cmd === 'hack') setHackMode(true);
      if (cmd === 'party') triggerParty();
      if (cmd === 'sysmon') os.openApp('sysmon');
    };
    window.addEventListener('terminalCmd', handler);
    return () => window.removeEventListener('terminalCmd', handler);
  }, []);

  const triggerParty = () => {
    setPartyMode(true);
    setTimeout(() => setPartyMode(false), 6000);
  };

  const handleLogin = useCallback(() => {
    os.setPhase('desktop');
    setTimeout(() => os.showNotif('👋', 'Welcome back, Khush!', 'KhushOS v1.0 - All systems nominal'), 700);
    setTimeout(() => os.showNotif('💡', 'Tip', 'Press ~ for command palette · type "matrix" in terminal'), 3200);
    setTimeout(() => os.showNotif('🖥️', 'Quick Start', 'Double-click any desktop icon to open an app'), 6000);
  }, [os]);

  // ── Right-click context menu ──
  const handleDesktopCtx = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('desktop-ctx');
    if (el) {
      el.style.display = 'block';
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
      (el as HTMLElement & { _lastX: number; _lastY: number })._lastX = e.clientX;
      (el as HTMLElement & { _lastX: number; _lastY: number })._lastY = e.clientY;
    }
  }, []);

  useEffect(() => {
    if (os.phase !== 'desktop') return;
    const desktop = document.getElementById('desktop-area');
    desktop?.addEventListener('contextmenu', handleDesktopCtx as EventListener);
    const close = () => { const el = document.getElementById('desktop-ctx'); if (el) el.style.display = 'none'; };
    window.addEventListener('click', close);
    return () => {
      desktop?.removeEventListener('contextmenu', handleDesktopCtx as EventListener);
      window.removeEventListener('click', close);
    };
  }, [os.phase, handleDesktopCtx]);

  const addStickyNote = (color: string) => {
    const el = document.getElementById('desktop-ctx') as HTMLElement & { _lastX: number; _lastY: number };
    setStickyNotes(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      x: (el?._lastX ?? 300) - 100,
      y: (el?._lastY ?? 200) - 20,
      text: '',
      color,
    }]);
  };

  const renderApp = (id: AppId) => {
    switch (id) {
      case 'about': return <AboutApp openModal={k => os.setMetricModalKey(k)} />;
      case 'projects': return <ProjectsApp />;
      case 'skills': return <SkillsApp />;
      case 'experience': return <ExperienceApp />;
      case 'metrics': return <MetricsApp openModal={k => os.setMetricModalKey(k)} />;
      case 'terminal': return <TerminalApp openApp={(id: string) => os.openApp(id as AppId)} />;
      case 'contact': return <ContactApp />;
      case 'sysmon': return <SystemMonitorApp />;
    }
  };

  const CTX_ITEMS = [
    { icon: '📝', label: 'New Sticky Note - Yellow', action: () => addStickyNote(STICKY_COLORS[0]) },
    { icon: '📝', label: 'New Sticky Note - Blue', action: () => addStickyNote(STICKY_COLORS[2]) },
    { icon: '📝', label: 'New Sticky Note - Pink', action: () => addStickyNote(STICKY_COLORS[3]) },
    null,
    { icon: '📡', label: 'System Monitor', action: () => os.openApp('sysmon') },
    { icon: '⌨️', label: 'New Terminal', action: () => os.openApp('terminal') },
    null,
    { icon: '🟩', label: 'Matrix Mode', action: () => setMatrixMode(true) },
    { icon: '🎉', label: 'Party Mode', action: () => triggerParty() },
    { icon: '💀', label: 'Hack Mode', action: () => setHackMode(true) },
    { icon: '💤', label: 'Screensaver Now', action: () => { screensaverRef.current = true; setScreensaver(true); } },
    { icon: '🎨', label: 'Screensaver Style...', action: () => setSsPickerOpen(true) },
    { icon: '📌', label: ssStatic ? 'Static Mode: ON' : 'Static Mode: OFF', action: () => setSsStatic(v => !v) },
    null,
    { icon: '✕', label: 'Close All Windows', action: () => os.windows.forEach(w => os.closeApp(w.id)) },
  ];

  return (
    <>
      <Wallpaper />
      <CursorTrail />
      <PartyMode active={partyMode} />

      {os.phase === 'boot' && <Boot onComplete={() => os.setPhase('login')} />}
      {os.phase === 'login' && <Login onLogin={handleLogin} />}

      {os.phase === 'desktop' && (
        <>
          <div id="desktop-area" style={{ position: 'fixed', inset: 0, bottom: 48, zIndex: 1 }}>
            <Desktop openApp={os.openApp} openApps={os.windows.map(w => w.id)} />
          </div>

          {os.windows.map(win => (
            <Window
              key={win.id}
              win={win}
              onClose={os.closeApp}
              onMinimize={os.minimizeApp}
              onMaximize={os.toggleMaximize}
              onFocus={os.focusApp}
              onMove={os.moveWindow}
              onResize={os.resizeWindow}
            >
              {renderApp(win.id)}
            </Window>
          ))}

          <StickyNotes
            notes={stickyNotes}
            onDelete={id => setStickyNotes(prev => prev.filter(n => n.id !== id))}
            onUpdate={(id, text) => setStickyNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n))}
          />

          <Taskbar
            windows={os.windows}
            openApp={os.openApp}
            minimizeApp={os.minimizeApp}
            onCmdPalette={() => os.setCmdOpen(true)}
          />

          {/* Right-click context menu */}
          <div id="desktop-ctx" style={{
            display: 'none', position: 'fixed', zIndex: 7000,
            background: 'rgba(8,14,26,0.97)', border: '1px solid rgba(77,166,255,0.2)',
            borderRadius: 8, padding: 4, minWidth: 200,
            backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            fontFamily: 'var(--mono)',
          }}>
            {CTX_ITEMS.map((item, i) =>
              item === null
                ? <div key={i} style={{ height: 1, background: 'rgba(77,166,255,0.1)', margin: '3px 8px' }} />
                : (
                  <div
                    key={i}
                    onClick={item.action}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', fontSize: 12, color: 'var(--text)', borderRadius: 5, cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(77,166,255,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                  </div>
                )
            )}
          </div>
        </>
      )}

      {os.cmdOpen && (
        <CommandPalette
          open={os.cmdOpen}
          onClose={() => os.setCmdOpen(false)}
          openApp={os.openApp}
          openModal={k => os.setMetricModalKey(k)}
          triggerLoad={() => {
            os.openApp('metrics');
            setTimeout(() => window.dispatchEvent(new CustomEvent('triggerLoad')), 700);
          }}
        />
      )}

      {os.metricModalKey && (
        <MetricModal modalKey={os.metricModalKey} onClose={() => os.setMetricModalKey(null)} />
      )}

      <Notifications notifications={os.notifications} dismiss={os.dismissNotif} />

      <MatrixRain active={matrixMode} onExit={() => setMatrixMode(false)} />
      <HackMode active={hackMode} onExit={() => setHackMode(false)} />
      <ScreensaverPicker open={ssPickerOpen} current={screensaverMode} onChange={setScreensaverMode} onClose={() => setSsPickerOpen(false)} />
      <Screensaver active={screensaver} mode={screensaverMode} isStatic={ssStatic} onWake={() => { screensaverRef.current = false; setScreensaver(false); resetIdle(); }} />
    </>
  );
}
