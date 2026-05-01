import { useEffect, useRef, useState } from 'react';
import './MetricsApp.scss';

interface Props { openModal: (key: string) => void; }

const METRICS = [
  { key:'users',    val:31,  sfx:'K+', label:'Users Reactivated',   color:'#4da6ff'  },
  { key:'latency',  val:40,  sfx:'%',  label:'API Latency Reduced',  color:'#c084fc'  },
  { key:'delivery', val:98,  sfx:'%',  label:'Delivery Rate',        color:'#3dff7a'  },
  { key:'failures', val:80,  sfx:'%',  label:'Webhook Failure Drop', color:'#ffb627'  },
];

const PIPE = ['Ingest','BullMQ','Workers×3','DLQ','Output'];

export default function MetricsApp({ openModal }: Props) {
  const [counts, setCounts] = useState(METRICS.map(() => 0));
  const [pipe, setPipe] = useState(0);
  const [loadHigh, setLoadHigh] = useState(false);
  const [loadData, setLoadData] = useState<number[]>(Array(80).fill(42));
  const loadRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simTO = useRef<ReturnType<typeof setTimeout>>();

  // Counter animation on mount
  useEffect(() => {
    METRICS.forEach(({ val }, i) => {
      const dur = 1600 + i * 120;
      const s = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - s) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setCounts(prev => { const n = [...prev]; n[i] = Math.round(val * e); return n; });
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, []);

  // Pipeline animation
  useEffect(() => {
    const t = setInterval(() => setPipe(p => (p + 1) % PIPE.length), 650);
    return () => clearInterval(t);
  }, []);

  // Load graph data
  useEffect(() => {
    const t = setInterval(() => {
      setLoadData(prev => {
        const last = prev[prev.length - 1];
        const next = loadRef.current
          ? Math.min(960, last + (Math.random() * 140 - 25))
          : Math.max(18, Math.min(72, last + (Math.random() * 16 - 8)));
        return [...prev.slice(1), Math.max(0, next)];
      });
    }, 130);
    return () => clearInterval(t);
  }, []);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.offsetWidth || 580;
    const H = canvas.offsetHeight || 56;
    canvas.width = W; canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const step = W / (loadData.length - 1);
    const max = 1000;
    const last = loadData[loadData.length - 1];
    const col = loadRef.current
      ? (last > 500 ? '#ff4560' : '#ffb627')
      : '#4da6ff';

    ctx.beginPath();
    loadData.forEach((v, i) => {
      const x = i * step;
      const y = H - Math.max(2, (v / max) * (H - 4));
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = loadRef.current
      ? (last > 500 ? 'rgba(255,69,96,0.07)' : 'rgba(255,182,39,0.07)')
      : 'rgba(77,166,255,0.06)';
    ctx.fill();
  }, [loadData]);

  // Listen for external triggerLoad event
  useEffect(() => {
    const handler = () => triggerLoad();
    window.addEventListener('triggerLoad', handler);
    return () => window.removeEventListener('triggerLoad', handler);
  }, []);

  const triggerLoad = () => {
    if (loadRef.current) {
      loadRef.current = false;
      setLoadHigh(false);
      clearTimeout(simTO.current);
    } else {
      loadRef.current = true;
      setLoadHigh(true);
      simTO.current = setTimeout(() => {
        loadRef.current = false;
        setLoadHigh(false);
      }, 8000);
    }
  };

  return (
    <div className="metrics-app">
      <div className="metrics-app__grid">
        {METRICS.map((m, i) => (
          <div key={m.key} className="metrics-app__card" onClick={() => openModal(m.key)}>
            <div className="metrics-app__val" style={{ color: m.color }}>
              {counts[i]}<span className="metrics-app__sfx">{m.sfx}</span>
            </div>
            <div className="metrics-app__label">{m.label}</div>
            <div className="metrics-app__bar">
              <div className="metrics-app__fill" style={{ background: m.color, width: `${(counts[i] / m.val) * 100}%` }} />
            </div>
            <div className="metrics-app__hint">↗ click for deep dive</div>
          </div>
        ))}
      </div>

      <div className="metrics-app__section">Live Event Pipeline</div>
      <div className="metrics-app__pipeline">
        {PIPE.map((n, i) => (
          <div key={n} style={{ display:'flex', alignItems:'center' }}>
            <div className={`metrics-app__node${i === pipe ? ' active' : ''}${n === 'DLQ' ? ' warn' : ''}`}>{n}</div>
            {i < PIPE.length - 1 && <span className="metrics-app__arrow">→</span>}
          </div>
        ))}
      </div>
      <div className="metrics-app__pipe-note">1,200+ events/day · 98% success</div>

      <div className="metrics-app__section" style={{ marginTop: 14 }}>Load Graph</div>
      <div className="metrics-app__graph">
        <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />
      </div>

      <button
        className={`metrics-app__sim${loadHigh ? ' active' : ''}`}
        onClick={triggerLoad}
      >
        {loadHigh ? '■ Stop simulation - system adapting…' : '▶ Simulate High Load'}
      </button>
    </div>
  );
}
