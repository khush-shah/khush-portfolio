import type { AppId } from '../../types';
import { APP_CONFIGS } from '../../data/portfolio';
import './Desktop.scss';

interface Props {
  openApp: (id: AppId) => void;
  openApps: AppId[];
}

const ICON_ORDER: AppId[] = ['about','projects','skills','experience','metrics','terminal','contact'];

export default function Desktop({ openApp, openApps }: Props) {
  const handleCtx = (e: React.MouseEvent) => {
    e.preventDefault();
    const event = new CustomEvent('desktopContextMenu', { detail: { x: e.clientX, y: e.clientY } });
    window.dispatchEvent(event);
  };

  return (
    <div className="desktop" onContextMenu={handleCtx}>
      <div className="desktop__icons">
        {ICON_ORDER.map(id => {
          const cfg = APP_CONFIGS[id];
          const isOpen = openApps.includes(id);
          return (
            <div
              key={id}
              className={`desk-icon${isOpen ? ' desk-icon--open' : ''}`}
              onDoubleClick={() => openApp(id)}
              role="button"
              aria-label={`Open ${id}`}
            >
              <div className="desk-icon__img" style={{ background: cfg.bg }}>{cfg.icon}</div>
              <div className="desk-icon__label">{id === 'experience' ? 'exp.log' : `${id}.${id === 'terminal' ? 'app' : id === 'metrics' ? 'sh' : id === 'skills' ? 'sys' : id === 'projects' ? 'db' : id === 'contact' ? 'cfg' : 'exe'}`}</div>
              {isOpen && <div className="desk-icon__dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
