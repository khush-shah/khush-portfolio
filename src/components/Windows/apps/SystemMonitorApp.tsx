// src/components/Windows/apps/SystemMonitorApp.tsx
import { useEffect, useRef, useState } from 'react';
import './SystemMonitorApp.scss';

interface GaugeData { label: string; value: number; peak: number; color: string; unit: string; }

function sparkline(canvas: HTMLCanvasElement | null, data: number[], color: string) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width = canvas.offsetWidth || 180;
  const H = canvas.height = canvas.offsetHeight || 40;
  ctx.clearRect(0, 0, W, H);
  if (data.length < 2) return;
  const step = W / (data.length - 1);
  const max = 100;
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * step;
    const y = H - (v / max) * (H - 4) - 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fillStyle = color.replace(')', ',0.08)').replace('rgb', 'rgba').replace('#4da6ff', 'rgba(77,166,255').replace('#3dff7a', 'rgba(61,255,122').replace('#c084fc', 'rgba(192,132,252').replace('#ffb627', 'rgba(255,182,39');
  ctx.fillStyle = `${color}15`;
  ctx.fill();
}

const PROCESSES = [
  { name: 'node.js worker', pid: 1337, cpu: () => Math.random() * 8 + 2, mem: '142 MB', status: 'running' },
  { name: 'postgres: query', pid: 5432, cpu: () => Math.random() * 4 + 1, mem: '88 MB', status: 'running' },
  { name: 'redis-server', pid: 6379, cpu: () => Math.random() * 2, mem: '32 MB', status: 'running' },
  { name: 'bullmq-worker×3', pid: 2048, cpu: () => Math.random() * 6 + 3, mem: '96 MB', status: 'running' },
  { name: 'socket.io', pid: 3001, cpu: () => Math.random() * 3 + 1, mem: '54 MB', status: 'running' },
  { name: 'evital-sso', pid: 4000, cpu: () => Math.random() * 1.5, mem: '28 MB', status: 'running' },
  { name: 'cron-reconcile', pid: 4200, cpu: () => Math.random() * 0.5, mem: '18 MB', status: 'sleeping' },
  { name: 'notification-svc', pid: 4400, cpu: () => Math.random() * 5 + 2, mem: '72 MB', status: 'running' },
];

export default function SystemMonitorApp() {
  const [gauges, setGauges] = useState<GaugeData[]>([
    { label: 'CPU', value: 34, peak: 34, color: '#4da6ff', unit: '%' },
    { label: 'RAM', value: 62, peak: 62, color: '#c084fc', unit: '%' },
    { label: 'NET↑', value: 18, peak: 18, color: '#3dff7a', unit: 'KB/s' },
    { label: 'DISK', value: 12, peak: 12, color: '#ffb627', unit: '%' },
  ]);
  const [history, setHistory] = useState<number[][]>([[], [], [], []]);
  const [procs, setProcs] = useState(PROCESSES.map(p => ({ ...p, cpuVal: p.cpu() })));
  const canvasRefs = [useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null), useRef<HTMLCanvasElement>(null)];

  useEffect(() => {
    const t = setInterval(() => {
      setGauges(prev => prev.map((g, i) => {
        const targets = [Math.random() * 45 + 20, Math.random() * 30 + 50, Math.random() * 80 + 5, Math.random() * 20 + 8];
        const newVal = g.value + (targets[i] - g.value) * 0.15 + (Math.random() - 0.5) * 4;
        const clamped = Math.max(5, Math.min(95, newVal));
        return { ...g, value: clamped, peak: Math.max(g.peak, clamped) };
      }));
      setHistory(prev => prev.map((h, i) => {
        const newH = [...h, gauges[i]?.value ?? 0];
        return newH.slice(-60);
      }));
      setProcs(PROCESSES.map(p => ({ ...p, cpuVal: p.cpu() })));
    }, 800);
    return () => clearInterval(t);
  }, [gauges]);

  useEffect(() => {
    canvasRefs.forEach((ref, i) => sparkline(ref.current, history[i], gauges[i].color));
  }, [history]);

  return (
    <div className="sysmon">
      <div className="sysmon__header">
        <div className="sysmon__live"><span className="sysmon__live-dot" />LIVE</div>
        <div className="sysmon__uptime">uptime: 847d 12h 33m</div>
      </div>

      <div className="sysmon__gauges">
        {gauges.map((g, i) => (
          <div key={g.label} className="sysmon__gauge">
            <div className="sysmon__gauge-top">
              <span className="sysmon__gauge-label">{g.label}</span>
              <span className="sysmon__gauge-val" style={{ color: g.color }}>{Math.round(g.value)}{g.unit}</span>
            </div>
            <div className="sysmon__gauge-track">
              <div className="sysmon__gauge-fill" style={{ width: `${g.value}%`, background: g.color }} />
            </div>
            <div className="sysmon__gauge-spark">
              <canvas ref={canvasRefs[i]} style={{ width: '100%', height: '100%', display: 'block' }} />
            </div>
            <div className="sysmon__gauge-peak">peak: {Math.round(g.peak)}{g.unit}</div>
          </div>
        ))}
      </div>

      <div className="sysmon__proc-label">// active processes</div>
      <div className="sysmon__procs">
        <div className="sysmon__proc-head">
          <span>PID</span><span>NAME</span><span>CPU</span><span>MEM</span><span>STATUS</span>
        </div>
        {procs.map(p => (
          <div key={p.pid} className="sysmon__proc">
            <span className="sysmon__proc-pid">{p.pid}</span>
            <span className="sysmon__proc-name">{p.name}</span>
            <span className="sysmon__proc-cpu" style={{ color: p.cpuVal > 6 ? '#ffb627' : '#3dff7a' }}>{p.cpuVal.toFixed(1)}%</span>
            <span className="sysmon__proc-mem">{p.mem}</span>
            <span className={`sysmon__proc-status sysmon__proc-status--${p.status}`}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
