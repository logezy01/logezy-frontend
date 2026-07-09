import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, Users, Home, Search, Trash2, Ban, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import SwipeValidation from '../../components/admin/SwipeValidation';

const MENU = [
  { path: '/dashboard/admin', icon: '📊', label: 'Vue générale' },
  { path: '/dashboard/admin/validation', icon: '⏳', label: 'Validation annonces' },
  { path: '/dashboard/admin/utilisateurs', icon: '👥', label: 'Utilisateurs' },
  { path: '/dashboard/admin/annonces', icon: '🏘️', label: 'Toutes les annonces' },
  { path: '/dashboard/admin/messages', icon: '✉️', label: 'Écrire aux users' },
  { path: '/dashboard/admin/stats', icon: '📈', label: 'Statistiques' },
];

function StatCard({ emoji, label, value, color = 'green', loading, urgent }) {
  const colors = {
    green: 'border-[#3A7D44] bg-[#EBF5ED]',
    blue: 'border-[#3B82F6] bg-[#EFF6FF]',
    orange: 'border-[#F59E0B] bg-[#FEF3C7]',
    purple: 'border-[#8B5CF6] bg-purple-50',
    red: 'border-red-400 bg-red-50',
  };
  const textColors = {
    green: 'text-[#3A7D44]',
    blue: 'text-[#3B82F6]',
    orange: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-500',
  };
  return (
    <div className={`card p-5 border-t-4 ${colors[color]} hover:shadow-float transition-all ${urgent ? 'ring-2 ring-red-400 ring-offset-2' : ''}`}>
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center text-xl mb-3`}>
        {emoji}
      </div>
      <div className={`font-display font-black text-3xl ${textColors[color]} ${loading ? 'animate-pulse' : ''}`}>
        {loading ? '...' : value}
      </div>
      <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">{label}</div>
      {urgent && value > 0 && (
        <div className="text-xs text-red-500 font-bold mt-1">⚠️ Action requise</div>
      )}
    </div>
  );
}

function ProgressBar({ label, value, total, color = '#3A7D44', emoji }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-sm font-medium text-[#334155] dark:text-[#94A3B8]">
          <span>{emoji}</span><span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[#0F172A] dark:text-white">{value}</span>
          <span className="text-xs text-[#94A3B8]">({pct}%)</span>
        </div>
      </div>
      <div className="w-full bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-full h-2.5">
        <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── VUE GÉNÉRALE ────────────────────────────────────────────
function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, usersRes, listingsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/listings'),
        ]);
        setStats(statsRes.data.stats);
        setRecentUsers((usersRes.data.users || []).slice(0, 5));
        setRecentListings((listingsRes.data.listings || []).slice(0, 5));
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
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#3A7D44] rounded-full opacity-10 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#3A7D44] rounded-full animate-pulse" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Administration</span>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1">Dashboard Admin</h2>
            <p className="text-white/60 text-sm">Vue globale de la plateforme Logezy</p>
          </div>
          <div className="text-5xl">⚙️</div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6 relative z-10">
          {[
            { label: 'Utilisateurs', value: stats?.total_users || 0, emoji: '👥' },
            { label: 'Annonces', value: stats?.total_listings || 0, emoji: '🏠' },
            { label: 'En attente', value: stats?.pending_listings || 0, emoji: '⏳' },
            { label: 'Messages', value: stats?.total_messages || 0, emoji: '✉️' },
          ].map((s, i) => (
            <div key={i} className={`backdrop-blur rounded-xl p-3 text-center ${s.emoji === '⏳' && s.value > 0 ? 'bg-red-500/20 border border-red-400/30' : 'bg-white/10'}`}>
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className="font-display font-black text-xl text-white">{loading ? '...' : s.value}</div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="👥" label="Utilisateurs" value={stats?.total_users || 0} color="blue" loading={loading} />
        <StatCard emoji="✅" label="Annonces actives" value={stats?.listings_by_status?.active || 0} color="green" loading={loading} />
        <StatCard emoji="⏳" label="En attente validation" value={stats?.pending_listings || 0} color="orange" loading={loading} urgent={true} />
        <StatCard emoji="💬" label="Conversations" value={stats?.total_conversations || 0} color="purple" loading={loading} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { to: '/dashboard/admin/validation', icon: '⏳', label: 'Valider annonces', desc: `${stats?.pending_listings || 0} en attente`, color: 'bg-[#FEF3C7]', urgent: (stats?.pending_listings || 0) > 0 },
          { to: '/dashboard/admin/utilisateurs', icon: '👥', label: 'Gérer utilisateurs', desc: `${stats?.total_users || 0} comptes`, color: 'bg-[#EFF6FF]', urgent: false },
          { to: '/dashboard/admin/annonces', icon: '🏘️', label: 'Toutes les annonces', desc: `${stats?.total_listings || 0} annonces`, color: 'bg-[#EBF5ED]', urgent: false },
          { to: '/dashboard/admin/messages', icon: '✉️', label: 'Écrire aux users', desc: 'Contacter un utilisateur', color: 'bg-purple-50', urgent: false },
          { to: '/dashboard/admin/stats', icon: '📈', label: 'Statistiques', desc: 'Analyse complète', color: 'bg-[#EFF6FF]', urgent: false },
        ].map((a, i) => (
          <Link key={i} to={a.to}
            className={`${a.color} dark:bg-[#2A2A2A] card p-4 flex flex-col gap-2 hover:shadow-float transition-all ${a.urgent ? 'ring-2 ring-yellow-400' : ''}`}>
            <span className="text-2xl">{a.icon}</span>
            <span className="font-bold text-sm text-[#0F172A] dark:text-white">{a.label}</span>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{a.desc}</span>
            {a.urgent && <span className="text-xs text-yellow-600 font-bold">⚠️ Action requise</span>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Derniers inscrits</h3>
            <Link to="/dashboard/admin/utilisateurs" className="text-xs text-[#3A7D44] font-bold hover:underline">Voir tout →</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {u.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">
                    {u.full_name} {u.is_super_admin && <span className="text-purple-500">👑</span>}
                  </div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] capitalize">{u.role}</div>
                </div>
                <div className="text-xs text-[#94A3B8]">{new Date(u.created_at).toLocaleDateString('fr-FR')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Dernières annonces</h3>
            <Link to="/dashboard/admin/annonces" className="text-xs text-[#3A7D44] font-bold hover:underline">Voir tout →</Link>
          </div>
          <div className="space-y-3">
            {recentListings.map(l => (
              <div key={l.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EBF5ED] dark:bg-[#2A2A2A] flex items-center justify-center text-sm shrink-0">🏠</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">{l.title}</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{l.city}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  l.status === 'active' ? 'bg-[#EBF5ED] text-[#3A7D44]' :
                  l.status === 'pending' ? 'bg-[#FEF3C7] text-yellow-600' :
                  'bg-red-50 text-red-500'
                }`}>
                  {l.status === 'active' ? '✅' : l.status === 'pending' ? '⏳' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VALIDATION ANNONCES ──────────────────────────────────────
function ValidationListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [swipeMode, setSwipeMode] = useState(false);

  const fetchListings = async () => {
    try {
      const res = await api.get('/admin/listings/pending');
      setListings(res.data.listings || []);
    } catch (e) {
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/approve`);
      toast.success('✅ Annonce approuvée !');
      fetchListings();
    } catch (e) {
      toast.error('Erreur approbation');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/reject`, { reason: rejectReason });
      toast.success('❌ Annonce rejetée.');
      setRejectModal(null);
      setRejectReason('');
      fetchListings();
    } catch (e) {
      toast.error('Erreur rejet');
    }
  };

  if (loading) return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Annonces en attente ({listings.length})
        </h2>
        <div className="flex items-center gap-3">
          {listings.length > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full animate-pulse">
              ⚠️ {listings.length} à valider
            </span>
          )}
          {listings.length > 0 && (
            <button onClick={() => setSwipeMode(!swipeMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                swipeMode
                  ? 'bg-[#3A7D44] text-white shadow-lg'
                  : 'bg-[#F5F5F7] dark:bg-[#2A2A2A] text-[#64748B] hover:bg-[#EBF5ED] hover:text-[#3A7D44]'
              }`}>
              {swipeMode ? '📋 Vue liste' : '👆 Mode Swipe'}
            </button>
          )}
        </div>
      </div>

      {/* Mode Swipe */}
      {swipeMode && listings.length > 0 ? (
        <SwipeValidation
          listings={listings}
          onApprove={async (id) => {
            await api.put(`/admin/listings/${id}/approve`);
            toast.success('✅ Annonce approuvée !');
          }}
          onReject={async (id) => {
            await api.put(`/admin/listings/${id}/reject`, { reason: 'Rejeté via mode swipe' });
            toast.error('❌ Annonce rejetée');
          }}
          onAllDone={() => {
            setSwipeMode(false);
            fetchListings();
          }}
        />
      ) : (
        <>
          {/* Vue liste classique */}
          {listings.length === 0 ? (
            <div className="card p-12 text-center text-[#94A3B8]">
              <span className="text-5xl block mb-3">✅</span>
              <p className="font-medium dark:text-white">Aucune annonce en attente</p>
              <p className="text-sm mt-1">Toutes les annonces ont été traitées</p>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map(l => (
                <div key={l.id} className="card p-5 border-l-4 border-yellow-400">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-[#FEF3C7] text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                          ⏳ En attente
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          l.type === 'location' ? 'bg-blue-100 text-blue-600' : 'bg-[#FEF3C7] text-yellow-700'
                        }`}>
                          {l.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0F172A] dark:text-white mb-1">{l.title}</h3>
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-2">
                        📍 {l.city} {l.neighborhood && `· ${l.neighborhood}`}
                      </p>
                      {l.description && (
                        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mb-2">
                          {l.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
                        <span>💰 {new Intl.NumberFormat('fr-FR').format(l.price)} FCFA{l.price_period ? `/${l.price_period}` : ''}</span>
                        {l.bedrooms > 0 && <span>🛏 {l.bedrooms} ch.</span>}
                        {l.area && <span>📐 {l.area}m²</span>}
                      </div>
                      <div className="mt-2 p-2 bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-lg">
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                          👤 <strong className="text-[#0F172A] dark:text-white">{l.users?.full_name}</strong>
                          {l.users?.email && ` (${l.users.email})`}
                        </p>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <a href={`/annonces/${l.id}`} target="_blank"
                        className="p-2 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors">
                        <Eye size={16} />
                      </a>
                      <button onClick={() => handleApprove(l.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#3A7D44] text-white rounded-xl text-sm font-bold hover:bg-[#2D6235] transition-colors">
                        <CheckCircle size={16} /> Approuver
                      </button>
                      <button onClick={() => setRejectModal(l)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">
                        <XCircle size={16} /> Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal rejet */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-2">Rejeter l'annonce</h3>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">"{rejectModal.title}"</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Raison du rejet (optionnel)..."
              className="input-field min-h-[100px] resize-none mb-4" rows={4} />
            <div className="flex gap-3">
              <button onClick={() => handleReject(rejectModal.id)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-btn font-bold flex items-center justify-center gap-2">
                <XCircle size={16} /> Confirmer
              </button>
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="btn-secondary flex-1 py-2.5">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UTILISATEURS ─────────────────────────────────────────────
function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [messageModal, setMessageModal] = useState(null);
  const [banModal, setBanModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [msgForm, setMsgForm] = useState({ subject: '', message: '' });
  const [banReason, setBanReason] = useState('');
  const { user } = useAuthStore();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      const allUsers = res.data.users || [];
      setUsers(allUsers);
      // Vérifier si l'admin connecté est super admin
      const me = allUsers.find(u => u.id === user?.id);
      setIsSuperAdmin(me?.is_super_admin || false);
    } catch (e) {
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur');
    }
  };

  const handleBan = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/ban`, { reason: banReason });
      toast.success(res.data.message);
      setBanModal(null);
      setBanReason('');
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur bannissement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('Compte supprimé définitivement');
      setDeleteModal(null);
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur suppression');
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      const res = await api.put(`/admin/users/${id}/role`, { role: newRole });
      toast.success(res.data.message);
      fetchUsers();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur changement rôle');
    }
  };

  const handleSendMessage = async (id) => {
    try {
      await api.post(`/admin/users/${id}/message`, msgForm);
      toast.success('Message envoyé ! ✉️');
      setMessageModal(null);
      setMsgForm({ subject: '', message: '' });
    } catch (e) {
      toast.error('Erreur envoi message');
    }
  };

  const ROLE_COLORS = {
    locataire: 'bg-blue-100 text-blue-700',
    proprietaire: 'bg-[#EBF5ED] text-[#3A7D44]',
    agent: 'bg-[#FEF3C7] text-yellow-700',
    admin: 'bg-purple-100 text-purple-600',
  };

  const filtered = users
    .filter(u => filter === 'all' || u.role === filter || (filter === 'banned' && u.is_banned))
    .filter(u => !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-16 animate-pulse" />)}</div>;

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Bandeau super admin */}
      {isSuperAdmin && (
        <div className="p-3 rounded-xl flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.2)' }}>
          <span className="text-xl">👑</span>
          <div>
            <div className="text-sm font-bold text-purple-600">Vous êtes Super Admin</div>
            <div className="text-xs text-[#94A3B8]">Vous pouvez gérer tous les comptes, y compris les admins</div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Utilisateurs ({users.length})
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input type="text" placeholder="Rechercher..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 py-2 text-xs w-48" />
          </div>
          <div className="flex bg-[#F5F5F7] dark:bg-[#2A2A2A] border border-[#E2E8F0] dark:border-[#3A3A3A] rounded-xl p-1 gap-1">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'locataire', label: '🔍' },
              { value: 'proprietaire', label: '🏠' },
              { value: 'agent', label: '🤝' },
              { value: 'admin', label: '⚙️' },
              { value: 'banned', label: '🚫' },
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f.value ? 'bg-[#3A7D44] text-white' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F5F7] dark:bg-[#2A2A2A] border-b border-[#E2E8F0] dark:border-[#3A3A3A]">
              <tr>
                {['Utilisateur', 'Rôle', 'Statut', 'Inscrit le', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2A2A]">
              {filtered.map(u => (
                <tr key={u.id} className={`hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors ${u.is_banned ? 'bg-red-50/50 dark:bg-red-900/10' : ''} ${u.is_super_admin ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs ${
                        u.is_super_admin ? 'bg-purple-500' :
                        u.is_banned ? 'bg-red-500' : 'bg-[#3A7D44]'
                      }`}>
                        {u.is_super_admin ? '👑' : u.is_banned ? '🚫' : u.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-[#0F172A] dark:text-white flex items-center gap-1">
                          {u.full_name}
                          {u.is_super_admin && <span className="text-xs bg-purple-100 text-purple-600 font-bold px-1.5 py-0.5 rounded-full">👑 Super Admin</span>}
                        </div>
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{u.email}</div>
                        {u.is_banned && <div className="text-xs text-red-500 font-bold">🚫 {u.ban_reason}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${ROLE_COLORS[u.role] || 'bg-gray-100'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      u.is_banned ? 'bg-red-100 text-red-600' :
                      u.is_active ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-[#F5F5F7] text-[#94A3B8]'
                    }`}>
                      {u.is_banned ? '🚫 Banni' : u.is_active ? '✅ Actif' : '⏸ Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">

                      {/* Écrire — toujours disponible */}
                      <button onClick={() => setMessageModal(u)}
                        className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors"
                        title="Envoyer un message">
                        <Mail size={14} />
                      </button>

                      {/* Activer/Désactiver — pas pour super admin */}
                      {!u.is_super_admin && (
                        <button onClick={() => handleToggle(u.id)}
                          className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors"
                          title={u.is_active ? 'Désactiver' : 'Activer'}>
                          <CheckCircle size={14} />
                        </button>
                      )}

                      {/* Bannir — pas pour super admin */}
                      {!u.is_super_admin && (
                        <button onClick={() => setBanModal(u)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.is_banned
                              ? 'bg-[#EBF5ED] text-[#3A7D44]'
                              : 'bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-orange-50 text-[#64748B] hover:text-orange-500'
                          }`}
                          title={u.is_banned ? 'Lever le bannissement' : 'Bannir'}>
                          <Ban size={14} />
                        </button>
                      )}

                      {/* Changer rôle — super admin uniquement, pas sur soi-même */}
                      {isSuperAdmin && !u.is_super_admin && u.id !== user?.id && (
                        <select value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="text-xs border border-[#E2E8F0] dark:border-[#2A2A2A] rounded-lg px-1.5 py-1 bg-white dark:bg-[#2A2A2A] text-[#334155] dark:text-[#94A3B8] cursor-pointer"
                          title="Changer le rôle">
                          <option value="locataire">Locataire</option>
                          <option value="proprietaire">Propriétaire</option>
                          <option value="agent">Agent</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}

                      {/* Supprimer — pas pour super admin, admin normal ne peut pas supprimer autre admin */}
                      {!u.is_super_admin && (isSuperAdmin || u.role !== 'admin') && u.id !== user?.id && (
                        <button onClick={() => setDeleteModal(u)}
                          className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-red-50 text-[#64748B] hover:text-red-500 transition-colors"
                          title="Supprimer définitivement">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#94A3B8]">
              <span className="text-4xl block mb-2">👥</span>
              <p className="text-sm">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal message */}
      {messageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-1">
              ✉️ Écrire à {messageModal.full_name}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-4">{messageModal.email}</p>
            <div className="space-y-3">
              <input type="text" value={msgForm.subject}
                onChange={(e) => setMsgForm({ ...msgForm, subject: e.target.value })}
                placeholder="Sujet" className="input-field" />
              <textarea value={msgForm.message}
                onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
                placeholder="Votre message..." className="input-field min-h-[120px] resize-none" rows={5} />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => handleSendMessage(messageModal.id)}
                className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2">
                <Send size={16} /> Envoyer
              </button>
              <button onClick={() => { setMessageModal(null); setMsgForm({ subject: '', message: '' }); }}
                className="btn-secondary flex-1 py-2.5">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal bannissement */}
      {banModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-3">
              {banModal.is_banned ? '✅ Lever le bannissement' : '🚫 Bannir'} — {banModal.full_name}
            </h3>
            {!banModal.is_banned && (
              <input type="text" value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Raison du bannissement..." className="input-field mb-3" />
            )}
            <div className="flex gap-3">
              <button onClick={() => handleBan(banModal.id)}
                className={`flex-1 py-2.5 rounded-btn font-bold text-sm flex items-center justify-center gap-2 ${
                  banModal.is_banned ? 'bg-[#3A7D44] text-white' : 'bg-red-500 text-white'
                }`}>
                <Ban size={16} />
                {banModal.is_banned ? 'Lever le bannissement' : 'Bannir'}
              </button>
              <button onClick={() => { setBanModal(null); setBanReason(''); }}
                className="btn-secondary flex-1 py-2.5">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-display font-bold text-red-500 mb-2">⚠️ Suppression définitive</h3>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
              <p className="font-bold text-[#0F172A] dark:text-white">{deleteModal.full_name}</p>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{deleteModal.email}</p>
            </div>
            <p className="text-xs text-red-500 font-bold mb-4">⚠️ Cette action est irréversible !</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteModal.id)}
                className="flex-1 py-2.5 rounded-btn bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2">
                <Trash2 size={16} /> Supprimer définitivement
              </button>
              <button onClick={() => setDeleteModal(null)} className="btn-secondary flex-1 py-2.5">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TOUTES LES ANNONCES ──────────────────────────────────────
function ListingsAdmin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState(null);

  const fetchListings = async () => {
    try {
      const res = await api.get('/admin/listings');
      setListings(res.data.listings || []);
    } catch (e) {
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/admin/listings/${id}/status`, { status });
      toast.success('Statut mis à jour');
      fetchListings();
    } catch (e) { toast.error('Erreur'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/listings/${id}`);
      toast.success('Annonce supprimée définitivement');
      setDeleteModal(null);
      fetchListings();
    } catch (e) { toast.error('Erreur suppression'); }
  };

  const filtered = listings
    .filter(l => filter === 'all' || l.status === filter || l.type === filter)
    .filter(l => !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-16 animate-pulse" />)}</div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">Toutes les annonces ({listings.length})</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input type="text" placeholder="Rechercher..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 py-2 text-xs w-48" />
          </div>
          <div className="flex bg-[#F5F5F7] dark:bg-[#2A2A2A] border border-[#E2E8F0] dark:border-[#3A3A3A] rounded-xl p-1 gap-1">
            {[
              { value: 'all', label: 'Toutes' },
              { value: 'pending', label: '⏳' },
              { value: 'active', label: '✅' },
              { value: 'rejected', label: '❌' },
              { value: 'inactive', label: '⏸' },
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f.value ? 'bg-[#3A7D44] text-white' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F5F7] dark:bg-[#2A2A2A] border-b border-[#E2E8F0] dark:border-[#3A3A3A]">
              <tr>
                {['Annonce', 'Propriétaire', 'Type', 'Prix', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2A2A]">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm text-[#0F172A] dark:text-white max-w-xs truncate">{l.title}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">📍 {l.city} · 👁️ {l.views_count || 0}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{l.users?.full_name}</div>
                    <div className="text-xs text-[#94A3B8] capitalize">{l.users?.role}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${l.type === 'location' ? 'bg-blue-100 text-blue-600' : 'bg-[#FEF3C7] text-yellow-700'}`}>
                      {l.type === 'location' ? '🔑' : '🏷️'} {l.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#3A7D44]">
                    {new Intl.NumberFormat('fr-FR').format(l.price)} FCFA
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      l.status === 'active' ? 'bg-[#EBF5ED] text-[#3A7D44]' :
                      l.status === 'pending' ? 'bg-[#FEF3C7] text-yellow-600' :
                      l.status === 'rejected' ? 'bg-red-100 text-red-500' :
                      'bg-[#F5F5F7] text-[#94A3B8]'
                    }`}>
                      {l.status === 'active' ? '✅ Actif' : l.status === 'pending' ? '⏳ En attente' : l.status === 'rejected' ? '❌ Rejeté' : '⏸ Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <a href={`/annonces/${l.id}`} target="_blank"
                        className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors">
                        <Eye size={14} />
                      </a>
                      {l.status !== 'active' && (
                        <button onClick={() => handleStatus(l.id, 'active')}
                          className="p-1.5 rounded-lg bg-[#EBF5ED] text-[#3A7D44] hover:bg-[#3A7D44] hover:text-white transition-colors">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {l.status === 'active' && (
                        <button onClick={() => handleStatus(l.id, 'inactive')}
                          className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-orange-50 text-[#64748B] hover:text-orange-500 transition-colors">
                          <XCircle size={14} />
                        </button>
                      )}
                      <button onClick={() => setDeleteModal(l)}
                        className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-red-50 text-[#64748B] hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-display font-bold text-red-500 mb-2">⚠️ Supprimer définitivement</h3>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
              <p className="font-bold text-[#0F172A] dark:text-white">{deleteModal.title}</p>
            </div>
            <p className="text-xs text-red-500 font-bold mb-4">⚠️ Cette action est irréversible !</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteModal.id)}
                className="flex-1 py-2.5 rounded-btn bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2">
                <Trash2 size={16} /> Supprimer
              </button>
              <button onClick={() => setDeleteModal(null)} className="btn-secondary flex-1 py-2.5">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ÉCRIRE AUX USERS ─────────────────────────────────────────
function WriteToUsers() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    };
    fetch();
  }, []);

  const handleSend = async () => {
    if (!selected) { toast.error('Sélectionnez un utilisateur'); return; }
    if (!form.subject || !form.message) { toast.error('Sujet et message requis'); return; }
    setLoading(true);
    try {
      await api.post(`/admin/users/${selected.id}/message`, form);
      toast.success(`Message envoyé à ${selected.full_name} ! ✉️`);
      setSelected(null);
      setForm({ subject: '', message: '' });
    } catch (e) {
      toast.error('Erreur envoi');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="font-display font-bold text-[#0F172A] dark:text-white">✉️ Écrire à un utilisateur</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mb-3">1. Choisir le destinataire</h3>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input type="text" placeholder="Rechercher..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 py-2 text-xs" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredUsers.map(u => (
              <button key={u.id} onClick={() => setSelected(u)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  selected?.id === u.id ? 'bg-[#EBF5ED] border-2 border-[#3A7D44]' : 'bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED]'
                }`}>
                <div className="w-8 h-8 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {u.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">
                    {u.full_name} {u.is_super_admin && '👑'}
                  </div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">{u.email}</div>
                </div>
                {selected?.id === u.id && <span className="text-[#3A7D44] font-bold">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mb-3">2. Rédiger le message</h3>
          {selected ? (
            <div className="mb-3 p-2 bg-[#EBF5ED] dark:bg-[#2A2A2A] rounded-lg">
              <p className="text-xs font-bold text-[#3A7D44]">À : {selected.full_name} ({selected.email})</p>
            </div>
          ) : (
            <div className="mb-3 p-2 bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-lg">
              <p className="text-xs text-[#94A3B8]">Sélectionnez d'abord un utilisateur</p>
            </div>
          )}
          <div className="space-y-3">
            <input type="text" value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Sujet" className="input-field text-sm" />
            <textarea value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Votre message..." className="input-field min-h-[150px] resize-none text-sm" rows={6} />
            <button onClick={handleSend} disabled={loading || !selected}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Send size={16} /> Envoyer le message</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STATISTIQUES ─────────────────────────────────────────────
function StatsAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } catch (e) {}
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="font-display font-bold text-[#0F172A] dark:text-white">📈 Statistiques détaillées</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="👥" label="Utilisateurs" value={stats?.total_users || 0} color="blue" loading={loading} />
        <StatCard emoji="🏠" label="Annonces" value={stats?.total_listings || 0} color="green" loading={loading} />
        <StatCard emoji="⏳" label="En attente" value={stats?.pending_listings || 0} color="orange" loading={loading} urgent={true} />
        <StatCard emoji="💬" label="Messages" value={stats?.total_messages || 0} color="purple" loading={loading} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-5">👥 Utilisateurs par rôle</h3>
          <ProgressBar emoji="🔍" label="Locataires" value={stats?.users_by_role?.locataire || 0} total={stats?.total_users || 1} color="#3B82F6" />
          <ProgressBar emoji="🏠" label="Propriétaires" value={stats?.users_by_role?.proprietaire || 0} total={stats?.total_users || 1} color="#3A7D44" />
          <ProgressBar emoji="🤝" label="Agents" value={stats?.users_by_role?.agent || 0} total={stats?.total_users || 1} color="#F59E0B" />
          <ProgressBar emoji="⚙️" label="Admins" value={stats?.users_by_role?.admin || 0} total={stats?.total_users || 1} color="#8B5CF6" />
        </div>
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-5">🏠 Annonces</h3>
          <ProgressBar emoji="⏳" label="En attente" value={stats?.listings_by_status?.pending || 0} total={stats?.total_listings || 1} color="#F59E0B" />
          <ProgressBar emoji="✅" label="Actives" value={stats?.listings_by_status?.active || 0} total={stats?.total_listings || 1} color="#3A7D44" />
          <ProgressBar emoji="❌" label="Rejetées" value={stats?.listings_by_status?.rejected || 0} total={stats?.total_listings || 1} color="#EF4444" />
          <ProgressBar emoji="⏸" label="Inactives" value={stats?.listings_by_status?.inactive || 0} total={stats?.total_listings || 1} color="#94A3B8" />
        </div>
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────
export default function DashboardAdmin() {
  return (
    <DashboardLayout menuItems={MENU} title="Administration Logezy">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="validation" element={<ValidationListings />} />
        <Route path="utilisateurs" element={<UsersList />} />
        <Route path="annonces" element={<ListingsAdmin />} />
        <Route path="messages" element={<WriteToUsers />} />
        <Route path="stats" element={<StatsAdmin />} />
      </Routes>
    </DashboardLayout>
  );
}