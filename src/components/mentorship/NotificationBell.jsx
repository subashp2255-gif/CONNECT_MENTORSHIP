import { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications: allNotifications, currentUser, markNotificationRead, markAllNotificationsRead } = useStore();
  const dropdownRef = useRef(null);

  const notifications = allNotifications.filter(n => !n.userId || n.userId === currentUser?.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-surface shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-border flex items-center justify-between bg-panel/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-primary/20 text-primary-light text-xs px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllNotificationsRead()}
                  className="text-xs text-text-muted hover:text-primary-light transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read && markNotificationRead(notif.id)}
                      className={`p-4 transition-colors cursor-pointer hover:bg-white/5 flex gap-3 ${
                        notif.read ? 'opacity-60' : 'bg-primary/5'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.read ? 'text-gray-300' : 'text-white font-medium'}`}>
                          {notif.text}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="flex-shrink-0 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-text-muted">
                  <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p>You're all caught up!</p>
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 bg-panel/50 border-t border-border text-center">
                <button className="text-sm text-primary-light hover:text-primary transition-colors">
                  View all activity
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
