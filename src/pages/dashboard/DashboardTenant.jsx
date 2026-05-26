import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Search, Heart, MessageSquare, Bell, Trash2, ToggleLeft, ToggleRight, Mail, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/common/DashboardLayout';
import ListingCard from '../../components/common/ListingCard';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

const MENU = [
  { path: '/dashboard/locataire', icon: '📊', label: 'Vue générale' },
  { path: '/dashboard/locataire/recherche', icon: '🔍', label: 'Rechercher' },
  { path: '/dashboard/locataire/favoris', icon: '❤️', label: 'Mes favoris' },
  { path: '/dashboard/locataire/alertes', icon: '🔔', label: 'Mes alertes' },
  { path: '/dashboard/locataire/messages', icon: '💬', label: 'Messages' },
  { path: '/dashboard/locataire/profil', icon: '👤', label: 'Mon profil' },
];

// ─── VUE GÉNÉRALE ────────────────────────────────────────────
function Overview() {
  const [listings, setListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [listingsRes, favRes, alertsRes] = await Promise.all([
          api.get('/listings?limit=3'),
          api.get('/listings/user/favorites'),
          api.get('/alerts'),
        ]);
        setListings(listingsRes.data.listings || []);
        setFavorites(favRes.data.favorites || []);
        setAlerts(alertsRes.data.alerts || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header premium */}
      <div className="bg-gradient-to-br from-[#3A7D44] to-[#2D6235] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full opacity-5 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Bonjour 👋</p>
            <h2 className="font-display text-2xl font-bold">{user?.full_name}</h2>
            <p className="text-white/60 text-sm mt-1">Locataire · Logezy</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-display font-black text-3xl text-white">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-3 mt-5 relative z-10">
          {[
            { label: 'Favoris', value: favorites.length },
            { label: 'Alertes', value: alerts.length },
            { label: 'Annonces', value: listings.length },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="font-display font-black text-xl text-white">{s.value}</div>
              <div className="text-white/60 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/dashboard/locataire/recherche', icon: '🔍', label: 'Rechercher', desc: 'Trouver un bien', color: 'bg-[#EBF5ED]' },
          { to: '/dashboard/locataire/favoris', icon: '❤️', label: 'Favoris', desc: `${favorites.length} sauvegardé(s)`, color: 'bg-red-50' },
          { to: '/dashboard/locataire/alertes', icon: '🔔', label: 'Alertes', desc: `${alerts.length} active(s)`, color: 'bg-[#FEF3C7]' },
          { to: '/dashboard/locataire/messages', icon: '💬', label: 'Messages', desc: 'Mes conversations', color: 'bg-[#EFF6FF]' },
        ].map((a, i) => (
          <Link key={i} to={a.to}
            className={`${a.color} dark:bg-[#2A2A2A] card p-4 flex flex-col items-center text-center gap-2 hover:shadow-float transition-all`}>
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-bold text-[#334155] dark:text-[#94A3B8]">{a.label}</span>
            <span className="text-xs text-[#94A3B8]">{a.desc}</span>
          </Link>
        ))}
      </div>

      {/* Annonces récentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Annonces récentes</h3>
          <Link to="/annonces" className="text-sm text-[#3A7D44] font-bold hover:underline">
            Voir tout →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>

      {/* Conseil */}
      <div className="card p-5 bg-[#FEF3C7] dark:bg-[#2A2A2A] border-[#F59E0B]/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <div className="font-bold text-sm text-[#92400E] dark:text-[#F59E0B] mb-1">Conseil Logezy</div>
            <p className="text-xs text-[#92400E]/80 dark:text-[#94A3B8] leading-relaxed">
              Créez une alerte de recherche pour être notifié par email dès qu'une nouvelle annonce
              correspond à vos critères. Allez dans "Annonces" → "Créer une alerte".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RECHERCHE ────────────────────────────────────────────────
function SearchPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: '', type: '', bedrooms: '', min_price: '', max_price: ''
  });

  const CITIES = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Ouidah', 'Lokossa'];

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const res = await api.get(`/listings?${params.toString()}`);
      setListings(res.data.listings || []);
    } catch (e) {
      toast.error('Erreur recherche');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handleSearch(); }, []);

  const update = (f, v) => setFilters(p => ({ ...p, [f]: v }));

  const handleReset = () => {
    setFilters({ city: '', type: '', bedrooms: '', min_price: '', max_price: '' });
    setTimeout(() => handleSearch(), 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-display font-bold text-[#0F172A] dark:text-white">Recherche avancée</h2>

      {/* Filtres */}
      <div className="card p-5">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Ville</label>
              <select value={filters.city} onChange={(e) => update('city', e.target.value)} className="input-field">
                <option value="">Toutes les villes</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Type</label>
              <select value={filters.type} onChange={(e) => update('type', e.target.value)} className="input-field">
                <option value="">Tout type</option>
                <option value="location">Location</option>
                <option value="vente">Vente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Chambres min.</label>
              <select value={filters.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="input-field">
                <option value="">Peu importe</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Prix min (FCFA)</label>
              <input type="number" placeholder="Ex: 50000" value={filters.min_price}
                onChange={(e) => update('min_price', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#334155] dark:text-[#94A3B8] mb-1">Prix max (FCFA)</label>
              <input type="number" placeholder="Ex: 500000" value={filters.max_price}
                onChange={(e) => update('max_price', e.target.value)} className="input-field" />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="btn-primary flex-1 py-3 text-sm">
                🔍 Rechercher
              </button>
              <button type="button" onClick={handleReset}
                className="px-3 py-3 rounded-btn border-2 border-[#E2E8F0] dark:border-[#2A2A2A] text-[#64748B] hover:text-red-500 hover:border-red-200 transition-all text-sm">
                ✕
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Résultats */}
      <div>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4 font-medium">
          {loading ? 'Recherche...' : `${listings.length} résultat(s) trouvé(s)`}
        </p>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-64 animate-pulse" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="card p-12 text-center text-[#94A3B8]">
            <span className="text-5xl block mb-3">🔍</span>
            <p className="font-medium dark:text-white">Aucun résultat</p>
            <p className="text-sm mt-1">Essayez d'élargir vos critères de recherche</p>
            <button onClick={handleReset} className="btn-primary mt-4 text-sm px-6 py-2">
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FAVORIS ──────────────────────────────────────────────────
function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/listings/user/favorites');
        setFavorites(res.data.favorites || []);
      } catch (e) {
        toast.error('Erreur chargement favoris');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => <div key={i} className="card h-64 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Mes favoris ({favorites.length})
        </h2>
        <Link to="/annonces" className="btn-secondary text-sm px-4 py-2">
          Parcourir les annonces
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="card p-12 text-center text-[#94A3B8]">
          <span className="text-5xl block mb-3">❤️</span>
          <p className="font-medium dark:text-white">Aucun favori pour le moment</p>
          <p className="text-sm mt-1 mb-4">
            Cliquez sur ❤️ sur une annonce pour la sauvegarder ici
          </p>
          <Link to="/annonces" className="btn-primary inline-block text-sm px-6 py-2">
            Parcourir les annonces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ALERTES ──────────────────────────────────────────────────
function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(null);

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.alerts || []);
    } catch (e) {
      toast.error('Erreur chargement alertes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/alerts/${id}/toggle`);
      toast.success(res.data.message);
      fetchAlerts();
    } catch (e) {
      toast.error('Erreur mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette alerte ?')) return;
    try {
      await api.delete(`/alerts/${id}`);
      toast.success('Alerte supprimée');
      fetchAlerts();
    } catch (e) {
      toast.error('Erreur suppression');
    }
  };

  const handleTest = async (id) => {
    setTesting(id);
    try {
      const res = await api.post(`/alerts/${id}/test`);
      toast.success(res.data.message);
    } catch (e) {
      toast.error('Erreur test email');
    } finally {
      setTesting(null);
    }
  };

  if (loading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Mes alertes ({alerts.length})
        </h2>
        <Link to="/annonces" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
          <Bell size={14} /> Créer une alerte
        </Link>
      </div>

      {alerts.length === 0 ? (
        <div className="card p-12 text-center text-[#94A3B8]">
          <Bell size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium dark:text-white">Aucune alerte créée</p>
          <p className="text-sm mt-1 mb-4">
            Sauvegardez une recherche pour être notifié par email
          </p>
          <Link to="/annonces" className="btn-primary inline-block text-sm px-6 py-2">
            Aller aux annonces
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="card p-4 hover:shadow-float transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.is_active ? 'bg-[#EBF5ED]' : 'bg-[#F5F5F7] dark:bg-[#2A2A2A]'
                  }`}>
                    <Bell size={18} className={alert.is_active ? 'text-[#3A7D44]' : 'text-[#94A3B8]'} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                        {alert.name}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        alert.is_active
                          ? 'bg-[#EBF5ED] text-[#3A7D44]'
                          : 'bg-[#F5F5F7] dark:bg-[#2A2A2A] text-[#94A3B8]'
                      }`}>
                        {alert.is_active ? '✅ Active' : '⏸ Inactive'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {alert.city && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">📍 {alert.city}</span>}
                      {alert.type && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{alert.type === 'location' ? '🔑 Location' : '🏷️ Vente'}</span>}
                      {alert.bedrooms && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">🛏 {alert.bedrooms}+ ch.</span>}
                      {alert.min_price && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Min: {new Intl.NumberFormat('fr-FR').format(alert.min_price)} FCFA</span>}
                      {alert.max_price && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Max: {new Intl.NumberFormat('fr-FR').format(alert.max_price)} FCFA</span>}
                    </div>
                    {alert.last_sent_at && (
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Dernier email : {new Date(alert.last_sent_at).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleTest(alert.id)} disabled={testing === alert.id}
                    className="p-2 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors"
                    title="Tester l'email">
                    {testing === alert.id
                      ? <div className="w-4 h-4 border-2 border-[#3A7D44] border-t-transparent rounded-full animate-spin" />
                      : <Mail size={16} />
                    }
                  </button>
                  <button onClick={() => handleToggle(alert.id)}
                    className="p-2 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors"
                    title={alert.is_active ? 'Désactiver' : 'Activer'}>
                    {alert.is_active ? <ToggleRight size={16} className="text-[#3A7D44]" /> : <ToggleLeft size={16} />}
                  </button>
                  <button onClick={() => handleDelete(alert.id)}
                    className="p-2 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-red-50 text-[#64748B] hover:text-red-500 transition-colors"
                    title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MESSAGES ─────────────────────────────────────────────────
function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data.conversations || []);
      } catch (e) {
        toast.error('Erreur chargement conversations');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const openConversation = async (conv) => {
    setSelected(conv);
    try {
      const res = await api.get(`/chat/conversations/${conv.id}/messages`);
      setMessages(res.data.messages || []);
    } catch (e) {}
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      const res = await api.post(`/chat/conversations/${selected.id}/messages`, { content: newMsg });
      setMessages(prev => [...prev, res.data.message]);
      const { getSocket } = await import('../../lib/socket');
      const socket = getSocket();
      const other = selected.buyer_id === user?.id ? selected.owner : selected.buyer;
      socket.emit('send_message', {
        room: selected.id,
        recipientId: other?.id,
        senderName: user?.full_name,
        content: newMsg,
        message: res.data.message,
      });
      setNewMsg('');
    } catch (e) {
      toast.error('Erreur envoi message');
    }
  };

  if (loading) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="card overflow-hidden animate-fade-in" style={{ height: 'calc(100vh - 160px)' }}>
      <div className="flex h-full">
        <div className={`w-full md:w-72 border-r border-[#E2E8F0] dark:border-[#2A2A2A] flex flex-col ${selected ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#E2E8F0] dark:border-[#2A2A2A]">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Mes conversations</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-[#94A3B8]">
                <span className="text-4xl block mb-2">💬</span>
                <p className="text-sm">Aucune conversation</p>
                <p className="text-xs mt-1">Contactez un propriétaire depuis une annonce</p>
              </div>
            ) : conversations.map(conv => {
              const other = conv.buyer_id === user?.id ? conv.owner : conv.buyer;
              return (
                <button key={conv.id} onClick={() => openConversation(conv)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors text-left border-b border-[#E2E8F0] dark:border-[#2A2A2A] ${
                    selected?.id === conv.id ? 'bg-[#EBF5ED] dark:bg-[#2A2A2A]' : ''
                  }`}>
                  <div className="w-10 h-10 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {other?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[#0F172A] dark:text-white truncate">{other?.full_name}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                      {conv.last_message || 'Nouvelle conversation'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${selected ? 'flex' : 'hidden md:flex'}`}>
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-[#94A3B8]">
              <div className="text-center">
                <span className="text-5xl block mb-3">💬</span>
                <p className="text-sm">Sélectionnez une conversation</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-[#E2E8F0] dark:border-[#2A2A2A] flex items-center gap-3">
                <button onClick={() => setSelected(null)} className="md:hidden p-1 rounded-lg hover:bg-[#F5F5F7] text-[#64748B]">←</button>
                <div className="w-8 h-8 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-xs">
                  {(selected.buyer_id === user?.id ? selected.owner : selected.buyer)?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0F172A] dark:text-white">
                    {(selected.buyer_id === user?.id ? selected.owner : selected.buyer)?.full_name}
                  </div>
                  {selected.listings && <div className="text-xs text-[#64748B]">📌 {selected.listings.title}</div>}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                        isMe ? 'bg-[#3A7D44] text-white rounded-br-sm' : 'bg-[#F5F5F7] dark:bg-[#2A2A2A] text-[#0F172A] dark:text-white border border-[#E2E8F0] dark:border-[#3A3A3A] rounded-bl-sm'
                      }`}>
                        {msg.content}
                        <div className={`text-xs mt-1 ${isMe ? 'text-white/60' : 'text-[#94A3B8]'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-[#E2E8F0] dark:border-[#2A2A2A] flex gap-2">
                <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Écrire un message..." className="input-field flex-1" />
                <button type="submit" className="btn-primary px-4 py-2">Envoyer</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROFIL ──────────────────────────────────────────────────
function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/auth/profile', form);
      updateUser(form);
      toast.success('Profil mis à jour ! ✅');
    } catch (e) {
      toast.error('Erreur mise à jour profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="card p-6">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white text-xl mb-6">Mon profil</h2>

        <div className="flex items-center gap-4 mb-6 p-4 bg-[#EBF5ED] dark:bg-[#2A2A2A] rounded-xl">
          <div className="w-16 h-16 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-display font-black text-2xl">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-[#0F172A] dark:text-white">{user?.full_name}</div>
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">{user?.email}</div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#1A1A1A] text-[#3A7D44] mt-1 inline-block">
              🔍 Locataire
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Nom complet</label>
            <input type="text" value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Email</label>
            <input type="email" value={user?.email} disabled
              className="input-field opacity-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Téléphone</label>
            <input type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+229 97 00 00 00" className="input-field" />
          </div>

          <button onClick={handleSave} disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : '✅ Sauvegarder le profil'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────
export default function DashboardTenant() {
  return (
    <DashboardLayout menuItems={MENU} title="Dashboard Locataire">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="recherche" element={<SearchPage />} />
        <Route path="favoris" element={<Favorites />} />
        <Route path="alertes" element={<Alerts />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profil" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
}