import { useState, useCallback, useRef } from 'react';
import type { OsPhase, AppId, WindowState, Notification } from '../types';
import { APP_CONFIGS } from '../data/portfolio';

let zCounter = 100;

export function useOS() {
  const [phase, setPhase] = useState<OsPhase>('boot');
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [metricModalKey, setMetricModalKey] = useState<string | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const notifTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const showNotif = useCallback((icon: string, title: string, msg: string) => {
    const id = Math.random().toString(36).slice(2);
    setNotifications(n => [...n, { id, icon, title, msg }]);
    const t = setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 4500);
    notifTimers.current.set(id, t);
  }, []);

  const dismissNotif = useCallback((id: string) => {
    const t = notifTimers.current.get(id);
    if (t) clearTimeout(t);
    setNotifications(n => n.filter(x => x.id !== id));
  }, []);

  const openApp = useCallback((id: AppId) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, minimized: false, z: ++zCounter } : w);
      }
      const cfg = APP_CONFIGS[id];
      const offset = (prev.filter(w => !w.minimized).length % 8) * 30;
      return [...prev, {
        id, z: ++zCounter,
        x: window.innerWidth < 768 ? 0 : Math.min(100 + offset, window.innerWidth - cfg.w - 60),
        y: window.innerWidth < 768 ? 0 : Math.min(60 + offset, window.innerHeight - cfg.h - 80),
        w: Math.min(cfg.w, window.innerWidth - 16),
        h: Math.min(cfg.h, window.innerHeight - 64),
        minimized: false, maximized: false,
      }];
    });
  }, []);

  const closeApp = useCallback((id: AppId) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const toggleMaximize = useCallback((id: AppId) => {
    setWindows(prev => prev.map(w => {
      if (w.id !== id) return w;
      if (w.maximized) {
        return { ...w, maximized: false, ...(w.prevRect ?? {}) };
      }
      return {
        ...w, maximized: true,
        prevRect: { x: w.x, y: w.y, w: w.w, h: w.h },
        x: 0, y: 0, w: window.innerWidth, h: window.innerHeight - 48,
      };
    }));
  }, []);

  const focusApp = useCallback((id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, z: ++zCounter } : w));
  }, []);

  const moveWindow = useCallback((id: AppId, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const resizeWindow = useCallback((id: AppId, ww: number, hh: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, w: ww, h: hh } : w));
  }, []);

  return {
    phase, setPhase, windows,
    openApp, closeApp, minimizeApp, toggleMaximize, focusApp, moveWindow, resizeWindow,
    notifications, showNotif, dismissNotif,
    metricModalKey, setMetricModalKey,
    cmdOpen, setCmdOpen,
  };
}
