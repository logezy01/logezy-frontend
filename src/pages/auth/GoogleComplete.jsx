import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

const ROLES = [
  { value: 'locataire', emoji: '🔍', label: 'Locataire / Acheteur', desc: 'Je cherche une maison à louer ou à acheter' },
  { value: 'proprietaire', emoji: '🏠', label: 'Propriétaire', desc: 'Je veux publier mes biens immobiliers' },
  { value: 'agent', emoji: '🤝', label: 'Agent immobilier', desc: 'Je gère des biens pour plusieurs propriétaires' },
];

export default function GoogleComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  // Récupérer les données Google passées via navigation
  const googleData = location.state;

  if (!googleData) {
    navigate('/login');
    return null;
  }

  const handleComplete = async () => {
    if (!role) {
      toast.error('Veuillez choisir un type de compte');
      return;
    }

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
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-scale-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo-light.png" alt="Logezy"
            style={{ height: 60, width: 'auto' }}
            className="object-contain mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold text-[#0F172A]">
            Bienvenue sur Logezy ! 🎉
          </h1>
          <p className="text-[#64748B] text-sm mt-2">
            Dernière étape — choisissez votre type de compte
          </p>
        </div>

        {/* Infos Google */}
        <div className="card p-4 mb-6 flex items-center gap-3">
          {googleData.avatar_url ? (
            <img src={googleData.avatar_url} alt={googleData.full_name}
              className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-lg">
              {googleData.full_name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-bold text-sm text-[#0F172A]">{googleData.full_name}</div>
            <div className="text-xs text-[#64748B]">{googleData.email}</div>
            <div className="text-xs text-[#3A7D44] font-medium mt-0.5">✓ Connecté avec Google</div>
          </div>
        </div>

        {/* Choix du rôle */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-[#334155]">Je suis...</p>
          {ROLES.map(r => (
            <button key={r.value} onClick={() => setRole(r.value)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                role === r.value
                  ? 'border-[#3A7D44] bg-[#EBF5ED]'
                  : 'border-[#E2E8F0] bg-white hover:border-[#3A7D44]/30'
              }`}>
              <span className="text-2xl">{r.emoji}</span>
              <div>
                <div className="font-bold text-sm text-[#0F172A]">{r.label}</div>
                <div className="text-xs text-[#64748B]">{r.desc}</div>
              </div>
              {role === r.value && (
                <span className="ml-auto text-[#3A7D44] font-bold">✓</span>
              )}
            </button>
          ))}
        </div>

        <button onClick={handleComplete} disabled={loading || !role}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : 'Créer mon compte →'}
        </button>

        <p className="text-center text-xs text-[#94A3B8] mt-4">
          En créant un compte, vous acceptez nos{' '}
          <a href="/conditions" className="text-[#3A7D44] hover:underline">conditions d'utilisation</a>
        </p>
      </div>
    </div>
  );
}