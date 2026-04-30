// src/components/Extras/StickyNote.tsx
import { useRef, useState } from 'react';

interface StickyNoteData {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface Props {
  note: StickyNoteData;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

const COLORS = ['#fef08a', '#86efac', '#93c5fd', '#f9a8d4', '#fdba74'];

export function StickyNote({ note, onDelete, onUpdate }: Props) {
  const [pos, setPos] = useState({ x: note.x, y: note.y });
  const dragRef = useRef<{ ox: number; oy: number } | null>(null);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPos({ x: ev.clientX - dragRef.current.ox, y: ev.clientY - dragRef.current.oy });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="sticky-note" style={{ left: pos.x, top: pos.y, background: note.color }}>
      <div className="sticky-note__header" onMouseDown={startDrag}>
        <span className="sticky-note__drag">⠿</span>
        <button className="sticky-note__delete" onClick={() => onDelete(note.id)} onMouseDown={e => e.stopPropagation()}>✕</button>
      </div>
      <textarea
        className="sticky-note__text"
        value={note.text}
        onChange={e => onUpdate(note.id, e.target.value)}
        placeholder="Type a note…"
        onMouseDown={e => e.stopPropagation()}
      />
    </div>
  );
}

interface ManagerProps {
  notes: StickyNoteData[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export default function StickyNotes({ notes, onDelete, onUpdate }: ManagerProps) {
  return (
    <>
      {notes.map(n => (
        <StickyNote key={n.id} note={n} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </>
  );
}

export { COLORS };
export type { StickyNoteData };
