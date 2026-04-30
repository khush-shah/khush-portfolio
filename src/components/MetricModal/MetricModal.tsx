// src/components/MetricModal/MetricModal.tsx
import { useEffect, useState } from 'react';
import { METRIC_MODALS } from '../../data/portfolio';
import './MetricModal.scss';

interface Props { modalKey: string | null; onClose: () => void; }

export default function MetricModal({ modalKey, onClose }: Props) {
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    if (modalKey) { setBarsReady(false); const t = setTimeout(() => setBarsReady(true), 80); return () => clearTimeout(t); }
  }, [modalKey]);

  if (!modalKey) return null;
  const data = METRIC_MODALS[modalKey as keyof typeof METRIC_MODALS];
  if (!data) return null;

  return (
    <div className="mm-bg" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mm">
        <button className="mm__close" onClick={onClose}>✕</button>
        <div className="mm__big">{data.big}</div>
        <div className="mm__title">{data.title}</div>
        <div className="mm__compare">
          <div className="mm__col mm__col--before">
            <div className="mm__col-head">Before</div>
            <div className="mm__col-val">{data.before.val}</div>
            <div className="mm__bar"><div className="mm__bar-fill" style={{ width: barsReady ? `${data.before.bar}%` : '0%' }} /></div>
          </div>
          <div className="mm__col mm__col--after">
            <div className="mm__col-head">After</div>
            <div className="mm__col-val">{data.after.val}</div>
            <div className="mm__bar"><div className="mm__bar-fill" style={{ width: barsReady ? `${data.after.bar}%` : '0%' }} /></div>
          </div>
        </div>
        <div className="mm__how-title">How it was achieved</div>
        {data.techniques.map(t => (
          <div key={t.h} className="mm__technique">
            <strong>{t.h}</strong>{t.b}
          </div>
        ))}
      </div>
    </div>
  );
}
