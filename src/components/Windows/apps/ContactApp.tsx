// src/components/Windows/apps/ContactApp.tsx
import './ContactApp.scss';

const LINKS = [
  { icon:'✉️', label:'Email',              val:'kshah17121@gmail.com',           href:'mailto:kshah17121@gmail.com' },
  { icon:'💼', label:'LinkedIn',           val:'linkedin.com/in/khush-shah-j172', href:'https://www.linkedin.com/in/khush-shah-j172/' },
  { icon:'📱', label:'WhatsApp / Phone',   val:'+91 81289 37197',                href:'https://wa.me/918128937197' },
  { icon:'📦', label:'npm',                val:'evital-sso · 4K+ req/month',     href:'https://www.npmjs.com/package/evital-sso' },
];

export default function ContactApp() {
  return (
    <div className="contact-app">
      <div className="contact-app__heading">Let's build something great.</div>
      <p className="contact-app__sub">
        Open to backend, full-stack, or Node.js-focused roles.<br/>
        Building something interesting? Let's talk.
      </p>
      <div className="contact-app__links">
        {LINKS.map(l => (
          <a
            key={l.label}
            className="contact-app__link"
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
          >
            <div className="contact-app__link-icon">{l.icon}</div>
            <div>
              <div className="contact-app__link-label">{l.label}</div>
              <div className="contact-app__link-val">{l.val}</div>
            </div>
            <div className="contact-app__link-arrow">→</div>
          </a>
        ))}
      </div>
      <div className="contact-app__note">
        <strong>📵 Note:</strong> My workplace has a phone-in-locker policy during work hours.
        If I miss your call, I'll ring back as soon as I step out.
        WhatsApp gets the fastest response.
      </div>
    </div>
  );
}
