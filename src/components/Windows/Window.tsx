import { useRef, useCallback, useState, useEffect, type ReactNode } from 'react';
import type { AppId, WindowState } from '../../types';
import { APP_CONFIGS } from '../../data/portfolio';
import './Window.scss';

interface Props {
  win: WindowState;
  children: ReactNode;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onMaximize: (id: AppId) => void;
  onFocus: (id: AppId) => void;
  onMove: (id: AppId, x: number, y: number) => void;
  onResize: (id: AppId, w: number, h: number) => void;
}

export default function Window({ win, children, onClose, onMinimize, onMaximize, onFocus, onMove, onResize }: Props) {
  const cfg = APP_CONFIGS[win.id];
  const dragging = useRef(false);
  const resizing = useRef(false);
  const dragOffset = useRef({ ox: 0, oy: 0 });
  const resizeStart = useRef({ sx: 0, sy: 0, sw: 0, sh: 0 });

  const startDrag = useCallback((e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.classList.contains('win-dot') || el.closest('.win-dot')) return;
    e.preventDefault();
    dragging.current = true;
    dragOffset.current = { ox: e.clientX - win.x, oy: e.clientY - win.y };
    onFocus(win.id);

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const nx = Math.max(0, Math.min(window.innerWidth - 200, ev.clientX - dragOffset.current.ox));
      const ny = Math.max(0, Math.min(window.innerHeight - 80, ev.clientY - dragOffset.current.oy));
      onMove(win.id, nx, ny);
    };
    const onMouseUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [win.id, win.x, win.y, onFocus, onMove]);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    resizeStart.current = { sx: e.clientX, sy: e.clientY, sw: win.w, sh: win.h };

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizing.current) return;
      const nw = Math.max(340, resizeStart.current.sw + (ev.clientX - resizeStart.current.sx));
      const nh = Math.max(220, resizeStart.current.sh + (ev.clientY - resizeStart.current.sy));
      onResize(win.id, nw, nh);
    };
    const onMouseUp = () => {
      resizing.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [win.id, win.w, win.h, onResize]);

  if (win.minimized) return null;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const style: React.CSSProperties = (win.maximized || isMobile) ? {
    position: 'fixed', left: 0, top: 0,
    width: '100vw', height: 'calc(100vh - 48px)',
    zIndex: win.z, borderRadius: 0,
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
  } : {
    position: 'fixed',
    left: win.x, top: win.y,
    width: win.w, height: win.h,
    zIndex: win.z,
  };

  return (
    <div className="window" style={style} onMouseDown={() => onFocus(win.id)}>
      {/* Title bar */}
      <div className="window__titlebar" onMouseDown={startDrag}>
        <div className="window__dots">
          <button
            className="win-dot win-dot--close"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onClose(win.id); }}
            title="Close"
          />
          <button
            className="win-dot win-dot--min"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onMinimize(win.id); }}
            title="Minimize"
          />
          <button
            className="win-dot win-dot--max"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onMaximize(win.id); }}
            title={win.maximized ? 'Restore' : 'Maximize'}
          />
        </div>
        <div className="window__title">{cfg.icon} &nbsp;{cfg.title}</div>
        <div style={{ width: 54 }} />
      </div>

      {/* Content */}
      <div className="window__body">{children}</div>

      {/* Resize */}
      {!win.maximized && !isMobile && <div className="window__resize" onMouseDown={startResize} />}
    </div>
  );
}
