import { useEffect, useRef, useState, useCallback } from 'react';
import './TerminalApp.scss';

interface Line { prompt?: boolean; text: string; color?: string; }

export default function TerminalApp({ openApp }: { openApp: (id: string) => void }) {
  const [lines, setLines] = useState<Line[]>([
    { text: 'KhushOS Terminal v1.0', color: '#3dff7a' },
    { text: "Type 'help' for all commands. Use ↑↓ for history.", color: '#253040' },
    { text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollBottom = useCallback(() => {
    setTimeout(() => {
      if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }, 30);
  }, []);

  const print = useCallback((newLines: Line[]) => {
    setLines(prev => [...prev, ...newLines]);
    scrollBottom();
  }, [scrollBottom]);

  const run = useCallback((raw: string) => {
    const trimmed = raw.trim();
    setLines(prev => [...prev, { prompt: true, text: trimmed }]);
    scrollBottom();
    if (!trimmed) return;
    setHistory(h => [trimmed, ...h.slice(0, 49)]);
    setHistIdx(-1);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'clear') { setLines([]); return; }

    if (cmd === 'help') {
      print([
        { text: '┌─ KhushOS Available Commands ─────────────────────┐', color: '#4da6ff' },
        { text: '│  whoami          print user identity             │', color: '#566a85' },
        { text: '│  neofetch        system info card                │', color: '#566a85' },
        { text: '│  ls              list filesystem                  │', color: '#566a85' },
        { text: '│  cat <file>      read resume.txt or readme.md     │', color: '#566a85' },
        { text: '│  skills --list   show tech stack                  │', color: '#566a85' },
        { text: '│  projects --all  list all projects                │', color: '#566a85' },
        { text: '│  metrics --live  live performance snapshot        │', color: '#566a85' },
        { text: '│  ping <target>   ping linkedin / npm              │', color: '#566a85' },
        { text: '│  open <app>      open any window                  │', color: '#566a85' },
        { text: '│  clear           clear terminal                   │', color: '#566a85' },
        { text: '│  konami          ??                               │', color: '#566a85' },
        { text: '└───────────────────────────────────────────────────┘', color: '#4da6ff' },
      ]); return;
    }

    if (cmd === 'whoami') {
      print([
        { text: 'Khush Shah', color: '#e2efff' },
        { text: 'uid=1000(khush)  gid=engineers  shell=/bin/nodejs', color: '#566a85' },
        { text: 'role=SDE-1  company=Equality Healthcare  city=Ahmedabad', color: '#566a85' },
        { text: 'status=● available_for_opportunities', color: '#3dff7a' },
      ]); return;
    }

    if (cmd === 'neofetch') {
      print([
        { text: '   ██╗  ██╗ ███████╗     khush@kushOS', color: '#4da6ff' },
        { text: '   ██║ ██╔╝ ██╔════╝     ─────────────────────────', color: '#4da6ff' },
        { text: '   █████╔╝  ███████╗     OS:        KhushOS v1.0', color: '#4da6ff' },
        { text: '   ██╔═██╗  ╚════██║     Role:      Full Stack Engineer', color: '#4da6ff' },
        { text: '   ██║  ██╗ ███████║     Company:   Equality Healthcare', color: '#4da6ff' },
        { text: '   ╚═╝  ╚═╝ ╚══════╝     Node.js:   v20  |  PG: v15  |  Redis: 7', color: '#4da6ff' },
        { text: '                          npm pkg:   evital-sso (4K+ req/mo)', color: '#bccfe8' },
        { text: '                          Status:    ● available', color: '#3dff7a' },
        { text: '                          Colors: ████ ████ ████ ████', color: '#c084fc' },
      ]); return;
    }

    if (cmd === 'ls') {
      print([
        { text: 'total 7', color: '#566a85' },
        { text: 'drwxr-xr-x  projects/      PillO · eVitalRx · EngageRx · evital-sso', color: '#4da6ff' },
        { text: 'drwxr-xr-x  skills/        node.js · postgresql · redis · angular · ts', color: '#4da6ff' },
        { text: 'drwxr-xr-x  experience/    equality-healthcare/ · jain-univ/ · indus-univ/', color: '#4da6ff' },
        { text: '-rw-r--r--  resume.txt     2.4KB  →  cat resume.txt', color: '#3dff7a' },
        { text: '-rw-r--r--  readme.md      1.1KB  →  cat readme.md', color: '#3dff7a' },
        { text: '-rwxr-xr-x  metrics.json   live performance data', color: '#ffb627' },
        { text: '-rwxr-xr-x  evital-sso     npm package · 4K+ req/mo', color: '#ffb627' },
      ]); return;
    }

    if (cmd === 'cat') {
      if (args[0] === 'resume.txt') {
        print([
          { text: '╔══════════════════════════════════════════════════╗', color: '#4da6ff' },
          { text: '║  KHUSH SHAH  ·  Full Stack Engineer              ║', color: '#e2efff' },
          { text: '╠══════════════════════════════════════════════════╣', color: '#4da6ff' },
          { text: '║  kshah17121@gmail.com  ·  +91 81289 37197        ║', color: '#566a85' },
          { text: '║  linkedin.com/in/khush-shah-j172                 ║', color: '#566a85' },
          { text: '╠══════════════════════════════════════════════════╣', color: '#4da6ff' },
          { text: '║  HIGHLIGHTS                                       ║', color: '#e2efff' },
          { text: '║  31K users reactivated  ·  API latency -40%      ║', color: '#3dff7a' },
          { text: '║  80% failure drop  ·  98% delivery  ·  4K+ auth  ║', color: '#3dff7a' },
          { text: '╠══════════════════════════════════════════════════╣', color: '#4da6ff' },
          { text: '║  EXPERIENCE                                       ║', color: '#e2efff' },
          { text: '║  SDE-1  Equality Healthcare  Jul 2024–Present     ║', color: '#bccfe8' },
          { text: '║  → PillO: 8K→31K users via notification engine   ║', color: '#566a85' },
          { text: '║  → 80% webhook failure drop w/ BullMQ+DLQ        ║', color: '#566a85' },
          { text: '║  → 40% p95 latency: indexing+cursor+Redis        ║', color: '#566a85' },
          { text: '║  → evital-sso: 4K+/mo, 3 external adopters       ║', color: '#566a85' },
          { text: '╠══════════════════════════════════════════════════╣', color: '#4da6ff' },
          { text: '║  EDUCATION                                        ║', color: '#e2efff' },
          { text: '║  🥇 M.Sc. CS&IT  Jain Univ  CGPA 9.52/10        ║', color: '#bccfe8' },
          { text: '║  🥇 B.Sc. CA&IT  Indus Univ  CGPA 9.97/10       ║', color: '#bccfe8' },
          { text: '╚══════════════════════════════════════════════════╝', color: '#4da6ff' },
        ]); return;
      }
      if (args[0] === 'readme.md') {
        print([
          { text: '# About Khush Shah', color: '#4da6ff' },
          { text: '', color: '' },
          { text: 'Backend engineer. Cares about systems staying up.', color: '#bccfe8' },
          { text: 'APIs that hold. Pipelines that recover. Auth that works.', color: '#bccfe8' },
          { text: '', color: '' },
          { text: '## Stack', color: '#4da6ff' },
          { text: 'Node.js · PostgreSQL · Redis · BullMQ · Angular · TS', color: '#566a85' },
          { text: '', color: '' },
          { text: '## Contact', color: '#4da6ff' },
          { text: 'kshah17121@gmail.com', color: '#3dff7a' },
          { text: 'linkedin.com/in/khush-shah-j172', color: '#3dff7a' },
        ]); return;
      }
      print([{ text: `cat: ${args[0] ?? ''}: No such file. Try resume.txt or readme.md`, color: '#ff4560' }]);
      return;
    }

    if (cmd === 'skills' && args[0] === '--list') {
      print([
        { text: 'Backend ──────────────────────────────────────────', color: '#4da6ff' },
        { text: '  Node.js (95%)  Express (93%)  REST-API (92%)  BullMQ (88%)', color: '#bccfe8' },
        { text: '  JWT/SSO (90%)  Socket.io (82%)  Microservices (85%)', color: '#bccfe8' },
        { text: 'Database ─────────────────────────────────────────', color: '#4da6ff' },
        { text: '  PostgreSQL (90%)  Redis (86%)  MongoDB (75%)  MySQL (72%)', color: '#bccfe8' },
        { text: 'Cloud ────────────────────────────────────────────', color: '#4da6ff' },
        { text: '  GCP (78%)  Firebase (76%)  Docker (74%)  BigQuery (76%)', color: '#bccfe8' },
        { text: 'Frontend ─────────────────────────────────────────', color: '#4da6ff' },
        { text: '  Angular (80%)  TypeScript (85%)  RxJS (80%)', color: '#bccfe8' },
      ]); return;
    }

    if (cmd === 'projects' && args[0] === '--all') {
      print([
        { text: '┌──────┬─────────────────────────────────┬─────────┬──────────────────────┐', color: '#253040' },
        { text: '│  ID  │  Title                          │  Type   │  Key Metric          │', color: '#566a85' },
        { text: '├──────┼─────────────────────────────────┼─────────┼──────────────────────┤', color: '#253040' },
        { text: '│  001 │  PillO Medicine Delivery         │  PROD   │  31K users (+3.4×)   │', color: '#3dff7a' },
        { text: '│  002 │  eVitalRx Chemist ERP            │  PROD   │  40% latency cut     │', color: '#3dff7a' },
        { text: '│  003 │  EngageRx Marketing Automation   │  INT    │  4 hrs/wk saved      │', color: '#ffb627' },
        { text: '│  004 │  evital-sso                      │  NPM    │  4K+ req/month       │', color: '#4da6ff' },
        { text: '└──────┴─────────────────────────────────┴─────────┴──────────────────────┘', color: '#253040' },
      ]); return;
    }

    if (cmd === 'metrics' && args[0] === '--live') {
      print([
        { text: '● Live Performance Snapshot ─────────────────────────', color: '#3dff7a' },
        { text: '  users_reactivated  →  31,000+  (was: 8,000)', color: '#bccfe8' },
        { text: '  api_latency_p95    →  -40%    (620ms → 370ms)', color: '#bccfe8' },
        { text: '  delivery_rate      →  98%     (1,200+ events/day)', color: '#bccfe8' },
        { text: '  webhook_failures   →  -80%    (BullMQ + DLQ)', color: '#bccfe8' },
        { text: '  npm_auth_req_mo    →  4,000+  (evital-sso)', color: '#bccfe8' },
      ]); return;
    }

    if (cmd === 'ping') {
      const targets: Record<string, string> = {
        linkedin: 'https://www.linkedin.com/in/khush-shah-j172/',
        npm: 'https://www.npmjs.com/package/evital-sso',
      };
      const url = targets[args[0]];
      if (url) {
        print([
          { text: `PING ${args[0]}`, color: '#566a85' },
          { text: `64 bytes: icmp_seq=1 time=14.2ms ✓`, color: '#3dff7a' },
          { text: `Opening ${args[0]}…`, color: '#4da6ff' },
        ]);
        setTimeout(() => window.open(url, '_blank'), 700);
      } else {
        print([{ text: `ping: ${args[0]}: unknown. Try: linkedin, npm`, color: '#ff4560' }]);
      }
      return;
    }

    if (cmd === 'open') {
      const valid = ['about','projects','skills','experience','metrics','terminal','contact'];
      if (valid.includes(args[0])) {
        print([{ text: `Opening ${args[0]}…`, color: '#4da6ff' }]);
        setTimeout(() => openApp(args[0]), 200);
      } else {
        print([{ text: `open: unknown. Try: ${valid.join(', ')}`, color: '#ff4560' }]);
      }
      return;
    }

    if (cmd === 'konami') {
      print([
        { text: '⬆⬆⬇⬇⬅➡⬅➡ B A - code accepted', color: '#ffb627' },
        { text: 'Easter egg found! 🎉', color: '#3dff7a' },
        { text: 'You now know I hide things in production too.', color: '#566a85' },
      ]); return;
    }

    if (cmd === 'sudo') {
      print([{ text: "sudo: nice try - you don't have root access here 😄", color: '#ff4560' }]); return;
    }

    if (cmd === 'vim' || cmd === 'nano' || cmd === 'emacs') {
      print([{ text: `${cmd}: too powerful for this terminal (just kidding - try 'cat resume.txt')`, color: '#ffb627' }]); return;
    }

    print([{ text: `command not found: ${trimmed} - try 'help'`, color: '#ff4560' }]);
  }, [print, openApp, scrollBottom]);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cmds = ['help','whoami','neofetch','ls','cat ','skills --list','projects --all','metrics --live','ping ','open ','clear','konami'];
      const match = cmds.find(c => c.startsWith(input));
      if (match) setInput(match);
    }
  };

  return (
    <div className="term-app" onClick={() => inputRef.current?.focus()}>
      <div className="term-app__output" ref={outputRef}>
        {lines.map((l, i) => (
          <div key={i} className="term-app__line">
            {l.prompt
              ? <><span className="term-app__ps1">khush@kushOS:~$</span><span className="term-app__cmd"> {l.text}</span></>
              : <span style={{ color: l.color || 'var(--text2)' }}>{l.text || '\u00A0'}</span>
            }
          </div>
        ))}
      </div>
      <div className="term-app__input-row">
        <span className="term-app__ps1">khush@kushOS:~$</span>
        <input
          ref={inputRef}
          className="term-app__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          placeholder="type a command…"
        />
      </div>
    </div>
  );
}
