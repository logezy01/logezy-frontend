import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Trash2, CheckCircle, Camera, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/common/DashboardLayout';
import ImageUploader from '../../components/common/ImageUploader';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

const MENU = [
  { path: '/dashboard/agent', icon: '📊', label: 'Vue générale' },
  { path: '/dashboard/agent/annonces', icon: '🏘️', label: 'Mes annonces' },
  { path: '/dashboard/agent/messages', icon: '💬', label: 'Messages' },
  { path: '/dashboard/agent/publier', icon: '➕', label: 'Publier une annonce' },
  { path: '/dashboard/agent/profil', icon: '👤', label: 'Mon profil' },
];

function StatCard({ emoji, label, value, color = 'green' }) {
  const colors = {
    green: 'border-[#3A7D44] bg-[#EBF5ED] text-[#3A7D44]',
    blue: 'border-[#3B82F6] bg-[#EFF6FF] text-[#3B82F6]',
    orange: 'border-[#F59E0B] bg-[#FEF3C7] text-yellow-600',
    purple: 'border-[#8B5CF6] bg-purple-50 text-purple-600',
    red: 'border-red-400 bg-red-50 text-red-500',
  };
  return (
    <div className={`card p-5 border-t-4 ${colors[color].split(' ')[0]} hover:shadow-float transition-all`}>
      <div className={`w-10 h-10 rounded-xl ${colors[color].split(' ').slice(1,3).join(' ')} flex items-center justify-center text-xl mb-3`}>
        {emoji}
      </div>
      <div className={`font-display font-black text-3xl ${colors[color].split(' ')[3]}`}>{value}</div>
      <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">{label}</div>
    </div>
  );
}

// ─── VUE GÉNÉRALE ────────────────────────────────────────────
function Overview() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/listings/owner/my-listings');
        const data = res.data.listings || [];
        setListings(data.slice(0, 4));
        setStats({
          total: data.length,
          active: data.filter(l => l.status === 'active').length,
          location: data.filter(l => l.type === 'location').length,
          vente: data.filter(l => l.type === 'vente').length,
          views: data.reduce((sum, l) => sum + (l.views_count || 0), 0),
        });
      } catch (e) {
        toast.error('Erreur chargement données');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header premium */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#3A7D44] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#3A7D44] rounded-full opacity-10 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Agent immobilier 🤝</p>
            <h2 className="font-display text-2xl font-bold">{user?.full_name}</h2>
            <p className="text-white/60 text-sm mt-1">Portefeuille d'annonces Logezy</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-display font-black text-3xl text-white">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 mt-5 relative z-10">
          {[
            { label: 'Total', value: stats?.total || 0 },
            { label: 'Actives', value: stats?.active || 0 },
            { label: 'Location', value: stats?.location || 0 },
            { label: 'Vente', value: stats?.vente || 0 },
            { label: 'Vues', value: stats?.views || 0 },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="font-display font-black text-xl text-white">{s.value}</div>
              <div className="text-white/60 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="🏘️" label="Total annonces" value={stats?.total || 0} color="green" />
        <StatCard emoji="✅" label="Actives" value={stats?.active || 0} color="blue" />
        <StatCard emoji="🔑" label="Locations" value={stats?.location || 0} color="orange" />
        <StatCard emoji="👁️" label="Total vues" value={stats?.views || 0} color="purple" />
      </div>

      {/* Annonces récentes */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Annonces récentes</h3>
          <Link to="/dashboard/agent/annonces" className="text-sm text-[#3A7D44] font-bold hover:underline">
            Voir tout →
          </Link>
        </div>
        {listings.length === 0 ? (
          <div className="text-center py-8 text-[#94A3B8]">
            <span className="text-4xl block mb-2">🏠</span>
            <p className="text-sm mb-4">Aucune annonce publiée</p>
            <Link to="/dashboard/agent/publier" className="btn-primary text-sm px-4 py-2 inline-block">
              Publier ma première annonce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {listings.map(l => (
              <div key={l.id} className="flex items-center gap-3 p-3 bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-xl hover:bg-[#EBF5ED] dark:hover:bg-[#3A3A3A] transition-colors">
                <div className="w-10 h-10 bg-[#EBF5ED] dark:bg-[#3A3A3A] rounded-xl flex items-center justify-center text-lg shrink-0">🏠</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[#0F172A] dark:text-white truncate">{l.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{l.city}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      l.type === 'location' ? 'bg-blue-100 text-blue-600' : 'bg-[#FEF3C7] text-yellow-700'
                    }`}>
                      {l.type === 'location' ? 'Location' : 'Vente'}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-bold text-[#3A7D44] shrink-0">
                  {new Intl.NumberFormat('fr-FR').format(l.price)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/dashboard/agent/publier', icon: '➕', label: 'Nouvelle annonce', color: 'bg-[#EBF5ED]' },
          { to: '/dashboard/agent/annonces', icon: '🏘️', label: 'Mes annonces', color: 'bg-[#EFF6FF]' },
          { to: '/dashboard/agent/messages', icon: '💬', label: 'Messages', color: 'bg-[#FEF3C7]' },
          { to: '/dashboard/agent/profil', icon: '👤', label: 'Mon profil', color: 'bg-purple-50' },
        ].map((a, i) => (
          <Link key={i} to={a.to}
            className={`${a.color} dark:bg-[#2A2A2A] card p-4 flex flex-col items-center text-center gap-2 hover:shadow-float transition-all`}>
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs font-bold text-[#334155] dark:text-[#94A3B8]">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── MES ANNONCES ─────────────────────────────────────────────
function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [uploadingId, setUploadingId] = useState(null);

  const fetchListings = async () => {
    try {
      const res = await api.get('/listings/owner/my-listings');
      setListings(res.data.listings || []);
    } catch (e) {
      toast.error('Erreur chargement annonces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
      await api.delete(`/listings/${id}`);
      toast.success('Annonce supprimée');
      fetchListings();
    } catch (e) {
      toast.error('Erreur suppression');
    }
  };

  const handleToggle = async (id, status) => {
    try {
      await api.put(`/listings/${id}`, { status: status === 'active' ? 'inactive' : 'active' });
      toast.success('Statut mis à jour');
      fetchListings();
    } catch (e) {
      toast.error('Erreur mise à jour');
    }
  };

  const filtered = listings
    .filter(l => filter === 'all' || l.status === filter || l.type === filter)
    .filter(l => !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Portefeuille ({listings.length} annonces)
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input type="text" placeholder="Rechercher..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 py-2 text-xs w-40" />
          </div>
          <div className="flex bg-[#F5F5F7] dark:bg-[#2A2A2A] border border-[#E2E8F0] dark:border-[#3A3A3A] rounded-xl p-1 gap-1">
            {[
              { value: 'all', label: 'Tout' },
              { value: 'active', label: '✅' },
              { value: 'inactive', label: '⏸' },
              { value: 'location', label: '🔑' },
              { value: 'vente', label: '🏷️' },
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f.value ? 'bg-[#3A7D44] text-white' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <Link to="/dashboard/agent/publier" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <Plus size={14} /> Nouvelle
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-[#94A3B8]">
          <span className="text-5xl block mb-3">🏠</span>
          <p className="font-medium dark:text-white mb-4">Aucune annonce trouvée</p>
          <Link to="/dashboard/agent/publier" className="btn-primary inline-block text-sm px-6 py-2">
            Publier une annonce
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(l => (
            <div key={l.id} className="card p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 bg-[#EBF5ED] dark:bg-[#2A2A2A] rounded-xl flex items-center justify-center text-2xl shrink-0">🏠</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-[#0F172A] dark:text-white truncate">{l.title}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">📍 {l.city}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        l.type === 'location' ? 'bg-blue-100 text-blue-600' : 'bg-[#FEF3C7] text-yellow-700'
                      }`}>
                        {l.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        l.status === 'active' ? 'bg-[#EBF5ED] text-[#3A7D44]' :
                        l.status === 'pending' ? 'bg-[#FEF3C7] text-yellow-600' :
                        l.status === 'rejected' ? 'bg-red-100 text-red-500' :
                        'bg-[#F5F5F7] text-[#94A3B8]'
                      }`}>
                        {l.status === 'active' ? '✅ Actif' :
                        l.status === 'pending' ? '⏳ En attente de validation' :
                        l.status === 'rejected' ? '❌ Rejeté' : '⏸ Inactif'}
                      </span>
                    </div>
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                      💰 {new Intl.NumberFormat('fr-FR').format(l.price)} FCFA{l.price_period && `/${l.price_period}`}
                      &nbsp;·&nbsp;👁️ {l.views_count || 0} vues
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {uploadingId === l.id ? (
                    <div className="w-full">
                      <ImageUploader listingId={l.id} onUploadComplete={() => { setUploadingId(null); fetchListings(); }} />
                      <button onClick={() => setUploadingId(null)} className="text-xs text-red-400 mt-1">Annuler</button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => setUploadingId(l.id)}
                        className="p-2 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors" title="Photos">
                        <Camera size={16} />
                      </button>
                      <a href={`/annonces/${l.id}`} target="_blank"
                        className="p-2 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors" title="Voir">
                        <Eye size={16} />
                      </a>
                      <button onClick={() => handleToggle(l.id, l.status)}
                        className="p-2 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EFF6FF] text-[#64748B] hover:text-[#3B82F6] transition-colors" title="Activer/Désactiver">
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => handleDelete(l.id)}
                        className="p-2 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-red-50 text-[#64748B] hover:text-red-500 transition-colors" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
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
        toast.error('Erreur chargement');
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
      toast.error('Erreur envoi');
    }
  };

  if (loading) return <div className="card h-64 animate-pulse" />;

  return (
    <div className="card overflow-hidden animate-fade-in" style={{ height: 'calc(100vh - 160px)' }}>
      <div className="flex h-full">
        <div className={`w-full md:w-72 border-r border-[#E2E8F0] dark:border-[#2A2A2A] flex flex-col ${selected ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#E2E8F0] dark:border-[#2A2A2A]">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">
              Conversations ({conversations.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-[#94A3B8]">
                <span className="text-4xl block mb-2">💬</span>
                <p className="text-sm">Aucune conversation</p>
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

// ─── PUBLIER ──────────────────────────────────────────────────
function PublishListing() {
  const [form, setForm] = useState({
    title: '', description: '', type: 'location', price: '',
    price_period: 'mois', city: '', neighborhood: '',
    bedrooms: 0, bathrooms: 0, living_rooms: 0, area: '',
    floors: 0, is_furnished: false, has_parking: false,
    has_garden: false, has_pool: false, has_security: false,
  });
  const [loading, setLoading] = useState(false);
  const [createdListingId, setCreatedListingId] = useState(null);
  const navigate = useNavigate();
  const CITIES = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon', 'Natitingou', 'Ouidah', 'Lokossa'];
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/listings', form);
      setCreatedListingId(res.data.listing.id);
      toast.success('Annonce créée ! Ajoutez des photos.');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur publication');
    } finally {
      setLoading(false);
    }
  };

  if (createdListingId) {
    return (
      <div className="max-w-2xl mx-auto animate-scale-in">
        <div className="card p-6 text-center">
          <span className="text-5xl block mb-3">🎉</span>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white">Annonce créée !</h2>
          <p className="text-sm text-[#64748B] mt-1 mb-6">Ajoutez des photos pour attirer plus de visiteurs</p>
          <ImageUploader listingId={createdListingId} onUploadComplete={() => {
            setTimeout(() => navigate('/dashboard/agent/annonces'), 1500);
          }} />
          <button onClick={() => navigate('/dashboard/agent/annonces')}
            className="btn-ghost w-full py-2.5 mt-3 text-sm">
            Passer cette étape →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card p-6">
        <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white mb-6">Publier une annonce</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Type d'annonce</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ value: 'location', label: '🔑 Location' }, { value: 'vente', label: '🏷️ Vente' }].map(t => (
                <button key={t.value} type="button" onClick={() => update('type', t.value)}
                  className={`p-3 rounded-xl border-2 text-left font-bold text-sm transition-all ${
                    form.type === t.value ? 'border-[#3A7D44] bg-[#EBF5ED]' : 'border-[#E2E8F0] hover:border-[#3A7D44]/30'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Titre *</label>
            <input type="text" placeholder="Ex: Villa 3 chambres - Cotonou" value={form.title}
              onChange={(e) => update('title', e.target.value)} className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Description</label>
            <textarea placeholder="Décrivez le bien..." value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="input-field min-h-[100px] resize-none" rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Prix (FCFA) *</label>
              <input type="number" placeholder="Ex: 150000" value={form.price}
                onChange={(e) => update('price', e.target.value)} className="input-field" required />
            </div>
            {form.type === 'location' && (
              <div>
                <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Période</label>
                <select value={form.price_period} onChange={(e) => update('price_period', e.target.value)} className="input-field">
                  <option value="mois">Par mois</option>
                  <option value="an">Par an</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Ville *</label>
              <select value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" required>
                <option value="">Choisir une ville</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Quartier</label>
              <input type="text" placeholder="Ex: Cadjehoun" value={form.neighborhood}
                onChange={(e) => update('neighborhood', e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { field: 'bedrooms', label: '🛏 Chambres' },
              { field: 'bathrooms', label: '🚿 SDB' },
              { field: 'living_rooms', label: '🛋 Salons' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">{f.label}</label>
                <input type="number" min="0" value={form[f.field]}
                  onChange={(e) => update(f.field, parseInt(e.target.value))}
                  className="input-field text-center" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">📐 Superficie (m²)</label>
              <input type="number" placeholder="Ex: 120" value={form.area}
                onChange={(e) => update('area', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">🏢 Étages</label>
              <input type="number" min="0" value={form.floors}
                onChange={(e) => update('floors', parseInt(e.target.value))} className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-3">Équipements</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { field: 'is_furnished', label: '🛋 Meublé' },
                { field: 'has_parking', label: '🚗 Parking' },
                { field: 'has_garden', label: '🌿 Jardin' },
                { field: 'has_pool', label: '🏊 Piscine' },
                { field: 'has_security', label: '🔒 Sécurité' },
              ].map(f => (
                <label key={f.field} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  form[f.field] ? 'border-[#3A7D44] bg-[#EBF5ED]' : 'border-[#E2E8F0]'
                }`}>
                  <input type="checkbox" checked={form[f.field]}
                    onChange={(e) => update(f.field, e.target.checked)} className="hidden" />
                  <span className="text-sm font-medium">{f.label}</span>
                  {form[f.field] && <span className="ml-auto text-[#3A7D44] text-xs font-bold">✓</span>}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : '🚀 Créer l\'annonce'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── PROFIL ──────────────────────────────────────────────────
function Profile() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '' });
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
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white text-xl mb-6">Mon profil agent</h2>
        <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-[#0F172A] to-[#3A7D44] rounded-xl">
          <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center font-display font-black text-2xl border-2 border-white/20">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-white">{user?.full_name}</div>
            <div className="text-sm text-white/60">{user?.email}</div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white mt-1 inline-block">
              🤝 Agent immobilier
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Nom complet</label>
            <input type="text" value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Email</label>
            <input type="email" value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
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
export default function DashboardAgent() {
  return (
    <DashboardLayout menuItems={MENU} title="Dashboard Agent">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="annonces" element={<MyListings />} />
        <Route path="messages" element={<Messages />} />
        <Route path="publier" element={<PublishListing />} />
        <Route path="profil" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
}