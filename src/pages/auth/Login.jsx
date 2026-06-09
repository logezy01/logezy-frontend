import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      toast.success(`Bienvenue ${res.data.user.full_name} ! 👋`);
      switch (res.data.user.role) {
        case 'proprietaire': navigate('/dashboard/proprietaire'); break;
        case 'agent': navigate('/dashboard/agent'); break;
        case 'locataire': navigate('/dashboard/locataire'); break;
        case 'admin': navigate('/dashboard/admin'); break;
        default: navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (error) {
      toast.error('Erreur connexion Google');
      setGoogleLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Gauche — Visuel premium */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-[#0F172A]">
        {/* Image */}
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
            alt="Maison" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/95 via-[#0F172A]/80 to-[#3A7D44]/40" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <img src="/logo-dark.png" alt="Logezy" style={{ height: 44, width: 'auto' }} className="object-contain" />
        </div>

        {/* Contenu */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-white/70 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse" />
            🇧🇯 N°1 de l'immobilier au Bénin
          </div>
          <h2 className="font-display text-4xl font-black text-white mb-4 leading-tight">
            Trouvez votre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#81C784]">
              maison idéale
            </span>
            au Bénin
          </h2>
          <p className="text-white/50 text-base mb-10 leading-relaxed">
            Des milliers d'annonces vérifiées vous attendent.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: '500+', label: 'Annonces', emoji: '🏠' },
              { value: '12', label: 'Villes', emoji: '📍' },
              { value: '1000+', label: 'Utilisateurs', emoji: '👥' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-xl mb-1">{s.emoji}</div>
                <div className="font-display font-black text-xl text-white">{s.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs relative z-10">© 2026 Logezy — Made in Bénin 🇧🇯</p>
      </div>

      {/* Droite — Formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-[#0F172A] overflow-y-auto">
        <div className="w-full max-w-md animate-scale-in">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-10">
            <img src="/logo-light.png" alt="Logezy"
              style={{ height: 56, width: 'auto' }}
              className="object-contain mx-auto mb-3" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-black text-[#0F172A] dark:text-white mb-2">
              Bon retour 👋
            </h1>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              Connectez-vous à votre compte Logezy
            </p>
          </div>

          {/* Bouton Google premium */}
          <button onClick={handleGoogleLogin} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] hover:border-[#3A7D44] hover:bg-[#EBF5ED] dark:hover:bg-[#2A2A2A] transition-all text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-6 group">
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-[#3A7D44] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Continuer avec Google</span>
                <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </button>

          {/* Séparateur */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#E8E8E8] dark:bg-[#2A2A2A]" />
            <span className="text-xs text-[#94A3B8] font-medium">ou continuer avec email</span>
            <div className="flex-1 h-px bg-[#E8E8E8] dark:bg-[#2A2A2A]" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input type="email" placeholder="votre@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-white text-sm outline-none focus:border-[#3A7D44] transition-colors placeholder:text-[#C0C0C0]"
                  required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-white text-sm outline-none focus:border-[#3A7D44] transition-colors placeholder:text-[#C0C0C0]"
                  required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#3A7D44] hover:bg-[#2D6235] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(58,125,68,0.3)] hover:shadow-[0_8px_30px_rgba(58,125,68,0.4)]">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Se connecter <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] dark:text-[#94A3B8] mt-8">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-[#3A7D44] font-bold hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}