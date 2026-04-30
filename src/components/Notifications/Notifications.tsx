// src/components/Notifications/Notifications.tsx
import type { Notification } from '../../types';
import './Notifications.scss';

interface Props { notifications: Notification[]; dismiss: (id: string) => void; }

export default function Notifications({ notifications, dismiss }: Props) {
  return (
    <div className="notif-stack">
      {notifications.map(n => (
        <div key={n.id} className="notif" onClick={() => dismiss(n.id)}>
          <div className="notif__icon">{n.icon}</div>
          <div className="notif__body">
            <div className="notif__title">{n.title}</div>
            <div className="notif__msg">{n.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
