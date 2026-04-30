// src/components/Windows/apps/ProjectsApp.tsx
import { useState } from 'react';
import { PROJECTS } from '../../../data/portfolio';
import './ProjectsApp.scss';

export default function ProjectsApp() {
  const [query, setQuery] = useState('');
  const filtered = PROJECTS.filter(p =>
    !query || p.title.toLowerCase().includes(query) || p.tags.join(' ').toLowerCase().includes(query)
  );
  const badgeClass: Record<string,string> = { prod:'badge-prod', green:'badge-green', npm:'badge-npm' };

  return (
    <div className="proj-app">
      <div className="proj-app__toolbar">
        <input className="proj-app__search" placeholder="Search projects, tags…"
          value={query} onChange={e => setQuery(e.target.value.toLowerCase())} />
        <span className="proj-app__count">{filtered.length} row{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="proj-app__scroll">
        <table className="proj-app__table">
          <thead><tr>
            <th>#</th><th>title</th><th>type</th><th>metrics</th><th>stack</th>
          </tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="proj-app__id">{p.id}</td>
                <td>
                  <div className="proj-app__title">{p.title}</div>
                  <div className="proj-app__desc">{p.desc.slice(0,110)}…</div>
                </td>
                <td><span className={`proj-app__badge ${badgeClass[p.badge]}`}>{p.type}</span></td>
                <td>{p.metrics.map(m => <span key={m} className="proj-app__metric">{m}</span>)}</td>
                <td>{p.tags.map(t => <span key={t} className="proj-app__tag">{t}</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
