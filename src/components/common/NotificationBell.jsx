import { useState, useEffect, useRef } from 'react';
import { Bell, X, MessageSquare, Home, Heart } from 'lucide-react';
import { getSocket } from '../../lib/socket';
import useAuthStore from '../../store/authStore';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const { user, isAuthenticated } = useAuthStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socket = getSocket();

    // Enregistrer l'utilisateur
    socket.emit('register_user', user.id);

    // Écouter les nouvelles notifications
    socket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 20));
      setUnread(prev => prev + 1);

      // Son de notification
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA');
        audio.play().catch(() => {});
      } catch (e) {}
    });

    return () => {
      socket.off('new_notification');
    };
  }, [isAuthenticated, user]);

  // Fermer en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => setUnread(0);

  const clearAll = () => {
    setNotifications([]);
    setUnread(0);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message': return <MessageSquare size={16} className="text-[#3B82F6]" />;
      case 'listing': return <Home size={16} className="text-[#1A6B3C]" />;
      case 'favorite': return <Heart size={16} className="text-red-500" />;
      default: return <Bell size={16} className="text-[#64748B]" />;
    }
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'À l\'instant';
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Bouton cloche */}
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative p-2 rounded-xl hover:bg-[#F8FAFC] text-[#64748B] transition-colors"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-modal border border-[#E2E8F0] z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-[#0F172A] text-sm">Notifications</h3>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button onClick={clearAll}
                  className="text-xs text-[#94A3B8] hover:text-red-500 transition-colors">
                  Tout effacer
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F8FAFC] text-[#94A3B8]">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Liste notifications */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#94A3B8]">
                <Bell size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucune notification</p>
                <p className="text-xs mt-1">Les nouvelles notifications apparaîtront ici</p>
              </div>
            ) : (
              notifications.map((notif, i) => (
                <div key={i}
                  className="flex items-start gap-3 p-4 hover:bg-[#F8FAFC] transition-colors border-b border-[#E2E8F0] last:border-0">
                  <div className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[#0F172A]">{notif.title}</div>
                    <div className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{notif.message}</div>
                    <div className="text-xs text-[#94A3B8] mt-1">{getTimeAgo(notif.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <p className="text-xs text-center text-[#94A3B8]">
                {notifications.length} notification(s)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}