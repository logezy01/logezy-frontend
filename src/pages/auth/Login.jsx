import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex">

      {/* Gauche — Visuel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#3A7D44] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
            alt="Maison"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#3A7D44]/90 to-[#2D6235]/90" />
        </div>

        <div className="relative z-10">
          <img src="/logo-dark.png" alt="Logezy" style={{ height: 50, width: 'auto' }} className="object-contain" />
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-black text-white mb-4 leading-tight">
            Trouvez votre
            <span className="block text-[#90EE90]">maison idéale</span>
            au Bénin
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Des milliers d'annonces vérifiées vous attendent.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '500+', label: 'Annonces' },
              { value: '12', label: 'Villes' },
              { value: '1000+', label: 'Utilisateurs' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <div className="font-display font-black text-2xl text-white">{s.value}</div>
                <div className="text-white/60 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-sm relative z-10">© 2026 Logezy 🇧🇯</p>
      </div>

      {/* Droite — Formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md animate-scale-in">

          {/* Logo avec effet flottant — mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-block animate-bounce">
              <img src="/logo-light.png" alt="Logezy"
                style={{ height: 80, width: 'auto' }}
                className="object-contain mx-auto" />
            </div>
            <h1 className="font-display text-4xl font-black text-[#3A7D44] mt-2">
              Logezy
            </h1>
            <p className="text-[#64748B] text-sm mt-1">Votre logement facile</p>
          </div>

          {/* Logo desktop */}
          <div className="hidden lg:block mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="inline-block"
                style={{
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <img src="/logo-light.png" alt="Logezy"
                  style={{ height: 60, width: 'auto' }}
                  className="object-contain" />
              </div>
            </div>
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
              }
            `}</style>
          </div>

          <h1 className="font-display text-3xl font-bold text-[#0F172A] mb-2">
            Bon retour ! 👋
          </h1>
          <p className="text-[#64748B] text-sm mb-8">
            Connectez-vous à votre compte Logezy
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Se connecter →'}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8]">ou</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Google (bientôt) */}
          <button
            onClick={() => toast.error('Connexion Google bientôt disponible !')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-btn border-2 border-[#E2E8F0] hover:border-[#3A7D44] hover:bg-[#EBF5ED] transition-all text-sm font-medium text-[#334155]"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continuer avec Google
          </button>

          <p className="text-center text-sm text-[#64748B] mt-6">
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