import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  Eye, CheckCircle, XCircle, Users, Home, Search, Trash2, Ban, Mail, Send,
  LayoutDashboard, Clock, TrendingUp, Briefcase, UserPlus, Building2,
  Crown, Key, Tag, MapPin, Banknote, Bed, Maximize, User, Hand, List,
  AlertTriangle, PauseCircle, MessageCircle, Handshake, Settings, Lightbulb, Pin, DraftingCompass, ClipboardList,
  BarChart3, SlidersHorizontal, CalendarDays, RefreshCw, Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/common/DashboardLayout';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import SwipeValidation from '../../components/admin/SwipeValidation';
import { formatListingPrice } from '../../data/currencies';
import AdminAnalytics from './AdminAnalytics';
import AdminSiteSettings from './AdminSiteSettings';

const MENU = [
  { path: '/dashboard/admin', icon: LayoutDashboard, label: 'Vue générale' },
  { path: '/dashboard/admin/validation', icon: Clock, label: 'Validation annonces' },
  { path: '/dashboard/admin/validation-plans', icon: DraftingCompass, label: 'Validation plans' },
  { path: '/dashboard/admin/utilisateurs', icon: Users, label: 'Utilisateurs' },
  { path: '/dashboard/admin/annonces', icon: Home, label: 'Toutes les annonces' },
  { path: '/dashboard/admin/commerciaux', icon: Briefcase, label: 'Commerciaux' },
  { path: '/dashboard/admin/architectes',icon: DraftingCompass,label: 'Architectes',},
  { path: '/dashboard/admin/demandes-plans', icon: ClipboardList, label: 'Demandes de plans' },
  { path: '/dashboard/admin/messages', icon: Mail, label: 'Écrire aux users' },
  { path: '/dashboard/admin/stats', icon: TrendingUp, label: 'Statistiques' },
  { path: '/dashboard/admin/visites', icon: BarChart3, label: 'Visites du site' },
  { path: '/dashboard/admin/reglages', icon: SlidersHorizontal, label: 'Réglages plateforme' },
];

function StatCard({ icon: Icon, label, value, color = 'green', loading, urgent }) {
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
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon size={20} strokeWidth={2} className={textColors[color]} />
      </div>
      <div className={`font-display font-black text-3xl ${textColors[color]} ${loading ? 'animate-pulse' : ''}`}>
        {loading ? '...' : value}
      </div>
      <div className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">{label}</div>
      {urgent && value > 0 && (
        <div className="flex items-center gap-1 text-xs text-red-500 font-bold mt-1">
          <AlertTriangle size={11} /> Action requise
        </div>
      )}
    </div>
  );
}

function ProgressBar({ label, value, total, color = '#3A7D44', icon: Icon }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 text-sm font-medium text-[#334155] dark:text-[#94A3B8]">
          <Icon size={14} /><span>{label}</span>
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
          <Settings size={40} className="text-white/20" strokeWidth={1.5} />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6 relative z-10">
          {[
            { label: 'Utilisateurs', value: stats?.total_users || 0, icon: Users },
            { label: 'Annonces', value: stats?.total_listings || 0, icon: Home },
            { label: 'En attente', value: stats?.pending_listings || 0, icon: Clock, urgent: true },
            { label: 'Messages', value: stats?.total_messages || 0, icon: Mail },
          ].map((s, i) => (
            <div key={i} className={`backdrop-blur rounded-xl p-3 text-center ${s.urgent && s.value > 0 ? 'bg-red-500/20 border border-red-400/30' : 'bg-white/10'}`}>
              <s.icon size={20} className="mx-auto mb-1 text-white/70" />
              <div className="font-display font-black text-xl text-white">{loading ? '...' : s.value}</div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Utilisateurs" value={stats?.total_users || 0} color="blue" loading={loading} />
        <StatCard icon={CheckCircle} label="Annonces actives" value={stats?.listings_by_status?.active || 0} color="green" loading={loading} />
        <StatCard icon={Clock} label="En attente validation" value={stats?.pending_listings || 0} color="orange" loading={loading} urgent={true} />
        <StatCard icon={MessageCircle} label="Conversations" value={stats?.total_conversations || 0} color="purple" loading={loading} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { to: '/dashboard/admin/validation', icon: Clock, label: 'Valider annonces', desc: `${stats?.pending_listings || 0} en attente`, color: 'bg-[#FEF3C7]', urgent: (stats?.pending_listings || 0) > 0 },
          { to: '/dashboard/admin/utilisateurs', icon: Users, label: 'Gérer utilisateurs', desc: `${stats?.total_users || 0} comptes`, color: 'bg-[#EFF6FF]', urgent: false },
          { to: '/dashboard/admin/annonces', icon: Home, label: 'Toutes les annonces', desc: `${stats?.total_listings || 0} annonces`, color: 'bg-[#EBF5ED]', urgent: false },
          { to: '/dashboard/admin/commerciaux', icon: Briefcase, label: 'Commerciaux', desc: 'Équipe de prospection', color: 'bg-orange-50', urgent: false },
          { to: '/dashboard/admin/messages', icon: Mail, label: 'Écrire aux users', desc: 'Contacter un utilisateur', color: 'bg-purple-50', urgent: false },
          { to: '/dashboard/admin/stats', icon: TrendingUp, label: 'Statistiques', desc: 'Analyse complète', color: 'bg-[#EFF6FF]', urgent: false },
        ].map((a, i) => (
          <Link key={i} to={a.to}
            className={`${a.color} dark:bg-[#2A2A2A] card p-4 flex flex-col gap-2 hover:shadow-float transition-all ${a.urgent ? 'ring-2 ring-yellow-400' : ''}`}>
            <a.icon size={24} className="text-[#3A7D44]" strokeWidth={2} />
            <span className="font-bold text-sm text-[#0F172A] dark:text-white">{a.label}</span>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{a.desc}</span>
            {a.urgent && (
              <span className="flex items-center gap-1 text-xs text-yellow-600 font-bold">
                <AlertTriangle size={11} /> Action requise
              </span>
            )}
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
                  {u.is_super_admin ? <Crown size={13} /> : u.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">
                    {u.full_name}
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
                <div className="w-8 h-8 rounded-xl bg-[#EBF5ED] dark:bg-[#2A2A2A] flex items-center justify-center shrink-0">
                  <Home size={14} className="text-[#3A7D44]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">{l.title}</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{l.city}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center ${
                  l.status === 'active' ? 'bg-[#EBF5ED] text-[#3A7D44]' :
                  l.status === 'pending' ? 'bg-[#FEF3C7] text-yellow-600' :
                  'bg-red-50 text-red-500'
                }`}>
                  {l.status === 'active' ? <CheckCircle size={12} /> : l.status === 'pending' ? <Clock size={12} /> : <XCircle size={12} />}
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
      toast.success('Annonce approuvée !');
      fetchListings();
    } catch (e) {
      toast.error('Erreur approbation');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/listings/${id}/reject`, { reason: rejectReason });
      toast.success('Annonce rejetée.');
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
            <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full animate-pulse">
              <AlertTriangle size={11} /> {listings.length} à valider
            </span>
          )}
          {listings.length > 0 && (
            <button onClick={() => setSwipeMode(!swipeMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                swipeMode
                  ? 'bg-[#3A7D44] text-white shadow-lg'
                  : 'bg-[#F5F5F7] dark:bg-[#2A2A2A] text-[#64748B] hover:bg-[#EBF5ED] hover:text-[#3A7D44]'
              }`}>
              {swipeMode ? <><List size={14} /> Vue liste</> : <><Hand size={14} /> Mode Swipe</>}
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
            toast.success('Annonce approuvée !');
          }}
          onReject={async (id) => {
            await api.put(`/admin/listings/${id}/reject`, { reason: 'Rejeté via mode swipe' });
            toast.error('Annonce rejetée');
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
              <CheckCircle size={48} className="mx-auto mb-3 text-[#3A7D44]" strokeWidth={1.5} />
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
                        <span className="flex items-center gap-1 text-xs bg-[#FEF3C7] text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                          <Clock size={10} /> En attente
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                          l.type === 'location' ? 'bg-blue-100 text-blue-600' : 'bg-[#FEF3C7] text-yellow-700'
                        }`}>
                          {l.type === 'location' ? <Key size={10} /> : <Tag size={10} />}
                          {l.type === 'location' ? 'Location' : 'Vente'}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0F172A] dark:text-white mb-1">{l.title}</h3>
                      <p className="flex items-center gap-1 text-sm text-[#64748B] dark:text-[#94A3B8] mb-2">
                        <MapPin size={12} /> {l.city} {l.neighborhood && `· ${l.neighborhood}`}
                      </p>
                      {l.description && (
                        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mb-2">
                          {l.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
                        <span className="flex items-center gap-1"><Banknote size={11} /> {formatListingPrice(l.price, l.currency_code, l.type === 'location' ? l.price_period : null)}</span>
                        {l.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={11} /> {l.bedrooms} ch.</span>}
                        {l.area && <span className="flex items-center gap-1"><Maximize size={11} /> {l.area}m²</span>}
                      </div>
                      <div className="mt-2 p-2 bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-lg">
                        <p className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                          <User size={12} /> <strong className="text-[#0F172A] dark:text-white">{l.users?.full_name}</strong>
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

// ─── VALIDATION PLANS ──────────────────────────────────────
function ValidationPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPlans = async () => {
    try {
      const res = await api.get('/admin/plans/pending');
      setPlans(res.data.plans || []);
    } catch (e) {
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/plans/${id}/approve`);
      toast.success('Plan approuvé !');
      fetchPlans();
    } catch (e) {
      toast.error('Erreur approbation');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/plans/${id}/reject`, { reason: rejectReason });
      toast.success('Plan rejeté.');
      setRejectModal(null);
      setRejectReason('');
      fetchPlans();
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
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Plans en attente ({plans.length})
        </h2>
        {plans.length > 0 && (
          <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full animate-pulse">
            <AlertTriangle size={11} /> {plans.length} à valider
          </span>
        )}
      </div>

      {plans.length === 0 ? (
        <div className="card p-12 text-center text-[#94A3B8]">
          <CheckCircle size={48} className="mx-auto mb-3 text-[#3A7D44]" strokeWidth={1.5} />
          <p className="font-medium dark:text-white">Aucun plan en attente</p>
          <p className="text-sm mt-1">Tous les plans ont été traités</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(p => {
            const cover = (p.plan_images || []).find(i => i.is_cover) || (p.plan_images || [])[0];
            return (
              <div key={p.id} className="card p-5 border-l-4 border-yellow-400">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {cover && (
                    <img src={cover.image_url} alt={p.title}
                      className="w-full md:w-32 h-32 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center gap-1 text-xs bg-[#FEF3C7] text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                        <Clock size={10} /> En attente
                      </span>
                      {p.style && (
                        <span className="flex items-center gap-1 text-xs bg-[#EBF5ED] text-[#3A7D44] font-bold px-2 py-0.5 rounded-full capitalize">
                          <DraftingCompass size={10} /> {p.style}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#0F172A] dark:text-white mb-1">{p.title}</h3>
                    {p.description && (
                      <p className="text-sm text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mb-2">
                        {p.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
                      <span className="flex items-center gap-1"><Banknote size={11} /> {new Intl.NumberFormat('fr-FR').format(p.price)} FCFA</span>
                      {p.bedrooms > 0 && <span className="flex items-center gap-1"><Bed size={11} /> {p.bedrooms} ch.</span>}
                      {p.area && <span className="flex items-center gap-1"><Maximize size={11} /> {p.area}m²</span>}
                      {p.floors > 0 && <span>{p.floors} étage(s)</span>}
                      {p.roof_type && <span>Toiture : {p.roof_type}</span>}
                    </div>
                    <div className="mt-2 p-2 bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-lg">
                      <p className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                        <User size={12} /> <strong className="text-[#0F172A] dark:text-white">{p.owner?.full_name}</strong>
                        {p.owner?.email && ` (${p.owner.email})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <button onClick={() => handleApprove(p.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#3A7D44] text-white rounded-xl text-sm font-bold hover:bg-[#2D6235] transition-colors">
                      <CheckCircle size={16} /> Approuver
                    </button>
                    <button onClick={() => setRejectModal(p)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">
                      <XCircle size={16} /> Rejeter
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-2">Rejeter le plan</h3>
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
      toast.success('Message envoyé !');
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
    commercial: 'bg-orange-100 text-orange-700',
    admin: 'bg-purple-100 text-purple-600',
  };

  const FILTER_OPTIONS = [
    { value: 'all', label: 'Tous', icon: null },
    { value: 'locataire', label: null, icon: Search },
    { value: 'proprietaire', label: null, icon: Home },
    { value: 'agent', label: null, icon: Handshake },
    { value: 'commercial', label: null, icon: Briefcase },
    { value: 'admin', label: null, icon: Settings },
    { value: 'banned', label: null, icon: Ban },
  ];

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
          <Crown size={20} className="text-purple-500" />
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
            {FILTER_OPTIONS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  filter === f.value ? 'bg-[#3A7D44] text-white' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
                }`}>
                {f.icon ? <f.icon size={13} /> : f.label}
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
                        {u.is_super_admin ? <Crown size={13} /> : u.is_banned ? <Ban size={13} /> : u.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-[#0F172A] dark:text-white flex items-center gap-1">
                          {u.full_name}
                          {u.is_super_admin && (
                            <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-600 font-bold px-1.5 py-0.5 rounded-full">
                              <Crown size={9} /> Super Admin
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{u.email}</div>
                        {u.is_banned && (
                          <div className="flex items-center gap-1 text-xs text-red-500 font-bold">
                            <Ban size={10} /> {u.ban_reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${ROLE_COLORS[u.role] || 'bg-gray-100'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 w-fit text-xs font-bold px-2 py-1 rounded-full ${
                      u.is_banned ? 'bg-red-100 text-red-600' :
                      u.is_active ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-[#F5F5F7] text-[#94A3B8]'
                    }`}>
                      {u.is_banned ? <Ban size={10} /> : u.is_active ? <CheckCircle size={10} /> : <PauseCircle size={10} />}
                      {u.is_banned ? 'Banni' : u.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">

                      <button onClick={() => setMessageModal(u)}
                        className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors"
                        title="Envoyer un message">
                        <Mail size={14} />
                      </button>

                      {!u.is_super_admin && (
                        <button onClick={() => handleToggle(u.id)}
                          className="p-1.5 rounded-lg bg-[#F5F5F7] dark:bg-[#2A2A2A] hover:bg-[#EBF5ED] text-[#64748B] hover:text-[#3A7D44] transition-colors"
                          title={u.is_active ? 'Désactiver' : 'Activer'}>
                          <CheckCircle size={14} />
                        </button>
                      )}

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

                      {isSuperAdmin && !u.is_super_admin && u.id !== user?.id && (
                        <select value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="text-xs border border-[#E2E8F0] dark:border-[#2A2A2A] rounded-lg px-1.5 py-1 bg-white dark:bg-[#2A2A2A] text-[#334155] dark:text-[#94A3B8] cursor-pointer"
                          title="Changer le rôle">
                          <option value="locataire">Locataire</option>
                          <option value="proprietaire">Propriétaire</option>
                          <option value="agent">Agent</option>
                          <option value="commercial">Commercial</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}

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
              <Users size={40} className="mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-sm">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal message */}
      {messageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-1 flex items-center gap-2">
              <Mail size={16} /> Écrire à {messageModal.full_name}
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
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-3 flex items-center gap-2">
              {banModal.is_banned ? <CheckCircle size={16} className="text-[#3A7D44]" /> : <Ban size={16} className="text-red-500" />}
              {banModal.is_banned ? 'Lever le bannissement' : 'Bannir'} — {banModal.full_name}
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
            <h3 className="font-display font-bold text-red-500 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Suppression définitive
            </h3>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
              <p className="font-bold text-[#0F172A] dark:text-white">{deleteModal.full_name}</p>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{deleteModal.email}</p>
            </div>
            <p className="flex items-center gap-1 text-xs text-red-500 font-bold mb-4">
              <AlertTriangle size={12} /> Cette action est irréversible !
            </p>
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

  const FILTER_OPTIONS = [
    { value: 'all', label: 'Toutes', icon: null },
    { value: 'pending', label: null, icon: Clock },
    { value: 'active', label: null, icon: CheckCircle },
    { value: 'rejected', label: null, icon: XCircle },
    { value: 'inactive', label: null, icon: PauseCircle },
  ];

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
            {FILTER_OPTIONS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  filter === f.value ? 'bg-[#3A7D44] text-white' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'
                }`}>
                {f.icon ? <f.icon size={13} /> : f.label}
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
                    <div className="flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                      <MapPin size={10} /> {l.city} <span className="mx-0.5">·</span> <Eye size={10} /> {l.views_count || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#334155] dark:text-[#94A3B8]">{l.users?.full_name}</div>
                    <div className="text-xs text-[#94A3B8] capitalize">{l.users?.role}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 w-fit text-xs font-bold px-2 py-1 rounded-full ${l.type === 'location' ? 'bg-blue-100 text-blue-600' : 'bg-[#FEF3C7] text-yellow-700'}`}>
                      {l.type === 'location' ? <Key size={10} /> : <Tag size={10} />} {l.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#3A7D44]">
                    {formatListingPrice(l.price, l.currency_code)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 w-fit text-xs font-bold px-2 py-1 rounded-full ${
                      l.status === 'active' ? 'bg-[#EBF5ED] text-[#3A7D44]' :
                      l.status === 'pending' ? 'bg-[#FEF3C7] text-yellow-600' :
                      l.status === 'rejected' ? 'bg-red-100 text-red-500' :
                      'bg-[#F5F5F7] text-[#94A3B8]'
                    }`}>
                      {l.status === 'active' ? <CheckCircle size={10} /> : l.status === 'pending' ? <Clock size={10} /> : l.status === 'rejected' ? <XCircle size={10} /> : <PauseCircle size={10} />}
                      {l.status === 'active' ? 'Actif' : l.status === 'pending' ? 'En attente' : l.status === 'rejected' ? 'Rejeté' : 'Inactif'}
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
            <h3 className="font-display font-bold text-red-500 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Supprimer définitivement
            </h3>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl mb-4">
              <p className="font-bold text-[#0F172A] dark:text-white">{deleteModal.title}</p>
            </div>
            <p className="flex items-center gap-1 text-xs text-red-500 font-bold mb-4">
              <AlertTriangle size={12} /> Cette action est irréversible !
            </p>
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
      toast.success(`Message envoyé à ${selected.full_name} !`);
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
      <h2 className="font-display font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
        <Mail size={20} className="text-[#3A7D44]" /> Écrire à un utilisateur
      </h2>
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
                  {u.is_super_admin ? <Crown size={12} /> : u.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">
                    {u.full_name}
                  </div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">{u.email}</div>
                </div>
                {selected?.id === u.id && <CheckCircle size={14} className="text-[#3A7D44]" />}
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
      <h2 className="font-display font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
        <TrendingUp size={20} className="text-[#3A7D44]" /> Statistiques détaillées
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Utilisateurs" value={stats?.total_users || 0} color="blue" loading={loading} />
        <StatCard icon={Home} label="Annonces" value={stats?.total_listings || 0} color="green" loading={loading} />
        <StatCard icon={Clock} label="En attente" value={stats?.pending_listings || 0} color="orange" loading={loading} urgent={true} />
        <StatCard icon={MessageCircle} label="Messages" value={stats?.total_messages || 0} color="purple" loading={loading} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-5 flex items-center gap-2">
            <Users size={16} className="text-[#3A7D44]" /> Utilisateurs par rôle
          </h3>
          <ProgressBar icon={Search} label="Locataires" value={stats?.users_by_role?.locataire || 0} total={stats?.total_users || 1} color="#3B82F6" />
          <ProgressBar icon={Home} label="Propriétaires" value={stats?.users_by_role?.proprietaire || 0} total={stats?.total_users || 1} color="#3A7D44" />
          <ProgressBar icon={Handshake} label="Agents" value={stats?.users_by_role?.agent || 0} total={stats?.total_users || 1} color="#F59E0B" />
          <ProgressBar icon={Briefcase} label="Commerciaux" value={stats?.users_by_role?.commercial || 0} total={stats?.total_users || 1} color="#EA580C" />
          <ProgressBar icon={Settings} label="Admins" value={stats?.users_by_role?.admin || 0} total={stats?.total_users || 1} color="#8B5CF6" />
        </div>
        <div className="card p-6">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-5 flex items-center gap-2">
            <Home size={16} className="text-[#3A7D44]" /> Annonces
          </h3>
          <ProgressBar icon={Clock} label="En attente" value={stats?.listings_by_status?.pending || 0} total={stats?.total_listings || 1} color="#F59E0B" />
          <ProgressBar icon={CheckCircle} label="Actives" value={stats?.listings_by_status?.active || 0} total={stats?.total_listings || 1} color="#3A7D44" />
          <ProgressBar icon={XCircle} label="Rejetées" value={stats?.listings_by_status?.rejected || 0} total={stats?.total_listings || 1} color="#EF4444" />
          <ProgressBar icon={PauseCircle} label="Inactives" value={stats?.listings_by_status?.inactive || 0} total={stats?.total_listings || 1} color="#94A3B8" />
        </div>
      </div>
    </div>
  );
}

// ─── COMMERCIAUX ────────────────────────────────────────────
function CommercialsAdmin() {
  const [commercials, setCommercials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [agentsByCommercial, setAgentsByCommercial] = useState({});

  const fetchCommercials = async () => {
    try {
      const res = await api.get('/admin/commercials');
      setCommercials(res.data.commercials || []);
    } catch (e) {
      toast.error('Erreur chargement commerciaux');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCommercials(); }, []);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/commercials', form);
      toast.success('Compte commercial créé !');
      setForm({ email: '', password: '', full_name: '', phone: '' });
      setShowForm(false);
      fetchCommercials();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur création');
    } finally {
      setCreating(false);
    }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (!agentsByCommercial[id]) {
      try {
        const res = await api.get(`/admin/commercials/${id}/agents`);
        setAgentsByCommercial(prev => ({ ...prev, [id]: res.data.agents || [] }));
      } catch (e) {
        toast.error('Erreur chargement agents');
      }
    }
  };

  const totalAgents = commercials.reduce((sum, c) => sum + c.agents_count, 0);
  const bestCommercial = commercials.length > 0
    ? commercials.reduce((best, c) => c.agents_count > (best?.agents_count || 0) ? c : best, null)
    : null;

  if (loading) return <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse" />)}</div>;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#3A7D44] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#3A7D44] rounded-full opacity-10 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1 flex items-center gap-1.5">
              <Briefcase size={14} /> Équipe commerciale
            </p>
            <h2 className="font-display text-2xl font-bold">Prospection & recrutement</h2>
            <p className="text-white/60 text-sm mt-1">Suivi des agents immobiliers amenés par l'équipe</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-white text-[#0F172A] font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-white/90 transition-all shrink-0">
            <UserPlus size={16} /> Nouveau commercial
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 relative z-10">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="font-display font-black text-xl text-white">{commercials.length}</div>
            <div className="text-white/60 text-xs">Commerciaux</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="font-display font-black text-xl text-white">{totalAgents}</div>
            <div className="text-white/60 text-xs">Agents amenés</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
            <div className="font-display font-black text-xl text-white truncate">
              {bestCommercial ? bestCommercial.full_name.split(' ')[0] : '—'}
            </div>
            <div className="text-white/60 text-xs">Meilleur recruteur</div>
          </div>
        </div>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <div className="card p-5 animate-scale-in">
          <h3 className="font-bold text-[#0F172A] dark:text-white mb-4 flex items-center gap-2">
            <UserPlus size={16} className="text-[#3A7D44]" />
            Créer un compte commercial
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mb-1">Nom complet *</label>
              <input value={form.full_name} onChange={e => update('full_name', e.target.value)}
                placeholder="Ex: Marc Adjovi" className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                placeholder="commercial@logezy.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mb-1">Mot de passe *</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                placeholder="••••••••" className="input-field" required minLength={6} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mb-1">Téléphone</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)}
                placeholder="+229 01 XX XX XX XX" className="input-field" />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-1">
              <button type="submit" disabled={creating} className="btn-primary px-6 py-2.5 flex items-center gap-2">
                {creating
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><UserPlus size={15} /> Créer le compte</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary px-6 py-2.5">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des commerciaux */}
      {commercials.length === 0 ? (
        <div className="card p-12 text-center text-[#94A3B8]">
          <Briefcase size={48} className="mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-medium dark:text-white mb-4">Aucun commercial pour le moment</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2">
            <UserPlus size={15} /> Créer le premier compte
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {commercials.map(c => (
            <div key={c.id} className="card overflow-hidden">
              <button onClick={() => toggleExpand(c.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] transition-colors text-left">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3A7D44] to-[#2D6235] text-white flex items-center justify-center font-bold shrink-0">
                  {c.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#0F172A] dark:text-white">{c.full_name}</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{c.email}{c.phone && ` · ${c.phone}`}</div>
                </div>
                <div className="text-center shrink-0 px-4">
                  <div className="font-display font-black text-2xl text-[#3A7D44]">{c.agents_count}</div>
                  <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide">agents</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  c.is_active ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-[#F5F5F7] text-[#94A3B8]'
                }`}>
                  {c.is_active ? 'Actif' : 'Inactif'}
                </span>
              </button>

              {expandedId === c.id && (
                <div className="border-t border-[#E2E8F0] dark:border-[#2A2A2A] bg-[#F8F9FA] dark:bg-[#0F172A] p-4">
                  {!agentsByCommercial[c.id] ? (
                    <div className="h-16 animate-pulse bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-xl" />
                  ) : agentsByCommercial[c.id].length === 0 ? (
                    <p className="text-xs text-[#94A3B8] text-center py-3">Aucun agent enregistré par ce commercial</p>
                  ) : (
                    <div className="space-y-2">
                      {agentsByCommercial[c.id].map(a => (
                        <div key={a.id} className="flex items-center gap-3 p-2.5 bg-white dark:bg-[#1A1A1A] rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {a.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs text-[#0F172A] dark:text-white truncate">{a.full_name}</div>
                            <div className="text-xs text-[#94A3B8] truncate">{a.email}</div>
                          </div>
                          <div className="text-xs text-[#94A3B8] shrink-0">
                            {new Date(a.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ARCHITECTES ────────────────────────────────────────────────
function ArchitectsAdmin() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [architects, setArchitects] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const fetchArchitects = async () => {
    try {
      const res = await api.get('/admin/architects');
      setArchitects(res.data.architects || []);
    } catch (e) {
      toast.error('Erreur chargement des architectes');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => { fetchArchitects(); }, []);

  const handleToggleApproval = async (id) => {
    setTogglingId(id);
    try {
      const res = await api.put(`/admin/architects/${id}/toggle-approval`);
      toast.success(res.data.message);
      fetchArchitects();
    } catch (e) {
      toast.error('Erreur');
    } finally {
      setTogglingId(null);
    }
  };

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      toast.error('Veuillez remplir les champs obligatoires.');
      return;
    }

    if (form.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setCreating(true);

    try {
      await api.post('/admin/architects', {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });

      toast.success('Compte architecte créé avec succès !');

      setForm({
        full_name: '',
        email: '',
        phone: '',
        password: '',
      });
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Erreur lors de la création du compte.'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">

      {/* En-tête */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-[#EBF5ED]
            flex items-center justify-center">
            <DraftingCompass
              size={25}
              className="text-[#3A7D44]"
            />
          </div>

          <div>
            <h2 className="font-display text-xl font-bold
              text-[#0F172A] dark:text-white">
              Gestion des architectes
            </h2>

            <p className="text-sm text-[#64748B]
              dark:text-[#94A3B8]">
              Créer un compte architecte pour Logezy Plans.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="card p-6 max-w-2xl">
        <h3 className="font-display font-bold text-lg
          text-[#0F172A] dark:text-white mb-5">
          Nouveau compte architecte
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom complet *
            </label>

            <input
              type="text"
              value={form.full_name}
              onChange={(e) =>
                update('full_name', e.target.value)
              }
              placeholder="Nom et prénom de l'architecte"
              required
              className="input-field w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Adresse email *
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                update('email', e.target.value)
              }
              placeholder="architecte@exemple.com"
              required
              className="input-field w-full"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Téléphone
            </label>

            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                update('phone', e.target.value)
              }
              placeholder="+229 ..."
              className="input-field w-full"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Mot de passe temporaire *
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) =>
                  update('password', e.target.value)
                }
                placeholder="Minimum 8 caractères"
                minLength={8}
                required
                className="input-field w-full pr-20"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                className="absolute right-3 top-1/2
                  -translate-y-1/2 text-sm
                  text-[#3A7D44] font-medium"
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>

          <p className="text-xs text-[#64748B]
            dark:text-[#94A3B8]">
            Le compte sera créé avec le rôle architecte.
            Ne partage pas le mot de passe temporaire publiquement.
          </p>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-3 rounded-xl bg-[#3A7D44]
              text-white font-bold disabled:opacity-50
              hover:bg-[#2F6637] transition-colors"
          >
            {creating
              ? 'Création en cours...'
              : 'Créer le compte architecte'}
          </button>
        </form>
      </div>

      {/* Liste des architectes existants */}
      <div className="card p-6">
        <h3 className="font-bold text-[#0F172A] dark:text-white mb-4 flex items-center gap-2">
          <Users size={16} className="text-[#3A7D44]" />
          Architectes ({architects.length})
        </h3>

        {loadingList ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />)}
          </div>
        ) : architects.length === 0 ? (
          <p className="text-sm text-[#94A3B8] text-center py-6">Aucun architecte pour le moment</p>
        ) : (
          <div className="space-y-2">
            {architects.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-xl">
                <div className="w-9 h-9 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {a.user?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate">{a.user?.full_name}</p>
                  <p className="text-xs text-[#94A3B8] truncate">{a.user?.email}{a.city && ` · ${a.city}`}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                  a.is_approved ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-[#FEF3C7] text-yellow-700'
                }`}>
                  {a.is_approved ? 'Approuvé' : 'En attente'}
                </span>
                <button onClick={() => handleToggleApproval(a.id)} disabled={togglingId === a.id}
                  className={`p-2 rounded-xl transition-colors shrink-0 ${
                    a.is_approved
                      ? 'bg-[#F5F5F7] dark:bg-[#1A1A1A] hover:bg-red-50 text-[#64748B] hover:text-red-500'
                      : 'bg-[#3A7D44] text-white hover:bg-[#2D6235]'
                  }`}
                  title={a.is_approved ? "Retirer l'approbation" : 'Approuver'}>
                  {togglingId === a.id
                    ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    : a.is_approved ? <XCircle size={16} /> : <CheckCircle size={16} />
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DEMANDES DE PLANS ─────────────────────────────────────
function PlanRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const STATUS_LABELS = {
    nouveau: { label: 'Nouveau', classes: 'bg-[#EFF6FF] text-[#3B82F6]' },
    en_cours: { label: 'En cours', classes: 'bg-[#FEF3C7] text-yellow-700' },
    traite: { label: 'Traité', classes: 'bg-[#EBF5ED] text-[#3A7D44]' },
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get('/admin/plan-requests');
      setRequests(res.data.requests || []);
      setLoadError(false);
    } catch {
      setLoadError(true);
      toast.error('Erreur chargement des demandes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/admin/plan-requests/${id}/status`, { status });
      toast.success('Statut mis à jour');
      fetchRequests();
    } catch {
      toast.error('Erreur mise à jour');
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = requests.reduce((result, request) => {
    result[request.status] = (result[request.status] || 0) + 1;
    return result;
  }, {});
  const query = search.trim().toLocaleLowerCase('fr');
  const filtered = requests.filter((request) => {
    const matchesStatus = filter === 'all' || request.status === filter;
    const searchable = [
      request.description,
      request.city,
      request.user?.full_name,
      request.user?.email,
      request.user?.phone,
      request.architect?.full_name,
      request.reference_plan?.title,
    ].filter(Boolean).join(' ').toLocaleLowerCase('fr');
    return matchesStatus && (!query || searchable.includes(query));
  });
  const formatBudget = (value) => new Intl.NumberFormat('fr-FR').format(Number(value) || 0);
  const formatRequestDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? 'Date non disponible'
      : new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };
  const statusFilters = [
    { value: 'all', label: 'Toutes', count: requests.length },
    { value: 'nouveau', label: 'Nouvelles', count: counts.nouveau || 0 },
    { value: 'en_cours', label: 'En cours', count: counts.en_cours || 0 },
    { value: 'traite', label: 'Traitées', count: counts.traite || 0 },
  ];

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 rounded-2xl bg-[#F1F5F9] dark:bg-[#242424]" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => <div key={i} className="card h-24" />)}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {[...Array(2)].map((_, i) => <div key={i} className="card h-64" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#163A2B] via-[#24573D] to-[#3A7D44] p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85">
              <ClipboardList size={14} /> Espace de suivi
            </div>
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">Demandes de plans sur mesure</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
              Retrouvez les besoins des clients, consultez leurs critères et suivez chaque demande jusqu’à son traitement.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setRefreshing(true); fetchRequests(); }}
            disabled={refreshing}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-70"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Toutes les demandes', value: requests.length, color: 'text-[#3A7D44]', icon: ClipboardList, tone: 'bg-[#EBF5ED] dark:bg-[#183321]' },
          { label: 'À traiter', value: (counts.nouveau || 0) + (counts.en_cours || 0), color: 'text-amber-600 dark:text-amber-400', icon: Clock, tone: 'bg-amber-50 dark:bg-amber-950/40' },
          { label: 'Traitées', value: counts.traite || 0, color: 'text-blue-600 dark:text-blue-400', icon: CheckCircle, tone: 'bg-blue-50 dark:bg-blue-950/40' },
        ].map(({ label, value, color, icon: Icon, tone }) => (
          <div key={label} className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-float">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone} ${color}`}>
              <Icon size={21} />
            </span>
            <div>
              <p className={`font-display text-2xl font-black ${color}`}>{value}</p>
              <p className="mt-0.5 text-sm text-[#64748B] dark:text-[#94A3B8]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="card space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Boîte de demandes</h3>
            <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''} sur {requests.length}
            </p>
          </div>
          <label className="relative block w-full xl:max-w-sm">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une ville, un client…"
              aria-label="Rechercher une demande de plan"
              className="input-field w-full py-2.5 pl-10"
            />
          </label>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                filter === item.value
                  ? 'bg-[#3A7D44] text-white shadow-sm'
                  : 'bg-[#F5F5F7] text-[#64748B] hover:bg-[#EBF5ED] hover:text-[#24573D] dark:bg-[#252525] dark:text-[#94A3B8] dark:hover:bg-[#183321] dark:hover:text-white'
              }`}
            >
              {item.label}
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${filter === item.value ? 'bg-white/20 text-white' : 'bg-white text-[#64748B] dark:bg-[#333] dark:text-[#CBD5E1]'}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {loadError ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40">
            <AlertTriangle size={22} />
          </span>
          <div>
            <p className="font-semibold text-[#0F172A] dark:text-white">Impossible de charger les demandes</p>
            <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">Vérifiez votre connexion puis réessayez.</p>
          </div>
          <button type="button" onClick={() => { setLoading(true); fetchRequests(); }} className="btn-secondary px-4 py-2 text-sm">
            Réessayer
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center p-10 text-center sm:p-14">
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EBF5ED] text-[#3A7D44] dark:bg-[#183321]">
            <ClipboardList size={30} strokeWidth={1.5} />
          </span>
          <p className="font-display text-lg font-bold text-[#0F172A] dark:text-white">
            {requests.length ? 'Aucun résultat pour ces filtres' : 'Aucune demande pour le moment'}
          </p>
          <p className="mt-1 max-w-md text-sm text-[#64748B] dark:text-[#94A3B8]">
            {requests.length ? 'Modifiez votre recherche ou sélectionnez un autre statut.' : 'Les nouvelles demandes de plans apparaîtront ici.'}
          </p>
          {(search || filter !== 'all') && (
            <button type="button" onClick={() => { setSearch(''); setFilter('all'); }} className="mt-4 text-sm font-semibold text-[#3A7D44] hover:underline">
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map(r => (
            <article key={r.id} className="card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-float">
              <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#FAFBFC] px-5 py-4 dark:border-[#2A2A2A] dark:bg-[#202020]">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.status === 'nouveau' ? 'bg-blue-500' : r.status === 'en_cours' ? 'bg-amber-500' : 'bg-[#3A7D44]'}`} />
                  <span className={`truncate rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_LABELS[r.status]?.classes || 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABELS[r.status]?.label || r.status}
                  </span>
                  <span className="hidden items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] sm:inline-flex">
                    <CalendarDays size={13} /> {formatRequestDate(r.created_at)}
                  </span>
                </div>
                <select
                  value={r.status}
                  disabled={updatingId === r.id}
                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  aria-label={`Modifier le statut de la demande de ${r.user?.full_name || 'cet utilisateur'}`}
                  className="input-field w-auto max-w-[145px] shrink-0 py-2 text-xs"
                >
                  <option value="nouveau">Nouveau</option>
                  <option value="en_cours">En cours</option>
                  <option value="traite">Traité</option>
                </select>
              </div>
              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94A3B8]">Projet recherché</p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[#334155] dark:text-[#E2E8F0]">
                    {r.description || 'Aucune précision fournie.'}
                  </p>
                </div>
                {(r.architect || r.reference_plan) && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {r.architect && (
                      <div className="rounded-xl bg-[#F8FAFC] p-3 dark:bg-[#222]">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">Architecte choisi</p>
                        <p className="text-xs font-semibold text-[#334155] dark:text-[#E2E8F0]">{r.architect.full_name}</p>
                        {r.architect.email && <p className="mt-1 truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{r.architect.email}</p>}
                      </div>
                    )}
                    {r.reference_plan && (
                      <div className="rounded-xl bg-[#F8FAFC] p-3 dark:bg-[#222]">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">Plan de référence</p>
                        <Link to={`/plans/${r.reference_plan.id}`} target="_blank" className="text-xs font-semibold text-[#3A7D44] hover:underline">
                          {r.reference_plan.title}
                        </Link>
                        {r.reference_plan.style && <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">{r.reference_plan.style}</p>}
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <div className="rounded-xl bg-[#F8FAFC] p-3 dark:bg-[#222]">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">Localisation</p>
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#334155] dark:text-[#E2E8F0]">
                      <MapPin size={13} className="shrink-0 text-[#3A7D44]" /> {r.city || 'Non précisée'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] p-3 dark:bg-[#222]">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">Chambres</p>
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#334155] dark:text-[#E2E8F0]">
                      <Bed size={13} className="shrink-0 text-[#3A7D44]" /> {r.bedrooms ?? '—'}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-xl bg-[#F8FAFC] p-3 dark:bg-[#222] sm:col-span-1">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">Budget estimé</p>
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#334155] dark:text-[#E2E8F0]">
                      <Banknote size={13} className="shrink-0 text-[#3A7D44]" />
                      {r.budget_min != null || r.budget_max != null
                        ? `${r.budget_min != null ? formatBudget(r.budget_min) : '—'} – ${r.budget_max != null ? formatBudget(r.budget_max) : '—'} FCFA`
                        : 'Non précisé'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 dark:border-[#333] dark:bg-[#1D1D1D] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF5ED] font-bold text-[#3A7D44] dark:bg-[#183321]">
                      {(r.user?.full_name || 'U').trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#0F172A] dark:text-white">{r.user?.full_name || 'Utilisateur'}</p>
                      <p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{r.user?.email || 'Coordonnées non disponibles'}</p>
                    </div>
                  </div>
                  {r.user?.phone && (
                    <a href={`tel:${r.user.phone}`} className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-[#EBF5ED] px-3 py-2 text-xs font-semibold text-[#24573D] transition hover:bg-[#D9EBDD] dark:bg-[#183321] dark:text-[#B7E4C0] sm:self-auto">
                      <Phone size={13} /> {r.user.phone}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
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
        <Route path="validation-plans" element={<ValidationPlans />} />
        <Route path="utilisateurs" element={<UsersList />} />
        <Route path="annonces" element={<ListingsAdmin />} />
        <Route path="commerciaux" element={<CommercialsAdmin />} />
        <Route path="messages" element={<WriteToUsers />} />
        <Route path="stats" element={<StatsAdmin />} />
        <Route path="visites" element={<AdminAnalytics />} />
        <Route path="reglages" element={<AdminSiteSettings />} />
        <Route path="architectes" element={<ArchitectsAdmin />}/>
        <Route path="demandes-plans" element={<PlanRequestsAdmin />} />
      </Routes>
    </DashboardLayout>
  );
}