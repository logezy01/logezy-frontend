import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, Users, Home, MessageSquare, TrendingUp, Bell, Shield, Activity, BarChart2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../lib/axios';

const MENU = [
  { path: '/dashboard/admin', icon: '📊', label: 'Vue générale' },
  { path: '/dashboard/admin/utilisateurs', icon: '👥', label: 'Utilisateurs' },
  { path: '/dashboard/admin/annonces', icon: '🏘️', label: 'Annonces' },
  { path: '/dashboard/admin/messages', icon: '💬', label: 'Messages' },
  { path: '/dashboard/admin/stats', icon: '📈', label: 'Statistiques' },
];

// ─── CARTE STAT ──────────────────────────────────────────────
function StatCard({ emoji, label, value, sub, color = 'green', loading }) {
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
    <div className={`card p-5 border-t-4 ${colors[color]} hover:shadow-float transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center text-xl`}>
          {emoji}
        </div>
        {sub && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{sub}</span>}
      </div>
      <div className={`font-display font-black text-3xl ${textColors[color]} ${loading ? 'animate-pulse' : ''}`}>
        {loading ? '...' : value}
      </div>
      <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">{label}</div>
    </div>
  );
}

// ─── BARRE DE PROGRESSION ────────────────────────────────────
function ProgressBar({ label, value, total, color = '#3A7D44', emoji }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-sm font-medium text-[#334155] dark:text-[#94A3B8]">
          <span>{emoji}</span>
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[#0F172A] dark:text-white">{value}</span>
          <span className="text-xs text-[#94A3B8]">({pct}%)</span>
        </div>
      </div>
      <div className="w-full bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
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

      {/* Header premium */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#3A7D44] rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[#3A7D44] rounded-full animate-pulse" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Panneau d'administration</span>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1">Tableau de bord Admin</h2>
            <p className="text-white/60 text-sm">Vue globale de la plateforme Logezy</p>
          </div>
          <div className="text-5xl">⚙️</div>
        </div>

        {/* Mini stats dans le header */}
        <div className="grid grid-cols-4 gap-4 mt-6 relative z-10">
          {[
            { label: 'Utilisateurs', value: stats?.total_users || 0, emoji: '👥' },
            { label: 'Annonces', value: stats?.total_listings || 0, emoji: '🏠' },
            { label: 'Conversations', value: stats?.total_conversations || 0, emoji: '💬' },
            { label: 'Messages', value: stats?.total_messages || 0, emoji: '✉️' },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className={`font-display font-black text-xl text-white ${loading ? 'animate-pulse' : ''}`}>
                {loading ? '...' : s.value}
              </div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats détaillées */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="👥" label="Utilisateurs total" value={stats?.total_users || 0} color="blue" loading={loading} />
        <StatCard emoji="🏘️" label="Annonces actives" value={stats?.listings_by_status?.active || 0} color="green" loading={loading} />
        <StatCard emoji="💬" label="Conversations" value={stats?.total_conversations || 0} color="orange" loading={loading} />
        <StatCard emoji="✉️" label="Messages échangés" value={stats?.total_messages || 0} color="purple" loading={loading} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Répartition utilisateurs */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
              <Users size={16} className="text-[#3B82F6]" />
            </div>
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Utilisateurs par rôle</h3>
          </div>
          <ProgressBar emoji="🔍" label="Locataires" value={stats?.users_by_role?.locataire || 0} total={stats?.total_users || 1} color="#3B82F6" />
          <ProgressBar emoji="🏠" label="Propriétaires" value={stats?.users_by_role?.proprietaire || 0} total={stats?.total_users || 1} color="#3A7D44" />
          <ProgressBar emoji="🤝" label="Agents" value={stats?.users_by_role?.agent || 0} total={stats?.total_users || 1} color="#F59E0B" />
          <ProgressBar emoji="⚙️" label="Admins" value={stats?.users_by_role?.admin || 0} total={stats?.total_users || 1} color="#8B5CF6" />
        </div>

        {/* Répartition annonces */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-[#EBF5ED] rounded-xl flex items-center justify-center">
              <Home size={16} className="text-[#3A7D44]" />
            </div>
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Annonces par type</h3>
          </div>
          <ProgressBar emoji="🔑" label="Location" value={stats?.listings_by_type?.location || 0} total={stats?.total_listings || 1} color="#3B82F6" />
          <ProgressBar emoji="🏷️" label="Vente" value={stats?.listings_by_type?.vente || 0} total={stats?.total_listings || 1} color="#F59E0B" />
          <div className="border-t border-[#E2E8F0] dark:border-[#2A2A2A] pt-4 mt-4">
            <p className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mb-3">Par statut</p>
            <ProgressBar emoji="✅" label="Actives" value={stats?.listings_by_status?.active || 0} total={stats?.total_listings || 1} color="#3A7D44" />
            <ProgressBar emoji="⏸" label="Inactives" value={stats?.listings_by_status?.inactive || 0} total={stats?.total_listings || 1} color="#94A3B8" />
          </div>
        </div>
      </div>

      {/* Derniers utilisateurs + annonces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Derniers inscrits */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Derniers inscrits</h3>
            <Link to="/dashboard/admin/utilisateurs" className="text-xs text-[#3A7D44] font-bold hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {u.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">{u.full_name}</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] capitalize">{u.role}</div>
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {new Date(u.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières annonces */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Dernières annonces</h3>
            <Link to="/dashboard/admin/annonces" className="text-xs text-[#3A7D44] font-bold hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-3">
            {recentListings.map(l => (
              <div key={l.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EBF5ED] dark:bg-[#2A2A2A] flex items-center justify-center text-sm shrink-0">
                  🏠
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">{l.title}</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{l.city}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  l.status === 'active' ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-red-50 text-red-500'
                }`}>
                  {l.status === 'active' ? '✅' : '⏸'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides admin */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/dashboard/admin/utilisateurs', icon: '👥', label: 'Gérer utilisateurs', color: 'bg-[#EFF6FF]' },
            { to: '/dashboard/admin/annonces', icon: '🏘️', label: 'Modérer annonces', color: 'bg-[#EBF5ED]' },
            { to: '/dashboard/admin/messages', icon: '💬', label: 'Voir messages', color: 'bg-[#FEF3C7]' },
            { to: '/dashboard/admin/stats', icon: '📈', label: 'Statistiques', color: 'bg-purple-50' },
          ].map((a, i) => (
            <Link key={i} to={a.to}
              className={`${a.color} dark:bg-[#2A2A2A] rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:shadow-float transition-all`}>
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-bold text-[#334155] dark:text-[#94A3B8]">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── UTILISATEURS ─────────────────────────────────────────────
function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (e) {
      toast.error('Erreur chargement utilisateurs');
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
      toast.error('Erreur mise à jour');
    }
  };

  const ROLE_COLORS = {
    locataire: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    proprietaire: 'bg-[#EBF5ED] text-[#3A7D44]',
    agent: 'bg-[#FEF3C7] text-yellow-700',
    admin: 'bg-purple-100 text-purple-600',
  };

  const filtered = users
    .filter(u => filter === 'all' || u.role === filter)
    .filter(u => !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <div key={i} className="card h-16 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Utilisateurs ({users.length})
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Recherche */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 py-2 text-xs w-48"
            />
          </div>
          {/* Filtres */}
          <div className="flex bg-[#F5F5F7] dark:bg-[#2A2A2A] border border-[#E2E8F0] dark:border-[#3A3A3A] rounded-xl p-1 gap-1">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'locataire', label: '🔍' },
              { value: 'proprietaire', label: '🏠' },
              { value: 'agent', label: '🤝' },
              { value: 'admin', label: '⚙️' },
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
                {['Utilisateur', 'Rôle', 'Téléphone', 'Inscrit le', 'Statut', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2A2A]">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-xs">
                        {u.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-[#0F172A] dark:text-white">{u.full_name}</div>
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748B] dark:text-[#94A3B8]">{u.phone || '—'}</td>
                  <td className="px-4 py-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      u.is_active ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-red-50 text-red-500'
                    }`}>
                      {u.is_active ? '✅ Actif' : '❌ Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(u.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        u.is_active
                          ? 'bg-red-50 text-red-500 hover:bg-red-100'
                          : 'bg-[#EBF5ED] text-[#3A7D44] hover:bg-[#3A7D44] hover:text-white'
                      }`}>
                      {u.is_active ? 'Désactiver' : 'Activer'}
                    </button>
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
    </div>
  );
}

// ─── ANNONCES ─────────────────────────────────────────────────
function ListingsAdmin() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchListings = async () => {
    try {
      const res = await api.get('/admin/listings');
      setListings(res.data.listings || []);
    } catch (e) {
      toast.error('Erreur chargement annonces');
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
    } catch (e) {
      toast.error('Erreur mise à jour');
    }
  };

  const filtered = listings
    .filter(l => filter === 'all' || l.status === filter || l.type === filter)
    .filter(l => !search || l.title?.toLowerCase().includes(search.toLowerCase()) || l.city?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <div key={i} className="card h-16 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Annonces ({listings.length})
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
              { value: 'all', label: 'Toutes' },
              { value: 'active', label: '✅ Actives' },
              { value: 'inactive', label: '⏸ Inactives' },
              { value: 'location', label: '🔑 Location' },
              { value: 'vente', label: '🏷️ Vente' },
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
                {['Annonce', 'Propriétaire', 'Type', 'Prix', 'Vues', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#2A2A2A]">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm text-[#0F172A] dark:text-white max-w-xs truncate">{l.title}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">📍 {l.city}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{l.users?.full_name}</div>
                    <div className="text-xs text-[#94A3B8] capitalize">{l.users?.role}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      l.type === 'location' ? 'bg-blue-100 text-blue-600' : 'bg-[#FEF3C7] text-yellow-700'
                    }`}>
                      {l.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#3A7D44]">
                    {new Intl.NumberFormat('fr-FR').format(l.price)} FCFA
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
                    👁️ {l.views_count || 0}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      l.status === 'active' ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-red-50 text-red-500'
                    }`}>
                      {l.status === 'active' ? '✅ Actif' : '⏸ Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a href={`/annonces/${l.id}`} target="_blank"
                        className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors">
                        <Eye size={14} />
                      </a>
                      {l.status === 'active' ? (
                        <button onClick={() => handleStatus(l.id, 'inactive')}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                          <XCircle size={14} />
                        </button>
                      ) : (
                        <button onClick={() => handleStatus(l.id, 'active')}
                          className="p-1.5 rounded-lg bg-[#EBF5ED] hover:bg-[#3A7D44] text-[#3A7D44] hover:text-white transition-colors">
                          <CheckCircle size={14} />
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
              <span className="text-4xl block mb-2">🏠</span>
              <p className="text-sm">Aucune annonce trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGES ADMIN ───────────────────────────────────────────
function MessagesAdmin() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/admin/stats');
        setConversations([]);
      } catch (e) {}
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="font-display font-bold text-[#0F172A] dark:text-white">Messages & Conversations</h2>
      <div className="card p-12 text-center text-[#94A3B8]">
        <span className="text-5xl block mb-3">💬</span>
        <p className="font-medium dark:text-white">Vue des conversations</p>
        <p className="text-sm mt-1">Fonctionnalité disponible prochainement</p>
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
      <h2 className="font-display font-bold text-[#0F172A] dark:text-white">Statistiques détaillées</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="👥" label="Total utilisateurs" value={stats?.total_users || 0} color="blue" loading={loading} />
        <StatCard emoji="🏠" label="Total annonces" value={stats?.total_listings || 0} color="green" loading={loading} />
        <StatCard emoji="💬" label="Conversations" value={stats?.total_conversations || 0} color="orange" loading={loading} />
        <StatCard emoji="✉️" label="Messages" value={stats?.total_messages || 0} color="purple" loading={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-5">📊 Répartition complète</h3>
          {[
            { emoji: '🔍', label: 'Locataires', value: stats?.users_by_role?.locataire || 0, total: stats?.total_users || 1, color: '#3B82F6' },
            { emoji: '🏠', label: 'Propriétaires', value: stats?.users_by_role?.proprietaire || 0, total: stats?.total_users || 1, color: '#3A7D44' },
            { emoji: '🤝', label: 'Agents', value: stats?.users_by_role?.agent || 0, total: stats?.total_users || 1, color: '#F59E0B' },
            { emoji: '⚙️', label: 'Admins', value: stats?.users_by_role?.admin || 0, total: stats?.total_users || 1, color: '#8B5CF6' },
          ].map((item, i) => (
            <ProgressBar key={i} {...item} />
          ))}
        </div>

        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-5">🏠 Annonces</h3>
          {[
            { emoji: '🔑', label: 'Location', value: stats?.listings_by_type?.location || 0, total: stats?.total_listings || 1, color: '#3B82F6' },
            { emoji: '🏷️', label: 'Vente', value: stats?.listings_by_type?.vente || 0, total: stats?.total_listings || 1, color: '#F59E0B' },
            { emoji: '✅', label: 'Actives', value: stats?.listings_by_status?.active || 0, total: stats?.total_listings || 1, color: '#3A7D44' },
            { emoji: '⏸', label: 'Inactives', value: stats?.listings_by_status?.inactive || 0, total: stats?.total_listings || 1, color: '#94A3B8' },
          ].map((item, i) => (
            <ProgressBar key={i} {...item} />
          ))}
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
        <Route path="utilisateurs" element={<UsersList />} />
        <Route path="annonces" element={<ListingsAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="stats" element={<StatsAdmin />} />
      </Routes>
    </DashboardLayout>
  );
}