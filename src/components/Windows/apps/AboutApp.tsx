import './AboutApp.scss';

interface Props { openModal: (key: string) => void; }

export default function AboutApp({ openModal }: Props) {
  const stats = [
    { val:'31K+', label:'Users Reactivated', key:'users', color:'var(--blue)' },
    { val:'40%',  label:'Latency Cut',         key:'latency', color:'var(--purple)' },
    { val:'98%',  label:'Delivery Rate',        key:'delivery', color:'var(--green)' },
    { val:'80%',  label:'Failure Drop',         key:'failures', color:'var(--amber)' },
    { val:'4K+',  label:'Auth Req/mo',           key:'auth', color:'var(--blue)' },
    { val:'🏆',   label:'Employee of Month',     key:null, color:'var(--amber)' },
  ];

  return (
    <div className="about-app">
      <div className="about-app__header">
        <div className="about-app__avatar">KS</div>
        <div>
          <div className="about-app__name">Khush Shah</div>
          <div className="about-app__role">Full Stack Engineer · SDE-1</div>
          <div className="about-app__loc">📍 Ahmedabad, India &nbsp;·&nbsp; Equality Healthcare</div>
        </div>
      </div>
      <p className="about-app__bio">
        Backend-focused engineer with ~1.1 years of <strong>production experience</strong> building systems that handle
        real users, real data, and real failure modes. Focus:{' '}
        <strong>fault tolerance, observability, async pipelines</strong> — not code that works on localhost,
        but code that <strong>stays up at 3am</strong>.
      </p>
      <div className="about-app__stats">
        {stats.map(s => (
          <div
            key={s.label}
            className={`about-app__stat${s.key ? ' about-app__stat--clickable' : ''}`}
            onClick={() => s.key && openModal(s.key)}
          >
            <div className="about-app__stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="about-app__stat-label">{s.label}</div>
            {s.key && <div className="about-app__stat-hint">↗ deep dive</div>}
          </div>
        ))}
      </div>
      <div className="about-app__tags">
        {['Node.js','Express.js','PostgreSQL','BullMQ','Redis','Socket.io','JWT/SSO','Angular','TypeScript','Docker','GCP','BigQuery','Microservices'].map(t => (
          <span key={t} className="about-app__tag">{t}</span>
        ))}
      </div>
    </div>
  );
}
