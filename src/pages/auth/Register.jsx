import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import { supabase } from '../../lib/supabase';

const ROLES = [
  { value: 'locataire', emoji: '🔍', label: 'Locataire / Acheteur', desc: 'Je cherche une maison', color: 'border-[#3B82F6] bg-[#EFF6FF]' },
  { value: 'proprietaire', emoji: '🏠', label: 'Propriétaire', desc: 'Je publie mes biens', color: 'border-[#3A7D44] bg-[#EBF5ED]' },
  { value: 'agent', emoji: '🤝', label: 'Agent immobilier', desc: 'Je gère plusieurs biens', color: 'border-[#F59E0B] bg-[#FEF3C7]' },
];

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) { toast.error('Choisissez un type de compte'); return; }
    if (form.password.length < 6) { toast.error('Mot de passe minimum 6 caractères'); return; }
    setLoading(true);
        try {
          const res = await api.post('/auth/register', form);
          toast.success('Code envoyé ! Vérifiez votre email 📧');
          navigate('/auth/verify-email', {
            state: {
              userId: res.data.userId,
              email: res.data.email,
            }
          });
        } catch (error) {
          toast.error(error.response?.data?.error || 'Erreur création compte');
        } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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

      {/* Gauche */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
            alt="Maison" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/95 via-[#0F172A]/80 to-[#3A7D44]/30" />
        </div>

        <div className="relative z-10">
          <img src="/logo-dark.png" alt="Logezy" style={{ height: 44, width: 'auto' }} className="object-contain" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-white/70 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse" />
            Rejoignez la communauté
          </div>
          <h2 className="font-display text-4xl font-black text-white mb-4 leading-tight">
            La référence
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#81C784]">
              immobilière
            </span>
            au Bénin
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Que vous cherchiez, louiez ou vendiez, Logezy est votre partenaire de confiance.
          </p>
          <div className="space-y-3">
            {ROLES.map(role => (
              <div key={role.value} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="text-xl">{role.emoji}</span>
                <div>
                  <div className="font-bold text-sm text-white">{role.label}</div>
                  <div className="text-white/40 text-xs">{role.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs relative z-10">© 2026 Logezy — Made in Bénin 🇧🇯</p>
      </div>

      {/* Droite */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-[#0F172A] overflow-y-auto">
        <div className="w-full max-w-lg py-8 animate-scale-in">

          <div className="lg:hidden text-center mb-8">
            <img src="/logo-light.png" alt="Logezy"
              style={{ height: 48, width: 'auto' }}
              className="object-contain mx-auto" />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-black text-[#0F172A] dark:text-white mb-2">
              Créer un compte 🎉
            </h1>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              Rejoignez Logezy gratuitement
            </p>
          </div>

          {/* Google */}
          <button onClick={handleGoogleRegister} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] hover:border-[#3A7D44] hover:bg-[#EBF5ED] dark:hover:bg-[#2A2A2A] transition-all text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-6 group">
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-[#3A7D44] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continuer avec Google
                <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#E8E8E8] dark:bg-[#2A2A2A]" />
            <span className="text-xs text-[#94A3B8] font-medium">ou avec email</span>
            <div className="flex-1 h-px bg-[#E8E8E8] dark:bg-[#2A2A2A]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Rôle */}
            <div>
              <label className="block text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-3">
                Je suis...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(role => (
                  <button key={role.value} type="button"
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-center ${
                      form.role === role.value
                        ? `${role.color} border-opacity-100`
                        : 'border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-[#3A7D44]/30'
                    }`}>
                    <span className="text-2xl">{role.emoji}</span>
                    <div>
                      <div className="font-bold text-xs text-[#0F172A] dark:text-white leading-tight">{role.label}</div>
                    </div>
                    {form.role === role.value && (
                      <CheckCircle size={14} className="text-[#3A7D44]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Nom + Téléphone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-2">Nom complet</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input type="text" placeholder="Jean Dupont" value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-white text-sm outline-none focus:border-[#3A7D44] transition-colors placeholder:text-[#C0C0C0]"
                    required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-2">
                  Téléphone <span className="text-[#94A3B8] font-normal text-xs">(optionnel)</span>
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input type="tel" placeholder="+229 97 00 00 00" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-white text-sm outline-none focus:border-[#3A7D44] transition-colors placeholder:text-[#C0C0C0]" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-2">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input type="email" placeholder="votre@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-white text-sm outline-none focus:border-[#3A7D44] transition-colors placeholder:text-[#C0C0C0]"
                  required />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-bold text-[#334155] dark:text-[#94A3B8] mb-2">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Minimum 6 caractères"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-2xl border-2 border-[#E8E8E8] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-white text-sm outline-none focus:border-[#3A7D44] transition-colors placeholder:text-[#C0C0C0]"
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
                : <>Créer mon compte <ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-[#64748B] dark:text-[#94A3B8] mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-[#3A7D44] font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}