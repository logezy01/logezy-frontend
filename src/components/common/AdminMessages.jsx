import { useState, useEffect } from 'react';
import { Mail, MailOpen, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/notifications/admin-messages');
      setMessages(res.data.messages || []);
    } catch (e) {
      toast.error('Erreur chargement messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleOpen = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await api.put(`/notifications/admin-messages/${msg.id}/read`);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      } catch (e) {}
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  if (loading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => <div key={i} className="card h-16 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
          <Shield size={18} className="text-[#3A7D44]" />
          Messages de l'administration
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>
      </div>

      {messages.length === 0 ? (
        <div className="card p-12 text-center text-[#94A3B8]">
          <Shield size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium dark:text-white">Aucun message de l'administration</p>
          <p className="text-sm mt-1">Vous recevrez ici les messages officiels de Logezy</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id}>
              <button onClick={() => handleOpen(selected?.id === msg.id ? null : msg)}
                className={`w-full card p-4 text-left hover:shadow-float transition-all ${
                  !msg.is_read ? 'border-l-4 border-[#3A7D44]' : ''
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    !msg.is_read ? 'bg-[#EBF5ED]' : 'bg-[#F5F5F7] dark:bg-[#2A2A2A]'
                  }`}>
                    {msg.is_read
                      ? <MailOpen size={18} className="text-[#94A3B8]" />
                      : <Mail size={18} className="text-[#3A7D44]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-[#EBF5ED] text-[#3A7D44] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Shield size={10} /> Logezy Admin
                      </span>
                      {!msg.is_read && (
                        <span className="text-xs bg-red-50 text-red-500 font-bold px-2 py-0.5 rounded-full">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <div className={`font-bold text-sm ${!msg.is_read ? 'text-[#0F172A] dark:text-white' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>
                      {msg.subject}
                    </div>
                    <div className="text-xs text-[#94A3B8] mt-0.5">
                      {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {/* Message déroulant */}
                {selected?.id === msg.id && (
                  <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#2A2A2A]">
                    <p className="text-sm text-[#334155] dark:text-[#94A3B8] leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#94A3B8]">
                      <Shield size={12} className="text-[#3A7D44]" />
                      <span>Message officiel de l'équipe Logezy</span>
                    </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}