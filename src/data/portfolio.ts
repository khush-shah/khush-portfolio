import type { AppId } from '../types';

export interface AppConfig {
  title: string;
  icon: string;
  w: number;
  h: number;
  bg: string;
}

export const APP_CONFIGS: Record<AppId, AppConfig> = {
  sysmon: { title: 'sysmon.exe - System Monitor', icon: '📡', w: 620, h: 540, bg: 'linear-gradient(135deg,#0a2a1a,#0a1a2a)' },
  about: { title: 'about.exe - Khush Shah', icon: '👤', w: 620, h: 540, bg: 'linear-gradient(135deg,#1e3a5f,#2d5986)' },
  projects: { title: 'projects.db - 4 records', icon: '📦', w: 780, h: 520, bg: 'linear-gradient(135deg,#1a3a2a,#25543c)' },
  skills: { title: 'skills.sys - Stack Profile', icon: '⚡', w: 600, h: 560, bg: 'linear-gradient(135deg,#2e1a4a,#4a2a7a)' },
  experience: { title: 'experience.log - System Journal', icon: '📋', w: 700, h: 520, bg: 'linear-gradient(135deg,#3a2a0a,#5a4010)' },
  metrics: { title: 'metrics.sh - Live Dashboard', icon: '📊', w: 640, h: 580, bg: 'linear-gradient(135deg,#1a2a4a,#243c6a)' },
  terminal: { title: 'terminal.app - khush@kushOS:~', icon: '⌨️', w: 700, h: 460, bg: 'linear-gradient(135deg,#0a140a,#0e200e)' },
  contact: { title: 'contact.cfg - Get In Touch', icon: '✉️', w: 580, h: 500, bg: 'linear-gradient(135deg,#3a1a2a,#5a2840)' },
};

export const BOOT_LINES = [
  { t: 0, text: 'KhushOS BIOS v2.1 - Copyright 2025 Khush Shah Systems', type: '' },
  { t: 100, text: 'CPU: Khush Shah 3.4GHz Backend-Optimized Processor', type: '' },
  { t: 180, text: 'RAM: 8192MB DDR4 - Dual Channel', type: '' },
  { t: 260, text: 'Detecting storage...', type: '' },
  { t: 340, text: '  /dev/sda: projects.db [48GB]', type: 'ok' },
  { t: 400, text: '  /dev/npm: evital-sso@latest', type: 'ok' },
  { t: 460, text: 'Loading kernel modules...', type: '' },
  { t: 530, text: '  module node.js v20 ............ loaded', type: 'ok' },
  { t: 590, text: '  module postgresql v15 .......... loaded', type: 'ok' },
  { t: 650, text: '  module bullmq .................. loaded', type: 'ok' },
  { t: 710, text: '  module redis ................... loaded', type: 'ok' },
  { t: 770, text: '  module socket.io ............... loaded', type: 'ok' },
  { t: 830, text: '  module docker .................. degraded (phone in locker)', type: 'warn' },
  { t: 900, text: 'Starting services...', type: '' },
  { t: 960, text: '  [0.001s] Notification Pipeline Daemon', type: 'info' },
  { t: 1020, text: '  [0.024s] API Server :3001', type: 'info' },
  { t: 1080, text: '  [0.038s] Redis Cache :6379', type: 'info' },
  { t: 1140, text: '  [0.052s] BullMQ Workers ×3', type: 'info' },
  { t: 1200, text: '  [0.061s] WebSocket Server', type: 'info' },
  { t: 1280, text: 'KhushOS ready. Starting graphical interface...', type: 'ok' },
];

export const PROJECTS = [
  {
    id: '001', title: 'PillO - Medicine Delivery', type: 'B2C · Production', badge: 'prod',
    desc: 'Notification engine that reactivated dormant users (8K→31K, ×3.4). BullMQ retry queues, dead-letter handling, cron reconciliation across 1,200+ daily events.',
    metrics: ['31K users', '98% delivery', '80% ↓ failures', '~30% fewer tickets'],
    tags: ['Node.js', 'BullMQ', 'Redis', 'Socket.io', 'PostgreSQL', 'OneSignal'],
  },
  {
    id: '002', title: 'eVitalRx - Chemist ERP/CRM', type: 'B2B · Production', badge: 'prod',
    desc: 'API p95 latency cut 40% across 12+ endpoints. Composite indexing, cursor pagination, multi-layer Redis caching eliminated N+1 queries under concurrent load.',
    metrics: ['40% faster p95', '4K+ auth/mo', '3 integrators', 'Days→Hours'],
    tags: ['Node.js', 'PostgreSQL', 'Redis', 'JWT/SSO', 'Angular'],
  },
  {
    id: '003', title: 'EngageRx - Marketing Automation', type: 'B2B · Greenfield', badge: 'green',
    desc: 'Modular microservices for campaign creation, segmentation, engagement tracking. BigQuery + Firebase analytics pipeline for real-time dashboards.',
    metrics: ['4 hrs/wk saved', 'Real-time CTR', 'Independent deploys'],
    tags: ['Microservices', 'Firebase', 'BigQuery', 'Angular', 'Node.js'],
  },
  {
    id: '004', title: 'evital-sso', type: 'npm · Open Source', badge: 'npm',
    desc: 'Reusable Node.js auth library. Stateless JWT, refresh token rotation, RBAC middleware. Any Node.js service integrates in under 30 minutes.',
    metrics: ['4K+ req/month', '<30 min setup', '3 adopters', 'npm published'],
    tags: ['Node.js', 'JWT', 'RBAC', 'npm', 'Open Source'],
  },
];

export const SKILLS = {
  Backend: [{ n: 'Node.js / Express.js', v: 95 }, { n: 'REST API Design', v: 92 }, { n: 'BullMQ / Queues', v: 88 }, { n: 'Socket.io', v: 82 }, { n: 'JWT / SSO / RBAC', v: 90 }, { n: 'Microservices', v: 85 }],
  Database: [{ n: 'PostgreSQL', v: 90 }, { n: 'Redis (cache/pub-sub)', v: 86 }, { n: 'MongoDB', v: 75 }, { n: 'MySQL', v: 72 }],
  'Cloud & DevOps': [{ n: 'GCP / Firebase', v: 78 }, { n: 'Docker', v: 74 }, { n: 'BigQuery', v: 76 }, { n: 'CI/CD', v: 72 }],
  Frontend: [{ n: 'Angular / RxJS', v: 80 }, { n: 'TypeScript', v: 85 }, { n: 'React', v: 70 }],
};

export const EXPERIENCE_LOG = [
  { ts: '2024-07', lvl: 'SYS', msg: 'Software Engineer (SDE-1) - Equality Healthcare Pvt. Ltd., Ahmedabad' },
  { ts: '2024-08', lvl: 'OK', msg: 'Reactivated dormant users (8K → 31K, ~3.4×) via multi-channel notification engine' },
  { ts: '2024-09', lvl: 'OK', msg: 'Cut webhook partner failure rate 80% - BullMQ retry queues + dead-letter + cron reconciliation' },
  { ts: '2024-10', lvl: 'OK', msg: 'Reduced API p95 latency 40% across 12+ endpoints - composite indexing + cursor pagination + Redis' },
  { ts: '2024-11', lvl: 'OK', msg: 'Built evital-sso npm module - 4K+ monthly requests, adopted by 3 external integrators' },
  { ts: '2024-12', lvl: 'OK', msg: 'Integrated Orange Health & Sterling Accuris lab APIs with Socket.io real-time updates (~30% fewer tickets)' },
  { ts: '2025-01', lvl: 'OK', msg: 'Built EngageRx microservices: campaign creation, segmentation, BigQuery analytics - 4 hrs/wk saved' },
  { ts: '2025-10', lvl: 'WARN', msg: '🏆 Employee of the Month - Oct 2025 (PillO Labs integrations and notification reliability)' },
  { ts: '', lvl: '', msg: '' },
  { ts: '2022-06', lvl: 'SYS', msg: 'M.Sc. Computer Science & IT - Jain (Deemed-to-be) University, Bengaluru (2022–2024)' },
  { ts: '2024-05', lvl: 'OK', msg: '🥇 Gold Medalist · CGPA 9.52/10 · Dean\'s List all semesters' },
  { ts: '2024-04', lvl: 'INFO', msg: 'Patent filed: IoT-Based Chewing Gum Collector' },
  { ts: '', lvl: '', msg: '' },
  { ts: '2019-06', lvl: 'SYS', msg: 'B.Sc. Computer Applications & IT - Indus University, Ahmedabad (2019–2022)' },
  { ts: '2022-05', lvl: 'OK', msg: '🥇 Gold Medalist · CGPA 9.97/10 · University Top Ranker' },
];

export const METRIC_MODALS = {
  users: {
    big: '31K+', title: 'Users Reactivated',
    before: { val: '8,000', bar: 26 }, after: { val: '31,000', bar: 100 },
    techniques: [
      { h: 'Multi-channel Notification Engine', b: 'OneSignal push + WhatsApp Business API + email - all triggered from a single event-driven orchestrator.' },
      { h: 'Abandoned-cart Retargeting', b: 'BullMQ delayed jobs fire re-engagement messages at 24h and 72h intervals post-abandonment.' },
      { h: 'Event-driven Architecture', b: 'User actions emit events consumed by the notification service - decoupled, scalable, observable.' },
    ],
  },
  latency: {
    big: '−40%', title: 'API p95 Latency Reduction',
    before: { val: '~620ms', bar: 100 }, after: { val: '~370ms', bar: 60 },
    techniques: [
      { h: 'Composite Indexing', b: 'Multi-column indexes on high-cardinality query patterns - eliminated seq scans on 100K+ row tables across 12+ endpoints.' },
      { h: 'Cursor-based Pagination', b: 'Replaced OFFSET with keyset/cursor pagination - O(1) vs O(n) at depth. Critical under concurrent load.' },
      { h: 'Multi-layer Redis Caching', b: 'L1: in-process LRU. L2: Redis TTL. L3: DB. Cache-aside eliminated N+1 queries entirely.' },
    ],
  },
  delivery: {
    big: '98%', title: 'Notification Delivery Rate',
    before: { val: '~74%', bar: 74 }, after: { val: '98%', bar: 100 },
    techniques: [
      { h: 'Exponential Backoff Retry', b: 'Failed deliveries re-queued with jittered backoff - prevents thundering herd on provider outages.' },
      { h: 'Dead-letter Queue', b: 'Permanently failed messages go to DLQ for manual review/replay - nothing silently dropped.' },
      { h: 'Per-channel Error Logging', b: 'Structured failure logging per channel (push/WhatsApp/email) enables per-provider SLA tracking.' },
    ],
  },
  failures: {
    big: '−80%', title: 'Webhook Failure Drop',
    before: { val: 'High fail', bar: 100 }, after: { val: '−80% drop', bar: 20 },
    techniques: [
      { h: 'BullMQ Retry Queues', b: '1,200+ daily order events processed through Bull queues with configurable retry attempts and backoff.' },
      { h: 'Cron Reconciliation', b: 'Hourly cron compares partner state vs local state - auto-heals divergences without manual intervention.' },
      { h: 'Dead-letter Handling', b: 'Exhausted retry messages in DLQ with full context - enables root-cause analysis and replay.' },
    ],
  },
  auth: {
    big: '4K+', title: 'Monthly Auth Requests (evital-sso)',
    before: { val: 'Days setup', bar: 100 }, after: { val: '<30 min', bar: 5 },
    techniques: [
      { h: 'Stateless JWT Auth', b: 'Access + refresh token pair. Short-lived access tokens, rotating refresh tokens stored server-side.' },
      { h: 'RBAC Middleware', b: 'Role-based access control as Express middleware - plug-and-play, declarative, testable.' },
      { h: 'Plug-and-play Design', b: '3 external integrators onboarded. npm published. Any Node.js service integrates in under 30 minutes.' },
    ],
  },
};

