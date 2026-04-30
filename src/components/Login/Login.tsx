import { useState } from 'react';
import './Login.scss';

interface Props { onLogin: () => void; }

export default function Login({ onLogin }: Props) {
  const [clicking, setClicking] = useState(false);

  const handleLogin = () => {
    setClicking(true);
    setTimeout(onLogin, 400);
  };

  return (
    <div className={`login${clicking ? ' login--out' : ''}`}>
      {/* Animated aurora rings */}
      <div className="login__rings" aria-hidden>
        <div className="login__ring login__ring--1" />
        <div className="login__ring login__ring--2" />
        <div className="login__ring login__ring--3" />
      </div>

      <div className="login__card">
        <div className="login__avatar">KS</div>
        <div className="login__name">Khush Shah</div>
        <div className="login__role">Full Stack Engineer · SDE-1</div>
        <div className="login__company">Equality Healthcare · Ahmedabad</div>
        <button className="login__btn" onClick={handleLogin}>
          <span className="login__btn-text">Enter KhushOS</span>
          <span className="login__btn-arrow">↵</span>
        </button>
        <div className="login__hint">KhushOS v1.0 &nbsp;·&nbsp; Press ~ for command palette</div>
      </div>

      <div className="login__footer">
        <span>Node.js</span><span>·</span><span>PostgreSQL</span><span>·</span>
        <span>Redis</span><span>·</span><span>Angular</span><span>·</span><span>TypeScript</span>
      </div>
    </div>
  );
}
