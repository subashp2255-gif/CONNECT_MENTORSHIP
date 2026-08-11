import { useState } from 'react';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function NotificationCenter() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2.5 rounded-xl bg-panel border border-border text-text-muted hover:text-white hover:border-primary/40 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[10px] font-mono flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-surface border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Notifications</p>
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-xs text-primary-light hover:text-white transition-colors"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-text-muted">No recent activity.</p>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    markNotificationRead(item.id);
                    if (item.link) {
                      navigate(item.link);
                      setOpen(false);
                    }
                  }}
                  className={`w-full text-left p-4 border-b border-border/70 hover:bg-panel transition-colors ${
                    item.read ? 'opacity-70' : ''
                  }`}
                >
                  <p className="text-sm text-white">{item.text}</p>
                  <p className="text-xs text-text-dim mt-1">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
