import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

const ROLES = [
  { value: 'locataire', emoji: '🔍', label: 'Locataire / Acheteur', desc: 'Je cherche une maison à louer ou à acheter', color: 'border-[#3B82F6] bg-[#EFF6FF] text-[#3B82F6]' },
  { value: 'proprietaire', emoji: '🏠', label: 'Propriétaire', desc: 'Je veux publier mes biens immobiliers', color: 'border-[#3A7D44] bg-[#EBF5ED] text-[#3A7D44]' },
  { value: 'agent', emoji: '🤝', label: 'Agent immobilier', desc: 'Je gère des biens pour plusieurs propriétaires', color: 'border-[#F59E0B] bg-[#FEF3C7] text-[#F59E0B]' },
];

export default function GoogleComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const googleData = location.state;
  if (!googleData) { navigate('/login'); return null; }

  const handleComplete = async () => {
    if (!role) { toast.error('Veuillez choisir un type de compte'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/google/complete', {
        email: googleData.email,
        full_name: googleData.full_name,
        avatar_url: googleData.avatar_url,
        google_id: googleData.google_id,
        role,
      });
      login(res.data.user, res.data.token);
      toast.success('Compte créé avec succès ! 🎉');
      switch (res.data.user.role) {
        case 'proprietaire': navigate('/dashboard/proprietaire'); break;
        case 'agent': navigate('/dashboard/agent'); break;
        default: navigate('/dashboard/locataire');
      }
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur création compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-scale-in">

        {/* Header */}
        <div className="text-center mb-10">
          <img src="/logo-light.png" alt="Logezy"
            style={{ height: 48, width: 'auto' }}
            className="object-contain mx-auto mb-6" />
          <div className="inline-flex items-center gap-2 bg-[#EBF5ED] text-[#3A7D44] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <CheckCircle size={12} />
            Connecté avec Google
          </div>
          <h1 className="font-display text-3xl font-black text-[#0F172A] dark:text-white mb-2">
            Bienvenue sur Logezy ! 🎉
          </h1>
          <p className="text-[#64748B] dark:text-[#94A3B8]">
            Dernière étape — choisissez votre type de compte
          </p>
        </div>

        {/* Infos Google */}
        <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E8E8E8] dark:border-[#2A2A2A] rounded-2xl p-4 mb-8 flex items-center gap-4">
          {googleData.avatar_url ? (
            <img src={googleData.avatar_url} alt={googleData.full_name}
              className="w-12 h-12 rounded-full border-2 border-[#E8E8E8]" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-lg">
              {googleData.full_name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-bold text-[#0F172A] dark:text-white">{googleData.full_name}</div>
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">{googleData.email}</div>
          </div>
          <div className="ml-auto">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 opacity-50" />
          </div>
        </div>

        {/* Choix du rôle */}
        <div className="space-y-3 mb-8">
          <p className="text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-4">Je suis...</p>
          {ROLES.map(r => (
            <button key={r.value} onClick={() => setRole(r.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                role === r.value
                  ? `${r.color} border-opacity-100`
                  : 'border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-[#3A7D44]/30'
              }`}>
              <span className="text-3xl">{r.emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-sm text-[#0F172A] dark:text-white">{r.label}</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{r.desc}</div>
              </div>
              {role === r.value && <CheckCircle size={20} className="text-[#3A7D44] shrink-0" />}
            </button>
          ))}
        </div>

        <button onClick={handleComplete} disabled={loading || !role}
          className="w-full bg-[#3A7D44] hover:bg-[#2D6235] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(58,125,68,0.3)]">
          {loading
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <>Créer mon compte <ArrowRight size={18} /></>
          }
        </button>

        <p className="text-center text-xs text-[#94A3B8] mt-5">
          En créant un compte, vous acceptez nos{' '}
          <a href="/conditions" className="text-[#3A7D44] hover:underline font-medium">conditions d'utilisation</a>
        </p>
      </div>
    </div>
  );
}