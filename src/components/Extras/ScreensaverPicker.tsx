// src/components/Extras/ScreensaverPicker.tsx
// Shows before the screensaver activates — lets user pick Clock or Particles mode.
// Rendered in App.tsx just before <Screensaver />.

import type { ScreensaverMode } from './Screensaver';
import './ScreensaverPicker.scss';

interface Props {
    open: boolean;
    current: ScreensaverMode;
    onChange: (mode: ScreensaverMode) => void;
    onClose: () => void;
}

const OPTIONS: { mode: ScreensaverMode; icon: string; label: string; desc: string }[] = [
    { mode: 'clock', icon: '🕐', label: 'Clock', desc: 'Big time display with soft ambient orbs' },
    { mode: 'particles', icon: '✦', label: 'Network', desc: 'Floating dots with connecting lines' },
];

export default function ScreensaverPicker({ open, current, onChange, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="ss-picker" onClick={onClose}>
            <div className="ss-picker__panel" onClick={e => e.stopPropagation()}>
                <div className="ss-picker__title">Screensaver Style</div>
                <div className="ss-picker__options">
                    {OPTIONS.map(opt => (
                        <button
                            key={opt.mode}
                            className={`ss-picker__opt${current === opt.mode ? ' ss-picker__opt--active' : ''}`}
                            onClick={() => { onChange(opt.mode); onClose(); }}
                        >
                            <span className="ss-picker__opt-icon">{opt.icon}</span>
                            <span className="ss-picker__opt-label">{opt.label}</span>
                            <span className="ss-picker__opt-desc">{opt.desc}</span>
                            {current === opt.mode && <span className="ss-picker__opt-check">✓</span>}
                        </button>
                    ))}
                </div>
                <button className="ss-picker__close" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}