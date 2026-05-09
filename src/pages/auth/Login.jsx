import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';
import Logo from '../../components/common/Logo';

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
      toast.error(error.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex">

      {/* Gauche — Visuel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2D3A8C] flex-col justify-between p-12 relative overflow-hidden">
        {/* Décorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8472A] rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full opacity-5 blur-3xl" />

        <Logo size="lg" white />

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-black text-white mb-4 leading-tight">
            Trouvez votre
            <span className="text-[#E8472A]"> maison idéale</span>
            <br />au Bénin
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Des milliers d'annonces vérifiées vous attendent.
          </p>

          {/* Stats */}
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
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-scale-in">

          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <h1 className="font-display text-3xl font-bold text-[#0F172A] mb-2">
            Bon retour ! 👋
          </h1>
          <p className="text-[#64748B] text-sm mb-8">
            Connectez-vous à votre compte Logezy
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">Adresse email</label>
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
              <label className="block text-sm font-medium text-[#334155] mb-2">Mot de passe</label>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#334155]">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Se connecter →'
              }
            </button>
          </form>

          {/* Compte test */}
          <div className="mt-6 p-4 bg-[#EEF0FB] rounded-xl border border-[#2D3A8C]/10">
            <p className="text-xs font-bold text-[#2D3A8C] mb-2">🧪 Compte admin de test :</p>
            <p className="text-xs text-[#64748B]">Email : <strong>admin@logezy.bj</strong></p>
            <p className="text-xs text-[#64748B]">Mot de passe : <strong>password</strong></p>
          </div>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-[#2D3A8C] font-bold hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}