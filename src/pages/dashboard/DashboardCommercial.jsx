import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { UserPlus, Users, TrendingUp, LayoutDashboard, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/common/DashboardLayout';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';

const MENU = [
  { path: '/dashboard/commercial', icon: LayoutDashboard, label: 'Vue générale' },
  { path: '/dashboard/commercial/enregistrer', icon: UserPlus, label: 'Enregistrer un agent' },
  { path: '/dashboard/commercial/agents', icon: Users, label: 'Mes agents' },
];

// ─── VUE GÉNÉRALE ────────────────────────────────────────────
function Overview() {
  const { user } = useAuthStore();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/commercial/my-agents');
        setAgents(res.data.agents || []);
      } catch (e) {
        toast.error('Erreur chargement données');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const activeCount = agents.filter(a => a.is_active).length;
  const thisMonthCount = agents.filter(a => {
    const d = new Date(a.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header premium */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#3A7D44] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#3A7D44] rounded-full opacity-10 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Agent commercial</p>
            <h2 className="font-display text-2xl font-bold">{user?.full_name}</h2>
            <p className="text-white/60 text-sm mt-1">Suivi de vos inscriptions Logezy</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-display font-black text-3xl text-white">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 relative z-10">
          {[
            { label: 'Total agents', value: agents.length },
            { label: 'Actifs', value: activeCount },
            { label: 'Ce mois-ci', value: thisMonthCount },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
              <div className="font-display font-black text-xl text-white">{s.value}</div>
              <div className="text-white/60 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 border-t-4 border-[#3A7D44] bg-[#EBF5ED] text-[#3A7D44]">
          <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center mb-3">
            <Users size={20} />
          </div>
          <div className="font-display font-black text-3xl">{agents.length}</div>
          <div className="text-sm text-[#64748B] mt-1">Agents enregistrés</div>
        </div>
        <div className="card p-5 border-t-4 border-[#3B82F6] bg-[#EFF6FF] text-[#3B82F6]">
          <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <div className="font-display font-black text-3xl">{activeCount}</div>
          <div className="text-sm text-[#64748B] mt-1">Comptes actifs</div>
        </div>
        <Link to="/dashboard/commercial/enregistrer"
          className="card p-5 border-t-4 border-[#8B5CF6] bg-purple-50 text-purple-600 hover:shadow-float transition-all flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center mb-3">
            <UserPlus size={20} />
          </div>
          <div className="font-bold text-sm">Enregistrer un nouvel agent →</div>
        </Link>
      </div>

      {/* Agents récents */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[#0F172A] dark:text-white">Agents récemment enregistrés</h3>
          <Link to="/dashboard/commercial/agents" className="text-sm text-[#3A7D44] font-bold hover:underline">
            Voir tout →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-[#F5F5F7] dark:bg-[#2A2A2A] animate-pulse" />)}
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-8 text-[#94A3B8]">
            <UserPlus size={40} className="mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-sm mb-4">Aucun agent enregistré pour le moment</p>
            <Link to="/dashboard/commercial/enregistrer" className="btn-primary text-sm px-4 py-2 inline-block">
              Enregistrer mon premier agent
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {agents.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {a.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[#0F172A] dark:text-white truncate">{a.full_name}</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{a.email}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  a.is_active ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-[#F5F5F7] text-[#94A3B8]'
                }`}>
                  {a.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ENREGISTRER UN AGENT ───────────────────────────────────────
function RegisterAgent() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/commercial/register-agent', form);
      setSuccess(res.data.agent);
      setForm({ email: '', password: '', full_name: '', phone: '' });
      toast.success('Agent enregistré avec succès !');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto animate-scale-in">
        <div className="card p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EBF5ED] flex items-center justify-center mx-auto mb-4">
            <UserPlus size={28} className="text-[#3A7D44]" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#0F172A] dark:text-white mb-1">Agent enregistré !</h2>
          <p className="text-sm text-[#64748B] mb-6">
            <strong>{success.full_name}</strong> peut maintenant se connecter avec son email et le mot de passe fourni.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setSuccess(null)} className="btn-primary px-6 py-2.5">
              Enregistrer un autre agent
            </button>
            <Link to="/dashboard/commercial/agents" className="btn-secondary px-6 py-2.5">
              Voir mes agents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="card p-6">
        <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white mb-2">Enregistrer un agent immobilier</h2>
        <p className="text-sm text-[#64748B] mb-6">
          Renseignez les informations fournies par l'agent immobilier pour créer son compte.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Nom complet *</label>
            <input type="text" placeholder="Ex: Jean Kponou" value={form.full_name}
              onChange={(e) => update('full_name', e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Email *</label>
            <input type="email" placeholder="agent@email.com" value={form.email}
              onChange={(e) => update('email', e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Mot de passe (choisi par l'agent) *</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={(e) => update('password', e.target.value)} className="input-field" required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">Téléphone</label>
            <input type="tel" placeholder="+229 97 00 00 00" value={form.phone}
              onChange={(e) => update('phone', e.target.value)} className="input-field" />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><UserPlus size={16} /> Enregistrer l'agent</>}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── MES AGENTS ─────────────────────────────────────────────────
function MyAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/commercial/my-agents');
        setAgents(res.data.agents || []);
      } catch (e) {
        toast.error('Erreur chargement agents');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className="card h-20 animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#0F172A] dark:text-white">
          Mes agents ({agents.length})
        </h2>
        <Link to="/dashboard/commercial/enregistrer" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
          <UserPlus size={14} /> Nouvel agent
        </Link>
      </div>

      {agents.length === 0 ? (
        <div className="card p-12 text-center text-[#94A3B8]">
          <UserPlus size={48} className="mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-medium dark:text-white mb-4">Aucun agent enregistré</p>
          <Link to="/dashboard/commercial/enregistrer" className="btn-primary inline-block text-sm px-6 py-2">
            Enregistrer un agent
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {agents.map(a => (
            <div key={a.id} className="card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold shrink-0">
                {a.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#0F172A] dark:text-white">{a.full_name}</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{a.email}{a.phone && ` · ${a.phone}`}</div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  a.is_active ? 'bg-[#EBF5ED] text-[#3A7D44]' : 'bg-[#F5F5F7] text-[#94A3B8]'
                }`}>
                  {a.is_active ? 'Actif' : 'Inactif'}
                </span>
                <div className="text-xs text-[#94A3B8] mt-1">
                  {new Date(a.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────
export default function DashboardCommercial() {
  return (
    <DashboardLayout menuItems={MENU} title="Dashboard Commercial">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="enregistrer" element={<RegisterAgent />} />
        <Route path="agents" element={<MyAgents />} />
      </Routes>
    </DashboardLayout>
  );
}